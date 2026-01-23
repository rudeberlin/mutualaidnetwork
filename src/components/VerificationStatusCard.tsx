import React from 'react';
import { CheckCircle } from 'lucide-react';

interface VerificationStatusCardProps {
  onStartVerification?: () => void;
}

export const VerificationStatusCard: React.FC<VerificationStatusCardProps> = ({ onStartVerification }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-emerald-500/30 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="text-emerald-500" size={20} />
            Verification Status
          </h3>
          <p className="text-slate-400 text-sm mt-1">Your account is verified and active</p>
        </div>
        <button
          onClick={onStartVerification}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
