import pg from 'pg';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';

dotenv.config();

const { Pool } = pg;

// Use External Database URL for Render deployment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

// Initialize database tables
export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone_number VARCHAR(50) NOT NULL,
        country VARCHAR(100) NOT NULL,
        referral_code VARCHAR(50),
        my_referral_code VARCHAR(50) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        profile_photo TEXT,
        role VARCHAR(50) DEFAULT 'member',
        id_front_image TEXT,
        id_back_image TEXT,
        id_verified BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        payment_method_verified BOOLEAN DEFAULT FALSE,
        total_earnings DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        status VARCHAR(50) NOT NULL,
        description TEXT,
        related_member_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create packages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        return_percentage INTEGER NOT NULL,
        duration_days INTEGER NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create payment_methods table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        details TEXT NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create help_activities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS help_activities (
        id VARCHAR(255) PRIMARY KEY,
        giver_id VARCHAR(255) REFERENCES users(id),
        receiver_id VARCHAR(255) REFERENCES users(id),
        package_id VARCHAR(255) REFERENCES packages(id),
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default packages if not exists
    await client.query(`
      INSERT INTO packages (id, name, amount, return_percentage, duration_days, description, active)
      VALUES 
        ('pkg-1', 'Basic', 25, 30, 3, 'Perfect for beginners', true),
        ('pkg-2', 'Bronze', 100, 30, 5, 'Great value package', true),
        ('pkg-3', 'Silver', 250, 50, 15, 'Most popular choice', true),
        ('pkg-4', 'Gold', 500, 50, 15, 'Premium package', true)
      ON CONFLICT (id) DO NOTHING
    `);

    // Seed default admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@mutualaidnetwork.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#';
    
    const adminCheck = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    
    if (adminCheck.rows.length === 0) {
      const passwordHash = await bcryptjs.hash(adminPassword, 10);
      await client.query(`
        INSERT INTO users (
          id, full_name, username, email, phone_number, country, 
          my_referral_code, password_hash, role, is_verified, 
          id_verified, payment_method_verified, total_earnings
        )
        VALUES (
          'admin-001', 'System Admin', 'admin', $1, '+1234567890', 'USA',
          'ADMIN001', $2, 'admin', true, true, true, 0
        )
      `, [adminEmail, passwordHash]);
      
      console.log('✅ Default admin user created');
      console.log(`📧 Admin Email: ${adminEmail}`);
      console.log(`🔑 Admin Password: ${adminPassword}`);
    }

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
