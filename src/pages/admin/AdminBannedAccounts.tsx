import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store';
import { RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface BannedAccount {
  id: number;
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  reason: string;
  banned_at: string;
  unbanned_at: string | null;
  is_active: boolean;
}

export const AdminBannedAccounts: React.FC = () => {
  const [bannedAccounts, setBannedAccounts] = useState<BannedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchBannedAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/banned-accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setBannedAccounts(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch banned accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannedAccounts();
  }, [token]);

  const handleUnban = async (id: number, userName: string) => {
    if (!confirm(`Unban ${userName} and restore account access?`)) return;

    try {
      await axios.post(
        `${API_URL}/api/admin/unban-user/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBannedAccounts();
    } catch (error) {
      console.error('Failed to unban user:', error);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-12">Loading banned accounts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-300 text-sm">Account suspensions</p>
          <h1 className="text-2xl font-bold text-white">Banned Accounts</h1>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl backdrop-blur">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-300">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-left">Banned At</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bannedAccounts.map((account) => (
              <tr key={account.id} className="hover:bg-white/5 text-slate-200">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold">{account.full_name}</p>
                    <p className="text-xs text-slate-400">{account.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">{account.phone_number}</td>
                <td className="px-4 py-3">
                  <p className="text-slate-300 max-w-xs">{account.reason}</p>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {format(new Date(account.banned_at), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      account.is_active
                        ? 'bg-red-500/15 text-red-300'
                        : 'bg-emerald-500/15 text-emerald-300'
                    }`}
                  >
                    {account.is_active ? 'Banned' : 'Unbanned'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {account.is_active && (
                    <button
                      onClick={() => handleUnban(account.id, account.full_name)}
                      className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-200 text-xs flex items-center gap-1"
                    >
                      <RefreshCw size={12} /> Unban
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {bannedAccounts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                  No banned accounts
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
