import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useUIStore, useAuthStore } from '../../store';
import { useNavigate } from 'react-router-dom';

export const AdminTopbar: React.FC = () => {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-emerald-500/20 px-4 md:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden p-2 rounded-lg hover:bg-white/10 text-emerald-300">
          <Menu size={20} />
        </button>
        <div>
          <p className="text-sm text-slate-300">Welcome back</p>
          <p className="text-white font-semibold text-lg">{user?.fullName || 'Admin'}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 overflow-hidden">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-emerald-300 text-sm">AD</div>
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-sm font-semibold">{user?.fullName || 'Admin User'}</p>
            <p className="text-emerald-300 text-xs">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-500/10 text-red-300 border border-red-500/30">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
