import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPageNew } from './pages/RegisterPageNew';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AboutPage } from './pages/AboutPage';
import { UserDashboard } from './pages/UserDashboard';
import { HomePageNew } from './pages/HomePageNew';
import { TransactionTicker } from './components/TransactionTicker';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminVerifications } from './pages/admin/AdminVerifications';
import { AdminHelpActivities } from './pages/admin/AdminHelpActivities';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminTransactions } from './pages/admin/AdminTransactions';
import { AdminPackages } from './pages/admin/AdminPackages';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';
import { useAuthStore } from './store';
import { useAutoLogout } from './hooks/useAutoLogout';
import './App.css';

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // Auto-logout after 10 minutes of inactivity
  useAutoLogout();

  return (
    <>
      <TransactionTicker />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePageNew />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPageNew />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="verifications" element={<AdminVerifications />} />
            <Route path="help-activities" element={<AdminHelpActivities />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
