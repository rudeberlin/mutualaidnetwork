# 🚀 Split Deployment Guide (Option 2)

Deploy frontend on **Vercel** and backend on **Render** for optimal performance.

## 📋 Why This Setup?

**Frontend on Vercel:**
- ⚡ Lightning-fast global CDN
- 🌍 70+ edge locations worldwide
- 🔄 Automatic deployments
- 📊 Built-in analytics
- 💰 Generous free tier

**Backend on Render:**
- 🔒 Secure API server
- 💾 Easy database integration
- 🔄 Auto-deploy from Git
- 📝 Simple environment management
- 💰 Free tier available

---

## 🎯 Deployment Order

**Deploy in this order:**
1. ✅ Backend on Render (API server)
2. ✅ Frontend on Vercel (React app)

---

## 📦 Part 1: Deploy Backend on Render

### Step 1.1: Push to GitHub

```bash
git add .
git commit -m "Split deployment: backend ready"
git push origin main
```

### Step 1.2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub and select repository

### Step 1.3: Configure Backend Service

**Settings:**
- **Name:** `mutual-aid-backend`
- **Region:** Oregon (US West) or closest to you
- **Branch:** `main`
- **Root Directory:** Leave empty
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm run dev:server`

### Step 1.4: Environment Variables on Render

Add these in **Environment** section:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET` | `[Generate 64-char string]` |
| `CLIENT_URL` | `https://[will-add-after-vercel]` |
| `SERVE_FRONTEND` | `false` |

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 1.5: Deploy Backend

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Copy your backend URL: `https://mutual-aid-backend.onrender.com`

### Step 1.6: Test Backend

Visit these endpoints:
- Health: `https://mutual-aid-backend.onrender.com/api/health`
- Packages: `https://mutual-aid-backend.onrender.com/api/packages`

---

## 🎨 Part 2: Deploy Frontend on Vercel

### Step 2.1: Update Environment File

Update `.env.production` with your Render backend URL:

```bash
VITE_API_URL=https://mutual-aid-backend.onrender.com
```

### Step 2.2: Commit Changes

```bash
git add .env.production
git commit -m "Update API URL for Vercel"
git push origin main
```

### Step 2.3: Deploy on Vercel

**Option A: Vercel CLI (Fast)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Option B: Vercel Dashboard (Easy)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Project Name:** `mutual-aid-network`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   
5. **Environment Variables:**
   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://mutual-aid-backend.onrender.com` |

6. Click **"Deploy"**

### Step 2.4: Get Vercel URL

After deployment (2-3 minutes), copy your URL:
```
https://mutual-aid-network.vercel.app
```

---

## 🔗 Part 3: Connect Frontend & Backend

### Step 3.1: Update Backend CORS

Go back to **Render Dashboard** → Your Backend Service → **Environment**

Update `CLIENT_URL`:
```
CLIENT_URL=https://mutual-aid-network.vercel.app
```

Save (triggers automatic redeployment ~1 minute)

### Step 3.2: Verify Connection

Visit your Vercel site and test:
- ✅ Homepage loads
- ✅ Registration works
- ✅ Login works
- ✅ Dashboard displays
- ✅ Check browser console for API calls

---

## 🧪 Testing Checklist

### Frontend (Vercel)
- [ ] Homepage renders correctly
- [ ] Navigation works (all routes)
- [ ] Testimonials carousel functions
- [ ] Package cards display
- [ ] Referral code field in registration

### Backend (Render)
- [ ] `/api/health` returns OK
- [ ] `/api/packages` returns packages
- [ ] Registration endpoint works
- [ ] Login endpoint works
- [ ] JWT tokens generated

### Integration
- [ ] Frontend can call backend APIs
- [ ] CORS allows requests
- [ ] No console errors
- [ ] Registration flow complete
- [ ] Login flow complete
- [ ] Dashboard loads user data
- [ ] Admin panel accessible

---

## 📊 Monitor Both Services

### Vercel Monitoring
- Dashboard → Your Project → **"Analytics"**
- Real-time visitors, performance metrics

### Render Monitoring
- Dashboard → Your Service → **"Logs"**
- API requests, errors, server status

---

## 🚀 Deployment URLs

After successful deployment, you'll have:

**Frontend (Vercel):**
```
https://mutual-aid-network.vercel.app
https://mutual-aid-network.vercel.app/admin
https://mutual-aid-network.vercel.app/register
```

**Backend (Render):**
```
https://mutual-aid-backend.onrender.com/api/health
https://mutual-aid-backend.onrender.com/api/packages
https://mutual-aid-backend.onrender.com/api/register
```

---

## 🔄 Update Workflow

### Update Frontend Only

```bash
# Make changes to React components
git add src/
git commit -m "Update UI"
git push origin main

# Vercel auto-deploys (~2 min)
```

### Update Backend Only

```bash
# Make changes to backend
git add backend/
git commit -m "Update API"
git push origin main

# Render auto-deploys (~3 min)
```

### Update Both

```bash
git add .
git commit -m "Update frontend and backend"
git push origin main

# Both deploy automatically
```

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Error in browser console:**
```
Access to fetch blocked by CORS policy
```

**Fix:**
1. Check `CLIENT_URL` on Render matches your Vercel URL exactly
2. Include protocol: `https://` not `http://`
3. No trailing slash: ✅ `.vercel.app` ❌ `.vercel.app/`
4. Redeploy backend after changing

### Issue: API Calls Fail

**Error:**
```
Failed to fetch
```

**Fix:**
1. Check `VITE_API_URL` in Vercel environment variables
2. Test backend health endpoint directly
3. Check Render logs for errors
4. Verify backend is running (not sleeping)

### Issue: Vercel Build Fails

**Error:**
```
Command "npm run build" exited with 1
```

**Fix:**
1. Test locally: `npm run build`
2. Check TypeScript errors: `npm run lint`
3. Ensure dependencies are in `package.json`
4. Check Vercel build logs for specific error

### Issue: Render Backend Sleeping

**Symptom:** First request takes 30+ seconds

**Fix:**
- Free tier services sleep after 15 min inactivity
- Upgrade to paid tier for 24/7 uptime
- Or use a ping service (e.g., UptimeRobot)

---

## 🎨 Custom Domain Setup

### For Vercel (Frontend)

1. Buy domain from Namecheap, GoDaddy, etc.
2. Vercel Dashboard → Project → **Settings** → **Domains**
3. Add domain: `www.yourdomain.com`
4. Add DNS records:
   - `CNAME` → `www` → `cname.vercel-dns.com`
   - `A` → `@` → `76.76.21.21`

### For Render (Backend - Optional)

1. Render Dashboard → Service → **Settings** → **Custom Domains**
2. Add: `api.yourdomain.com`
3. Add DNS record:
   - `CNAME` → `api` → `[your-service].onrender.com`

### Update URLs

After custom domains:
- Update `CLIENT_URL` on Render: `https://www.yourdomain.com`
- Update `VITE_API_URL` on Vercel: `https://api.yourdomain.com`

---

## 💰 Cost Breakdown

### Free Tier (Both Services)

**Vercel Free:**
- 100 GB bandwidth/month
- Unlimited sites
- 6000 build minutes/month
- ✅ Perfect for starting

**Render Free:**
- 750 hours/month
- API sleeps after 15 min
- 512 MB RAM
- ✅ Good for testing

### Paid Tiers (If Needed)

**Vercel Pro:** $20/month
- 1 TB bandwidth
- Priority support
- Advanced analytics

**Render Starter:** $7/month
- Always-on service
- 512 MB RAM
- No sleeping

---

## 🎉 Success!

Your platform is now split-deployed! 🚀

**Advantages of this setup:**
- ⚡ Faster frontend (Vercel CDN)
- 🔒 Separate backend security
- 📈 Independent scaling
- 🔄 Deploy frontend/backend separately
- 💰 Optimize costs (upgrade only what you need)

---

## 📞 Support

**Vercel:** support@vercel.com | https://vercel.com/docs
**Render:** support@render.com | https://render.com/docs

---

## 🔐 Security Notes

- ✅ HTTPS automatic on both platforms
- ✅ CORS restricted to your Vercel domain
- ✅ JWT secrets secured in environment variables
- ✅ No sensitive data in frontend code
- ✅ Backend API endpoints protected

Your Mutual Aid Network is production-ready! 🎊
