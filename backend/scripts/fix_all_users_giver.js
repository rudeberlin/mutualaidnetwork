import 'dotenv/config';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

(async () => {
  try {
    const users = [
      { id: 'user-seed-2701261', package: 'pkg-3', amount: 1500 }, // Trina Cathy - Premium
      { id: 'user-seed-2701262', package: 'pkg-4', amount: 2500 }, // Nuna Gold - Elite
      { id: 'user-seed-2701263', package: 'pkg-4', amount: 2500 }, // Richie Selasie - Elite
      { id: 'user-seed-2701264', package: 'pkg-2', amount: 500 },  // Hearty Micheals - Standard
      { id: 'user-seed-2701265', package: 'pkg-1', amount: 250 },  // Gladys Asem - Basic
    ];
    
    for (const user of users) {
      // Delete the old completed giver activity if it exists
      await pool.query(
        "DELETE FROM help_activities WHERE giver_id = $1 AND status = 'completed'",
        [user.id]
      );
      
      // Create new immediately-mature giver activity
      const res = await pool.query(
        `INSERT INTO help_activities (
           id, giver_id, package_id, amount, status, admin_approved, maturity_date, created_at, updated_at
         ) VALUES ($1, $2, $3, $4, 'active', true, NOW(), NOW(), NOW())
         RETURNING id, status`,
        [uuidv4(), user.id, user.package, user.amount]
      );
      console.log(`✓ Created active giver activity for ${user.id}`);
    }
    
    console.log('\n✅ All users now have active, immediately-mature giver activities');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
