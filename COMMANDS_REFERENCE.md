# Commands Reference Guide

Complete guide to all npm scripts and available commands for the InvestPlatform project.

## 📋 Table of Contents

1. [Installation Commands](#installation-commands)
2. [Development Commands](#development-commands)
3. [Production Commands](#production-commands)
4. [Code Quality Commands](#code-quality-commands)
5. [Troubleshooting Commands](#troubleshooting-commands)
6. [Project Structure Commands](#project-structure-commands)

---

## Installation Commands

### Initial Setup

```bash
# Install all dependencies (REQUIRED on fresh clone)
npm install --legacy-peer-deps

# Why --legacy-peer-deps?
# lucide-react needs peer dependency compatibility with React 19
# This flag allows npm to resolve version conflicts gracefully
```

### Clean Install (If Dependencies Broken)

```bash
# Remove node_modules and package-lock.json
rm -r node_modules package-lock.json
# or on Windows:
# rmdir /s /q node_modules
# del package-lock.json

# Fresh install
npm install --legacy-peer-deps
```

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all packages to latest minor version
npm update

# Update specific package to latest
npm install package-name@latest
```

---

## Development Commands

### Start Development Server

```bash
npm run dev
```

**Output:**
```
  VITE v5.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**What it does:**
- Starts Vite development server on `http://localhost:5173/`
- Hot Module Replacement (HMR) enabled - changes reflect instantly
- TypeScript errors shown in browser overlay
- Perfect for active development

**Common Workflow:**
```bash
# Terminal 1
npm run dev

# Terminal 2 (for linting while developing)
npm run lint
```

### Development with Watch Mode

The `npm run dev` command already includes file watching. Any changes to:
- `.tsx` files → Instantly reflected
- `.css` files → Instantly reflected
- `.json` config files → May need manual refresh

**Tips:**
- Press `r` in terminal to manually force reload
- Press `u` to show HMR error details
- Check browser console for runtime errors

---

## Production Commands

### Build for Production

```bash
npm run build
```

**Output:**
```
✓ built in 4.80s

dist/index.html                           0.46 kB │ gzip: 0.30 kB
dist/assets/index-D2b4Gq4g.css           24.72 kB │ gzip: 4.87 kB
dist/assets/index-VnWznvJ4.js           298.13 kB │ gzip: 87.39 kB
```

**What it does:**
1. Runs TypeScript type checking (`tsc -b`)
2. Bundles all React components and dependencies
3. Optimizes CSS using Tailwind's tree-shaking
4. Minifies JavaScript
5. Generates source maps for debugging
6. Creates production-ready files in `dist/` folder

**Build Breakdown:**
- `dist/index.html` - Entry point (minimal file)
- `dist/assets/*.css` - All styles (24.72 KB, gzipped to 4.87 KB)
- `dist/assets/*.js` - All JavaScript (298.13 KB, gzipped to 87.39 KB)

**Total Size:** ~323 KB (full) → ~92 KB (gzipped)

**Optimization Tips:**
- Remove unused dependencies from `package.json`
- Code-split large pages using React.lazy() and Suspense
- Optimize images and assets
- Consider using dynamic imports for heavy routes

### Preview Production Build

```bash
npm run preview
```

**What it does:**
- Starts a local server serving the production `dist/` folder
- Allows testing production build before deployment
- Runs on `http://localhost:4173/` by default

**Common Workflow:**
```bash
# Terminal 1: Build
npm run build

# Terminal 2: Preview the build
npm run preview

# Open http://localhost:4173/ to test
```

---

## Code Quality Commands

### Run ESLint

```bash
npm run lint
```

**What it does:**
- Checks all `.ts` and `.tsx` files for code quality issues
- Enforces coding standards defined in `.eslintrc.cjs`
- Reports errors and warnings
- Suggests fixes for some issues

**Common Issues:**
```
✖ 2 problems (1 error, 1 warning)
  src/App.tsx
    Line 10: Unused variable 'unusedVar'
    Line 25: 'handleClick' is declared but never used
```

**Fix Automatically (when possible):**
```bash
# eslint doesn't have auto-fix, but you can:
# 1. Use VS Code ESLint extension (recommended)
# 2. Run lint to identify issues
# 3. Fix manually (usually simple)
```

### TypeScript Check

```bash
tsc -b
```

**What it does:**
- Performs full TypeScript type checking
- Detects type errors without building
- Useful for quick validation during development

**Typical Output:**
```
src/pages/LoginPage.tsx:45:20 - error TS2322: 
Type 'string' is not assignable to type 'number'.
```

---

## Troubleshooting Commands

### Clear Development Cache

```bash
# Clear Vite cache
rm -rf .vite
# or on Windows:
# rmdir /s /q .vite
```

### Verify Build Integrity

```bash
# Check what gets bundled
npm run build -- --analyze

# Note: This requires additional setup
# Alternative: Check dist/ folder size
# Should be approximately 300 KB total
```

### Check for Vulnerability Issues

```bash
npm audit
```

**Common Output:**
```
added 91 packages, and audited 271 packages in 41s
found 0 vulnerabilities
```

### Force Full Reinstall

```bash
# Complete clean slate
rm -rf node_modules package-lock.json dist .vite
npm install --legacy-peer-deps
npm run build
```

### Test Individual Endpoints

```bash
# If developing with mock data, check store
# In browser console:
console.log(useAuthStore.getState())
console.log(useInvestmentStore.getState())
console.log(useUIStore.getState())
```

---

## Project Structure Commands

### List TypeScript Files

```bash
# Windows PowerShell
Get-ChildItem -Path "src\" -Recurse -Include "*.tsx","*.ts" | Select-Object FullName

# Linux/Mac
find src -type f \( -name "*.ts" -o -name "*.tsx" \)
```

**Expected Output:**
```
src/App.tsx
src/main.tsx
src/components/Navbar.tsx
src/components/PlanCard.tsx
src/pages/HomePage.tsx
src/pages/AboutPage.tsx
src/pages/LoginPage.tsx
src/pages/RegisterPage.tsx
src/pages/ForgotPasswordPage.tsx
src/pages/UserDashboard.tsx
src/pages/AdminPanel.tsx
src/store/index.ts
src/types/index.ts
src/utils/helpers.ts
src/utils/mockData.ts
```

**Total: 15 files** ✓

### Check All Configuration Files

```bash
# List all config files
ls -la *.config.* *.json

# Expected files:
# - vite.config.ts
# - tsconfig.json
# - tailwind.config.js
# - postcss.config.js
# - eslint.config.mjs
# - package.json
# - package-lock.json
```

### Verify All Documentation

```bash
# Windows PowerShell
Get-ChildItem "*.md" | Select-Object Name

# Linux/Mac
ls *.md
```

**Expected Files:**
```
INDEX.md                      ← Start here for nav
README.md                     ← Project overview
GETTING_STARTED.md           ← Setup guide
DOCUMENTATION.md             ← Technical reference
SETUP_DEPLOYMENT.md          ← Deployment guide
ADMIN_PANEL_GUIDE.md         ← Admin features
PROJECT_COMPLETE.md          ← Project summary
COMMANDS_REFERENCE.md        ← This file!
QUICKSTART.js               ← Quick start script
```

---

## Development Workflow

### Complete Workflow Example

```bash
# 1. Initial Setup (one time)
npm install --legacy-peer-deps

# 2. Start Development
npm run dev

# 3. In another terminal, check code quality
npm run lint

# 4. Make changes in src/ folder
# (Changes auto-reload in browser)

# 5. Before committing, verify build works
npm run build

# 6. Preview production version
npm run preview

# 7. If all good, deploy using guide in SETUP_DEPLOYMENT.md
```

### Quick Start for Team Members

```bash
# Clone repo
git clone <repo-url>
cd payment-platform

# Setup
npm install --legacy-peer-deps

# Start
npm run dev

# View at http://localhost:5173
```

---

## Environment Variables (Future Setup)

When backend integration is needed, create `.env.local`:

```bash
# .env.local (never commit this file!)
VITE_API_URL=http://localhost:3000/api
VITE_API_KEY=your_key_here
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Common Error Solutions

### "Module not found" Error

```bash
# Solution: Reinstall dependencies
npm install --legacy-peer-deps
```

### Port 5173 Already in Use

```bash
# Solution: Kill process on that port
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- --port 3000
```

### Build Fails with TypeScript Errors

```bash
# Check for type errors
tsc -b

# Fix reported errors, then rebuild
npm run build
```

### Hot Reload Not Working

```bash
# Solution: Clear Vite cache and restart
rm -rf .vite
npm run dev
```

---

## Performance Optimization

### Check Bundle Size

```bash
# After building, check dist/ folder
npm run build

# Typical breakdown:
# - JavaScript: ~87 KB (gzipped)
# - CSS: ~5 KB (gzipped)
# - HTML: ~0.3 KB (gzipped)
# - TOTAL: ~92 KB (gzipped)
```

### Monitor Development Performance

In `src/main.tsx`, you can add performance logging:

```typescript
// Measure performance
console.time('App Init');
// ... app code ...
console.timeEnd('App Init');
```

---

## Git & Version Control

```bash
# Check git status
git status

# Stage changes
git add .

# Commit changes
git commit -m "feat: add new feature"

# Push to repository
git push origin main

# Pull latest changes
git pull origin main
```

---

## Docker (Optional Future Setup)

```dockerfile
# Dockerfile for production deployment
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

Build and run:
```bash
docker build -t investplatform .
docker run -p 3000:3000 investplatform
```

---

## Useful VS Code Extensions

Install these for better development experience:

```bash
# ESLint
ext install dbaeumer.vscode-eslint

# Prettier (code formatter)
ext install esbenp.prettier-vscode

# Tailwind CSS IntelliSense
ext install bradlc.vscode-tailwindcss

# TypeScript Vue Plugin
ext install vue.vscode-typescript-vue-plugin

# Thunder Client (API testing)
ext install rangav.vscode-thunder-client
```

---

## Deployment Checklist

Before deploying to production:

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run linting
npm run lint

# 3. Run full build
npm run build

# 4. Verify build output
ls -lh dist/

# 5. Test production build locally
npm run preview

# 6. Check performance
# - Open http://localhost:4173/ in browser
# - Open DevTools → Network tab
# - Check bundle sizes match expected

# 7. Deploy (see SETUP_DEPLOYMENT.md)
```

---

## Quick Reference Table

| Command | Purpose | Usage |
|---------|---------|-------|
| `npm run dev` | Start dev server | Development |
| `npm run build` | Create production build | Before deployment |
| `npm run preview` | Preview production build | Test before deploy |
| `npm run lint` | Check code quality | Code review |
| `npm install --legacy-peer-deps` | Install dependencies | Setup |
| `tsc -b` | TypeScript check | Validation |
| `npm audit` | Security check | Maintenance |

---

## Support & Resources

- **Documentation:** See [INDEX.md](INDEX.md) for full documentation roadmap
- **Troubleshooting:** See [GETTING_STARTED.md](GETTING_STARTED.md)
- **Deployment:** See [SETUP_DEPLOYMENT.md](SETUP_DEPLOYMENT.md)
- **Admin Panel:** See [ADMIN_PANEL_GUIDE.md](ADMIN_PANEL_GUIDE.md)
- **Technical Details:** See [DOCUMENTATION.md](DOCUMENTATION.md)

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Project:** InvestPlatform - Peer-to-Peer Investment Platform
