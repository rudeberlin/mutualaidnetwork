# InvestPlatform - Complete Setup & Deployment Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Project Structure](#project-structure)
4. [Features & Components](#features--components)
5. [Backend Integration](#backend-integration)
6. [Deployment Guide](#deployment-guide)
7. [Admin Panel Setup](#admin-panel-setup)
8. [Security Considerations](#security-considerations)
9. [Troubleshooting](#troubleshooting)
10. [Support](#support)

---

## 🎯 Project Overview

**InvestPlatform** is a comprehensive peer-to-peer investment management system with:

- **Professional UI** with glassmorphism design
- **Responsive Design** (mobile, tablet, desktop)
- **User Management** system
- **Investment Tracking** with real-time timeline
- **Admin Dashboard** for platform management
- **Complete Documentation** and guides
- **Production-Ready** architecture

### Technology Stack

```
Frontend:
  - React 19.2 + TypeScript
  - Vite (build tool)
  - Tailwind CSS (styling)
  - React Router (navigation)
  - Zustand (state management)
  - Lucide React (icons)
  - date-fns (date utilities)

Build & Dev:
  - ESLint
  - PostCSS
  - Autoprefixer
  - Rolldown (bundler)
```

---

## ⚡ Quick Start

### 1. Prerequisites
```bash
# Required versions
Node.js 18+
npm 10+
```

### 2. Installation
```bash
# Clone or navigate to project directory
cd payment-platform

# Install dependencies
npm install --legacy-peer-deps
```

### 3. Development
```bash
# Start dev server
npm run dev

# Navigate to http://localhost:5173
```

### 4. Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy dist/ folder
```

### 5. Test Features

#### Demo Login
- **Email**: Any email (test@example.com)
- **Password**: Any 6+ character password

#### Navigation
- **Homepage**: `/` - Welcome & features
- **About**: `/about` - Plans & testimonials
- **Login**: `/login` - Authentication
- **Register**: `/register` - New user
- **Forgot Password**: `/forgot-password` - Recovery
- **Dashboard**: `/dashboard` - After login
- **Admin**: `/admin` - Admin panel

---

## 📁 Project Structure

### Directory Layout
```
payment-platform/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx      # Navigation + Footer
│   │   └── PlanCard.tsx    # Investment plan card
│   │
│   ├── pages/              # Page components (routes)
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── UserDashboard.tsx
│   │   └── AdminPanel.tsx
│   │
│   ├── store/              # Zustand state management
│   │   └── index.ts       # Auth, Investment, UI stores
│   │
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts       # Type definitions
│   │
│   ├── utils/              # Utilities & helpers
│   │   ├── helpers.ts     # Functions (format, validate, etc)
│   │   └── mockData.ts    # Demo data
│   │
│   ├── hooks/              # Custom React hooks (future)
│   │
│   ├── App.tsx             # Main app + routing
│   ├── App.css             # App styles
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind + custom classes
│
├── public/                 # Static assets
├── dist/                   # Production build (after build)
├── node_modules/           # Dependencies
├── README.md               # Project overview
├── DOCUMENTATION.md        # Full platform docs
├── ADMIN_PANEL_GUIDE.md   # Admin panel guide
├── GETTING_STARTED.md     # Quick start guide
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
├── tailwind.config.js      # Tailwind config
├── postcss.config.js       # PostCSS config
└── eslint.config.js        # ESLint config
```

---

## 🎨 Features & Components

### Public Pages

#### 1. Homepage (`/`)
- Hero section with value proposition
- Feature highlights (4 cards)
- Statistics display
- Quick plans preview
- Call-to-action buttons
- Demo login info

#### 2. About Page (`/about`)
- Platform features detail
- How it works (4-step process)
- Investment plans grid (4 plans)
- Testimonials section (4 reviews)
- Community stats
- CTA section

#### 3. Login Page (`/login`)
- Email input with icon
- Password input with show/hide toggle
- Remember me checkbox
- Forgot password link
- Registration link
- Error display
- Loading state

#### 4. Register Page (`/register`)
- Full name input
- Email input with validation
- Phone number input
- Password input with requirements
- Confirm password input
- Terms & Privacy checkbox
- Form validation
- Error messages

#### 5. Forgot Password (`/forgot-password`)
- Email input
- Recovery email sent confirmation
- Try another email option
- Back to login button

### User Dashboard (`/dashboard`)

#### New User State
```
Header:
  - User avatar
  - Full name
  - "No Active Plan" badge

Content:
  - Package selection grid
  - 4 investment plan cards
  - Each showing:
    - Plan name
    - Amount (GHS)
    - ROI percentage
    - Duration (days)
    - Benefits list
    - "Request Help" button
```

#### Active Investment State
```
Header:
  - User avatar + name
  - Current plan badge
  - VIP badge (if applicable)
  - "Request Help" & "Receive Help" buttons

Quick Stats:
  - Investment amount
  - Expected ROI
  - Days remaining
  - Status indicator

Investment Timeline:
  - Start date | Today | Due date
  - Progress bar with percentage
  - Compact horizontal layout

Matched Member Payment Window (if matched):
  - Member profile photo
  - Full name
  - Bank name
  - Account name
  - Account number (masked)
  - Amount to pay
  - Status badge (Pending/Paid)
  - "Mark as Paid" button

Transaction History:
  - Deposit/Withdrawal transactions
  - Amount and date
  - Status indicators
  - Icons (green deposit, red withdrawal)

Testimonials:
  - Community member reviews
  - Avatar, name, rating
  - Review text
  - Grid or carousel layout
```

### Admin Panel (`/admin`)

#### Dashboard Tab
- 4 Key Statistics (Users, Investments, Funds, Pending)
- Recent Users (5 latest)
- Investment Plans display

#### Users Tab
- Complete user table
- Name, email, phone, status, join date
- View action for each user
- Search and filter options

#### Investments Tab
- Investment cards grid
- User info and plan details
- Amount and ROI display
- View Details button

#### Fund Management Tab
- Fund allocation overview
- Progress bars for distribution
- Fund action buttons
- Deposit, Report, Settings
- Fund history table

#### Transactions Tab
- Complete transaction table
- ID, type, amount, status, date
- Filter options
- Export functionality

---

## 🔌 Backend Integration

### Current State
- Uses mock data from `src/utils/mockData.ts`
- Zustand for client-side state
- Ready for backend connection

### Integration Steps

#### 1. Create API Service
```typescript
// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

#### 2. Set Environment Variables
```env
# .env.local
VITE_API_URL=https://api.investplatform.com
VITE_API_TIMEOUT=30000
```

#### 3. Replace Mock Data in Components

**Before**:
```typescript
import { MOCK_USERS } from '../utils/mockData';
const users = MOCK_USERS;
```

**After**:
```typescript
import apiClient from '../services/api';

const [users, setUsers] = useState([]);

useEffect(() => {
  apiClient.get('/users')
    .then(res => setUsers(res.data))
    .catch(err => console.error(err));
}, []);
```

#### 4. Required API Endpoints

**Authentication**:
```
POST /auth/register    { email, password, fullName, phone }
POST /auth/login       { email, password }
POST /auth/logout      {}
POST /auth/forgot      { email }
POST /auth/reset       { token, newPassword }
```

**Users**:
```
GET  /users/:id
PUT  /users/:id        { profileData }
GET  /users/:id/dashboard
GET  /users/:id/investments
GET  /users/:id/transactions
```

**Investments**:
```
GET  /investments
GET  /investments/:id
POST /investments      { planId }
PUT  /investments/:id  { status }
GET  /investments/:id/timeline
```

**Plans**:
```
GET  /plans
GET  /plans/:id
```

**Admin**:
```
GET  /admin/stats
GET  /admin/users
GET  /admin/investments
GET  /admin/funds
GET  /admin/transactions
```

---

## 🚀 Deployment Guide

### Build for Production
```bash
# Create optimized production build
npm run build

# Output: dist/ folder
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
# Select "public" as output directory
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to AWS Amplify
```bash
# Install AWS Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Deploy
amplify publish
```

### Deploy to DigitalOcean
```bash
# Build
npm run build

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
EOF

# Deploy via App Platform
doctl apps create --spec app.yaml
```

### Deploy to Custom Server (Node.js)
```bash
# Build
npm run build

# Upload dist/ to server
# Install simple HTTP server globally
npm install -g serve

# Start server on production server
serve -s dist -l 3000
```

---

## 🛡️ Admin Panel Setup

### Access Admin Panel
1. Navigate to `/admin`
2. Login with admin credentials
3. Sidebar navigation for sections

### Admin Credentials (Backend Required)
```
Email: admin@investplatform.com
Password: [Set in backend during admin creation]
```

### Features

**Dashboard**: Overview of platform statistics
- Total users
- Active investments
- Funds under management
- Pending payments

**User Management**: View and manage all users
- Search and filter
- View user profiles
- Suspend/enable accounts
- View investment history

**Investment Tracking**: Monitor all investments
- Active investments
- Completed investments
- Timeline view
- ROI calculations

**Fund Management**: Control platform funds
- View fund allocation
- Set aside reserves
- Track fund movements
- Generate reports

**Transactions**: Complete transaction record
- Filter and search
- Transaction details
- Status tracking
- Export reports

### Creating Admin Accounts

Backend admin creation:
```sql
-- Create admin account
INSERT INTO users (
  id, email, password_hash, fullName, phone, 
  profilePhoto, role, createdAt
) VALUES (
  uuid_generate_v4(),
  'admin@investplatform.com',
  -- Use bcrypt to hash password
  '$2b$10$...',
  'Admin User',
  '+233 24 123 4567',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  'admin',
  NOW()
);
```

---

## 🔐 Security Considerations

### Frontend Security
- ✅ Input validation on all forms
- ✅ Password requirements (8+ chars)
- ✅ XSS protection via React
- ✅ Secure data masking
- ✅ CORS-ready

### Backend Security (Must Implement)
- [ ] HTTPS/TLS encryption
- [ ] Rate limiting on endpoints
- [ ] SQL injection prevention
- [ ] CSRF token validation
- [ ] Password hashing (bcrypt)
- [ ] JWT token expiration
- [ ] Refresh token rotation
- [ ] Database encryption
- [ ] Input sanitization
- [ ] API key management

### Data Protection
- [ ] PII encryption in database
- [ ] Audit logs for admin actions
- [ ] Activity logging
- [ ] Regular security audits
- [ ] Penetration testing
- [ ] Compliance checks (KYC, AML)

---

## 🐛 Troubleshooting

### Issue: Styles Not Loading
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install --legacy-peer-deps
npm run build
npm run dev
```

### Issue: Port Already in Use
```bash
# Change port in vite.config.ts
# Or kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5173 | xargs kill -9
```

### Issue: Module Not Found
```bash
# Check import paths
# Verify file exists
# Clear TypeScript cache
rm -rf tsconfig.tsbuildinfo

# Rebuild
npm run build
```

### Issue: State Not Persisting
```typescript
// Add localStorage persistence to stores
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({...}),
    { name: 'auth-store' }
  )
);
```

### Issue: CORS Errors
Backend `server.js` configuration:
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## 🔄 Development Workflow

### Daily Development
```bash
# Start dev server
npm run dev

# In another terminal (optional lint)
npm run lint

# Make changes
# Changes hot-reload automatically

# Test builds before committing
npm run build
```

### Adding New Features

1. **Create Component**:
```typescript
// src/components/YourComponent.tsx
export const YourComponent: React.FC = () => {
  return <div>Your Component</div>;
};
```

2. **Add Route** (if it's a page):
```typescript
// src/App.tsx
import { YourPage } from './pages/YourPage';

<Route path="/your-route" element={<YourPage />} />
```

3. **Update Store** (if needed):
```typescript
// src/store/index.ts
// Add new store or extend existing
```

4. **Test**:
```bash
npm run dev
# Navigate to new route/component
# Test functionality
```

5. **Build & Deploy**:
```bash
npm run build
# Deploy dist/ to server
```

---

## 📚 Documentation Files

- **README.md** - Project overview
- **DOCUMENTATION.md** - Complete technical reference
- **GETTING_STARTED.md** - Quick start guide
- **ADMIN_PANEL_GUIDE.md** - Admin features
- **SETUP_DEPLOYMENT.md** - This file

---

## 📞 Support & Contact

### Documentation
- Main Docs: [DOCUMENTATION.md](./DOCUMENTATION.md)
- Getting Started: [GETTING_STARTED.md](./GETTING_STARTED.md)
- Admin Guide: [ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md)

### Contact Information
- **Email**: support@investplatform.com
- **Phone**: +233 24 123 4567
- **Website**: www.investplatform.com

### External Resources
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

---

## ✅ Pre-Launch Checklist

- [ ] All pages tested
- [ ] Forms validated
- [ ] Mobile responsive checked
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] API endpoints documented
- [ ] Database schema created
- [ ] Admin panel functional
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Backup procedure established
- [ ] Documentation complete
- [ ] Team trained

---

## 🎓 Next Steps

1. **Set up Backend**
   - Choose tech stack (Node.js/Python/Java)
   - Create database
   - Implement API endpoints
   - Set up authentication

2. **Connect Frontend to Backend**
   - Replace mock data
   - Test all integrations
   - Handle errors gracefully
   - Implement loading states

3. **Deploy to Production**
   - Choose hosting platform
   - Set up CI/CD pipeline
   - Configure domain name
   - Set up SSL/TLS

4. **Monitor & Maintain**
   - Set up error tracking
   - Monitor performance
   - Regular backups
   - Security updates

---

**Version**: 1.0.0
**Last Updated**: January 23, 2024
**Created for**: InvestPlatform Community
