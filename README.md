# InvestPlatform - Peer-to-Peer Investment Platform

A modern, professional fintech-style web application for peer-to-peer investments built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Navigate to `http://localhost:5173` to view the platform.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📋 Features

### Public Pages
- ✅ **Landing Page** - Hero section, features, stats, CTAs
- ✅ **About Page** - Platform info, investment plans, testimonials
- ✅ **Login Page** - Email/password authentication
- ✅ **Register Page** - User registration with validation
- ✅ **Forgot Password** - Password recovery flow

### User Dashboard
- ✅ **New User Dashboard** - Plan selection and packages grid
- ✅ **Active Investment Dashboard** - Investment tracking with:
  - Investment timeline with progress bar
  - Matched member payment details
  - Transaction history
  - Community testimonials
  - Quick statistics

### Admin Panel
- ✅ **Dashboard** - Overview with key metrics
- ✅ **User Management** - View, manage, and monitor users
- ✅ **Investment Management** - Track active and completed investments
- ✅ **Fund Management** - Manage platform funds and allocations
- ✅ **Transaction Records** - Complete transaction history with filters

---

## 🎨 Design Highlights

### Visual Style
- **Glassmorphism** - Modern frosted glass effect on cards
- **Dark Theme** - Dark blue (dark-900) background
- **Gold Accents** - Premium gold (gold-500) highlights
- **Responsive** - Mobile-first, works on all screen sizes

### Components
- Custom glass effect cards with border and blur
- Smooth fade-in and slide-up animations
- Status badges (success, pending, danger)
- Interactive plan cards with hover effects
- Responsive navigation and sidebars

### Colors
```
Primary Dark: #0f1219
Light Dark: #1a1f2e
Gold Accent: #e8bf3c
Accent Light: #f1d66f
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation & footer
│   └── PlanCard.tsx    # Investment plan card
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── UserDashboard.tsx
│   └── AdminPanel.tsx
├── store/             # Zustand state management
├── types/             # TypeScript interfaces
├── utils/             # Helpers & mock data
├── hooks/             # Custom React hooks
├── index.css          # Tailwind & custom styles
└── App.tsx            # Main app with routing
```

---

## 💾 Data & State Management

### State Management
- **Zustand** - Lightweight, efficient state management
- **useAuthStore** - Authentication state (user, token)
- **useInvestmentStore** - Investment state (active, transactions)
- **useUIStore** - UI state (sidebar, modals)

### Mock Data
All demo data available in `src/utils/mockData.ts`:
- 4 Investment Plans (Basic, Bronze, Silver, Gold)
- Demo users with mock profiles
- Sample investments and transactions
- User testimonials
- Transaction history

**Demo Login Credentials** (use any password 6+ chars):
- Email: Any email works
- Password: Any 6+ character password

---

## 🔌 API Integration

### Ready for Backend Integration
The app is structured to easily connect to a backend API:

1. **API Client Setup** - Configure in environment variables:
```env
VITE_API_URL=https://api.investplatform.com
```

2. **Replace Mock Data** - Update service calls:
```typescript
// Instead of: MOCK_USERS from mockData
// Use: await apiClient.get('/admin/users')
```

3. **API Endpoints** - Backend should provide:
```
Authentication: /auth/login, /auth/register, /auth/logout
Users: /users/:id, /users/:id/investments
Investments: /investments, /investments/:id
Admin: /admin/stats, /admin/users, /admin/funds
```

---

## 📚 Documentation

- **[Full Documentation](./DOCUMENTATION.md)** - Complete platform guide
- **[Admin Panel Guide](./ADMIN_PANEL_GUIDE.md)** - Admin setup & usage
- **[Database Schema](./DOCUMENTATION.md#-database-schema)** - SQL definitions
- **[API Reference](./DOCUMENTATION.md#-api-endpoints-to-be-implemented)** - Endpoint specs

---

## 🛠️ Technology Stack

### Frontend
- **React 19.2** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Lucide React** - Icon library
- **date-fns** - Date utilities

### Development
- **ESLint** - Code linting
- **Autoprefixer** - CSS vendor prefixes
- **PostCSS** - CSS processing

---

## 📖 Key Features Explained

### Investment Plans
Four tiered plans with different ROI and durations:
- **Basic**: GHS 200, 30% ROI, 3 days
- **Bronze**: GHS 500, 30% ROI, 5 days
- **Silver**: GHS 1,500, 50% ROI, 10 days
- **Gold**: GHS 2,500, 50% ROI, 15 days

### Investment Workflow
1. User selects plan → Requests help
2. System matches with community member
3. Payment details displayed
4. User transfers funds
5. Investment tracked with live timeline
6. ROI disbursed at maturity

### Admin Functions
- **User Management** - View all users with status
- **Investment Tracking** - Monitor all active investments
- **Fund Management** - Control platform funds and allocations
- **Transaction Records** - View complete transaction history
- **Reports** - Generate financial reports

---

## 🔐 Security Features

- Input validation on all forms
- Password requirements (8+ characters)
- Secure data masking (bank account, phone)
- Session management
- Protected routes (to be implemented with auth checks)

---

## 📱 Responsive Design

- **Desktop** (1200px+) - Full multi-column layouts
- **Tablet** (768px) - Optimized 2-column grids
- **Mobile** (320px) - Single column, touch-friendly

---

## 🚀 Deployment

### Quick Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Build for Production
```bash
npm run build
# Creates dist/ folder ready for deployment
```

### Deploy to Other Platforms
- Netlify: Connect GitHub repo, deploy from `dist/`
- AWS Amplify: `amplify publish`
- DigitalOcean: Standard Node/Vite deployment

---

## 🔄 Next Steps for Production

1. **Connect Backend API**
   - Replace mock data with API calls
   - Implement real authentication
   - Connect to database

2. **Add Features**
   - Email notifications
   - SMS alerts
   - Advanced analytics
   - Mobile app version

3. **Security**
   - Implement HTTPS/TLS
   - Add rate limiting
   - Database encryption
   - Regular security audits

4. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Cypress)
   - Performance testing

5. **Monitoring**
   - Error tracking (Sentry)
   - Analytics (Google Analytics)
   - Performance monitoring
   - User feedback

---

## 🐛 Troubleshooting

**Q: Styles not loading?**
- Clear cache: `npm run build`
- Check Tailwind config
- Verify postcss.config.js exists

**Q: Routes not working?**
- Check React Router setup
- Verify route paths match Link `to` props
- Ensure BrowserRouter wraps routes

**Q: State not persisting?**
- Implement localStorage with Zustand
- Check browser's local storage settings
- Verify store initialization

---

## 📞 Support

- **Email**: support@investplatform.com
- **Phone**: +233 24 123 4567
- **Documentation**: See DOCUMENTATION.md
- **Admin Guide**: See ADMIN_PANEL_GUIDE.md

---

## 📝 License

InvestPlatform © 2024. All rights reserved.

---

## 🎯 Quick Navigation

- 🏠 [Homepage](http://localhost:5173)
- ℹ️ [About](http://localhost:5173/about)
- 🔐 [Login](http://localhost:5173/login)
- 📝 [Register](http://localhost:5173/register)
- 💼 [Dashboard](http://localhost:5173/dashboard) *(after login)*
- ⚙️ [Admin Panel](http://localhost:5173/admin) *(admin only)*

---

**Created with ❤️ for the investment community**
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
