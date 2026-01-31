import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function main() {
  try {
    const result = await pool.query('SELECT id, email, role, password_hash FROM users WHERE email = $1', ['admin@mutualaidnetwork.com']);
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user NOT found in database');
    } else {
      const user = result.rows[0];
      console.log('✅ Admin user found:');
      console.log('   ID:', user.id);
      console.log('   Email:', user.email);
      console.log('   Role:', user.role);
      console.log('   Password hash exists:', !!user.password_hash);
      console.log('   Password hash length:', user.password_hash?.length);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
