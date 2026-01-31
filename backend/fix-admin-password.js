import 'dotenv/config';
import bcryptjs from 'bcryptjs';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function main() {
  try {
    const adminPassword = 'Admin123!@#';
    const passwordHash = bcryptjs.hashSync(adminPassword, 10);
    
    console.log('Creating fresh admin password hash...');
    
    // Update the password hash
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email, role',
      [passwordHash, 'admin@mutualaidnetwork.com']
    );
    
    if (result.rowCount === 0) {
      console.log('❌ Admin user not found');
    } else {
      console.log('✅ Admin password updated successfully');
      console.log('   User:', result.rows[0]);
      console.log('\n✅ You can now login with:');
      console.log('   Email: admin@mutualaidnetwork.com');
      console.log('   Password: Admin123!@#');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
