import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store';
import { Toast } from '../../components/Toast';
import { Link2, Clock, CheckCircle, Ban, X } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';
import { API_URL } from '../../utils/apiUrl';

interface PendingReceiver {
  activity_id: string;
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  package_name: string;
  amount: number;
  created_at: string;
  payment_method?: string | null;
}

interface AvailableGiver {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  total_earnings: number;
  payment_method?: string | null;
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

interface ManualMatch {
  id: number;
  user_id: string;
  username: string;
  user_name: string;
  role: string;
  amount: number;
  matched_with_name: string;
  matched_with_email?: string;
  matched_with_phone?: string;
  status: string;
  created_at: string;
}

type AssignModalState = { type: 'receiver'; data: PendingReceiver } | { type: 'giver'; data: AvailableGiver } | null;

export const AdminPaymentMatching: React.FC = () => {
  const [pendingReceivers, setPendingReceivers] = useState<PendingReceiver[]>([]);
  const [availableGivers, setAvailableGivers] = useState<AvailableGiver[]>([]);
  const [matches, setMatches] = useState<PaymentMatch[]>([]);
  const [manualMatches, setManualMatches] = useState<ManualMatch[]>([]);
  const [selectedReceiver, setSelectedReceiver] = useState<PendingReceiver | null>(null);
  const [selectedGiver, setSelectedGiver] = useState<AvailableGiver | null>(null);
  const [showAssignModal, setShowAssignModal] = useState<AssignModalState>(null);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [assignModalTab, setAssignModalTab] = useState<'available' | 'manual'>('available');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { token } = useAuthStore();
  const shouldAutoMatch = useRef(false);
  const [manualEntry, setManualEntry] = useState({
    username: '',
    role: 'receiver' as 'receiver' | 'giver',
    amount: '',
    matchedWithName: '',
    matchedWithEmail: '',
    matchedWithPhone: '',
    paymentAccount: '',
    paymentMethod: ''
  });
  const [requiredFieldErrors, setRequiredFieldErrors] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      const [receiversRes, giversRes, matchesRes, manualMatchesRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/pending-receivers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/admin/available-givers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/admin/payment-matches`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/admin/manual-matches`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (receiversRes.data.success) setPendingReceivers(receiversRes.data.data);
      if (giversRes.data.success) setAvailableGivers(giversRes.data.data);
      if (matchesRes.data.success) setMatches(matchesRes.data.data);
      if (manualMatchesRes.data.success) setManualMatches(manualMatchesRes.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          setToast({ message: 'Session expired. Please log in again.', type: 'error' });
        } else {
          const errorMsg = error.response?.data?.error || error.message || 'Failed to fetch matching data';
          setToast({ message: errorMsg, type: 'error' });
        }
      } else {
        setToast({ message: 'Failed to fetch matching data', type: 'error' });
      }
      console.error('Failed to fetch matching data:', error);
    }
  }, [token]);

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };
    load();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [fetchData]);

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
      
      setToast({ message: `Match created: ${selectedGiver.full_name} → ${selectedReceiver.full_name}`, type: 'success' });
      setSelectedReceiver(null);
      setSelectedGiver(null);
      shouldAutoMatch.current = false;
      fetchData();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.error || error.message || 'Failed to create match';
        setToast({ message: errorMsg, type: 'error' });
      } else {
        setToast({ message: 'Failed to create match', type: 'error' });
      }
      shouldAutoMatch.current = false;
    }
  };

  // Auto-create match when both selected from modal (not on manual button click)
  useEffect(() => {
    if (selectedReceiver && selectedGiver && shouldAutoMatch.current) {
      const timer = setTimeout(() => {
        handleCreateMatch();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedReceiver, selectedGiver]);

  const handleConfirmPayment = async (matchId: number) => {
    try {
      await axios.post(
        `${API_URL}/api/admin/payment-matches/${matchId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setToast({ message: 'Payment confirmed successfully', type: 'success' });
      fetchData();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.error || error.message || 'Failed to confirm payment';
        setToast({ message: errorMsg, type: 'error' });
      } else {
        setToast({ message: 'Failed to confirm payment', type: 'error' });
      }
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
      setToast({ message: `User ${userName} has been banned`, type: 'success' });
      fetchData();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.error || error.message || 'Failed to ban user';
        setToast({ message: errorMsg, type: 'error' });
      } else {
        setToast({ message: 'Failed to ban user', type: 'error' });
      }
    }
  };

  const handleManualEntry = async () => {
    const errors = new Set<string>();
    if (!manualEntry.username) errors.add('username');
    if (!manualEntry.amount) errors.add('amount');
    if (!manualEntry.matchedWithName) errors.add('matchedWithName');
    
    setRequiredFieldErrors(errors);

    if (errors.size > 0) {
      const errorNames = Array.from(errors).map(e => {
        if (e === 'username') return 'Username';
        if (e === 'amount') return 'Amount';
        if (e === 'matchedWithName') return 'Matched user name';
        return e;
      });
      setToast({ message: `Missing required fields: ${errorNames.join(', ')}`, type: 'error' });
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/admin/create-manual-match`,
        manualEntry,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setToast({ message: 'Manual payment match created successfully', type: 'success' });
      setShowManualEntryModal(false);
      setManualEntry({
        username: '',
        role: 'receiver',
        amount: '',
        matchedWithName: '',
        matchedWithEmail: '',
        matchedWithPhone: '',
        paymentAccount: '',
        paymentMethod: ''
      });
      setRequiredFieldErrors(new Set());
      fetchData();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.error || error.message || 'Failed to create manual match';
        setToast({ message: errorMsg, type: 'error' });
      } else {
        setToast({ message: 'Failed to create manual match', type: 'error' });
      }
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div>
        <p className="text-emerald-300 text-sm">Match users for payments</p>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Payment Matching</h1>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await axios.post(
                    `${API_URL}/api/admin/auto-match`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  setToast({ message: 'Automatic matching completed!', type: 'success' });
                  fetchData();
                } catch (error: unknown) {
                  if (axios.isAxiosError(error)) {
                    const errorMsg = error.response?.data?.error || error.message || 'Auto-matching failed';
                    setToast({ message: errorMsg, type: 'error' });
                  } else {
                    setToast({ message: 'Auto-matching failed', type: 'error' });
                  }
                }
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition flex items-center gap-2"
            >
              <Link2 size={18} />
              Auto Match
            </button>
            <button
              onClick={() => setShowManualEntryModal(true)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
            >
              <Link2 size={18} />
              Manual Entry
            </button>
          </div>
        </div>
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
                    {receiver.payment_method && (
                      <p className="text-slate-300 text-xs mt-1">Payment Method: {receiver.payment_method}</p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold">${receiver.amount}</p>
                    <p className="text-slate-400 text-xs">{receiver.package_name}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAssignModal({ type: 'receiver', data: receiver });
                    }}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded transition"
                  >
                    ASSIGN
                  </button>
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
                    {giver.payment_method && (
                      <p className="text-slate-300 text-xs mt-1">Payment Method: {giver.payment_method}</p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-slate-300 text-sm">Total Earned:</p>
                    <p className="text-blue-400 font-bold">${giver.total_earnings}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAssignModal({ type: 'giver', data: giver });
                    }}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded transition"
                  >
                    ASSIGN
                  </button>
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

      {/* Assign Modal with Tabs */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">
                {showAssignModal.type === 'receiver' ? 'Assign Giver' : 'Assign Receiver'}
              </h3>
              <button
                onClick={() => {
                  setShowAssignModal(null);
                  setAssignModalTab('available');
                }}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-700 bg-slate-800/30">
              <button
                onClick={() => setAssignModalTab('available')}
                className={`flex-1 px-4 py-3 font-semibold transition-all ${
                  assignModalTab === 'available'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Available Pool
              </button>
              <button
                onClick={() => setAssignModalTab('manual')}
                className={`flex-1 px-4 py-3 font-semibold transition-all ${
                  assignModalTab === 'manual'
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                + Create Manual
              </button>
            </div>

            <div className="p-6">
              {/* Selected User Info */}
              <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-xs mb-1">Current Selection</p>
                <p className="text-white font-semibold">{showAssignModal.data.full_name}</p>
                <p className="text-emerald-400 font-bold">
                  ${showAssignModal.type === 'receiver' ? showAssignModal.data.amount : showAssignModal.data.total_earnings}
                </p>
                {showAssignModal.type === 'receiver' && (
                  <p className="text-slate-400 text-xs">{showAssignModal.data.package_name}</p>
                )}
              </div>

              {/* Tab Content: Available Pool */}
              {assignModalTab === 'available' && (
                <div className="space-y-3">
                  <p className="text-slate-300 text-sm font-semibold mb-4">
                    Available {showAssignModal.type === 'receiver' ? 'Givers' : 'Receivers'}:
                  </p>
                  
                  {showAssignModal.type === 'receiver' ? (
                    // Show available givers
                    availableGivers.length > 0 ? (
                      availableGivers.map((giver) => (
                        <div
                          key={giver.id}
                          onClick={() => {
                            shouldAutoMatch.current = true;
                            setSelectedReceiver(showAssignModal.data);
                            setSelectedGiver(giver);
                            setShowAssignModal(null);
                            setAssignModalTab('available');
                          }}
                          className="p-3 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-blue-500 rounded-lg cursor-pointer transition"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-semibold">{giver.full_name}</p>
                              <p className="text-slate-400 text-xs">{giver.phone_number}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-blue-400 font-bold text-sm">${giver.total_earnings}</p>
                              <p className="text-slate-400 text-xs">Total Earned</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-8">No available givers</p>
                    )
                  ) : (
                    // Show available receivers
                    pendingReceivers.length > 0 ? (
                      pendingReceivers.map((receiver) => (
                        <div
                          key={receiver.id}
                          onClick={() => {
                            shouldAutoMatch.current = true;
                            setSelectedGiver(showAssignModal.data);
                            setSelectedReceiver(receiver);
                            setShowAssignModal(null);
                            setAssignModalTab('available');
                          }}
                          className="p-3 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-emerald-500 rounded-lg cursor-pointer transition"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-semibold">{receiver.full_name}</p>
                              <p className="text-slate-400 text-xs">{receiver.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-emerald-400 font-bold text-sm">${receiver.amount}</p>
                              <p className="text-slate-400 text-xs">{receiver.package_name}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-8">No pending receivers</p>
                    )
                  )}

                  {/* Manual Matches Section in Available Tab */}
                  {manualMatches.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-700 space-y-2">
                      <p className="text-slate-300 text-sm font-semibold mb-3 text-amber-300">
                        📌 Already Matched Users:
                      </p>
                      {manualMatches
                        .filter(mm => 
                          showAssignModal.type === 'receiver' 
                            ? mm.role === 'giver' 
                            : mm.role === 'receiver'
                        )
                        .map((manualMatch) => (
                          <div
                            key={manualMatch.id}
                            className="p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-amber-100 font-semibold">{manualMatch.user_name || manualMatch.username}</p>
                                <p className="text-amber-200/70 text-xs">Matched with: {manualMatch.matched_with_name}</p>
                                {manualMatch.matched_with_email && (
                                  <p className="text-amber-200/70 text-xs">{manualMatch.matched_with_email}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-amber-300 font-bold text-sm">${manualMatch.amount}</p>
                                <p className="text-amber-200/70 text-xs capitalize">{manualMatch.status}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content: Create Manual Match */}
              {assignModalTab === 'manual' && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="text-purple-200 text-sm">
                      ✨ Create a manual match to integrate external matches into the system flow. This match will be processed automatically.
                    </p>
                  </div>

                  {/* Match Type Selection */}
                  <div>
                    <label className="text-slate-300 text-sm block mb-2 font-semibold">Who is being matched?</label>
                    <select
                      value={manualEntry.role}
                      onChange={(e) => setManualEntry({ ...manualEntry, role: e.target.value as 'receiver' | 'giver' })}
                      className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="receiver">Receiver (needs help)</option>
                      <option value="giver">Giver (provides help)</option>
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-slate-300 text-sm block mb-2 font-semibold">
                      Match Amount <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={manualEntry.amount}
                      onChange={(e) => {
                        setManualEntry({ ...manualEntry, amount: e.target.value });
                        setRequiredFieldErrors(prev => new Set([...prev].filter(f => f !== 'amount')));
                      }}
                      className={`w-full px-3 py-2 bg-slate-800 text-white rounded-lg border transition focus:outline-none ${
                        requiredFieldErrors.has('amount')
                          ? 'border-red-500 bg-red-950/20'
                          : 'border-slate-700 focus:border-purple-500'
                      }`}
                      placeholder="0.00"
                    />
                  </div>

                  {/* Counterparty Details */}
                  <div>
                    <p className="text-slate-300 text-sm font-semibold mb-2">
                      Matched {manualEntry.role === 'receiver' ? 'Giver' : 'Receiver'} Details
                    </p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={manualEntry.matchedWithName}
                        onChange={(e) => {
                          setManualEntry({ ...manualEntry, matchedWithName: e.target.value });
                          setRequiredFieldErrors(prev => new Set([...prev].filter(f => f !== 'matchedWithName')));
                        }}
                        className={`w-full px-3 py-2 bg-slate-800 text-white rounded-lg border transition focus:outline-none ${
                          requiredFieldErrors.has('matchedWithName')
                            ? 'border-red-500 bg-red-950/20'
                            : 'border-slate-700 focus:border-purple-500'
                        }`}
                        placeholder="Full name *"
                      />
                      <input
                        type="email"
                        value={manualEntry.matchedWithEmail}
                        onChange={(e) => setManualEntry({ ...manualEntry, matchedWithEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none"
                        placeholder="Email (optional)"
                      />
                      <input
                        type="tel"
                        value={manualEntry.matchedWithPhone}
                        onChange={(e) => setManualEntry({ ...manualEntry, matchedWithPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none"
                        placeholder="Phone (optional)"
                      />
                      <input
                        type="text"
                        value={manualEntry.paymentMethod}
                        onChange={(e) => setManualEntry({ ...manualEntry, paymentMethod: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none"
                        placeholder="Payment method (optional)"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setAssignModalTab('available');
                        setManualEntry({
                          username: '',
                          role: 'receiver',
                          amount: '',
                          matchedWithName: '',
                          matchedWithEmail: '',
                          matchedWithPhone: '',
                          paymentAccount: '',
                          paymentMethod: ''
                        });
                      }}
                      className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={async () => {
                        const errors = new Set<string>();
                        if (!manualEntry.amount) errors.add('amount');
                        if (!manualEntry.matchedWithName) errors.add('matchedWithName');
                        
                        setRequiredFieldErrors(errors);

                        if (errors.size > 0) {
                          setToast({ 
                            message: 'Please fill in match amount and counterparty name', 
                            type: 'error' 
                          });
                          return;
                        }

                        try {
                          await axios.post(
                            `${API_URL}/api/admin/create-manual-match`,
                            manualEntry,
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          setToast({ 
                            message: 'Manual match created successfully and integrated into the pool!', 
                            type: 'success' 
                          });
                          setShowAssignModal(null);
                          setAssignModalTab('available');
                          setManualEntry({
                            username: '',
                            role: 'receiver',
                            amount: '',
                            matchedWithName: '',
                            matchedWithEmail: '',
                            matchedWithPhone: '',
                            paymentAccount: '',
                            paymentMethod: ''
                          });
                          setRequiredFieldErrors(new Set());
                          await fetchData();
                        } catch (error: unknown) {
                          if (axios.isAxiosError(error)) {
                            const errorMsg = error.response?.data?.error || error.message || 'Failed to create manual match';
                            setToast({ message: errorMsg, type: 'error' });
                          } else {
                            setToast({ message: 'Failed to create manual match', type: 'error' });
                          }
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transition"
                    >
                      Create Match
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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

      {/* Manual Entry Modal */}
      {showManualEntryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900">
              <h3 className="text-white font-bold text-xl">Manual Payment Match Entry</h3>
              <button
                onClick={() => setShowManualEntryModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* User Selection - Simple */}
              <div>
                <h4 className="text-white font-semibold mb-3">Select User</h4>
                <div>
                  <label className="text-slate-300 text-sm block mb-2">
                    Username <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={manualEntry.username}
                    onChange={(e) => {
                      setManualEntry({ ...manualEntry, username: e.target.value });
                      setRequiredFieldErrors(prev => new Set([...prev].filter(f => f !== 'username')));
                    }}
                    className={`w-full px-3 py-2 bg-slate-800 text-white rounded-lg border transition focus:outline-none ${
                      requiredFieldErrors.has('username')
                        ? 'border-red-500 focus:border-red-600 bg-red-950/20'
                        : 'border-slate-700 focus:border-blue-500'
                    }`}
                    placeholder="Enter existing username"
                  />
                  <p className="text-slate-400 text-xs mt-2">💡 Enter an existing username. The user must already be registered.</p>
                </div>
              </div>

              {/* Match Details */}
              <div>
                <h4 className="text-white font-semibold mb-3">Match Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm block mb-2">User Role</label>
                    <select
                      value={manualEntry.role}
                      onChange={(e) => setManualEntry({ ...manualEntry, role: e.target.value as 'receiver' | 'giver' })}
                      className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="receiver">Receiver (Needs Help)</option>
                      <option value="giver">Giver (Provides Help)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm block mb-2">
                      Amount (USD) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={manualEntry.amount}
                      onChange={(e) => {
                        setManualEntry({ ...manualEntry, amount: e.target.value });
                        setRequiredFieldErrors(prev => new Set([...prev].filter(f => f !== 'amount')));
                      }}
                      className={`w-full px-3 py-2 bg-slate-800 text-white rounded-lg border transition focus:outline-none ${
                        requiredFieldErrors.has('amount')
                          ? 'border-red-500 focus:border-red-600 bg-red-950/20'
                          : 'border-slate-700 focus:border-blue-500'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Matched Counterparty Details */}
              <div>
                <h4 className="text-white font-semibold mb-3">Matched {manualEntry.role === 'receiver' ? 'Giver' : 'Receiver'} Details</h4>
                <p className="text-slate-300 text-xs mb-3 bg-slate-800/50 p-3 rounded">
                  📌 Enter at least the name of the person this user is matched with. Name is required.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm block mb-2">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={manualEntry.matchedWithName}
                      onChange={(e) => {
                        setManualEntry({ ...manualEntry, matchedWithName: e.target.value });
                        setRequiredFieldErrors(prev => new Set([...prev].filter(f => f !== 'matchedWithName')));
                      }}
                      className={`w-full px-3 py-2 bg-slate-800 text-white rounded-lg border transition focus:outline-none ${
                        requiredFieldErrors.has('matchedWithName')
                          ? 'border-red-500 focus:border-red-600 bg-red-950/20'
                          : 'border-slate-700 focus:border-blue-500'
                      }`}
                      placeholder="Matched user name"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm block mb-2">Email (Optional)</label>
                    <input
                      type="email"
                      value={manualEntry.matchedWithEmail}
                      onChange={(e) => setManualEntry({ ...manualEntry, matchedWithEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
                      placeholder="matched@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm block mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={manualEntry.matchedWithPhone}
                      onChange={(e) => setManualEntry({ ...manualEntry, matchedWithPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm block mb-2">Payment Account (Optional)</label>
                    <input
                      type="text"
                      value={manualEntry.paymentAccount}
                      onChange={(e) => setManualEntry({ ...manualEntry, paymentAccount: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
                      placeholder="Account number/details"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-slate-300 text-sm block mb-2">Payment Method (Optional)</label>
                  <input
                    type="text"
                    value={manualEntry.paymentMethod}
                    onChange={(e) => setManualEntry({ ...manualEntry, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., Bank Transfer, PayPal, etc."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowManualEntryModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualEntry}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transition"
                >
                  Create Manual Match
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
