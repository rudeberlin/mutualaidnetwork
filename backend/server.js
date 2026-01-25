import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import pool, { initializeDatabase } from './database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_URL = process.env.CLIENT_URL || `http://localhost:${PORT}`;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5000',
  'https://mutualaidnetwork.vercel.app',
  'https://mutualaidnetwork.onrender.com'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins in production for now
    }
  },
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

    // Check if user exists (email/username)
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email or username already registered' });
    }

    // Check if phone already registered
    const existingPhone = await pool.query('SELECT id FROM users WHERE phone_number = $1', [phoneNumber]);
    if (existingPhone.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Phone number already registered' });
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Generate unique referral code for new user
    const userReferralCode = `MAN${Math.floor(1000 + Math.random() * 9000)}`;

    // Create user
    const userId = `user-${Date.now()}`;
    const profilePhoto = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    // Store file paths - accessible via /uploads endpoint
    const idFrontPath = req.files?.idFront ? `/uploads/${req.files.idFront[0].filename}` : null;
    const idBackPath = req.files?.idBack ? `/uploads/${req.files.idBack[0].filename}` : null;

    console.log('ID Upload - Front:', idFrontPath, 'Back:', idBackPath);

    const result = await pool.query(`
      INSERT INTO users (
        id, full_name, username, email, phone_number, country, referral_code, 
        my_referral_code, password_hash, profile_photo, role, 
        id_front_image, id_back_image, id_verified, is_verified, 
        payment_method_verified, total_earnings
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id, user_number, display_id, full_name, username, email, phone_number, country, my_referral_code, profile_photo, role, is_verified, payment_method_verified, total_earnings, created_at
    `, [
      userId, fullName, username, email, phoneNumber, country, referralCode || null,
      userReferralCode, hashedPassword, profilePhoto, 'member',
      idFrontPath,
      idBackPath,
      false, false, false, 0
    ]);

    const token = generateToken(userId);
    
    // Get the new user
    let newUser = result.rows[0];
    
    // Generate and update display_id if not set
    if (!newUser.display_id && newUser.user_number) {
      const displayId = 'MAN-' + String(newUser.user_number).padStart(6, '0');
      await pool.query('UPDATE users SET display_id = $1 WHERE id = $2', [displayId, userId]);
      newUser.display_id = displayId;
    }
    
    // Transform user object to camelCase for frontend
    const userResponse = {
      id: newUser.id,
      userNumber: newUser.user_number,
      displayId: newUser.display_id,
      fullName: newUser.full_name,
      username: newUser.username,
      email: newUser.email,
      phoneNumber: newUser.phone_number,
      country: newUser.country,
      referralCode: newUser.referral_code,
      myReferralCode: newUser.my_referral_code,
      profilePhoto: newUser.profile_photo,
      role: newUser.role,
      idDocuments: {
        frontImage: idFrontPath ? `${API_URL}${idFrontPath}` : '',
        backImage: idBackPath ? `${API_URL}${idBackPath}` : '',
        uploadedAt: newUser.created_at,
        verified: false
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
      userNumber: user.user_number,
      displayId: user.display_id,
      fullName: user.full_name,
      username: user.username,
      email: user.email,
      phoneNumber: user.phone_number,
      country: user.country,
      referralCode: user.referral_code,
      myReferralCode: user.my_referral_code,
      profilePhoto: user.profile_photo,
      role: user.role,
      idDocuments: {
        frontImage: user.id_front_image ? `${API_URL}${user.id_front_image}` : '',
        backImage: user.id_back_image ? `${API_URL}${user.id_back_image}` : '',
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

// PUT update user profile
app.put('/api/user/:id', authenticateToken, async (req, res) => {
  try {
    // Only allow users to update their own profile, or admins to update any profile
    if (req.userId !== req.params.id) {
      const adminResult = await pool.query('SELECT role FROM users WHERE id = $1', [req.userId]);
      if (adminResult.rows.length === 0 || adminResult.rows[0].role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }
    }

    const { fullName, email, phoneNumber, country } = req.body;

    // Validate input
    if (!fullName || !email || !phoneNumber) {
      return res.status(400).json({ success: false, error: 'Full name, email, and phone number are required' });
    }

    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, req.params.id]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Email already in use' });
      }
    }

    const result = await pool.query(`
      UPDATE users 
      SET full_name = $1, email = $2, phone_number = $3, country = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, full_name, username, email, phone_number, country, my_referral_code, profile_photo, role, is_verified, payment_method_verified, total_earnings, created_at, updated_at
    `, [fullName, email, phoneNumber, country || 'Unknown', req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST change user password
app.post('/api/user/:id/password', authenticateToken, async (req, res) => {
  try {
    // Only allow users to change their own password
    if (req.userId !== req.params.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, error: 'All password fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
    }

    // Get current password hash
    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.params.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const passwordHash = userResult.rows[0].password_hash;

    // Verify old password
    const passwordMatch = await bcryptjs.compare(oldPassword, passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcryptjs.hash(newPassword, 10);

    // Update password
    await pool.query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newPasswordHash, req.params.id]);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET user dashboard stats
app.get('/api/user/:userId/stats', authenticateToken, async (req, res) => {
  try {
    if (req.userId !== req.params.userId && req.userRole !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const userId = req.params.userId;

    // Get user info including registration date
    const userResult = await pool.query(
      'SELECT created_at, total_earnings FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Calculate days since registration
    const registrationDate = new Date(user.created_at);
    const today = new Date();
    const daysSinceRegistration = Math.floor((today - registrationDate) / (1000 * 60 * 60 * 24));

    // Count active packages (help activities with 'pending' or 'active' status)
        const activePackagesResult = await pool.query(
          `SELECT COUNT(DISTINCT package_id) as count 
           FROM help_activities 
           WHERE giver_id = $1 AND status IN ('pending', 'active')`,
          [userId]
        );

        // Count help provided (number of times user has given help)
        const helpProvidedResult = await pool.query(
          `SELECT COUNT(*) as count 
           FROM help_activities 
           WHERE giver_id = $1`,
          [userId]
        );

        // Get active package details
        const activePackagesDetailsResult = await pool.query(
          `SELECT p.*, ha.created_at as subscribed_at, ha.status
           FROM help_activities ha
           JOIN packages p ON ha.package_id = p.id
           WHERE ha.giver_id = $1 AND ha.status IN ('pending', 'active')
           ORDER BY ha.created_at DESC`,
          [userId]
        );

        res.json({
          success: true,
          data: {
            totalEarnings: parseFloat(user.total_earnings || 0),
            activePackagesCount: parseInt(activePackagesResult.rows[0].count || 0),
            helpProvidedCount: parseInt(helpProvidedResult.rows[0].count || 0),
            daysSinceRegistration: daysSinceRegistration,
            registrationDate: registrationDate,
            activePackages: activePackagesDetailsResult.rows
          }
        });
      } catch (error) {
        console.error('Dashboard stats error:', error);
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

// Register user as offering help (giver)
app.post('/api/help/register-offer', authenticateToken, async (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.userId;

    if (!packageId) {
      return res.status(400).json({ success: false, error: 'Package ID required' });
    }

    // Check package exists
    const pkgResult = await pool.query('SELECT * FROM packages WHERE id = $1', [packageId]);
    if (pkgResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }
    const pkg = pkgResult.rows[0];

    // Check if user already has an active giver activity for this package
    const existing = await pool.query(`
      SELECT id FROM help_activities 
      WHERE giver_id = $1 AND package_id = $2 AND status IN ('pending', 'matched', 'active')
      LIMIT 1
    `, [userId, packageId]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Already registered to offer this package' });
    }

    // Create help activity as giver
    const activityId = uuidv4();
    const result = await pool.query(`
      INSERT INTO help_activities (id, giver_id, package_id, amount, status, created_at)
      VALUES ($1, $2, $3, $4, 'pending', CURRENT_TIMESTAMP)
      RETURNING id, giver_id, package_id, amount, status, created_at
    `, [activityId, userId, packageId, pkg.amount]);

    res.status(201).json({
      success: true,
      message: 'Registered as help provider successfully',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Register user as requesting help (receiver)
app.post('/api/help/register-receive', authenticateToken, async (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.userId;

    if (!packageId) {
      return res.status(400).json({ success: false, error: 'Package ID required' });
    }

    // Check if user has registered to offer help first
    const offerCheck = await pool.query(`
      SELECT id FROM help_activities 
      WHERE giver_id = $1 AND status IN ('pending', 'matched', 'active')
      LIMIT 1
    `, [userId]);

    if (offerCheck.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'You must offer help first before requesting help' });
    }

    // Check package exists
    const pkgResult = await pool.query('SELECT * FROM packages WHERE id = $1', [packageId]);
    if (pkgResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }
    const pkg = pkgResult.rows[0];

    // Check if user already has an active receiver activity
    const existing = await pool.query(`
      SELECT id FROM help_activities 
      WHERE receiver_id = $1 AND status IN ('pending', 'matched', 'active')
      LIMIT 1
    `, [userId]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'You already have an active help request' });
    }

    // Create help activity as receiver
    const activityId = uuidv4();
    const result = await pool.query(`
      INSERT INTO help_activities (id, receiver_id, package_id, amount, status, created_at)
      VALUES ($1, $2, $3, $4, 'pending', CURRENT_TIMESTAMP)
      RETURNING id, receiver_id, package_id, amount, status, created_at
    `, [activityId, userId, packageId, pkg.amount]);

    res.status(201).json({
      success: true,
      message: 'Help request registered successfully',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST help request (keep for backward compatibility)
app.post('/api/help/request', authenticateToken, async (req, res) => {
  try {
    const { giverId, receiverId, packageId, paymentMethod } = req.body;

    const pkgResult = await pool.query('SELECT * FROM packages WHERE id = $1', [packageId]);
    if (pkgResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }
    const pkg = pkgResult.rows[0];

    const activityId = uuidv4();
    const result = await pool.query(`
      INSERT INTO help_activities (id, giver_id, receiver_id, package_id, amount, payment_method, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'active')
      RETURNING *
    `, [activityId, giverId, receiverId, packageId, pkg.amount, paymentMethod]);

    res.status(201).json({
      success: true,
      message: 'Help request created successfully',
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
    const result = await pool.query(`
      SELECT id, full_name, username, email, phone_number, country, role, 
             is_verified, id_verified, payment_method_verified, total_earnings, 
             id_front_image, id_back_image, created_at, updated_at
      FROM users 
      ORDER BY created_at DESC`);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE admin user with cascade
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');

    const userId = req.params.id;

    // Check if user exists
    const userCheck = await client.query('SELECT id, role FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Prevent deletion of admin users
    if (userCheck.rows[0].role === 'admin') {
      await client.query('ROLLBACK');
      return res.status(403).json({ success: false, error: 'Cannot delete admin users' });
    }

    // Delete user's related data in order of foreign key dependencies
    // 1. Delete payment matches
    await client.query('DELETE FROM payment_matches WHERE giver_id = $1 OR receiver_id = $1', [userId]);

    // 2. Delete help activities
    await client.query('DELETE FROM help_activities WHERE giver_id = $1 OR receiver_id = $1', [userId]);

    // 3. Delete user packages
    await client.query('DELETE FROM user_packages WHERE user_id = $1', [userId]);

    // 4. Delete payment methods
    await client.query('DELETE FROM payment_methods WHERE user_id = $1', [userId]);

    // 5. Delete user payment accounts
    await client.query('DELETE FROM user_payment_accounts WHERE user_id = $1', [userId]);

    // 6. Delete transactions
    await client.query('DELETE FROM transactions WHERE user_id = $1', [userId]);

    // 7. Delete banned accounts records
    await client.query('DELETE FROM banned_accounts WHERE user_id = $1', [userId]);

    // 8. Delete the user
    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING id, full_name, email', [userId]);

    // Commit transaction
    await client.query('COMMIT');

    res.json({
      success: true,
      message: `User ${result.rows[0].full_name} (${result.rows[0].email}) deleted successfully`,
      data: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('User deletion error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
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

// Suspend user
app.post('/api/admin/suspend-user/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await pool.query(
      'UPDATE users SET is_verified = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, full_name, email, is_verified',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, message: 'User suspended successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reactivate user
app.post('/api/admin/reactivate-user/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await pool.query(
      'UPDATE users SET is_verified = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, full_name, email, is_verified',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, message: 'User reactivated successfully', data: result.rows[0] });
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

// ====== PAYMENT ACCOUNT MANAGEMENT ======
// Get all user payment accounts (giver + receiver views)
app.get('/api/admin/payment-accounts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const search = req.query.search ? `%${req.query.search.toLowerCase()}%` : null;
    const params = [];
    let whereClause = '';

    if (search) {
      whereClause = 'WHERE LOWER(u.full_name) LIKE $1 OR LOWER(u.email) LIKE $1';
      params.push(search);
    }

    const result = await pool.query(
      `SELECT u.id,
              u.full_name,
              u.email,
              u.phone_number,
              recv.account_name  AS receive_account_name,
              recv.account_number AS receive_account_number,
              recv.bank_name     AS receive_bank_name,
              COALESCE(recv.phone_number, u.phone_number) AS receive_phone_number,
              give.account_name  AS give_account_name,
              give.account_number AS give_account_number,
              give.bank_name     AS give_bank_name,
              COALESCE(give.phone_number, u.phone_number) AS give_phone_number
       FROM users u
       LEFT JOIN user_payment_accounts recv ON recv.user_id = u.id AND recv.mode = 'receive'
       LEFT JOIN user_payment_accounts give ON give.user_id = u.id AND give.mode = 'give'
       ${whereClause}
       ORDER BY u.full_name ASC`,
      params
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single user's payment accounts (both give/receive)
app.get('/api/admin/users/:userId/payment-accounts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id,
              u.full_name,
              u.email,
              u.phone_number,
              recv.account_name  AS receive_account_name,
              recv.account_number AS receive_account_number,
              recv.bank_name     AS receive_bank_name,
              COALESCE(recv.phone_number, u.phone_number) AS receive_phone_number,
              give.account_name  AS give_account_name,
              give.account_number AS give_account_number,
              give.bank_name     AS give_bank_name,
              COALESCE(give.phone_number, u.phone_number) AS give_phone_number
       FROM users u
       LEFT JOIN user_payment_accounts recv ON recv.user_id = u.id AND recv.mode = 'receive'
       LEFT JOIN user_payment_accounts give ON give.user_id = u.id AND give.mode = 'give'
       WHERE u.id = $1`,
      [req.params.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upsert payment account for a specific role
app.post('/api/admin/payment-accounts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId, mode, accountName, accountNumber, bankName, phoneNumber } = req.body;

    if (!userId || !mode || !accountName || !accountNumber || !bankName) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const normalizedMode = mode === 'receive' ? 'receive' : 'give';

    const result = await pool.query(
      `INSERT INTO user_payment_accounts (user_id, mode, account_name, account_number, bank_name, phone_number, updated_by, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, mode) DO UPDATE
       SET account_name = EXCLUDED.account_name,
           account_number = EXCLUDED.account_number,
           bank_name = EXCLUDED.bank_name,
           phone_number = EXCLUDED.phone_number,
           updated_by = EXCLUDED.updated_by,
           updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, normalizedMode, accountName, accountNumber, bankName, phoneNumber || null, req.userId]
    );

    res.json({ success: true, data: result.rows[0] });
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

// ====== USER PACKAGE MANAGEMENT ======
// Get all user packages
app.get('/api/admin/user-packages', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT up.*, u.full_name, u.email, p.name as package_name, p.amount, p.return_percentage
      FROM user_packages up
      JOIN users u ON up.user_id = u.id
      JOIN packages p ON up.package_id = p.id
      ORDER BY up.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approve user package
app.post('/api/admin/user-packages/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { maturityDate } = req.body;
    const result = await pool.query(`
      UPDATE user_packages 
      SET admin_approved = true, status = 'active', maturity_date = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [maturityDate, req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reject user package
app.post('/api/admin/user-packages/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE user_packages 
      SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Extend maturity date
app.post('/api/admin/user-packages/:id/extend', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { newMaturityDate } = req.body;
    const result = await pool.query(`
      UPDATE user_packages 
      SET maturity_date = $1, extended_count = extended_count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [newMaturityDate, req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset user package
app.post('/api/admin/user-packages/:id/reset', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE user_packages 
      SET status = 'pending', admin_approved = false, maturity_date = NULL, extended_count = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ====== PAYMENT MATCHING SYSTEM ======
// Get users pending to receive help
app.get('/api/admin/pending-receivers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get users REQUESTING to receive help - these have receiver_id set, giver_id NULL, and no match yet
    const result = await pool.query(`
      SELECT DISTINCT ON (u.id) u.id, u.full_name, u.email, u.phone_number, 
             p.name as package_name, ha.amount, ha.created_at, ha.id as activity_id
      FROM help_activities ha
      JOIN users u ON ha.receiver_id = u.id
      JOIN packages p ON ha.package_id = p.id
      WHERE ha.status = 'pending' AND ha.receiver_id IS NOT NULL AND ha.giver_id IS NULL
      ORDER BY u.id, ha.created_at ASC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get users available to give help
app.get('/api/admin/available-givers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get users who OFFERED to give help (have giver_id set, no receiver matched yet)
    const result = await pool.query(`
      SELECT DISTINCT ON (u.id) u.id, u.full_name, u.email, u.phone_number, u.total_earnings
      FROM users u
      JOIN help_activities ha ON u.id = ha.giver_id
      WHERE ha.status = 'pending' AND ha.giver_id IS NOT NULL AND ha.receiver_id IS NULL
      AND u.role = 'member'
      ORDER BY u.id, ha.created_at ASC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create payment match
app.post('/api/admin/create-match', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { giverId, receiverId, helpActivityId, amount } = req.body;
    
    // Set payment deadline to 6 hours from now
    const paymentDeadline = new Date();
    paymentDeadline.setHours(paymentDeadline.getHours() + 6);
    
    // Create match record
    const matchResult = await pool.query(`
      INSERT INTO payment_matches (giver_id, receiver_id, help_activity_id, amount, payment_deadline, matched_by, status, admin_approved)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending', true)
      RETURNING *
    `, [giverId, receiverId, helpActivityId, amount, paymentDeadline, req.userId]);
    
    // Update help activity - set both giver_id and receiver_id, mark as matched
    await pool.query(`
      UPDATE help_activities 
      SET giver_id = $1, receiver_id = $2, status = 'matched', matched_at = CURRENT_TIMESTAMP, payment_deadline = $3, admin_approved = true
      WHERE id = $4
    `, [giverId, receiverId, paymentDeadline, helpActivityId]);

    // Also ensure the matching giver activity and receiver activity are linked
    res.json({ success: true, data: matchResult.rows[0], message: 'Match created and saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create manual payment match
app.post('/api/admin/create-manual-match', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      username, role, amount,
      matchedWithName, matchedWithEmail, matchedWithPhone, 
      paymentAccount, paymentMethod 
    } = req.body;
    
    // Validate required fields
    if (!username || !amount || !matchedWithName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username, amount, and matched user name are required' 
      });
    }

    // Look up user by username or display_id
    const userResult = await pool.query(
      'SELECT id, user_number, display_id, full_name, email, phone_number FROM users WHERE username = $1 OR display_id = $1 OR user_number = $2',
      [username, parseInt(username) || null]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `User '${username}' not found in system`
      });
    }

    const userId = userResult.rows[0].id;

    // Set payment deadline to 6 hours from now
    const paymentDeadline = new Date();
    paymentDeadline.setHours(paymentDeadline.getHours() + 6);
    
    // Create a help activity for tracking
    const activityId = uuidv4();
    const helpActivityResult = await pool.query(`
      INSERT INTO help_activities (
        id, ${role === 'receiver' ? 'receiver_id' : 'giver_id'}, 
        amount, status, payment_method, payment_deadline, admin_approved, 
        matched_at, manual_entry, matched_with_name, matched_with_email, 
        matched_with_phone, payment_account
      )
      VALUES ($1, $2, $3, 'matched', $4, $5, true, CURRENT_TIMESTAMP, true, $6, $7, $8, $9)
      RETURNING *
    `, [
      activityId, userId, amount, paymentMethod || 'Manual Entry',
      paymentDeadline, matchedWithName, matchedWithEmail || '',
      matchedWithPhone || '', paymentAccount || ''
    ]);

    res.json({ 
      success: true, 
      data: helpActivityResult.rows[0],
      message: 'Manual payment match created successfully' 
    });
  } catch (error) {
    console.error('Manual match creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get payment matches
app.get('/api/admin/payment-matches', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pm.*, 
             g.full_name as giver_name, g.email as giver_email, g.phone_number as giver_phone,
             r.full_name as receiver_name, r.email as receiver_email, r.phone_number as receiver_phone,
             ha.amount
      FROM payment_matches pm
      JOIN users g ON pm.giver_id = g.id
      JOIN users r ON pm.receiver_id = r.id
      JOIN help_activities ha ON pm.help_activity_id = ha.id
      ORDER BY pm.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Confirm payment completion
app.post('/api/admin/payment-matches/:id/confirm', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE payment_matches 
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }
    
    // Update help activity status
    await pool.query(`
      UPDATE help_activities 
      SET status = 'completed'
      WHERE id = $1
    `, [result.rows[0].help_activity_id]);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ban user for payment default
app.post('/api/admin/ban-user', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId, reason } = req.body;
    
    const result = await pool.query(`
      INSERT INTO banned_accounts (user_id, reason, banned_by)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [userId, reason, req.userId]);
    
    // Update user status
    await pool.query(`
      UPDATE users SET is_verified = false WHERE id = $1
    `, [userId]);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get banned accounts
app.get('/api/admin/banned-accounts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ba.*, u.full_name, u.email, u.phone_number
      FROM banned_accounts ba
      JOIN users u ON ba.user_id = u.id
      WHERE ba.is_active = true
      ORDER BY ba.banned_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Unban user
app.post('/api/admin/unban-user/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE banned_accounts 
      SET is_active = false, unbanned_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Ban record not found' });
    }
    
    // Reactivate user
    await pool.query(`
      UPDATE users SET is_verified = true WHERE id = $1
    `, [result.rows[0].user_id]);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ====== USER ENDPOINTS FOR MATCHING ======
// Get user's matched payment details
app.get('/api/user/:userId/payment-match', authenticateToken, async (req, res) => {
  try {
    if (req.userId !== req.params.userId && req.userRole !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const buildMatchPayload = (row) => ({
      id: row.id,
      amount: row.amount,
      payment_deadline: row.payment_deadline,
      status: row.status,
      created_at: row.created_at,
      matched_user: {
        full_name: row.counterparty_name,
        phone_number: row.counterparty_phone,
        account_name: row.account_name,
        account_number: row.account_number,
        bank_name: row.bank_name
      }
    });

    // Check if user is a giver (needs receiver's payout info)
    const giverMatch = await pool.query(
      `SELECT pm.*, 
              r.full_name AS counterparty_name,
              COALESCE(recv.phone_number, r.phone_number) AS counterparty_phone,
              recv.account_name,
              recv.account_number,
              recv.bank_name
       FROM payment_matches pm
       JOIN users r ON pm.receiver_id = r.id
       LEFT JOIN user_payment_accounts recv ON recv.user_id = r.id AND recv.mode = 'receive'
       WHERE pm.giver_id = $1 AND pm.status IN ('pending', 'awaiting_confirmation')
       ORDER BY pm.created_at DESC
       LIMIT 1`,
      [req.params.userId]
    );

    if (giverMatch.rows.length > 0) {
      return res.json({
        success: true,
        data: {
          role: 'giver',
          match: buildMatchPayload(giverMatch.rows[0])
        }
      });
    }

    // Check if user is a receiver (should only see giver info)
    const receiverMatch = await pool.query(
      `SELECT pm.*, 
              g.full_name AS counterparty_name,
              COALESCE(give.phone_number, g.phone_number) AS counterparty_phone,
              give.account_name,
              give.account_number,
              give.bank_name
       FROM payment_matches pm
       JOIN users g ON pm.giver_id = g.id
       LEFT JOIN user_payment_accounts give ON give.user_id = g.id AND give.mode = 'give'
       WHERE pm.receiver_id = $1 AND pm.status IN ('pending', 'awaiting_confirmation')
       ORDER BY pm.created_at DESC
       LIMIT 1`,
      [req.params.userId]
    );

    if (receiverMatch.rows.length > 0) {
      return res.json({
        success: true,
        data: {
          role: 'receiver',
          match: buildMatchPayload(receiverMatch.rows[0])
        }
      });
    }

    // Check for manual entry matches in help_activities
    const manualMatch = await pool.query(
      `SELECT ha.id, ha.amount, ha.payment_deadline, ha.status, ha.created_at,
              ha.matched_with_name AS counterparty_name,
              ha.matched_with_phone AS counterparty_phone,
              ha.payment_account,
              ha.matched_with_email,
              CASE 
                WHEN ha.giver_id = $1 THEN 'giver'
                WHEN ha.receiver_id = $1 THEN 'receiver'
              END AS user_role
       FROM help_activities ha
       WHERE (ha.giver_id = $1 OR ha.receiver_id = $1)
         AND ha.manual_entry = true
         AND ha.status IN ('matched', 'pending', 'active')
       ORDER BY ha.created_at DESC
       LIMIT 1`,
      [req.params.userId]
    );

    if (manualMatch.rows.length > 0) {
      const row = manualMatch.rows[0];
      return res.json({
        success: true,
        data: {
          role: row.user_role,
          match: {
            id: row.id,
            amount: row.amount,
            payment_deadline: row.payment_deadline,
            status: row.status,
            created_at: row.created_at,
            matched_user: {
              full_name: row.counterparty_name,
              phone_number: row.counterparty_phone,
              email: row.matched_with_email,
              account_number: row.payment_account || '',
              account_name: row.counterparty_name || '',
              bank_name: 'Manual Entry'
            }
          }
        }
      });
    }

    res.json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User confirms payment sent/received
app.post('/api/user/payment-confirm', authenticateToken, async (req, res) => {
  try {
    const { matchId } = req.body;

    if (!matchId) {
      return res.status(400).json({ success: false, error: 'Match ID is required' });
    }

    // First, try to update payment_matches table (integer ID)
    let result = await pool.query(
      `UPDATE payment_matches 
       SET status = 'awaiting_confirmation' 
       WHERE id = $1 
       AND (giver_id = $2 OR receiver_id = $2)
       RETURNING *`,
      [matchId, req.userId]
    );

    if (result.rows.length > 0) {
      return res.json({ 
        success: true, 
        message: 'Payment confirmation submitted. Admin will verify.',
        data: result.rows[0] 
      });
    }

    // If not found in payment_matches, try help_activities table (UUID ID)
    result = await pool.query(
      `UPDATE help_activities 
       SET status = 'awaiting_confirmation' 
       WHERE id = $1 
       AND (giver_id = $2 OR receiver_id = $2)
       RETURNING *`,
      [matchId, req.userId]
    );

    if (result.rows.length > 0) {
      return res.json({ 
        success: true, 
        message: 'Payment confirmation submitted. Admin will verify.',
        data: result.rows[0] 
      });
    }

    res.status(404).json({ success: false, error: 'Match not found or unauthorized' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User confirms payment sent
app.post('/api/user/confirm-payment-sent', authenticateToken, async (req, res) => {
  try {
    const { matchId } = req.body;
    
    if (!matchId) {
      return res.status(400).json({ success: false, error: 'Match ID is required' });
    }

    // First, try to update payment_matches table (integer ID)
    let result = await pool.query(`
      UPDATE payment_matches 
      SET status = 'awaiting_confirmation'
      WHERE id = $1 AND giver_id = $2
      RETURNING *
    `, [matchId, req.userId]);
    
    if (result.rows.length > 0) {
      return res.json({ success: true, data: result.rows[0] });
    }

    // If not found in payment_matches, try help_activities table (UUID ID)
    result = await pool.query(`
      UPDATE help_activities 
      SET status = 'awaiting_confirmation'
      WHERE id = $1 AND giver_id = $2
      RETURNING *
    `, [matchId, req.userId]);
    
    if (result.rows.length > 0) {
      return res.json({ success: true, data: result.rows[0] });
    }

    // Match not found in either table
    res.status(404).json({ success: false, error: 'Match not found' });
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
    
    // Run auto-migration for manual match fields
    console.log('🔄 Checking for required columns...');
    await pool.query(`
      ALTER TABLE help_activities 
      ADD COLUMN IF NOT EXISTS manual_entry BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS matched_with_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS matched_with_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS matched_with_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS payment_account TEXT,
      ADD COLUMN IF NOT EXISTS payment_deadline TIMESTAMP,
      ADD COLUMN IF NOT EXISTS matched_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS admin_approved BOOLEAN DEFAULT FALSE;
    `);
    console.log('✅ Manual match columns verified');

    // Auto-migration for unique user ID fields
    console.log('🔄 Checking for unique user ID fields...');
    try {
      // Add user_number SERIAL if not exists
      const userNumberCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'user_number'
      `);
      
      if (userNumberCheck.rows.length === 0) {
        // Create sequence for user_number if not exists
        await pool.query(`
          CREATE SEQUENCE IF NOT EXISTS users_user_number_seq;
          ALTER TABLE users 
          ADD COLUMN user_number INTEGER UNIQUE DEFAULT nextval('users_user_number_seq');
        `);
        console.log('✅ User number field added');
      }

      // Add display_id if not exists
      const displayIdCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'display_id'
      `);
      
      if (displayIdCheck.rows.length === 0) {
        await pool.query(`
          ALTER TABLE users 
          ADD COLUMN display_id VARCHAR(20) UNIQUE;
        `);
        
        // Populate display_ids for existing users with user_numbers
        await pool.query(`
          UPDATE users SET display_id = 'MAN-' || LPAD(user_number::text, 6, '0') 
          WHERE display_id IS NULL AND user_number IS NOT NULL
        `);
        console.log('✅ Display ID field added and populated');
      }
    } catch (migrationError) {
      if (migrationError.message.includes('already exists')) {
        console.log('✅ User ID fields already exist');
      } else {
        console.error('⚠️  User ID migration issue:', migrationError.message);
      }
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
});
