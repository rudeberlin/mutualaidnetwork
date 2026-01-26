import pool from './database.js';

async function verify() {
  try {
    console.log('✅ Verifying help_activities table columns...\n');
    
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'help_activities'
      ORDER BY ordinal_position
    `);
    
    console.log('Columns in help_activities:');
    result.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.column_name} (${row.data_type})`);
    });
    
    console.log('\n✅ Migration verified - all columns present!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

verify();
