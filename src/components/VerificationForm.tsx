import React from 'react';
import { Upload, CheckCircle } from 'lucide-react';

interface VerificationFormProps {
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading?: boolean;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({ onSubmit, isLoading = false }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      status: 'verified',
      timestamp: new Date(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-slate-300 text-sm font-semibold mb-3">ID Front Side</label>
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600 rounded-lg hover:border-emerald-500/50 cursor-pointer transition-all">
          <Upload className="text-slate-400 mb-2" size={24} />
          <span className="text-slate-300 text-sm font-semibold">Click to upload</span>
          <span className="text-slate-500 text-xs mt-1">PNG, JPG up to 5MB</span>
          <input type="file" accept="image/*" className="hidden" />
        </label>
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-semibold mb-3">ID Back Side</label>
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600 rounded-lg hover:border-emerald-500/50 cursor-pointer transition-all">
          <Upload className="text-slate-400 mb-2" size={24} />
          <span className="text-slate-300 text-sm font-semibold">Click to upload</span>
          <span className="text-slate-500 text-xs mt-1">PNG, JPG up to 5MB</span>
          <input type="file" accept="image/*" className="hidden" />
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        <CheckCircle size={18} />
        {isLoading ? 'Verifying...' : 'Submit Verification'}
      </button>
    </form>
  );
};
