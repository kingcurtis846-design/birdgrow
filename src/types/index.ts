export type KycStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type UserRole = 'user' | 'admin';
export type PlanStatus = 'active' | 'archived';
export type InvestmentStatus = 'pending' | 'active' | 'matured' | 'cancelled';
export type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'payout';
export type TransactionStatus = 'pending' | 'successful' | 'failed' | 'cancelled' | 'partial';
export type PaymentGateway = 'crypto' | 'sepa' | 'stripe' | 'internal';
export type CycleStage = 'planning' | 'chick_placement' | 'growth' | 'finishing' | 'harvest' | 'completed' | 'construction' | 'commissioning';
export type Language = 'en' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'nl' | 'pl' | 'ja';
export type Currency = 'GBP' | 'EUR' | 'USD'| 'JPY';
export type CryptoCoin = 'BTC' | 'ETH' | 'USDT' | 'USDC';

export interface AdminNotification {
  id: string;
  type:
    | 'withdrawal_request'
    | 'kyc_submission'
    | 'investment_created'
    | 'deposit_received'
    | 'human_support_inquiry'
    | 'deposit_confirmation_request'
    | 'review_submission'
    | 'bug_report'
    | 'withdrawal_declined'
    | 'withdrawal_partial';
  title: string;
  message: string;
  amount?: number;
  userId?: string;
  userName: string;
  timestamp: string;
  read: boolean;
  metadata?: Record<string, any>;
}

export interface KycData {
  legalName?: string;
  address?: string;
  country?: string;
  city?: string;
  phoneNumber?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  country_code: string;
  kyc_status: KycStatus;
  kyc_data: KycData;
  role: UserRole;
  password?: string;
  created_at: string;
  updated_at?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  main_balance: number;
  earnings_balance: number;
  locked_investment_balance: number;
  created_at: string;
  updated_at: string;
}

export interface InvestmentPlan {
  id: string;
  title: string;
  min_amount: number;
  max_amount: number;
  duration_days: number;
  roi_percentage: number;
  risk_rating: 'A+' | 'A' | 'A-' | 'B+';
  status: PlanStatus;
  description: string;
  features: string[];
  poultry_breed: string;
  esg_score: number; // e.g. 94/100
}

export interface PoultryCycle {
  id: string;
  cycle_code: string;
  facility_name: string;
  facility_location: string;
  country: string;
  total_birds: number;
  current_stage: CycleStage;
  start_date: string;
  expected_completion_date: string;
  certified_organic: boolean;
  breed: string;
  feed_type: string;
  image_url: string;
  current_weight_kg?: number;
  mortality_rate?: number;
  category: 'layers_eggs' | 'broilers' | 'dual_layers_broilers';
  production_type: string;
  daily_egg_capacity?: number;
  solar_power_kw?: number;
  egg_type?: string;
  is_opening_soon?: boolean;
  construction_progress?: number; // 0 to 100 for Alaska
  layers_count?: number;
  broilers_count?: number;
  layer_breed?: string;
  broiler_breed?: string;
  breeds?: string[];
  has_layers?: boolean;
  has_broilers?: boolean;
}

export interface Investment {
  id: string;
  user_id: string;
  plan_id: string;
  plan_title: string;
  principal_amount: number;
  expected_roi_amount: number;
  total_payout: number;
  start_date: string;
  maturity_date: string;
  cycle_id: string;
  cycle_code: string;
  facility_location: string;
  status: InvestmentStatus;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  reference: string;
  payment_gateway: PaymentGateway;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface FarmUpdate {
  id: string;
  cycle_id: string;
  cycle_code?: string;
  title: string;
  description: string;
  week_number: number;
  average_weight_kg: number;
  feed_efficiency: number; // Feed Conversion Ratio e.g. 1.58
  mortality_rate: number; // e.g. 0.8%
  health_status: string;
  image_url?: string;
  created_at: string;
}

export interface PayoutAccount {
  id: string;
  user_id: string;
  bank_name: string;
  iban: string;
  bic_swift: string;
  account_holder_name: string;
  is_verified: boolean;
  created_at: string;
}

export interface FeePurseEntry {
  id: string;
  txId: string;
  txRef: string;
  userId: string;
  userName: string;
  grossAmount: number;
  feePercentage: number;
  feeAmount: number;
  netPayoutAmount: number;
  payoutType: 'full' | 'partial';
  capitalPairingCategory?: string;
  createdAt: string;
}

export interface AdminFeePurse {
  totalAccumulatedBalance: number;
  totalFeesCollectedCount: number;
  entries: FeePurseEntry[];
  lastUpdated: string;
}

export interface SystemSettings {
  stripeMode: 'test' | 'live';
  stripePublicKey: string;
  stripeSecretKey: string;
  sepaCreditorId: string;
  sepaIban: string;
  sepaBic: string;
  platformFeePercentage: number;
  minimumWithdrawal: number;
  autoApproveDepositsUnder: number;
  regulatoryJurisdiction: string;
  adminEmail: string;
  cryptoAddresses: {
    BTC: string;
    ETH: string;
    USDT: string;
    USDT_ERC20: string;
    USDC: string;
  };
}

export type ChatSenderRole = 'investor' | 'admin' | 'bot';

export interface InvestorMember {
  id: string;
  name: string;
  avatar: string;
  country: string;
  countryCode: string;
  role: ChatSenderRole;
  badge?: string;
  investedAmount?: number;
  activePlanTitle?: string;
  onlineStatus: 'online' | 'away' | 'offline';
  lastSeen?: string;
  bio?: string;
  isAiBot?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: ChatSenderRole;
  senderAvatar?: string;
  senderCountry?: string;
  senderBadge?: string;
  senderInvestedAmount?: number;
  senderPlanTitle?: string;
  content: string;
  timestamp: string; // ISO string
  type: 'group' | 'direct';
  recipientId?: string; // only for direct messages
  isAiBot?: boolean;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
}

export interface TestimonialReview {
  id: string;
  name: string;
  role: string;
  city: string;
  portfolio: string;
  quote: string;
  yieldAchieved: string; // Automatically labeled under investment option (e.g. "+84.00% net ROI on Free-Range 21d")
  plan_title?: string;
  rating: number; // 1 to 5
  language?: string;
  verified: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  user_id?: string;
  user_email?: string;
  created_at: string;
}

export interface AccountEvent {
  id: string;
  timestamp: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'payout';
  title: string;
  description: string;
  amount: number;
  amountDirection: 'inflow' | 'outflow' | 'neutral';
  status: 'successful' | 'pending' | 'failed' | 'completed' | 'partial';
  reference: string;
  planTitle?: string;
  cycleCode?: string;
  facilityLocation?: string;
  gateway?: PaymentGateway;
  details?: Record<string, any>;
}

export interface HumanSupportInquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'in_progress' | 'resolved';
  adminNotes?: string;
  emailDispatchedTo: string;
  reply?: string;
  repliedAt?: string;
  messages?: {
    id: string;
    sender: 'user' | 'admin' | 'support';
    text: string;
    timestamp: string;
  }[];
}

export interface EmailNotificationRecord {
  id: string;
  type:
    | 'investment_matured'
    | 'review_approved'
    | 'deposit_confirmed'
    | 'withdrawal_declined'
    | 'withdrawal_partial'
    | 'general';
  recipientEmail: string;
  recipientName: string;
  subject: string;
  previewText: string;
  htmlBody: string;
  textBody: string;
  metadata?: {
    investmentId?: string;
    planTitle?: string;
    principalAmount?: number;
    profitAmount?: number;
    totalPayout?: number;
    reviewId?: string;
    rating?: number;
    quote?: string;
    txRef?: string;
    errorMessage?: string;
    issues?: string[];
    requestedAmount?: number;
    partialAmount?: number;
    remainingAmount?: number;
    partialMessage?: string;
    capitalPairingCategory?: string;
  };
  sentAt: string;
  status: 'delivered' | 'sent';
}

export interface BugReport {
  id: string;
  reporterName: string;
  reporterEmail: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  pageUrl?: string;
  stepsToReproduce?: string;
  status: 'open' | 'investigating' | 'resolved';
  timestamp: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export * from './referral';


