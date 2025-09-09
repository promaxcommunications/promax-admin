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
  status: TransactionStatus;
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
  status: TransactionStatus;
  createdAt: string;
}

declare interface AirtimeTransaction extends BaseTransaction {
  type: TransactionType.AIRTIME;
  phoneNumber: string;
  provider: string;
}

declare interface DataTransaction extends BaseTransaction {
  type: TransactionType.DATA;
  phoneNumber: string;
  plan: string;
  provider: string;
}

declare interface BettingTransaction extends BaseTransaction {
  type: TransactionType.BETTING;
  provider: string;
  customerId: string;
}

declare interface ExamPinTransaction extends BaseTransaction {
  type: TransactionType.EXAM_PIN;
  examType: string;
  pin: string;
}

declare interface ElectricityTransaction extends BaseTransaction {
  type: TransactionType.ELECTRICITY;
  meterNumber: string;
  provider: string;
}

declare interface TvSubscriptionTransaction extends BaseTransaction {
  type: TransactionType.TV_SUBSCRIPTION;
  provider: string;
  smartCardNumber: string;
}

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
