declare interface VirtualAccount {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

declare interface ReferralCode {
  id: string;
  code: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

declare interface Referral {
  id: string;
  referredUserName: string;
  referrerName: string;
  status: string; // could also enum if schema defines
}

declare interface Device {
  pushToken: string;
  model: string;
  osName: string;
  osVersion: string;
  lastUsed?: string;
}

declare interface Notification {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: string;
}

declare interface Complaint {
  id: string;
  subject: string;
  message: string;
  status: ComplaintStatus;
  createdAt: string;
}

declare interface VirtualAccount {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

declare interface ReferralCode {
  id: string;
  code: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

declare interface Referral {
  id: string;
  referredUserName: string;
  referrerName: string;
  status: string; // could also enum if schema defines
}

declare interface Device {
  pushToken: string;
  model: string;
  osName: string;
  osVersion: string;
  lastUsed?: string;
}

declare interface Notification {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: string;
}

declare interface Complaint {
  id: string;
  subject: string;
  message: string;
  status: ComplaintStatus;
  createdAt: string;
}

declare interface BaseTransaction {
  id: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  title: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  type?: "airtime" | "data" | "betting" | "examPin" | "electricity" | "tv";
}

declare interface AirtimeTransaction extends BaseTransaction {
  type: "airtime";
  network: string;
  phoneNumber: string;
  refundProcessed: boolean;
  requestId: string;
  responseData?: string;
  transactionId: string;
}

declare interface DataTransaction extends BaseTransaction {
  type: "data";
  network: string;
  packageName?: string;
  phoneNumber: string;
  plan: string;
  refundProcessed: boolean;
  requestId: string;
  responseData?: string;
  transactionId: string;
}

declare interface BettingTransaction extends BaseTransaction {
  type: "betting";
  bettingPlatform: string;
  accountNumber: string;
  transactionId: string;
}

declare interface ExamPinTransaction extends BaseTransaction {
  type: "examPin";
  examType: string;
  phoneNumber?: string;
  pin?: string;
  serialNumber?: string;
  Token?: string;
  transactionId: string;
}

declare interface ElectricityTransaction extends BaseTransaction {
  type: "electricity";
  provider: string;
  meterNumber: string;
  meterType: string;
  units?: string;
  token?: string;
  transactionId: string;
}

declare interface TvSubscriptionTransaction extends BaseTransaction {
  type: "tv";
  provider: string;
  smartcardNumber: string;
  package: string;
  isRenewal: boolean;
  refundProcessed: boolean;
  transactionId: string;
}

declare type Transaction =
  | AirtimeTransaction
  | DataTransaction
  | BettingTransaction
  | ExamPinTransaction
  | ElectricityTransaction
  | TvSubscriptionTransaction;

declare interface PaymentHistory extends BaseTransaction {
  type: TransactionType.PAYMENT;
  method: string;
  reference: string;
}

declare interface Refund extends BaseTransaction {
  type: TransactionType.REFUND;
  reason: string;
}

declare interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bvn: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  walletBalance: number;
  referralPoints: number;
  role: UserRole;

  // Security (optional in admin view)
  refreshToken?: string;

  // Relations
  virtualAccounts: VirtualAccount[];
  referralCodes: ReferralCode[];
  referralsAsReferrer: Referral[];
  referralsAsReferred: Referral[];
  devices: Device[];
  notifications: Notification[];
  complaints: Complaint[];

  // Transactions
  airtimeTransactions: AirtimeTransaction[];
  dataTransactions: DataTransaction[];
  bettingTransactions: BettingTransaction[];
  examPinTransactions: ExamPinTransaction[];
  electricityTransactions: ElectricityTransaction[];
  tvSubscriptionTransaction: TvSubscriptionTransaction[];
  paymentHistory: PaymentHistory[];
  refunds: Refund[];
}

declare interface OverviewType {
  totalUsers: number;
  totalDeposit: number;
  totalNoOfTransaction: number;
  transactions: BaseTransaction[];
}
