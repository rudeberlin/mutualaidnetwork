import pool from '../database.js';

(async () => {
  try {
    console.log('🔁 Running package interest update...');

    await pool.query(`UPDATE packages SET return_percentage = 30 WHERE id IN ('pkg-1','pkg-2')`);
    await pool.query(`UPDATE packages SET return_percentage = 50 WHERE id IN ('pkg-3','pkg-4')`);

    console.log('✅ Package interest rates updated');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to update package interest rates:', err);
    process.exit(1);
  }
})();
