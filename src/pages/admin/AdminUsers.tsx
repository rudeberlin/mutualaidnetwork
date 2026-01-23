import React from 'react';
import { useAdminStore } from '../../store/adminStore';
import { ShieldCheck, Ban, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export const AdminUsers: React.FC = () => {
  const { users, suspendUser, reactivateUser } = useAdminStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-300 text-sm">Manage members</p>
          <h1 className="text-2xl font-bold text-white">Users</h1>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl backdrop-blur">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-300">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Verification</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 text-slate-200">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.profilePhoto || '/owner-profile-1.svg'}
                      alt={u.fullName}
                      className="w-9 h-9 rounded-full border border-emerald-500/30"
                    />
                    <div>
                      <p className="font-semibold">{u.fullName}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{u.username}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.country}</td>
                <td className="px-4 py-3">
                  {u.isVerified ? (
                    <span className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs">Active</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs">Suspended</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.idDocuments.verified ? (
                    <span className="flex items-center gap-1 text-emerald-300 text-xs"><ShieldCheck size={14} /> Verified</span>
                  ) : (
                    <span className="text-slate-400 text-xs">Pending</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{format(u.createdAt, 'MMM d, yyyy')}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {u.isVerified ? (
                      <button
                        onClick={() => suspendUser(u.id)}
                        className="px-3 py-1 rounded-lg bg-red-500/15 text-red-200 text-xs flex items-center gap-1"
                      >
                        <Ban size={14} /> Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => reactivateUser(u.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-200 text-xs flex items-center gap-1"
                      >
                        <RefreshCw size={14} /> Reactivate
                      </button>
                    )}
                    <button className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs">View</button>
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
