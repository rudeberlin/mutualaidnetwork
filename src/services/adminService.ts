import type {
  AdminVerification,
  AdminHelpActivity,
  AdminPayment,
  AdminTransaction,
  AdminPackage,
  AdminReportPoint,
  User,
} from '../types';

// Mock data sources
const mockUsers: User[] = [
  {
    id: 'u1',
    fullName: 'Admin User',
    username: 'admin',
    email: 'admin@mutualaidnetwork.com',
    phoneNumber: '+1-555-123-4567',
    country: 'USA',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    role: 'admin',
    idDocuments: {
      frontImage: '/owner-profile-1.svg',
      backImage: '/owner-profile-2.svg',
      uploadedAt: new Date(),
      verified: true,
    },
    isVerified: true,
    paymentMethodVerified: true,
    totalEarnings: 2500,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'u2',
    fullName: 'Sarah Williams',
    username: 'sarahw',
    email: 'sarah@example.com',
    phoneNumber: '+233-24-000-0000',
    country: 'Ghana',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'member',
    idDocuments: {
      frontImage: '/owner-profile-2.svg',
      backImage: '/owner-profile-3.svg',
      uploadedAt: new Date('2024-02-10'),
      verified: false,
    },
    isVerified: false,
    paymentMethodVerified: false,
    totalEarnings: 120,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-05'),
  },
  {
    id: 'u3',
    fullName: 'Michael Johnson',
    username: 'mikej',
    email: 'mike@example.com',
    phoneNumber: '+44-20-000-0000',
    country: 'UK',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    role: 'member',
    idDocuments: {
      frontImage: '/owner-profile-1.svg',
      backImage: '/owner-profile-2.svg',
      uploadedAt: new Date('2024-03-15'),
      verified: true,
    },
    isVerified: true,
    paymentMethodVerified: true,
    totalEarnings: 640,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-12-02'),
  },
];

const mockVerifications: AdminVerification[] = [
  {
    id: 'v1',
    userId: 'u2',
    fullName: 'Sarah Williams',
    username: 'sarahw',
    profilePhoto: mockUsers[1].profilePhoto,
    idType: 'ID Card',
    frontImage: '/owner-profile-2.svg',
    backImage: '/owner-profile-3.svg',
    status: 'Pending',
    submittedAt: new Date('2024-12-10'),
  },
  {
    id: 'v2',
    userId: 'u3',
    fullName: 'Michael Johnson',
    username: 'mikej',
    profilePhoto: mockUsers[2].profilePhoto,
    idType: "Driver's License",
    frontImage: '/owner-profile-1.svg',
    backImage: '/owner-profile-2.svg',
    status: 'Approved',
    submittedAt: new Date('2024-10-02'),
    reviewedAt: new Date('2024-10-05'),
    reviewer: 'Admin User',
  },
];

const mockHelpActivities: AdminHelpActivity[] = [
  {
    id: 'ha1',
    giverName: 'Sarah Williams',
    receiverName: 'Michael Johnson',
    packageName: 'Bronze',
    amount: 100,
    startDate: new Date('2024-12-01'),
    dueDate: new Date('2024-12-15'),
    status: 'Active',
  },
  {
    id: 'ha2',
    giverName: 'Michael Johnson',
    receiverName: 'Tom Brown',
    packageName: 'Silver',
    amount: 250,
    startDate: new Date('2024-11-01'),
    dueDate: new Date('2024-11-20'),
    status: 'Completed',
  },
];

const mockPayments: AdminPayment[] = [
  {
    id: 'p1',
    userName: 'Sarah Williams',
    method: 'Mobile Money',
    maskedDetails: 'MoMo ****1234',
    amount: 120,
    status: 'Pending',
    submittedAt: new Date('2024-12-11'),
  },
  {
    id: 'p2',
    userName: 'Michael Johnson',
    method: 'Bank',
    maskedDetails: 'Bank ****6789',
    amount: 250,
    status: 'Confirmed',
    submittedAt: new Date('2024-10-05'),
  },
];

const mockTransactions: AdminTransaction[] = [
  { id: 't1', userName: 'Sarah Williams', type: 'Help Given', amount: 100, status: 'Completed', date: new Date('2024-12-02') },
  { id: 't2', userName: 'Michael Johnson', type: 'Help Received', amount: 250, status: 'Completed', date: new Date('2024-11-15') },
  { id: 't3', userName: 'Tom Brown', type: 'Help Given', amount: 75, status: 'Pending', date: new Date('2024-12-12') },
];

const mockPackages: AdminPackage[] = [
  { id: 'pkg1', name: 'Basic', amount: 25, returnPercentage: 30, durationDays: 3, active: true },
  { id: 'pkg2', name: 'Bronze', amount: 100, returnPercentage: 30, durationDays: 5, active: true },
  { id: 'pkg3', name: 'Silver', amount: 250, returnPercentage: 50, durationDays: 15, active: true },
  { id: 'pkg4', name: 'Gold', amount: 500, returnPercentage: 50, durationDays: 15, active: true },
  { id: 'pkg5', name: 'Premium Plus', amount: 750, returnPercentage: 60, durationDays: 20, active: false },
];

const mockReports = {
  monthlyHelpVolume: [
    { label: 'Sep', value: 4200 },
    { label: 'Oct', value: 5400 },
    { label: 'Nov', value: 6100 },
    { label: 'Dec', value: 7200 },
  ] satisfies AdminReportPoint[],
  userGrowth: [
    { label: 'Sep', value: 180 },
    { label: 'Oct', value: 240 },
    { label: 'Nov', value: 320 },
    { label: 'Dec', value: 410 },
  ] satisfies AdminReportPoint[],
  helpStatus: [
    { label: 'Completed', value: 68 },
    { label: 'Pending', value: 22 },
    { label: 'Active', value: 10 },
  ] satisfies AdminReportPoint[],
};

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const adminService = {
  async fetchUsers() {
    await delay();
    return [...mockUsers];
  },
  async suspendUser(userId: string) {
    await delay();
    return userId;
  },
  async reactivateUser(userId: string) {
    await delay();
    return userId;
  },
  async fetchVerifications() {
    await delay();
    return [...mockVerifications];
  },
  async approveVerification(id: string, reviewer: string) {
    await delay();
    return { id, reviewer };
  },
  async rejectVerification(id: string, reason: string, reviewer: string) {
    await delay();
    return { id, reason, reviewer };
  },
  async fetchHelpActivities() {
    await delay();
    return [...mockHelpActivities];
  },
  async completeHelpActivity(id: string) {
    await delay();
    return id;
  },
  async resolveDispute(id: string) {
    await delay();
    return id;
  },
  async fetchPayments() {
    await delay();
    return [...mockPayments];
  },
  async verifyPayment(id: string) {
    await delay();
    return id;
  },
  async flagPayment(id: string) {
    await delay();
    return id;
  },
  async fetchTransactions() {
    await delay();
    return [...mockTransactions];
  },
  async fetchPackages() {
    await delay();
    return [...mockPackages];
  },
  async updatePackage(updated: AdminPackage) {
    await delay();
    return updated;
  },
  async togglePackage(id: string, active: boolean) {
    await delay();
    return { id, active };
  },
  async fetchReports() {
    await delay();
    return { ...mockReports };
  },
};
