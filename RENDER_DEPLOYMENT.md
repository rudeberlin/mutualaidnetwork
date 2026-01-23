# 🚀 Render Deployment Guide

Complete guide to deploy your Mutual Aid Network platform on Render.

## 📋 Prerequisites

- GitHub account
- Render account (free tier available at render.com)
- Your project pushed to GitHub

---

## 🔧 Step 1: Prepare Your Project

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Test Locally
```bash
# Build frontend
npm run build

# Start backend server
npm start
```

Visit `http://localhost:5000` - you should see your app running.

---

## 📤 Step 2: Push to GitHub

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

---

## 🌐 Step 3: Deploy on Render

### 3.1 Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your `payment-platform` repository

### 3.2 Configure Web Service

**Basic Settings:**
- **Name:** `mutual-aid-network` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** Leave empty
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Instance Type:**
- Free tier: Select **"Free"**
- Paid tier: Select based on your needs

### 3.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET` | *Generate a secure random string* |
| `CLIENT_URL` | *Your Render URL (add after deployment)* |

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes first time)
3. Watch the build logs for any errors

---

## ✅ Step 4: Post-Deployment Configuration

### 4.1 Update CLIENT_URL

1. Copy your Render URL (e.g., `https://mutual-aid-network.onrender.com`)
2. Go to **Environment** tab
3. Update `CLIENT_URL` to your Render URL
4. Save changes (triggers redeployment)

### 4.2 Test Your Deployment

Visit your Render URL:
- **Homepage:** `https://your-app.onrender.com`
- **Health Check:** `https://your-app.onrender.com/api/health`
- **API Test:** `https://your-app.onrender.com/api/packages`

---

## 👤 Step 5: Create Admin User

Your app needs an admin to access the admin panel.

### Option A: Register First User as Admin

1. Register a new account on your live site
2. Use Render Shell to manually set role:
   - Go to Render Dashboard → Your Service
   - Click **"Shell"** tab
   - Run:
     ```bash
     node -e "console.log('Use admin endpoint to upgrade user')"
     ```

### Option B: Add Admin Seeding to Backend

Add this to `backend/server.js` after the server starts:

```javascript
// Seed admin user on first run
const seedAdmin = () => {
  const adminExists = mockDatabase.users.find(u => u.role === 'admin');
  if (!adminExists && process.env.ADMIN_EMAIL) {
    const hashedPassword = bcryptjs.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
    mockDatabase.users.push({
      id: 'admin-1',
      fullName: 'Admin User',
      username: 'admin',
      email: process.env.ADMIN_EMAIL,
      phoneNumber: '+1234567890',
      country: 'USA',
      passwordHash: hashedPassword,
      role: 'admin',
      myReferralCode: 'ADMIN001',
      profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      idDocuments: { frontImage: '', backImage: '', uploadedAt: new Date(), verified: true },
      isVerified: true,
      paymentMethodVerified: true,
      totalEarnings: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Admin user seeded');
  }
};

app.listen(PORT, () => {
  console.log(`✨ Server running on port ${PORT}`);
  seedAdmin();
});
```

Then add these environment variables on Render:
- `ADMIN_EMAIL=admin@yourdomain.com`
- `ADMIN_PASSWORD=YourSecurePassword123`

---

## 🔍 Step 6: Monitor & Troubleshoot

### Check Logs
- Render Dashboard → Your Service → **"Logs"** tab
- Watch for errors during deployment

### Common Issues

**1. Build Fails**
```
Error: Cannot find module 'express'
```
**Fix:** Make sure all dependencies are in `package.json` dependencies (not devDependencies)

**2. App Crashes on Start**
```
Error: PORT is already in use
```
**Fix:** Don't hardcode PORT in server.js, use `process.env.PORT || 5000`

**3. 404 on Routes**
```
Cannot GET /dashboard
```
**Fix:** Add this to `backend/server.js`:
```javascript
// Serve React app for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});
```

**4. CORS Errors**
**Fix:** Update CORS in backend/server.js:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

## 🎯 Step 7: Production Checklist

- [ ] Environment variables set correctly
- [ ] JWT_SECRET is secure random string
- [ ] Admin user created
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test admin panel access
- [ ] Test all package features
- [ ] Check mobile responsiveness
- [ ] Monitor error logs for 24 hours

---

## 🔄 Step 8: Updates & Redeployment

### Auto-Deploy (Recommended)
Render automatically redeploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Manual Deploy
Render Dashboard → Your Service → **"Manual Deploy"** → Select branch

---

## 💾 Step 9: Database Setup (Optional)

For persistent data (users, transactions), add a database:

### PostgreSQL on Render
1. Create **"New PostgreSQL"** database
2. Copy connection string
3. Add to environment: `DATABASE_URL=your-connection-string`
4. Install pg: `npm install pg`
5. Update backend to use database instead of in-memory storage

---

## 📊 Step 10: Custom Domain (Optional)

1. Buy domain from Namecheap, GoDaddy, etc.
2. Render Dashboard → Your Service → **"Settings"**
3. **"Custom Domains"** → **"Add Custom Domain"**
4. Add DNS records to your domain provider:
   - **Type:** `CNAME`
   - **Name:** `@` or `www`
   - **Value:** Your Render URL

---

## 🔐 Security Recommendations

1. **Strong JWT Secret:** Use 64+ character random string
2. **Environment Variables:** Never commit `.env` to GitHub
3. **Rate Limiting:** Add rate limiting to prevent abuse
4. **HTTPS:** Render provides free SSL (already enabled)
5. **Regular Updates:** Keep dependencies updated

---

## 📞 Support

**Render Documentation:** https://render.com/docs
**Render Status:** https://status.render.com
**Support:** support@render.com

---

## 🎉 Success!

Your Mutual Aid Network is now live! 🚀

**Next Steps:**
1. Share your URL with users
2. Monitor analytics and logs
3. Gather user feedback
4. Iterate and improve

**Your Live URLs:**
- **App:** https://your-app-name.onrender.com
- **API:** https://your-app-name.onrender.com/api
- **Health:** https://your-app-name.onrender.com/api/health

---

**Pro Tip:** Free tier services sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds. Upgrade to paid tier for 24/7 uptime.
