import axios from 'axios';
import type {
  AdminVerification,
  AdminHelpActivity,
  AdminPayment,
  AdminTransaction,
  AdminPackage,
  AdminReportPoint,
  User,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Frontend guard: drop invalid image strings and attach API origin for relative paths
const sanitizeImageUrl = (url?: string) => {
  if (!url) return '';
  const val = url.trim();
  if (val.startsWith('http://') || val.startsWith('https://')) return val;
  if (val.startsWith('/')) return `${API_URL}${val}`;
  if (val.startsWith('data:')) return val;
  return '';
};

interface RawUser {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
  country: string;
  role: string;
  is_verified: boolean;
  payment_method_verified: boolean;
  total_earnings?: number | string;
  created_at: string;
  updated_at?: string;
  id_front_image?: string;
  id_back_image?: string;
  id_verified?: boolean;
}

interface RawVerification {
  id: string;
  user_name: string;
  email: string;
  id_front_image?: string;
  id_back_image?: string;
  submitted_at: string;
}

interface RawActivity {
  id: string;
  giver_id?: string;
  receiver_id?: string;
  package_id: string;
  amount: number | string;
  created_at: string;
  status: string;
}

interface RawPayment {
  id: string;
  user_id?: string;
  type?: string;
  verified?: boolean;
  added_at: string;
  active?: boolean;
}

interface RawTransaction {
  id: string;
  user_id?: string;
  type: string;
  amount: number | string;
  currency?: string;
  status: string;
  created_at: string;
}

interface RawPackage {
  id: string;
  name: string;
  amount: number | string;
  return_percentage: number;
  duration_days: number;
  description?: string;
  active?: boolean;
}

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminService = {
  async fetchUsers(): Promise<User[]> {
    const response = await api.get('/api/admin/users');
    const users = (response.data.data || []) as RawUser[];
    return users.map((u) => ({
      id: u.id,
      fullName: u.full_name,
      username: u.username,
      email: u.email,
      phoneNumber: u.phone_number,
      country: u.country,
      role: (u.role === 'admin' ? 'admin' : 'member') as User['role'],
      isVerified: u.is_verified,
      paymentMethodVerified: u.payment_method_verified,
      totalEarnings: Number(u.total_earnings || 0),
      createdAt: new Date(u.created_at),
      updatedAt: new Date(u.updated_at || u.created_at),
      idDocuments: {
        frontImage: sanitizeImageUrl(u.id_front_image),
        backImage: sanitizeImageUrl(u.id_back_image),
        uploadedAt: u.created_at ? new Date(u.created_at) : new Date(),
        verified: u.id_verified || false,
      },
    }));
  },

  async fetchVerifications(): Promise<AdminVerification[]> {
    const response = await api.get('/api/admin/verifications');
    const verifications = (response.data.data || []) as RawVerification[];
    
    // Transform backend data to match frontend format
    return verifications.map((v) => ({
      id: v.id,
      userId: v.id,
      fullName: v.user_name,
      username: v.email.split('@')[0],
      profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${v.user_name}`,
      idType: 'ID Card',
      frontImage: sanitizeImageUrl(v.id_front_image),
      backImage: sanitizeImageUrl(v.id_back_image),
      status: 'Pending',
      submittedAt: new Date(v.submitted_at),
    }));
  },

  async approveVerification(id: string, reviewer: string) {
    await api.post(`/api/admin/verify-user/${id}`, { reviewer });
    return { id, reviewer };
  },

  async rejectVerification(id: string, reason: string, reviewer: string) {
    // Backend doesn't have reject endpoint yet, so just return
    return { id, reason, reviewer };
  },

  async fetchHelpActivities(): Promise<AdminHelpActivity[]> {
    const response = await api.get('/api/admin/help-activities');
    const activities = (response.data.data || []) as RawActivity[];
    
    return activities.map((a) => {
      const statusMap: Record<string, AdminHelpActivity['status']> = {
        pending: 'Pending',
        active: 'Active',
        completed: 'Completed',
        disputed: 'Disputed',
      };

      return {
      id: a.id,
      giverName: 'User ' + a.giver_id?.substring(0, 8),
      receiverName: a.receiver_id ? 'User ' + a.receiver_id.substring(0, 8) : 'N/A',
      packageName: a.package_id,
        amount: Number(a.amount),
      startDate: new Date(a.created_at),
      dueDate: new Date(a.created_at),
        status: statusMap[a.status] || 'Pending',
      };
    });
  },

  async completeHelpActivity(id: string) {
    const response = await api.post(`/api/admin/help-activities/${id}/complete`);
    return response.data;
  },

  async resolveDispute(id: string) {
    const response = await api.post(`/api/admin/help-activities/${id}/resolve`);
    return response.data;
  },

  async fetchPayments(): Promise<AdminPayment[]> {
    const response = await api.get('/api/admin/payments');
    const payments = (response.data.data || []) as RawPayment[];
    
    return payments.map((p) => {
      const method: AdminPayment['method'] = p.type === 'Mobile Money'
        ? 'Mobile Money'
        : p.type === 'Bank'
        ? 'Bank'
        : p.type === 'Card'
        ? 'Card'
        : 'BTC';
      const status: AdminPayment['status'] = p.verified ? 'Confirmed' : 'Pending';
      return {
      id: p.id,
      userName: 'User ' + p.user_id?.substring(0, 8),
        method,
      maskedDetails: '****' + p.id.toString().slice(-4),
        amount: 0,
        status,
      submittedAt: new Date(p.added_at),
      };
    });
  },

  async verifyPayment(id: string) {
    // Backend endpoint to be created
    return id;
  },

  async flagPayment(id: string) {
    // Backend endpoint to be created
    return id;
  },

  async fetchTransactions(): Promise<AdminTransaction[]> {
    const response = await api.get('/api/admin/transactions');
    const transactions = (response.data.data || []) as RawTransaction[];
    
    return transactions.map((t) => {
      const type: AdminTransaction['type'] = t.type === 'Help Given' ? 'Help Given' : 'Help Received';
      const status: AdminTransaction['status'] = t.status === 'completed'
        ? 'Completed'
        : t.status === 'failed'
        ? 'Failed'
        : 'Pending';
      return {
        id: t.id,
        userName: 'User ' + t.user_id?.substring(0, 8),
        type,
        amount: Number(t.amount),
        currency: t.currency || 'USD',
        status,
        date: new Date(t.created_at),
      };
    });
  },

  async fetchPackages(): Promise<AdminPackage[]> {
    const response = await api.get('/api/packages');
    const packages = (response.data.data || []) as RawPackage[];
    
    return packages.map((p) => ({
      id: p.id,
      name: p.name,
      amount: Number(p.amount),
      returnPercentage: p.return_percentage,
      durationDays: p.duration_days,
      description: p.description,
      active: p.active ?? false,
    }));
  },

  async updatePackage(updated: AdminPackage) {
    await api.put(`/api/admin/packages/${updated.id}`, {
      name: updated.name,
      amount: updated.amount,
      return_percentage: updated.returnPercentage,
      duration_days: updated.durationDays,
      active: updated.active,
    });
    return updated;
  },

  async togglePackage(id: string, active: boolean) {
    await api.put(`/api/admin/packages/${id}`, { active });
    return { id, active };
  },

  async suspendUser(userId: string) {
    const response = await api.post(`/api/admin/suspend-user/${userId}`);
    return response.data.data;
  },

  async reactivateUser(userId: string) {
    const response = await api.post(`/api/admin/reactivate-user/${userId}`);
    return response.data.data;
  },

  async fetchReports() {
    // Mock reports for now - can be enhanced with real backend data
    return {
      monthlyHelpVolume: [
        { label: 'Jan', value: 4200 },
        { label: 'Feb', value: 5600 },
        { label: 'Mar', value: 7100 },
        { label: 'Apr', value: 6800 },
        { label: 'May', value: 8200 },
        { label: 'Jun', value: 9400 },
      ] as AdminReportPoint[],
      userGrowth: [
        { label: 'Jan', value: 120 },
        { label: 'Feb', value: 180 },
        { label: 'Mar', value: 250 },
        { label: 'Apr', value: 340 },
        { label: 'May', value: 480 },
        { label: 'Jun', value: 620 },
      ] as AdminReportPoint[],
      helpStatus: [
        { label: 'Active', value: 45 },
        { label: 'Completed', value: 120 },
        { label: 'Disputed', value: 5 },
      ] as AdminReportPoint[],
    };
  },
};
