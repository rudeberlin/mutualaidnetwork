import 'dotenv/config';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

(async () => {
  try {
    const userId = 'user-seed-2701266'; // Gifty Jane
    const packageId = 'pkg-1'; // Basic Help
    const amount = 250;
    
    // Create new immediately-mature giver activity
    const res = await pool.query(
      `INSERT INTO help_activities (
         id, giver_id, package_id, amount, status, admin_approved, maturity_date, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, 'active', true, NOW(), NOW(), NOW())
       RETURNING id, status, maturity_date`,
      [uuidv4(), userId, packageId, amount]
    );
    console.log('Created active giver activity for Jane:', res.rows[0]);
    
    // Verify giver maturity endpoint will return can_request_help = true
    const check = await pool.query(
      `SELECT ha.id, ha.status, ha.maturity_date,
              CASE 
                WHEN ha.maturity_date <= CURRENT_TIMESTAMP THEN true
                ELSE false
              END as is_mature
       FROM help_activities ha
       WHERE ha.giver_id = $1 AND ha.status = 'active'
       ORDER BY ha.created_at DESC LIMIT 1`,
      [userId]
    );
    console.log('Giver maturity check for Jane:', check.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
