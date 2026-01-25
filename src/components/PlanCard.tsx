import React from 'react';
import type { Package } from '../types';
import { Check } from 'lucide-react';

interface PlanCardProps {
  plan: Package;
  onRequestHelp: (planId: string) => void;
  isHighlighted?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onRequestHelp,
  isHighlighted = false,
}) => {
  const isElitePlan = plan.id === 'pkg-4';

  return (
    <div
      className={`relative card-glass overflow-hidden group ${
        isHighlighted ? 'ring-2 ring-emerald-400 scale-105' : ''
      }`}
    >
      {isElitePlan && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 border border-emerald-500 rounded-full text-xs font-semibold text-emerald-400">
          Most Popular
        </div>
      )}

      <div className="mb-4">
        <div className="text-3xl mb-2">{plan.icon}</div>
        <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
        <p className="text-slate-400 text-sm">{plan.description}</p>
      </div>

      <div className="space-y-4 mb-6 py-4 border-y border-white/10">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Amount</span>
          <span className="text-emerald-400 font-semibold">₵{plan.amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Return</span>
          <span className="text-emerald-400 font-semibold">{plan.returnPercentage}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Duration</span>
          <span className="text-emerald-400 font-semibold">{plan.durationDays} Days</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-slate-400 text-xs font-semibold mb-3">KEY FEATURES</p>
        <ul className="space-y-2">
          <li key="1" className="flex items-center gap-2 text-slate-300 text-sm">
            <Check size={16} className="text-emerald-400" />
            Secure participation
          </li>
          <li key="2" className="flex items-center gap-2 text-slate-300 text-sm">
            <Check size={16} className="text-emerald-400" />
            Community support
          </li>
          <li key="3" className="flex items-center gap-2 text-slate-300 text-sm">
            <Check size={16} className="text-emerald-400" />
            Transparent process
          </li>
          <li key="4" className="flex items-center gap-2 text-slate-300 text-sm">
            <Check size={16} className="text-emerald-400" />
            Verified members
          </li>
        </ul>
      </div>

      <button
        onClick={() => onRequestHelp(plan.id)}
        className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
          isElitePlan
            ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/50'
            : 'border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10'
        }`}
      >
        Select Plan
      </button>

      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
    </div>
  );
};
