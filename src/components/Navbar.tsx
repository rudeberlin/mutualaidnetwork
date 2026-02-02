import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useUIStore } from '../store';

interface NavbarProps {
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isAdmin = false }) => {
  const { toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isOnDashboard = location.pathname === '/dashboard';

  return (
    <nav className="glass-lg sticky top-0 z-50 px-6 py-4 border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">MAN</span>
          </div>
          <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Mutual Aid Network
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!isAdmin && (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/" className="text-dark-300 hover:text-emerald-400 transition">
                Home
              </Link>
              <Link to="/about" className="text-dark-300 hover:text-emerald-400 transition">
                About
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 relative">
            {isAdmin && (
              <button
                onClick={toggleSidebar}
                className="p-2 glass text-emerald-400 hover:bg-white/20 rounded-lg"
              >
                <Menu size={20} />
              </button>
            )}
            {/* Settings icon removed from Navbar - handled by UserDashboard component directly */}
            {isOnDashboard ? (
              <button 
                onClick={() => navigate('/')}
                className="p-2 glass text-emerald-400 hover:bg-white/20 rounded-lg" 
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <>
                <Link to="/register" className="px-4 py-2 glass bg-emerald-500/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/30 rounded-lg font-semibold hidden sm:block">
                  Sign Up
                </Link>
                <Link to="/login" className="p-2 glass text-emerald-400 hover:bg-white/20 rounded-lg" title="Login">
                  <LogOut size={20} style={{ transform: 'scaleX(-1)' }} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="glass-lg border-t border-emerald-500/20 mt-20 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-emerald-400 font-semibold mb-4">About Us</h3>
            <p className="text-dark-300 text-sm leading-relaxed">
              Mutual Aid Network is a peer-to-peer platform offering
              transparent, secure, and rewarding investment opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-emerald-400 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-dark-300 hover:text-emerald-400">
                  About Platform
                </Link>
              </li>
              <li>
                <a href="#faq" className="text-dark-300 hover:text-emerald-400">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-dark-300 hover:text-emerald-400">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-emerald-400 font-semibold mb-4">Contact</h3>
            <p className="text-dark-300 text-sm">
              Email: support@mutualaidnetworks.org
              <br />
              Phone: +61435649270
              <br />
              International: 17 Philip Street, Melton South, VIC 3338 AU
              <br />
              Local: 12 Stanbic Height, Accra, GH
              <br />
              <span className="status-badge mt-3 inline-block">
                Verified & Secure Platform
              </span>
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-dark-300 text-sm">
          <p>&copy; 2024 Mutual Aid Network. All rights reserved.</p>
          <p className="text-xs mt-2">Empowering communities through mutual support and aid.</p>
        </div>
      </div>
    </footer>
  );
};

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
        <p className="text-emerald-400 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export const SuccessMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed top-4 right-4 glass-lg border-green-400/50 text-green-400 px-6 py-4 rounded-lg animate-fade-in">
      {message}
    </div>
  );
};

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed top-4 right-4 glass-lg border-red-400/50 text-red-400 px-6 py-4 rounded-lg animate-fade-in">
      {message}
    </div>
  );
};
