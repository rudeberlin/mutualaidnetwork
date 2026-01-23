# Getting Started - InvestPlatform

Welcome to InvestPlatform! This guide will help you get the platform up and running quickly.

---

## ⚡ 5-Minute Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:5173`

### 4. Explore the Platform
- **Homepage**: See platform overview
- **About**: View investment plans
- **Login/Register**: Try authentication
- **Dashboard**: See investment management (after "login")
- **Admin Panel**: `/admin` for admin features

**Demo Login**:
- Email: `any@email.com`
- Password: `any password 6+ characters`

---

## 🎯 What's Included

### ✅ Complete Frontend
- 7 fully functional pages
- Responsive mobile design
- Modern glassmorphism UI
- Smooth animations
- Form validation
- Error handling

### ✅ State Management
- Zustand for efficient state
- Authentication state
- Investment tracking
- UI state management

### ✅ Mock Data
- Sample users and investments
- Transaction history
- Testimonials
- Investment plans

### ✅ Admin Dashboard
- User management
- Investment tracking
- Fund management
- Transaction records

### ✅ Documentation
- Complete API docs
- Database schema
- Admin guide
- Security guidelines

---

## 📂 Folder Organization

```
project-root/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   ├── store/              # State management
│   ├── types/              # TypeScript types
│   ├── utils/              # Helpers & mock data
│   ├── App.tsx             # Main app
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── DOCUMENTATION.md        # Full docs
├── ADMIN_PANEL_GUIDE.md   # Admin guide
├── GETTING_STARTED.md     # This file
└── package.json            # Dependencies
```

---

## 🚀 Main Routes

### Public Pages (No Login Required)
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Landing page with features |
| `/about` | AboutPage | About, plans, testimonials |
| `/login` | LoginPage | User authentication |
| `/register` | RegisterPage | User registration |
| `/forgot-password` | ForgotPasswordPage | Password recovery |

### Protected Pages (Login Required)
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | UserDashboard | User investment dashboard |
| `/admin` | AdminPanel | Admin management panel |

---

## 🎨 Understanding the Design

### Color System
```
Dark Blue Theme:
  - Background: #0f1219 (dark-900)
  - Cards: #1a1f2e (dark-800) with transparency
  
Gold Accents:
  - Primary: #e8bf3c (gold-500)
  - Light: #f1d66f (gold-400)
  
Status Colors:
  - Success: Green (#10b981)
  - Error: Red (#ef4444)
  - Warning: Yellow (#f59e0b)
  - Info: Blue (#3b82f6)
```

### Key CSS Classes
```css
.glass          /* Frosted glass effect card */
.glass-lg       /* Large glass card */
.btn-primary    /* Gold CTA button */
.btn-secondary  /* Glass button */
.btn-outline    /* Outline button */
.card-glass     /* Main card component */
.status-badge   /* Status indicator */
```

---

## 💡 Key Features Explained

### 1. Investment Plans
Four tiered investment options:
- **Basic**: GHS 200 → GHS 260 (30% ROI, 3 days)
- **Bronze**: GHS 500 → GHS 650 (30% ROI, 5 days)
- **Silver**: GHS 1,500 → GHS 2,250 (50% ROI, 10 days)
- **Gold**: GHS 2,500 → GHS 3,750 (50% ROI, 15 days)

### 2. User Dashboard States
**New User State**:
- See all available plans
- Click "Request Help" to select plan
- Creates investment record

**Active Investment State**:
- View investment progress timeline
- See matched member details
- Track transactions
- View testimonials

### 3. Admin Panel
Five main management sections:
- **Dashboard**: Key metrics and overview
- **Users**: Manage all users
- **Investments**: Track investments
- **Funds**: Control platform funds
- **Transactions**: View transaction history

---

## 📚 Working with Components

### Using the PlanCard Component
```typescript
import { PlanCard } from './components/PlanCard';
import { INVESTMENT_PLANS } from './utils/mockData';

function MyComponent() {
  const handleRequest = (planId: string) => {
    console.log('Selected plan:', planId);
  };

  return (
    <div className="grid gap-4">
      {INVESTMENT_PLANS.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onRequestHelp={handleRequest}
          isHighlighted={plan.id === 'plan-4'}
        />
      ))}
    </div>
  );
}
```

### Using Navbar and Footer
```typescript
import { Navbar, Footer } from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar isAdmin={false} />
      {/* Page content */}
      <Footer />
    </div>
  );
}
```

---

## 🔄 Working with State

### Authentication Store
```typescript
import { useAuthStore } from './store';

function LoginComponent() {
  const { user, setUser, logout } = useAuthStore();

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <div>
      {user ? (
        <p>Welcome, {user.fullName}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Investment Store
```typescript
import { useInvestmentStore } from './store';

function InvestmentComponent() {
  const { activeInvestment, setActiveInvestment } = useInvestmentStore();

  return (
    <div>
      {activeInvestment && (
        <p>Active: {activeInvestment.amount}</p>
      )}
    </div>
  );
}
```

---

## 🛠️ Common Tasks

### Add a New Page
1. Create file in `src/pages/YourPage.tsx`
2. Create component:
```typescript
export const YourPage: React.FC = () => {
  return <div>Your Page Content</div>;
};
```
3. Add route in `App.tsx`:
```typescript
<Route path="/your-page" element={<YourPage />} />
```

### Add a New Component
1. Create file in `src/components/YourComponent.tsx`
2. Export component:
```typescript
interface Props {
  title: string;
}

export const YourComponent: React.FC<Props> = ({ title }) => {
  return <div>{title}</div>;
};
```

### Add a Utility Function
1. Create file in `src/utils/yourUtils.ts`
2. Export functions:
```typescript
export const myFunction = (value: string): string => {
  return value.toUpperCase();
};
```

### Use Mock Data
```typescript
import { INVESTMENT_PLANS, MOCK_USERS } from '../utils/mockData';

// Use in components
{INVESTMENT_PLANS.map(plan => (
  <div key={plan.id}>{plan.name}</div>
))}
```

---

## 🔌 Connecting to Backend

### Step 1: Set Environment Variables
Create `.env` file:
```env
VITE_API_URL=https://your-api.com
VITE_APP_ENV=development
```

### Step 2: Create API Service
```typescript
// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Step 3: Replace Mock Data
```typescript
// Before (mock data):
import { MOCK_USERS } from '../utils/mockData';

// After (API call):
import apiClient from '../services/api';

const fetchUsers = async () => {
  const { data } = await apiClient.get('/users');
  return data;
};
```

---

## 🚀 Building for Production

### Build Command
```bash
npm run build
```

Creates optimized `dist/` folder with:
- Minified JavaScript
- Optimized CSS
- Compressed images
- Source maps

### Preview Build
```bash
npm run preview
```

Test production build locally.

### Deploy
```bash
# Vercel
vercel

# Netlify
netlify deploy --prod --dir=dist

# AWS Amplify
amplify publish

# Any static hosting
# Just upload contents of dist/ folder
```

---

## 📋 Common Issues & Solutions

### Issue: Tailwind styles not loading
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Issue: TypeScript errors
**Solution**:
```bash
# Check for type errors
npx tsc --noEmit

# Build will catch these too
npm run build
```

### Issue: State not updating
**Solution**:
```typescript
// Check Zustand store is imported correctly
import { useAuthStore } from '../store';

// Make sure to use hook in component
const { user, setUser } = useAuthStore();
```

### Issue: Routes not working
**Solution**:
```typescript
// Verify BrowserRouter wraps all routes in App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

<Router>
  <Routes>
    {/* routes */}
  </Routes>
</Router>
```

---

## 📚 Learning Resources

### Included Documentation
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete platform reference
- **[ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md)** - Admin features guide

### External Resources
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 🎓 Next Learning Steps

1. **Understand the Data Flow**
   - How mock data flows to components
   - How state changes propagate

2. **Explore the Admin Panel**
   - Navigate through all sections
   - Understand management features

3. **Customize the Design**
   - Change colors in `tailwind.config.js`
   - Modify animations in `index.css`

4. **Connect Real Data**
   - Set up backend API
   - Replace mock data with API calls
   - Implement real authentication

5. **Add More Features**
   - Email notifications
   - Advanced analytics
   - Mobile app version

---

## 💬 Getting Help

### Debug Mode
Add to your components for debugging:
```typescript
console.log('Component rendered', { props, state });
```

### Check Browser Console
- Open DevTools (F12)
- Check Console tab for errors
- Use Network tab to inspect API calls

### Check TypeScript Errors
```bash
npx tsc --noEmit
```

### Test Data
Use mock data to test features:
```typescript
import { MOCK_ACTIVE_INVESTMENT } from './utils/mockData';
console.log(MOCK_ACTIVE_INVESTMENT);
```

---

## 📞 Support

- **Email**: support@investplatform.com
- **Documentation**: See DOCUMENTATION.md
- **Admin Guide**: See ADMIN_PANEL_GUIDE.md

---

## 🎯 Quick Links

- [Main README](./README.md)
- [Full Documentation](./DOCUMENTATION.md)
- [Admin Panel Guide](./ADMIN_PANEL_GUIDE.md)
- [Homepage](http://localhost:5173)
- [About Page](http://localhost:5173/about)

---

**Happy coding! 🚀**

Last Updated: January 23, 2024
