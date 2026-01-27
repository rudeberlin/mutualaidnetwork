// Script: fix_cycle_order.js
// Purpose: Remove giver activities from all test users so they start with "Offer Help" 
// This creates proper alternating cycle: Offer → Receive → Offer → Receive
// Usage: node scripts/fix_cycle_order.js

import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

const TEST_USERS = [
  'user2701261', // Trina
  'user2701262', // Nuna
  'user2701263', // Richie
  'user2701264', // Hearty
  'user2701265', // Gladys
  'user2701266', // Jane (Gifty)
];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Aborting.');
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    console.log('🔧 Fixing cycle order for all test users...\n');

    for (const displayId of TEST_USERS) {
      // Get user ID from display_id
      const userResult = await client.query(
        `SELECT id, username FROM users WHERE display_id = $1`,
        [displayId]
      );

      if (userResult.rows.length === 0) {
        console.log(`⚠️  User ${displayId} not found`);
        continue;
      }

      const userId = userResult.rows[0].id;
      const username = userResult.rows[0].username;

      // Delete giver activities (users should start with no giver activity)
      const deleteGiverResult = await client.query(
        `DELETE FROM help_activities 
         WHERE giver_id = $1 AND receiver_id IS NULL 
         RETURNING id`,
        [userId]
      );

      if (deleteGiverResult.rows.length > 0) {
        console.log(
          `✅ ${displayId} (${username}): Removed ${deleteGiverResult.rows.length} giver activity(ies)`
        );
      } else {
        console.log(`✓ ${displayId} (${username}): No giver activities to remove`);
      }
    }

    console.log('\n✅ Cycle order fixed! Users now start with "Offer Help" button enabled.');
    console.log('   Proper cycle: Offer → Receive → Offer → Receive → ...\n');
  } catch (err) {
    console.error('❌ Error during fix:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
