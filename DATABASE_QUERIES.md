# 📊 Database Verification Queries

Use these SQL queries to verify your database is set up correctly.

## Connection Info

```
Host: dpg-d5q03sogjchc73dn7e2g-a.virginia-postgres.render.com
Port: 5432
Database: mutualaidnetwork_db
Username: mutualaidnetwork
Password: BIlyylIlMAgwAWpdCBpWwSwMK6CXWqIB
```

Connect using pgAdmin, DBeaver, TablePlus, or any PostgreSQL client.

---

## 1. Check All Tables Exist

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Result:**
- help_activities
- packages
- payment_methods
- transactions
- users

---

## 2. Check Default Packages

```sql
SELECT id, name, amount, return_percentage, duration_days, active 
FROM packages 
ORDER BY amount;
```

**Expected Result:**
| id | name   | amount | return_percentage | duration_days | active |
|----|--------|--------|-------------------|---------------|--------|
| 1  | Basic  | 25     | 30                | 30            | true   |
| 2  | Bronze | 100    | 35                | 30            | true   |
| 3  | Silver | 250    | 40                | 30            | true   |
| 4  | Gold   | 500    | 50                | 30            | true   |

---

## 3. View All Users

```sql
SELECT 
    id, 
    full_name, 
    email, 
    username,
    role, 
    is_verified,
    id_verified,
    payment_method_verified,
    total_earnings,
    created_at
FROM users 
ORDER BY created_at DESC;
```

Initially should be empty. After first registration, you'll see users here.

---

## 4. Check Transactions

```sql
SELECT 
    t.id,
    t.user_id,
    u.full_name as user_name,
    t.type,
    t.amount,
    t.currency,
    t.status,
    t.description,
    t.created_at
FROM transactions t
LEFT JOIN users u ON t.user_id = u.id
ORDER BY t.created_at DESC
LIMIT 20;
```

---

## 5. Check Help Activities

```sql
SELECT 
    h.id,
    h.giver_id,
    g.full_name as giver_name,
    h.receiver_id,
    r.full_name as receiver_name,
    h.package_id,
    p.name as package_name,
    h.amount,
    h.payment_method,
    h.status,
    h.created_at
FROM help_activities h
LEFT JOIN users g ON h.giver_id = g.id
LEFT JOIN users r ON h.receiver_id = r.id
LEFT JOIN packages p ON h.package_id = p.id
ORDER BY h.created_at DESC;
```

---

## 6. Check Payment Methods

```sql
SELECT 
    pm.id,
    pm.user_id,
    u.full_name as user_name,
    pm.type,
    pm.details,
    pm.verified,
    pm.added_at
FROM payment_methods pm
LEFT JOIN users u ON pm.user_id = u.id
ORDER BY pm.added_at DESC;
```

---

## 🔧 Admin Operations

### Make a User Admin

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

Verify:
```sql
SELECT id, full_name, email, role 
FROM users 
WHERE role = 'admin';
```

---

### Verify a User's ID

```sql
UPDATE users 
SET is_verified = true, id_verified = true 
WHERE id = 'USER_ID_HERE';
```

---

### View Unverified Users

```sql
SELECT id, full_name, email, id_front_image, id_back_image, created_at
FROM users 
WHERE is_verified = false AND id_front_image IS NOT NULL
ORDER BY created_at DESC;
```

---

### Check User's Complete Profile

```sql
SELECT 
    id,
    full_name,
    username,
    email,
    phone_number,
    country,
    role,
    is_verified,
    id_verified,
    payment_method_verified,
    referral_code,
    my_referral_code,
    total_earnings,
    profile_photo,
    id_front_image,
    id_back_image,
    created_at
FROM users 
WHERE email = 'user@example.com';
```

---

## 📈 Statistics Queries

### Total Users

```sql
SELECT COUNT(*) as total_users FROM users;
```

### Total Verified Users

```sql
SELECT COUNT(*) as verified_users 
FROM users 
WHERE is_verified = true;
```

### Total Transactions

```sql
SELECT COUNT(*) as total_transactions FROM transactions;
```

### Total Transaction Volume

```sql
SELECT 
    COUNT(*) as total_transactions,
    SUM(amount) as total_volume,
    AVG(amount) as average_amount,
    currency
FROM transactions 
GROUP BY currency;
```

### Active Help Activities

```sql
SELECT COUNT(*) as active_help_activities 
FROM help_activities 
WHERE status = 'active';
```

### Users by Package

```sql
SELECT 
    p.name as package_name,
    COUNT(DISTINCT h.giver_id) as user_count
FROM help_activities h
JOIN packages p ON h.package_id = p.id
WHERE h.status = 'active'
GROUP BY p.name
ORDER BY user_count DESC;
```

---

## 🗑️ Reset Database (DANGER!)

**Only use this if you want to delete all data and start fresh:**

```sql
-- Delete all records (keeps tables)
TRUNCATE TABLE help_activities, transactions, payment_methods, users RESTART IDENTITY CASCADE;

-- Packages will remain (they are seeded data)
```

---

## 🔍 Debug Queries

### Check if email exists

```sql
SELECT id, email, full_name, role 
FROM users 
WHERE email = 'test@example.com';
```

### Check password hash for user (for debugging only)

```sql
SELECT id, email, password_hash 
FROM users 
WHERE email = 'test@example.com';
```

### View last 10 registered users

```sql
SELECT id, full_name, email, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check if packages are active

```sql
SELECT id, name, amount, active 
FROM packages 
WHERE active = true;
```

---

## 📝 Notes

- All timestamps are in UTC
- Passwords are hashed with bcrypt (never stored in plain text)
- JWT tokens expire after 10 minutes
- User IDs are UUIDs (auto-generated)
- Transactions are recorded for audit trail

---

## 🎯 First Steps After Deployment

1. **Verify packages exist:**
   ```sql
   SELECT * FROM packages;
   ```

2. **Register your admin account** via the website

3. **Find your user ID:**
   ```sql
   SELECT id FROM users WHERE email = 'your-email@example.com';
   ```

4. **Make yourself admin:**
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

5. **Verify it worked:**
   ```sql
   SELECT email, role FROM users WHERE role = 'admin';
   ```

6. **Log out and log back in** to access admin panel

---

Good luck! 🚀
