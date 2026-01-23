import { format, differenceInDays } from 'date-fns';

// Currency formatting (USD)
export const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Date formatting
export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

export const formatDateWithTime = (date: Date): string => {
  return format(date, 'MMM dd, yyyy hh:mm a');
};

// Financial calculations
export const calculateReturn = (amount: number, returnPercentage: number): number => {
  return (amount * returnPercentage) / 100;
};

export const calculateTotalReturn = (
  amount: number,
  returnPercentage: number
): number => {
  return amount + calculateReturn(amount, returnPercentage);
};

export const calculateProgress = (startDate: Date, dueDate: Date): number => {
  const now = new Date();
  const totalDays = differenceInDays(dueDate, startDate);
  const elapsedDays = differenceInDays(now, startDate);
  return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
};

export const getDaysRemaining = (dueDate: Date): number => {
  const now = new Date();
  return Math.max(differenceInDays(dueDate, now), 0);
};

// Validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePhoneNumber = (phone: string): boolean => {
  return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}/.test(phone);
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(username);
};

// Masking functions (for display)
export const maskPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;
  return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
};

export const maskAccountNumber = (accountNumber: string): string => {
  if (accountNumber.length <= 4) return accountNumber;
  return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
};

export const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  if (name.length <= 2) return email;
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1] + '@' + domain;
};

// Utility functions
export const generateUserId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateTransactionId = (): string => {
  return `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Package helper
export const getPackageColor = (packageName: string): string => {
  const colors: Record<string, string> = {
    Basic: 'from-blue-400 to-blue-600',
    Bronze: 'from-amber-400 to-amber-600',
    Silver: 'from-slate-400 to-slate-600',
    Gold: 'from-yellow-400 to-yellow-600',
  };
  return colors[packageName] || 'from-blue-500 to-indigo-600';
};

// API error handler
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
