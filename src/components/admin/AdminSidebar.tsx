import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, ShieldCheck, HelpingHand, CreditCard, Receipt, Package, PieChart, Settings, PackageCheck, Link2, Ban } from 'lucide-react';
import { useUIStore } from '../../store';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/verifications', label: 'Verifications', icon: ShieldCheck },
  { to: '/admin/user-packages', label: 'User Packages', icon: PackageCheck },
  { to: '/admin/payment-matching', label: 'Payment Matching', icon: Link2 },
  { to: '/admin/help-activities', label: 'Help Activities', icon: HelpingHand },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/transactions', label: 'Transactions', icon: Receipt },
  { to: '/admin/packages', label: 'Packages', icon: Package },
  { to: '/admin/banned-accounts', label: 'Banned Accounts', icon: Ban },
  { to: '/admin/reports', label: 'Reports', icon: PieChart },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const { isSidebarOpen, closeSidebar } = useUIStore();

  return (
    <aside
      className={`fixed md:relative left-0 top-0 w-64 h-full glass-lg border-r border-emerald-500/20 p-6 transform transition-transform duration-300 z-40 bg-slate-900/70 backdrop-blur-xl ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg" />
          <div>
            <p className="text-white font-bold text-lg">Admin Panel</p>
            <p className="text-emerald-300 text-xs">Control Center</p>
          </div>
        </div>
        <button onClick={closeSidebar} className="md:hidden text-emerald-300">✕</button>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border border-transparent hover:border-emerald-500/30 hover:bg-emerald-500/10 ${
                  isActive ? 'bg-emerald-500/15 border-emerald-500/40 text-white shadow-lg shadow-emerald-900/30' : 'text-slate-200'
                }`
              }
            >
              <Icon size={18} />
              <span className="font-semibold text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
