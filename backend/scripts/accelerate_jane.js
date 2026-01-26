import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

(async () => {
  try {
    const id = 'f011bdc1-0270-41b4-b38a-6091ede3330a';
    const res = await pool.query(
      "UPDATE help_activities SET created_at = NOW() - (interval '5 days' - interval '8 hours'), maturity_date = NOW() + interval '8 hours', updated_at = NOW() WHERE id = $1 AND status = 'active'",
      [id]
    );
    console.log('updated', res.rowCount);
    const row = await pool.query('SELECT id, created_at, maturity_date, amount FROM help_activities WHERE id=$1', [id]);
    console.log(row.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
