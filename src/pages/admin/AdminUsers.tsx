import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { ShieldCheck, Ban, RefreshCw, Eye, X } from 'lucide-react';
import { format } from 'date-fns';

export const AdminUsers: React.FC = () => {
  const { users, suspendUser, reactivateUser } = useAdminStore();
  const [viewingUser, setViewingUser] = useState<typeof users[0] | null>(null);

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
                    <button onClick={() => setViewingUser(u)} className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs flex items-center gap-1">
                      <Eye size={14} /> View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingUser(null)}>
          <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/95 backdrop-blur">
              <div className="flex items-center gap-4">
                <img src={viewingUser.profilePhoto || '/owner-profile-1.svg'} alt={viewingUser.fullName} className="w-16 h-16 rounded-full border-2 border-emerald-500/30" />
                <div>
                  <h3 className="text-white font-bold text-xl">{viewingUser.fullName}</h3>
                  <p className="text-slate-400">@{viewingUser.username}</p>
                </div>
              </div>
              <button onClick={() => setViewingUser(null)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                <X className="text-slate-400 hover:text-white" size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white font-semibold">{viewingUser.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Phone</p>
                  <p className="text-white font-semibold">{viewingUser.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Country</p>
                  <p className="text-white font-semibold">{viewingUser.country}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Earnings</p>
                  <p className="text-emerald-400 font-bold">${viewingUser.totalEarnings.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-slate-300 font-semibold mb-3">ID Documents</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Front Side</p>
                    {viewingUser.idDocuments?.frontImage ? (
                      <img src={viewingUser.idDocuments.frontImage} alt="ID Front" className="w-full rounded-lg border border-white/10" />
                    ) : (
                      <div className="w-full h-40 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">No image</div>
                    )}
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Back Side</p>
                    {viewingUser.idDocuments?.backImage ? (
                      <img src={viewingUser.idDocuments.backImage} alt="ID Back" className="w-full rounded-lg border border-white/10" />
                    ) : (
                      <div className="w-full h-40 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">No image</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
