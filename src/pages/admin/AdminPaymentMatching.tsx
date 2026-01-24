import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store';
import { Link2, Clock, CheckCircle, Ban } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface PendingReceiver {
  activity_id: string;
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  package_name: string;
  amount: number;
  created_at: string;
}

interface AvailableGiver {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  total_earnings: number;
}

interface PaymentMatch {
  id: number;
  giver_name: string;
  giver_email: string;
  giver_phone: string;
  receiver_name: string;
  receiver_email: string;
  receiver_phone: string;
  amount: number;
  payment_deadline: string;
  status: string;
  created_at: string;
}

export const AdminPaymentMatching: React.FC = () => {
  const [pendingReceivers, setPendingReceivers] = useState<PendingReceiver[]>([]);
  const [availableGivers, setAvailableGivers] = useState<AvailableGiver[]>([]);
  const [matches, setMatches] = useState<PaymentMatch[]>([]);
  const [selectedReceiver, setSelectedReceiver] = useState<PendingReceiver | null>(null);
  const [selectedGiver, setSelectedGiver] = useState<AvailableGiver | null>(null);
  const { token } = useAuthStore();

  const fetchData = async () => {
    try {
      const [receiversRes, giversRes, matchesRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/pending-receivers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/admin/available-givers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/admin/payment-matches`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (receiversRes.data.success) setPendingReceivers(receiversRes.data.data);
      if (giversRes.data.success) setAvailableGivers(giversRes.data.data);
      if (matchesRes.data.success) setMatches(matchesRes.data.data);
    } catch (error) {
      console.error('Failed to fetch matching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [token]);

  const handleCreateMatch = async () => {
    if (!selectedReceiver || !selectedGiver) return;

    try {
      await axios.post(
        `${API_URL}/api/admin/create-match`,
        {
          giverId: selectedGiver.id,
          receiverId: selectedReceiver.id,
          helpActivityId: selectedReceiver.activity_id,
          amount: selectedReceiver.amount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSelectedReceiver(null);
      setSelectedGiver(null);
      fetchData();
    } catch (error) {
      console.error('Failed to create match:', error);
    }
  };

  const handleConfirmPayment = async (matchId: number) => {
    try {
      await axios.post(
        `${API_URL}/api/admin/payment-matches/${matchId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error('Failed to confirm payment:', error);
    }
  };

  const handleBanUser = async (userId: string, userName: string) => {
    if (!confirm(`Ban ${userName} for payment default?`)) return;

    try {
      await axios.post(
        `${API_URL}/api/admin/ban-user`,
        {
          userId,
          reason: 'Failed to complete payment within 6-hour deadline',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error('Failed to ban user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-emerald-300 text-sm">Match users for payments</p>
        <h1 className="text-2xl font-bold text-white">Payment Matching</h1>
      </div>

      {/* Pending Receivers */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
        <h2 className="text-white font-bold text-lg mb-4">Pending to Receive Help ({pendingReceivers.length})</h2>
        <div className="space-y-2">
          {pendingReceivers.map((receiver) => (
            <div
              key={receiver.id}
              onClick={() => setSelectedReceiver(receiver)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedReceiver?.id === receiver.id
                  ? 'bg-emerald-500/20 border-2 border-emerald-400'
                  : 'bg-slate-800/40 border border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{receiver.full_name}</p>
                  <p className="text-slate-400 text-sm">{receiver.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold">${receiver.amount}</p>
                  <p className="text-slate-400 text-xs">{receiver.package_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Givers */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
        <h2 className="text-white font-bold text-lg mb-4">Available to Give Help ({availableGivers.length})</h2>
        <div className="space-y-2">
          {availableGivers.map((giver) => (
            <div
              key={giver.id}
              onClick={() => setSelectedGiver(giver)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedGiver?.id === giver.id
                  ? 'bg-blue-500/20 border-2 border-blue-400'
                  : 'bg-slate-800/40 border border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{giver.full_name}</p>
                  <p className="text-slate-400 text-sm">{giver.phone_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-300 text-sm">Total Earned:</p>
                  <p className="text-blue-400 font-bold">${giver.total_earnings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Match Button */}
      {selectedReceiver && selectedGiver && (
        <button
          onClick={handleCreateMatch}
          className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
        >
          <Link2 size={20} />
          Match {selectedGiver.full_name} → {selectedReceiver.full_name}
        </button>
      )}

      {/* Active Matches */}
      <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-white font-bold text-lg">Active Payment Matches ({matches.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-300">
                <th className="px-4 py-3 text-left">Giver</th>
                <th className="px-4 py-3 text-left">Receiver</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Deadline</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {matches.map((match) => {
                const deadline = new Date(match.payment_deadline);
                const hoursLeft = differenceInHours(deadline, new Date());
                const isOverdue = hoursLeft < 0;

                return (
                  <tr key={match.id} className="hover:bg-white/5 text-slate-200">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold">{match.giver_name}</p>
                        <p className="text-xs text-slate-400">{match.giver_phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold">{match.receiver_name}</p>
                        <p className="text-xs text-slate-400">{match.receiver_phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">${match.amount}</td>
                    <td className="px-4 py-3">
                      <div className={isOverdue ? 'text-red-400' : 'text-slate-300'}>
                        <p className="text-xs">{format(deadline, 'MMM d, HH:mm')}</p>
                        <p className="text-xs flex items-center gap-1 mt-1">
                          <Clock size={12} />
                          {isOverdue ? `${Math.abs(hoursLeft)}h overdue` : `${hoursLeft}h left`}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          match.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : match.status === 'awaiting_confirmation'
                            ? 'bg-blue-500/15 text-blue-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {match.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {match.status !== 'completed' && (
                          <>
                            <button
                              onClick={() => handleConfirmPayment(match.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-200 text-xs flex items-center gap-1"
                            >
                              <CheckCircle size={12} /> Confirm
                            </button>
                            {isOverdue && (
                              <button
                                onClick={() => handleBanUser(match.giver_name, match.giver_name)}
                                className="px-2 py-1 rounded-lg bg-red-500/15 text-red-200 text-xs flex items-center gap-1"
                              >
                                <Ban size={12} /> Ban
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
