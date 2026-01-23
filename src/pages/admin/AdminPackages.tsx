import React from 'react';
import { useAdminStore } from '../../store/adminStore';

export const AdminPackages: React.FC = () => {
  const { packages, updatePackage, togglePackage } = useAdminStore();

  const handleToggle = (id: string, active: boolean) => togglePackage(id, active);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-300 text-sm">Configure contribution packages</p>
          <h1 className="text-2xl font-bold text-white">Packages</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {packages.map((p) => (
          <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg shadow-emerald-900/20 backdrop-blur">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="text-white font-semibold text-lg">{p.name}</p>
                <p className="text-slate-300 text-sm">${p.amount} • {p.returnPercentage}% • {p.durationDays}d</p>
              </div>
              <div>
                <label className="inline-flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={p.active}
                    onChange={(e) => handleToggle(p.id, e.target.checked)}
                    className="accent-emerald-500"
                  />
                  Active
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Name</span>
                <input
                  defaultValue={p.name}
                  onBlur={(e) => updatePackage({ ...p, name: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right w-32 text-white text-sm"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Amount</span>
                <input
                  type="number"
                  defaultValue={p.amount}
                  onBlur={(e) => updatePackage({ ...p, amount: Number(e.target.value) })}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right w-24 text-white text-sm"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Return %</span>
                <input
                  type="number"
                  defaultValue={p.returnPercentage}
                  onBlur={(e) => updatePackage({ ...p, returnPercentage: Number(e.target.value) })}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right w-20 text-white text-sm"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Duration (d)</span>
                <input
                  type="number"
                  defaultValue={p.durationDays}
                  onBlur={(e) => updatePackage({ ...p, durationDays: Number(e.target.value) })}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right w-20 text-white text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
