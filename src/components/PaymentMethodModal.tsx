import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { PaymentMethodConfig, PaymentMethod } from '../types';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (method: PaymentMethodConfig) => void;
}

const MOBILE_NETWORKS = ['MTN Mobile Money', 'Telecel Cash', 'AirtelTigo'];

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ isOpen, onClose, onSave }) => {
  const [paymentType, setPaymentType] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    network: 'MTN Mobile Money',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentType) {
      newErrors.paymentType = 'Please select a payment method';
    }

    if (paymentType === 'MOBILE_MONEY') {
      if (!formData.accountName.trim()) newErrors.accountName = 'Account name is required';
      if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Phone number is required';
      if (!formData.network) newErrors.network = 'Network is required';
    } else if (paymentType === 'BANK_TRANSFER') {
      if (!formData.accountName.trim()) newErrors.accountName = 'Account holder name is required';
      if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
    } else if (paymentType === 'CREDIT_CARD') {
      // Credit card is manual, no extra validation needed
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const method: PaymentMethodConfig = {
      type: paymentType!,
      details: JSON.stringify({
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        network: paymentType === 'MOBILE_MONEY' ? formData.network : undefined,
      }),
      verified: false,
      addedAt: new Date(),
    };

    onSave(method);
    resetForm();
  };

  const resetForm = () => {
    setPaymentType(null);
    setFormData({ accountName: '', accountNumber: '', network: 'MTN Mobile Money' });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/20 max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800/95">
          <h2 className="text-2xl font-bold text-white">Add Payment Method</h2>
          <button
            onClick={resetForm}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Select Payment Type */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Choose Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  type: 'MOBILE_MONEY' as PaymentMethod,
                  label: 'Mobile Money',
                  description: 'MTN, Telecel, AirtelTigo',
                  icon: '📱',
                },
                {
                  type: 'BANK_TRANSFER' as PaymentMethod,
                  label: 'Bank Account',
                  description: 'Direct bank transfer',
                  icon: '🏦',
                },
                {
                  type: 'CREDIT_CARD' as PaymentMethod,
                  label: 'Credit Card',
                  description: 'Manual processing',
                  icon: '💳',
                },
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => {
                    setPaymentType(option.type);
                    setErrors({});
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    paymentType === option.type
                      ? 'border-emerald-500 bg-emerald-500/20'
                      : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <div className="font-bold text-white text-sm">{option.label}</div>
                  <div className="text-slate-400 text-xs mt-1">{option.description}</div>
                </button>
              ))}
            </div>
            {errors.paymentType && <p className="text-red-400 text-sm mt-2">{errors.paymentType}</p>}
          </div>

          {/* Step 2: Details Based on Payment Type */}
          {paymentType === 'MOBILE_MONEY' && (
            <div className="space-y-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <h3 className="font-bold text-white">Mobile Money Details</h3>

              {/* Network Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Network</label>
                <select
                  value={formData.network}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none transition"
                >
                  {MOBILE_NETWORKS.map((network) => (
                    <option key={network} value={network}>
                      {network}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Account Name</label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) =>
                    setFormData({ ...formData, accountName: e.target.value })
                  }
                  placeholder="Your name on account"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 outline-none transition"
                />
                {errors.accountName && (
                  <p className="text-red-400 text-xs mt-1">{errors.accountName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  placeholder="+233 XX XXX XXXX"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 outline-none transition"
                />
                {errors.accountNumber && (
                  <p className="text-red-400 text-xs mt-1">{errors.accountNumber}</p>
                )}
              </div>
            </div>
          )}

          {paymentType === 'BANK_TRANSFER' && (
            <div className="space-y-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="font-bold text-white">Bank Account Details</h3>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) =>
                    setFormData({ ...formData, accountName: e.target.value })
                  }
                  placeholder="Name on bank account"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 outline-none transition"
                />
                {errors.accountName && (
                  <p className="text-red-400 text-xs mt-1">{errors.accountName}</p>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  placeholder="Your bank account number"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 outline-none transition"
                />
                {errors.accountNumber && (
                  <p className="text-red-400 text-xs mt-1">{errors.accountNumber}</p>
                )}
              </div>
            </div>
          )}

          {paymentType === 'CREDIT_CARD' && (
            <div className="space-y-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white mb-2">Manual Processing</h3>
                  <p className="text-slate-300 text-sm">
                    Credit card payments are processed manually for security purposes. Our team will contact you within 24 hours to verify and complete your transaction.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-700 sticky bottom-0 bg-slate-800/95">
          <button
            onClick={resetForm}
            className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!paymentType}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 transition-all font-semibold disabled:cursor-not-allowed"
          >
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};
