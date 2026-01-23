import React from 'react';
import { useAdminStore } from '../../store/adminStore';
import { format } from 'date-fns';

export const AdminHelpActivities: React.FC = () => {
  const { helpActivities, completeHelp, resolveDispute } = useAdminStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-300 text-sm">Oversee peer help cycles</p>
          <h1 className="text-2xl font-bold text-white">Help Activities</h1>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl backdrop-blur">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-300">
              <th className="px-4 py-3 text-left">Giver</th>
              <th className="px-4 py-3 text-left">Receiver</th>
              <th className="px-4 py-3 text-left">Package</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Start</th>
              <th className="px-4 py-3 text-left">Due</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {helpActivities.map((h) => (
              <tr key={h.id} className="hover:bg-white/5 text-slate-200">
                <td className="px-4 py-3">{h.giverName}</td>
                <td className="px-4 py-3">{h.receiverName}</td>
                <td className="px-4 py-3">{h.packageName}</td>
                <td className="px-4 py-3">${h.amount}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{format(h.startDate, 'MMM d')}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{format(h.dueDate, 'MMM d')}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      h.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : h.status === 'Active'
                        ? 'bg-blue-500/15 text-blue-300'
                        : h.status === 'Pending'
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-red-500/15 text-red-200'
                    }`}
                  >
                    {h.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {h.status !== 'Completed' && (
                      <button
                        onClick={() => completeHelp(h.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-200 text-xs"
                      >
                        Mark Complete
                      </button>
                    )}
                    {h.status === 'Disputed' && (
                      <button
                        onClick={() => resolveDispute(h.id)}
                        className="px-3 py-1 rounded-lg bg-blue-500/15 text-blue-200 text-xs"
                      >
                        Resolve
                      </button>
                    )}
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
