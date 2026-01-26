import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', result.rows[0]);
    
    client.release();
    await pool.end();
    console.log('✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

testConnection();
