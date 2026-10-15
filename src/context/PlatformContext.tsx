import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';
import {
  Profile,
  Wallet,
  InvestmentPlan,
  PoultryCycle,
  Investment,
  Transaction,
  FarmUpdate,
  PayoutAccount,
  SystemSettings,
  KycData,
  CycleStage,
  PaymentGateway,
  Language,
  Currency,
  CryptoCoin,
  AdminNotification,
  ChatMessage,
  InvestorMember,
  TestimonialReview,
  HumanSupportInquiry,
  UserRole,
  KycStatus,
  EmailNotificationRecord,
  BugReport,
  FeePurseEntry,
  AdminFeePurse,
} from '../types';
import {
  ReferralRelationship,
  ReferralQualifiedInvestment,
  ReferralMilestoneReward,
  ReferralUserSummary,
} from '../types/referral';
import {
  INITIAL_REFERRAL_RELATIONSHIPS,
  INITIAL_QUALIFIED_INVESTMENTS,
  INITIAL_MILESTONE_REWARDS,
} from '../lib/referralMockData';
import {
  calculateReferralUserSummary,
  evaluateNewMilestoneAwards,
  generateReferralCode,
  isUserInvestorReferrer,
  formatReferralCurrency,
} from '../lib/referralEngine';
import {
  getEmailDispatches,
  saveEmailDispatch,
  buildInvestmentMaturedEmail,
  buildReviewApprovedEmail,
  buildWithdrawalDeclinedEmail,
  buildWithdrawalPartialEmail,
} from '../lib/emailService';
import {
  INITIAL_PROFILES,
  INITIAL_WALLETS,
  INITIAL_PLANS,
  INITIAL_CYCLES,
  INITIAL_FARM_UPDATES,
  INITIAL_INVESTMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_PAYOUT_ACCOUNTS,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_ADMIN_NOTIFICATIONS,
  FACILITY_UNIQUE_IMAGES,
  INITIAL_TESTIMONIALS,
  INITIAL_BUG_REPORTS,
  INITIAL_FEE_PURSE,
} from '../lib/mockData';
import {
  INITIAL_CHAT_MEMBERS,
  getSeedGroupMessages,
  getSeedDirectMessages,
  generateAgriBotReply,
  generateInvestorReply,
} from '../lib/chatSeed';
import { translations, Translations } from '../lib/i18n';
import {
  setActiveCurrency,
  getActiveCurrency,
  formatCurrency,
  formatCurrencyCompact,
  formatRawCurrency,
  CURRENCY_SYMBOLS,
  MOCK_EXCHANGE_RATES,
  convertGbpAmount,
  convertToGbp,
} from '../lib/formatters';

const formatNaira = formatReferralCurrency;

export interface HumanChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

interface PlatformContextType {
  // Multi-language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  // Review Language Filtering
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  languageCounts: {
    all: number;
    zh: number;
    fr: number;
    es: number;
    hi: number;
    en: number;
  };

  // Multi-currency Switcher
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  exchangeRates: Record<Currency, number>;
  convertAmount: (amountInGbp: number) => number;
  convertToGbpAmount: (amountInCurrency: number) => number;
  formatCurrentCurrency: (amountInGbp: number, showCents?: boolean) => string;
  formatRawCurrency: (amountInActiveCurrency: number, showCents?: boolean) => string;
  formatCurrentCurrencyCompact: (amountInGbp: number) => string;
  currencySymbol: string;

  // Auth state
  currentUser: Profile | null;
  currentWallet: Wallet | null;
  currentPayoutAccount: PayoutAccount | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginAsInvestor: () => void;
  loginAsAdmin: () => void;
  login: (email: string, role?: 'user' | 'admin', password?: string) => boolean;
  register: (fullName: string, email: string, password: string, countryCode: string, referrerCode?: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  logout: () => void;
  adminCredentials: { email: string; password: string };
  updateAdminCredentials: (newEmail: string, newPassword: string) => { success: boolean; message: string };
  verifyAdminLogin: (email: string, password: string) => boolean;

  // Platform Data
  profiles: Profile[];
  wallets: Record<string, Wallet>;
  plans: InvestmentPlan[];
  cycles: PoultryCycle[];
  investments: Investment[];
  transactions: Transaction[];
  farmUpdates: FarmUpdate[];
  settings: SystemSettings;
  adminNotifications: AdminNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Investor Operations
  deposit: (amount: number, gateway: PaymentGateway, metadata?: any, isAmountInActiveCurrency?: boolean) => Promise<{ success: boolean; reference: string; message?: string }>;
  requestWithdrawal: (
    amount: number,
    destination: {
      type: 'crypto' | 'bank';
      cryptoCoin?: CryptoCoin;
      network?: string;
      walletAddress?: string;
      iban?: string;
      bic?: string;
      bankName?: string;
      accountHolder?: string;
    },
    isAmountInActiveCurrency?: boolean
  ) => Promise<{ success: boolean; message?: string }>;
  executeInvestment: (planId: string, amount: number, isAmountInActiveCurrency?: boolean) => Promise<{ success: boolean; investmentId?: string; message?: string }>;
  submitKyc: (kycData: KycData) => Promise<{ success: boolean; message?: string }>;
  savePayoutAccount: (account: Omit<PayoutAccount, 'id' | 'user_id' | 'created_at'>) => void;

  // Admin Operations
  confirmDeposit: (txId: string) => Promise<{ success: boolean; message: string }>;
  denyDeposit: (txId: string, reason?: string) => Promise<{ success: boolean; message: string }>;
  reviewKyc: (userId: string, approved: boolean, reason?: string) => void;
  updateTransactionStatus: (txId: string, status: 'successful' | 'failed' | 'cancelled' | 'partial') => void;
  approveFullWithdrawal: (
    txId: string,
    options?: { note?: string; capitalPairingCategory?: string }
  ) => Promise<{ success: boolean; message: string }>;
  declineWithdrawal: (
    txId: string,
    options: { errorMessage: string; issues: string[]; refundToWallet?: boolean }
  ) => Promise<{ success: boolean; message: string }>;
  partialPayoutWithdrawal: (
    txId: string,
    options: {
      payoutAmount: number;
      explanationMessage: string;
      refundRemainingToWallet?: boolean;
      capitalPairingCategory?: string;
    }
  ) => Promise<{ success: boolean; message: string }>;
  adminFeePurse: AdminFeePurse;
  sweepFeePurse: (amount?: number, destinationAddress?: string) => Promise<{ success: boolean; message: string }>;
  createPlan: (plan: Omit<InvestmentPlan, 'id'>) => void;
  updatePlan: (plan: InvestmentPlan) => void;
  archivePlan: (planId: string) => void;
  updateCycleStage: (cycleId: string, stage: CycleStage, currentWeight?: number, mortality?: number) => void;
  addNewFarm: (farmData: Partial<PoultryCycle>) => void;
  updateAlaskaProgress: (progress: number) => void;
  adjustUserBalance: (
    userId: string,
    amount: number,
    balanceType: 'main' | 'earnings',
    reason?: string
  ) => Promise<{ success: boolean; message: string }>;
  updateUserDirectBalances: (
    userId: string,
    balances: { main_balance?: number; earnings_balance?: number },
    confirmationReason?: string
  ) => Promise<{ success: boolean; message: string }>;
  addFarmUpdate: (update: Omit<FarmUpdate, 'id' | 'created_at'>) => void;
  triggerMaturityPayout: (investmentId: string) => Promise<{ success: boolean; message?: string }>;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  simulateWebhookEvent: (gateway: 'stripe' | 'sepa' | 'crypto', eventType: string, amount: number) => { success: boolean; log: string };

  // Global Financial Statistics
  totalTvl: number;
  totalPayoutsIssued: number;
  activeInvestorCount: number;

  // Investor Community Chat & Chatbot
  chatMembers: InvestorMember[];
  groupChatMessages: ChatMessage[];
  visibleGroupMessages: ChatMessage[];
  directChatMessages: Record<string, ChatMessage[]>;
  isChatOpen: boolean;
  activeChatTab: 'group' | 'direct' | 'bot';
  selectedDirectMemberId: string | null;
  unreadDirectCount: number;
  openChat: (tab?: 'group' | 'direct' | 'bot', directMemberId?: string) => void;
  closeChat: () => void;
  setActiveChatTab: (tab: 'group' | 'direct' | 'bot') => void;
  setSelectedDirectMemberId: (memberId: string | null) => void;
  sendGroupMessage: (content: string, replyTo?: ChatMessage['replyTo']) => void;
  sendDirectMessage: (recipientId: string, content: string) => void;

  // Investor Reviews
  reviews: TestimonialReview[];
  hasInvested: boolean;
  hasWithdrawnProfit: boolean;
  userEligiblePlansForReview: InvestmentPlan[];
  submitReview: (reviewData: {
    quote: string;
    rating: number;
    planId?: string;
    role?: string;
    city?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  approveReview: (reviewId: string) => void;
  rejectReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;

  // Live Human Support
  humanInquiries: HumanSupportInquiry[];
  humanChatMessages: HumanChatMessage[];
  isHumanTyping: boolean;
  sendHumanSupportChatMessage: (text: string) => Promise<void>;
  submitHumanSupportInquiry: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => Promise<{ success: boolean; message: string; ticketId: string }>;
  replyHumanSupportInquiry: (inquiryId: string, reply: string) => void;

  // Admin User Management
  addUser: (userData: {
    full_name: string;
    email: string;
    country_code: string;
    initial_balance: number;
    role?: UserRole;
    kyc_status?: KycStatus;
  }) => Promise<{ success: boolean; message: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; message: string }>;

  // Automated Email Notification Dispatches
  emailDispatches: EmailNotificationRecord[];
  dispatchEmail: (record: EmailNotificationRecord) => void;

  // Referral Rewards System
  referralRelationships: ReferralRelationship[];
  qualifiedInvestments: ReferralQualifiedInvestment[];
  milestoneRewards: ReferralMilestoneReward[];
  userReferralSummary: ReferralUserSummary | null;
  addReferralRelationship: (referrerCode: string, referredUserId: string) => { success: boolean; message: string };
  claimReferralReward: (rewardId: string) => Promise<{ success: boolean; message: string }>;
  qualifyReferralInvestment: (investmentId: string) => { success: boolean; message: string };
  reverseReferralInvestment: (investmentId: string) => { success: boolean; message: string };
  adminPayMilestoneReward: (rewardId: string) => { success: boolean; message: string };
  adminReverseMilestoneReward: (rewardId: string) => { success: boolean; message: string };
  simulateReferralInvestment: (amount: number, referredName?: string) => { success: boolean; message: string };

  // Bug & Issue Reporting System
  bugReports: BugReport[];
  submitBugReport: (data: {
    name: string;
    email: string;
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    pageUrl?: string;
    stepsToReproduce?: string;
  }) => Promise<{ success: boolean; message: string; ticketId: string }>;
  updateBugReportStatus: (bugId: string, status: 'open' | 'investigating' | 'resolved', notes?: string) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

const STORAGE_PREFIX = 'birdgrow_v2_';

export type SupportedLanguage = 'zh' | 'fr' | 'es' | 'hi' | 'en';

export function normalizeReviewLanguage(lang?: string): SupportedLanguage {
  if (!lang || !lang.trim()) return 'en';
  const clean = lang.trim().toLowerCase();
  if (clean === 'zh' || clean === 'fr' || clean === 'es' || clean === 'hi') {
    return clean;
  }
  return 'en';
}

export function detectLanguageFromText(text: string): SupportedLanguage {
  if (!text || text.trim().length === 0) return 'en';
  if (/[\u4e00-\u9fa5]/.test(text)) return 'zh';
  if (/[\u0900-\u097f]/.test(text)) return 'hi';
  if (/[ñ¿¡]/i.test(text)) return 'es';
  if (/[çœæ]/i.test(text)) return 'fr';

  const spanishKeywords = /\b(el|la|los|las|de|del|en|un|una|por|para|con|que|cosecha|inversión|rendimiento|avícola|retorno|granja|cartera|ganado|pollo|huevos|agrícola)\b/gi;
  const spanishMatches = (text.match(spanishKeywords) || []).length;

  const frenchKeywords = /\b(le|la|les|des|du|dans|pour|avec|que|agronome|récolte|rendement|avicole|investisseur|poulet|œufs|filière|gestionnaire|agricole)\b/gi;
  const frenchMatches = (text.match(frenchKeywords) || []).length;

  if (/[áíóú]/.test(text) && spanishMatches >= frenchMatches) return 'es';
  if (/[èêëàâîïôùû]/.test(text) && frenchMatches >= spanishMatches) return 'fr';
  if (spanishMatches > frenchMatches && spanishMatches >= 2) return 'es';
  if (frenchMatches > spanishMatches && frenchMatches >= 2) return 'fr';

  return 'en';
}

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'language') as Language;
    return saved && ['en', 'de', 'fr', 'es'].includes(saved) ? saved : 'en';
  });

  // Review Language Filtering State
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_PREFIX + 'language', lang);
  };

  const t = translations[language] || translations.en;

  // Multi-currency Switcher State
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'currency') as Currency;
    return saved && ['EUR', 'USD', 'GBP', 'JPY'].includes(saved) ? saved : 'EUR';
  });

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    setActiveCurrency(curr);
    localStorage.setItem(STORAGE_PREFIX + 'currency', curr);
  };

  useEffect(() => {
    setActiveCurrency(currency);
  }, [currency]);

  const exchangeRates = MOCK_EXCHANGE_RATES;

  const convertAmount = (amountInGbp: number): number => {
    return convertGbpAmount(amountInGbp, currency);
  };

  const convertToGbpAmount = (amountInCurrency: number): number => {
    return convertToGbp(amountInCurrency, currency);
  };

  const formatCurrentCurrency = (amountInGbp: number, showCents: boolean = true): string => {
    return formatCurrency(amountInGbp, currency, showCents, language);
  };

  const formatCurrentRawCurrency = (amountInActiveCurrency: number, showCents: boolean = true): string => {
    return formatRawCurrency(amountInActiveCurrency, currency, showCents, language);
  };

  const formatCurrentCurrencyCompact = (amountInGbp: number): string => {
    return formatCurrencyCompact(amountInGbp, currency, language);
  };

  const currencySymbol = CURRENCY_SYMBOLS[currency] || '€';

  // Local storage initializers
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const [wallets, setWallets] = useState<Record<string, Wallet>>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'wallets');
    return saved ? JSON.parse(saved) : INITIAL_WALLETS;
  });

  const [plans, setPlans] = useState<InvestmentPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'plans');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          return parsed.map((p: InvestmentPlan) => {
            if (p.id === 'plan-15d-50pct') return { ...p, max_amount: 4999 };
            if (p.id === 'plan-30d-150pct') return { ...p, max_amount: 99999 };
            return p;
          });
        }
      } catch (e) {}
    }
    return INITIAL_PLANS;
  });

  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      setProfiles((prevProfiles) =>
        prevProfiles.map((p) =>
          p.email.toLowerCase() === normalizedEmail
            ? { ...p, password: newPassword, updated_at: new Date().toISOString() }
            : p
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  };

  const [cycles, setCycles] = useState<PoultryCycle[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'cycles');
    let loaded = INITIAL_CYCLES;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          loaded = parsed;
        }
      } catch (e) {}
    }
    return loaded.map((c) => ({
      ...c,
      image_url: FACILITY_UNIQUE_IMAGES[c.id] || c.image_url,
    }));
  });

  const isWithin24Hours = (timestamp: string): boolean => {
    return Date.now() - new Date(timestamp).getTime() <= 24 * 60 * 60 * 1000;
  };

  const [chatMembers] = useState<InvestorMember[]>(INITIAL_CHAT_MEMBERS);

  const [groupChatMessages, setGroupChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'group_chat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const fresh = parsed.filter((m: ChatMessage) => isWithin24Hours(m.timestamp));
          if (fresh.length >= 3) return fresh;
        }
      } catch (e) {}
    }
    return getSeedGroupMessages();
  });

  const [directChatMessages, setDirectChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'direct_chat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) {}
    }
    return getSeedDirectMessages();
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState<'group' | 'direct' | 'bot'>('group');
  const [selectedDirectMemberId, setSelectedDirectMemberId] = useState<string | null>(null);
  const [hasViewedDirect, setHasViewedDirect] = useState(false);
  const unreadDirectCount = hasViewedDirect ? 0 : 1;

  const visibleGroupMessages = groupChatMessages.filter((m) => isWithin24Hours(m.timestamp));

  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'investments');
    return saved ? JSON.parse(saved) : INITIAL_INVESTMENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [farmUpdates, setFarmUpdates] = useState<FarmUpdate[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'farm_updates');
    return saved ? JSON.parse(saved) : INITIAL_FARM_UPDATES;
  });

  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'payout_accounts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUT_ACCOUNTS;
  });

  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'admin_notifications');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'settings');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_SETTINGS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'current_user_id');
    return saved || null;
  });

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_PREFIX + 'current_user_id', currentUserId);
    } else {
      localStorage.removeItem(STORAGE_PREFIX + 'current_user_id');
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'profiles', JSON.stringify(profiles));
  }, [profiles]);

  // Real-time Firestore sync for profiles/users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'profiles'), (snapshot) => {
      if (!snapshot.empty) {
        const liveProfiles = snapshot.docs.map((doc) => doc.data() as Profile);
        setProfiles((prev) => {
          const map = new Map();
          [...prev, ...liveProfiles].forEach((p) => map.set(p.id, p));
          return Array.from(map.values());
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'cycles', JSON.stringify(cycles));
  }, [cycles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'farm_updates', JSON.stringify(farmUpdates));
  }, [farmUpdates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'payout_accounts', JSON.stringify(payoutAccounts));
  }, [payoutAccounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'admin_notifications', JSON.stringify(adminNotifications));
  }, [adminNotifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(settings));
  }, [settings]);

  const [adminFeePurse, setAdminFeePurse] = useState<AdminFeePurse>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'fee_purse_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.totalAccumulatedBalance === 'number') return parsed;
      } catch (e) {}
    }
    return INITIAL_FEE_PURSE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'fee_purse_v1', JSON.stringify(adminFeePurse));
  }, [adminFeePurse]);

  const recordFeePurseDeduction = (entry: Omit<FeePurseEntry, 'id' | 'createdAt'>) => {
    const newEntry: FeePurseEntry = {
      ...entry,
      id: `fee-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };
    setAdminFeePurse((prev) => ({
      totalAccumulatedBalance: Math.round((prev.totalAccumulatedBalance + entry.feeAmount) * 100) / 100,
      totalFeesCollectedCount: prev.totalFeesCollectedCount + 1,
      entries: [newEntry, ...prev.entries],
      lastUpdated: new Date().toISOString(),
    }));
  };

  // Bug & Issue Reports State
  const [bugReports, setBugReports] = useState<BugReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'bug_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_BUG_REPORTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'bug_reports', JSON.stringify(bugReports));
  }, [bugReports]);

  const [reviews, setReviews] = useState<TestimonialReview[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r: TestimonialReview) => ({
            ...r,
            status: r.status || 'approved',
          }));
        }
      } catch (e) {}
    }
    return INITIAL_TESTIMONIALS.map((r) => ({
      ...r,
      status: r.status || 'approved',
    }));
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Normalized language counts: 'en', 'EN', undefined, or null correctly count towards English (en)
  const languageCounts = useMemo(() => {
    let zh = 0;
    let fr = 0;
    let es = 0;
    let hi = 0;
    let en = 0;

    reviews.forEach((r) => {
      const normalized = normalizeReviewLanguage(r.language);
      if (normalized === 'zh') zh++;
      else if (normalized === 'fr') fr++;
      else if (normalized === 'es') es++;
      else if (normalized === 'hi') hi++;
      else en++;
    });

    return {
      all: reviews.length,
      zh,
      fr,
      es,
      hi,
      en,
    };
  }, [reviews]);

  const [emailDispatches, setEmailDispatches] = useState<EmailNotificationRecord[]>(() => {
    const list = getEmailDispatches();
    if (list.length > 0) return list;
    const seed1 = buildInvestmentMaturedEmail({
      recipientName: 'Curtis Vance',
      recipientEmail: 'curtis.investor@birdgrow.eu',
      planTitle: 'Starter Plan (15 Days · 50% ROI)',
      principalAmount: 500,
      profitAmount: 250,
      totalPayout: 750,
      investmentId: 'inv-seed-01',
      txRef: 'PAY-AUTO-20260915-849102',
    });
    saveEmailDispatch(seed1);
    return [seed1];
  });

  const dispatchEmail = (record: EmailNotificationRecord) => {
    saveEmailDispatch(record);
    setEmailDispatches((prev) => [record, ...prev]);
  };

  const [referralRelationships, setReferralRelationships] = useState<ReferralRelationship[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'referral_relationships_eur_v2');
    return saved ? JSON.parse(saved) : INITIAL_REFERRAL_RELATIONSHIPS;
  });

  const [qualifiedInvestments, setQualifiedInvestments] = useState<ReferralQualifiedInvestment[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'qualified_investments_eur_v2');
    return saved ? JSON.parse(saved) : INITIAL_QUALIFIED_INVESTMENTS;
  });

  const [milestoneRewards, setMilestoneRewards] = useState<ReferralMilestoneReward[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'milestone_rewards_eur_v2');
    return saved ? JSON.parse(saved) : INITIAL_MILESTONE_REWARDS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'referral_relationships_eur_v2', JSON.stringify(referralRelationships));
  }, [referralRelationships]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'qualified_investments_eur_v2', JSON.stringify(qualifiedInvestments));
  }, [qualifiedInvestments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'milestone_rewards_eur_v2', JSON.stringify(milestoneRewards));
  }, [milestoneRewards]);

  const currentUser = profiles.find((p) => p.user_id === currentUserId) || null;
  const currentWallet = currentUser ? wallets[currentUser.user_id] || null : null;
  const currentPayoutAccount = currentUser
    ? payoutAccounts.find((p) => p.user_id === currentUser.user_id) || null
    : null;

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  // Step 1: Has the user made any capital allocations?
  const hasInvested = useMemo(() => {
    if (!currentUser) return false;
    return investments.some((i) => i.user_id === currentUser.user_id);
  }, [currentUser, investments]);

  // Step 2: Has the user received at least one completed profit withdrawal?
  const hasWithdrawnProfit = useMemo(() => {
    if (!currentUser) return false;
    const userTxs = transactions.filter((t) => t.user_id === currentUser.user_id);
    return userTxs.some(
      (t) =>
        (t.type === 'withdrawal' && t.status === 'successful') ||
        (t.type === 'payout' && t.status === 'successful')
    );
  }, [currentUser, transactions]);

  const userEligiblePlansForReview = useMemo(() => {
    if (!currentUser) return plans;
    const userInvs = investments.filter((i) => i.user_id === currentUser.user_id);
    const investedPlanIds = Array.from(new Set(userInvs.map((i) => i.plan_id)));
    const matched = plans.filter((p) => investedPlanIds.includes(p.id));
    return matched.length > 0 ? matched : plans;
  }, [currentUser, investments, plans]);

  const userReferralSummary = useMemo<ReferralUserSummary | null>(() => {
    if (!currentUser) return null;
    return calculateReferralUserSummary(
      currentUser.user_id,
      currentUser,
      referralRelationships,
      qualifiedInvestments,
      milestoneRewards,
      investments
    );
  }, [currentUser, referralRelationships, qualifiedInvestments, milestoneRewards, investments]);

  // Investor Reviews
  const submitReview = async (reviewData: {
    quote: string;
    rating: number;
    planId?: string;
    role?: string;
    city?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) {
      return { success: false, message: 'Authentication required to submit review' };
    }

    if (!hasInvested || !hasWithdrawnProfit) {
      return {
        success: false,
        message: 'You must make a capital allocation and complete a withdrawal before leaving a review.',
      };
    }

    // 1. Auto-detect language from quote text
    const detectedLanguage = detectLanguageFromText(reviewData.quote);

    // 2. Resolve investment plan metadata
    const selectedPlan =
      plans.find((p) => p.id === reviewData.planId) ||
      userEligiblePlansForReview[0] ||
      plans[0];

    const userInvs = investments.filter((i) => i.user_id === currentUser.user_id);
    const totalInvested = userInvs.reduce((acc, curr) => acc + curr.principal_amount, 0);
    const automatedYieldLabel = selectedPlan
      ? `+${selectedPlan.roi_percentage.toFixed(0)}% net ROI on ${selectedPlan.title} (${selectedPlan.duration_days}d)`
      : '+50% net ROI';

    // 3. Build unified review object with dynamic language metadata
    const newReview: TestimonialReview = {
      id: `rev-${Date.now()}`,
      user_id: currentUser.user_id,
      name: currentUser.full_name || 'Verified Investor',
      role: reviewData.role || 'Private Agricultural Allocator',
      city: reviewData.city || (currentUser.country_code === 'DE' ? 'Munich, Germany' : 'London, United Kingdom'),
      portfolio: totalInvested > 0 ? `${formatCurrentCurrency(totalInvested, false)} deployed capital` : 'Verified Portfolio',
      quote: reviewData.quote,
      yieldAchieved: automatedYieldLabel,
      plan_title: selectedPlan ? selectedPlan.title : 'Starter Plan',
      rating: reviewData.rating || 5,
      language: detectedLanguage,
      verified: true,
      status: 'pending',
      user_email: currentUser.email,
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    // 4. Create notification for admin desk approval
    const newNotif: AdminNotification = {
      id: `notif-rev-${Date.now()}`,
      type: 'review_submission',
      title: 'New Investor Review Pending Approval',
      message: `${currentUser.full_name || 'An investor'} submitted a ${reviewData.rating}-star review for ${selectedPlan?.title || 'an investment plan'}. Admin approval is required before displaying on the homepage.`,
      userId: currentUser.user_id,
      userName: currentUser.full_name || 'Investor',
      timestamp: new Date().toISOString(),
      read: false,
      metadata: {
        reviewId: newReview.id,
        quote: reviewData.quote,
        rating: reviewData.rating,
        planTitle: selectedPlan?.title,
        authorName: currentUser.full_name || 'Investor',
        userEmail: currentUser.email,
        language: detectedLanguage,
      },
    };
    setAdminNotifications((prev) => [newNotif, ...prev]);

    return {
      success: true,
      message: 'Your review has been submitted for admin approval! Once approved, it will be published to the home screen.',
    };
  };

  const approveReview = (reviewId: string) => {
    const rev = reviews.find((r) => r.id === reviewId);
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status: 'approved' } : r)));
    setAdminNotifications((prev) =>
      prev.map((n) => (n.metadata?.reviewId === reviewId ? { ...n, read: true } : n))
    );

    if (rev) {
      const authorProfile = profiles.find(
        (p) => p.user_id === rev.user_id || p.full_name?.toLowerCase() === rev.name.toLowerCase()
      );
      const recipientEmail = rev.user_email || authorProfile?.email || 'curtis.investor@birdgrow.eu';
      const recipientName = rev.name || authorProfile?.full_name || 'Valued Investor';

      const emailRecord = buildReviewApprovedEmail({
        recipientName,
        recipientEmail,
        planTitle: rev.plan_title,
        rating: rev.rating,
        quote: rev.quote,
        reviewId: rev.id,
      });

      dispatchEmail(emailRecord);
    }
  };

  const rejectReview = (reviewId: string) => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status: 'rejected' } : r)));
    setAdminNotifications((prev) =>
      prev.map((n) => (n.metadata?.reviewId === reviewId ? { ...n, read: true } : n))
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const [humanInquiries, setHumanInquiries] = useState<HumanSupportInquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'human_inquiries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'inq-seed-01',
        senderName: 'David K. Vance',
        senderEmail: 'david.vance@capital-growth.com',
        senderPhone: '+44 7911 123456',
        subject: 'Institutional forward contract inquiry (Normandy Hub)',
        message: 'Hello, our family office is reviewing a €50,000 allocation across the 30-day Continental Harvest. Could an operations specialist confirm the forward off-taker contracts in Normandy?',
        timestamp: '2026-09-28T14:15:00Z',
        status: 'pending',
        emailDispatchedTo: 'jayjaybusiness05@gmail.com',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'human_inquiries', JSON.stringify(humanInquiries));
  }, [humanInquiries]);

  const submitHumanSupportInquiry = async (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; message: string; ticketId: string }> => {
    const ticketId = `SUP-${Date.now().toString().slice(-6)}`;
    const newInquiry: HumanSupportInquiry = {
      id: ticketId,
      senderName: data.name,
      senderEmail: data.email,
      senderPhone: data.phone,
      subject: data.subject || 'Live Human Support Request',
      message: data.message,
      timestamp: new Date().toISOString(),
      status: 'pending',
      emailDispatchedTo: 'jayjaybusiness05@gmail.com',
    };

    setHumanInquiries((prev) => [newInquiry, ...prev]);

    const notification: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: 'human_support_inquiry',
      title: `👤 Human Support Request: ${data.name}`,
      message: `"${data.message.slice(0, 75)}..." · Direct email notification dispatched to jayjaybusiness05@gmail.com`,
      userId: currentUser?.user_id || 'guest',
      userName: data.name,
      timestamp: new Date().toISOString(),
      read: false,
      metadata: { ticketId, email: data.email, dispatchedTo: 'jayjaybusiness05@gmail.com' },
    };

    setAdminNotifications((prev) => [notification, ...prev]);

    return {
      success: true,
      message: `Your message has been dispatched directly to our Operations Desk and email notification transmitted to the executive team (jayjaybusiness05@gmail.com). Ticket Ref: ${ticketId}`,
      ticketId,
    };
  };

  const replyHumanSupportInquiry = (inquiryId: string, reply: string) => {
    setHumanInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId
          ? {
              ...inq,
              reply,
              repliedAt: new Date().toISOString(),
              status: 'resolved' as const,
            }
          : inq
      )
    );
  };

  const submitBugReport = async (data: {
    name: string;
    email: string;
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    pageUrl?: string;
    stepsToReproduce?: string;
  }): Promise<{ success: boolean; message: string; ticketId: string }> => {
    const ticketId = `BUG-${Date.now().toString().slice(-6)}`;
    const newReport: BugReport = {
      id: ticketId,
      reporterName: data.name.trim(),
      reporterEmail: data.email.trim(),
      category: data.category,
      severity: data.severity,
      title: data.title.trim(),
      description: data.description.trim(),
      pageUrl: data.pageUrl || window.location.pathname,
      stepsToReproduce: data.stepsToReproduce?.trim(),
      status: 'open',
      timestamp: new Date().toISOString(),
    };

    setBugReports((prev) => [newReport, ...prev]);

    const notification: AdminNotification = {
      id: `notif-bug-${Date.now()}`,
      type: 'bug_report',
      title: `🐛 Bug Report: ${data.title.trim()}`,
      message: `[${data.severity.toUpperCase()}] ${data.description.trim().slice(0, 80)}... · Category: ${data.category} · Dispatched by ${data.name} (${data.email})`,
      userId: currentUser?.user_id || 'guest',
      userName: data.name,
      timestamp: new Date().toISOString(),
      read: false,
      metadata: {
        ticketId,
        category: data.category,
        severity: data.severity,
        email: data.email,
        pageUrl: data.pageUrl,
        dispatchedTo: settings.adminEmail || 'admin@birdgrow.net',
      },
    };

    setAdminNotifications((prev) => [notification, ...prev]);

    return {
      success: true,
      message: `Bug report filed successfully! Our technical team has been notified. Ticket Reference: ${ticketId}`,
      ticketId,
    };
  };

  const updateBugReportStatus = (bugId: string, status: 'open' | 'investigating' | 'resolved', notes?: string) => {
    setBugReports((prev) =>
      prev.map((b) =>
        b.id === bugId
          ? {
              ...b,
              status,
              adminNotes: notes || b.adminNotes,
              resolvedAt: status === 'resolved' ? new Date().toISOString() : b.resolvedAt,
            }
          : b
      )
    );
  };

  const [humanChatMessages, setHumanChatMessages] = useState<HumanChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'human_chat_msgs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'agent',
        text: "👋 Hello! Welcome to the BirdGrow Live Operations Desk. I'm Elena Vance from client accounts. How can I assist you today with your deposits, poultry cycle allocations, or withdrawal requests?",
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [isHumanTyping, setIsHumanTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'human_chat_msgs', JSON.stringify(humanChatMessages));
  }, [humanChatMessages]);

  const sendHumanSupportChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: HumanChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setHumanChatMessages((prev) => [...prev, userMsg]);

    const ticketId = `CHAT-${Date.now().toString().slice(-6)}`;
    const newInquiry: HumanSupportInquiry = {
      id: ticketId,
      senderName: currentUser?.full_name || 'Investor Client',
      senderEmail: currentUser?.email || 'investor@birdgrow.eu',
      senderPhone: currentUser?.phone,
      subject: `Live Support Message: "${text.trim().slice(0, 40)}..."`,
      message: text.trim(),
      timestamp: new Date().toISOString(),
      status: 'pending',
      emailDispatchedTo: settings.adminEmail || 'admin@birdgrow.net',
    };
    setHumanInquiries((prev) => [newInquiry, ...prev]);

    const notification: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: 'human_support_inquiry',
      title: `👤 Live Chat Message: ${currentUser?.full_name || 'Investor'}`,
      message: `"${text.trim().slice(0, 80)}" · Email alert dispatched to ${settings.adminEmail || 'admin@birdgrow.net'}`,
      userId: currentUser?.user_id || 'guest',
      userName: currentUser?.full_name || 'Investor Client',
      timestamp: new Date().toISOString(),
      read: false,
      metadata: { ticketId, text: text.trim(), emailSentTo: settings.adminEmail || 'admin@birdgrow.net' },
    };
    setAdminNotifications((prev) => [notification, ...prev]);

    setIsHumanTyping(true);
    setTimeout(() => {
      let replyText = "Thank you for reaching out! Our Operations Desk has received your message. A senior account manager is reviewing your file and is actively assisting you.";
      const lower = text.toLowerCase();
      if (lower.includes('deposit') || lower.includes('fund') || lower.includes('payment') || lower.includes('credit')) {
        replyText = "Thank you for checking in on your deposit! For investor security, all cryptocurrency transfers require administrative verification before funds are credited to your balance ledger. Once our desk approves the transaction, your wallet updates immediately.";
      } else if (lower.includes('withdraw') || lower.includes('bank') || lower.includes('payout')) {
        replyText = "Regarding withdrawals: once submitted from your dashboard, a withdrawal notification is sent directly to the administrator for fast compliance approval. Once approved, the funds are sent to your verified wallet or bank account.";
      } else if (lower.includes('plan') || lower.includes('roi') || lower.includes('cycle') || lower.includes('60 day') || lower.includes('enterprise')) {
        replyText = `We offer 4 distinct production tiers: Starter (15d, 50% ROI), Growth (21d, 84% ROI), Commercial (30d, 150% ROI), and our Enterprise Tier (60d, 320% ROI). Returns are contractual and backed by forward off-take supermarket contracts.`;
      }

      const agentMsg: HumanChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toISOString(),
      };
      setHumanChatMessages((prev) => [...prev, agentMsg]);
      setIsHumanTyping(false);
    }, 1000);
  };

  const addUser = async (userData: {
    full_name: string;
    email: string;
    country_code: string;
    initial_balance: number;
    role?: UserRole;
    kyc_status?: KycStatus;
  }): Promise<{ success: boolean; message: string }> => {
    const newUserId = `usr-${Date.now().toString().slice(-6)}`;
    const newProfile: Profile = {
      id: `prof-${Date.now()}`,
      user_id: newUserId,
      full_name: userData.full_name,
      email: userData.email,
      country_code: userData.country_code || 'DE',
      kyc_status: userData.kyc_status || 'unverified',
      kyc_data: {},
      role: userData.role || 'user',
      created_at: new Date().toISOString(),
    };

    const newWallet: Wallet = {
      id: `wal-${newUserId}`,
      user_id: newUserId,
      main_balance: userData.initial_balance || 0,
      earnings_balance: 0,
      locked_investment_balance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProfiles((prev) => [...prev, newProfile]);
    setWallets((prev) => ({ ...prev, [newUserId]: newWallet }));

    return {
      success: true,
      message: `User ${userData.full_name} created successfully with ${formatCurrentCurrency(userData.initial_balance, false)} initial balance.`,
    };
  };

  const deleteUser = async (userId: string): Promise<{ success: boolean; message: string }> => {
    if (userId === 'usr-admin-01') {
      return { success: false, message: 'Super admin account cannot be deleted.' };
    }

    setProfiles((prev) => prev.filter((p) => p.user_id !== userId));
    setWallets((prev) => {
      const copy = { ...prev };
      delete copy[userId];
      return copy;
    });
    setInvestments((prev) => prev.filter((i) => i.user_id !== userId));
    setTransactions((prev) => prev.filter((t) => t.user_id !== userId));

    return {
      success: true,
      message: 'User profile, wallet ledger, and associated records removed successfully.',
    };
  };

  const unreadNotificationCount = adminNotifications.filter((n) => !n.read).length;

  const markNotificationRead = (id: string) => {
    setAdminNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setAdminNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const loginAsInvestor = () => {
    setCurrentUserId('usr-investor-01');
  };

  const loginAsAdmin = () => {
    setCurrentUserId('usr-admin-01');
  };

  const [adminCredentials, setAdminCredentialsState] = useState<{ email: string; password: string }>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'admin_credentials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email && parsed.password) return parsed;
      } catch (e) {}
    }
    return {
      email: 'admin@birdgrow.net',
      password: 'AdminBirdGrow2026!',
    };
  });

  const updateAdminCredentials = (newEmail: string, newPassword: string) => {
    if (!newEmail || !newPassword || newPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }
    const updated = { email: newEmail.trim().toLowerCase(), password: newPassword };
    setAdminCredentialsState(updated);
    localStorage.setItem(STORAGE_PREFIX + 'admin_credentials', JSON.stringify(updated));
    setProfiles((prev) =>
      prev.map((p) => (p.role === 'admin' ? { ...p, email: updated.email } : p))
    );
    return { success: true, message: 'Special Admin credentials updated successfully!' };
  };

  const verifyAdminLogin = (email: string, pass: string): boolean => {
    if (!email || !pass) return false;
    const isEmailMatch = email.trim().toLowerCase() === adminCredentials.email.toLowerCase();
    const isPassMatch = pass === adminCredentials.password;
    if (isEmailMatch && isPassMatch) {
      const adminProfile = profiles.find((p) => p.role === 'admin') || profiles.find((p) => p.user_id === 'usr-admin-01');
      if (adminProfile) {
        setCurrentUserId(adminProfile.user_id);
      } else {
        setCurrentUserId('usr-admin-01');
      }
      return true;
    }
    return false;
  };

  const login = (email: string, role: 'user' | 'admin' = 'user', password?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();

    if (role === 'admin') {
      if (password && verifyAdminLogin(cleanEmail, password)) {
        return true;
      }
      return false;
    }

    const found = profiles.find((p) => p.email.toLowerCase() === cleanEmail);
    if (!found || found.role === 'admin') {
      return false;
    }

    const storedPassword = (found as any).password;
    if (storedPassword && password && password !== storedPassword) {
      return false;
    }

    setCurrentUserId(found.user_id);
    return true;
  };

  const addReferralRelationship = (referrerCode: string, referredUserId: string) => {
    if (!referrerCode || !referredUserId) return { success: false, message: 'Invalid referral parameters' };

    const referredUser = profiles.find((p) => p.user_id === referredUserId);
    if (!referredUser) return { success: false, message: 'Referred user not found' };

    const existing = referralRelationships.find((r) => r.referredUserId === referredUserId);
    if (existing) {
      return { success: false, message: 'User already has a registered referrer.' };
    }

    const trimmed = referrerCode.trim().toLowerCase();
    const referrer = profiles.find(
      (p) =>
        generateReferralCode(p).toLowerCase() === trimmed ||
        p.user_id.toLowerCase() === trimmed ||
        p.email.toLowerCase() === trimmed
    );

    if (!referrer) {
      return { success: false, message: 'Referral code not found' };
    }

    if (referrer.user_id === referredUserId) {
      return { success: false, message: 'A user cannot refer themselves.' };
    }

    const newRel: ReferralRelationship = {
      id: `rel-${Date.now()}`,
      referrerUserId: referrer.user_id,
      referrerCode: generateReferralCode(referrer),
      referredUserId: referredUser.user_id,
      referredUserName: referredUser.full_name,
      referredUserEmail: referredUser.email,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setReferralRelationships((prev) => [...prev, newRel]);
    return {
      success: true,
      message: `Referral successfully attributed to ${referrer.full_name}.`,
    };
  };

  const register = async (fullName: string, email: string, password: string, countryCode: string, referrerCode?: string) => {
    const newUserId = `usr-${Date.now()}`;
    const newProfile: Profile = {
      id: `prof-${Date.now()}`,
      user_id: newUserId,
      full_name: fullName,
      email,
      country_code: countryCode,
      kyc_status: 'unverified',
      kyc_data: {},
      role: 'user',
      created_at: new Date().toISOString(),
      password,
    };

    // 1. Update local state immediately for fast feedback
    setProfiles((prev) => [...prev, newProfile]);

    // 2. Save directly to Firebase Firestore database so it reflects on Admin Dashboard
    try {
      await setDoc(doc(db, 'profiles', newProfile.id), newProfile);
    } catch (error) {
      console.error('Error saving profile to Firestore:', error);
    }

    const newWallet: Wallet = {
      id: `wal-${Date.now()}`,
      user_id: newUserId,
      main_balance: 0.0,
      earnings_balance: 0.0,
      locked_investment_balance: 0.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setWallets((prev) => ({ ...prev, [newUserId]: newWallet }));
    setCurrentUserId(newUserId);

    if (referrerCode) {
      addReferralRelationship(referrerCode, newUserId);
    }

    return true;
  };

  const claimReferralReward = async (rewardId: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Not authenticated' };

    const targetReward = milestoneRewards.find((r) => r.id === rewardId && r.userId === currentUser.user_id);
    if (!targetReward) return { success: false, message: 'Reward not found' };
    if (targetReward.status === 'paid') return { success: false, message: 'Reward already paid' };
    if (targetReward.status !== 'unlocked') return { success: false, message: 'Reward is not available for claim' };

    setMilestoneRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, status: 'paid', paidAt: new Date().toISOString() } : r))
    );

    const eurEquivalent = targetReward.rewardAmount;
    const userWal = wallets[currentUser.user_id];
    if (userWal) {
      setWallets((prev) => ({
        ...prev,
        [currentUser.user_id]: {
          ...userWal,
          main_balance: Math.round((userWal.main_balance + eurEquivalent) * 100) / 100,
          earnings_balance: Math.round((userWal.earnings_balance + eurEquivalent) * 100) / 100,
          updated_at: new Date().toISOString(),
        },
      }));

      const newTx: Transaction = {
        id: `tx-rew-${Date.now()}`,
        user_id: currentUser.user_id,
        amount: eurEquivalent,
        type: 'payout',
        status: 'successful',
        reference: targetReward.referenceId,
        payment_gateway: 'internal',
        metadata: {
          note: `Referral Milestone ${formatNaira(targetReward.rewardAmount)} Reward Credited`,
          milestoneId: targetReward.milestoneId,
          rewardEuro: targetReward.rewardAmount,
        },
        created_at: new Date().toISOString(),
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    return {
      success: true,
      message: `Successfully claimed ${formatNaira(targetReward.rewardAmount)} milestone reward! (Ref: ${targetReward.referenceId}).`,
    };
  };

  const qualifyReferralInvestment = (investmentId: string) => {
    setQualifiedInvestments((prev) =>
      prev.map((qi) => (qi.id === investmentId ? { ...qi, qualificationStatus: 'qualified', qualificationDate: new Date().toISOString().split('T')[0] } : qi))
    );
    return { success: true, message: 'Investment verified as qualified.' };
  };

  const reverseReferralInvestment = (investmentId: string) => {
    const qi = qualifiedInvestments.find((i) => i.id === investmentId);
    if (!qi) return { success: false, message: 'Investment record not found.' };

    setQualifiedInvestments((prev) =>
      prev.map((i) => (i.id === investmentId ? { ...i, qualificationStatus: 'reversed', notes: 'Reversed by admin compliance audit' } : i))
    );

    const referrerId = qi.referrerUserId;
    const remainingVolume = qualifiedInvestments
      .filter((i) => i.referrerUserId === referrerId && i.id !== investmentId && i.qualificationStatus === 'qualified')
      .reduce((s, i) => s + i.amount, 0);

    setMilestoneRewards((prev) =>
      prev.map((r) => {
        if (r.userId === referrerId && r.status === 'unlocked' && r.volumeThreshold > remainingVolume) {
          return { ...r, status: 'reversed', notes: 'Reversed due to investment refund/cancellation' };
        }
        return r;
      })
    );

    return {
      success: true,
      message: `Investment reversed. Referral volume and affected pending rewards recalculated.`,
    };
  };

  const adminPayMilestoneReward = (rewardId: string) => {
    const r = milestoneRewards.find((m) => m.id === rewardId);
    if (!r) return { success: false, message: 'Reward not found.' };

    setMilestoneRewards((prev) =>
      prev.map((m) => (m.id === rewardId ? { ...m, status: 'paid', paidAt: new Date().toISOString() } : m))
    );

    const eurEquiv = r.rewardAmount;
    const wal = wallets[r.userId];
    if (wal) {
      setWallets((prev) => ({
        ...prev,
        [r.userId]: {
          ...wal,
          main_balance: Math.round((wal.main_balance + eurEquiv) * 100) / 100,
        },
      }));
    }

    return { success: true, message: `Reward marked as paid and credited.` };
  };

  const adminReverseMilestoneReward = (rewardId: string) => {
    setMilestoneRewards((prev) =>
      prev.map((m) => (m.id === rewardId ? { ...m, status: 'reversed', notes: 'Reversed by admin compliance' } : m))
    );
    return { success: true, message: `Milestone reward reversed.` };
  };

  const simulateReferralInvestment = (amount: number, referredName: string = 'Lucas Schmidt') => {
    if (!currentUser) return { success: false, message: 'Please sign in to test simulation.' };

    const refUserEmail = `${referredName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const newReferredUserId = `usr-sim-${Date.now()}`;

    let rel = referralRelationships.find(
      (r) => r.referrerUserId === currentUser.user_id && r.referredUserName === referredName
    );
    if (!rel) {
      rel = {
        id: `rel-${Date.now()}`,
        referrerUserId: currentUser.user_id,
        referrerCode: generateReferralCode(currentUser),
        referredUserId: newReferredUserId,
        referredUserName: referredName,
        referredUserEmail: refUserEmail,
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      setReferralRelationships((prev) => [...prev, rel!]);
    }

    const newQualified: ReferralQualifiedInvestment = {
      id: `qinv-${Date.now()}`,
      investmentId: `inv-sim-${Date.now()}`,
      referrerUserId: currentUser.user_id,
      referredUserId: rel.referredUserId,
      referredUserName: rel.referredUserName,
      amount,
      qualificationStatus: 'qualified',
      investmentDate: new Date().toISOString().split('T')[0],
      qualificationDate: new Date().toISOString().split('T')[0],
      notes: 'Simulated allocation for testing referral milestones',
    };

    const updatedQualified = [...qualifiedInvestments, newQualified];
    setQualifiedInvestments(updatedQualified);

    const totalVol = updatedQualified
      .filter((q) => q.referrerUserId === currentUser.user_id && q.qualificationStatus === 'qualified')
      .reduce((s, q) => s + q.amount, 0);

    const isInv = isUserInvestorReferrer(currentUser.user_id, investments);
    const newAwards = evaluateNewMilestoneAwards(currentUser.user_id, totalVol, isInv, milestoneRewards);

    if (newAwards.length > 0) {
      setMilestoneRewards((prev) => [...prev, ...newAwards]);
      const totalNewlyEarned = newAwards.reduce((s, a) => s + a.rewardAmount, 0);
      return {
        success: true,
        message: `Simulated +${formatNaira(amount)} from ${referredName}. Cumulative volume reached ${formatNaira(totalVol)}! Unlocked ${newAwards.length} milestone(s) totaling ${formatNaira(totalNewlyEarned)} in rewards!`,
      };
    }

    return {
      success: true,
      message: `Simulated +${formatNaira(amount)} from ${referredName}. Cumulative volume is now ${formatNaira(totalVol)}.`,
    };
  };

  const logout = () => {
    setCurrentUserId(null);
    localStorage.removeItem(STORAGE_PREFIX + 'current_user_id');
  };

  // Investor Operation: Deposit Funds
  const deposit = async (
    amount: number,
    gateway: PaymentGateway,
    metadata: any = {},
    isAmountInActiveCurrency: boolean = false
  ): Promise<{ success: boolean; reference: string; message?: string }> => {
    if (!currentUser) return { success: false, reference: '', message: 'User not authenticated' };
    if (amount <= 0) return { success: false, reference: '', message: 'Amount must be greater than zero' };

    const amountInActive = isAmountInActiveCurrency ? amount : convertGbpAmount(amount, currency);
    const amountInGbp = isAmountInActiveCurrency ? convertToGbp(amount, currency) : amount;

    const coin = metadata?.cryptoCoin || 'USDT';
    const ref = `DEP-${coin}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      user_id: currentUser.user_id,
      amount: amountInGbp,
      type: 'deposit',
      status: 'pending',
      reference: ref,
      payment_gateway: gateway,
      metadata: {
        ...metadata,
        inputCurrency: currency,
        inputAmount: amountInActive,
        cryptoCoin: coin,
        timestamp: new Date().toISOString(),
        emailDispatchedTo: settings.adminEmail || 'admin@birdgrow.net',
      },
      created_at: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    const notif: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: 'deposit_confirmation_request',
      title: `⚡ Deposit Credit Approval Required: ${currencySymbol}${amountInActive.toLocaleString()} (${formatCurrentCurrency(amountInGbp)})`,
      message: `${currentUser.full_name} (${currentUser.email}) submitted a deposit of ${currencySymbol}${amountInActive.toLocaleString()} (~${formatCurrentCurrency(amountInGbp)}) via ${coin} (${metadata.network || 'Mainnet'}). Notification dispatched to admin (${settings.adminEmail}). Awaiting admin verification to update investor balance.`,
      amount: amountInGbp,
      userId: currentUser.user_id,
      userName: currentUser.full_name,
      timestamp: new Date().toISOString(),
      read: false,
      metadata: {
        txId: newTx.id,
        reference: ref,
        coin,
        inputCurrency: currency,
        inputAmount: amountInActive,
        txHash: metadata.txHash,
        adminEmail: settings.adminEmail,
      },
    };
    setAdminNotifications((prev) => [notif, ...prev]);

    return {
      success: true,
      reference: ref,
      message: `Deposit request of ${currencySymbol}${amountInActive.toLocaleString()} via ${coin} submitted for administrative verification. An email alert has been dispatched to ${settings.adminEmail}. Your wallet will be credited once confirmed by the administrator.`,
    };
  };

  // Admin Operation: Confirm deposit credit
  const confirmDeposit = async (txId: string): Promise<{ success: boolean; message: string }> => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return { success: false, message: 'Deposit transaction record not found.' };
    if (tx.status === 'successful') return { success: false, message: 'Deposit has already been confirmed.' };

    const targetUserId = tx.user_id;
    const userWal = wallets[targetUserId] || {
      id: `wal-${targetUserId}`,
      user_id: targetUserId,
      main_balance: 0,
      earnings_balance: 0,
      locked_investment_balance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newBal = Math.round((userWal.main_balance + tx.amount) * 100) / 100;

    setWallets((prev) => ({
      ...prev,
      [targetUserId]: {
        ...userWal,
        main_balance: newBal,
        updated_at: new Date().toISOString(),
      },
    }));

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'successful',
              metadata: {
                ...t.metadata,
                confirmedAt: new Date().toISOString(),
                confirmedByAdmin: true,
              },
            }
          : t
      )
    );

    setAdminNotifications((prev) =>
      prev.map((n) =>
        n.metadata?.txId === txId
          ? {
              ...n,
              read: true,
              metadata: {
                ...n.metadata,
                actionCompleted: true,
                actionTaken: 'approved',
                completedAt: new Date().toISOString(),
              },
            }
          : n
      )
    );

    return {
      success: true,
      message: `Deposit credit confirmed! ${formatCurrentCurrency(tx.amount)} has been credited to investor's main wallet. New balance: ${formatCurrentCurrency(newBal)}.`,
    };
  };

  // Admin Operation: Deny deposit credit
  const denyDeposit = async (txId: string, reason?: string): Promise<{ success: boolean; message: string }> => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return { success: false, message: 'Transaction not found.' };

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'failed',
              metadata: {
                ...t.metadata,
                rejectionReason: reason || 'Deposit denied by administrator',
              },
            }
          : t
      )
    );

    setAdminNotifications((prev) =>
      prev.map((n) =>
        n.metadata?.txId === txId
          ? {
              ...n,
              read: true,
              metadata: {
                ...n.metadata,
                actionCompleted: true,
                actionTaken: 'denied',
                completedAt: new Date().toISOString(),
              },
            }
          : n
      )
    );

    return {
      success: true,
      message: `Deposit request ${tx.reference} has been marked as denied.`,
    };
  };

  // Investor Operation: Request Withdrawal
  const requestWithdrawal = async (
    amount: number,
    destination: {
      type: 'crypto' | 'bank';
      cryptoCoin?: CryptoCoin;
      network?: string;
      walletAddress?: string;
      iban?: string;
      bic?: string;
      bankName?: string;
      accountHolder?: string;
    },
    isAmountInActiveCurrency: boolean = false
  ): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) return { success: false, message: 'Authentication required' };

    const amountInActive = isAmountInActiveCurrency ? amount : convertGbpAmount(amount, currency);
    const amountInGbp = isAmountInActiveCurrency ? convertToGbp(amount, currency) : amount;

    const userWal = wallets[currentUser.user_id];
    if (!userWal || userWal.main_balance < amountInGbp) {
      return { success: false, message: 'Insufficient main wallet balance available for withdrawal.' };
    }

    const minWithdrawalInBase = settings.minimumWithdrawal || 100;
    const minWithdrawalInActive = convertGbpAmount(minWithdrawalInBase, currency);

    if (amountInGbp < minWithdrawalInBase - 0.01) {
      return {
        success: false,
        message: `Minimum withdrawal threshold is ${currencySymbol}${minWithdrawalInActive.toFixed(2)} (equivalent of €${minWithdrawalInBase.toFixed(2)}).`,
      };
    }

    setWallets((prev) => ({
      ...prev,
      [currentUser.user_id]: {
        ...userWal,
        main_balance: Math.round((userWal.main_balance - amountInGbp) * 100) / 100,
        updated_at: new Date().toISOString(),
      },
    }));

    const prefix = destination.type === 'crypto' ? `WTH-${destination.cryptoCoin || 'CRYPTO'}` : 'WTH-SEPA';
    const ref = `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      user_id: currentUser.user_id,
      amount: amountInGbp,
      type: 'withdrawal',
      status: 'pending',
      reference: ref,
      payment_gateway: destination.type === 'crypto' ? 'crypto' : 'sepa',
      metadata: {
        ...destination,
        inputCurrency: currency,
        inputAmount: amountInActive,
      },
      created_at: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    const destSummary =
      destination.type === 'crypto'
        ? `${destination.cryptoCoin} (${destination.network}) to ${destination.walletAddress}`
        : `IBAN: ${destination.iban} (${destination.bankName})`;

    const adminNotif: AdminNotification = {
      id: `notif-wth-${Date.now()}`,
      type: 'withdrawal_request',
      title: `⚡ New Withdrawal Request: ${currencySymbol}${amountInActive.toLocaleString()} (${formatCurrentCurrency(amountInGbp)})`,
      message: `${currentUser.full_name} (${currentUser.email}) submitted a withdrawal of ${currencySymbol}${amountInActive.toLocaleString()} to: ${destSummary}`,
      amount: amountInGbp,
      userId: currentUser.user_id,
      userName: currentUser.full_name,
      timestamp: new Date().toISOString(),
      read: false,
      metadata: {
        txId: newTx.id,
        reference: ref,
        destination,
        inputCurrency: currency,
        inputAmount: amountInActive,
      },
    };

    setAdminNotifications((prev) => [adminNotif, ...prev]);

    return {
      success: true,
      message: `Withdrawal request for ${currencySymbol}${amountInActive.toLocaleString()} received and dispatched to Admin Console for validation (Ref: ${ref}).`,
    };
  };

  // Investor Operation: Execute Investment
  const executeInvestment = async (
    planId: string,
    amount: number,
    isAmountInActiveCurrency: boolean = false
  ): Promise<{ success: boolean; investmentId?: string; message?: string }> => {
    if (!currentUser) return { success: false, message: 'Please sign in to execute investment' };

    const plan = plans.find((p) => p.id === planId);
    if (!plan || plan.status !== 'active') {
      return { success: false, message: 'Investment plan is currently inactive or not found' };
    }

    const amountInActive = isAmountInActiveCurrency ? amount : convertGbpAmount(amount, currency);
    const amountInGbp = isAmountInActiveCurrency ? convertToGbp(amount, currency) : amount;

    const minInActive = convertGbpAmount(plan.min_amount, currency);
    const maxInActive = convertGbpAmount(plan.max_amount, currency);

    if (amountInGbp < plan.min_amount - 0.01) {
      return {
        success: false,
        message: `Allocation rejected: Minimum entry for ${plan.title} is ${currencySymbol}${minInActive.toLocaleString()} (the equivalent of £${plan.min_amount.toLocaleString()}). You entered ${currencySymbol}${amountInActive.toLocaleString()}.`,
      };
    }
    if (amountInGbp > plan.max_amount + 0.01) {
      return {
        success: false,
        message: `Allocation rejected: Maximum tranche for ${plan.title} is ${currencySymbol}${maxInActive.toLocaleString()} (the equivalent of £${plan.max_amount.toLocaleString()}).`,
      };
    }

    const userWal = wallets[currentUser.user_id];
    if (!userWal || userWal.main_balance < amountInGbp) {
      return {
        success: false,
        message: `Insufficient main balance (${formatCurrentCurrency(userWal?.main_balance || 0)}). Please deposit funds.`,
      };
    }

    const expectedRoiAmount = Math.round(amountInGbp * (plan.roi_percentage / 100) * 100) / 100;
    const totalPayout = amountInGbp + expectedRoiAmount;

    const cycle = cycles.find((c) => c.current_stage === 'chick_placement' || c.current_stage === 'growth') || cycles[0];

    const startDate = new Date();
    const maturityDate = new Date();
    maturityDate.setDate(startDate.getDate() + plan.duration_days);

    const newInvId = `inv-${Date.now()}`;
    const newInvestment: Investment = {
      id: newInvId,
      user_id: currentUser.user_id,
      plan_id: plan.id,
      plan_title: plan.title,
      principal_amount: amountInGbp,
      expected_roi_amount: expectedRoiAmount,
      total_payout: totalPayout,
      start_date: startDate.toISOString().split('T')[0],
      maturity_date: maturityDate.toISOString().split('T')[0],
      cycle_id: cycle.id,
      cycle_code: cycle.cycle_code,
      facility_location: cycle.facility_location,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    setWallets((prev) => ({
      ...prev,
      [currentUser.user_id]: {
        ...userWal,
        main_balance: Math.round((userWal.main_balance - amountInGbp) * 100) / 100,
        locked_investment_balance: Math.round((userWal.locked_investment_balance + amountInGbp) * 100) / 100,
        updated_at: new Date().toISOString(),
      },
    }));

    const ref = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      user_id: currentUser.user_id,
      amount: amountInGbp,
      type: 'investment',
      status: 'successful',
      reference: ref,
      payment_gateway: 'internal',
      metadata: {
        planTitle: plan.title,
        cycleCode: cycle.cycle_code,
        durationDays: plan.duration_days,
        roiPercentage: plan.roi_percentage,
        inputCurrency: currency,
        inputAmount: amountInActive,
      },
      created_at: new Date().toISOString(),
    };

    setInvestments((prev) => [newInvestment, ...prev]);
    setTransactions((prev) => [newTx, ...prev]);

    const referralRel = referralRelationships.find(
      (r) => r.referredUserId === currentUser.user_id && r.status === 'active'
    );

    if (referralRel) {
  const newQualifiedInv: ReferralQualifiedInvestment = {
    id: `qinv-${Date.now()}`,
    investmentId: newInvId,
    referrerUserId: referralRel.referrerUserId,
    referredUserId: currentUser.user_id,
    referredUserName: currentUser.full_name,
    amount: amountInGbp,
    qualificationStatus: 'qualified',
    investmentDate: new Date().toISOString().split('T')[0],
    qualificationDate: new Date().toISOString().split('T')[0],
    notes: `${plan.title} allocation (${currencySymbol}${amountInActive.toLocaleString()})`,
  };

  const updatedQualifiedInvs = [...qualifiedInvestments, newQualifiedInv];
  setQualifiedInvestments(updatedQualifiedInvs);

  const referrerId = referralRel.referrerUserId;
  const totalVol = updatedQualifiedInvs
    .filter((q) => q.referrerUserId === referrerId && q.qualificationStatus === 'qualified')
    .reduce((sum, q) => sum + q.amount, 0);

  const isReferrerInvestor = isUserInvestorReferrer(referrerId!, [newInvestment, ...investments]);
  const newAwards = evaluateNewMilestoneAwards(referrerId!, totalVol, isReferrerInvestor, milestoneRewards);

      if (newAwards.length > 0) {
        setMilestoneRewards((prev) => [...prev, ...newAwards]);

        const totalNewlyEarned = newAwards.reduce((s, a) => s + a.rewardAmount, 0);
        const referrerProfile = profiles.find((p) => p.user_id === referrerId);
        const notif: AdminNotification = {
          id: `notif-ref-${Date.now()}`,
          type: 'investment_created',
          title: `Referral Milestone Reached! (${newAwards.map((a) => a.notes).join(', ')})`,
          message: `${referrerProfile?.full_name || 'Referrer'} reached milestone(s) with total reward of €${totalNewlyEarned.toLocaleString()} unlocked.`,
          userId: referrerId,
          userName: referrerProfile?.full_name || 'Referrer',
          amount: totalNewlyEarned,
          timestamp: new Date().toISOString(),
          read: false,
        };
        setAdminNotifications((prev) => [notif, ...prev]);
      }
    }

    return {
      success: true,
      investmentId: newInvId,
      message: `Successfully allocated ${currencySymbol}${amountInActive.toLocaleString()} to ${plan.title} (${cycle.cycle_code}).`,
    };
  };

  const submitKyc = async (kycData: KycData): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) return { success: false, message: 'User not logged in' };

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.user_id === currentUser.user_id) {
          return {
            ...p,
            kyc_status: 'pending',
            kyc_data: {
              ...kycData,
              submittedAt: new Date().toISOString(),
              documentHash: `sha256-${Math.random().toString(36).substring(2, 15)}`,
            },
            updated_at: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    const notif: AdminNotification = {
      id: `notif-kyc-${Date.now()}`,
      type: 'kyc_submission',
      title: `KYC Identity Dossier Submitted`,
      message: `${currentUser.full_name} submitted documents for European compliance verification.`,
      userId: currentUser.user_id,
      userName: currentUser.full_name,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setAdminNotifications((prev) => [notif, ...prev]);

    return {
      success: true,
      message: 'KYC identity documents submitted for European compliance review.',
    };
  };

  const savePayoutAccount = (account: Omit<PayoutAccount, 'id' | 'user_id' | 'created_at'>) => {
    if (!currentUser) return;
    const newAcc: PayoutAccount = {
      ...account,
      id: `payout-${Date.now()}`,
      user_id: currentUser.user_id,
      created_at: new Date().toISOString(),
    };
    setPayoutAccounts((prev) => [...prev, newAcc]);
  };

  const reviewKyc = (userId: string, approved: boolean, reason?: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.user_id === userId) {
          return {
            ...p,
            kyc_status: approved ? 'verified' : 'rejected',
            kyc_data: {
              ...p.kyc_data,
              verifiedAt: approved ? new Date().toISOString() : undefined,
              rejectionReason: approved ? undefined : reason,
            },
            updated_at: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  const updateTransactionStatus = (txId: string, status: 'successful' | 'failed' | 'cancelled' | 'partial') => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === txId) {
          return { ...t, status };
        }
        return t;
      })
    );
  };

  // Admin Operation: Full Approval of Withdrawal
  const approveFullWithdrawal = async (
    txId: string,
    options: { note?: string; capitalPairingCategory?: string } = {}
  ): Promise<{ success: boolean; message: string }> => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return { success: false, message: 'Withdrawal transaction not found.' };
    if (tx.status === 'successful') return { success: false, message: 'Withdrawal has already been approved.' };

    const feePct = tx.metadata?.feePercentage || settings.platformFeePercentage || 1.5;
    const feeAmount = Math.round((tx.amount * (feePct / 100)) * 100) / 100;
    const netAmount = Math.round((tx.amount - feeAmount) * 100) / 100;
    const investor = profiles.find((p) => p.user_id === tx.user_id);
    const investorName = investor?.full_name || 'Investor';

    recordFeePurseDeduction({
      txId: tx.id,
      txRef: tx.reference,
      userId: tx.user_id,
      userName: investorName,
      grossAmount: tx.amount,
      feePercentage: feePct,
      feeAmount,
      netPayoutAmount: netAmount,
      payoutType: 'full',
      capitalPairingCategory: options.capitalPairingCategory || 'production',
    });

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'successful' as const,
              metadata: {
                ...t.metadata,
                approvedAt: new Date().toISOString(),
                approvedByAdmin: true,
                feePercentage: feePct,
                feeAmount,
                netPayoutAmount: netAmount,
                feePurseCredited: true,
                adminNote: options.note,
                capitalPairingCategory: options.capitalPairingCategory || 'production',
              },
            }
          : t
      )
    );

    setAdminNotifications((prev) =>
      prev.map((n) =>
        n.metadata?.txId === txId || n.id === txId
          ? {
              ...n,
              read: true,
              metadata: {
                ...n.metadata,
                actionCompleted: true,
                actionTaken: 'approved',
                completedAt: new Date().toISOString(),
                netPayoutAmount: netAmount,
                feeAmount,
              },
            }
          : n
      )
    );

    return {
      success: true,
      message: `Withdrawal of €${tx.amount.toLocaleString()} approved. Net disbursement: €${netAmount.toLocaleString()}. Protocol fee of €${feeAmount.toFixed(2)} (${feePct}%) deposited into Admin Fee Purse.`,
    };
  };

  // Admin Operation: Decline Withdrawal
  const declineWithdrawal = async (
    txId: string,
    options: {
      errorMessage: string;
      issues: string[];
      refundToWallet?: boolean;
    }
  ): Promise<{ success: boolean; message: string }> => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return { success: false, message: 'Withdrawal transaction not found.' };

    const refundToWallet = options.refundToWallet !== false;
    const investor = profiles.find((p) => p.user_id === tx.user_id);
    const investorName = investor?.full_name || 'Valued Investor';
    const investorEmail = investor?.email || 'investor@birdgrow.eu';

    if (refundToWallet) {
      const userWal = wallets[tx.user_id];
      if (userWal) {
        setWallets((prev) => ({
          ...prev,
          [tx.user_id]: {
            ...userWal,
            main_balance: Math.round((userWal.main_balance + tx.amount) * 100) / 100,
            updated_at: new Date().toISOString(),
          },
        }));
      }
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'failed' as const,
              metadata: {
                ...t.metadata,
                errorMessage: options.errorMessage,
                issues: options.issues,
                rejectionReason: options.errorMessage,
                declinedAt: new Date().toISOString(),
                declinedByAdmin: true,
                refundedToWallet: refundToWallet,
              },
            }
          : t
      )
    );

    const emailRecord = buildWithdrawalDeclinedEmail({
      recipientName: investorName,
      recipientEmail: investorEmail,
      amount: tx.amount,
      currencySymbol,
      txRef: tx.reference,
      errorMessage: options.errorMessage,
      issues: options.issues,
      refundedToWallet: refundToWallet,
    });
    dispatchEmail(emailRecord);

    setAdminNotifications((prev) =>
      prev.map((n) =>
        n.metadata?.txId === txId || n.id === txId
          ? {
              ...n,
              read: true,
              metadata: {
                ...n.metadata,
                actionCompleted: true,
                actionTaken: 'declined',
                completedAt: new Date().toISOString(),
                errorMessage: options.errorMessage,
                issues: options.issues,
              },
            }
          : n
      )
    );

    return {
      success: true,
      message: `Withdrawal ${tx.reference} declined. ${refundToWallet ? `Funds (€${tx.amount.toLocaleString()}) restored to investor's main wallet.` : ''} Official error message & issues notice dispatched to ${investorEmail}.`,
    };
  };

  // Admin Operation: Partial Payout
  const partialPayoutWithdrawal = async (
    txId: string,
    options: {
      payoutAmount: number;
      explanationMessage: string;
      refundRemainingToWallet?: boolean;
      capitalPairingCategory?: string;
    }
  ): Promise<{ success: boolean; message: string }> => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return { success: false, message: 'Withdrawal transaction not found.' };
    if (options.payoutAmount <= 0) return { success: false, message: 'Partial payout amount must be greater than zero.' };
    if (options.payoutAmount >= tx.amount) {
      return { success: false, message: `Partial payout amount must be less than requested amount (€${tx.amount.toLocaleString()}). Use Full Approval instead.` };
    }

    const requestedAmount = tx.amount;
    const payoutAmount = Math.round(options.payoutAmount * 100) / 100;
    const remainingAmount = Math.round((requestedAmount - payoutAmount) * 100) / 100;
    const refundToWallet = options.refundRemainingToWallet !== false;

    const investor = profiles.find((p) => p.user_id === tx.user_id);
    const investorName = investor?.full_name || 'Valued Investor';
    const investorEmail = investor?.email || 'investor@birdgrow.eu';

    const feePct = tx.metadata?.feePercentage || settings.platformFeePercentage || 1.5;
    const feeAmount = Math.round((payoutAmount * (feePct / 100)) * 100) / 100;
    const netPayoutAmount = Math.round((payoutAmount - feeAmount) * 100) / 100;

    recordFeePurseDeduction({
      txId: tx.id,
      txRef: tx.reference,
      userId: tx.user_id,
      userName: investorName,
      grossAmount: payoutAmount,
      feePercentage: feePct,
      feeAmount,
      netPayoutAmount,
      payoutType: 'partial',
      capitalPairingCategory: options.capitalPairingCategory || 'production',
    });

    if (refundToWallet) {
      const userWal = wallets[tx.user_id];
      if (userWal) {
        setWallets((prev) => ({
          ...prev,
          [tx.user_id]: {
            ...userWal,
            main_balance: Math.round((userWal.main_balance + remainingAmount) * 100) / 100,
            updated_at: new Date().toISOString(),
          },
        }));
      }
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              amount: payoutAmount,
              status: 'partial' as const,
              metadata: {
                ...t.metadata,
                isPartialPayout: true,
                originalRequestedAmount: requestedAmount,
                partialPayoutAmount: payoutAmount,
                remainingAmount,
                feePercentage: feePct,
                feeAmount,
                netPayoutAmount,
                refundedRemainingToWallet: refundToWallet,
                partialMessage: options.explanationMessage,
                capitalPairingCategory: options.capitalPairingCategory || 'production',
                processedAt: new Date().toISOString(),
                processedByAdmin: true,
              },
            }
          : t
      )
    );

    const emailRecord = buildWithdrawalPartialEmail({
      recipientName: investorName,
      recipientEmail: investorEmail,
      requestedAmount,
      partialAmount: payoutAmount,
      remainingAmount,
      currencySymbol,
      txRef: tx.reference,
      explanationMessage: options.explanationMessage,
      capitalPairingCategory: options.capitalPairingCategory,
    });
    dispatchEmail(emailRecord);

    setAdminNotifications((prev) =>
      prev.map((n) =>
        n.metadata?.txId === txId || n.id === txId
          ? {
              ...n,
              read: true,
              metadata: {
                ...n.metadata,
                actionCompleted: true,
                actionTaken: 'partial',
                completedAt: new Date().toISOString(),
                partialPayoutAmount: payoutAmount,
                remainingAmount,
                explanationMessage: options.explanationMessage,
              },
            }
          : n
      )
    );

    return {
      success: true,
      message: `Partial payout of ${currencySymbol}${payoutAmount.toLocaleString()} processed (Net sent: ${currencySymbol}${netPayoutAmount.toLocaleString()}, Protocol Fee: ${currencySymbol}${feeAmount.toFixed(2)} to Purse). ${refundToWallet ? `Remaining ${currencySymbol}${remainingAmount.toLocaleString()} restored to wallet.` : ''} Tranche notice dispatched to ${investorEmail}.`,
    };
  };

  // Admin Operation: Sweep Fee Purse
  const sweepFeePurse = async (
    amount?: number,
    destinationAddress?: string
  ): Promise<{ success: boolean; message: string }> => {
    const sweepAmount = amount ? Math.min(amount, adminFeePurse.totalAccumulatedBalance) : adminFeePurse.totalAccumulatedBalance;
    if (sweepAmount <= 0) {
      return { success: false, message: 'Fee Purse has no accumulated balance to sweep.' };
    }

    const dest = destinationAddress || settings.cryptoAddresses.USDT;
    setAdminFeePurse((prev) => ({
      ...prev,
      totalAccumulatedBalance: Math.max(0, Math.round((prev.totalAccumulatedBalance - sweepAmount) * 100) / 100),
      lastUpdated: new Date().toISOString(),
    }));

    const sweepTx: Transaction = {
      id: `tx-sweep-${Date.now()}`,
      user_id: 'usr-admin-01',
      amount: sweepAmount,
      type: 'payout',
      status: 'successful',
      reference: `SWEEP-PURSE-${Date.now().toString().slice(-6)}`,
      payment_gateway: 'crypto',
      metadata: {
        type: 'admin_fee_sweep',
        destination: dest,
        note: `Corporate Treasury Sweep from Withdrawal Fee Purse to ${dest}`,
      },
      created_at: new Date().toISOString(),
    };
    setTransactions((prev) => [sweepTx, ...prev]);

    return {
      success: true,
      message: `Successfully swept €${sweepAmount.toFixed(2)} from Withdrawal Fee Purse to corporate treasury (${dest}).`,
    };
  };

  const createPlan = (newPlan: Omit<InvestmentPlan, 'id'>) => {
    const plan: InvestmentPlan = {
      ...newPlan,
      id: `plan-${Date.now()}`,
    };
    setPlans((prev) => [plan, ...prev]);
  };

  const updatePlan = (updatedPlan: InvestmentPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
  };

  const archivePlan = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status: p.status === 'active' ? 'archived' : 'active' } : p))
    );
  };

  const updateCycleStage = (
    cycleId: string,
    stage: CycleStage,
    currentWeight?: number,
    mortality?: number
  ) => {
    setCycles((prev) =>
      prev.map((c) => {
        if (c.id === cycleId) {
          return {
            ...c,
            current_stage: stage,
            current_weight_kg: currentWeight !== undefined ? currentWeight : c.current_weight_kg,
            mortality_rate: mortality !== undefined ? mortality : c.mortality_rate,
          };
        }
        return c;
      })
    );
  };

  const addNewFarm = (farmData: Partial<PoultryCycle>) => {
    const newId = `cyc-${Date.now().toString().slice(-6)}`;
    const randomCode = `EU-${(farmData.country || 'DE').toUpperCase()}-2026-${Math.floor(10 + Math.random() * 90)}`;
    const totalBirds = Number(farmData.total_birds) || ((Number(farmData.layers_count) || 0) + (Number(farmData.broilers_count) || 0)) || 0;

    const newFarm: PoultryCycle = {
      id: newId,
      cycle_code: farmData.cycle_code || randomCode,
      facility_name: farmData.facility_name || 'Alpine Bio-Poultry Hub',
      facility_location: farmData.facility_location || 'Austria',
      country: farmData.country || 'AT',
      total_birds: totalBirds,
      current_stage: farmData.current_stage || 'chick_placement',
      start_date: new Date().toISOString().slice(0, 10),
      expected_completion_date: new Date(Date.now() + 25 * 86400000).toISOString().slice(0, 10),
      certified_organic: true,
      breed: farmData.breed || 'Lohmann Brown (Layers) & Ross 308 (Broilers)',
      feed_type: farmData.feed_type || '100% Non-GMO Regional Grain & Alfalfa',
      image_url: farmData.image_url || '',
      current_weight_kg: farmData.current_weight_kg || 1.15,
      mortality_rate: farmData.mortality_rate || 0.18,
      category: farmData.category || 'dual_layers_broilers',
      production_type: farmData.production_type || 'Dual Layers & Pastured Broilers',
      daily_egg_capacity: farmData.daily_egg_capacity || (farmData.category !== 'broilers' ? Math.round(totalBirds * 0.75) : undefined),
      solar_power_kw: farmData.solar_power_kw || 450,
      egg_type: farmData.egg_type || 'Grade A Certified European Organic Eggs',
      layers_count: farmData.layers_count,
      broilers_count: farmData.broilers_count,
      layer_breed: farmData.layer_breed,
      broiler_breed: farmData.broiler_breed,
      has_layers: farmData.category === 'layers_eggs' || farmData.category === 'dual_layers_broilers' || !!farmData.layers_count,
      has_broilers: farmData.category === 'broilers' || farmData.category === 'dual_layers_broilers' || !!farmData.broilers_count,
    };

    setCycles((prev) => {
      const updated = [newFarm, ...prev];
      try {
        localStorage.setItem(STORAGE_PREFIX + 'cycles', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    const newNotice: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: 'investment_created',
      title: 'New Production Hub Added',
      message: `Added new production facility: ${newFarm.facility_name} (${newFarm.total_birds.toLocaleString()} birds) in ${newFarm.facility_location}`,
      userId: currentUser?.user_id || 'admin',
      userName: currentUser?.full_name || 'Administrator',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setAdminNotifications((prev) => [newNotice, ...prev]);
  };

  const updateAlaskaProgress = (progress: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(progress)));
    setCycles((prev) =>
      prev.map((c) => {
        if (c.id === 'cyc-alaska-01' || c.facility_location.toLowerCase().includes('alaska')) {
          return {
            ...c,
            construction_progress: clamped,
            current_stage: clamped >= 100 ? 'growth' : 'construction',
          };
        }
        return c;
      })
    );
  };

  const adjustUserBalance = async (
    userId: string,
    amount: number,
    balanceType: 'main' | 'earnings',
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    const userWal = wallets[userId];
    if (!userWal) {
      return { success: false, message: `Investor wallet for user ID ${userId} not found.` };
    }

    const currentBal = balanceType === 'main' ? userWal.main_balance : userWal.earnings_balance;
    const newBal = Math.max(0, Math.round((currentBal + amount) * 100) / 100);
    const actualDiff = Math.round((newBal - currentBal) * 100) / 100;

    if (actualDiff === 0 && amount !== 0) {
      return { success: false, message: 'Balance cannot be reduced below €0.00.' };
    }

    setWallets((prev) => ({
      ...prev,
      [userId]: {
        ...userWal,
        main_balance: balanceType === 'main' ? newBal : userWal.main_balance,
        earnings_balance: balanceType === 'earnings' ? newBal : userWal.earnings_balance,
        updated_at: new Date().toISOString(),
      },
    }));

    const isCredit = amount >= 0;
    const actionLabel = isCredit ? 'Credit (Deposit)' : 'Debit (Deduction)';
    const ref = `ADM-${isCredit ? 'CR' : 'DB'}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx: Transaction = {
      id: `tx-adm-${Date.now()}`,
      user_id: userId,
      amount: Math.abs(actualDiff),
      type: isCredit ? 'deposit' : 'withdrawal',
      status: 'successful',
      reference: ref,
      payment_gateway: 'internal',
      metadata: {
        adminAdjustment: true,
        balanceType,
        reason: reason || (isCredit ? 'Payment confirmed by Admin' : 'Manual balance adjustment by Admin'),
        previousBalance: currentBal,
        newBalance: newBal,
        adjustedBy: 'Elena Vance (Administrator)',
      },
      created_at: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      message: `Successfully executed ${actionLabel} of €${Math.abs(actualDiff).toFixed(2)} to ${balanceType} balance for ${userId}. New balance: €${newBal.toFixed(2)}.`,
    };
  };

  const updateUserDirectBalances = async (
    userId: string,
    balances: { main_balance?: number; earnings_balance?: number },
    confirmationReason?: string
  ): Promise<{ success: boolean; message: string }> => {
    const userWal = wallets[userId];
    if (!userWal) {
      return { success: false, message: `Investor wallet for user ID ${userId} not found.` };
    }

    const updatedMain = balances.main_balance !== undefined ? Math.max(0, Math.round(balances.main_balance * 100) / 100) : userWal.main_balance;
    const updatedEarnings = balances.earnings_balance !== undefined ? Math.max(0, Math.round(balances.earnings_balance * 100) / 100) : userWal.earnings_balance;

    const diffMain = updatedMain - userWal.main_balance;
    const diffEarnings = updatedEarnings - userWal.earnings_balance;

    setWallets((prev) => ({
      ...prev,
      [userId]: {
        ...userWal,
        main_balance: updatedMain,
        earnings_balance: updatedEarnings,
        updated_at: new Date().toISOString(),
      },
    }));

    const ref = `OFF-PLATFORM-${Date.now().toString().slice(-6)}`;
    const reasonText = confirmationReason || 'Off-platform payment confirmed by Administrator';

    const newTx: Transaction = {
      id: `tx-direct-${Date.now()}`,
      user_id: userId,
      amount: Math.abs(diffMain) || Math.abs(diffEarnings) || 0,
      type: diffMain >= 0 ? 'deposit' : 'withdrawal',
      status: 'successful',
      payment_gateway: 'crypto',
      reference: ref,
      metadata: {
        adminAdjustment: true,
        reason: reasonText,
        main_balance: updatedMain,
        earnings_balance: updatedEarnings,
      },
      created_at: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      message: `Balances successfully updated in database: Main Balance = €${updatedMain.toLocaleString('de-DE', { minimumFractionDigits: 2 })}, Earnings Balance = €${updatedEarnings.toLocaleString('de-DE', { minimumFractionDigits: 2 })}.`,
    };
  };

  const addFarmUpdate = (newUpdate: Omit<FarmUpdate, 'id' | 'created_at'>) => {
    const cycle = cycles.find((c) => c.id === newUpdate.cycle_id);
    const update: FarmUpdate = {
      ...newUpdate,
      id: `upd-${Date.now()}`,
      cycle_code: cycle?.cycle_code,
      created_at: new Date().toISOString(),
    };
    setFarmUpdates((prev) => [update, ...prev]);
  };

  const triggerMaturityPayout = async (
    investmentId: string
  ): Promise<{ success: boolean; message?: string }> => {
    const inv = investments.find((i) => i.id === investmentId);
    if (!inv) return { success: false, message: 'Investment not found' };
    if (inv.status !== 'active') return { success: false, message: 'Investment is already matured or closed' };

    const investorWal = wallets[inv.user_id];
    if (!investorWal) return { success: false, message: 'Investor wallet not found' };

    setWallets((prev) => ({
      ...prev,
      [inv.user_id]: {
        ...investorWal,
        locked_investment_balance: Math.max(0, investorWal.locked_investment_balance - inv.principal_amount),
        main_balance: investorWal.main_balance + inv.total_payout,
        earnings_balance: investorWal.earnings_balance + inv.expected_roi_amount,
        updated_at: new Date().toISOString(),
      },
    }));

    setInvestments((prev) =>
      prev.map((i) => (i.id === investmentId ? { ...i, status: 'matured' } : i))
    );

    const ref = `PAY-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;
    const payTx: Transaction = {
      id: `tx-${Date.now()}`,
      user_id: inv.user_id,
      amount: inv.total_payout,
      type: 'payout',
      status: 'successful',
      reference: ref,
      payment_gateway: 'internal',
      metadata: {
        investmentId: inv.id,
        planTitle: inv.plan_title,
        principalReturned: inv.principal_amount,
        profitPaid: inv.expected_roi_amount,
      },
      created_at: new Date().toISOString(),
    };

    setTransactions((prev) => [payTx, ...prev]);

    const investorProfile = profiles.find((p) => p.user_id === inv.user_id);
    const recipientEmail = investorProfile?.email || 'curtis.investor@birdgrow.eu';
    const recipientName = investorProfile?.full_name || 'Valued Investor';

    const emailRecord = buildInvestmentMaturedEmail({
      recipientName,
      recipientEmail,
      planTitle: inv.plan_title,
      principalAmount: inv.principal_amount,
      profitAmount: inv.expected_roi_amount,
      totalPayout: inv.total_payout,
      currencySymbol: '€',
      investmentId: inv.id,
      txRef: ref,
    });
    dispatchEmail(emailRecord);

    return {
      success: true,
      message: `Total payout of €${inv.total_payout.toFixed(2)} credited to investor wallet and official confirmation email dispatched to ${recipientEmail} (Ref: ${ref}).`,
    };
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const simulateWebhookEvent = (
    gateway: 'stripe' | 'sepa' | 'crypto',
    eventType: string,
    amount: number
  ): { success: boolean; log: string } => {
    const targetUserId = currentUserId || 'usr-investor-01';
    const ref = `${gateway.toUpperCase()}-WH-${Date.now().toString().slice(-6)}`;

    const newTx: Transaction = {
      id: `tx-wh-${Date.now()}`,
      user_id: targetUserId,
      amount,
      type: 'deposit',
      status: 'successful',
      reference: ref,
      payment_gateway: gateway === 'crypto' ? 'crypto' : gateway === 'stripe' ? 'stripe' : 'sepa',
      metadata: {
        eventType,
        webhookReceivedAt: new Date().toISOString(),
        verifiedSignature: true,
      },
      created_at: new Date().toISOString(),
    };

    setWallets((prev) => {
      const userWal = prev[targetUserId] || {
        id: `wal-${Date.now()}`,
        user_id: targetUserId,
        main_balance: 0,
        earnings_balance: 0,
        locked_investment_balance: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return {
        ...prev,
        [targetUserId]: {
          ...userWal,
          main_balance: userWal.main_balance + amount,
          updated_at: new Date().toISOString(),
        },
      };
    });

    setTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      log: `Webhook [${gateway.toUpperCase()}] event '${eventType}' processed successfully. €${amount.toFixed(2)} credited. Ref: ${ref}`,
    };
  };

  const totalTvl = Object.values(wallets).reduce(
    (acc, w) => acc + (w.locked_investment_balance || 0) + (w.main_balance || 0),
    0
  );

  const totalPayoutsIssued = transactions
    .filter((t) => t.type === 'payout' && t.status === 'successful')
    .reduce((acc, t) => acc + t.amount, 0);

  const activeInvestorCount = profiles.filter((p) => p.role === 'user').length;

  const openChat = (tab: 'group' | 'direct' | 'bot' = 'group', directMemberId?: string) => {
    setActiveChatTab(tab);
    if (directMemberId) {
      setSelectedDirectMemberId(directMemberId);
    }
    if (tab === 'direct') {
      setHasViewedDirect(true);
    }
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const sendGroupMessage = (content: string, replyTo?: ChatMessage['replyTo']) => {
    const senderName = currentUser?.full_name || 'Curtis Vance';
    const senderId = currentUser?.user_id || 'usr-investor-01';
    const role: 'investor' | 'admin' = isAdmin ? 'admin' : 'investor';

    const userActiveInvestments = investments.filter(
      (i) => i.user_id === senderId && (i.status === 'active' || i.status === 'pending')
    );
    const totalInvested = userActiveInvestments.reduce((sum, i) => sum + i.principal_amount, 0);
    const planTitle = userActiveInvestments[0]?.plan_title || 'Bio-Broiler Rapid Cycle';

    const newMsg: ChatMessage = {
      id: `grp-msg-${Date.now()}`,
      senderId,
      senderName,
      senderRole: role,
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      senderCountry: currentUser?.kyc_data?.country || 'United Kingdom',
      senderBadge: role === 'admin' ? 'Operations Lead' : totalInvested > 0 ? `Verified Backer (€${totalInvested.toLocaleString()})` : 'Investor',
      senderInvestedAmount: totalInvested,
      senderPlanTitle: planTitle,
      content,
      timestamp: new Date().toISOString(),
      type: 'group',
      replyTo,
    };

    setGroupChatMessages((prev) => {
      const updated = [...prev, newMsg];
      const validWithin24h = updated.filter((m) => isWithin24Hours(m.timestamp));
      localStorage.setItem(STORAGE_PREFIX + 'group_chat', JSON.stringify(validWithin24h));
      return validWithin24h;
    });

    const lower = content.toLowerCase();
    const asksBot =
      lower.includes('@bot') ||
      lower.includes('@agribot') ||
      lower.includes('bot') ||
      lower.includes('?') ||
      lower.includes('alaska') ||
      lower.includes('tier') ||
      lower.includes('roi') ||
      lower.includes('minimum');

    if (asksBot) {
      setTimeout(() => {
        const botReply = generateAgriBotReply(content, senderName);
        const botMsg: ChatMessage = {
          id: `grp-bot-${Date.now()}`,
          senderId: 'usr-agribot',
          senderName: 'AgriBot AI',
          senderRole: 'bot',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
          senderCountry: 'BirdGrow AI',
          senderBadge: 'Official AI Advisor',
          content: botReply,
          timestamp: new Date().toISOString(),
          type: 'group',
          isAiBot: true,
          replyTo: {
            id: newMsg.id,
            senderName: newMsg.senderName,
            content: newMsg.content.slice(0, 70) + (newMsg.content.length > 70 ? '...' : ''),
          },
        };

        setGroupChatMessages((prev) => {
          const withBot = [...prev, botMsg];
          localStorage.setItem(STORAGE_PREFIX + 'group_chat', JSON.stringify(withBot));
          return withBot;
        });
      }, 900);
    }
  };

  const sendDirectMessage = (recipientId: string, content: string) => {
    const senderName = currentUser?.full_name || 'Curtis Vance';
    const senderId = currentUser?.user_id || 'usr-investor-01';

    const userActiveInvestments = investments.filter(
      (i) => i.user_id === senderId && (i.status === 'active' || i.status === 'pending')
    );
    const totalInvested = userActiveInvestments.reduce((sum, i) => sum + i.principal_amount, 0);

    const newMsg: ChatMessage = {
      id: `dm-${Date.now()}`,
      senderId,
      senderName,
      senderRole: isAdmin ? 'admin' : 'investor',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      senderCountry: currentUser?.kyc_data?.country || 'United Kingdom',
      senderBadge: `Verified Backer (€${totalInvested.toLocaleString()})`,
      content,
      timestamp: new Date().toISOString(),
      type: 'direct',
      recipientId,
    };

    setDirectChatMessages((prev) => {
      const thread = prev[recipientId] || [];
      const updated = {
        ...prev,
        [recipientId]: [...thread, newMsg],
      };
      localStorage.setItem(STORAGE_PREFIX + 'direct_chat', JSON.stringify(updated));
      return updated;
    });

    if (recipientId === 'usr-agribot') {
      setTimeout(() => {
        const botResponse = generateAgriBotReply(content, senderName);
        const botMsg: ChatMessage = {
          id: `dm-bot-${Date.now()}`,
          senderId: 'usr-agribot',
          senderName: 'AgriBot AI',
          senderRole: 'bot',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
          content: botResponse,
          timestamp: new Date().toISOString(),
          type: 'direct',
          recipientId: senderId,
          isAiBot: true,
        };

        setDirectChatMessages((prev) => {
          const thread = prev[recipientId] || [];
          const updated = {
            ...prev,
            [recipientId]: [...thread, botMsg],
          };
          localStorage.setItem(STORAGE_PREFIX + 'direct_chat', JSON.stringify(updated));
          return updated;
        });
      }, 700);
    } else {
      const recipientMember = chatMembers.find((m) => m.id === recipientId);
      if (recipientMember) {
        setTimeout(() => {
          const replyText = generateInvestorReply(recipientMember, content);
          const replyMsg: ChatMessage = {
            id: `dm-rep-${Date.now()}`,
            senderId: recipientMember.id,
            senderName: recipientMember.name,
            senderRole: recipientMember.role,
            senderAvatar: recipientMember.avatar,
            senderCountry: recipientMember.country,
            senderBadge: recipientMember.badge,
            content: replyText,
            timestamp: new Date().toISOString(),
            type: 'direct',
            recipientId: senderId,
          };

          setDirectChatMessages((prev) => {
            const thread = prev[recipientId] || [];
            const updated = {
              ...prev,
              [recipientId]: [...thread, replyMsg],
            };
            localStorage.setItem(STORAGE_PREFIX + 'direct_chat', JSON.stringify(updated));
            return updated;
          });
        }, 1500);
      }
    }
  };

  useEffect(() => {
    const checkMaturities = () => {
      const now = Date.now();
      let hasChanges = false;
      let updatedWallets = { ...wallets };
      let newTxs: Transaction[] = [];
      let autoMaturedList: { inv: Investment; ref: string }[] = [];

      const updatedInvestments = investments.map((inv) => {
        if (inv.status === 'active') {
          const matTime = new Date(inv.maturity_date).getTime();
          if (matTime <= now) {
            hasChanges = true;
            const userWal = updatedWallets[inv.user_id];
            if (userWal) {
              updatedWallets[inv.user_id] = {
                ...userWal,
                locked_investment_balance: Math.max(0, userWal.locked_investment_balance - inv.principal_amount),
                main_balance: Math.round((userWal.main_balance + inv.total_payout) * 100) / 100,
                earnings_balance: Math.round((userWal.earnings_balance + inv.expected_roi_amount) * 100) / 100,
                updated_at: new Date().toISOString(),
              };
            }
            const ref = `PAY-AUTO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;
            newTxs.push({
              id: `tx-auto-${Date.now()}-${inv.id}`,
              user_id: inv.user_id,
              amount: inv.total_payout,
              type: 'payout',
              status: 'successful',
              reference: ref,
              payment_gateway: 'internal',
              metadata: {
                investmentId: inv.id,
                planTitle: inv.plan_title,
                principalReturned: inv.principal_amount,
                profitPaid: inv.expected_roi_amount,
                autoMatured: true,
              },
              created_at: new Date().toISOString(),
            });
            autoMaturedList.push({ inv, ref });
            return { ...inv, status: 'matured' as const };
          }
        }
        return inv;
      });

      if (hasChanges) {
        setWallets(updatedWallets);
        setInvestments(updatedInvestments);
        if (newTxs.length > 0) {
          setTransactions((prev) => [...newTxs, ...prev]);
        }
        autoMaturedList.forEach(({ inv, ref }) => {
          const investorProfile = profiles.find((p) => p.user_id === inv.user_id);
          const recipientEmail = investorProfile?.email || 'curtis.investor@birdgrow.eu';
          const recipientName = investorProfile?.full_name || 'Valued Investor';

          const emailRecord = buildInvestmentMaturedEmail({
            recipientName,
            recipientEmail,
            planTitle: inv.plan_title,
            principalAmount: inv.principal_amount,
            profitAmount: inv.expected_roi_amount,
            totalPayout: inv.total_payout,
            currencySymbol: '€',
            investmentId: inv.id,
            txRef: ref,
          });
          dispatchEmail(emailRecord);
        });
      }
    };

    checkMaturities();
    const interval = setInterval(checkMaturities, 10000);
    return () => clearInterval(interval);
  }, [investments, wallets, profiles]);

  return (
    <PlatformContext.Provider
      value={{
        language,
        setLanguage,
        t,
        selectedLanguage,
        setSelectedLanguage,
        languageCounts,
        currency,
        setCurrency,
        exchangeRates,
        convertAmount,
        convertToGbpAmount,
        formatCurrentCurrency,
        formatRawCurrency: formatCurrentRawCurrency,
        formatCurrentCurrencyCompact,
        currencySymbol,
        currentUser,
        currentWallet,
        currentPayoutAccount,
        isAuthenticated,
        isAdmin,
        loginAsInvestor,
        loginAsAdmin,
        login,
        register,
        logout,
        resetPassword,
        adminCredentials,
        updateAdminCredentials,
        verifyAdminLogin,
        profiles,
        wallets,
        plans,
        cycles,
        investments,
        transactions,
        farmUpdates,
        settings,
        adminNotifications,
        unreadNotificationCount,
        markNotificationRead,
        clearAllNotifications,
        deposit,
        confirmDeposit,
        denyDeposit,
        requestWithdrawal,
        executeInvestment,
        submitKyc,
        savePayoutAccount,
        reviewKyc,
        updateTransactionStatus,
        createPlan,
        updatePlan,
        archivePlan,
        updateCycleStage,
        addNewFarm,
        updateAlaskaProgress,
        adjustUserBalance,
        updateUserDirectBalances,
        addFarmUpdate,
        triggerMaturityPayout,
        updateSettings,
        simulateWebhookEvent,
        approveFullWithdrawal,
        declineWithdrawal,
        partialPayoutWithdrawal,
        adminFeePurse,
        sweepFeePurse,
        totalTvl,
        totalPayoutsIssued,
        activeInvestorCount,
        chatMembers,
        groupChatMessages,
        visibleGroupMessages,
        directChatMessages,
        isChatOpen,
        activeChatTab,
        selectedDirectMemberId,
        unreadDirectCount,
        openChat,
        closeChat,
        setActiveChatTab,
        setSelectedDirectMemberId,
        sendGroupMessage,
        sendDirectMessage,
        reviews,
        hasInvested,
        hasWithdrawnProfit,
        userEligiblePlansForReview,
        submitReview,
        approveReview,
        rejectReview,
        deleteReview,
        humanInquiries,
        humanChatMessages,
        isHumanTyping,
        sendHumanSupportChatMessage,
        submitHumanSupportInquiry,
        replyHumanSupportInquiry,
        addUser,
        deleteUser,
        emailDispatches,
        dispatchEmail,
        referralRelationships,
        qualifiedInvestments,
        milestoneRewards,
        userReferralSummary,
        addReferralRelationship,
        claimReferralReward,
        qualifyReferralInvestment,
        reverseReferralInvestment,
        adminPayMilestoneReward,
        adminReverseMilestoneReward,
        simulateReferralInvestment,
        bugReports,
        submitBugReport,
        updateBugReportStatus,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};