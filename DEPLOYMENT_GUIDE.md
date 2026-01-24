# 🚀 DEPLOYMENT GUIDE - Mutual Aid Network

## ✅ Pre-Deployment Checklist

- [x] Frontend build successful (`npm run build`)
- [x] Backend server tested locally
- [x] Database connection configured
- [x] Environment variables set
- [x] All features implemented and tested

---

## 📦 **Deployment Options**

### **Option 1: Vercel (Frontend) + Render (Backend)** ⭐ RECOMMENDED

This is a split deployment approach:
- **Frontend**: Deployed on Vercel (free tier, excellent performance)
- **Backend**: Deployed on Render (free tier, PostgreSQL included)

#### **Step 1: Deploy Backend to Render**

1. **Go to [Render Dashboard](https://render.com)**
2. Click **"New +"** → **"Web Service"**
3. **Connect Repository**:
   - Connect your GitHub repository
   - Select: `payment-platform`
4. **Configure Service**:
   ```
   Name: mutual-aid-network-backend
   Region: Oregon (US West) or closest to you
   Branch: main (or master)
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Environment Variables** (Add these in Render):
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-here
   ADMIN_EMAIL=admin@mutualaidnetwork.com
   ADMIN_PASSWORD=Admin123!@#
   CLIENT_URL=https://your-vercel-url.vercel.app
   DATABASE_URL=postgresql://mutualaidnetwork:BIlyylIlMAgwAWpdCBpWwSwMK6CXWqIB@dpg-d5q03sogjchc73dn7e2g-a.virginia-postgres.render.com/mutualaidnetwork_db
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (3-5 minutes)
8. **Copy your backend URL**: `https://mutual-aid-network-backend.onrender.com`

#### **Step 2: Deploy Frontend to Vercel**

1. **Go to [Vercel Dashboard](https://vercel.com)**
2. Click **"Add New"** → **"Project"**
3. **Import Repository**:
   - Connect GitHub
   - Select: `payment-platform`
4. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Environment Variables**:
   ```
   VITE_API_URL=https://mutual-aid-network-backend.onrender.com
   ```

6. Click **"Deploy"**
7. Wait for deployment (1-2 minutes)
8. **Your live URL**: `https://mutual-aid-network.vercel.app`

9. **Update Backend CLIENT_URL**:
   - Go back to Render → Your Backend Service
   - Update `CLIENT_URL` to your Vercel URL
   - Save and redeploy

---

### **Option 2: All-in-One Render Deployment**

Deploy both frontend and backend on Render:

1. **Create Web Service** on Render
2. **Configure**:
   ```
   Name: mutual-aid-network
   Root Directory: ./
   Build Command: npm install && npm run build && cd backend && npm install
   Start Command: npm start
   ```

3. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-secret-key
   ADMIN_EMAIL=admin@mutualaidnetwork.com
   ADMIN_PASSWORD=Admin123!@#
   DATABASE_URL=your-postgres-url
   CLIENT_URL=https://mutual-aid-network.onrender.com
   VITE_API_URL=https://mutual-aid-network.onrender.com
   ```

4. **Static Files**: Configure to serve `dist` folder

---

## 🔧 **Manual Deployment Steps**

### **Step 1: Prepare Repository**

```powershell
cd C:\Users\mrrud\OneDrive\Desktop\projects\payment-platform

# Check git status
git status

# Add all changes
git add .

# Commit
git commit -m "Production deployment - All features complete"

# Push to GitHub
git push origin main
```

### **Step 2: Database Setup**

Your PostgreSQL database is already configured:
```
Host: dpg-d5q03sogjchc73dn7e2g-a.virginia-postgres.render.com
Database: mutualaidnetwork_db
User: mutualaidnetwork
Password: BIlyylIlMAgwAWpdCBpWwSwMK6CXWqIB
```

**Verify Connection**:
```powershell
# Test database connection
cd backend
node -e "import pool from './database.js'; pool.query('SELECT NOW()').then(r => console.log('✅ DB Connected:', r.rows[0])).catch(e => console.error('❌ Error:', e))"
```

### **Step 3: Environment Configuration**

**Frontend `.env`** (for local dev only):
```env
VITE_API_URL=http://localhost:5000
```

**Backend `.env`**:
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://mutualaidnetwork:BIlyylIlMAgwAWpdCBpWwSwMK6CXWqIB@dpg-d5q03sogjchc73dn7e2g-a.virginia-postgres.render.com/mutualaidnetwork_db
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
ADMIN_EMAIL=admin@mutualaidnetwork.com
ADMIN_PASSWORD=Admin123!@#
CLIENT_URL=https://your-frontend-url.vercel.app
```

---

## 🧪 **Post-Deployment Testing**

After deployment, test these critical flows:

### **1. Registration & Login**
- [ ] Register new user with ID upload
- [ ] Login with credentials
- [ ] JWT token stored correctly

### **2. User Dashboard**
- [ ] Click "Offer Help" → Select package
- [ ] Modal persists on refresh
- [ ] Maturity timer counts down

### **3. Admin Panel**
- [ ] Login as admin
- [ ] Navigate to Payment Matching
- [ ] Click ASSIGN button on receiver
- [ ] Select giver from modal
- [ ] Create match
- [ ] Verify match appears in Active Matches table

### **4. Payment Matching**
- [ ] User sees matched counterparty details
- [ ] Bank account information displays
- [ ] "I Have Sent Payment" button works
- [ ] Status updates to `awaiting_confirmation`

### **5. Admin Actions**
- [ ] View Users → ID column visible
- [ ] Suspend/Reactivate user
- [ ] Delete user (with cascade)
- [ ] All changes persist

### **6. Settings**
- [ ] Update profile information
- [ ] Change password
- [ ] Changes save and persist on refresh

---

## 🔐 **Security Checklist**

- [ ] Change default admin password after first login
- [ ] Update JWT_SECRET to a strong random string
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Configure CORS to only allow your frontend domain
- [ ] Never commit `.env` files to Git
- [ ] Use environment variables for all secrets

---

## 📊 **Monitoring & Maintenance**

### **Render Dashboard**
- Monitor server logs
- Check database usage
- View request metrics
- Auto-scaling enabled

### **Vercel Dashboard**
- Analytics and performance
- Build logs
- Domain management
- Automatic deployments on push

### **Database Backups**
Render automatically backs up your PostgreSQL database. To manually backup:

```bash
pg_dump DATABASE_URL > backup_$(date +%Y%m%d).sql
```

---

## 🐛 **Troubleshooting**

### **Frontend shows "Network Error"**
- Check `VITE_API_URL` points to correct backend URL
- Verify CORS is configured in backend
- Check backend is running and healthy

### **Backend fails to start**
- Verify `DATABASE_URL` is correct
- Check all required environment variables are set
- Review Render logs for errors

### **Database connection fails**
- Check PostgreSQL service is running on Render
- Verify connection string format
- Test connection locally first

### **Users can't login**
- Check JWT_SECRET is the same across restarts
- Verify database has users table
- Check password hashing is working

---

## 🎉 **Your Live URLs**

**Frontend**: `https://mutual-aid-network.vercel.app` (after Vercel deployment)
**Backend API**: `https://mutual-aid-network-backend.onrender.com` (after Render deployment)
**Admin Panel**: `https://mutual-aid-network.vercel.app/admin`

**Admin Credentials**:
```
Email: admin@mutualaidnetwork.com
Password: Admin123!@#
```

**Test User Credentials**:
```
Giver: testgiver@example.com / Test1234
Receiver: testreceiver@example.com / Test1234
```

---

## 📞 **Support**

For issues or questions:
1. Check Render logs: `Logs` tab in service dashboard
2. Check Vercel logs: `Deployments` → Click deployment → `Logs`
3. Test locally first to isolate issue
4. Review error messages carefully

---

## ✅ **Deployment Complete!**

Your Mutual Aid Network platform is now live! 🎊

Remember to:
- Change default passwords
- Test all features in production
- Monitor logs for errors
- Set up domain name (optional)
- Configure email service (future enhancement)

