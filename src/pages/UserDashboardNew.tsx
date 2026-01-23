import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { PackagesGrid } from '../components/PackagesGrid';
import { useAuthStore, usePaymentStore, useHelpStore, useTransactionStore, useUIStore } from '../store';
import { PACKAGES, MOCK_TRANSACTIONS, MOCK_MATCHED_MEMBER } from '../utils/mockData';
import {
  LogOut,
  AlertCircle,
  TrendingUp,
  CreditCard,
  HandshakeIcon,
  ArrowDownLeft,
  ArrowUpRight,
  X,
} from 'lucide-react';
import type { Package, PaymentMethodConfig, PaymentMethod } from '../types';

export const UserDashboardNew: React.FC = () => {
  const { user, logout, updateUser } = useAuthStore();
  const { paymentMethod, setPaymentMethod, isPaymentMethodVerified } = usePaymentStore();
  const { setMatchedMember } = useHelpStore();
  const { addTransaction } = useTransactionStore();
  const { showPaymentMethodModal, setShowPaymentMethodModal } = useUIStore();
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [paymentModalStep, setPaymentModalStep] = useState<'select' | 'details'>('select');
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentMethod | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    accountNumber: '',
    accountName: '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    if (!isPaymentMethodVerified()) {
      setShowPaymentMethodModal(true);
    }
  };

  const handlePaymentTypeSelect = (type: PaymentMethod) => {
    setSelectedPaymentType(type);
    setPaymentModalStep('details');
  };

  const handleAddPaymentMethod = () => {
    if (!selectedPaymentType || !paymentDetails.accountNumber) return;

    const newPaymentMethod: PaymentMethodConfig = {
      type: selectedPaymentType,
      details: paymentDetails.accountNumber,
      verified: false,
      addedAt: new Date(),
    };

    setPaymentMethod(newPaymentMethod);
    updateUser({
      ...user,
      paymentMethodVerified: true,
    });

    setShowPaymentMethodModal(false);
    setPaymentModalStep('select');
    setSelectedPaymentType(null);
    setPaymentDetails({ accountNumber: '', accountName: '' });

    // Show matched member modal
    setMatchedMember(MOCK_MATCHED_MEMBER);
  };

  const handleGiveHelp = () => {
    if (!selectedPackage) return;

    // Add transaction
    addTransaction({
      id: `txn-${Date.now()}`,
      userId: user.id,
      type: 'HELP_GIVEN',
      amount: selectedPackage.amount,
      currency: 'USD',
      status: 'COMPLETED',
      description: `Gave help for ${selectedPackage.name} package`,
      relatedMemberId: MOCK_MATCHED_MEMBER.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update earnings (mock calculation)
    const earnings = user.totalEarnings + (selectedPackage.amount * selectedPackage.returnPercentage) / 100;
    updateUser({
      ...user,
      totalEarnings: earnings,
    });

    setSelectedPackage(null);
    alert(`Help given successfully! You earned $${(selectedPackage.amount * selectedPackage.returnPercentage / 100).toFixed(2)}`);
  };

  const paymentMethods = [
    { type: 'MOBILE_MONEY', label: 'Mobile Money', icon: '📱' },
    { type: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
    { type: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏦' },
    { type: 'BTC', label: 'Bitcoin', icon: '₿' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={user.profilePhoto}
                alt={user.fullName}
                className="w-16 h-16 rounded-full border-4 border-blue-500 shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
                <p className="text-gray-600">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Verification Status */}
          {(!user.isVerified || !user.paymentMethodVerified) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Action Required</h3>
                  <p className="text-sm text-yellow-800">
                    {!user.isVerified && 'Your ID verification is pending. '}
                    {!user.paymentMethodVerified && 'Please add a payment method to enable giving/requesting help.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Earnings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Total Earnings</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${user.totalEarnings.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">USD</p>
          </div>

          {/* Verification Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">ID Verified</h3>
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {user.isVerified ? '✓' : '⏳'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {user.isVerified ? 'Verified' : 'Pending'}
            </p>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Payment Method</h3>
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {paymentMethod ? paymentMethod.type.replace('_', ' ') : 'Not Set'}
            </p>
            <button
              onClick={() => {
                setPaymentModalStep('select');
                setShowPaymentMethodModal(true);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 mt-2"
            >
              {paymentMethod ? 'Change' : 'Add Method'}
            </button>
          </div>

          {/* Active Package */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Active Package</h3>
              <HandshakeIcon className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {selectedPackage ? selectedPackage.name : 'None'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {selectedPackage
                ? `${selectedPackage.amount} USD`
                : 'Select a package'}
            </p>
          </div>
        </div>

        {/* Packages Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Package</h2>
          <PackagesGrid
            packages={PACKAGES}
            onSelectPackage={handleSelectPackage}
            selectedPackageId={selectedPackage?.id}
          />

          {selectedPackage && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-green-900 mb-2">{selectedPackage.name} Package Selected</h3>
                  <p className="text-sm text-green-800">
                    You're about to give help of <strong>${selectedPackage.amount}</strong> and will receive{' '}
                    <strong>${(selectedPackage.amount * selectedPackage.returnPercentage / 100).toFixed(2)}</strong>{' '}
                    in return ({selectedPackage.returnPercentage}% over {selectedPackage.durationDays} days).
                  </p>
                </div>
                <button
                  onClick={handleGiveHelp}
                  disabled={!isPaymentMethodVerified()}
                  className={`px-6 py-2 font-semibold rounded-lg transition whitespace-nowrap ml-4 ${
                    isPaymentMethodVerified()
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Give Help Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Matched Member Section */}
        {MOCK_MATCHED_MEMBER && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Matched Member</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                    {MOCK_MATCHED_MEMBER.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{MOCK_MATCHED_MEMBER.name}</h3>
                    <p className="text-sm text-gray-600">
                      Payment: {MOCK_MATCHED_MEMBER.paymentMethod.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-mono font-bold text-gray-900">
                    {MOCK_MATCHED_MEMBER.accountNumber}
                  </p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    ${MOCK_MATCHED_MEMBER.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {MOCK_TRANSACTIONS.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {txn.type === 'DEPOSIT' || txn.type === 'HELP_RECEIVED' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-medium text-gray-900">{txn.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{txn.description}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      {txn.type === 'DEPOSIT' || txn.type === 'HELP_RECEIVED' ? '+' : '-'}${txn.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          txn.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : txn.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Method Modal */}
      {showPaymentMethodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add Payment Method</h2>
              <button
                onClick={() => {
                  setShowPaymentMethodModal(false);
                  setPaymentModalStep('select');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {paymentModalStep === 'select' ? (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.type}
                      onClick={() => handlePaymentTypeSelect(method.type as PaymentMethod)}
                      className="w-full p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left flex items-center gap-3"
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium text-gray-900">{method.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedPaymentType === 'BTC' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bitcoin Wallet Address
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.accountNumber}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value, accountName: 'Bitcoin Wallet' })
                        }
                        placeholder="e.g., 1A1z7agoat8Bt8shY4k8RZoHxaFeg8PR2e"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-2">Enter your Bitcoin wallet address to receive payments</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Name
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.accountName}
                          onChange={(e) =>
                            setPaymentDetails({ ...paymentDetails, accountName: e.target.value })
                          }
                          placeholder="Your name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {selectedPaymentType === 'MOBILE_MONEY' ? 'Phone Number' :
                           selectedPaymentType === 'CREDIT_CARD' ? 'Card Number' :
                           selectedPaymentType === 'BANK_TRANSFER' ? 'Account Number' :
                           'Account Number'}
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.accountNumber}
                          onChange={(e) =>
                            setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })
                          }
                          placeholder={selectedPaymentType === 'MOBILE_MONEY' ? 'e.g., +233 24 000 0000' :
                                      selectedPaymentType === 'CREDIT_CARD' ? 'e.g., 1234 5678 9012 3456' :
                                      'Enter account number'}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setPaymentModalStep('select');
                        setSelectedPaymentType(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-900"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleAddPaymentMethod}
                      disabled={!paymentDetails.accountNumber}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition font-medium"
                    >
                      Add Method
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
