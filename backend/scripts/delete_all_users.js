// Script: delete_all_users.js
// Purpose: Delete all non-admin users to start fresh
// Usage: node scripts/delete_all_users.js

import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Aborting.');
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    console.log('🔄 Deleting all non-admin users...\n');

    await client.query('BEGIN');

    // Clear dependent tables first
    await client.query('DELETE FROM payment_matches');
    console.log('✓ Deleted all payment matches');

    await client.query('DELETE FROM help_activities');
    console.log('✓ Deleted all help activities');

    await client.query('DELETE FROM user_packages');
    console.log('✓ Deleted all user packages');

    await client.query('DELETE FROM transactions');
    console.log('✓ Deleted all transactions');

    await client.query('DELETE FROM payment_methods');
    console.log('✓ Deleted all payment methods');

    await client.query('DELETE FROM user_payment_accounts');
    console.log('✓ Deleted all payment accounts');

    await client.query('DELETE FROM banned_accounts');
    console.log('✓ Deleted all banned accounts');

    // Delete all non-admin users
    const deleteResult = await client.query("DELETE FROM users WHERE role != 'admin' RETURNING id, full_name");
    console.log(`✓ Deleted ${deleteResult.rows.length} users`);

    // Reset user_number sequence
    await client.query(`
      SELECT setval(
        'users_user_number_seq',
        COALESCE((SELECT MAX(user_number) FROM users), 0) + 1,
        false
      );
    `);
    console.log('✓ Reset user_number sequence (aligned to max existing user_number)');

    await client.query('COMMIT');
    console.log('\n✅ Database cleaned! Ready for fresh user registrations.');
    console.log('\n📝 Test workflow:');
    console.log('   1. Users register normally (no pre-seeding)');
    console.log('   2. Each user registers and selects a package');
    console.log('   3. Admin manually matches users');
    console.log('   4. Admin confirms payment');
    console.log('   5. System automatically completes cycle\n');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
