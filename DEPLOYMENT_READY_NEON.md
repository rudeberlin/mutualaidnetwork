# DEPLOYMENT INSTRUCTIONS - Jan 26, 2026

## ✅ Completed
- Backend connected to Neon PostgreSQL
- Database initialized with schema
- Frontend built successfully  
- Both servers running locally (backend: 5000, frontend: 5174)

## 🚀 DEPLOYMENT STEPS

### Step 1: Deploy Backend to Render

1. Go to **https://render.com**
2. Connect your GitHub repository
3. Create new **Web Service** from `backend` directory
4. Configure:
   - **Build Command:** `npm install && npm run build` (or skip if no build needed)
   - **Start Command:** `npm start`
   - **Environment Variables:**
     ```
     PORT=5000
     NODE_ENV=production
     DATABASE_URL=postgresql://neondb_owner:npg_B4mVPvOzLN2W@ep-tiny-moon-ahxipb6v-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
     JWT_SECRET=your-production-jwt-secret
     ADMIN_EMAIL=admin@mutualaidnetwork.com
     ADMIN_PASSWORD=your-secure-password
     CLIENT_URL=https://your-vercel-frontend-url.vercel.app
     ```

5. Deploy and note the backend URL (e.g., `https://your-backend.onrender.com`)

### Step 2: Deploy Frontend to Vercel

1. Go to **https://vercel.com**
2. Import your GitHub repository
3. Configure:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** `.` (root of repo, not src/)
   - **Environment Variables:**
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```

4. Deploy and get your frontend URL

### Step 3: Update CORS on Backend

After deployment, update backend CORS in `backend/server.js`:
```javascript
const allowedOrigins = [
  'https://your-vercel-frontend-url.vercel.app',
  'https://your-vercel-frontend-url.pages.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
];
```

## 📝 Local Testing

- **Backend:** http://localhost:5000/api/health
- **Frontend:** http://localhost:5174

Test flow:
1. Register account
2. Login
3. Dashboard shows matches, packages, timers
4. Admin panel available at `/admin`

## 🔧 Troubleshooting

**Backend not connecting to Neon:**
- Verify `DATABASE_URL` in .env
- Test: `psql 'postgresql://...'`

**Frontend can't reach backend:**
- Check `VITE_API_URL` environment variable
- CORS headers should allow frontend origin
- Verify backend URL is accessible

**Database errors:**
- Run `node backend/database.js` to reinitialize
- Check PostgreSQL error logs on Neon console

## ✨ Features Now Live

✅ User registration & login with JWT
✅ Payment matching system
✅ Package subscriptions with maturity timers
✅ Help activity tracking (give/receive)
✅ Admin verification & manual matching
✅ ID verification uploads
✅ Payment account management
✅ User statistics & dashboard

---
**Backend:** Neon PostgreSQL (Cloud)
**Frontend:** Vite + React  
**Deployment:** Render (API) + Vercel (UI)
