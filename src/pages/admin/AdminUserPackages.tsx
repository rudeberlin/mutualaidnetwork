import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store';
import { CheckCircle, XCircle, RotateCcw, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface UserPackage {
  id: number;
  user_id: string;
  package_id: string;
  full_name: string;
  email: string;
  package_name: string;
  amount: number;
  return_percentage: number;
  status: string;
  admin_approved: boolean;
  maturity_date: string | null;
  extended_count: number;
  created_at: string;
}

export const AdminUserPackages: React.FC = () => {
  const [packages, setPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<UserPackage | null>(null);
  const [newMaturityDate, setNewMaturityDate] = useState('');
  const { token } = useAuthStore();

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/user-packages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setPackages(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [token]);

  const handleApprove = async (id: number) => {
    const maturity = new Date();
    maturity.setDate(maturity.getDate() + 15); // Default 15 days
    
    try {
      await axios.post(
        `${API_URL}/api/admin/user-packages/${id}/approve`,
        { maturityDate: maturity.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPackages();
    } catch (error) {
      console.error('Failed to approve package:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.post(
        `${API_URL}/api/admin/user-packages/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPackages();
    } catch (error) {
      console.error('Failed to reject package:', error);
    }
  };

  const handleExtend = async () => {
    if (!selectedPackage || !newMaturityDate) return;
    
    try {
      await axios.post(
        `${API_URL}/api/admin/user-packages/${selectedPackage.id}/extend`,
        { newMaturityDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedPackage(null);
      setNewMaturityDate('');
      fetchPackages();
    } catch (error) {
      console.error('Failed to extend package:', error);
    }
  };

  const handleReset = async (id: number) => {
    try {
      await axios.post(
        `${API_URL}/api/admin/user-packages/${id}/reset`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPackages();
    } catch (error) {
      console.error('Failed to reset package:', error);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-12">Loading packages...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-300 text-sm">Package subscriptions</p>
          <h1 className="text-2xl font-bold text-white">User Packages</h1>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl backdrop-blur">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-300">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Package</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">ROI</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Maturity</th>
              <th className="px-4 py-3 text-left">Extended</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-white/5 text-slate-200">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold">{pkg.full_name}</p>
                    <p className="text-xs text-slate-400">{pkg.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold">{pkg.package_name}</td>
                <td className="px-4 py-3">${pkg.amount}</td>
                <td className="px-4 py-3 text-emerald-400">{pkg.return_percentage}%</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      pkg.status === 'pending'
                        ? 'bg-amber-500/15 text-amber-300'
                        : pkg.status === 'active'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-red-500/15 text-red-300'
                    }`}
                  >
                    {pkg.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  {pkg.maturity_date ? format(new Date(pkg.maturity_date), 'MMM d, yyyy') : '-'}
                </td>
                <td className="px-4 py-3 text-center">{pkg.extended_count}x</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {!pkg.admin_approved && pkg.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(pkg.id)}
                          className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-200 text-xs flex items-center gap-1"
                        >
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(pkg.id)}
                          className="px-2 py-1 rounded-lg bg-red-500/15 text-red-200 text-xs flex items-center gap-1"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    )}
                    {pkg.admin_approved && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setNewMaturityDate(pkg.maturity_date || '');
                          }}
                          className="px-2 py-1 rounded-lg bg-blue-500/15 text-blue-200 text-xs flex items-center gap-1"
                        >
                          <Calendar size={12} /> Extend
                        </button>
                        <button
                          onClick={() => handleReset(pkg.id)}
                          className="px-2 py-1 rounded-lg bg-slate-500/15 text-slate-200 text-xs flex items-center gap-1"
                        >
                          <RotateCcw size={12} /> Reset
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Extend Maturity Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-white font-bold text-xl mb-4">Extend Maturity Date</h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm block mb-2">Current Maturity</label>
                <p className="text-white">
                  {selectedPackage.maturity_date
                    ? format(new Date(selectedPackage.maturity_date), 'MMM d, yyyy HH:mm')
                    : 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-slate-300 text-sm block mb-2">New Maturity Date</label>
                <input
                  type="datetime-local"
                  value={newMaturityDate ? new Date(newMaturityDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setNewMaturityDate(new Date(e.target.value).toISOString())}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleExtend}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setSelectedPackage(null);
                    setNewMaturityDate('');
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
