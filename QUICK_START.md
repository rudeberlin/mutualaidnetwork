# 🚀 Mutual Aid Network - Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Start Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```
→ Opens at http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
→ Runs at http://localhost:5000

### 3. Test the Platform

1. **Go to http://localhost:5173**
2. **Click "Get Started Free"**
3. **Register:**
   - Full Name: John Doe
   - Username: johndoe123
   - Email: john@example.com
   - Phone: +1234567890
   - Country: United States
   - Password: password123
   - Confirm Password: password123
   
4. **Upload ID:**
   - Upload any JPG/PNG file for front (< 5MB)
   - Upload any JPG/PNG file for back (< 5MB)
   - Click "Complete Registration"

5. **Dashboard Features:**
   - View Total Earnings
   - Select a Package
   - Add Payment Method (any details work in development)
   - View Recent Transactions
   - See Matched Member Info

---

## 📋 Key Files to Know

**Frontend:**
- `src/pages/HomePageNew.tsx` - Landing page
- `src/pages/RegisterPageNew.tsx` - Registration (2-step)
- `src/pages/UserDashboardNew.tsx` - Dashboard
- `src/components/PackagesGrid.tsx` - Package display
- `src/store/index.ts` - State management
- `src/utils/mockData.ts` - Mock data

**Backend:**
- `backend/server.js` - Express server
- `backend/package.json` - Dependencies
- `backend/.env.example` - Environment template

---

## 🔌 API Base URL

**Development:** `http://localhost:5000/api`
**Production:** `https://your-api-domain.com/api`

### Quick API Tests

```bash
# Health check
curl http://localhost:5000/api/health

# Get packages
curl http://localhost:5000/api/packages

# Register (with form-data for files)
curl -X POST http://localhost:5000/api/register \
  -F "fullName=John" \
  -F "username=john123" \
  -F "email=john@example.com" \
  -F "phoneNumber=+1234567890" \
  -F "country=USA" \
  -F "password=password123" \
  -F "confirmPassword=password123" \
  -F "idFront=@path/to/front.jpg" \
  -F "idBack=@path/to/back.jpg"
```

---

## 🎯 Features Overview

✅ **Registration**
- 2-step form (account details + ID upload)
- File preview
- Form validation

✅ **Dashboard**
- Total earnings tracking
- Payment method selection
- Package selection
- Matched member display
- Transaction history

✅ **Packages**
- Basic: $25 (30%, 3 days)
- Bronze: $100 (30%, 5 days)
- Silver: $250 (50%, 15 days)
- Gold: $500 (50%, 15 days)

✅ **Security**
- JWT authentication
- Password hashing
- File validation
- Protected routes

---

## 💡 Customization

### Change Colors
Edit Tailwind classes in components:
```tsx
// Change blue-600 to your color
className="bg-blue-600 hover:bg-blue-700"
```

### Change Package Details
Edit `src/utils/mockData.ts`:
```typescript
export const PACKAGES: Package[] = [
  {
    id: 'pkg-1',
    name: 'Basic',
    amount: 25,  // Change amount
    returnPercentage: 30,  // Change return
    durationDays: 3,  // Change duration
    // ...
  },
];
```

### Change Platform Name
Search and replace "Mutual Aid Network" with your name throughout the code.

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Frontend
npm run dev -- --port 3000

# Backend
PORT=3001 npm run dev
```

### File Upload Not Working
1. Ensure `backend/uploads/` directory exists
2. Check file size (max 5MB)
3. Check file type (only JPG/PNG)

### Authentication Failed
1. Clear browser localStorage
2. Restart backend server
3. Check JWT_SECRET in `.env`

### Database Connection Error
1. PostgreSQL not required for development (uses mock data)
2. For production, set DATABASE_URL in `.env`

---

## 📊 Mock Data

Default mock user after registration:
```javascript
{
  id: 'user-123',
  fullName: 'John Doe',
  email: 'john@example.com',
  isVerified: false,
  paymentMethodVerified: false,
  totalEarnings: 0
}
```

---

## 🚢 Deployment Checklist

- [ ] Update JWT_SECRET in production
- [ ] Set DATABASE_URL for PostgreSQL
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set VITE_API_URL in frontend
- [ ] Test file uploads
- [ ] Verify authentication flow
- [ ] Test all payment methods
- [ ] Check responsive design
- [ ] Performance testing

---

## 📞 Need Help?

1. **Frontend Issues:** Check `browser console` (F12)
2. **Backend Issues:** Check `terminal logs`
3. **Database Issues:** Verify PostgreSQL connection
4. **Deployment:** Check platform-specific docs (Vercel, Render, etc.)

---

## 🎉 You're Ready!

The platform is fully functional and ready to extend. Start by:
1. Customizing branding
2. Integrating real payment gateway
3. Connecting real database
4. Adding email notifications
5. Implementing admin panel

Happy building! 🚀
