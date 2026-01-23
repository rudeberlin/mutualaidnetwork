import React from 'react';
import { useAdminStore } from '../../store/adminStore';

const BarRow: React.FC<{ label: string; value: number; max?: number; color?: string }> = ({ label, value, max = 8000, color = 'from-emerald-400 to-teal-400' }) => {
  const width = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-300">
        <span>{label}</span>
        <span className="text-white font-semibold">{value}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-1">
        <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
};

export const AdminReports: React.FC = () => {
  const { reports } = useAdminStore();

  if (!reports) return null;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-emerald-300 text-sm">Performance snapshots</p>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <h3 className="text-white font-semibold mb-3">Monthly Help Volume</h3>
          <div className="space-y-3">
            {reports.monthlyHelpVolume.map((p) => (
              <BarRow key={p.label} label={p.label} value={p.value} max={8000} />
            ))}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <h3 className="text-white font-semibold mb-3">User Growth</h3>
          <div className="space-y-3">
            {reports.userGrowth.map((p) => (
              <BarRow key={p.label} label={p.label} value={p.value} max={500} color="from-blue-400 to-indigo-400" />
            ))}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <h3 className="text-white font-semibold mb-3">Help Status Distribution</h3>
          <div className="space-y-3">
            {reports.helpStatus.map((p) => (
              <BarRow key={p.label} label={p.label} value={p.value} max={100} color="from-amber-400 to-orange-400" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
