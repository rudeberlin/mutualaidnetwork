import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { SettingsModal } from '../components/SettingsModal';
import { PaymentMethodModal } from '../components/PaymentMethodModal';
import { Testimonials } from '../components/Testimonials';
import { PACKAGES, MOCK_CURRENT_USER, MOCK_TRANSACTIONS } from '../utils/mockData';
import { useAuthStore } from '../store';
import type { Package } from '../types';
import { Settings, CreditCard, ArrowUpRight, ArrowDownLeft, TrendingUp, Plus, Hand, X, Check, Clock, Copy, Share2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const UserDashboard: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPackageSelection, setShowPackageSelection] = useState(false);
  const [showCurrentPackageModal, setShowCurrentPackageModal] = useState(false);
  const [selectedOfferPackage, setSelectedOfferPackage] = useState<Package | null>(null);
  const [selectedReceivePackage, setSelectedReceivePackage] = useState<Package | null>(null);
  const [offerHelpStatus, setOfferHelpStatus] = useState<'processing' | 'pending' | 'matched' | null>(null);
  const [receiveHelpStatus, setReceiveHelpStatus] = useState<'processing' | 'pending' | 'matched' | null>(null);
  const [transactionIndex, setTransactionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [referralCodes, setReferralCodes] = useState<{ code: string; createdAt: string; uses: number }[]>(
    JSON.parse(localStorage.getItem('referralCodes') || '[]')
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const transactionContainerRef = useRef<HTMLDivElement>(null);
  const { user, token } = useAuthStore();
  const currentUser = user || MOCK_CURRENT_USER;
  
  // Dashboard stats from API
  const [dashboardStats, setDashboardStats] = useState({
    totalEarnings: 0,
    activePackagesCount: 0,
    helpProvidedCount: 0,
    daysSinceRegistration: 0,
    registrationDate: null as Date | null,
    activePackages: [] as any[]
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user?.id || !token) return;
      
      try {
        const response = await axios.get(`${API_URL}/api/user/${user.id}/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setDashboardStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, [user?.id, token]);

  // Auto-scroll transactions - vertical sliding
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactionIndex(prev => (prev + 1) % MOCK_TRANSACTIONS.length);
    }, 2000); // Slide every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Maturity timer countdown
  useEffect(() => {
    if (offerHelpStatus === 'processing' || offerHelpStatus === 'pending') {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [offerHelpStatus]);

  // Generate referral code
  const generateReferralCode = () => {
    const code = `MAN${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newCode = { code, createdAt: new Date().toLocaleDateString(), uses: 0 };
    const updatedCodes = [...referralCodes, newCode];
    setReferralCodes(updatedCodes);
    localStorage.setItem('referralCodes', JSON.stringify(updatedCodes));
  };

  // Copy referral code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOfferHelp = () => {
    setShowPackageSelection(true);
  };

  const handlePackageSelect = (pkg: Package, type: 'offer' | 'receive') => {
    if (type === 'offer') {
      setSelectedOfferPackage(pkg);
      setOfferHelpStatus('processing');
      setTimeRemaining(pkg.durationDays * 86400); // Convert days to seconds
    } else {
      setSelectedReceivePackage(pkg);
      setReceiveHelpStatus('processing');
    }
    setShowPackageSelection(false);
  };

  const handleReceiveHelp = () => {
    setShowPackageSelection(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950">
      <Navbar />

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
          user={currentUser} 
          onClose={() => setShowSettings(false)}
          onSave={(updates) => {
            console.log('Settings saved:', updates);
            setShowSettings(false);
          }}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentMethodModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSave={(method) => {
            console.log('Payment method saved:', method);
            setShowPaymentModal(false);
          }}
        />
      )}

      {/* Package Selection Modal */}
      {showPackageSelection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-slate-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700/30 bg-slate-900/80 backdrop-blur">
              <h2 className="text-2xl font-bold text-white">Select a Package</h2>
              <button
                onClick={() => setShowPackageSelection(false)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
              >
                <X className="text-slate-400 hover:text-white" size={24} />
              </button>
            </div>

            {/* Packages Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer"
                >
                  {/* Package Image */}
                  {pkg.image && (
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}

                  {/* Icon */}
                  {!pkg.image && <div className="text-4xl mb-4">{pkg.icon}</div>}

                  {/* Title & Amount */}
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-emerald-500 mb-3">
                    ${pkg.amount.toLocaleString()}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-6 text-slate-300 text-sm">
                    <p>📈 ROI: {pkg.returnPercentage}%</p>
                    <p>⏱️ Duration: {pkg.durationDays} days</p>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-sm mb-4">{pkg.description}</p>

                  {/* Select Button */}
                  <button
                    onClick={() => handlePackageSelect(pkg, 'offer')}
                    className="w-full px-4 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Select Package
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Profile and Quick Actions */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-6">
            <img 
              src={currentUser.profilePhoto} 
              alt={currentUser.fullName}
              className="w-20 h-20 rounded-full border-4 border-emerald-500/30 shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{currentUser.fullName}</h1>
              <p className="text-slate-400">
                {currentUser.isVerified ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Verified Member
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Pending Verification
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleOfferHelp}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all shadow-lg"
            >
              <Hand size={20} />
              Offer Help
            </button>
            <button
              onClick={handleReceiveHelp}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all"
            >
              <Hand size={20} />
              Receive Help
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-slate-800 hover:border-emerald-400 transition-all"
            >
              <Settings size={20} />
              Settings
            </button>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all"
            >
              <CreditCard size={20} />
              Payment Method
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-semibold">Total Earnings</p>
              <TrendingUp className="text-emerald-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">
              ${loadingStats ? '...' : dashboardStats.totalEarnings.toFixed(2)}
            </p>
            <p className="text-emerald-400 text-sm mt-2">+12% this month</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-semibold">Active Packages</p>
              <TrendingUp className="text-teal-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">
              {loadingStats ? '...' : dashboardStats.activePackagesCount}
            </p>
            <p className="text-slate-400 text-xs mt-3">
              {dashboardStats.activePackagesCount > 0 ? `${dashboardStats.activePackagesCount} active ${dashboardStats.activePackagesCount === 1 ? 'package' : 'packages'}` : 'No active packages'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-semibold">Help Provided</p>
              <ArrowUpRight className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">
              {loadingStats ? '...' : dashboardStats.helpProvidedCount}
            </p>
            <p className="text-blue-400 text-sm mt-2">Community impact</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-semibold">Member Since</p>
              <Plus className="text-purple-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">
              {loadingStats ? '...' : dashboardStats.daysSinceRegistration}
            </p>
            <p className="text-purple-400 text-sm mt-2">
              {dashboardStats.registrationDate 
                ? new Date(dashboardStats.registrationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'days active'}
            </p>
          </div>
        </div>

        {/* Active Help Requests - Persistent Status Display */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Offer Help Status */}
          {offerHelpStatus && selectedOfferPackage && (
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Offering Help</h3>
                <button
                  onClick={() => {
                    setOfferHelpStatus(null);
                    setSelectedOfferPackage(null);
                  }}
                  className="text-slate-400 hover:text-white text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Package Info */}
              <div className="bg-slate-700/30 rounded p-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{selectedOfferPackage.icon}</span>
                  <div>
                    <p className="text-white font-semibold">{selectedOfferPackage.name}</p>
                    <p className="text-emerald-400 font-bold text-lg">${selectedOfferPackage.amount}</p>
                    <p className="text-slate-400 text-xs">ROI: {selectedOfferPackage.returnPercentage}% • {selectedOfferPackage.durationDays} days</p>
                  </div>
                </div>
              </div>

              {offerHelpStatus === 'processing' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-white font-semibold">Processing</p>
                  </div>
                  <p className="text-slate-400 text-sm">Your help request is being processed...</p>
                </div>
              )}
              {offerHelpStatus === 'pending' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <p className="text-white font-semibold">Pending Admin Review</p>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">Waiting for admin approval. This typically takes 1-2 hours.</p>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                    <p className="text-yellow-300 text-xs">⏱️ Your request is in queue. Check back soon for updates.</p>
                  </div>
                </div>
              )}
              {offerHelpStatus === 'matched' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <p className="text-white font-semibold">Matched!</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-4">
                    <p className="text-emerald-300 font-semibold mb-2">John Aidoo - Verified Helper</p>
                    <p className="text-slate-400 text-sm">Check your messages to connect and arrange the help.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Receive Help Status */}
          {receiveHelpStatus && selectedReceivePackage && (
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Requesting Help</h3>
                <button
                  onClick={() => {
                    setReceiveHelpStatus(null);
                    setSelectedReceivePackage(null);
                  }}
                  className="text-slate-400 hover:text-white text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Package Info */}
              <div className="bg-slate-700/30 rounded p-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{selectedReceivePackage.icon}</span>
                  <div>
                    <p className="text-white font-semibold">{selectedReceivePackage.name}</p>
                    <p className="text-emerald-400 font-bold text-lg">${selectedReceivePackage.amount}</p>
                    <p className="text-slate-400 text-xs">ROI: {selectedReceivePackage.returnPercentage}% • {selectedReceivePackage.durationDays} days</p>
                  </div>
                </div>
              </div>

              {receiveHelpStatus === 'processing' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-white font-semibold">Processing</p>
                  </div>
                  <p className="text-slate-400 text-sm">Your help request is being processed...</p>
                </div>
              )}
              {receiveHelpStatus === 'pending' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <p className="text-white font-semibold">Pending Admin Review</p>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">Waiting for admin approval. This typically takes 1-2 hours.</p>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                    <p className="text-yellow-300 text-xs">⏱️ Your request is in queue. Check back soon for updates.</p>
                  </div>
                </div>
              )}
              {receiveHelpStatus === 'matched' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <p className="text-white font-semibold">Matched!</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-4">
                    <p className="text-emerald-300 font-semibold mb-2">Sarah Mensah - Verified Helper</p>
                    <p className="text-slate-400 text-sm">Check your messages to connect and arrange the help.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transactions */}
          <div className="lg:col-span-2">
            {/* Maturity Timer - Display when offer help is active */}
            {(offerHelpStatus === 'processing' || offerHelpStatus === 'pending') && (
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="text-emerald-400 animate-pulse" size={28} />
                    <div>
                      <p className="text-slate-300 text-sm">Maturity Timer</p>
                      <p className="text-white font-bold text-2xl">
                        {Math.floor(timeRemaining / 86400)}d {Math.floor((timeRemaining % 86400) / 3600)}h {Math.floor((timeRemaining % 3600) / 60)}m
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Expected Return</p>
                    <p className="text-emerald-400 font-bold text-xl">
                      ${selectedOfferPackage ? Math.round(selectedOfferPackage.amount * selectedOfferPackage.returnPercentage / 100) : 0}
                    </p>
                  </div>
                </div>
                <div className="mt-4 w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-1000"
                    style={{
                      width: `${(timeRemaining / (selectedOfferPackage?.durationDays || 5) / 86400) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                Recent Transactions
              </h2>

              {/* Vertical Sliding Transactions */}
              <div className="h-64 overflow-hidden" ref={transactionContainerRef}>
                <div 
                  className="transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateY(-${transactionIndex * 70}px)`
                  }}
                >
                  {/* Duplicate transactions for seamless loop */}
                  {[...MOCK_TRANSACTIONS, ...MOCK_TRANSACTIONS].map((txn, idx) => (
                    <div 
                      key={idx}
                      className="h-16 flex items-center justify-between p-4 bg-slate-700/20 rounded-lg border border-slate-600/30 hover:border-emerald-500/30 transition-all mb-1"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-2 rounded-lg ${
                          txn.type === 'DEPOSIT' ? 'bg-emerald-500/20 text-emerald-400' :
                          txn.type === 'WITHDRAWAL' ? 'bg-red-500/20 text-red-400' :
                          txn.type === 'HELP_GIVEN' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {txn.type === 'DEPOSIT' || txn.type === 'HELP_RECEIVED' ? (
                            <ArrowDownLeft size={18} />
                          ) : (
                            <ArrowUpRight size={18} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm capitalize truncate">{txn.type.replace('_', ' ')}</p>
                          <p className="text-slate-400 text-xs truncate">{txn.description}</p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`text-sm font-bold ${
                          txn.type === 'DEPOSIT' || txn.type === 'HELP_RECEIVED' ? 'text-emerald-400' : 'text-white'
                        }`}>
                          {txn.type === 'DEPOSIT' || txn.type === 'HELP_RECEIVED' ? '+' : '-'}${txn.amount}
                        </p>
                        <p className={`text-xs ${
                          txn.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {txn.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-blue-400 text-xs font-semibold mb-2">Network</p>
                <p className="text-2xl font-bold text-white">1.2K</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-emerald-400 text-xs font-semibold mb-2">Helped</p>
                <p className="text-2xl font-bold text-white">47</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-purple-400 text-xs font-semibold mb-2">Earned</p>
                <p className="text-2xl font-bold text-white">$1.2K</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-amber-400 text-xs font-semibold mb-2">Rating</p>
                <p className="text-2xl font-bold text-white">4.9★</p>
              </div>
            </div>
          </div>

          {/* Available Packages & Referral Program Side by Side */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Available Packages */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold text-sm mb-3">Available Packages</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => {
                      setSelectedOfferPackage(pkg);
                      setShowPackageSelection(false);
                    }}
                    className="w-full p-2 bg-slate-700/20 border border-slate-600/30 rounded hover:border-emerald-500/50 hover:bg-slate-700/40 transition-all text-left text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-lg flex-shrink-0">{pkg.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-semibold truncate">{pkg.name}</p>
                          <p className="text-slate-400 text-xs">${pkg.amount}</p>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-semibold flex-shrink-0 ml-2">{pkg.returnPercentage}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Referral Program */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-2">🎯 Referral Program</h3>
              <p className="text-slate-300 text-xs mb-3">
                Earn 10% commission on first contributions
              </p>
              <button 
                onClick={generateReferralCode}
                className="w-full px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Share2 size={16} />
                Generate Code
              </button>

              {/* Referral Codes List */}
              {referralCodes.length > 0 && (
                <div className="mt-3 space-y-2 max-h-24 overflow-y-auto">
                  {referralCodes.map((ref, idx) => (
                    <div key={idx} className="bg-slate-700/30 rounded p-2 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold text-xs truncate">{ref.code}</p>
                        <p className="text-slate-400 text-xs">Uses: {ref.uses}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(ref.code)}
                        className="p-1 hover:bg-slate-600/50 rounded transition-all flex-shrink-0"
                        title="Copy code"
                      >
                        <Copy size={14} className={copiedCode === ref.code ? 'text-emerald-400' : 'text-slate-400'} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Packages */}
          <div>
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-8 backdrop-blur-sm mb-8">
              <h3 className="text-xl font-bold text-white mb-6">Available Packages</h3>
              <div className="space-y-3">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    className="w-full p-4 bg-slate-700/20 border border-slate-600/30 rounded-lg hover:border-emerald-500/50 hover:bg-slate-700/40 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{pkg.icon}</span>
                        <div>
                          <p className="text-white font-semibold">{pkg.name}</p>
                          <p className="text-slate-400 text-sm">${pkg.amount}</p>
                        </div>
                      </div>
                      <span className="text-emerald-400 text-sm font-semibold">{pkg.returnPercentage}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* View Current Package Button */}
            <button
              onClick={() => setShowCurrentPackageModal(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all"
            >
              View Current Package
            </button>
          </div>
        </div>

        {/* Current Package Modal */}
        {showCurrentPackageModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-slate-700/50 rounded-2xl max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/30">
                <h2 className="text-2xl font-bold text-white">Current Package</h2>
                <button
                  onClick={() => setShowCurrentPackageModal(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
                >
                  <X className="text-slate-400 hover:text-white" size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {selectedOfferPackage || selectedReceivePackage ? (
                  <div className="space-y-4">
                    {selectedOfferPackage && (
                      <>
                        <div className="mb-4">
                          <p className="text-slate-400 text-sm mb-2">Currently Offering Help</p>
                          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <span className="text-3xl">{selectedOfferPackage.icon}</span>
                              <div>
                                <p className="text-white font-bold text-lg">{selectedOfferPackage.name}</p>
                                <p className="text-emerald-400 font-bold text-2xl">${selectedOfferPackage.amount}</p>
                                <p className="text-slate-400 text-xs mt-2">
                                  • {selectedOfferPackage.returnPercentage}% ROI
                                  <br />
                                  • {selectedOfferPackage.durationDays} day duration
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedReceivePackage && (
                      <>
                        <div className="mb-4">
                          <p className="text-slate-400 text-sm mb-2">Currently Requesting Help</p>
                          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <span className="text-3xl">{selectedReceivePackage.icon}</span>
                              <div>
                                <p className="text-white font-bold text-lg">{selectedReceivePackage.name}</p>
                                <p className="text-emerald-400 font-bold text-2xl">${selectedReceivePackage.amount}</p>
                                <p className="text-slate-400 text-xs mt-2">
                                  • {selectedReceivePackage.returnPercentage}% ROI
                                  <br />
                                  • {selectedReceivePackage.durationDays} day duration
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 mb-4">No active package selected.</p>
                    <button
                      onClick={() => {
                        setShowCurrentPackageModal(false);
                        setShowPackageSelection(true);
                      }}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all font-semibold"
                    >
                      Select a Package
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">What Members Say</h2>
          <p className="text-slate-400 text-center mb-12">Real stories from members in our community</p>
          <Testimonials />
        </div>
      </div>
    </div>
  );
};
