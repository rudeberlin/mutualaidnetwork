import type { Package, User, Transaction, MatchedMember } from '../types';

// Placeholder package images (SVG)
const basicPackageImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Cdefs%3E%3ClinearGradient id="basicGrad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2310b981;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%230d9488;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23basicGrad)" width="200" height="200"/%3E%3Ccircle cx="100" cy="80" r="30" fill="white" opacity="0.2"/%3E%3Ctext x="100" y="150" font-size="32" text-anchor="middle" fill="white" font-weight="bold"%3E🌱%3C/text%3E%3C/svg%3E';
const bronzePackageImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Cdefs%3E%3ClinearGradient id="bronzeGrad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23b45309;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%238b5a00;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23bronzeGrad)" width="200" height="200"/%3E%3Ccircle cx="100" cy="80" r="30" fill="white" opacity="0.2"/%3E%3Ctext x="100" y="150" font-size="32" text-anchor="middle" fill="white" font-weight="bold"%3E🥉%3C/text%3E%3C/svg%3E';
const silverPackageImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Cdefs%3E%3ClinearGradient id="silverGrad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23c0c0c0;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23808080;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23silverGrad)" width="200" height="200"/%3E%3Ccircle cx="100" cy="80" r="30" fill="white" opacity="0.2"/%3E%3Ctext x="100" y="150" font-size="32" text-anchor="middle" fill="white" font-weight="bold"%3E🥈%3C/text%3E%3C/svg%3E';
const goldPackageImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Cdefs%3E%3ClinearGradient id="goldGrad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23fbbf24;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23d97706;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23goldGrad)" width="200" height="200"/%3E%3Ccircle cx="100" cy="80" r="30" fill="white" opacity="0.2"/%3E%3Ctext x="100" y="150" font-size="32" text-anchor="middle" fill="white" font-weight="bold"%3E🏆%3C/text%3E%3C/svg%3E';

// Mutual Aid Network Packages (in GHS - Ghana Cedis)
export const PACKAGES: Package[] = [
  {
    id: 'pkg-1',
    name: 'Basic Help',
    amount: 250,
    returnPercentage: 50,
    durationDays: 5,
    description: 'Perfect for getting started',
    icon: '🌱',
    image: basicPackageImage,
  },
  {
    id: 'pkg-2',
    name: 'Standard Help',
    amount: 500,
    returnPercentage: 50,
    durationDays: 5,
    description: 'Build your earnings',
    icon: '🥉',
    image: bronzePackageImage,
  },
  {
    id: 'pkg-3',
    name: 'Premium Help',
    amount: 1500,
    returnPercentage: 50,
    durationDays: 15,
    description: 'Accelerate your growth',
    icon: '🥈',
    image: silverPackageImage,
  },
  {
    id: 'pkg-4',
    name: 'Elite Help',
    amount: 2500,
    returnPercentage: 50,
    durationDays: 15,
    description: 'Premium support included',
    icon: '🏆',
    image: goldPackageImage,
  },
];

// Mock Current User
export const MOCK_CURRENT_USER: User = {
  id: 'user-123',
  fullName: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  phoneNumber: '+1234567890',
  country: 'United States',
  profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  role: 'admin',
  idDocuments: {
    frontImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%23f0ad4e" width="300" height="200"/%3E%3C/svg%3E',
    backImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%23d58512" width="300" height="200"/%3E%3C/svg%3E',
    uploadedAt: new Date('2024-01-10'),
    verified: true,
  },
  isVerified: true,
  paymentMethodVerified: true,
  totalEarnings: 1250.50,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-23'),
};

// Mock Matched Member
export const MOCK_MATCHED_MEMBER: MatchedMember = {
  id: 'member-456',
  name: 'Jane Helper',
  paymentMethod: 'BANK_TRANSFER',
  accountNumber: '****5678',
  amount: 250,
};

// Mock Transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-001',
    userId: 'user-123',
    type: 'DEPOSIT',
    amount: 500,
    currency: 'USD',
    status: 'COMPLETED',
    description: 'Initial deposit',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'txn-002',
    userId: 'user-123',
    type: 'HELP_GIVEN',
    amount: 250,
    currency: 'USD',
    status: 'COMPLETED',
    description: 'Help provided to member',
    relatedMemberId: 'member-456',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'txn-003',
    userId: 'user-123',
    type: 'HELP_RECEIVED',
    amount: 250,
    currency: 'USD',
    status: 'COMPLETED',
    description: 'Help received from network',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'txn-004',
    userId: 'user-123',
    type: 'WITHDRAWAL',
    amount: 750.50,
    currency: 'USD',
    status: 'COMPLETED',
    description: 'Earnings withdrawal',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'txn-005',
    userId: 'user-123',
    type: 'DEPOSIT',
    amount: 100,
    currency: 'USD',
    status: 'PENDING',
    description: 'Additional deposit',
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
  },
];

// Mock Other Users
export const MOCK_OTHER_USERS: User[] = [
  {
    id: 'user-456',
    fullName: 'Jane Helper',
    username: 'janehelper',
    email: 'jane@example.com',
    phoneNumber: '+1987654321',
    country: 'United States',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'member',
    idDocuments: {
      frontImage: '',
      backImage: '',
      uploadedAt: new Date('2024-01-05'),
      verified: true,
    },
    isVerified: true,
    paymentMethodVerified: true,
    totalEarnings: 2500,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-23'),
  },
  {
    id: 'user-789',
    fullName: 'Mike Community',
    username: 'mikecommunity',
    email: 'mike@example.com',
    phoneNumber: '+1555666777',
    country: 'Canada',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    role: 'member',
    idDocuments: {
      frontImage: '',
      backImage: '',
      uploadedAt: new Date('2024-01-08'),
      verified: true,
    },
    isVerified: true,
    paymentMethodVerified: false,
    totalEarnings: 500,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-23'),
  },
];

// All countries list (sample - can be expanded)
export const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Poland',
  'Ukraine',
  'Russia',
  'Japan',
  'South Korea',
  'China',
  'India',
  'Mexico',
  'Brazil',
  'Argentina',
  'South Africa',
  'Nigeria',
  'Kenya',
  'Egypt',
  'Ghana',
];

