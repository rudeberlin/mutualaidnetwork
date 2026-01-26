import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

(async () => {
  try {
    const res = await pool.query(
      "UPDATE help_activities ha SET maturity_date = ha.created_at + (p.duration_days || ' days')::interval FROM packages p WHERE ha.package_id = p.id AND ha.status = 'active'"
    );
    console.log('updated', res.rowCount);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
