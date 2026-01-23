# Troubleshooting Guide

Complete troubleshooting guide for common issues and their solutions.

## 📋 Table of Contents

1. [Installation Issues](#installation-issues)
2. [Development Server Issues](#development-server-issues)
3. [Build Issues](#build-issues)
4. [TypeScript Issues](#typescript-issues)
5. [Browser & Runtime Issues](#browser--runtime-issues)
6. [Styling Issues](#styling-issues)
7. [State Management Issues](#state-management-issues)
8. [Performance Issues](#performance-issues)
9. [Deployment Issues](#deployment-issues)
10. [Database Integration Issues](#database-integration-issues)

---

## Installation Issues

### Issue: "npm ERR! code ERESOLVE"

**Error Message:**
```
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! npm does not currently support providing all types of dependencies that node-modules 
npm ERR! can install
```

**Cause:** Node module dependency conflict (usually React 19 with lucide-react)

**Solutions:**

**Option 1: Use Legacy Peer Deps (Recommended)**
```bash
npm install --legacy-peer-deps
```

**Option 2: Update Node.js**
```bash
# Check current version
node -v

# Should be v18 or higher
# Update from https://nodejs.org/
```

**Option 3: Clean Install**
```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Install fresh
npm install --legacy-peer-deps
```

---

### Issue: "npm ERR! 404 Not Found"

**Error Message:**
```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/package-name
```

**Cause:** Package doesn't exist or typo in package.json

**Solution:**
```bash
# Check package.json for typos
cat package.json | grep "dependencies" -A 10

# Common typos:
# - "reac" instead of "react"
# - "zustan" instead of "zustand"
# - "lucde-react" instead of "lucide-react"

# Fix the typo and reinstall
npm install --legacy-peer-deps
```

---

### Issue: "npm ERR! Maximum call stack size exceeded"

**Error Message:**
```
npm ERR! Maximum call stack size exceeded
```

**Cause:** Circular dependency or corrupted cache

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install --legacy-peer-deps
```

---

### Issue: "node_modules Permission Denied" (macOS/Linux)

**Error Message:**
```
EACCES: permission denied, open '/usr/local/lib/node_modules/...'
```

**Solution Option 1: Use sudo (Quick Fix)**
```bash
sudo npm install --legacy-peer-deps
```

**Solution Option 2: Fix npm Permissions (Recommended)**
```bash
# Create .npm directory in home
mkdir ~/.npm-global

# Configure npm to use it
npm config set prefix '~/.npm-global'

# Add to PATH (~/.bashrc or ~/.zshrc)
export PATH=~/.npm-global/bin:$PATH

# Reinstall
npm install --legacy-peer-deps
```

---

## Development Server Issues

### Issue: "Port 5173 already in use"

**Error Message:**
```
VITE_ABORT: Port 5173 is already in use. Available ports: 5174, 5175, 5176
```

**Cause:** Another process is running on port 5173

**Solution Option 1: Kill Existing Process**

**Windows (PowerShell):**
```powershell
# Find process on port 5173
netstat -ano | findstr :5173

# Kill it (replace XXXX with PID)
taskkill /PID XXXX /F
```

**Linux/Mac:**
```bash
# Find and kill process
lsof -ti:5173 | xargs kill -9
```

**Solution Option 2: Use Different Port**
```bash
npm run dev -- --port 3000
# Or
npm run dev -- --port 8080
```

---

### Issue: "Module not found" Error in Browser

**Error Message:**
```
Failed to resolve module specifier "react"
```

**Cause:** Dependencies not installed

**Solution:**
```bash
# Install dependencies
npm install --legacy-peer-deps

# Restart dev server
npm run dev
```

---

### Issue: "VITE Hot Module Replacement (HMR) Error"

**Error Message:**
```
[HMR] Failed to connect to the WebSocket server. 
Retrying in 1 second...
```

**Cause:** Firewall or network configuration issue

**Solution Option 1: Clear Vite Cache**
```bash
# Stop dev server (Ctrl+C)
rm -rf .vite
npm run dev
```

**Solution Option 2: Configure HMR Manually**
Edit `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
})
```

**Solution Option 3: Disable HMR**
```bash
# Set HMR to false
npm run dev -- --no-hmr
```

---

### Issue: "Cannot find module 'lucide-react'"

**Error Message:**
```
Module not found: Error: Can't resolve 'lucide-react' in '/src/components'
```

**Cause:** lucide-react not installed

**Solution:**
```bash
# Install specifically
npm install lucide-react@latest --legacy-peer-deps

# Or reinstall all
npm install --legacy-peer-deps
```

---

## Build Issues

### Issue: "Build fails - TypeScript errors"

**Error Message:**
```
error TS2322: Type 'string' is not assignable to type 'number'
```

**Solution:**
```bash
# Check for type errors
tsc -b

# Find the file and line mentioned
# Open file and fix the type mismatch

# For example, if error is in src/App.tsx line 45:
# Open src/App.tsx and look at line 45
# Fix the type issue

# After fixing, try building again
npm run build
```

**Common Type Issues:**
```typescript
// ❌ Wrong: assigning string to number
const count: number = "5";

// ✅ Correct: parse string to number
const count: number = parseInt("5");

// ❌ Wrong: missing optional property
const user: User = { name: "John" }; // missing 'email'

// ✅ Correct: include all required properties
const user: User = { name: "John", email: "john@example.com" };
```

---

### Issue: "Build output too large"

**Warning Message:**
```
⚠ ../../dist/assets/index-XXXXX.js (298.13 kB) exceeds recommended size limit
```

**This is normal for development builds.** For production:

**Solution: Use Production Optimization**

The build already uses optimization. If you need smaller bundles:

1. **Remove unused dependencies:**
```bash
npm list --depth=0
# Remove packages you don't use
npm uninstall package-name
```

2. **Check for duplicate dependencies:**
```bash
npm dedupe
```

3. **Use dynamic imports for large pages:**
```typescript
// Instead of:
import UserDashboard from './pages/UserDashboard';

// Use:
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
```

---

### Issue: "Build output missing files"

**Error Message:**
```
dist/ folder is empty or missing files
```

**Cause:** Build failed silently

**Solution:**
```bash
# Clear old builds
rm -rf dist

# Rebuild with verbose output
npm run build -- --debug

# Check for errors in output
```

---

## TypeScript Issues

### Issue: "Type must be imported using type-only import"

**Error Message:**
```
error TS1371: "Type" must be imported using type-only import 
when verbatimModuleSyntax is enabled.
```

**Cause:** TypeScript strict mode requires type-only imports for types

**Solution:** Use `import type`:
```typescript
// ❌ Wrong
import { User, InvestmentPlan } from '@/types';

// ✅ Correct
import type { User, InvestmentPlan } from '@/types';
```

---

### Issue: "Property does not exist on type"

**Error Message:**
```
Property 'email' does not exist on type 'string'
```

**Cause:** Type mismatch - accessing property on wrong type

**Solution:** Check the type definition:
```typescript
// If error says email doesn't exist on string
const user: string = "John"; // ❌ user is string
user.email // ❌ strings don't have email

// Should be:
const user: User = { email: "john@example.com" }; // ✅
user.email // ✅ works now
```

---

### Issue: "Argument of type 'X' is not assignable to parameter of type 'Y'"

**Error Message:**
```
Argument of type 'string' is not assignable to parameter of type 'number'.
```

**Cause:** Passing wrong type to function

**Solution:** Check function signature:
```typescript
// Function expects number
function calculateROI(principal: number): number {
  return principal * 0.5;
}

// ❌ Wrong: passing string
calculateROI("1000");

// ✅ Correct: pass number
calculateROI(1000);
```

---

## Browser & Runtime Issues

### Issue: "Blank white screen on load"

**Cause:** Several possibilities

**Solutions:**

1. **Check browser console for errors:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for red error messages

2. **Check if React is loading:**
```typescript
// In browser console
console.log(window.React); // Should exist
console.log(document.getElementById('root')); // Should exist
```

3. **Check if main.tsx is correct:**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Should find element with id="root"
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

### Issue: "Uncaught ReferenceError: X is not defined"

**Error Message:**
```
Uncaught ReferenceError: INVESTMENT_PLANS is not defined
```

**Cause:** Variable not imported or scope issue

**Solution:** 
```typescript
// ❌ Wrong: using INVESTMENT_PLANS without import
function getPlans() {
  return INVESTMENT_PLANS;
}

// ✅ Correct: import first
import { INVESTMENT_PLANS } from '@/utils/mockData';

function getPlans() {
  return INVESTMENT_PLANS;
}
```

---

### Issue: "Warning: Each child in a list should have a unique key prop"

**Error Message (Console):**
```
Warning: Each child in a list should have a unique key prop.
```

**Cause:** Missing key prop in list rendering

**Solution:**
```typescript
// ❌ Wrong: no key prop
{plans.map((plan) => (
  <div>{plan.name}</div>
))}

// ✅ Correct: use key prop
{plans.map((plan) => (
  <div key={plan.id}>{plan.name}</div>
))}
```

---

### Issue: "Cannot read property of undefined"

**Error Message:**
```
Cannot read property 'email' of undefined
```

**Cause:** Trying to access property of null/undefined object

**Solution:** Check for null/undefined first:
```typescript
// ❌ Wrong: may be null
const email = user.email;

// ✅ Correct: check first
const email = user?.email; // optional chaining

// Or:
const email = user ? user.email : null;

// Or with type guard:
if (user) {
  const email = user.email; // safe now
}
```

---

## Styling Issues

### Issue: "Tailwind CSS classes not applying"

**Cause:** Several possibilities

**Solutions:**

1. **Check if Tailwind is configured:**
   - Verify `tailwind.config.js` exists
   - Verify `src/index.css` has `@tailwind` directives

2. **Check class name spelling:**
```typescript
// ❌ Wrong: typo in class
<div className="bg-blu-500">Wrong</div>

// ✅ Correct: proper class name
<div className="bg-blue-500">Correct</div>
```

3. **Check if class is valid:**
```typescript
// ❌ Might not work: custom color not in config
<div className="bg-custom-color">Text</div>

// ✅ Use configured color
<div className="bg-gold-500">Text</div>
```

4. **Rebuild if needed:**
```bash
npm run dev
# Stop and restart dev server
```

---

### Issue: "Custom Tailwind colors not working"

**Error:** Using `bg-dark-900` but it doesn't apply

**Solution:** Check `tailwind.config.js`:
```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f5f5f7',
          // ... more shades
          900: '#0f1219',
        },
      },
    },
  },
}
```

Use the color:
```typescript
<div className="bg-dark-900">Text</div>
```

---

### Issue: "Responsive classes not working"

**Error:** `md:block` not working on medium screens

**Solutions:**

1. **Check browser width:**
   - `sm`: 640px
   - `md`: 768px
   - `lg`: 1024px
   - `xl`: 1280px

2. **Use correct syntax:**
```typescript
// ❌ Wrong: space breaks responsive
<div className="md: block">Text</div>

// ✅ Correct: no space
<div className="md:block">Text</div>
```

3. **Verify viewport meta tag:**
```html
<!-- In src/index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

---

## State Management Issues

### Issue: "Zustand state not updating"

**Cause:** Not using proper update methods

**Solution:**
```typescript
// ❌ Wrong: directly modifying state
const { user } = useAuthStore();
user.email = "new@example.com"; // Won't trigger re-render

// ✅ Correct: use store methods
const { setUser } = useAuthStore();
setUser({ ...oldUser, email: "new@example.com" });
```

---

### Issue: "Component not re-rendering after state change"

**Cause:** Not destructuring from store correctly

**Solution:**
```typescript
// ❌ Wrong: doesn't subscribe to updates
const store = useAuthStore;
const user = store.getState().user;

// ✅ Correct: properly subscribe
const { user } = useAuthStore();

// Or with selector:
const user = useAuthStore((state) => state.user);
```

---

### Issue: "State persists after logout"

**Cause:** Store not clearing properly

**Solution:** Ensure logout method clears state:
```typescript
// In src/store/index.ts
logout: () => set({
  user: null,
  token: null,
  isAuthenticated: false,
}),
```

**Test logout:**
```bash
# In browser console
import { useAuthStore } from './store';
useAuthStore.getState().logout();
console.log(useAuthStore.getState()); // Should show null values
```

---

## Performance Issues

### Issue: "App is slow / laggy"

**Solutions:**

1. **Check performance in DevTools:**
   - Open DevTools (F12)
   - Go to Performance tab
   - Click record, interact with app, click stop
   - Look for long tasks (> 50ms)

2. **Reduce re-renders:**
```typescript
// Use useMemo for expensive computations
const memoizedValue = useMemo(() => {
  return expensiveCalculation();
}, [dependency]);
```

3. **Use React DevTools Profiler:**
   - Install React DevTools extension
   - Go to Profiler tab
   - Record and look for unnecessary re-renders

---

### Issue: "Large bundle size"

**Bundle size is ~300KB JavaScript (292KB gzipped)**

**Normal for development. In production, Vite optimizes automatically.**

**To verify:**
```bash
npm run build
# Check dist/ folder size
```

---

## Deployment Issues

### Issue: "404 errors in production"

**Cause:** Routing not working on static host

**Solution:** Configure server to redirect to index.html

**For Vercel:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

**For Netlify:** Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Issue: "Blank page after deployment"

**Solutions:**

1. **Check browser console for errors:**
   - Press F12
   - Go to Console tab
   - Look for error messages

2. **Verify build output:**
```bash
npm run build
npm run preview
# Test locally before deploying
```

3. **Check if CSS loaded:**
   - Right-click → Inspect
   - Check Network tab for `.css` files
   - Should have green status code 200

---

### Issue: "API calls failing in production"

**Cause:** CORS errors or wrong API endpoint

**Solution:** Update API endpoint:
```typescript
// src/utils/helpers.ts or api service
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

Create `.env.production`:
```
VITE_API_URL=https://api.yourdomain.com
```

---

## Database Integration Issues

### Issue: "Cannot connect to database"

**Cause:** Connection string wrong or database offline

**Solution:**
```typescript
// Test connection
const response = await axios.get('/api/health');
console.log('DB Connected:', response.data);
```

**Check:**
1. Database is running
2. Connection string is correct
3. Firewall allows connection
4. Database credentials are valid

---

### Issue: "CORS error when calling API"

**Error Message:**
```
Access to XMLHttpRequest at 'http://api.example.com/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution (Backend):** Add CORS headers:
```python
# Python/Flask example
from flask_cors import CORS
CORS(app)
```

```javascript
// Node/Express example
const cors = require('cors');
app.use(cors());
```

---

### Issue: "Authentication token not sent with requests"

**Solution:** Configure axios interceptors:
```typescript
// In src/utils/api.ts (create if needed)
import axios from 'axios';
import { useAuthStore } from '@/store';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

---

## Still Having Issues?

### Debugging Steps (In Order)

1. **Read the error message carefully**
   - Most errors tell you exactly what's wrong
   - Note the file name and line number

2. **Search in documentation**
   - Use Ctrl+F to search this file
   - Search for the error message

3. **Check VS Code Problems**
   - Open Problems panel (Ctrl+Shift+M)
   - Fix all red errors first

4. **Check browser console**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for error stack traces

5. **Try clean install**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   npm run dev
   ```

6. **Check with git**
   ```bash
   git status
   # Revert any accidental changes
   git checkout -- filename
   ```

### Useful Browser DevTools Tips

**Console Debugging:**
```javascript
// Check Zustand stores
useAuthStore.getState();
useInvestmentStore.getState();
useUIStore.getState();

// Check component props
$r // selected React component's props
```

**Network Tab:**
- Check all requests have 200-299 status
- Look for failed requests (red)
- Check response headers for CORS issues

**Performance Tab:**
- Record user interactions
- Look for long tasks (yellow/red)
- Check main thread is not blocked

---

## Performance Baseline

**These metrics are expected for the application:**

- **First Load:** 1-2 seconds
- **Page Navigation:** < 300ms
- **Input Response:** < 100ms
- **Bundle Size:** ~300KB JavaScript (gzipped: ~87KB)
- **CSS Size:** ~25KB (gzipped: ~5KB)

If performance is significantly worse, run the debuggng steps above.

---

## Getting Help

1. **Check [GETTING_STARTED.md](GETTING_STARTED.md)** - General setup help
2. **Check [DOCUMENTATION.md](DOCUMENTATION.md)** - Technical details
3. **Check [COMMANDS_REFERENCE.md](COMMANDS_REFERENCE.md)** - Command help
4. **Check browser console** - Runtime errors
5. **Check VS Code Problems** - Build errors

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Project:** InvestPlatform - Peer-to-Peer Investment Platform
