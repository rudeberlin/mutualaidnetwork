# Production Deployment Guide

## 🚀 Quick Start Deployment

This guide covers deploying your Mutual Aid Network payment platform to production.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
4. [Build Process](#build-process)
5. [Post-Deployment](#post-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` - verify 0 errors
- [ ] Test all user flows locally (`npm run dev`)
- [ ] Test admin panel access (Settings icon → Admin Panel)
- [ ] Verify responsive design on mobile
- [ ] Check all links and navigation
- [ ] Review environment variables
- [ ] Backup database/data
- [ ] Test payment integration
- [ ] Verify email notifications work

**Command:**
```bash
npm run build
```

Expected output: ✓ Clean build with 0 TypeScript errors

---

## 🔧 Environment Setup

### Development Environment Variables

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Mutual Aid Network
VITE_ENVIRONMENT=development
```

### Production Environment Variables

Create `.env.production` or set in deployment platform:

```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Mutual Aid Network
VITE_ENVIRONMENT=production
NODE_ENV=production
```

---

## 🌐 Deployment Options

### **Option 1: Vercel (Recommended - Easiest)**

**Best for:** Quick deployment with zero configuration

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Vercel Auto-Detects:**
   - Build: `npm run build`
   - Output: `dist/`

3. **Configure:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: Add production .env vars

4. **Deploy:**
   ```bash
   vercel --prod
   ```

**Pros:** Free tier available, auto-scaling, SSL included, edge caching
**Cons:** Limited to frontend-only (use backend API separately)

---

### **Option 2: Netlify**

**Best for:** GitHub integration with automatic deployments

1. **Connect GitHub**
   - Go to netlify.com
   - Click "New site from Git"
   - Select GitHub repository

2. **Configure Build:**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Add Environment Variables:**
   - Go to Site Settings → Environment
   - Add `VITE_API_URL` and other variables

4. **Deploy:**
   - Push to `main` branch
   - Netlify auto-builds

**Pros:** Easy GitHub sync, free tier, good free tier limits
**Cons:** Limited free tier build minutes

---

### **Option 3: AWS Amplify**

**Best for:** Full AWS integration with backend

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Select GitHub repository

2. **Configure Build Settings:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - 'node_modules/**/*'
   ```

3. **Deploy:**
   ```bash
   amplify publish
   ```

**Pros:** Full AWS integration, auto-scaling, good backend integration
**Cons:** More complex setup, paid services

---

### **Option 4: GitHub Pages (Free)**

**Best for:** Simple portfolio hosting

1. **Update vite.config.ts:**
   ```typescript
   export default defineConfig({
     base: '/payment-platform/',  // your repo name
     // ... rest of config
   })
   ```

2. **Create GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

**Pros:** Free, simple, integrated with GitHub
**Cons:** Static site only, no backend, custom domain requires setup

---

### **Option 5: Docker + Self-Hosted (VPS/Dedicated)**

**Best for:** Full control, self-hosted server

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:18-alpine
   RUN npm install -g serve
   COPY --from=build /app/dist /usr/share/app/dist
   WORKDIR /usr/share/app
   EXPOSE 3000
   CMD ["serve", "-s", "dist", "-l", "3000"]
   ```

2. **Build Image:**
   ```bash
   docker build -t payment-platform .
   ```

3. **Run Container:**
   ```bash
   docker run -p 3000:3000 payment-platform
   ```

4. **Deploy to VPS (e.g., DigitalOcean, Linode):**
   ```bash
   docker push your-registry/payment-platform
   # SSH into VPS
   docker pull your-registry/payment-platform
   docker run -d -p 80:3000 --name payment-app your-registry/payment-platform
   ```

**Pros:** Full control, predictable costs, scalability
**Cons:** More complex, requires DevOps knowledge

---

## 🔨 Build Process

### Step 1: Install Dependencies
```bash
cd c:\Users\mrrud\OneDrive\Desktop\projects\payment-platform
npm install
```

### Step 2: Build Application
```bash
npm run build
```

**Expected Output:**
```
✓ 2043 modules transformed.
dist/index.html                 0.46 kB │ gzip:  0.29 kB
dist/assets/index-cm-wkNSX.css  51.49 kB │ gzip:  8.30 kB
dist/assets/index-D07i8TX-.js   358.76 kB │ gzip: 98.17 kB
✓ built in 3.49s
```

### Step 3: Test Build Locally
```bash
npm run preview
```

Visit `http://localhost:4173` to verify

### Step 4: Verify Build Size
- CSS: ~8.3 kB (gzip)
- JS: ~98 kB (gzip)
- Total: ~107 kB (excellent for production)

---

## 🚀 Post-Deployment

### 1. Configure Domain (if using custom domain)

**For Vercel:**
```bash
vercel domains add yourdomain.com
# Then update DNS records at your registrar
```

**For Netlify:**
- Go to Site Settings → Domain Management
- Follow DNS configuration steps

**For Self-Hosted:**
- Point DNS A record to server IP
- Configure SSL with Let's Encrypt or Cloudflare

### 2. Set Up HTTPS/SSL

**Vercel/Netlify:** Automatic
**Self-Hosted:** Use Let's Encrypt
```bash
certbot certonly --standalone -d yourdomain.com
```

### 3. Configure API Endpoints

Update production environment variables to point to your backend API:

```env
VITE_API_URL=https://api.yourdomain.com
```

### 4. Test Production Build

After deployment:
- [ ] Visit your domain
- [ ] Test login/register flow
- [ ] Test dashboard features
- [ ] Test admin panel access (Settings icon)
- [ ] Verify all images load
- [ ] Check responsive design on mobile
- [ ] Test referral code generation
- [ ] Verify transaction display
- [ ] Check maturity timer countdown

---

## 📊 Monitoring & Maintenance

### Set Up Monitoring

**Option 1: Using Sentry (Error Tracking)**

1. **Sign up** at sentry.io

2. **Install Sentry:**
   ```bash
   npm install @sentry/react @sentry/tracing
   ```

3. **Initialize in main.tsx:**
   ```typescript
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: "production",
     tracesSampleRate: 0.1,
   });
   ```

**Option 2: Using LogRocket (Session Replay)**
- Go to logrocket.com
- Record user sessions and errors
- Replay issues to debug

### Health Checks

Create health check endpoint `/api/health`:

**Backend (if using Node.js backend):**
```javascript
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

**Monitor with:**
```bash
curl https://yourdomain.com/api/health
```

### Performance Monitoring

Use Vercel/Netlify Analytics (free tier includes performance metrics)

- **Page Load Time:** Target < 2 seconds
- **Largest Contentful Paint (LCP):** Target < 2.5 seconds
- **Cumulative Layout Shift (CLS):** Target < 0.1

### Database Backups

If using database:
```bash
# Daily automated backups
# Store in S3/cloud storage
# Test restore procedures monthly
```

---

## 🔐 Security Checklist

Before going live:

- [ ] Enable HTTPS/SSL on all domains
- [ ] Set secure HTTP headers (Content-Security-Policy, X-Frame-Options)
- [ ] Implement CORS properly (only allow your domain)
- [ ] Validate all user inputs
- [ ] Never commit secrets to git (.env files)
- [ ] Use environment variables for API keys
- [ ] Implement rate limiting on API
- [ ] Enable 2FA for admin accounts
- [ ] Regular security audits
- [ ] Monitor for dependencies vulnerabilities:
  ```bash
  npm audit
  ```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
npm run build
```

### Admin Panel Not Showing
- Open dashboard and click Settings icon (⚙️) in navbar
- Select "Admin Panel" from dropdown
- If not visible, ensure you're logged into dashboard

### Images Not Loading
- Check paths start with `/` (public folder)
- Verify image files exist in `public/` folder
- Check browser console for 404 errors

### API Calls Failing
- Verify `VITE_API_URL` environment variable
- Check CORS settings on backend
- Verify backend is running on production

### Referral Codes Not Persisting
- Check localStorage is enabled in browser
- Clear browser cache and reload
- Check browser console for errors

---

## 📞 Support & Resources

- **GitHub:** github.com/yourusername/payment-platform
- **Email:** support@mutualaidnetwork.com
- **Docs:** See DOCUMENTATION.md
- **Admin Guide:** See ADMIN_PANEL_GUIDE.md

---

## Quick Deployment Commands

### Vercel (Fastest)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Preview Locally
```bash
npm run preview
```

---

**Last Updated:** January 2026
**Status:** Ready for Production Deployment ✅
