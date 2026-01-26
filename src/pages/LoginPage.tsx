import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Testimonials } from '../components/Testimonials';
import { useAuthStore } from '../store';
import axios from 'axios';
import { API_URL } from '../utils/apiUrl';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setUser, setToken } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const user = response.data.data.user;
        setUser(user);
        setToken(response.data.data.token);
        
        // Redirect admin users to admin panel
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message || 'Login failed. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Form */}
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>
              <p className="text-slate-400 text-lg">Join thousands helping each other build wealth</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-8 backdrop-blur-sm">
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                  <CheckCircle size={18} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 pointer-events-none" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-slate-700/20 border border-slate-600/30 pl-10 pr-4 py-3 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 pointer-events-none" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-700/20 border border-slate-600/30 pl-10 pr-10 py-3 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded bg-slate-700 border border-slate-600" />
                    <span className="text-slate-300">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-emerald-400 hover:text-emerald-300">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="border-t border-slate-700/50 mt-6 pt-6">
                <p className="text-center text-slate-300 text-sm">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                    Create one
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center text-slate-500 text-xs mt-4">
              Demo: Use any email and password (min 6 chars)
            </p>
          </div>

          {/* Right side - Features & Testimonials */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Why Join Us?</h3>
              {[
                { icon: '🔒', title: 'Secure & Verified', desc: 'All members verified for trust' },
                { icon: '🤝', title: 'Community Driven', desc: 'Help each other, grow together' },
                { icon: '💰', title: 'Real Returns', desc: 'Transparent earnings & payouts' },
                { icon: '📱', title: 'Easy to Use', desc: 'Simple interface for everyone' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700/30 hover:border-emerald-500/30 transition-all">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-slate-400 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Member Testimonials</h3>
              <Testimonials />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
