import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool, { initializeDatabase } from './database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Storage for uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static('uploads'));

// JWT helpers
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '10m' }); // 10 minutes
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ success: false, error: 'Session expired. Please login again.' });
  }

  req.userId = verified.userId;
  next();
};

// Admin middleware
const requireAdmin = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [req.userId]);
    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG files are allowed'));
    }
  },
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// GET all packages
app.get('/api/packages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM packages WHERE active = true ORDER BY amount ASC');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST register
app.post('/api/register', upload.fields([{ name: 'idFront' }, { name: 'idBack' }]), async (req, res) => {
  try {
    const { fullName, username, email, phoneNumber, country, password, confirmPassword, referralCode } =
      req.body;

    // Validation
    if (!fullName || !username || !email || !phoneNumber || !country || !password) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match' });
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email or username already registered' });
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Generate unique referral code for new user
    const userReferralCode = `MAN${Math.floor(1000 + Math.random() * 9000)}`;

    // Create user
    const userId = `user-${Date.now()}`;
    const profilePhoto = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const result = await pool.query(`
      INSERT INTO users (
        id, full_name, username, email, phone_number, country, referral_code, 
        my_referral_code, password_hash, profile_photo, role, 
        id_front_image, id_back_image, id_verified, is_verified, 
        payment_method_verified, total_earnings
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id, full_name, username, email, phone_number, country, my_referral_code, profile_photo, role, is_verified, payment_method_verified, total_earnings, created_at
    `, [
      userId, fullName, username, email, phoneNumber, country, referralCode || null,
      userReferralCode, hashedPassword, profilePhoto, 'member',
      req.files?.idFront ? `/uploads/${req.files.idFront[0].filename}` : null,
      req.files?.idBack ? `/uploads/${req.files.idBack[0].filename}` : null,
      false, false, false, 0
    ]);

    const token = generateToken(userId);
    
    // Transform user object to camelCase for frontend
    const newUser = result.rows[0];
    const userResponse = {
      id: newUser.id,
      fullName: newUser.full_name,
      username: newUser.username,
      email: newUser.email,
      phoneNumber: newUser.phone_number,
      country: newUser.country,
      referralCode: newUser.referral_code,
      profilePhoto: newUser.profile_photo,
      role: newUser.role,
      idDocuments: {
        frontImage: newUser.id_front_image || '',
        backImage: newUser.id_back_image || '',
        uploadedAt: newUser.created_at,
        verified: newUser.id_verified || false
      },
      isVerified: newUser.is_verified,
      paymentMethodVerified: newUser.payment_method_verified,
      totalEarnings: parseFloat(newUser.total_earnings || 0),
      createdAt: newUser.created_at,
      updatedAt: newUser.updated_at || newUser.created_at
    };
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const passwordMatch = bcryptjs.compareSync(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    
    // Transform user object to camelCase for frontend
    const userResponse = {
      id: user.id,
      fullName: user.full_name,
      username: user.username,
      email: user.email,
      phoneNumber: user.phone_number,
      country: user.country,
      referralCode: user.referral_code,
      profilePhoto: user.profile_photo,
      role: user.role,
      idDocuments: {
        frontImage: user.id_front_image || '',
        backImage: user.id_back_image || '',
        uploadedAt: user.created_at,
        verified: user.id_verified
      },
      isVerified: user.is_verified,
      paymentMethodVerified: user.payment_method_verified,
      totalEarnings: parseFloat(user.total_earnings || 0),
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
    
    res.json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET user by ID
app.get('/api/user/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, full_name, username, email, phone_number, country, my_referral_code, profile_photo, role, is_verified, payment_method_verified, total_earnings, created_at FROM users WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET transactions for user
app.get('/api/transactions/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.userId !== req.params.userId && req.userRole !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }
    const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', [req.params.userId]);
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create transaction
app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { userId, type, amount, currency, description } = req.body;
    if (req.userId !== userId && req.userRole !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const result = await pool.query(`
      INSERT INTO transactions (user_id, type, amount, currency, status, description)
      VALUES ($1, $2, $3, $4, 'completed', $5)
      RETURNING *
    `, [userId, type, amount, currency || 'USD', description || '']);

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST help request
app.post('/api/help/request', authenticateToken, async (req, res) => {
  try {
    const { giverId, receiverId, packageId, paymentMethod } = req.body;

    const pkgResult = await pool.query('SELECT * FROM packages WHERE id = $1', [packageId]);
    if (pkgResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }
    const pkg = pkgResult.rows[0];

    const result = await pool.query(`
      INSERT INTO help_activities (giver_id, receiver_id, package_id, amount, payment_method, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *
    `, [giverId, receiverId, packageId, pkg.amount, paymentMethod]);

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
      message: 'Help request created successfully',
    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin routes
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, full_name, username, email, phone_number, country, role, is_verified, payment_method_verified, total_earnings, created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/verifications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, full_name as user_name, email, id_front_image, id_back_image, created_at as submitted_at 
      FROM users 
      WHERE is_verified = false AND id_front_image IS NOT NULL
      ORDER BY created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/verify-user/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('UPDATE users SET is_verified = true, id_verified = true WHERE id = $1 RETURNING id', [req.params.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, message: 'User verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/transactions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/payments', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payment_methods ORDER BY added_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/help-activities', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM help_activities ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/packages/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, amount, return_percentage, duration_days, description, active } = req.body;
    const result = await pool.query(`
      UPDATE packages 
      SET name = COALESCE($1, name), 
          amount = COALESCE($2, amount), 
          return_percentage = COALESCE($3, return_percentage),
          duration_days = COALESCE($4, duration_days),
          description = COALESCE($5, description),
          active = COALESCE($6, active)
      WHERE id = $7
      RETURNING *
    `, [name, amount, return_percentage, duration_days, description, active, req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve static files ONLY in monolithic deployment
// Comment this out if deploying frontend separately (e.g., Vercel)
if (process.env.SERVE_FRONTEND === 'true' && process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: error.message });
  }
  res.status(500).json({ success: false, error: error.message });
});

// Start server
app.listen(PORT, async () => {
  console.log(`✨ Mutual Aid Network Server running on http://localhost:${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS allowed origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  
  // Initialize database
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
});
