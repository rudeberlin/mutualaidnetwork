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
    const result = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', ['admin@mutualaidnetwork.com']);
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user NOT found');
      return;
    }

    const user = result.rows[0];
    const testPassword = 'Admin123!@#';
    
    console.log('Testing password match:');
    console.log('  Test password:', testPassword);
    console.log('  Hash from DB:', user.password_hash);
    
    const isMatch = bcryptjs.compareSync(testPassword, user.password_hash);
    console.log('  Match result:', isMatch ? '✅ MATCHES' : '❌ DOES NOT MATCH');
    
    if (!isMatch) {
      console.log('\n💡 Trying to create new hash with same password:');
      const newHash = bcryptjs.hashSync(testPassword, 10);
      console.log('  New hash:', newHash);
      console.log('  Compare with new hash:', bcryptjs.compareSync(testPassword, newHash));
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
