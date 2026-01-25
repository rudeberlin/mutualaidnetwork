// Run database migrations
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    console.log('🔄 Running manual match fields migration...');
    
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', 'add_manual_match_fields.sql'),
      'utf8'
    );
    
    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('   - Added manual_entry column');
    console.log('   - Added matched_with_name column');
    console.log('   - Added matched_with_email column');
    console.log('   - Added matched_with_phone column');
    console.log('   - Added payment_account column');
    console.log('   - Added payment_deadline column');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
