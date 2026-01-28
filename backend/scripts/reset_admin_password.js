import 'dotenv/config';
import pg from 'pg';
import bcryptjs from 'bcryptjs';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

const adminEmail = process.env.ADMIN_EMAIL || 'admin@mutualaidnetwork.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#';

async function main() {
  const passwordHash = await bcryptjs.hash(adminPassword, 10);

  const update = await pool.query(
    "UPDATE users SET password_hash=$1, role='admin', is_verified=true, id_verified=true, payment_method_verified=true WHERE email=$2 RETURNING id",
    [passwordHash, adminEmail]
  );

  if (update.rowCount === 0) {
    await pool.query(
      "INSERT INTO users (id, full_name, username, email, phone_number, country, my_referral_code, password_hash, role, is_verified, id_verified, payment_method_verified, total_earnings) VALUES ('admin-001', 'System Admin', 'admin', $1, '+1234567890', 'USA', 'ADMIN001', $2, 'admin', true, true, true, 0)",
      [adminEmail, passwordHash]
    );
  }

  console.log(`✅ Admin credentials reset: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((err) => {
    console.error('❌ Failed to reset admin:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
