import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BarChart3, Users, DollarSign, TrendingUp, LogOut, Menu, X, AlertCircle } from 'lucide-react';
import { useUIStore, useAuthStore } from '../store';
import { useAdminStore } from '../store/adminStore';
import { MOCK_TRANSACTIONS } from '../utils/mockData';
import { formatCurrency, formatDate } from '../utils/helpers';

 type AdminView = 'dashboard' | 'users' | 'investments' | 'funds' | 'transactions';

export const AdminPanel: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const { loading, error, users, initData } = useAdminStore();
  const { token, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (!user?.id || user?.role !== 'admin') {
      console.warn('Not authenticated as admin, redirecting...');
      // Optionally redirect to login
      // navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch data immediately when token is available
    if (token && user?.role === 'admin') {
      console.log('Admin token available, fetching data...');
      initData();
      
      // Refresh data every 5 seconds to show new registrations
      const interval = setInterval(() => {
        console.log('Refreshing admin data...');
        initData();
      }, 5000);
      
      return () => clearInterval(interval);
    } else {
      console.warn('No admin token or not admin role', { token: !!token, role: user?.role });
    }
  }, [token, user?.role, initData]);

  const handleLogout = () => {
    navigate('/');
  };

  // Calculate Admin Stats
  const totalUsers = users.length;
  const activeInvestments = 28;
  const totalFundsManaged = 125000;
  const pendingPayments = 3;

  const AdminStats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-400' },
    { label: 'Active Investments', value: activeInvestments, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Funds Managed', value: formatCurrency(totalFundsManaged), icon: DollarSign, color: 'text-gold-400' },
    { label: 'Pending Payments', value: pendingPayments, icon: BarChart3, color: 'text-orange-400' },
  ];

  const SidebarMenu = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'investments' as const, label: 'Investments', icon: TrendingUp },
    { id: 'funds' as const, label: 'Fund Management', icon: DollarSign },
    { id: 'transactions' as const, label: 'Transactions', icon: Menu },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar isAdmin />

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed md:relative left-0 top-0 w-64 h-screen glass-lg border-r border-gold-500/20 p-6 transform transition-transform duration-300 z-40 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <button
            onClick={closeSidebar}
            className="md:hidden absolute right-4 top-4 p-2 text-gold-400"
          >
            <X size={20} />
          </button>

          <nav className="space-y-2 mt-8">
            {SidebarMenu.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    closeSidebar();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeView === item.id
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-400/30'
                      : 'text-dark-300 hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-semibold">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-all duration-300"
            >
              <LogOut size={18} />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeView === 'dashboard' && (
            <div>
              <h1 className="heading-lg mb-8">Admin Dashboard</h1>

              {error && (
                <div className="glass p-4 mb-6 rounded-lg flex items-center gap-3 text-red-300 border border-red-500/30">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {AdminStats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="card-glass">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-dark-300 text-sm mb-2">{stat.label}</p>
                          <p className="heading-md text-2xl">{stat.value}</p>
                        </div>
                        <Icon className={`${stat.color}`} size={28} />
                      </div>
                      <div className="h-1 glass rounded-full">
                        <div className="h-full w-3/4 bg-gold-500 rounded-full"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {/* Recent Users */}
                <div className="card-glass">
                  <h3 className="heading-md text-lg mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {(loading ? Array(3).fill(null) : users.slice(0, 5)).map((user, idx) => (
                      <div
                        key={user?.id ?? idx}
                        className="glass p-3 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {loading ? (
                            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                          ) : (
                            <img
                              src={user?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'User'}`}
                              alt={user?.fullName || 'User'}
                              className="w-8 h-8 rounded-full border border-gold-400/30"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-white text-sm">
                              {loading ? 'Loading…' : user?.fullName}
                            </p>
                            <p className="text-dark-300 text-xs">
                              {loading ? 'Please wait' : user?.email}
                            </p>
                          </div>
                        </div>
                        {!loading && user?.isVerified && (
                          <span className="status-badge-success text-xs">Active</span>
                        )}
                      </div>
                    ))}
                    {!loading && users.length === 0 && (
                      <p className="text-dark-300 text-sm">No registrations found yet.</p>
                    )}
                  </div>
                </div>

                {/* Investment Overview */}
                <div className="card-glass">
                  <h3 className="heading-md text-lg mb-4">Package Overview</h3>
                  <div className="space-y-3">
                    {[
                      { id: '1', name: 'Basic Help', amount: 250, returnPercentage: 30, duration: 5 },
                      { id: '2', name: 'Standard Help', amount: 500, returnPercentage: 30, duration: 5 },
                      { id: '3', name: 'Premium Help', amount: 1500, returnPercentage: 50, duration: 15 },
                      { id: '4', name: 'Elite Help', amount: 2500, returnPercentage: 50, duration: 15 },
                    ].map((plan) => (
                      <div key={plan.id} className="glass p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-white text-sm">{plan.name}</p>
                            <p className="text-dark-300 text-xs">
                              ₵{plan.amount.toLocaleString()} • {plan.returnPercentage}% Return
                            </p>
                          </div>
                          <p className="text-gold-400 font-semibold text-sm">{plan.duration}d</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'users' && (
            <div>
              <h1 className="heading-lg mb-8">User Management</h1>
              <div className="card-glass overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 font-semibold text-dark-300">User</th>
                      <th className="text-left px-4 py-3 font-semibold text-dark-300">Email</th>
                      <th className="text-left px-4 py-3 font-semibold text-dark-300">Phone</th>
                      <th className="text-left px-4 py-3 font-semibold text-dark-300">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-dark-300">Joined</th>
                      <th className="text-left px-4 py-3 font-semibold text-dark-300">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(loading ? Array(5).fill(null) : users).map((user, idx) => (
                      <tr key={user?.id ?? idx} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {loading ? (
                              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                            ) : (
                              <img
                                src={user?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'User'}`}
                                alt={user?.fullName || 'User'}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <p className="font-semibold text-white">
                              {loading ? 'Loading…' : user?.fullName}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-dark-300">{loading ? '—' : user?.email}</td>
                        <td className="px-4 py-4 text-dark-300">{loading ? '—' : user?.phoneNumber}</td>
                        <td className="px-4 py-4">
                          {loading ? (
                            <span className="status-badge">Loading</span>
                          ) : user?.isVerified ? (
                            <span className="status-badge-success">Verified</span>
                          ) : (
                            <span className="status-badge">Pending</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-dark-300 text-sm">
                          {loading || !user?.createdAt ? '—' : formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 py-4">
                          <button className="text-gold-400 hover:text-gold-300 font-semibold text-sm" disabled={loading}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!loading && users.length === 0 && (
                      <tr>
                        <td className="px-4 py-4 text-dark-300" colSpan={6}>
                          No registrations found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'investments' && (
            <div>
              <h1 className="heading-lg mb-8">Active Investments</h1>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: '1', fullName: 'John Doe', profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', plan: 'Gold' },
                  { id: '2', fullName: 'Jane Smith', profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', plan: 'Silver' },
                  { id: '3', fullName: 'Sarah Williams', profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', plan: 'Gold' },
                  { id: '4', fullName: 'Tom Brown', profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom', plan: 'Bronze' },
                ].map((user, idx) => (
                  <div key={idx} className="card-glass">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={user.profilePhoto}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full border border-gold-400/30"
                      />
                      <div>
                        <p className="font-semibold text-white">{user.fullName}</p>
                        <p className="text-dark-300 text-xs">{user.plan} Plan</p>
                      </div>
                    </div>
                    <div className="space-y-3 pb-4 border-b border-white/10">
                      <div className="flex justify-between">
                        <span className="text-dark-300 text-sm">Amount</span>
                        <span className="text-gold-400 font-semibold">GHS 2,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-300 text-sm">ROI</span>
                        <span className="text-gold-400 font-semibold">GHS 1,250</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="w-full btn-outline text-sm">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'funds' && (
            <div>
              <h1 className="heading-lg mb-8">Fund Management</h1>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="card-glass">
                  <h3 className="heading-md text-lg mb-4">Fund Distribution</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-dark-300">Available Funds</span>
                        <span className="text-gold-400 font-semibold">GHS 50,000</span>
                      </div>
                      <div className="h-2 glass-lg rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gold-500"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-dark-300">Allocated to Investments</span>
                        <span className="text-gold-400 font-semibold">GHS 37,500</span>
                      </div>
                      <div className="h-2 glass-lg rounded-full overflow-hidden">
                        <div className="h-full w-full bg-green-500"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-glass">
                  <h3 className="heading-md text-lg mb-4">Fund Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full btn-primary">Deposit Funds</button>
                    <button className="w-full btn-outline">Generate Report</button>
                    <button className="w-full btn-secondary">Fund Settings</button>
                  </div>
                </div>
              </div>

              <div className="card-glass">
                <h3 className="heading-md text-lg mb-4">Fund History</h3>
                <div className="space-y-3">
                  {Array(5)
                    .fill(0)
                    .map((_, idx) => (
                      <div key={idx} className="glass p-4 rounded-lg flex justify-between">
                        <div>
                          <p className="font-semibold text-white">Fund Allocation</p>
                          <p className="text-dark-300 text-sm">To investment pool</p>
                        </div>
                        <p className="text-gold-400 font-semibold">+GHS 5,000</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'transactions' && (
            <div>
              <h1 className="heading-lg mb-8">Transaction Records</h1>
              <div className="card-glass overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 font-semibold text-dark-300">ID</th>
                      <th className="text-left px-4 py-3 font-semibold text-dark-300">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-dark-300">Amount</th>
                      <th className="text-left px-4 py-3 font-semibold text-dark-300">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-dark-300">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_TRANSACTIONS.map((txn) => (
                      <tr key={txn.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-4 font-mono text-dark-300 text-sm">{txn.id}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`font-semibold capitalize ${
                              txn.type === 'DEPOSIT'
                                ? 'text-green-400'
                                : 'text-red-400'
                            }`}
                          >
                            {txn.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-white">
                          {formatCurrency(txn.amount)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              txn.status === 'COMPLETED'
                                ? 'status-badge-success'
                                : 'status-badge-pending'
                            }`}
                          >
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-dark-300 text-sm">
                          {formatDate(txn.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
