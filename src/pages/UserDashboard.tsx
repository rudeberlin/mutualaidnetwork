import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { SettingsModal } from '../components/SettingsModal';
import { PaymentMethodModal } from '../components/PaymentMethodModal';
import { Testimonials } from '../components/Testimonials';
import { Toast } from '../components/Toast';
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedOfferPackage, setSelectedOfferPackage] = useState<Package | null>(() => {
    const saved = localStorage.getItem('selectedOfferPackage');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedReceivePackage, setSelectedReceivePackage] = useState<Package | null>(() => {
    const saved = localStorage.getItem('selectedReceivePackage');
    return saved ? JSON.parse(saved) : null;
  });
  const [offerHelpStatus, setOfferHelpStatus] = useState<'processing' | 'pending' | 'matched' | null>(() => {
    return localStorage.getItem('offerHelpStatus') as any || null;
  });
  const [receiveHelpStatus, setReceiveHelpStatus] = useState<'processing' | 'pending' | 'matched' | null>(() => {
    return localStorage.getItem('receiveHelpStatus') as any || null;
  });
  const [transactionIndex, setTransactionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const saved = localStorage.getItem('timeRemaining');
    return saved ? parseInt(saved) : 0;
  });
  const [referralCodes, setReferralCodes] = useState<{ code: string; createdAt: string; uses: number }[]>(
    JSON.parse(localStorage.getItem('referralCodes') || '[]')
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [paymentMatch, setPaymentMatch] = useState<any>(null);
  const transactionContainerRef = useRef<HTMLDivElement>(null);
  const { user, token, initializeFromStorage } = useAuthStore();
  const currentUser = user || MOCK_CURRENT_USER;
  
  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);
  
  // Persist help request state to localStorage
  useEffect(() => {
    if (selectedOfferPackage) {
      localStorage.setItem('selectedOfferPackage', JSON.stringify(selectedOfferPackage));
    } else {
      localStorage.removeItem('selectedOfferPackage');
    }
  }, [selectedOfferPackage]);

  useEffect(() => {
    if (selectedReceivePackage) {
      localStorage.setItem('selectedReceivePackage', JSON.stringify(selectedReceivePackage));
    } else {
      localStorage.removeItem('selectedReceivePackage');
    }
  }, [selectedReceivePackage]);

  useEffect(() => {
    if (offerHelpStatus) {
      localStorage.setItem('offerHelpStatus', offerHelpStatus);
    } else {
      localStorage.removeItem('offerHelpStatus');
    }
  }, [offerHelpStatus]);

  useEffect(() => {
    if (receiveHelpStatus) {
      localStorage.setItem('receiveHelpStatus', receiveHelpStatus);
    } else {
      localStorage.removeItem('receiveHelpStatus');
    }
  }, [receiveHelpStatus]);

  useEffect(() => {
    localStorage.setItem('timeRemaining', timeRemaining.toString());
  }, [timeRemaining]);

  // Fetch payment match data callback
  const fetchPaymentMatchData = useCallback(async () => {
    if (!user?.id || !token) return;
    
    try {
      const response = await axios.get(`${API_URL}/api/user/${user.id}/payment-match`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data) {
        const matchData = response.data.data;
        // Transform API response to match our component structure
        setPaymentMatch({
          id: matchData.match.id,
          amount: matchData.match.amount,
          payment_deadline: matchData.match.payment_deadline,
          status: matchData.match.status,
          role: matchData.role,
          matched_user_name: matchData.match.matched_user.full_name,
          matched_user_phone: matchData.match.matched_user.phone_number,
          bank_details: matchData.match.matched_user.account_number ? {
            account_name: matchData.match.matched_user.account_name,
            account_number: matchData.match.matched_user.account_number,
            bank_name: matchData.match.matched_user.bank_name
          } : null
        });
        // Update status to matched if we have a match
        if (matchData.role === 'giver' && offerHelpStatus !== 'matched') {
          setOfferHelpStatus('matched');
        } else if (matchData.role === 'receiver' && receiveHelpStatus !== 'matched') {
          setReceiveHelpStatus('matched');
        }
      } else {
        setPaymentMatch(null);
      }
    } catch (error) {
      console.error('Failed to fetch payment match:', error);
      setPaymentMatch(null);
    }
  }, [user?.id, token, offerHelpStatus, receiveHelpStatus]);

  // Set up polling for payment match data
  useEffect(() => {
    fetchPaymentMatchData();
    const interval = setInterval(fetchPaymentMatchData, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchPaymentMatchData]);
  
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

  const handlePackageSelect = async (pkg: Package, type: 'offer' | 'receive') => {
    try {
      if (type === 'offer') {
        // Register as giver on backend
        if (!token) {
          alert('You must be logged in');
          return;
        }
        
        const response = await axios.post(
          `${API_URL}/api/help/register-offer`,
          { packageId: pkg.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setSelectedOfferPackage(pkg);
          setOfferHelpStatus('pending');
          setTimeRemaining(pkg.durationDays * 86400);
          setShowPackageSelection(false);
        }
      } else {
        // Register as receiver on backend
        if (!token) {
          alert('You must be logged in');
          return;
        }

        if (!offerHelpStatus) {
          alert('You must offer help first before requesting help');
          return;
        }

        const response = await axios.post(
          `${API_URL}/api/help/register-receive`,
          { packageId: pkg.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setSelectedReceivePackage(pkg);
          setReceiveHelpStatus('pending');
          setShowPackageSelection(false);
        }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to register for help';
      alert(errorMsg);
    }
  };

  const handleReceiveHelp = () => {
    if (!offerHelpStatus) {
      alert('You must offer help first');
      return;
    }
    setShowPackageSelection(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950">
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
          user={currentUser} 
          onClose={() => setShowSettings(false)}
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
              <div className="flex items-center gap-4 mb-2">
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
                {currentUser.displayId && (
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/50 rounded-full text-blue-300 text-sm font-mono">
                    ID: {currentUser.displayId}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleOfferHelp}
              disabled={!!offerHelpStatus || !!receiveHelpStatus}
              className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all shadow-lg ${
                (offerHelpStatus || receiveHelpStatus)
                  ? 'bg-slate-400 text-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
              title={(offerHelpStatus || receiveHelpStatus) ? 'You can only have one active package at a time' : ''}
            >
              <Hand size={20} />
              Offer Help
            </button>
            <button
              onClick={handleReceiveHelp}
              disabled={!offerHelpStatus || !!receiveHelpStatus}
              className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all ${
                !offerHelpStatus || !!receiveHelpStatus
                  ? 'bg-slate-500 text-gray-300 cursor-not-allowed opacity-50'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
              title={!offerHelpStatus ? 'Offer help first before requesting help' : !!receiveHelpStatus ? 'You can only have one active package at a time' : ''}
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

        {/* Payment Match Card - Removed - Details shown in Offering Help section below */}

        {/* After Payment Confirmed - Show Package Subscription & Maturity */}
        {paymentMatch && paymentMatch.status === 'completed' && selectedOfferPackage && (
          <div className="mb-12 p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedOfferPackage.icon}</span>
                <div>
                  <p className="text-emerald-400 text-sm font-semibold">Active Package</p>
                  <p className="text-white text-2xl font-bold">{selectedOfferPackage.name}</p>
                  <p className="text-emerald-300 text-lg">₵{selectedOfferPackage.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm">Expected Return</p>
                <p className="text-emerald-400 font-bold text-2xl">
                  ₵{Math.round(selectedOfferPackage.amount * selectedOfferPackage.returnPercentage / 100).toLocaleString()}
                </p>
                <p className="text-slate-400 text-sm mt-2">{selectedOfferPackage.durationDays} days</p>
              </div>
            </div>
          </div>
        )}

        {/* Active Help Requests - Persistent Status Display */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Offer Help Status */}
          {offerHelpStatus && selectedOfferPackage && (
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Offering Help</h3>
                {/* Only allow closing if not matched or in processing */}
                {(offerHelpStatus === 'processing' || !paymentMatch) && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this help request?')) {
                        setOfferHelpStatus(null);
                        setSelectedOfferPackage(null);
                        localStorage.removeItem('offerHelpStatus');
                        localStorage.removeItem('selectedOfferPackage');
                      }
                    }}
                    className="text-slate-400 hover:text-white text-lg"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Package Info */}
              <div className="bg-slate-700/30 rounded p-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{selectedOfferPackage.icon}</span>
                  <div>
                    <p className="text-white font-semibold">{selectedOfferPackage.name}</p>
                    <p className="text-emerald-400 font-bold text-lg">₵{selectedOfferPackage.amount.toLocaleString()}</p>
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
                  <p className="text-slate-400 text-sm mb-3">Your help request is being processed...</p>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="text-blue-400" size={16} />
                      <p className="text-blue-300 text-sm">Estimated time: 1-2 hours for admin review</p>
                    </div>
                  </div>
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
                    <div className="flex items-center gap-2">
                      <Clock className="text-yellow-300" size={16} />
                      <p className="text-yellow-300 text-xs">Typical wait: 1-2 hours. Check back soon for updates.</p>
                    </div>
                  </div>
                </div>
              )}
              {offerHelpStatus === 'matched' && paymentMatch && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <p className="text-white font-semibold">Matched!</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-4 space-y-3">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Receiver Details</p>
                      <p className="text-emerald-300 font-semibold">{paymentMatch.matched_user_name}</p>
                      <p className="text-slate-300 text-sm">{paymentMatch.matched_user_phone}</p>
                    </div>
                    {paymentMatch.bank_details && (
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-slate-400 text-xs mb-1">Receiver's Bank Details</p>
                        <p className="text-white text-sm"><span className="text-slate-400">Account:</span> {paymentMatch.bank_details.account_number}</p>
                        <p className="text-white text-sm"><span className="text-slate-400">Bank:</span> {paymentMatch.bank_details.bank_name}</p>
                        <p className="text-white text-sm"><span className="text-slate-400">Name:</span> {paymentMatch.bank_details.account_name}</p>
                      </div>
                    )}
                    <p className="text-emerald-400 font-bold text-lg">Amount: ₵{paymentMatch.amount.toLocaleString()}</p>
                    <button
                      onClick={async () => {
                        if (confirm('Have you sent the payment to the receiver?')) {
                          try {
                            const response = await axios.post(
                              `${API_URL}/api/user/confirm-payment-sent`,
                              { matchId: paymentMatch.id },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            if (response.data.success) {
                              setToast({ message: 'Payment confirmed! Pending admin approval. Countdown will start after verification.', type: 'success' });
                              setTimeout(() => fetchPaymentMatchData(), 2000);
                            }
                          } catch (error: any) {
                            const errorMsg = error.response?.data?.error || 'Failed to confirm payment. Please try again.';
                            setToast({ message: errorMsg, type: 'error' });
                          }
                        }
                      }}
                      className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition"
                    >
                      I Have Sent the Payment
                    </button>
                  </div>
                </div>
              )}
              {offerHelpStatus === 'matched' && !paymentMatch && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-white font-semibold">Loading match details...</p>
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
                    <p className="text-emerald-400 font-bold text-lg">₵{selectedReceivePackage.amount.toLocaleString()}</p>
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
              {receiveHelpStatus === 'matched' && paymentMatch && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <p className="text-white font-semibold">Matched!</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-4 space-y-3">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Giver Details</p>
                      <p className="text-emerald-300 font-semibold">{paymentMatch.matched_user_name}</p>
                      <p className="text-slate-300 text-sm">{paymentMatch.matched_user_phone}</p>
                    </div>
                    {paymentMatch.bank_details && (
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-slate-400 text-xs mb-1">Giver's Bank Details</p>
                        <p className="text-white text-sm"><span className="text-slate-400">Account:</span> {paymentMatch.bank_details.account_number}</p>
                        <p className="text-white text-sm"><span className="text-slate-400">Bank:</span> {paymentMatch.bank_details.bank_name}</p>
                        <p className="text-white text-sm"><span className="text-slate-400">Name:</span> {paymentMatch.bank_details.account_name}</p>
                      </div>
                    )}
                    <p className="text-emerald-400 font-bold text-lg">Expected Amount: ₵{paymentMatch.amount.toLocaleString()}</p>
                    <button
                      onClick={async () => {
                        if (confirm('Have you received the payment from the giver?')) {
                          try {
                            const response = await axios.post(
                              `${API_URL}/api/user/payment-confirm`,
                              { matchId: paymentMatch.id },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            if (response.data.success) {
                              setToast({ message: 'Payment received confirmed! Pending admin verification.', type: 'success' });
                              setTimeout(() => fetchPaymentMatchData(), 2000);
                            }
                          } catch (error: any) {
                            const errorMsg = error.response?.data?.error || 'Failed to confirm payment. Please try again.';
                            setToast({ message: errorMsg, type: 'error' });
                          }
                        }
                      }}
                      className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition"
                    >
                      I Have Received the Payment
                    </button>
                  </div>
                </div>
              )}
              {receiveHelpStatus === 'matched' && !paymentMatch && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-white font-semibold">Loading match details...</p>
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

          {/* Active Packages & Referral Program Side by Side */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Active Packages - Interest Accrual Clock */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold">Active Packages</h3>
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-200">LIVE</span>
                  </div>
                  <p className="text-slate-400 text-xs">Interest accrues in real time</p>
                </div>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping"></div>
                  <div className="absolute inset-1 rounded-full border border-emerald-400/40"></div>
                  <div className="relative w-14 h-14 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-inner shadow-emerald-500/10 flex items-center justify-center">
                    {/* Hour hand */}
                    <div className="absolute w-1 h-4 bg-emerald-400 rounded-full origin-bottom" style={{ transform: 'translateY(-4px) rotate(45deg)' }}></div>
                    {/* Minute hand */}
                    <div className="absolute w-0.5 h-6 bg-teal-400 rounded-full origin-bottom" style={{ transform: 'translateY(-6px) rotate(180deg)', animation: 'spin 60s linear infinite' }}></div>
                    {/* Center dot */}
                    <div className="absolute w-2 h-2 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {dashboardStats.activePackages && dashboardStats.activePackages.length > 0 ? (
                  dashboardStats.activePackages.map((pkg: any, idx: number) => {
                    // Calculate hourly interest accrual (daily % / 24)
                    const dailyReturnPercent = 0.5; // 0.5% per day
                    const hourlyReturnPercent = dailyReturnPercent / 24;
                    const hoursSinceStart = Math.floor((Date.now() - new Date(pkg.created_at).getTime()) / (1000 * 60 * 60));
                    const accruedPercentage = Math.min(hourlyReturnPercent * hoursSinceStart, dailyReturnPercent);
                    
                    return (
                      <div key={idx} className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-semibold text-sm">{pkg.package_name}</p>
                            <p className="text-slate-400 text-xs">${pkg.amount}</p>
                          </div>
                          <div className="text-right ml-2">
                            <p className="text-emerald-400 font-bold text-xs">{(hourlyReturnPercent * 100).toFixed(2)}%/hr</p>
                            <p className="text-slate-400 text-xs">{(accruedPercentage * 100).toFixed(2)}% accrued</p>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                            style={{ width: `${Math.min(accruedPercentage * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-400 text-sm">No active packages</p>
                    <p className="text-slate-500 text-xs mt-1">Start by selecting a package from below</p>
                  </div>
                )}
              </div>
              
              {/* Hourly interest breakdown */}
              <div className="mt-4 pt-4 border-t border-slate-700/30">
                <p className="text-slate-400 text-xs mb-2 font-semibold">Daily Interest Rate Breakdown</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-700/20 rounded p-2">
                    <p className="text-slate-500">Per Hour</p>
                    <p className="text-emerald-400 font-bold">~0.02%</p>
                  </div>
                  <div className="bg-slate-700/20 rounded p-2">
                    <p className="text-slate-500">Per Day</p>
                    <p className="text-teal-400 font-bold">0.5%</p>
                  </div>
                  <div className="bg-slate-700/20 rounded p-2">
                    <p className="text-slate-500">Per Month</p>
                    <p className="text-cyan-400 font-bold">~15%</p>
                  </div>
                </div>
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
                          <p className="text-slate-400 text-sm">₵{pkg.amount.toLocaleString()}</p>
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
                                <p className="text-emerald-400 font-bold text-2xl">₵{selectedOfferPackage.amount.toLocaleString()}</p>
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
                                <p className="text-emerald-400 font-bold text-2xl">₵{selectedReceivePackage.amount.toLocaleString()}</p>
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
