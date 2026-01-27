import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '../.env' });

const API = axios.create({ baseURL: process.env.BACKEND_URL || 'http://localhost:5000' });

async function login(email, password = '123456') {
  const res = await API.post('/api/login', { email, password });
  return { token: res.data.data.token, userId: res.data.data.user.id };
}

async function getMatch(token, userId) {
  const res = await API.get(`/api/user/${userId}/payment-match`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}

async function main() {
  // Test users from previous match cycle - use most recent IDs
  // Update these after running manual_match_cycle.js
  const giverEmail = 'giver000753@example.com';  // Update based on output
  const receiverEmail = 'receiver194364@example.com';  // Update based on output

  console.log('=== Testing Match Display by Role ===\n');

  try {
    // First, register new test users to create a fresh match
    console.log('Registering giver...');
    const suffix = Date.now().toString().slice(-6);
    const giverRegRes = await API.post('/api/register', {
      fullName: `Giver Display Test ${suffix}`,
      username: `giver_test_${suffix}`,
      email: `giver_test_${suffix}@example.com`,
      phoneNumber: `+2335500${suffix}`,
      country: 'Ghana',
      password: '123456',
      confirmPassword: '123456',
    });
    const giver = giverRegRes.data.data.user;
    const giverToken = giverRegRes.data.data.token;
    console.log(`✓ Registered giver: ${giver.email}`);

    console.log('Registering receiver...');
    const receiverRegRes = await API.post('/api/register', {
      fullName: `Receiver Display Test ${suffix}`,
      username: `receiver_test_${suffix}`,
      email: `receiver_test_${suffix}@example.com`,
      phoneNumber: `+2335510${suffix}`,
      country: 'Ghana',
      password: '123456',
      confirmPassword: '123456',
    });
    const receiver = receiverRegRes.data.data.user;
    const receiverToken = receiverRegRes.data.data.token;
    console.log(`✓ Registered receiver: ${receiver.email}\n`);

    // Register giver as offering help
    console.log('Giver registering to offer help...');
    await API.post('/api/help/register-offer', 
      { packageId: 'pkg-1' },
      { headers: { Authorization: `Bearer ${giverToken}` } }
    );
    console.log('✓ Giver offered help');

    // Receiver offers then receives
    console.log('Receiver registering to offer help...');
    await API.post('/api/help/register-offer',
      { packageId: 'pkg-1' },
      { headers: { Authorization: `Bearer ${receiverToken}` } }
    );
    console.log('✓ Receiver offered help');

    console.log('Receiver registering to receive help...');
    await API.post('/api/help/register-receive',
      { packageId: 'pkg-1' },
      { headers: { Authorization: `Bearer ${receiverToken}` } }
    );
    console.log('✓ Receiver requested help\n');

    // Admin creates match
    const adminAuth = await login(process.env.ADMIN_EMAIL || 'admin@mutualaidnetwork.com', process.env.ADMIN_PASSWORD || 'Admin123!@#');
    console.log('Admin creating match...');
    const matchRes = await API.post('/api/admin/create-match',
      { giverId: giver.id, receiverId: receiver.id, amount: 250, packageId: 'pkg-1' },
      { headers: { Authorization: `Bearer ${adminAuth.token}` } }
    );
    const matchId = matchRes.data.data.id;
    console.log(`✓ Created match ID: ${matchId}`);

    // Admin confirms
    console.log('Admin confirming match...');
    await API.post(`/api/admin/payment-matches/${matchId}/confirm`,
      {},
      { headers: { Authorization: `Bearer ${adminAuth.token}` } }
    );
    console.log('✓ Match confirmed\n');

    // Now test match retrieval
    console.log('=== Testing Match Fetch ===\n');

    // Fetch giver's match data
    const giverMatch = await getMatch(giverToken, giver.id);
    console.log(`✓ Giver's match data retrieved`);
    console.log(`  Role: ${giverMatch?.role}`);
    console.log(`  Should display in: "Offering Help" section only`);
    console.log(`  Matched with: ${giverMatch?.match?.matched_user?.full_name}`);
    console.log(`  Amount: ₵${giverMatch?.match?.amount}`);
    console.log('');

    // Fetch receiver's match data
    const receiverMatch = await getMatch(receiverToken, receiver.id);
    console.log(`✓ Receiver's match data retrieved`);
    console.log(`  Role: ${receiverMatch?.role}`);
    console.log(`  Should display in: "Requesting Help" section only`);
    console.log(`  Matched with: ${receiverMatch?.match?.matched_user?.full_name}`);
    console.log(`  Amount: ₵${receiverMatch?.match?.amount}`);
    console.log('');

    // Verify roles are correct
    if (giverMatch?.role === 'giver' && receiverMatch?.role === 'receiver') {
      console.log('✅ SUCCESS: Matches have correct roles');
      console.log('   - Giver will see match in "Offering Help" only');
      console.log('   - Receiver will see match in "Requesting Help" only');
    } else {
      console.log('❌ FAIL: Incorrect roles');
      console.log(`   Giver role: ${giverMatch?.role} (expected: giver)`);
      console.log(`   Receiver role: ${receiverMatch?.role} (expected: receiver)`);
      process.exitCode = 1;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('❌ Error:', err.response?.data || err.message);
    } else {
      console.error('❌ Error:', err);
    }
    process.exitCode = 1;
  }
}

main();
