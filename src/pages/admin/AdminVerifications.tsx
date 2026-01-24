import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { ShieldCheck, XCircle, ZoomIn, X } from 'lucide-react';
import { format } from 'date-fns';

export const AdminVerifications: React.FC = () => {
  const { verifications, approveVerification, rejectVerification } = useAdminStore();
  const [rejectReason, setRejectReason] = useState('');
  const [viewingId, setViewingId] = useState<{ front: string; back: string; name: string } | null>(null);

  const handleApprove = (id: string) => approveVerification(id, 'Admin');
  const handleReject = (id: string) => {
    const reason = rejectReason || 'Insufficient clarity on ID';
    rejectVerification(id, reason, 'Admin');
    setRejectReason('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-300 text-sm">KYC queue</p>
          <h1 className="text-2xl font-bold text-white">Verifications</h1>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl backdrop-blur">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-300">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">ID Type</th>
              <th className="px-4 py-3 text-left">Front</th>
              <th className="px-4 py-3 text-left">Back</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Submitted</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {verifications.map((v) => (
              <tr key={v.id} className="hover:bg-white/5 text-slate-200">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={v.profilePhoto || '/owner-profile-1.svg'} alt={v.fullName} className="w-9 h-9 rounded-full" />
                    <div>
                      <p className="font-semibold">{v.fullName}</p>
                      <p className="text-xs text-slate-400">@{v.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{v.idType}</td>
                <td className="px-4 py-3">
                  <div className="relative group cursor-pointer" onClick={() => setViewingId({ front: v.frontImage, back: v.backImage, name: v.fullName })}>
                    <img src={v.frontImage} alt="front" className="w-14 h-10 object-cover rounded border border-white/10" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                      <ZoomIn size={16} className="text-white" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="relative group cursor-pointer" onClick={() => setViewingId({ front: v.frontImage, back: v.backImage, name: v.fullName })}>
                    <img src={v.backImage} alt="back" className="w-14 h-10 object-cover rounded border border-white/10" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                      <ZoomIn size={16} className="text-white" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      v.status === 'Pending'
                        ? 'bg-amber-500/15 text-amber-300'
                        : v.status === 'Approved'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-red-500/15 text-red-200'
                    }`}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{format(v.submittedAt, 'MMM d, yyyy')}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(v.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-200 text-xs flex items-center gap-1"
                    >
                      <ShieldCheck size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(v.id)}
                      className="px-3 py-1 rounded-lg bg-red-500/15 text-red-200 text-xs flex items-center gap-1"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                  <input
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason (optional)"
                    className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ID Viewer Modal */}
      {viewingId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingId(null)}>
          <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/95 backdrop-blur">
              <h3 className="text-white font-bold">ID Documents - {viewingId.name}</h3>
              <button onClick={() => setViewingId(null)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                <X className="text-slate-400 hover:text-white" size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-slate-300 font-semibold mb-2">Front Side</p>
                <img src={viewingId.front} alt="ID Front" className="w-full rounded-lg border border-white/10" />
              </div>
              <div>
                <p className="text-slate-300 font-semibold mb-2">Back Side</p>
                <img src={viewingId.back} alt="ID Back" className="w-full rounded-lg border border-white/10" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
