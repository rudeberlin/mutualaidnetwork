#!/usr/bin/env node

/**
 * InvestPlatform - Quick Start Script
 * Run this to get started with the project
 */

const fs = require('fs');
const path = require('path');

console.log('\n');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║        🚀 Welcome to InvestPlatform 1.0.0              ║');
console.log('║     Peer-to-Peer Investment Platform with Admin Panel      ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('\n');

console.log('📋 Quick Start Guide:\n');
console.log('1️⃣  Install Dependencies:');
console.log('    npm install --legacy-peer-deps\n');

console.log('2️⃣  Start Development Server:');
console.log('    npm run dev\n');

console.log('3️⃣  Open in Browser:');
console.log('    http://localhost:5173\n');

console.log('📚 Documentation:\n');
console.log('├─ README.md                  ← Start here for overview');
console.log('├─ GETTING_STARTED.md         ← Setup guide');
console.log('├─ DOCUMENTATION.md           ← Full technical reference');
console.log('├─ SETUP_DEPLOYMENT.md        ← Deployment guide');
console.log('├─ ADMIN_PANEL_GUIDE.md       ← Admin features');
console.log('├─ INDEX.md                   ← Documentation roadmap');
console.log('└─ PROJECT_COMPLETE.md        ← Project summary\n');

console.log('🔐 Demo Login Credentials:\n');
console.log('├─ Email:    Any email (test@example.com)');
console.log('└─ Password: Any 6+ character password\n');

console.log('🎯 Main Features:\n');
console.log('├─ 7 Complete Pages');
console.log('├─ Investment Dashboard');
console.log('├─ Admin Panel');
console.log('├─ Authentication System');
console.log('├─ Payment Tracking');
console.log('├─ Transaction History');
console.log('└─ Responsive Design\n');

console.log('📞 Support:\n');
console.log('├─ Email:   support@investplatform.com');
console.log('├─ Phone:   +233 24 123 4567');
console.log('└─ Website: www.investplatform.com\n');

console.log('✨ Next Steps:\n');
console.log('1. Read the README.md file');
console.log('2. Run: npm install --legacy-peer-deps');
console.log('3. Run: npm run dev');
console.log('4. Explore the platform');
console.log('5. Read GETTING_STARTED.md for development guide\n');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║                   Happy Coding! 🎉                        ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('⚠️  Dependencies not installed yet.');
    console.log('Run: npm install --legacy-peer-deps\n');
} else {
    console.log('✅ Dependencies installed. Ready to start!\n');
    console.log('To start development server, run:');
    console.log('npm run dev\n');
}
