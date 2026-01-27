import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '../.env' });

const API = axios.create({ baseURL: process.env.BACKEND_URL || 'http://localhost:5000' });

async function login(email, password) {
  const res = await API.post('/api/login', { email, password });
  return res.data.data.token;
}

async function main() {
  const adminToken = await login(
    process.env.ADMIN_EMAIL || 'admin@mutualaidnetwork.com',
    process.env.ADMIN_PASSWORD || 'Admin123!@#'
  );

  const res = await API.get('/api/admin/help-activities', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  const activities = res.data.data;
  
  console.log('\n=== Help Activities (Last 10) ===\n');
  activities.slice(0, 10).forEach((a) => {
    console.log(`Activity ID: ${a.id}`);
    console.log(`  Giver: ${a.giver_id || '(none)'}`);
    console.log(`  Receiver: ${a.receiver_id || '(none)'}`);
    console.log(`  Package: ${a.package_id}, Amount: ${a.amount}`);
    console.log(`  Status: ${a.status}`);
    console.log(`  Maturity: ${a.maturity_date || '(not set)'}`);
    console.log(`  Admin Approved: ${a.admin_approved}`);
    console.log(`  Created: ${a.created_at}`);
    console.log('');
  });
}

main().catch((err) => {
  console.error('❌ Error:', err.response?.data || err.message);
  process.exitCode = 1;
});
