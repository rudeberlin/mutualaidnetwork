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
        user_number SERIAL UNIQUE,
        display_id VARCHAR(20) UNIQUE,
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

    // Ensure expected columns exist (idempotent migrations)
    await client.query(`
      ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE
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

    // Create user_payment_accounts table for giver/receiver specific payout details
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_payment_accounts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        mode VARCHAR(20) NOT NULL, -- 'give' or 'receive'
        account_name VARCHAR(255) NOT NULL,
        account_number VARCHAR(50) NOT NULL,
        bank_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(50),
        updated_by VARCHAR(255) REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, mode)
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
        admin_approved BOOLEAN DEFAULT FALSE,
        maturity_date TIMESTAMP,
        payment_deadline TIMESTAMP,
        matched_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add admin_approved column if it doesn't exist (migration for existing databases)
    await client.query(`
      ALTER TABLE help_activities
      ADD COLUMN IF NOT EXISTS admin_approved BOOLEAN DEFAULT FALSE
    `);

    // Ensure required columns exist for manual matching and maturity tracking
    await client.query(`
      ALTER TABLE help_activities
      ADD COLUMN IF NOT EXISTS maturity_date TIMESTAMP,
      ADD COLUMN IF NOT EXISTS payment_deadline TIMESTAMP,
      ADD COLUMN IF NOT EXISTS matched_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS manual_entry BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS matched_with_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS matched_with_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS matched_with_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS payment_account TEXT
    `);

    // Create user_packages table for tracking user subscriptions
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_packages (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        package_id VARCHAR(255) REFERENCES packages(id),
        status VARCHAR(50) DEFAULT 'pending',
        admin_approved BOOLEAN DEFAULT FALSE,
        maturity_date TIMESTAMP,
        extended_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create payment_matches table for tracking admin matches
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_matches (
        id SERIAL PRIMARY KEY,
        giver_id VARCHAR(255) REFERENCES users(id),
        receiver_id VARCHAR(255) REFERENCES users(id),
        help_activity_id VARCHAR(255) REFERENCES help_activities(id),
        amount DECIMAL(10, 2) NOT NULL,
        payment_deadline TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        matched_by VARCHAR(255),
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create banned_accounts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS banned_accounts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id),
        reason TEXT NOT NULL,
        banned_by VARCHAR(255),
        banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unbanned_at TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
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

    // Seed test users for payment matching workflow
    const testUserCheck = await client.query('SELECT id FROM users WHERE email = $1', ['testgiver@example.com']);
    if (testUserCheck.rows.length === 0) {
      const passwordHash = await bcryptjs.hash('Test1234', 10);
      
      // Create test giver
      await client.query(`
        INSERT INTO users (
          id, full_name, username, email, phone_number, country, 
          my_referral_code, password_hash, role, is_verified, 
          id_verified, payment_method_verified, total_earnings
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, ['user-giver-001', 'John Giver', 'johngiver', 'testgiver@example.com', '+1234567890', 'Nigeria',
          'GIVER001', passwordHash, 'member', true, true, true, 5000]);
      
      // Create test receiver
      await client.query(`
        INSERT INTO users (
          id, full_name, username, email, phone_number, country, 
          my_referral_code, password_hash, role, is_verified, 
          id_verified, payment_method_verified, total_earnings
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, ['user-receiver-001', 'Jane Receiver', 'janereceiver', 'testreceiver@example.com', '+1987654321', 'Nigeria',
          'RECEIVER001', passwordHash, 'member', true, true, true, 0]);
      
      console.log('✅ Test users for payment matching created');
    }

    // Seed test help_activities
    const helpActivityCheck = await client.query('SELECT id FROM help_activities LIMIT 1');
    if (helpActivityCheck.rows.length === 0) {
      await client.query(`
        INSERT INTO help_activities (
          id, giver_id, receiver_id, package_id, amount, status, admin_approved, created_at, updated_at
        )
        VALUES 
          ('help-001', 'user-giver-001', 'user-receiver-001', 'pkg-3', 250, 'pending', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('help-002', 'user-giver-001', NULL, 'pkg-2', 100, 'pending', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('help-003', NULL, 'user-receiver-001', 'pkg-1', 25, 'pending', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      
      console.log('✅ Test help_activities created');
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
