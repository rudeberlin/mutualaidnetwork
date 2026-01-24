import React, { useState, useEffect } from 'react';
import { Clock, User, Phone, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { differenceInHours, differenceInMinutes, format } from 'date-fns';
import axios from 'axios';
import { useAuthStore } from '../store';

interface PaymentMatch {
  id: number;
  role: 'giver' | 'receiver';
  amount: number;
  payment_deadline: string;
  status: 'pending' | 'awaiting_confirmation' | 'completed';
  matched_user: {
    full_name: string;
    phone_number: string;
    account_name?: string;
    account_number?: string;
    bank_name?: string;
  };
  created_at: string;
}

export const PaymentMatchCard: React.FC = () => {
  const [match, setMatch] = useState<PaymentMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const { user, token } = useAuthStore();

  useEffect(() => {
    fetchPaymentMatch();
    const interval = setInterval(fetchPaymentMatch, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [user?.id]);

  const fetchPaymentMatch = async () => {
    if (!user?.id || !token) return;
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/${user.id}/payment-match`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const payload = response.data.data;

      if (!payload) {
        setMatch(null);
        return;
      }

      const normalized: PaymentMatch = {
        role: payload.role,
        id: payload.match.id,
        amount: Number(payload.match.amount),
        payment_deadline: payload.match.payment_deadline,
        status: payload.match.status,
        matched_user: payload.match.matched_user,
        created_at: payload.match.created_at
      };

      setMatch(normalized);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Error fetching payment match:', error);
      }
      setMatch(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!token || !match) return;
    
    setConfirming(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/confirm-payment-sent`,
        { matchId: match.id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      await fetchPaymentMatch();
      alert('Payment confirmation sent! Waiting for admin verification.');
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Failed to confirm payment. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  const getTimeRemaining = () => {
    if (!match) return null;
    
    const deadline = new Date(match.payment_deadline);
    const now = new Date();
    const hoursLeft = differenceInHours(deadline, now);
    const minutesLeft = differenceInMinutes(deadline, now) % 60;
    
    if (hoursLeft < 0) {
      return { text: 'OVERDUE', color: 'text-red-500', urgent: true };
    } else if (hoursLeft < 1) {
      return { text: `${minutesLeft}m left`, color: 'text-orange-500', urgent: true };
    } else {
      return { text: `${hoursLeft}h ${minutesLeft}m left`, color: 'text-emerald-400', urgent: false };
    }
  };

  if (loading) {
    return (
      <div className="glass-lg p-6 rounded-xl border border-emerald-500/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/2"></div>
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!match) return null;

  const timeRemaining = getTimeRemaining();
  const isGiver = match.role === 'giver';

  return (
    <div className={`glass-lg p-6 rounded-xl border ${
      timeRemaining?.urgent ? 'border-red-500/40' : 'border-emerald-500/20'
    } ${timeRemaining?.urgent ? 'animate-pulse' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className={`${timeRemaining?.color || 'text-emerald-400'}`} size={24} />
          <h3 className="text-xl font-bold text-white">
            {isGiver ? 'Payment Required' : 'Awaiting Payment'}
          </h3>
        </div>
        
        {match.status === 'completed' ? (
          <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
            <CheckCircle size={16} />
            Completed
          </span>
        ) : match.status === 'awaiting_confirmation' ? (
          <span className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
            <Clock size={16} />
            Pending Admin
          </span>
        ) : (
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
            timeRemaining?.urgent ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {timeRemaining?.urgent && <AlertCircle size={16} />}
            {timeRemaining?.text}
          </span>
        )}
      </div>

      {/* Amount */}
      <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-500/20">
        <p className="text-sm text-slate-400 mb-1">Amount</p>
        <p className="text-3xl font-bold text-white">₦{match.amount.toLocaleString()}</p>
      </div>

      {/* User Details */}
      {isGiver ? (
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-semibold text-emerald-400 uppercase">Send Payment To:</h4>
          
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
            <User size={20} className="text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400">Receiver Name</p>
              <p className="text-white font-semibold">{match.matched_user.full_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
            <Phone size={20} className="text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400">Phone Number</p>
              <p className="text-white font-semibold">{match.matched_user.phone_number}</p>
            </div>
          </div>

          {(match.matched_user.account_number || match.matched_user.account_name) && (
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <CreditCard size={20} className="text-emerald-400" />
              <div>
                <p className="text-xs text-slate-400">Bank Details</p>
                {match.matched_user.account_name && (
                  <p className="text-white font-semibold">{match.matched_user.account_name}</p>
                )}
                {match.matched_user.account_number && (
                  <p className="text-white">{match.matched_user.account_number}</p>
                )}
                {match.matched_user.bank_name && (
                  <p className="text-sm text-slate-400">{match.matched_user.bank_name}</p>
                )}
              </div>
            </div>
          )}

          {/* Warning Message */}
          {timeRemaining?.urgent && match.status === 'pending' && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                Warning: Payment deadline approaching! Send payment immediately.
              </p>
            </div>
          )}

          {/* Confirm Payment Button */}
          {match.status === 'pending' && (
            <button
              onClick={handleConfirmPayment}
              disabled={confirming}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {confirming ? 'Confirming...' : 'I Have Sent the Payment'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-semibold text-blue-400 uppercase">Expecting Payment From:</h4>
          
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
            <User size={20} className="text-blue-400" />
            <div>
              <p className="text-xs text-slate-400">Giver Name</p>
              <p className="text-white font-semibold">{match.matched_user.full_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
            <Phone size={20} className="text-blue-400" />
            <div>
              <p className="text-xs text-slate-400">Phone Number</p>
              <p className="text-white font-semibold">{match.matched_user.phone_number}</p>
            </div>
          </div>

          {(match.matched_user.account_number || match.matched_user.account_name) && (
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <CreditCard size={20} className="text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Giver Bank Details</p>
                {match.matched_user.account_name && (
                  <p className="text-white font-semibold">{match.matched_user.account_name}</p>
                )}
                {match.matched_user.account_number && (
                  <p className="text-white">{match.matched_user.account_number}</p>
                )}
                {match.matched_user.bank_name && (
                  <p className="text-sm text-slate-400">{match.matched_user.bank_name}</p>
                )}
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-sm">
              Please wait for the payment to arrive. You will be notified once confirmed.
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">
          Matched: {format(new Date(match.created_at), 'MMM d, yyyy h:mm a')}
        </p>
        <p className="text-xs text-slate-500">
          Deadline: {format(new Date(match.payment_deadline), 'MMM d, yyyy h:mm a')}
        </p>
      </div>
    </div>
  );
};
