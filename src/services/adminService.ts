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
    const users = response.data.data || [];
    return users.map((u: any) => ({
      id: u.id,
      fullName: u.full_name,
      username: u.username,
      email: u.email,
      phoneNumber: u.phone_number,
      country: u.country,
      role: u.role,
      isVerified: u.is_verified,
      paymentMethodVerified: u.payment_method_verified,
      totalEarnings: parseFloat(u.total_earnings || 0),
      createdAt: new Date(u.created_at),
      updatedAt: new Date(u.updated_at || u.created_at),
      idDocuments: {
        frontImage: u.id_front_image?.startsWith('/') ? `${API_URL}${u.id_front_image}` : u.id_front_image || '',
        backImage: u.id_back_image?.startsWith('/') ? `${API_URL}${u.id_back_image}` : u.id_back_image || '',
        uploadedAt: u.created_at ? new Date(u.created_at) : new Date(),
        verified: u.id_verified || false,
      },
    }));
  },

  async fetchVerifications(): Promise<AdminVerification[]> {
    const response = await api.get('/api/admin/verifications');
    const verifications = response.data.data || [];
    
    // Transform backend data to match frontend format
    return verifications.map((v: any) => ({
      id: v.id,
      userId: v.id,
      fullName: v.user_name,
      username: v.email.split('@')[0],
      profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${v.user_name}`,
      idType: 'ID Card',
      frontImage: v.id_front_image?.startsWith('/') ? `${API_URL}${v.id_front_image}` : v.id_front_image,
      backImage: v.id_back_image?.startsWith('/') ? `${API_URL}${v.id_back_image}` : v.id_back_image,
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
    const activities = response.data.data || [];
    
    return activities.map((a: any) => ({
      id: a.id,
      giverName: 'User ' + a.giver_id?.substring(0, 8),
      receiverName: a.receiver_id ? 'User ' + a.receiver_id.substring(0, 8) : 'N/A',
      packageName: a.package_id,
      amount: parseFloat(a.amount),
      startDate: new Date(a.created_at),
      dueDate: new Date(a.created_at),
      status: a.status.charAt(0).toUpperCase() + a.status.slice(1),
    }));
  },

  async completeHelpActivity(id: string) {
    // Backend endpoint to be created
    return id;
  },

  async resolveDispute(id: string) {
    // Backend endpoint to be created
    return id;
  },

  async fetchPayments(): Promise<AdminPayment[]> {
    const response = await api.get('/api/admin/payments');
    const payments = response.data.data || [];
    
    return payments.map((p: any) => ({
      id: p.id,
      userName: 'User ' + p.user_id?.substring(0, 8),
      method: p.type || 'Unknown',
      maskedDetails: '****' + p.id.toString().slice(-4),
      amount: 0,
      status: p.verified ? 'Confirmed' : 'Pending',
      submittedAt: new Date(p.added_at),
    }));
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
    const transactions = response.data.data || [];
    
    return transactions.map((t: any) => ({
      id: t.id,
      userName: 'User ' + t.user_id?.substring(0, 8),
      type: t.type,
      amount: parseFloat(t.amount),
      currency: t.currency || 'USD',
      status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
      date: new Date(t.created_at),
    }));
  },

  async fetchPackages(): Promise<AdminPackage[]> {
    const response = await api.get('/api/packages');
    const packages = response.data.data || [];
    
    return packages.map((p: any) => ({
      id: p.id,
      name: p.name,
      amount: parseFloat(p.amount),
      returnPercentage: p.return_percentage,
      durationDays: p.duration_days,
      description: p.description,
      active: p.active,
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
    // Backend endpoint to be created
    return userId;
  },

  async reactivateUser(userId: string) {
    // Backend endpoint to be created
    return userId;
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
