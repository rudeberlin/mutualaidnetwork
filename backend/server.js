import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Storage for uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static('uploads'));

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

// Mock database (in-memory storage)
const mockDatabase = {
  users: [],
  transactions: [],
  verifications: [],
  helpActivities: [],
  payments: [],
  packages: [
    { id: 'pkg-1', name: 'Basic', amount: 25, returnPercentage: 30, durationDays: 3, active: true, description: 'Perfect for beginners' },
    { id: 'pkg-2', name: 'Bronze', amount: 100, returnPercentage: 30, durationDays: 5, active: true, description: 'Great value package' },
    { id: 'pkg-3', name: 'Silver', amount: 250, returnPercentage: 50, durationDays: 15, active: true, description: 'Most popular choice' },
    { id: 'pkg-4', name: 'Gold', amount: 500, returnPercentage: 50, durationDays: 15, active: true, description: 'Premium package' },
  ],
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
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
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }

  req.userId = verified.userId;
  next();
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// GET all packages
app.get('/api/packages', (req, res) => {
  res.json({
    success: true,
    data: mockDatabase.packages,
  });
});

// POST register
app.post('/api/register', upload.fields([{ name: 'idFront' }, { name: 'idBack' }]), (req, res) => {
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
    if (mockDatabase.users.find((u) => u.email === email)) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Generate unique referral code for new user
    const userReferralCode = `MAN${Math.floor(1000 + Math.random() * 9000)}`;

    // Create user
    const newUser = {
      id: `user-${Date.now()}`,
      fullName,
      username,
      email,
      phoneNumber,
      country,
      passwordHash: hashedPassword,
      referralCode: referralCode || undefined,
      myReferralCode: userReferralCode,
      profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      role: 'member',
      idDocuments: {
        frontImage: req.files?.idFront
          ? `/uploads/${req.files.idFront[0].filename}`
          : null,
        backImage: req.files?.idBack
          ? `/uploads/${req.files.idBack[0].filename}`
          : null,
        uploadedAt: new Date(),
        verified: false,
      },
      isVerified: false,
      paymentMethodVerified: false,
      totalEarnings: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDatabase.users.push(newUser);

    const token = generateToken(newUser.id);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: { ...newUser, passwordHash: undefined },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST login
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const user = mockDatabase.users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const passwordMatch = bcryptjs.compareSync(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({
      success: true,
      data: {
        user: { ...user, passwordHash: undefined },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET user by ID
app.get('/api/user/:id', authenticateToken, (req, res) => {
  try {
    const user = mockDatabase.users.find((u) => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: { ...user, passwordHash: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET transactions for user
app.get('/api/transactions/:userId', authenticateToken, (req, res) => {
  try {
    const transactions = mockDatabase.transactions.filter((t) => t.userId === req.params.userId);
    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create transaction
app.post('/api/transactions', authenticateToken, (req, res) => {
  try {
    const { userId, type, amount, currency, description } = req.body;

    const transaction = {
      id: `txn-${Date.now()}`,
      userId,
      type,
      amount,
      currency,
      status: 'COMPLETED',
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDatabase.transactions.push(transaction);

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST help request
app.post('/api/help/request', authenticateToken, (req, res) => {
  try {
    const { giverId, receiverId, packageId, paymentMethod } = req.body;

    const pkg = mockDatabase.packages.find((p) => p.id === packageId);
    if (!pkg) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    const helpRecord = {
      id: `help-${Date.now()}`,
      giverId,
      receiverId,
      packageId,
      amount: pkg.amount,
      paymentMethod,
      status: 'ACTIVE',
      createdAt: new Date(),
    };

    res.status(201).json({
      success: true,
      message: 'Help request created successfully',
      data: helpRecord,
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

// Admin middleware
const requireAdmin = (req, res, next) => {
  const user = mockDatabase.users.find((u) => u.id === req.userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

// Admin routes
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  const users = mockDatabase.users.map(u => ({ ...u, passwordHash: undefined }));
  res.json({ success: true, data: users });
});

app.get('/api/admin/verifications', authenticateToken, requireAdmin, (req, res) => {
  const verifications = mockDatabase.users
    .filter(u => !u.isVerified && u.idDocuments?.frontImage)
    .map(u => ({
      id: `ver-${u.id}`,
      userId: u.id,
      userName: u.fullName,
      email: u.email,
      idFront: u.idDocuments.frontImage,
      idBack: u.idDocuments.backImage,
      submittedAt: u.idDocuments.uploadedAt,
      status: 'pending'
    }));
  res.json({ success: true, data: verifications });
});

app.post('/api/admin/verify-user/:userId', authenticateToken, requireAdmin, (req, res) => {
  const user = mockDatabase.users.find(u => u.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  user.isVerified = true;
  user.idDocuments.verified = true;
  res.json({ success: true, message: 'User verified successfully' });
});

app.get('/api/admin/transactions', authenticateToken, requireAdmin, (req, res) => {
  res.json({ success: true, data: mockDatabase.transactions });
});

app.get('/api/admin/payments', authenticateToken, requireAdmin, (req, res) => {
  res.json({ success: true, data: mockDatabase.payments });
});

app.get('/api/admin/help-activities', authenticateToken, requireAdmin, (req, res) => {
  res.json({ success: true, data: mockDatabase.helpActivities });
});

app.put('/api/admin/packages/:id', authenticateToken, requireAdmin, (req, res) => {
  const pkg = mockDatabase.packages.find(p => p.id === req.params.id);
  if (!pkg) {
    return res.status(404).json({ success: false, error: 'Package not found' });
  }
  Object.assign(pkg, req.body);
  res.json({ success: true, data: pkg });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
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
app.listen(PORT, () => {
  console.log(`✨ Mutual Aid Network Server running on http://localhost:${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
