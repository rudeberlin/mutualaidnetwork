import React from 'react';
import { motion } from 'framer-motion';
import { useAdminStore } from '../../store/adminStore';
import { Users, ShieldCheck, HelpingHand, ClipboardList, DollarSign } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, verifications, helpActivities } = useAdminStore();

  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.isVerified).length;
  const activeHelps = helpActivities.filter((h) => h.status === 'Active').length;
  const pendingVerifications = verifications.filter((v) => v.status === 'Pending').length;
  const totalHelpVolume = helpActivities.reduce((sum, h) => sum + h.amount, 0);

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-emerald-300', delta: '+4.2%' },
    { label: 'Verified Users', value: verifiedUsers, icon: ShieldCheck, color: 'text-blue-300', delta: '+2.1%' },
    { label: 'Active Help Cycles', value: activeHelps, icon: HelpingHand, color: 'text-amber-300', delta: '+1.6%' },
    { label: 'Pending Verifications', value: pendingVerifications, icon: ClipboardList, color: 'text-pink-300', delta: '-0.4%' },
    { label: 'Total Help Volume (USD)', value: `$${totalHelpVolume.toLocaleString()}`, icon: DollarSign, color: 'text-purple-300', delta: '+6.3%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-emerald-300 text-sm">Admin Overview</p>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.25 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg shadow-emerald-900/20 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-slate-300 text-sm">{stat.label}</p>
                  <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-emerald-300 text-xs mt-1">{stat.delta} vs last period</p>
                </div>
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
