// Script: reset_and_seed_receivers.js
// Purpose: Dangerously wipes non-admin data and seeds default receiver users with active packages.
// Usage: DATABASE_URL must be set. Run: node scripts/reset_and_seed_receivers.js

import 'dotenv/config';
import pg from 'pg';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

// Package durations (kept in sync with database seed)
const PACKAGE_DURATIONS = {
  'pkg-1': 5, // Basic Help
  'pkg-2': 5, // Standard
  'pkg-3': 15, // Premium
  'pkg-4': 15, // Elite Help
};

const users = [
  {
    fullName: 'Trina Cathy',
    username: 'Cathrine',
    email: 'cathy@mail.com',
    phone: '0242891047',
    accountName: 'Catherine Zigah',
    accountNumber: '0242891047',
    paymentMethod: 'MTN MOBILE MONEY',
    packageId: 'pkg-3', // Premium
    amount: 1500,
    maturityDays: null, // use package duration
  },
  {
    fullName: 'Nuna Gold',
    username: 'Nuna',
    email: 'Nuna@mail.com',
    phone: '0591460949',
    accountName: 'Nunana cate',
    accountNumber: '0591460949',
    paymentMethod: 'MTN MOBILE MONEY',
    packageId: 'pkg-4', // Elite
    amount: 2500,
    maturityDays: null, // use package duration
  },
  {
    fullName: 'Richie Selasie',
    username: 'Rude',
    email: 'richie@mail.com',
    phone: '0535818408',
    accountName: 'Richmond Atitsogbui',
    accountNumber: '0535818408',
    paymentMethod: 'MTN MOBILE MONEY',
    packageId: 'pkg-4', // Elite
    amount: 2500,
    maturityDays: null, // use package duration
  },
  {
    fullName: 'Hearty Micheals',
    username: 'Richie',
    email: 'hearty@mail.com',
    phone: '0538123648',
    accountName: 'Richmond Atitsogbui',
    accountNumber: '0538123648',
    paymentMethod: 'MTN MOBILE MONEY',
    packageId: 'pkg-2', // Standard
    amount: 500,
    maturityDays: null, // use package duration
  },
  {
    fullName: 'Gladys Asem',
    username: 'Gladys',
    email: 'gladys@mail.com',
    phone: '0208163440',
    accountName: 'Gladys Asem',
    accountNumber: '0208163440',
    paymentMethod: 'TELECEL CASH',
    packageId: 'pkg-1', // Basic
    amount: 250,
    maturityDays: null, // use package duration
  },
  {
    fullName: 'Gifty Jane',
    username: 'Gifty',
    email: 'jane@mail.com',
    phone: '0245113310',
    accountName: 'Gifty Dzokoto',
    accountNumber: '0245113310',
    paymentMethod: 'MTN MOBILE MONEY',
    packageId: 'pkg-1', // Basic
    amount: 250,
    maturityDays: null, // use package duration
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Aborting.');
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    console.log('🚨 WARNING: Deleting non-admin data...');
    await client.query('BEGIN');

    // Clear dependent tables first
    await client.query('DELETE FROM payment_matches');
    await client.query('DELETE FROM help_activities');
    await client.query('DELETE FROM user_packages');
    await client.query('DELETE FROM transactions');
    await client.query('DELETE FROM payment_methods');
    await client.query('DELETE FROM user_payment_accounts');
    await client.query('DELETE FROM banned_accounts');

    // Delete users except admin
    await client.query("DELETE FROM users WHERE role != 'admin'");

    // Reset user_number sequence to start at 2701261
    await client.query("SELECT setval('users_user_number_seq', 2701260, false);");

    const passwordHash = await bcryptjs.hash('123456', 10);

    let userNumberSeed = 2701260;

    for (const user of users) {
      userNumberSeed += 1;
      const userId = `user-seed-${userNumberSeed}`;
      const displayId = `user${userNumberSeed}`;
      const referralCode = `REF${userNumberSeed}`;
      const myReferralCode = `MY${userNumberSeed}`;

      const insertUser = await client.query(
        `INSERT INTO users (
          id, full_name, username, email, phone_number, country,
          referral_code, my_referral_code, password_hash, profile_photo,
          role, id_verified, is_verified, payment_method_verified, total_earnings,
          display_id, registered_package_id
        ) VALUES (
          $1, $2, $3, $4, $5, 'Ghana',
          $6, $7, $8, $9,
          'member', true, true, true, 0,
          $10, $11
        )
        RETURNING id, user_number, display_id`,
        [
          userId,
          user.fullName,
          user.username,
          user.email,
          user.phone,
          referralCode,
          myReferralCode,
          passwordHash,
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.username)}`,
          displayId,
          user.packageId, // Set registered_package_id
        ]
      );

      const newUser = insertUser.rows[0];

      // Payment account (receive)
      await client.query(
        `INSERT INTO user_payment_accounts (user_id, mode, account_name, account_number, bank_name, phone_number)
         VALUES ($1, 'receive', $2, $3, $4, $5)`,
        [userId, user.accountName, user.accountNumber, user.paymentMethod, user.phone]
      );

      // Create active MATURE giver activity so "Receive Help" button is enabled
      // Maturity date is in the past (1 minute ago) so giver is already mature
      await client.query(
        `INSERT INTO help_activities (
           id, giver_id, package_id, amount, payment_method, status, admin_approved, 
           maturity_date, created_at, updated_at
         ) VALUES ($1, $2, $3, $4, $5, 'active', true, 
           NOW() - INTERVAL '1 minute', NOW(), NOW())`,
        [uuidv4(), userId, user.packageId, user.amount, user.paymentMethod]
      );

      console.log(`✓ Seeded ${newUser.display_id || newUser.user_number}: ${user.fullName} (${user.packageId} - mature giver)`);
    }

    await client.query('COMMIT');
    console.log('\n✅ All 6 users seeded with mature giver activities');
    console.log('   Each user can now click "Receive Help" button');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
