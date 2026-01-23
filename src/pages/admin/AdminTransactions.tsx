import React, { useMemo, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { format } from 'date-fns';

export const AdminTransactions: React.FC = () => {
  const { transactions } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const statusOk = statusFilter === 'all' || t.status === statusFilter;
      const typeOk = typeFilter === 'all' || t.type === typeFilter;
      return statusOk && typeOk;
    });
  }, [transactions, statusFilter, typeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-emerald-300 text-sm">Track all movements</p>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Types</option>
            <option value="Help Given">Help Given</option>
            <option value="Help Received">Help Received</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl backdrop-blur">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-300">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-white/5 text-slate-200">
                <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                <td className="px-4 py-3">{t.userName}</td>
                <td className="px-4 py-3">{t.type}</td>
                <td className="px-4 py-3">${t.amount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      t.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : t.status === 'Pending'
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-red-500/15 text-red-200'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{format(t.date, 'MMM d, yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
