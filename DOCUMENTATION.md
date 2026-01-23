# InvestPlatform - Complete Documentation

## Project Overview

InvestPlatform is a modern, professional fintech-style peer-to-peer investment platform built with React, TypeScript, and Tailwind CSS. It enables community members to invest with guaranteed returns and transparent fund management.

---

## 🚀 Features

### Public Pages
- **Homepage** - Landing page with features, stats, and CTA
- **About Page** - Platform information, plans overview, testimonials, how it works
- **Authentication Pages**
  - Login with email/password
  - Register with form validation
  - Forgot Password / Password Recovery

### User Dashboards
- **New User Dashboard** - Plan selection and package grid
- **Active Investment Dashboard** - Investment tracking, timeline, payment details, transaction history, testimonials

### Admin Panel
- **Dashboard** - Statistics and quick overview
- **User Management** - View all users, status, join date
- **Investments** - Active investments tracking
- **Fund Management** - Fund distribution and allocation
- **Transactions** - All transaction records

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation bar & footer
│   └── PlanCard.tsx    # Investment plan card component
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── UserDashboard.tsx
│   └── AdminPanel.tsx
├── store/             # Zustand state management
│   └── index.ts
├── types/             # TypeScript definitions
│   └── index.ts
├── utils/             # Helper functions & mock data
│   ├── helpers.ts
│   └── mockData.ts
├── hooks/             # Custom React hooks (future)
├── App.tsx            # Main app with routing
├── main.tsx           # React entry point
├── index.css          # Tailwind + custom styles
└── vite-env.d.ts      # Type declarations
```

---

## 🎨 Design System

### Color Palette
- **Dark Base**: `#0f1219` (dark-900) to `#f7f8fa` (dark-50)
- **Gold Accent**: `#e8bf3c` (gold-500) to `#6d5715` (gold-900)
- **Status Colors**: Green (success), Red (danger), Yellow (pending), Blue (info)

### Components

#### CSS Classes (defined in index.css)
```css
.glass           /* Glassmorphism cards */
.glass-lg        /* Large glassmorphism with more blur */
.glass-hover     /* Hover effects for glass elements */
.btn-primary     /* Primary gold button */
.btn-secondary   /* Secondary glass button */
.btn-outline     /* Outline button with gold border */
.card-glass      /* Main card component */
.heading-lg      /* Large heading (4xl) */
.heading-md      /* Medium heading (2xl) */
.text-muted      /* Muted text color */
.status-badge    /* Default status badge */
.status-badge-success    /* Green success badge */
.status-badge-pending    /* Yellow pending badge */
.status-badge-danger     /* Red danger badge */
```

### Animations
- `fade-in` - 0.5s fade in
- `slide-up` - 0.5s slide up with fade

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  profilePhoto VARCHAR(500),
  hasActivePlan BOOLEAN DEFAULT FALSE,
  activePlanId UUID,
  isVIP BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Investment Plans Table
```sql
CREATE TABLE investment_plans (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  amountGHS DECIMAL(10,2) NOT NULL,
  roiPercentage INT NOT NULL,
  durationDays INT NOT NULL,
  description TEXT,
  benefits JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Investment Records Table
```sql
CREATE TABLE investment_records (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL,
  planId UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  roiPercentage INT NOT NULL,
  durationDays INT NOT NULL,
  startDate TIMESTAMP NOT NULL,
  dueDate TIMESTAMP NOT NULL,
  status VARCHAR(20), -- 'active', 'completed', 'cancelled'
  isMatched BOOLEAN DEFAULT FALSE,
  matchedMemberId UUID,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (planId) REFERENCES investment_plans(id),
  FOREIGN KEY (matchedMemberId) REFERENCES users(id)
);
```

### Payment Details Table
```sql
CREATE TABLE payment_details (
  id UUID PRIMARY KEY,
  investmentRecordId UUID NOT NULL,
  bankName VARCHAR(100) NOT NULL,
  accountName VARCHAR(255) NOT NULL,
  accountNumber VARCHAR(20) NOT NULL,
  amountToPay DECIMAL(10,2) NOT NULL,
  status VARCHAR(20), -- 'pending', 'paid'
  proofOfPayment VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (investmentRecordId) REFERENCES investment_records(id)
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL,
  type VARCHAR(20), -- 'deposit', 'withdrawal'
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20), -- 'pending', 'completed', 'failed'
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Testimonials Table
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL,
  userName VARCHAR(255) NOT NULL,
  userAvatar VARCHAR(500),
  rating INT (1-5),
  comment TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

---

## 🔌 API Endpoints (To Be Implemented)

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Users
```
GET    /api/users/:id
PUT    /api/users/:id
GET    /api/users/:id/dashboard
GET    /api/users/:id/investments
GET    /api/users/:id/transactions
```

### Investment Plans
```
GET    /api/plans
GET    /api/plans/:id
POST   /api/plans/:id/request
```

### Investments
```
GET    /api/investments/:id
PUT    /api/investments/:id
GET    /api/investments/:id/matched-member
POST   /api/investments/:id/mark-paid
```

### Admin
```
GET    /api/admin/stats
GET    /api/admin/users
GET    /api/admin/investments
GET    /api/admin/funds
GET    /api/admin/transactions
```

---

## 🔐 Authentication Flow

1. User registers with email, password, full name, and phone
2. Email verification sent
3. User logs in with email/password
4. JWT token generated and stored in client
5. Token used in Authorization header for protected routes
6. Token refresh mechanism for expired tokens

---

## 💳 Investment Flow

1. **New User** sees plan selection dashboard
2. **User Clicks "Request Help"** → Selects a plan
3. **Investment Record Created** → Transitions to active view
4. **System Matches Member** → Payment details displayed
5. **User Transfers Funds** → Updates payment status
6. **Days Elapse** → Progress shown in timeline
7. **Investment Complete** → ROI disbursed
8. **User Receives Help** → Can help another member

---

## 🛠️ Environment Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

---

## 📦 Dependencies

### Core
- `react@^19.2.0` - UI library
- `react-dom@^19.2.0` - DOM rendering
- `react-router-dom@^6.20.0` - Routing

### State Management
- `zustand@^4.4.1` - Lightweight state management

### UI & Icons
- `lucide-react@^0.294.0` - Icon library
- `tailwindcss@^3.3.6` - CSS framework

### Utilities
- `axios@^1.6.2` - HTTP client (for future API calls)
- `date-fns@^2.30.0` - Date utilities

### Development
- `typescript@~5.9.3` - Type safety
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `autoprefixer` - CSS vendor prefixes
- `postcss` - CSS processor

---

## 🚀 Deployment

### Recommended Platforms
1. **Vercel** - Optimized for Vite + React
2. **Netlify** - Easy GitHub integration
3. **AWS Amplify** - Full-stack serverless
4. **DigitalOcean App Platform** - Simple deployment

### Environment Variables
```
VITE_API_URL=your_api_endpoint
VITE_APP_NAME=InvestPlatform
```

---

## 🔄 State Management (Zustand)

### useAuthStore
```typescript
- user: User | null
- token: string | null
- isAuthenticated: boolean
- setUser(user: User)
- setToken(token: string)
- logout()
```

### useInvestmentStore
```typescript
- activeInvestment: InvestmentRecord | null
- transactions: Transaction[]
- setActiveInvestment(investment: InvestmentRecord)
- addTransaction(transaction: Transaction)
- removeInvestment()
```

### useUIStore
```typescript
- isSidebarOpen: boolean
- toggleSidebar()
- closeSidebar()
- openSidebar()
```

---

## 📋 Mock Data

All mock data is stored in `utils/mockData.ts`:
- `INVESTMENT_PLANS` - 4 tier plans
- `MOCK_CURRENT_USER` - Demo user
- `MOCK_ACTIVE_INVESTMENT` - Sample investment
- `MOCK_MATCHED_MEMBER` - Matched member example
- `MOCK_TRANSACTIONS` - Transaction samples
- `MOCK_TESTIMONIALS` - User reviews
- `MOCK_USERS` - User database

---

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Helper function calculations
- Form validation

### Integration Tests
- Navigation flows
- State management
- Local storage persistence

### E2E Tests
- User registration flow
- Investment request flow
- Admin operations

---

## 📱 Responsive Design

- **Desktop** (1200px+) - Full multi-column layouts
- **Tablet** (768px) - 2-column grids, adjusted spacing
- **Mobile** (320px) - Single column, stacked navigation

Tested breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`

---

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Focus states for all buttons
- Form labels properly associated

---

## 🐛 Common Issues & Solutions

### Issue: Styles not loading
- Clear cache: `npm run build`
- Check Tailwind CSS config
- Verify postcss.config.js exists

### Issue: State not persisting
- Use localStorage middleware with Zustand
- Implement session persistence

### Issue: Navigation not working
- Check React Router setup
- Verify route paths match Link `to` props
- Check for typos in route definitions

---

## 🔒 Security Considerations

### Frontend
- ✓ Input validation on forms
- ✓ XSS protection via React
- ✓ CSRF tokens for state-changing operations
- ✓ Secure password requirements (8+ chars)
- ✓ Account masking for sensitive data

### Backend (To Implement)
- [ ] Bcrypt for password hashing
- [ ] JWT with expiration
- [ ] Rate limiting on endpoints
- [ ] Database encryption for sensitive fields
- [ ] HTTPS/TLS enforcement
- [ ] Input sanitization
- [ ] SQL injection prevention (parameterized queries)

---

## 📞 Support & Contact

- Email: support@investplatform.com
- Phone: +233 24 123 4567
- Website: www.investplatform.com

---

## 📝 License

InvestPlatform © 2024. All rights reserved.
