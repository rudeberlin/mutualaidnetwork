# 🔧 RENDER DEPLOYMENT TROUBLESHOOTING

## Common Render Deployment Errors & Solutions

### 1. **Build Command Failed**

**Possible Causes:**
- Missing dependencies
- TypeScript compilation errors
- Environment variables not set

**Solution:**
```bash
# Check if build works locally
npm install
npm run build

# If successful, commit and push
git add .
git commit -m "Fix build"
git push origin master
```

---

### 2. **Start Command Failed**

**Error:** `Cannot find module 'express'` or similar

**Solution:** Make sure all backend dependencies are in `dependencies` not `devDependencies`:
- express
- cors
- dotenv
- jsonwebtoken
- bcryptjs
- multer
- pg

All are already in `dependencies` ✅

---

### 3. **Database Connection Error**

**Error:** `ECONNREFUSED` or `Failed to connect to database`

**Solution:** Make sure `DATABASE_URL` environment variable is set on Render:

1. Go to Render Dashboard
2. Select your service
3. Click **Environment** tab
4. Add:
```
DATABASE_URL=postgresql://mutualaidnetwork:BIlyylIlMAgwAWpdCBpWwSwMK6CXWqIB@dpg-d5q03sogjchc73dn7e2g-a.virginia-postgres.render.com/mutualaidnetwork_db
```

---

### 4. **ES Modules Error**

**Error:** `Cannot use import statement outside a module`

**Solution:** Already fixed ✅
- `package.json` has `"type": "module"`
- All imports use `.js` extension
- Backend uses `import` not `require`

---

### 5. **Port Already in Use**

**Error:** `Port 5000 is already in use`

**Solution:** Already fixed ✅
- Server uses `process.env.PORT || 5000`
- Render will set PORT automatically

---

## ✅ Pre-Deployment Checklist

Before redeploying, verify:

- [ ] **Environment Variables Set on Render:**
  - `NODE_ENV=production`
  - `PORT=10000` (Render sets this automatically, but good to have)
  - `JWT_SECRET=<your-secret>`
  - `CLIENT_URL=https://mutualaidnetwork.vercel.app`
  - `DATABASE_URL=postgresql://...` (CRITICAL!)
  - `SERVE_FRONTEND=false`

- [ ] **Build Command:** `npm install && npm run build`
- [ ] **Start Command:** `npm start`
- [ ] **Branch:** `master` (your current branch)
- [ ] **Runtime:** Node

---

## 🔍 How to Check Render Logs

1. Go to Render Dashboard: https://dashboard.render.com
2. Select your service: **mutualaidnetwork**
3. Click **Logs** tab
4. Look for error messages

**Common log errors:**

### Error: "Module not found"
```
Error: Cannot find module 'pg'
```
**Fix:** Check that `pg` is in dependencies (it is ✅)

### Error: "Database initialization failed"
```
❌ Error initializing database
```
**Fix:** Make sure DATABASE_URL is set correctly

### Error: "CORS error"
```
Access-Control-Allow-Origin header
```
**Fix:** Make sure CLIENT_URL is set to `https://mutualaidnetwork.vercel.app`

---

## 🚀 Manual Redeploy

If auto-deploy isn't working:

1. Go to Render Dashboard
2. Select your service
3. Click **Manual Deploy** → **Deploy latest commit**
4. Select branch: `master`
5. Click **Deploy**

---

## 🧪 Test Backend Locally

To verify the backend works before deploying:

```bash
# Set environment variables locally
$env:DATABASE_URL="postgresql://mutualaidnetwork:BIlyylIlMAgwAWpdCBpWwSwMK6CXWqIB@dpg-d5q03sogjchc73dn7e2g-a.virginia-postgres.render.com/mutualaidnetwork_db"
$env:CLIENT_URL="https://mutualaidnetwork.vercel.app"
$env:NODE_ENV="production"

# Start server
npm start

# Test endpoints
# Open another terminal and test:
curl http://localhost:5000/api/health
curl http://localhost:5000/api/packages
```

---

## 📝 Latest Changes Pushed

**Commit:** `Fix admin login issue - transform database fields to camelCase`

**Changes:**
- Fixed field name transformation in `/api/login`
- Fixed field name transformation in `/api/register`
- Admin users now redirect to `/admin` instead of `/dashboard`

**Syntax verified:** ✅ Server starts without errors locally

---

## 🔄 Force Fresh Deploy

If deployment keeps failing, try a fresh build:

1. **On Render:**
   - Dashboard → Your Service → Settings
   - Scroll to "Clear Build Cache & Deploy"
   - Click button
   - This forces Render to rebuild from scratch

2. **Or manually trigger:**
   ```bash
   # Make a small change to trigger rebuild
   git commit --allow-empty -m "Trigger redeploy"
   git push origin master
   ```

---

## 🆘 If Still Failing

**Check these in order:**

1. **Verify Git Push Succeeded:**
   ```bash
   git log --oneline -5
   # Should show: "Fix admin login issue..."
   ```

2. **Check Render is Connected to Correct Repo:**
   - Dashboard → Your Service → Settings
   - Verify GitHub repository is correct
   - Verify branch is `master`

3. **Check Node Version:**
   - Render uses Node 20 by default
   - Our package.json doesn't specify version (good)
   - Should work with Node 14+

4. **Check for Render Service Outages:**
   - Visit: https://status.render.com
   - Look for any ongoing incidents

5. **Contact Render Support:**
   - If nothing works, check Render community forum
   - Or contact support@render.com with your logs

---

## 📊 Expected Successful Deploy Logs

When deployment succeeds, you should see:

```
==> Downloading dependencies...
✓ 2466 modules transformed
✓ built in 3.39s

==> Starting service with 'npm start'...
✨ Mutual Aid Network Server running on http://0.0.0.0:10000
📚 Health check: http://0.0.0.0:10000/api/health
🌍 Environment: production
🔗 CORS allowed origin: https://mutualaidnetwork.vercel.app
🔄 Initializing database...
✅ Connected to PostgreSQL database
✅ Database tables initialized successfully
✅ Default admin user created
📧 Admin Email: admin@mutualaidnetwork.com
🔑 Admin Password: Admin123!@#
✅ Database initialized successfully
```

---

## 🎯 Next Steps After Successful Deploy

1. **Test Backend:**
   - https://mutualaidnetwork.onrender.com/api/health
   - Should return: `{"status":"healthy"}`

2. **Test Admin Login:**
   - Go to: https://mutualaidnetwork.vercel.app/login
   - Email: `admin@mutualaidnetwork.com`
   - Password: `Admin123!@#`
   - Should redirect to `/admin`

3. **Check Database:**
   - Connect to PostgreSQL using provided credentials
   - Run: `SELECT * FROM users WHERE role = 'admin';`
   - Should see admin user

---

**If you see specific error messages in Render logs, share them and I can provide more specific solutions!**
