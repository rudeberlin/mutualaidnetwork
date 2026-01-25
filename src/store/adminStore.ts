import { create } from 'zustand';
import type {
  AdminVerification,
  AdminHelpActivity,
  AdminPayment,
  AdminTransaction,
  AdminPackage,
  AdminReportPoint,
  User,
} from '../types';
import { adminService } from '../services/adminService';

interface AdminState {
  loading: boolean;
  error?: string;
  users: User[];
  verifications: AdminVerification[];
  helpActivities: AdminHelpActivity[];
  payments: AdminPayment[];
  transactions: AdminTransaction[];
  packages: AdminPackage[];
  reports: {
    monthlyHelpVolume: AdminReportPoint[];
    userGrowth: AdminReportPoint[];
    helpStatus: AdminReportPoint[];
  } | null;
  initData: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshVerifications: () => Promise<void>;
  refreshHelpActivities: () => Promise<void>;
  refreshPayments: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshPackages: () => Promise<void>;
  approveVerification: (id: string, reviewer: string) => Promise<void>;
  rejectVerification: (id: string, reason: string, reviewer: string) => Promise<void>;
  suspendUser: (id: string) => Promise<void>;
  reactivateUser: (id: string) => Promise<void>;
  completeHelp: (id: string) => Promise<void>;
  resolveDispute: (id: string) => Promise<void>;
  verifyPayment: (id: string) => Promise<void>;
  flagPayment: (id: string) => Promise<void>;
  updatePackage: (pkg: AdminPackage) => Promise<void>;
  togglePackage: (id: string, active: boolean) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  loading: false,
  users: [],
  verifications: [],
  helpActivities: [],
  payments: [],
  transactions: [],
  packages: [],
  reports: null,

  async initData() {
    set({ loading: true, error: undefined });
    try {
      const [users, verifications, helpActivities, payments, transactions, packages, reports] = await Promise.all([
        adminService.fetchUsers().catch(e => { console.error('Error fetching users:', e); return []; }),
        adminService.fetchVerifications().catch(e => { console.error('Error fetching verifications:', e); return []; }),
        adminService.fetchHelpActivities().catch(e => { console.error('Error fetching help activities:', e); return []; }),
        adminService.fetchPayments().catch(e => { console.error('Error fetching payments:', e); return []; }),
        adminService.fetchTransactions().catch(e => { console.error('Error fetching transactions:', e); return []; }),
        adminService.fetchPackages().catch(e => { console.error('Error fetching packages:', e); return []; }),
        adminService.fetchReports().catch(e => { console.error('Error fetching reports:', e); return { monthlyHelpVolume: [], userGrowth: [], helpStatus: [] }; }),
      ]);
      console.log('Admin data loaded:', { users: users.length, verifications: verifications.length });
      set({ users, verifications, helpActivities, payments, transactions, packages, reports, loading: false });
    } catch (err) {
      console.error('Admin data load error:', err);
      set({ error: 'Failed to load admin data. Check console for details.', loading: false });
    }
  },

  async refreshUsers() {
    try {
      const users = await adminService.fetchUsers();
      set({ users });
    } catch {
      set({ error: 'Failed to refresh users' });
    }
  },

  async refreshVerifications() {
    try {
      const verifications = await adminService.fetchVerifications();
      set({ verifications });
    } catch {
      set({ error: 'Failed to refresh verifications' });
    }
  },

  async refreshHelpActivities() {
    try {
      const helpActivities = await adminService.fetchHelpActivities();
      set({ helpActivities });
    } catch {
      set({ error: 'Failed to refresh help activities' });
    }
  },

  async refreshPayments() {
    try {
      const payments = await adminService.fetchPayments();
      set({ payments });
    } catch {
      set({ error: 'Failed to refresh payments' });
    }
  },

  async refreshTransactions() {
    try {
      const transactions = await adminService.fetchTransactions();
      set({ transactions });
    } catch {
      set({ error: 'Failed to refresh transactions' });
    }
  },

  async refreshPackages() {
    try {
      const packages = await adminService.fetchPackages();
      set({ packages });
    } catch {
      set({ error: 'Failed to refresh packages' });
    }
  },

  async approveVerification(id, reviewer) {
    await adminService.approveVerification(id, reviewer);
    set({
      verifications: get().verifications.map((v) =>
        v.id === id ? { ...v, status: 'Approved', reviewer, reviewedAt: new Date() } : v
      ),
    });
  },

  async rejectVerification(id, reason, reviewer) {
    await adminService.rejectVerification(id, reason, reviewer);
    set({
      verifications: get().verifications.map((v) =>
        v.id === id ? { ...v, status: 'Rejected', reviewer, reviewedAt: new Date(), rejectionReason: reason } : v
      ),
    });
  },

  async suspendUser(id) {
    await adminService.suspendUser(id);
    set({
      users: get().users.map((u) => (u.id === id ? { ...u, isVerified: false } : u)),
    });
  },

  async reactivateUser(id) {
    await adminService.reactivateUser(id);
    set({
      users: get().users.map((u) => (u.id === id ? { ...u, isVerified: true } : u)),
    });
  },

  async completeHelp(id) {
    await adminService.completeHelpActivity(id);
    set({
      helpActivities: get().helpActivities.map((h) => (h.id === id ? { ...h, status: 'Completed' } : h)),
    });
    // Refresh to ensure persistence
    await this.refreshHelpActivities();
  },

  async resolveDispute(id) {
    await adminService.resolveDispute(id);
    set({
      helpActivities: get().helpActivities.map((h) => (h.id === id ? { ...h, status: 'Active' } : h)),
    });
    // Refresh to ensure persistence
    await this.refreshHelpActivities();
  },

  async verifyPayment(id) {
    await adminService.verifyPayment(id);
    set({
      payments: get().payments.map((p) => (p.id === id ? { ...p, status: 'Confirmed' } : p)),
    });
  },

  async flagPayment(id) {
    await adminService.flagPayment(id);
    set({
      payments: get().payments.map((p) => (p.id === id ? { ...p, status: 'Flagged' } : p)),
    });
  },

  async updatePackage(pkg) {
    await adminService.updatePackage(pkg);
    set({
      packages: get().packages.map((p) => (p.id === pkg.id ? { ...pkg } : p)),
    });
  },

  async togglePackage(id, active) {
    await adminService.togglePackage(id, active);
    set({
      packages: get().packages.map((p) => (p.id === id ? { ...p, active } : p)),
    });
  },
}));
