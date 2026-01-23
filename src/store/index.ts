import { create } from 'zustand';
import type { 
  User, 
  Transaction, 
  PaymentMethodConfig,
  MatchedMember
} from '../types';

// Auth Store
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => set({ token }),
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

// Transaction Store
interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  getTransactions: () => Transaction[];
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions].slice(0, 50) })),
  getTransactions: () => get().transactions,
}));

// Payment Method Store
interface PaymentStore {
  paymentMethod: PaymentMethodConfig | null;
  setPaymentMethod: (method: PaymentMethodConfig) => void;
  clearPaymentMethod: () => void;
  isPaymentMethodVerified: () => boolean;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  paymentMethod: null,
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  clearPaymentMethod: () => set({ paymentMethod: null }),
  isPaymentMethodVerified: () => !!get().paymentMethod?.verified,
}));

// Help Record Store
interface HelpStore {
  matchedMember: MatchedMember | null;
  setMatchedMember: (member: MatchedMember) => void;
  clearMatchedMember: () => void;
}

export const useHelpStore = create<HelpStore>((set) => ({
  matchedMember: null,
  setMatchedMember: (member) => set({ matchedMember: member }),
  clearMatchedMember: () => set({ matchedMember: null }),
}));

// UI Store
interface UIStore {
  showPaymentMethodModal: boolean;
  showMatchedMemberModal: boolean;
  isSidebarOpen: boolean;
  setShowPaymentMethodModal: (show: boolean) => void;
  setShowMatchedMemberModal: (show: boolean) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  showPaymentMethodModal: false,
  showMatchedMemberModal: false,
  isSidebarOpen: false,
  setShowPaymentMethodModal: (show) => set({ showPaymentMethodModal: show }),
  setShowMatchedMemberModal: (show) => set({ showMatchedMemberModal: show }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
}));

