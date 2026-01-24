# 🔧 Render Environment Variables Setup

## Critical Environment Variables Required for Render Deployment

Go to your Render Dashboard → Your Service → **Environment** tab and add these:

### 1. Database Connection (CRITICAL)
```
DATABASE_URL=postgresql://mutualaidnetwork:BIlyylIlMAgwAWpdCBpWwSwMK6CXWqIB@dpg-d5q03sogjchc73dn7e2g-a.virginia-postgres.render.com/mutualaidnetwork_db
```

### 2. Server Configuration
```
NODE_ENV=production
PORT=10000
```

### 3. Security
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production-use-64-character-random-string
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. CORS Configuration
```
CLIENT_URL=https://mutualaidnetwork.vercel.app
```
*(Or your Render backend URL if serving frontend from there)*

### 5. Admin Credentials (For Seeding)
```
ADMIN_EMAIL=admin@mutualaidnetwork.com
ADMIN_PASSWORD=Admin123!@#
```

### 6. Frontend Serving
```
SERVE_FRONTEND=true
```
*(Set to `true` if serving frontend from Render, `false` if using Vercel)*

---

## Complete Environment Variables List

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | `postgresql://mutualaidnetwork:...` | PostgreSQL connection string |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Server port (Render uses 10000) |
| `JWT_SECRET` | `<64-char-random-string>` | JWT token signing secret |
| `CLIENT_URL` | `https://mutualaidnetwork.vercel.app` | Frontend URL for CORS |
| `ADMIN_EMAIL` | `admin@mutualaidnetwork.com` | Default admin email |
| `ADMIN_PASSWORD` | `Admin123!@#` | Default admin password |
| `SERVE_FRONTEND` | `true` or `false` | Whether to serve React from backend |

---

## After Adding Environment Variables

1. **Save changes** - This will trigger a redeploy
2. **Wait 5-10 minutes** for deployment to complete
3. **Check logs** for:
   ```
   ✅ Connected to PostgreSQL database
   ✅ Database tables initialized successfully
   ✅ Default admin user created
   ```

4. **Test the deployment:**
   - Health check: `https://mutualaidnetwork.onrender.com/api/health`
   - Packages: `https://mutualaidnetwork.onrender.com/api/packages`
   - Login: `https://mutualaidnetwork.onrender.com/api/login`

---

## Testing Admin Login

**After deployment completes, test admin login:**

### Option 1: Using curl (from terminal)
```bash
curl -X POST https://mutualaidnetwork.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mutualaidnetwork.com","password":"Admin123!@#"}'
```

### Option 2: Using the frontend
1. Go to: https://mutualaidnetwork.vercel.app/login
2. Email: `admin@mutualaidnetwork.com`
3. Password: `Admin123!@#`
4. Should redirect to `/admin` page

---

## Troubleshooting

### Error: "Cannot connect to database"
- **Check:** DATABASE_URL is set correctly
- **Verify:** Database is running on Render
- **Ensure:** SSL is enabled in database connection

### Error: "Invalid email or password"
- **Wait:** Database may still be initializing
- **Check logs:** Look for "✅ Default admin user created"
- **Verify:** Admin was seeded by checking database directly

### Error: "CORS policy blocked"
- **Check:** CLIENT_URL matches your frontend URL
- **Verify:** No trailing slash in CLIENT_URL
- **Ensure:** CORS is enabled in backend/server.js

### Error: "JWT malformed"
- **Check:** JWT_SECRET is set
- **Ensure:** Same JWT_SECRET on all environments
- **Verify:** Token is being sent in Authorization header

---

## Vercel Environment Variables

If using Vercel for frontend, also add these to Vercel:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://mutualaidnetwork.onrender.com` |

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

---

## Security Best Practices

1. **Never commit `.env` to git** (already in .gitignore)
2. **Use strong passwords** - Change default admin password after first login
3. **Rotate JWT_SECRET** periodically
4. **Use HTTPS** - Render provides this automatically
5. **Monitor logs** - Check for suspicious activity

---

## Next Steps After Setup

1. ✅ Add all environment variables to Render
2. ✅ Wait for deployment to complete
3. ✅ Test health endpoint
4. ✅ Test admin login
5. ✅ Access admin panel
6. ✅ Change default admin password
7. ✅ Create regular test user account
8. ✅ Test all features

---

**Your deployment should now be working! 🚀**

If you continue to have issues, check the Render logs for specific error messages.
