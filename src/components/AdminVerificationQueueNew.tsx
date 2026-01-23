import React from 'react';
import { CheckCircle } from 'lucide-react';

interface AdminVerificationQueueProps {
  onVerify?: (id: string) => void;
}

export const AdminVerificationQueueNew: React.FC<AdminVerificationQueueProps> = ({ onVerify }) => {
  const mockQueue = [
    { id: '1', name: 'John Doe', status: 'pending' },
    { id: '2', name: 'Jane Smith', status: 'pending' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <CheckCircle className="text-emerald-500" size={20} />
        Verification Queue
      </h3>
      <div className="space-y-3">
        {mockQueue.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
            <div>
              <p className="text-white font-semibold">{item.name}</p>
              <p className="text-slate-400 text-xs">Status: {item.status}</p>
            </div>
            <button
              onClick={() => onVerify?.(item.id)}
              className="px-3 py-1 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600 transition-all"
            >
              Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
