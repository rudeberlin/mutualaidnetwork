# 🚀 Vercel Frontend Deployment Guide

Complete guide to deploy your Mutual Aid Network **frontend** on Vercel with backend on Render.

## 📋 Architecture

- **Frontend (React):** Deployed on Vercel
- **Backend (Node.js/Express):** Deployed on Render
- **Communication:** Frontend calls backend API via environment variable

---

## 🔧 Step 1: Deploy Backend First

**Important:** Deploy your backend on Render first before deploying frontend.

Follow the [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) guide to deploy your backend.

Once deployed, you'll have a backend URL like:
```
https://mutual-aid-network.onrender.com
```

---

## 📤 Step 2: Prepare Frontend for Vercel

### 2.1 Update API Configuration

The frontend needs to know where your backend is. Update environment configuration:

Create `.env.production`:
```bash
VITE_API_URL=https://your-backend.onrender.com
```

### 2.2 Verify vercel.json

Your [vercel.json](vercel.json) should already be configured:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://your-backend-api.onrender.com"
  }
}
```

---

## 🌐 Step 3: Deploy on Vercel

### Method A: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - Project name? `mutual-aid-network`
   - Directory? `./` (current)
   - Override settings? **No**

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Method B: Vercel Dashboard (Easy)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)

2. Click **"Add New..."** → **"Project"**

3. **Import Git Repository:**
   - Connect your GitHub account
   - Select your `payment-platform` repository
   - Click **"Import"**

4. **Configure Project:**
   - **Project Name:** `mutual-aid-network`
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. **Environment Variables:**
   
   Click **"Environment Variables"** and add:
   
   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://your-backend.onrender.com` |

6. **Deploy:**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build

---

## ✅ Step 4: Update Backend CORS

After Vercel deployment, update your backend to allow requests from Vercel:

1. **Get your Vercel URL:**
   ```
   https://mutual-aid-network.vercel.app
   ```

2. **Update Backend Environment Variables on Render:**
   
   Go to Render Dashboard → Your Service → Environment:
   ```
   CLIENT_URL=https://mutual-aid-network.vercel.app
   ```

3. **Save** (triggers automatic redeployment)

---

## 🧪 Step 5: Test Your Deployment

Visit your Vercel URL and test:

- [ ] Homepage loads
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard displays
- [ ] API calls work (check Network tab)
- [ ] Admin panel accessible
- [ ] Mobile responsive

**Check API Connection:**
Open browser console and verify API calls go to your Render backend URL.

---

## 🔧 Step 6: Configure Custom Domain (Optional)

### On Vercel:

1. Vercel Dashboard → Your Project → **"Settings"** → **"Domains"**

2. Add your domain:
   ```
   www.yourdomain.com
   ```

3. Add DNS records to your domain provider:
   
   **For Vercel:**
   | Type | Name | Value |
   |------|------|-------|
   | CNAME | www | cname.vercel-dns.com |
   | A | @ | 76.76.21.21 |

4. Wait for DNS propagation (5-30 minutes)

5. **Update Backend CORS:**
   Update `CLIENT_URL` on Render to your custom domain:
   ```
   CLIENT_URL=https://www.yourdomain.com
   ```

---

## 🔄 Step 7: Continuous Deployment

Vercel automatically redeploys on git push:

```bash
# Make changes
git add .
git commit -m "Update frontend"
git push origin main

# Vercel automatically rebuilds and deploys
```

**Manual Redeploy:**
Vercel Dashboard → Your Project → **"Deployments"** → **"Redeploy"**

---

## 🐛 Troubleshooting

### Issue 1: API Calls Fail (CORS Error)

**Console Error:**
```
Access to fetch at 'https://backend.onrender.com/api/...' blocked by CORS
```

**Fix:**
1. Check `CLIENT_URL` on Render matches your Vercel URL exactly
2. Ensure backend CORS allows your frontend domain
3. Redeploy backend after updating `CLIENT_URL`

### Issue 2: 404 on Page Refresh

**Fix:** Already handled by `vercel.json` rewrites. If still happening:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Issue 3: Environment Variables Not Working

**Fix:**
1. Vercel Dashboard → Settings → Environment Variables
2. Add `VITE_API_URL`
3. **Important:** Redeploy after adding variables
4. Variable names must start with `VITE_` for Vite

### Issue 4: Build Fails

**Error:**
```
Command "npm run build" exited with 1
```

**Fix:**
1. Test build locally: `npm run build`
2. Check for TypeScript errors
3. Ensure all dependencies in `package.json`
4. Check build logs on Vercel for specific error

---

## 📊 Monitoring

### Vercel Analytics

Enable analytics in Vercel Dashboard:
1. Your Project → **"Analytics"**
2. See real-time visitors, page views, performance

### Performance

Vercel automatically optimizes:
- ✅ Global CDN
- ✅ Edge caching
- ✅ Image optimization
- ✅ Automatic HTTPS

---

## 💡 Pro Tips

1. **Preview Deployments:**
   - Every git branch gets a preview URL
   - Test changes before merging to main

2. **Environment-Specific Configs:**
   ```bash
   # Development
   VITE_API_URL=http://localhost:5000
   
   # Production
   VITE_API_URL=https://api.yourdomain.com
   ```

3. **Free Tier Limits:**
   - 100 GB bandwidth/month
   - Unlimited sites
   - Automatic SSL

4. **Speed Optimization:**
   - Vercel serves from 70+ edge locations
   - First request: ~50ms globally
   - Cached: ~10ms

---

## 🔐 Security Checklist

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables not in git
- [ ] Backend CORS restricted to your domain
- [ ] API URLs use HTTPS
- [ ] No sensitive data in frontend code

---

## 📞 Support

**Vercel Documentation:** https://vercel.com/docs
**Vercel Status:** https://www.vercel-status.com
**Support:** support@vercel.com

---

## 🎉 Success!

Your frontend is now live on Vercel! 🚀

**Your Setup:**
- **Frontend:** https://mutual-aid-network.vercel.app
- **Backend:** https://mutual-aid-network.onrender.com
- **API Calls:** Frontend → Backend via `VITE_API_URL`

**URLs:**
- **Live Site:** Your Vercel URL
- **Admin Panel:** `yoursite.com/admin`
- **API Health:** Backend URL + `/api/health`

---

## 🔄 Update Workflow

1. Make changes locally
2. Test: `npm run dev`
3. Build: `npm run build`
4. Commit: `git add . && git commit -m "Update"`
5. Push: `git push origin main`
6. ✨ Vercel auto-deploys in ~2 minutes

---

**Pro Tip:** Use Vercel's preview deployments for testing. Each pull request gets its own URL before merging to production!
