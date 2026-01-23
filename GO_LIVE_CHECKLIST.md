# 🚀 DEPLOYMENT CHECKLIST - Going Live

## ✅ Pre-Deployment Checklist

### 1. Database Configuration (COMPLETED)
- ✅ PostgreSQL database created on Render
- ✅ Database schema initialized (5 tables)
- ✅ Connection pool configured with SSL
- ✅ Default packages seeded

### 2. Backend Configuration
- ✅ All endpoints converted to PostgreSQL
- ✅ JWT token expiry set to 10 minutes (auto-logout)
- ✅ Password validation with proper error messages
- ✅ Admin middleware using database queries
- ✅ File upload configured (5MB limit)

### 3. Frontend Configuration
- ✅ Auto-logout hook created (10 min inactivity)
- ✅ API URL configured for production
- ✅ Error handling for login/registration
- ✅ BTC payment method with wallet field
- ✅ Referral code support

---

## 🔧 Render Backend Deployment

### Step 1: Add Environment Variables on Render
Go to your Render dashboard → Select your backend service → Environment

Add these environment variables:
```
DATABASE_URL=postgresql://mutualaidnetwork:BIlyylIlMAgwAWpdCBpWwSwMK6CXWqIB@dpg-d5q03sogjchc73dn7e2g-a.virginia-postgres.render.com/mutualaidnetwork_db

JWT_SECRET=mutual-aid-network-secret-key-change-in-production

CLIENT_URL=https://mutualaidnetwork.vercel.app

SERVE_FRONTEND=false

NODE_ENV=production

PORT=5000
```

### Step 2: Verify Build Command
Make sure your Render service has:
- **Build Command**: `npm install`
- **Start Command**: `npm run dev:server`

### Step 3: Deploy Backend
```bash
# Push your code to GitHub
git add .
git commit -m "Add PostgreSQL database with auto-logout and security"
git push origin master
```

Render will auto-deploy when you push to your connected branch.

---

## 🌐 Vercel Frontend Deployment

### Step 1: Verify Environment Variables on Vercel
Go to Vercel dashboard → Select your project → Settings → Environment Variables

Make sure you have:
```
VITE_API_URL=https://mutualaidnetwork.onrender.com
```

### Step 2: Deploy Frontend
Vercel auto-deploys when you push to GitHub. Your latest changes will be deployed automatically.

---

## 🧪 Testing After Deployment

### 1. Test Database Connection
Visit: `https://mutualaidnetwork.onrender.com/api/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-XX-XX..."
}
```

### 2. Test Registration
1. Go to: `https://mutualaidnetwork.vercel.app/register`
2. Fill in the form with test data
3. Submit registration
4. Check if user is created (you should be redirected to dashboard)

### 3. Test Login
1. Go to: `https://mutualaidnetwork.vercel.app/login`
2. Try logging in with **wrong password** - should show "Invalid email or password"
3. Try logging in with **unregistered email** - should show "Invalid email or password"
4. Log in with correct credentials - should redirect to dashboard

### 4. Test Auto-Logout
1. Log in to the platform
2. Leave the browser idle for 10 minutes (no clicks, no typing, no scrolling)
3. After 10 minutes, you should see an alert: "You have been logged out due to inactivity"
4. Try to access any protected page - should redirect to login

### 5. Test Admin Panel
1. Create an admin user or update your user role in database
2. Log in as admin
3. Go to: `https://mutualaidnetwork.vercel.app/admin`
4. Verify all admin pages load correctly

---

## 📊 Database Management

### View Database on Render
1. Go to Render Dashboard
2. Select your PostgreSQL database
3. Click "Connect" → Copy the external connection URL
4. Use any PostgreSQL client (pgAdmin, DBeaver, TablePlus) to connect

### Useful SQL Queries

**View all users:**
```sql
SELECT id, full_name, email, role, is_verified, created_at FROM users;
```

**View all packages:**
```sql
SELECT * FROM packages WHERE active = true;
```

**View all transactions:**
```sql
SELECT t.*, u.full_name 
FROM transactions t 
JOIN users u ON t.user_id = u.id 
ORDER BY t.created_at DESC 
LIMIT 20;
```

**Make a user admin:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

**View help activities:**
```sql
SELECT * FROM help_activities ORDER BY created_at DESC LIMIT 20;
```

---

## 🔒 Security Features Implemented

✅ **Password Security**
- Passwords hashed with bcryptjs (10 salt rounds)
- Passwords never stored in plain text
- Login error messages don't reveal if email exists

✅ **JWT Authentication**
- Tokens expire after 10 minutes
- Secure token generation with JWT_SECRET
- Token verification on all protected routes

✅ **Auto-Logout**
- Frontend monitors user activity (mouse, keyboard, scroll, touch)
- Automatically logs out after 10 minutes of inactivity
- Alert shown before logout

✅ **Admin Protection**
- Role-based access control
- Database queries verify admin status
- Unauthorized access blocked with 403 errors

✅ **CORS Protection**
- Backend only accepts requests from Vercel domain
- Prevents unauthorized API access

✅ **File Upload Security**
- 5MB file size limit
- Only image files accepted (jpg, jpeg, png, gif)
- Multer middleware for safe file handling

---

## 🐛 Troubleshooting

### Issue: "Database connection failed"
**Solution**: 
- Check that DATABASE_URL is correctly set in Render environment variables
- Verify database is running on Render
- Check SSL configuration in database.js

### Issue: "CORS error"
**Solution**:
- Verify CLIENT_URL matches your Vercel URL exactly
- Make sure there's no trailing slash in CLIENT_URL
- Check CORS middleware in server.js

### Issue: "Auto-logout not working"
**Solution**:
- Check browser console for errors
- Verify useAutoLogout hook is called in App.tsx
- Test with shorter timeout (e.g., 1 minute) to debug

### Issue: "Wrong password doesn't show error"
**Solution**:
- Check backend logs on Render
- Verify /api/login endpoint is using PostgreSQL
- Make sure axios is catching error responses

### Issue: "Can't create admin user"
**Solution**:
- Connect to database directly using pgAdmin or similar
- Run SQL: `UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';`
- Log out and log back in

---

## 📝 Post-Deployment Tasks

1. **Create Admin Account**
   - Register a regular user
   - Connect to database and update role to 'admin'
   - Test admin panel access

2. **Monitor Logs**
   - Check Render logs for errors
   - Monitor Vercel deployment logs
   - Watch for database connection issues

3. **Test All Features**
   - User registration and login
   - Package selection
   - Payment method setup
   - Admin verification queue
   - Transaction history

4. **Update Documentation**
   - Document any custom configurations
   - Add admin credentials (store securely)
   - Note any environment-specific settings

---

## 🎉 You're Live!

Your Mutual Aid Network platform is now deployed with:
- ✅ PostgreSQL database for persistent data
- ✅ Auto-logout after 10 minutes
- ✅ Secure password validation
- ✅ Admin panel with full control
- ✅ File upload for ID verification
- ✅ Real-time transaction tracking

**Frontend**: https://mutualaidnetwork.vercel.app
**Backend**: https://mutualaidnetwork.onrender.com
**Database**: PostgreSQL on Render

---

## 📞 Need Help?

If you encounter issues:
1. Check Render logs: Dashboard → Service → Logs
2. Check Vercel logs: Dashboard → Deployments → View Logs
3. Test API endpoints directly: Use Postman or curl
4. Verify environment variables are set correctly

Good luck with your launch! 🚀
