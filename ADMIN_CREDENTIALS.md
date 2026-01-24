# 🔐 ADMIN CREDENTIALS

## Default Admin Account

Your platform now has a default admin account created automatically when the database initializes.

### Default Credentials:

```
Email: admin@mutualaidnetwork.com
Password: Admin123!@#
```

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

---

## How to Login as Admin

1. Go to: https://mutualaidnetwork.vercel.app/login
2. Enter the email: `admin@mutualaidnetwork.com`
3. Enter the password: `Admin123!@#`
4. Click "Sign In"
5. You will be redirected to your dashboard
6. Navigate to the Admin Panel by clicking the admin link in the navigation

---

## Custom Admin Credentials (Optional)

You can set custom admin credentials by adding these environment variables on Render:

```
ADMIN_EMAIL=your-email@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123
```

After adding these, redeploy your backend and the admin will be created with your custom credentials.

---

## Admin Panel Features

Once logged in as admin, you can access:

✅ **Dashboard** - Overview of platform statistics
- Total users
- Total transactions
- Active help activities
- Platform earnings

✅ **Users Management** - View and manage all users
- View user profiles
- Suspend/Reactivate users
- View user earnings
- Check verification status

✅ **Verifications** - Approve ID verification requests
- View submitted ID documents
- Approve or reject verifications
- Track verification history

✅ **Help Activities** - Monitor peer-to-peer help
- View active help activities
- Complete help transactions
- Resolve disputes

✅ **Payments** - Manage payment methods
- Verify payment methods
- Flag suspicious payments
- View payment history

✅ **Transactions** - View all platform transactions
- Filter by type, status, date
- Export transaction data
- Monitor transaction volume

✅ **Packages** - Manage investment packages
- Edit package details
- Enable/disable packages
- Update pricing and returns

✅ **Reports** - View analytics and insights
- Monthly help volume
- User growth charts
- Help status distribution

✅ **Settings** - Configure platform settings
- Update platform information
- Manage notifications
- Configure security settings

---

## Security Recommendations

1. **Change Default Password Immediately**
   - Go to Settings (coming soon)
   - Or update directly in database

2. **Use Strong Password**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Don't reuse passwords

3. **Enable Two-Factor Authentication** (future feature)
   - Add extra layer of security
   - Protect against unauthorized access

4. **Monitor Admin Activity**
   - Check logs regularly
   - Watch for suspicious actions
   - Review user reports

5. **Limit Admin Access**
   - Only create admin accounts for trusted individuals
   - Use role-based permissions
   - Revoke access when no longer needed

---

## Changing Admin Password in Database

If you forget your admin password, connect to your PostgreSQL database and run:

```sql
-- Generate new password hash (replace 'NewPassword123' with your desired password)
-- Use bcrypt online tool or node.js:
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('NewPassword123', 10));"

-- Update admin password
UPDATE users 
SET password_hash = '$2a$10$YOUR_HASHED_PASSWORD_HERE'
WHERE email = 'admin@mutualaidnetwork.com';
```

---

## Creating Additional Admin Users

To make another user an admin:

```sql
-- Make user admin by email
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';

-- Verify admin users
SELECT id, full_name, email, role 
FROM users 
WHERE role = 'admin';
```

---

## Troubleshooting

**Can't login as admin?**
- Check that the admin user was created (check database)
- Verify you're using the correct email and password
- Make sure auto-logout hasn't kicked in (10 min inactivity)
- Clear browser cache and try again

**Admin panel not loading?**
- Check that your user role is 'admin' in database
- Verify API is running on Render
- Check browser console for errors
- Make sure token is valid (not expired)

**Admin endpoints returning 403?**
- Verify role in database is 'admin' not 'member'
- Check JWT token is valid
- Make sure you're logged in as admin user
- Try logging out and logging back in

---

## Default Admin Profile

The default admin user is created with:

```json
{
  "id": "admin-001",
  "full_name": "System Admin",
  "username": "admin",
  "email": "admin@mutualaidnetwork.com",
  "phone_number": "+1234567890",
  "country": "USA",
  "my_referral_code": "ADMIN001",
  "role": "admin",
  "is_verified": true,
  "id_verified": true,
  "payment_method_verified": true,
  "total_earnings": 0
}
```

---

## Admin Dashboard URL

- **Live**: https://mutualaidnetwork.vercel.app/admin
- **Local**: http://localhost:5173/admin

---

**Remember**: Keep your admin credentials secure! Never share them publicly or commit them to version control.
