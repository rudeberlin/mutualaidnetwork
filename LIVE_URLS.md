# 🚀 LIVE DEPLOYMENT CONFIGURATION

## ✅ Your Live URLs

**Frontend (Vercel):**
```
https://mutualaidnetwork.vercel.app
```

**Backend (Render):**
```
https://mutualaidnetwork.onrender.com
```

---

## 📝 Environment Variables Setup

### On Render (Backend)

Set these environment variables in your Render dashboard:

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=[your-64-char-secret-from-crypto]
CLIENT_URL=https://mutualaidnetwork.vercel.app
SERVE_FRONTEND=false
ADMIN_EMAIL=admin@mutualaid.com
ADMIN_PASSWORD=[your-secure-password]
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### On Vercel (Frontend)

Set these environment variables in your Vercel dashboard:

```env
VITE_API_URL=https://mutualaidnetwork.onrender.com
```

---

## 🎯 Deployment Steps

### Step 1: Deploy Backend on Render

1. Go to https://dashboard.render.com
2. Create New Web Service
3. Connect GitHub repository: `payment-platform`
4. Configure:
   - **Name:** mutualaidnetwork
   - **Build Command:** `npm install`
   - **Start Command:** `npm run dev:server`
5. Add environment variables (see above)
6. Deploy

**Test backend:**
- Health: https://mutualaidnetwork.onrender.com/api/health
- Packages: https://mutualaidnetwork.onrender.com/api/packages

### Step 2: Deploy Frontend on Vercel

1. Go to https://vercel.com/dashboard
2. Import your GitHub repository
3. Configure:
   - **Project Name:** mutualaidnetwork
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://mutualaidnetwork.onrender.com`
5. Deploy

### Step 3: Verify Connection

Visit https://mutualaidnetwork.vercel.app and test:
- ✅ Homepage loads
- ✅ Registration works
- ✅ Login works
- ✅ Dashboard displays
- ✅ Admin panel accessible at /admin

---

## 🔧 Quick Fixes

### If CORS errors appear:

Make sure on Render environment variables:
```
CLIENT_URL=https://mutualaidnetwork.vercel.app
```
(No trailing slash, include https://)

### If API calls fail:

Check Vercel environment variable:
```
VITE_API_URL=https://mutualaidnetwork.onrender.com
```

### If backend is sleeping:

- Free tier sleeps after 15 min
- First request takes ~30 seconds to wake up
- Consider upgrading to paid tier for 24/7 uptime

---

## 📋 Pre-Launch Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test admin access
- [ ] Test all API endpoints
- [ ] Check mobile responsiveness
- [ ] Monitor logs for errors

---

## 🎉 You're Live!

Your Mutual Aid Network is now accessible at:

**https://mutualaidnetwork.vercel.app**

Admin Panel:
**https://mutualaidnetwork.vercel.app/admin**

API Health Check:
**https://mutualaidnetwork.onrender.com/api/health**
