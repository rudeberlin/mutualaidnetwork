import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

(async () => {
  try {
    const janeId = 'user-seed-2701266';
    
    // Check complete state of Jane
    console.log('=== JANE COMPLETE STATE ===\n');
    
    // User info
    const user = await pool.query(
      'SELECT id, display_id, full_name, username, email FROM users WHERE id=$1',
      [janeId]
    );
    console.log('USER:', user.rows[0]);
    
    // All help_activities
    const activities = await pool.query(
      `SELECT id, giver_id, receiver_id, package_id, amount, status, maturity_date, created_at
       FROM help_activities 
       WHERE giver_id=$1 OR receiver_id=$1
       ORDER BY created_at DESC`,
      [janeId]
    );
    console.log('\nALL ACTIVITIES:');
    activities.rows.forEach((a, i) => {
      console.log(`  ${i+1}. id: ${a.id.substring(0, 8)}...`);
      console.log(`     role: ${a.giver_id === janeId ? 'GIVER' : 'RECEIVER'}`);
      console.log(`     status: ${a.status}`);
      console.log(`     package: ${a.package_id}`);
      console.log(`     maturity: ${a.maturity_date ? new Date(a.maturity_date).toISOString() : 'N/A'}`);
      console.log(`     created: ${new Date(a.created_at).toISOString()}`);
    });
    
    // Giver maturity check
    const giver = await pool.query(
      `SELECT ha.id, ha.status, ha.maturity_date,
              CASE WHEN ha.maturity_date <= CURRENT_TIMESTAMP THEN true ELSE false END as is_mature,
              EXTRACT(EPOCH FROM (ha.maturity_date - CURRENT_TIMESTAMP)) as time_to_mature_sec
       FROM help_activities ha
       WHERE ha.giver_id=$1 AND ha.status='active'
       ORDER BY ha.created_at DESC LIMIT 1`,
      [janeId]
    );
    
    console.log('\nGIVER MATURITY STATUS (for "Receive Help" button):');
    if (giver.rows.length > 0) {
      const g = giver.rows[0];
      console.log(`  ✓ Active giver activity found`);
      console.log(`    is_mature: ${g.is_mature}`);
      console.log(`    time_to_mature: ${g.time_to_mature_sec > 0 ? g.time_to_mature_sec + 's' : 'READY NOW'}`);
      console.log(`    → "Receive Help" button should be: ${g.is_mature ? 'ENABLED ✓' : 'DISABLED'}`);
    } else {
      console.log(`  ✗ No active giver activity found!`);
      console.log(`    → "Receive Help" button will be DISABLED`);
    }
    
    // Check active receiver activity
    const receiver = await pool.query(
      `SELECT id, status, maturity_date FROM help_activities 
       WHERE receiver_id=$1 AND status='active'`,
      [janeId]
    );
    
    console.log('\nRECEIVER ACTIVITY (if she clicked "Receive Help" and was matched):');
    if (receiver.rows.length > 0) {
      console.log(`  ✓ Found ${receiver.rows.length} active receiver activity`);
      receiver.rows.forEach(r => {
        console.log(`    status: ${r.status}, maturity: ${r.maturity_date}`);
      });
    } else {
      console.log(`  - No active receiver activity (she hasn't clicked "Receive Help" yet)`);
    }
    
    console.log('\n=== EXPECTED FLOW FOR JANE ===');
    console.log('1. Jane logs in, sees "Receive Help" button ENABLED (giver maturity ready)');
    console.log('2. Jane clicks "Receive Help" button');
    console.log('3. Admin goes to AdminPaymentMatching panel');
    console.log('4. Admin matches Jane (as receiver) to a giver');
    console.log('5. Admin confirms payment (after giver sends money)');
    console.log('6. Jane confirms receipt of payment');
    console.log('7. New giver activity created automatically');
    console.log('8. "Offer Help" button becomes enabled again');
    
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
