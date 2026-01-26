# 🚀 DEPLOYMENT INSTRUCTIONS - Ready to Deploy

## Prerequisites Completed ✅
- Backend running on Neon PostgreSQL
- Cloudinary credentials configured
- Frontend production build successful
- All features tested and verified
- Code committed to GitHub

---

## STEP 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to **https://render.com**
2. Sign up/login (use GitHub for easy repo connection)

### 1.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `rudeberlin/mutualaidnetwork`
3. Select the repository

### 1.3 Configure Service
- **Name:** `mutualaidnetwork-backend` (or your choice)
- **Region:** Choose closest to your users
- **Branch:** `master`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Instance Type:** Free (or paid for better performance)

### 1.4 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add these:

```
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_B4mVPvOzLN2W@ep-tiny-moon-ahxipb6v-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=mutual-aid-network-super-secret-jwt-key-2026
ADMIN_EMAIL=admin@mutualaidnetwork.com
ADMIN_PASSWORD=AdminSecure2026!
CLIENT_URL=http://localhost:5174
CLOUDINARY_CLOUD_NAME=ds4q9esli
CLOUDINARY_API_KEY=751834956762552
CLOUDINARY_API_SECRET=OLU6GGIZnWHq4Ja0YKAw2EgbIFI
```

**IMPORTANT:** After frontend deployment, you'll update `CLIENT_URL` to your Vercel URL

### 1.5 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. **COPY YOUR BACKEND URL** (e.g., `https://mutualaidnetwork-backend.onrender.com`)

### 1.6 Verify Backend
Once deployed, test: `https://YOUR-BACKEND-URL/api/health`
Should return: `{"status":"ok","database":"connected"}`

---

## STEP 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to **https://vercel.com**
2. Sign up/login with GitHub

### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository: `rudeberlin/mutualaidnetwork`
3. Click **"Import"**

### 2.3 Configure Project
- **Framework Preset:** Vite
- **Root Directory:** `./` (leave as root)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install --legacy-peer-deps`

### 2.4 Add Environment Variable
Click **"Environment Variables"** and add:

```
VITE_API_URL=https://YOUR-BACKEND-URL-FROM-RENDER.onrender.com
```

**Replace with your actual Render backend URL from Step 1.5**

### 2.5 Deploy
1. Click **"Deploy"**
2. Wait 2-5 minutes for build
3. **COPY YOUR FRONTEND URL** (e.g., `https://mutualaidnetwork.vercel.app`)

---

## STEP 3: Update Backend CORS

### 3.1 Update CLIENT_URL on Render
1. Go back to Render dashboard
2. Select your backend service
3. Go to **"Environment"** tab
4. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://YOUR-VERCEL-URL.vercel.app
   ```
5. Click **"Save Changes"**
6. Service will auto-redeploy

### 3.2 Verify CORS (Optional - Backend auto-allows Vercel domains)
The backend already has wildcard CORS configured, but for production you may want to restrict it later.

---

## STEP 4: Test Deployment

### 4.1 Backend Health Check
Visit: `https://YOUR-BACKEND-URL.onrender.com/api/health`

Expected response:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### 4.2 Frontend Access
Visit: `https://YOUR-VERCEL-URL.vercel.app`

### 4.3 Complete User Flow Test
1. **Register:** Create new account
2. **Login:** Authenticate successfully
3. **Dashboard:** View user statistics
4. **Offer Help:** Select package, upload ID
5. **Admin Panel:** Navigate to `/admin`, verify pending requests
6. **Manual Match:** Test matching users
7. **Maturity Timer:** Verify countdown displays
8. **Receive Help:** Test receive help functionality

---

## 🎉 Deployment Complete!

Your application is now live at:
- **Frontend:** https://YOUR-VERCEL-URL.vercel.app
- **Backend:** https://YOUR-BACKEND-URL.onrender.com
- **Admin Panel:** https://YOUR-VERCEL-URL.vercel.app/admin

### Production URLs to Share:
- **Main Site:** Your Vercel URL
- **Login:** https://YOUR-VERCEL-URL.vercel.app/login
- **Admin:** https://YOUR-VERCEL-URL.vercel.app/admin

---

## 🔧 Troubleshooting

### Backend Deploy Fails
- Check build logs on Render dashboard
- Verify all environment variables are set correctly
- Ensure Neon database is accessible (no IP restrictions)

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` in Vercel environment variables
- Check backend `/api/health` endpoint responds
- Look at browser console for CORS errors

### Database Connection Issues
- Test Neon connection: Login to Neon console, verify database is active
- Check DATABASE_URL includes `?sslmode=require`
- Verify no connection limits reached on Neon free tier

### Cloudinary Images Not Uploading
- Verify all 3 Cloudinary env vars set on Render
- Check backend logs for Cloudinary errors
- Test Cloudinary credentials in dashboard

---

## 📝 Post-Deployment Tasks

1. **Update README.md** with live URLs
2. **Test all features** with real users
3. **Monitor logs** on Render dashboard (first few days)
4. **Set up custom domain** (optional):
   - Render: Add custom domain in settings
   - Vercel: Add domain in project settings
5. **Enable auto-deploy:** Both platforms auto-deploy on `git push`

---

## 🎯 Next Steps

- Share the live URL with users
- Monitor error logs on Render
- Consider upgrading to paid tiers for better performance
- Set up monitoring/alerting (optional)
- Configure backups for Neon database (Neon console)

**Support:** Check TROUBLESHOOTING.md for common issues
