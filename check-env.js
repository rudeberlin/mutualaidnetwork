#!/usr/bin/env node

/**
 * Production Deployment Script
 * Verifies environment variables are set for Render deployment
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NODE_ENV',
  'CLIENT_URL',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD'
];

const recommendedEnvVars = [
  'PORT',
  'SERVE_FRONTEND'
];

console.log('🔍 Checking Render Environment Variables...\n');

console.log('✅ REQUIRED Environment Variables:');
console.log('──────────────────────────────────────');
requiredEnvVars.forEach(varName => {
  console.log(`  ${varName}=${process.env[varName] ? '✓ SET' : '✗ MISSING'}`);
});

console.log('\n📝 RECOMMENDED Environment Variables:');
console.log('──────────────────────────────────────');
recommendedEnvVars.forEach(varName => {
  console.log(`  ${varName}=${process.env[varName] || 'not set'}`);
});

console.log('\n📋 Expected Values for Render:');
console.log('──────────────────────────────────────');
console.log('  DATABASE_URL=postgresql://mutualaidnetwork:***@dpg-d5q03sogjchc73dn7e2g-a.virginia-postgres.render.com/mutualaidnetwork_db');
console.log('  JWT_SECRET=<64-character-random-string>');
console.log('  NODE_ENV=production');
console.log('  CLIENT_URL=https://mutualaidnetwork.vercel.app (or your Render URL)');
console.log('  ADMIN_EMAIL=admin@mutualaidnetwork.com');
console.log('  ADMIN_PASSWORD=Admin123!@#');
console.log('  PORT=10000');
console.log('  SERVE_FRONTEND=true (if serving from Render)');

console.log('\n🔐 Admin Credentials:');
console.log('──────────────────────────────────────');
console.log('  Email: admin@mutualaidnetwork.com');
console.log('  Password: Admin123!@#');

console.log('\n🚀 Render Deployment URLs:');
console.log('──────────────────────────────────────');
console.log('  Backend: https://mutualaidnetwork.onrender.com');
console.log('  Health: https://mutualaidnetwork.onrender.com/api/health');
console.log('  Frontend: https://mutualaidnetwork.vercel.app (if using Vercel)');
console.log('  or: https://mutualaidnetwork.onrender.com (if SERVE_FRONTEND=true)');

console.log('\n📚 Next Steps:');
console.log('──────────────────────────────────────');
console.log('  1. Go to Render Dashboard: https://dashboard.render.com');
console.log('  2. Select your service: mutualaidnetwork');
console.log('  3. Go to Environment tab');
console.log('  4. Add all REQUIRED variables above');
console.log('  5. Save (this triggers automatic redeploy)');
console.log('  6. Wait 5-10 minutes for deployment');
console.log('  7. Check logs for: ✅ Database initialized successfully');
console.log('  8. Test: https://mutualaidnetwork.onrender.com/api/health');
console.log('  9. Login with admin credentials above');

const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.log('\n⚠️  WARNING: Missing required variables:', missingVars.join(', '));
  console.log('   Add these to Render before deployment will work!\n');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!\n');
  process.exit(0);
}
