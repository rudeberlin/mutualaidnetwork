// Script: verify_cycle_order.js
// Purpose: Verify the new cycle order for Jane (and all users)
// Shows: No giver activities, one receiver activity, "Offer Help" button should be enabled
// Usage: node scripts/verify_cycle_order.js

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
    console.log('🔍 CYCLE ORDER VERIFICATION\n');
    console.log('Testing user: Jane (Gifty / user2701266)\n');

    // Get Jane
    const userResult = await client.query(
      `SELECT id, display_id, username, email FROM users WHERE display_id = 'user2701266'`
    );

    if (userResult.rows.length === 0) {
      console.log('❌ Jane not found');
      return;
    }

    const userId = userResult.rows[0].id;
    const { display_id, username, email } = userResult.rows[0];

    console.log(`User: ${display_id} (${username})`);
    console.log(`Email: ${email}\n`);

    // Get all activities
    const activitiesResult = await client.query(
      `SELECT 
        id, 
        giver_id, 
        receiver_id, 
        status, 
        amount, 
        maturity_date,
        created_at
       FROM help_activities 
       WHERE giver_id = $1 OR receiver_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    console.log(`📊 ACTIVITIES (Total: ${activitiesResult.rows.length})`);
    console.log('─'.repeat(80));

    if (activitiesResult.rows.length === 0) {
      console.log('ℹ️  No activities found\n');
    } else {
      for (const activity of activitiesResult.rows) {
        const isGiver = activity.giver_id === userId;
        const isReceiver = activity.receiver_id === userId;
        const role = isGiver ? 'GIVER' : isReceiver ? 'RECEIVER' : 'UNKNOWN';

        console.log(`\n  Activity Type: ${role}`);
        console.log(`  Status: ${activity.status}`);
        console.log(`  Amount: ₵${activity.amount}`);
        console.log(
          `  Maturity: ${activity.maturity_date ? new Date(activity.maturity_date).toLocaleString() : 'N/A'}`
        );
        console.log(`  Created: ${new Date(activity.created_at).toLocaleString()}`);
      }
    }

    console.log('\n' + '─'.repeat(80));

    // Determine button states
    console.log('\n🔘 BUTTON STATES:');
    console.log('─'.repeat(80));

    const giver = activitiesResult.rows.find((a) => a.giver_id === userId);
    const receiver = activitiesResult.rows.find((a) => a.receiver_id === userId);

    const hasActiveGiver = giver && giver.status === 'active';
    const hasActiveReceiver = receiver && receiver.status === 'active';

    if (hasActiveReceiver) {
      console.log('❌ "Offer Help" button: DISABLED (receiver activity in progress)');
      console.log('❌ "Receive Help" button: DISABLED (receiver activity in progress)');
    } else if (hasActiveGiver) {
      console.log('❌ "Offer Help" button: DISABLED (giver activity in progress)');
      console.log('✅ "Receive Help" button: ENABLED (has mature giver activity)');
    } else {
      console.log('✅ "Offer Help" button: ENABLED (ready to offer)');
      console.log('❌ "Receive Help" button: DISABLED (no giver activity to enable it)');
    }

    console.log('\n' + '─'.repeat(80));
    console.log('\n✅ CYCLE STATE:');
    if (!hasActiveGiver && !hasActiveReceiver && receiver) {
      console.log('   Jane is ready to OFFER HELP next!');
      console.log('   Next steps:');
      console.log('   1. Click "Offer Help" button');
      console.log('   2. Admin matches Jane to a receiver');
      console.log('   3. Cycle completes');
      console.log('   4. Jane will be ready to RECEIVE HELP');
    } else if (hasActiveReceiver) {
      console.log('   Jane is currently RECEIVING HELP');
      console.log('   Next step: Confirm payment receipt');
    }

    console.log('\n');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
