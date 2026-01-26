import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

(async () => {
  try {
    const res = await pool.query("UPDATE packages SET duration_days = 5 WHERE id IN ('pkg-1','pkg-2')");
    console.log('updated packages', res.rowCount);
    const rows = await pool.query('SELECT id, duration_days FROM packages ORDER BY id');
    console.log(rows.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
