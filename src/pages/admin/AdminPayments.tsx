import React from 'react';
import { useAdminStore } from '../../store/adminStore';
import { format } from 'date-fns';

export const AdminPayments: React.FC = () => {
  const { payments, verifyPayment, flagPayment } = useAdminStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-300 text-sm">Incoming proofs & payout methods</p>
          <h1 className="text-2xl font-bold text-white">Payments</h1>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl backdrop-blur">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-300">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Method</th>
              <th className="px-4 py-3 text-left">Details</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Submitted</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 text-slate-200">
                <td className="px-4 py-3">{p.userName}</td>
                <td className="px-4 py-3">{p.method}</td>
                <td className="px-4 py-3 text-slate-300">{p.maskedDetails}</td>
                <td className="px-4 py-3">${p.amount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      p.status === 'Confirmed'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : p.status === 'Flagged'
                        ? 'bg-red-500/15 text-red-200'
                        : 'bg-amber-500/15 text-amber-300'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{format(p.submittedAt, 'MMM d, yyyy')}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {p.status !== 'Confirmed' && (
                      <button
                        onClick={() => verifyPayment(p.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-200 text-xs"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => flagPayment(p.id)}
                      className="px-3 py-1 rounded-lg bg-red-500/15 text-red-200 text-xs"
                    >
                      Flag
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
