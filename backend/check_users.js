import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost/mutual_aid_db'
});

async function checkUsers() {
  try {
    // Find Jane and Sheena
    const users = await pool.query(
      `SELECT id, full_name, username, total_earnings FROM users 
       WHERE LOWER(full_name) LIKE '%jane%' OR LOWER(full_name) LIKE '%sheena%'`
    );

    console.log('\n=== USER SEARCH RESULTS ===\n');
    console.log(JSON.stringify(users.rows, null, 2));

    // For each user found, check their active packages
    for (const user of users.rows) {
      console.log(`\n\n=== CHECKING ACTIVE PACKAGES FOR ${user.full_name.toUpperCase()} (ID: ${user.id}) ===\n`);
      
      const packages = await pool.query(
        `SELECT ha.id, ha.giver_id, ha.receiver_id, ha.amount, ha.status,
                ha.created_at, ha.maturity_date,
                p.id as package_id, p.name, p.amount as pkg_amount, p.return_percentage, p.duration_days,
                pm.id as match_id, pm.status as match_status, pm.created_at as match_created_at
         FROM help_activities ha
         LEFT JOIN packages p ON ha.package_id = p.id
         LEFT JOIN payment_matches pm ON pm.help_activity_id = ha.id
         WHERE (ha.giver_id = $1 OR ha.receiver_id = $1)
           AND (ha.status IN ('matched', 'active') OR pm.status IN ('confirmed', 'completed'))
         ORDER BY ha.created_at DESC`,
        [user.id]
      );

      console.log(`Found ${packages.rows.length} active/matched packages:\n`);
      packages.rows.forEach((pkg, idx) => {
        console.log(`${idx + 1}. Help Activity ID: ${pkg.id}`);
        console.log(`   Package: ${pkg.name} (₵${pkg.pkg_amount || pkg.amount})`);
        console.log(`   Role: ${pkg.giver_id === user.id ? 'GIVER' : 'RECEIVER'}`);
        console.log(`   HA Status: ${pkg.status}`);
        console.log(`   Match ID: ${pkg.match_id}`);
        console.log(`   Match Status: ${pkg.match_status}`);
        console.log(`   Created: ${pkg.created_at}`);
        console.log(`   Match Created: ${pkg.match_created_at}\n`);
      });
    }

    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

checkUsers();
