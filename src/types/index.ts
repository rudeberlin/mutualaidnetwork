// Mutual Aid Network Types

// User Types
export interface IDDocument {
  frontImage: string; // Base64 or URL
  backImage: string;  // Base64 or URL
  uploadedAt: Date;
  verified: boolean;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  country: string;
  referralCode?: string;
  profilePhoto?: string;
  role?: 'admin' | 'member';
  idDocuments: IDDocument;
  isVerified: boolean;
  paymentMethodVerified: boolean;
  totalEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

// Package Types
export interface Package {
  id: string;
  name: string;
  amount: number; // USD
  returnPercentage: number;
  durationDays: number;
  description: string;
  icon?: string;
  image?: string; // Base64 or URL for replaceable package image
}

// Helper/Matched Member Types
export interface MatchedHelper {
  name: string;
  profileImage?: string; // Base64 or URL for replaceable helper image
  role?: string;
}

// Payment Method Types
export type PaymentMethod = 'MOBILE_MONEY' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'BTC';

export interface PaymentMethodConfig {
  type: PaymentMethod;
  details: string; // Masked or reference
  verified: boolean;
  addedAt: Date;
}

// Transaction Types
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'HELP_GIVEN' | 'HELP_RECEIVED';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  relatedMemberId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Help Request/Give Types
export interface HelpRecord {
  id: string;
  giverId: string;
  receiverId: string;
  packageId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  completedAt?: Date;
}

// Matched Member Info
export interface MatchedMember {
  id: string;
  name: string;
  paymentMethod: PaymentMethod;
  accountNumber: string; // Masked like ****1234
  amount: number;
}

// Authentication Types
export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Admin Types
export interface AdminVerification {
  id: string;
  userId: string;
  fullName: string;
  username: string;
  profilePhoto?: string;
  idType: 'ID Card' | "Driver's License";
  frontImage: string;
  backImage: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewer?: string;
  rejectionReason?: string;
}

export interface AdminHelpActivity {
  id: string;
  giverName: string;
  receiverName: string;
  packageName: string;
  amount: number;
  startDate: Date;
  dueDate: Date;
  status: 'Pending' | 'Active' | 'Completed' | 'Disputed';
}

export interface AdminPayment {
  id: string;
  userName: string;
  method: 'Mobile Money' | 'Bank' | 'BTC' | 'Card';
  maskedDetails: string;
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Flagged';
  submittedAt: Date;
}

export interface AdminTransaction {
  id: string;
  userName: string;
  type: 'Help Given' | 'Help Received';
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  date: Date;
}

export interface AdminPackage {
  id: string;
  name: string;
  amount: number;
  returnPercentage: number;
  durationDays: number;
  active: boolean;
}

export interface AdminReportPoint {
  label: string;
  value: number;
}

// Form Types
export interface RegistrationFormData {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  referralCode?: string;
  country: string;
  password: string;
  confirmPassword: string;
  idFrontImage?: File;
  idBackImage?: File;
}

// Verification Types
export interface VerificationStatus {
  idVerified: boolean;
  paymentMethodVerified: boolean;
  emailVerified: boolean;
}
