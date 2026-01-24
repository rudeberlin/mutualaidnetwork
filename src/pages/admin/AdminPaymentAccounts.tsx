import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store';
import { Search, Edit2, Save, X, CreditCard, Phone } from 'lucide-react';

interface PaymentAccountRow {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  receive_account_name?: string;
  receive_account_number?: string;
  receive_bank_name?: string;
  receive_phone_number?: string;
  give_account_name?: string;
  give_account_number?: string;
  give_bank_name?: string;
  give_phone_number?: string;
}

interface AccountFormState {
  userId: string;
  mode: 'give' | 'receive';
  accountName: string;
  accountNumber: string;
  bankName: string;
  phoneNumber: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AdminPaymentAccounts: React.FC = () => {
  const { token } = useAuthStore();
  const [accounts, setAccounts] = useState<PaymentAccountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PaymentAccountRow | null>(null);
  const [form, setForm] = useState<AccountFormState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return accounts;
    const q = search.toLowerCase();
    return accounts.filter(
      (row) =>
        row.full_name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        (row.phone_number ?? '').toLowerCase().includes(q)
    );
  }, [accounts, search]);

  const loadAccounts = async (query?: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/api/admin/payment-accounts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: query ? { search: query } : undefined
      });
      setAccounts(response.data.data || []);
    } catch (err) {
      console.error('Failed to load payment accounts', err);
      setError('Unable to load payment accounts. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [token]);

  const openModal = (row: PaymentAccountRow, mode: 'give' | 'receive') => {
    setSelected(row);
    setForm({
      userId: row.id,
      mode,
      accountName: mode === 'receive' ? row.receive_account_name || '' : row.give_account_name || '',
      accountNumber: mode === 'receive' ? row.receive_account_number || '' : row.give_account_number || '',
      bankName: mode === 'receive' ? row.receive_bank_name || '' : row.give_bank_name || '',
      phoneNumber:
        mode === 'receive'
          ? row.receive_phone_number || row.phone_number || ''
          : row.give_phone_number || row.phone_number || ''
    });
  };

  const handleSave = async () => {
    if (!token || !form) return;
    const { accountName, accountNumber, bankName } = form;
    if (!accountName.trim() || !accountNumber.trim() || !bankName.trim()) {
      setError('Account name, number, and bank are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await axios.post(
        `${API_URL}/api/admin/payment-accounts`,
        {
          userId: form.userId,
          mode: form.mode,
          accountName: form.accountName.trim(),
          accountNumber: form.accountNumber.trim(),
          bankName: form.bankName.trim(),
          phoneNumber: form.phoneNumber.trim() || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await loadAccounts(search);
      setSelected(null);
      setForm(null);
    } catch (err) {
      console.error('Failed to save payment account', err);
      setError('Save failed. Please check the details and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Accounts</h1>
          <p className="text-slate-400 text-sm">Manage bank details for giving and receiving help.</p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                loadAccounts(e.currentTarget.value);
              }
            }}
            placeholder="Search by name, email, or phone"
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <button
          onClick={() => loadAccounts(search)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-900/60">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/60 text-slate-300">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Receive Account</th>
              <th className="text-left px-4 py-3">Give Account</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  Loading accounts...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const receiveLabel = row.receive_account_number
                  ? `${row.receive_account_name || ''} • ${row.receive_account_number}`
                  : 'Not set';
                const giveLabel = row.give_account_number
                  ? `${row.give_account_name || ''} • ${row.give_account_number}`
                  : 'Not set';

                return (
                  <tr key={row.id} className="border-t border-slate-800">
                    <td className="px-4 py-3 text-white">{row.full_name}</td>
                    <td className="px-4 py-3 text-slate-300">{row.email}</td>
                    <td className="px-4 py-3 text-slate-300">{row.phone_number}</td>
                    <td className="px-4 py-3 text-slate-300">{receiveLabel}</td>
                    <td className="px-4 py-3 text-slate-300">{giveLabel}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => openModal(row, 'receive')}
                        className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        <CreditCard size={16} />
                        Receive
                      </button>
                      <button
                        onClick={() => openModal(row, 'give')}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Edit2 size={16} />
                        Give
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {form && selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{form.mode === 'receive' ? 'Receive Help' : 'Give Help'}</p>
                <h3 className="text-xl font-bold text-white">{selected.full_name}</h3>
                <p className="text-slate-400 text-sm">{selected.email}</p>
              </div>
              <button
                onClick={() => {
                  setSelected(null);
                  setForm(null);
                  setError(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-300">Account Name *</label>
                <input
                  value={form.accountName}
                  onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Account Number *</label>
                <input
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. 0123456789"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Bank *</label>
                <input
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. First Bank"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Optional contact number"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : (
                  <>
                    <Save size={18} /> Save Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
