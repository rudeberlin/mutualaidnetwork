import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

(async () => {
  try {
    const user = await pool.query(
      'SELECT id, user_number, display_id, full_name, username, email FROM users WHERE email=$1',
      ['jane@mail.com']
    );
    console.log('USER', user.rows);
    if (user.rows.length) {
      const uid = user.rows[0].id;
      const acts = await pool.query(
        'SELECT id, giver_id, receiver_id, package_id, status, maturity_date, amount, created_at, updated_at FROM help_activities WHERE giver_id=$1 OR receiver_id=$1 ORDER BY created_at DESC',
        [uid]
      );
      console.log('ACTIVITIES', acts.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
