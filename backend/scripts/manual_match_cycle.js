import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '../.env' });

const API = axios.create({ baseURL: process.env.BACKEND_URL || 'http://localhost:5000' });

const log = (step, data) => {
  console.log(`\n=== ${step} ===`);
  if (data) console.log(data);
};

async function registerUser({ fullName, username, email, phoneNumber, country }) {
  const password = '123456';
  const res = await API.post('/api/register', {
    fullName,
    username,
    email,
    phoneNumber,
    country,
    password,
    confirmPassword: password,
  });
  return res.data.data.user;
}

async function login(email, password = '123456') {
  const res = await API.post('/api/login', { email, password });
  return res.data.data.token;
}

async function registerOffer(token, packageId = 'pkg-1') {
  const res = await API.post(
    '/api/help/register-offer',
    { packageId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data;
}

async function registerReceive(token, packageId = 'pkg-1') {
  const res = await API.post(
    '/api/help/register-receive',
    { packageId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data;
}

async function createMatch(adminToken, { giverId, receiverId, amount = 250, packageId = 'pkg-1' }) {
  const res = await API.post(
    '/api/admin/create-match',
    { giverId, receiverId, amount, packageId },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  return res.data.data;
}

async function confirmMatch(adminToken, matchId) {
  const res = await API.post(
    `/api/admin/payment-matches/${matchId}/confirm`,
    {},
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  return res.data.data;
}

async function main() {
  const suffix = Date.now().toString().slice(-6);
  const users = {
    giver: {
      fullName: `Giver ${suffix}`,
      username: `giver${suffix}`,
      email: `giver${suffix}@example.com`,
      phoneNumber: `+2335500${suffix}`,
      country: 'Ghana',
    },
    receiver: {
      fullName: `Receiver ${suffix}`,
      username: `receiver${suffix}`,
      email: `receiver${suffix}@example.com`,
      phoneNumber: `+2335510${suffix}`,
      country: 'Ghana',
    },
  };

  log('Register users');
  const giverUser = await registerUser(users.giver);
  const receiverUser = await registerUser(users.receiver);

  log('Login users');
  const giverToken = await login(users.giver.email);
  const receiverToken = await login(users.receiver.email);

  log('User offers help (giver)');
  await registerOffer(giverToken, 'pkg-1');

  log('Receiver offers (to unlock receive) and requests help');
  await registerOffer(receiverToken, 'pkg-1');
  await registerReceive(receiverToken, 'pkg-1');

  log('Admin login');
  const adminToken = await login(process.env.ADMIN_EMAIL || 'admin@mutualaidnetwork.com', process.env.ADMIN_PASSWORD || 'Admin123!@#');

  log('Create manual match');
  const match = await createMatch(adminToken, {
    giverId: giverUser.id,
    receiverId: receiverUser.id,
    amount: 250,
    packageId: 'pkg-1',
  });

  log('Confirm match (admin)');
  const confirmed = await confirmMatch(adminToken, match.id);

  log('Result summary', {
    giverId: giverUser.id,
    receiverId: receiverUser.id,
    matchId: match.id,
    confirmation: confirmed,
  });

  log('Next steps', 'Check /api/admin/help-activities for statuses and maturity dates.');
}

main().catch((err) => {
  console.error('\n❌ Flow failed:', err.response?.data || err.message);
  process.exitCode = 1;
});
