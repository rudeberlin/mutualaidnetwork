import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const { Pool } = pg;

// Expect both env vars to be set
const OLD_DATABASE_URL = process.env.OLD_DATABASE_URL;
const NEW_DATABASE_URL = process.env.DATABASE_URL;

if (!OLD_DATABASE_URL || !NEW_DATABASE_URL) {
  console.error('❌ Missing env vars. Set OLD_DATABASE_URL and DATABASE_URL');
  process.exit(1);
}

const oldPool = new Pool({ connectionString: OLD_DATABASE_URL, ssl: { rejectUnauthorized: false } });
const newPool = new Pool({ connectionString: NEW_DATABASE_URL, ssl: { rejectUnauthorized: false } });

function sanitizeUrl(u) {
  if (!u) return null;
  const s = String(u).trim();
  // Allow data URIs and http(s)
  if (s.startsWith('data:')) return s;
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  // Allow backend-served paths starting with /
  if (s.startsWith('/')) return s;
  // Anything else (e.g., 'base64...', 'base:...') drop
  return null;
}

async function run() {
  const oldClient = await oldPool.connect();
  const newClient = await newPool.connect();
  try {
    console.log('🔄 Fetching users from old Render DB...');
    const usersRes = await oldClient.query(`
      SELECT id, user_number, display_id, full_name, username, email, phone_number, country,
             referral_code, my_referral_code, password_hash, profile_photo, role,
             id_front_image, id_back_image, id_verified, is_verified,
             payment_method_verified, total_earnings, created_at, updated_at
      FROM users
    `);
    const users = usersRes.rows;
    console.log(`📦 Found ${users.length} users`);

    // Upsert users into Neon
    for (const u of users) {
      const profilePhoto = sanitizeUrl(u.profile_photo) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`;
      const idFront = sanitizeUrl(u.id_front_image);
      const idBack = sanitizeUrl(u.id_back_image);

      try {
        await newClient.query(`
          INSERT INTO users (
            id, user_number, display_id, full_name, username, email, phone_number, country,
            referral_code, my_referral_code, password_hash, profile_photo, role,
            id_front_image, id_back_image, id_verified, is_verified,
            payment_method_verified, total_earnings, created_at, updated_at
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
          )
          ON CONFLICT (id) DO UPDATE SET
            display_id = EXCLUDED.display_id,
            full_name = EXCLUDED.full_name,
            username = EXCLUDED.username,
            email = EXCLUDED.email,
            phone_number = EXCLUDED.phone_number,
            country = EXCLUDED.country,
            referral_code = EXCLUDED.referral_code,
            my_referral_code = EXCLUDED.my_referral_code,
            password_hash = EXCLUDED.password_hash,
            profile_photo = EXCLUDED.profile_photo,
            role = EXCLUDED.role,
            id_front_image = EXCLUDED.id_front_image,
            id_back_image = EXCLUDED.id_back_image,
            id_verified = EXCLUDED.id_verified,
            is_verified = EXCLUDED.is_verified,
            payment_method_verified = EXCLUDED.payment_method_verified,
            total_earnings = EXCLUDED.total_earnings,
            updated_at = EXCLUDED.updated_at
        `, [
          u.id, u.user_number, u.display_id, u.full_name, u.username, u.email, u.phone_number, u.country,
          u.referral_code, u.my_referral_code, u.password_hash, profilePhoto, u.role,
          idFront, idBack, u.id_verified, u.is_verified,
          u.payment_method_verified, u.total_earnings, u.created_at, u.updated_at || u.created_at
        ]);
      } catch (e) {
        if (e.code === '23505' && e.constraint && e.constraint.includes('user_number')) {
          // User already exists with this number; skip
          continue;
        } else {
          throw e;
        }
      }
    }

    console.log('✅ Users migrated to Neon');

    // Sanitize URL fields in payment_methods table (if it has a details field with URLs)
    console.log('🔄 Sanitizing payment_methods...');
    try {
      const paymentMethods = await newClient.query('SELECT id, details FROM payment_methods LIMIT 100');
      for (const pm of paymentMethods.rows) {
        try {
          const details = typeof pm.details === 'string' ? JSON.parse(pm.details) : (pm.details || {});
          let changed = false;
          for (const key in details) {
            const val = String(details[key] || '');
            if (val.toLowerCase().startsWith('base') && !val.startsWith('base64:data:')) {
              delete details[key];
              changed = true;
            }
          }
          if (changed) {
            await newClient.query(
              'UPDATE payment_methods SET details = $1 WHERE id = $2',
              [JSON.stringify(details), pm.id]
            );
          }
        } catch (e) {
          // Skip malformed entries
        }
      }
      console.log('✅ payment_methods sanitized');
    } catch (e) {
      console.log('⚠️  payment_methods sanitization skipped (table may not have expected columns)');
    }
  } catch (err) {
    console.error('❌ Migration error:', err.message);
  } finally {
    oldClient.release();
    newClient.release();
    await oldPool.end();
    await newPool.end();
  }
}

run();
