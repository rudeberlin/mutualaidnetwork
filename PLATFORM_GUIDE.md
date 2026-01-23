# Mutual Aid Network - Complete Platform Guide

## 🚀 Project Overview

**Mutual Aid Network** is a complete, production-ready platform that enables users to help each other, earn returns, and build a community. The platform includes:

- ✅ User Registration with ID Verification (Front & Back)
- ✅ Multiple Payment Methods (Mobile Money, Credit Card, Bank Transfer, BTC)
- ✅ Membership Packages ($25, $100, $250, $500)
- ✅ User Dashboard with Earnings Tracking
- ✅ Matched Member Info Display
- ✅ Transaction History
- ✅ Complete Backend API
- ✅ File Upload System
- ✅ JWT Authentication
- ✅ Responsive Design

---

## 📁 Project Structure

```
payment-platform/
├── src/
│   ├── pages/
│   │   ├── HomePageNew.tsx          # Landing page
│   │   ├── RegisterPageNew.tsx       # Registration (2-step)
│   │   ├── LoginPage.tsx             # Login
│   │   ├── UserDashboardNew.tsx      # User dashboard
│   │   └── ...other pages
│   ├── components/
│   │   ├── PackagesGrid.tsx          # Package display
│   │   ├── Navbar.tsx                # Navigation
│   │   └── ...other components
│   ├── store/
│   │   └── index.ts                  # Zustand stores
│   ├── types/
│   │   └── index.ts                  # TypeScript types
│   ├── utils/
│   │   ├── mockData.ts               # Mock data
│   │   └── helpers.ts                # Helper functions
│   ├── App.tsx                       # Main app component
│   └── main.tsx                      # Entry point
├── backend/
│   ├── server.js                     # Express server
│   ├── package.json                  # Backend dependencies
│   ├── .env.example                  # Environment variables
│   ├── init-db.sh                    # Database setup script
│   └── netlify.toml                  # Deployment config
├── vercel.json                       # Frontend deployment config
├── package.json                      # Frontend dependencies
├── vite.config.ts                    # Vite configuration
└── tsconfig.json                     # TypeScript configuration
```

---

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (optional, for production)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Or for production
npm start
```

The backend will be available at `http://localhost:5000`

---

## 📋 Features

### 1. Registration Page (2-Step Process)

**Step 1: Account Details**
- Full Name
- Username (3+ characters)
- Email (validated)
- Phone Number
- Country (dropdown, all countries)
- Password (min 6 characters)
- Confirm Password
- Terms & Conditions checkbox

**Step 2: ID Verification**
- Upload ID Front (JPG/PNG, max 5MB)
- Upload ID Back (JPG/PNG, max 5MB)
- Image preview
- Validation feedback

### 2. Packages Display

Four membership packages available:

| Package | Amount | Return | Duration |
|---------|--------|--------|----------|
| Basic   | $25    | 30%    | 3 days   |
| Bronze  | $100   | 30%    | 5 days   |
| Silver  | $250   | 50%    | 15 days  |
| Gold    | $500   | 50%    | 15 days  |

Features:
- Smooth hover effects
- Select Package / Give Help buttons
- Responsive grid layout
- "Best Value" badge on Gold

### 3. User Dashboard

**Stats Section:**
- Total Earnings (USD)
- ID Verification Status
- Payment Method Status
- Active Package

**Payment Methods:**
- Mobile Money
- Credit Card
- Bank Transfer
- Bitcoin

**Matched Member Display:**
- Member Name
- Payment Method Type
- Masked Account Number
- Help Amount

**Recent Transactions:**
- Transaction Type (DEPOSIT, HELP_GIVEN, HELP_RECEIVED, WITHDRAWAL)
- Description
- Amount
- Status (PENDING, COMPLETED, FAILED)
- Date

### 4. Authentication

- JWT-based authentication
- Secure password hashing (bcryptjs)
- Token expiration (7 days)
- Login validation

### 5. File Upload System

- Multer integration
- Image validation (JPG, PNG only)
- File size limit (5MB)
- Mock storage with file path tracking

---

## 🗄 Database Schema (PostgreSQL)

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE,
  full_name VARCHAR(255),
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20),
  country VARCHAR(100),
  password_hash VARCHAR(255),
  is_verified BOOLEAN,
  payment_method_verified BOOLEAN,
  total_earnings DECIMAL(10, 2),
  created_at TIMESTAMP
);
```

### Packages Table
```sql
CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  package_id VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  amount DECIMAL(10, 2),
  return_percentage INT,
  duration_days INT
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(255) UNIQUE,
  user_id VARCHAR(255),
  type VARCHAR(50),
  amount DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP
);
```

### Help Records Table
```sql
CREATE TABLE help_records (
  id SERIAL PRIMARY KEY,
  help_id VARCHAR(255) UNIQUE,
  giver_id VARCHAR(255),
  receiver_id VARCHAR(255),
  package_id VARCHAR(255),
  amount DECIMAL(10, 2),
  payment_method VARCHAR(50),
  status VARCHAR(50)
);
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - User registration with file upload
- `POST /api/login` - User login

### Users
- `GET /api/user/:id` - Get user profile
- `PUT /api/user/:id` - Update user info

### Packages
- `GET /api/packages` - Get all packages

### Transactions
- `GET /api/transactions/:userId` - Get user transactions
- `POST /api/transactions` - Create transaction

### Help
- `POST /api/help/request` - Create help request

### File Upload
- `POST /api/upload` - Upload file

---

## 🎨 Styling & Design

- **Framework:** Tailwind CSS
- **Icons:** Lucide React
- **Color Scheme:** Blue/Indigo gradient
- **Responsive:** Mobile-first design
- **Animations:** CSS transitions
- **Cards:** Smooth edges (rounded-lg/rounded-2xl)

---

## 🔐 Security Features

- ✅ JWT authentication with 7-day expiration
- ✅ Password hashing with bcryptjs
- ✅ File type validation
- ✅ File size limits (5MB max)
- ✅ CORS enabled
- ✅ Protected routes (authentication required)
- ✅ Input validation on all forms
- ✅ Error handling middleware

---

## 📤 Deployment

### Frontend Deployment (Vercel/Netlify)

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Netlify:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Environment variables needed:
```
VITE_API_URL=https://your-api-domain.com
```

### Backend Deployment (Render/Railway)

**Render:**
1. Push code to GitHub
2. Connect repository on Render.com
3. Select Node environment
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `JWT_SECRET`
   - `DATABASE_URL` (PostgreSQL)
   - `PORT=5000`

**Railway:**
1. Connect GitHub repository
2. Railway auto-detects Node.js
3. Add environment variables
4. Deploy automatically on push

### Database Setup (Supabase)

1. Create free Supabase project
2. Get connection string from Supabase dashboard
3. Run migration scripts:
   ```bash
   psql $DATABASE_URL < init-db.sh
   ```
4. Add to backend `.env`:
   ```
   DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
   ```

---

## 📊 State Management (Zustand)

### Auth Store
- `user` - Current user object
- `token` - JWT token
- `isAuthenticated` - Auth status
- Methods: `setUser()`, `setToken()`, `logout()`, `updateUser()`

### Transaction Store
- `transactions` - Array of transactions
- Methods: `addTransaction()`, `getTransactions()`

### Payment Store
- `paymentMethod` - Selected payment method
- Methods: `setPaymentMethod()`, `clearPaymentMethod()`, `isPaymentMethodVerified()`

### Help Store
- `matchedMember` - Matched member info
- Methods: `setMatchedMember()`, `clearMatchedMember()`

### UI Store
- `showPaymentMethodModal` - Modal visibility
- Methods: `setShowPaymentMethodModal()`, `setShowMatchedMemberModal()`

---

## 📱 Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

All components are mobile-responsive using Tailwind's responsive utilities.

---

## ✅ Testing Credentials

For testing without registration:

**Email:** test@example.com
**Password:** password123

Or register a new account with:
- Any email
- Username (3+ chars)
- Password (6+ chars)
- Upload any JPG/PNG files (< 5MB)

---

## 🚀 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/mutual_aid_network
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173
```

---

## 📞 Support

For issues, features, or questions:
1. Check the documentation
2. Review error messages in console
3. Check backend logs at `/api/health`

---

## 📄 License

MIT License - Feel free to use, modify, and distribute.

---

## 🎯 Future Enhancements

- [ ] Email verification
- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Wallet integration
- [ ] Referral program
- [ ] Admin panel improvements
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Real-time notifications

---

**Happy helping! 🤝**
