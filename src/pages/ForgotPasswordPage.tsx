import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { validateEmail } from '../utils/helpers';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
          <div className="w-full max-w-md">
            <div className="card-glass text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-400" />
              </div>

              <h1 className="heading-md mb-4">Check Your Email</h1>
              <p className="text-dark-300 mb-4">
                We've sent password recovery instructions to{' '}
                <span className="text-gold-400 font-semibold">{email}</span>
              </p>
              <p className="text-dark-400 text-sm mb-8">
                Follow the link in the email to reset your password. If you don't see the email,
                check your spam folder.
              </p>

              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full btn-primary text-center"
                >
                  Back to Sign In
                </Link>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="w-full btn-secondary text-center"
                >
                  Try Another Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md">
          <div className="card-glass">
            <Link to="/login" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 mb-6">
              <ArrowLeft size={18} />
              <span>Back to Sign In</span>
            </Link>

            <div className="mb-8">
              <h1 className="heading-md mb-2">Recover Your Password</h1>
              <p className="text-dark-300">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-dark-300 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-400 pointer-events-none" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full glass pl-10 pr-4 py-3 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Recovery Email'}
              </button>
            </form>

            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
              <p className="text-blue-300 text-sm">
                <strong>Demo Note:</strong> Any email works in this demo. Check your browser console for the recovery link.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
