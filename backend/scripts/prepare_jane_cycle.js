import 'dotenv/config';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

(async () => {
  try {
    const janeId = 'user-seed-2701266';
    
    console.log('🔄 Resetting Jane to clean state for full cycle test...\n');
    
    // Delete the old receiver activity (shouldn't exist yet)
    await pool.query(
      "DELETE FROM help_activities WHERE receiver_id=$1 AND status='active'",
      [janeId]
    );
    console.log('✓ Deleted old receiver activity');
    
    // Delete old completed giver activity
    await pool.query(
      "DELETE FROM help_activities WHERE giver_id=$1 AND status='completed'",
      [janeId]
    );
    console.log('✓ Deleted old completed giver activity');
    
    // Ensure she has ONE active giver activity that's immediately mature
    // First check what she has
    const existing = await pool.query(
      "SELECT id FROM help_activities WHERE giver_id=$1 AND status='active'",
      [janeId]
    );
    
    if (existing.rows.length > 1) {
      // Delete extras, keep one
      for (let i = 1; i < existing.rows.length; i++) {
        await pool.query("DELETE FROM help_activities WHERE id=$1", [existing.rows[i].id]);
      }
      console.log(`✓ Cleaned up ${existing.rows.length - 1} duplicate giver activities`);
    } else if (existing.rows.length === 0) {
      // Create one
      await pool.query(
        `INSERT INTO help_activities (
           id, giver_id, package_id, amount, status, admin_approved, maturity_date, created_at, updated_at
         ) VALUES ($1, $2, 'pkg-1', 250, 'active', true, NOW(), NOW(), NOW())`,
        [uuidv4(), janeId]
      );
      console.log('✓ Created active giver activity (immediately mature)');
    } else {
      console.log('✓ Already has 1 active giver activity');
    }
    
    console.log('\n✅ JANE IS READY FOR FULL CYCLE TEST');
    console.log('\n📋 CURRENT STATE:');
    console.log('  - Active giver activity: YES (immediately mature)');
    console.log('  - "Receive Help" button: ENABLED ✓');
    console.log('  - Active receiver activity: NO (will be created when she clicks button)');
    console.log('\n🎯 NEXT STEPS TO TEST COMPLETE CYCLE:');
    console.log('  1. Login as Jane (Gifty / password: 123456)');
    console.log('  2. Go to User Dashboard');
    console.log('  3. Click "Receive Help" button (should be ENABLED now)');
    console.log('  4. Select a package (Basic Help ₵250)');
    console.log('  5. Go to Admin Panel → Payment Matching');
    console.log('  6. Find Jane in receiver queue');
    console.log('  7. Match her to a giver');
    console.log('  8. Admin confirms payment');
    console.log('  9. Jane confirms payment receipt');
    console.log(' 10. New giver activity auto-created');
    console.log(' 11. "Offer Help" button becomes active again');
    
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
