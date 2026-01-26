import pool from './database.js';

async function migrate() {
  try {
    console.log('🔄 Running migration to add missing columns...');
    
    // Add maturity_date if not exists
    await pool.query(`
      ALTER TABLE help_activities
      ADD COLUMN IF NOT EXISTS maturity_date TIMESTAMP
    `);
    console.log('✅ maturity_date column verified');
    
    // Add other missing columns for manual matches
    await pool.query(`
      ALTER TABLE help_activities
      ADD COLUMN IF NOT EXISTS manual_entry BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS matched_with_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS matched_with_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS matched_with_phone VARCHAR(50)
    `);
    console.log('✅ Manual match columns verified');
    
    // Check help_activity_id for payment_matches
    const tableExists = await pool.query(`
      SELECT EXISTS(
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'payment_matches'
      )
    `);
    
    if (tableExists.rows[0].exists) {
      await pool.query(`
        ALTER TABLE payment_matches
        ADD COLUMN IF NOT EXISTS help_activity_id VARCHAR(255) REFERENCES help_activities(id)
      `);
      console.log('✅ payment_matches help_activity_id verified');
    }
    
    console.log('✅ All migrations completed successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

migrate();
