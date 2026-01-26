import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const run = async () => {
  const res = await pool.query(
    `SELECT id, email, profile_photo, id_front_image, id_back_image
       FROM users
      WHERE profile_photo LIKE 'base%'
         OR id_front_image LIKE 'base%'
         OR id_back_image LIKE 'base%'
      LIMIT 10`
  );
  console.log(res.rows);
  await pool.end();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
