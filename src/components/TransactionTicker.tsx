import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useTransactionStore } from '../store';

export const TransactionTicker: React.FC = () => {
  const { transactions } = useTransactionStore();
  const recentTx = transactions.slice(0, 5);

  if (recentTx.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-emerald-900/95 via-emerald-800/95 to-teal-900/95 backdrop-blur-sm z-40 border-b border-emerald-500/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <span className="text-emerald-300 text-xs font-semibold whitespace-nowrap">Live Activity:</span>
          {recentTx.map((tx, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full whitespace-nowrap text-xs">
              {tx.type === 'DEPOSIT' || tx.type === 'HELP_RECEIVED' ? (
                <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
              ) : (
                <ArrowUpRight className="w-3 h-3 text-red-400" />
              )}
              <span className="text-emerald-100">{tx.description}</span>
              <span className={`font-bold ${tx.type === 'DEPOSIT' || tx.type === 'HELP_RECEIVED' ? 'text-emerald-400' : 'text-red-400'}`}>
                {tx.type === 'DEPOSIT' || tx.type === 'HELP_RECEIVED' ? '+' : '-'}${tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
