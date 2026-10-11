import React, { useState, useEffect, useMemo } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  formatEuro,
  formatDate,
  calculateCycleProgress,
  calculateDaysRemaining,
} from '../../lib/formatters';
import {
  Wallet as WalletIcon,
  Lock,
  TrendingUp,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Clock,
  Activity,
  Download,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Calendar,
  Layers,
  MessageSquare,
  Users,
  Award,
  Sparkles,
  Coins,
  CheckCircle2,
  Mail,
  Check,
  X,
  Share2,
  ArrowRight,
  Eye,
  EyeOff,
  Key,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { EmailNotificationRecord } from '../../types';
import { InvestmentPlan, Transaction, Currency } from '../../types';
import { ActivityHistory } from './ActivityHistory';
import { ReferralDashboard } from '../referrals/ReferralDashboard';
import { formatReferralCurrency, formatReferralCompact } from '../../lib/referralEngine';

const formatNaira = formatReferralCurrency;
const formatNairaCompact = formatReferralCompact;

// Live ticking countdown timer for active contracts building anticipation until profit drops
const ContractCountdown: React.FC<{
  maturityDate: string;
  isMatured: boolean;
  expectedProfitFormatted?: string;
  capitalFormatted?: string;
  totalPayoutFormatted?: string;
}> = ({
  maturityDate,
  isMatured,
  expectedProfitFormatted,
  capitalFormatted,
  totalPayoutFormatted,
}) => {
  const { t } = usePlatform();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; isPast: boolean }>(() => {
    const diff = new Date(maturityDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isPast: false,
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(maturityDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          isPast: false,
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [maturityDate]);

  if (isMatured || timeLeft.isPast) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>{t.dashComplete || 'Harvest Tenure Complete · Total Payout (Capital + Profit) Credited to Wallet Balance'}</span>
      </div>
    );
  }

  return (
    <div className="bg-[#11271D] text-white p-3 rounded-xl border border-[#C5A059]/40 space-y-1.5 shadow-xs">
      <div className="text-[10px] font-mono uppercase text-[#C5A059] flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-bold">
          <Clock className="w-3.5 h-3.5 text-[#C5A059] animate-spin" style={{ animationDuration: '6s' }} />
          <span>{t.dashCountdown || 'Settlement Countdown'}</span>
        </span>
        <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 animate-pulse">
          {t.dashAutoCredit || 'Auto-Credited at 00:00'}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-xs">
        <div className="bg-white/10 rounded-lg py-1 px-1">
          <span className="font-extrabold text-sm block">{timeLeft.days}</span>
          <span className="text-[8px] text-white/60 tracking-wider">{t.dashDays || 'DAYS'}</span>
        </div>
        <div className="bg-white/10 rounded-lg py-1 px-1">
          <span className="font-extrabold text-sm block">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-[8px] text-white/60 tracking-wider">{t.dashHours || 'HOURS'}</span>
        </div>
        <div className="bg-white/10 rounded-lg py-1 px-1">
          <span className="font-extrabold text-sm block">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-[8px] text-white/60 tracking-wider">{t.dashMins || 'MINS'}</span>
        </div>
        <div className="bg-white/10 rounded-lg py-1 px-1">
          <span className="font-extrabold text-sm text-[#C5A059] block">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-[8px] text-[#C5A059] tracking-wider">{t.dashSecs || 'SECS'}</span>
        </div>
      </div>

      {totalPayoutFormatted ? (
        <div className="text-[11px] text-white/90 flex flex-wrap items-center justify-between gap-1 pt-1.5 border-t border-white/10">
          <span className="text-white/70 font-medium">Total payout:</span>
          <div className="flex items-center gap-1.5 font-mono">
            <strong className="text-[#C5A059] font-extrabold text-xs">
              {totalPayoutFormatted}
            </strong>
            {capitalFormatted && expectedProfitFormatted && (
              <span className="text-[10px] text-white/60 font-medium">
                ({capitalFormatted} capital + <span className="text-emerald-400 font-semibold">+{expectedProfitFormatted} profit</span>)
              </span>
            )}
          </div>
        </div>
      ) : expectedProfitFormatted ? (
        <div className="text-[11px] text-white/80 flex items-center justify-between pt-1 border-t border-white/10">
          <span className="text-white/70">Total payout:</span>
          <strong className="text-emerald-400 font-mono">+{expectedProfitFormatted}</strong>
        </div>
      ) : null}
    </div>
  );
};

interface InvestorDashboardProps {
  onOpenDeposit: () => void;
  onOpenWithdrawal: () => void;
  onOpenInvest: (plan?: InvestmentPlan) => void;
  onOpenKyc: () => void;
  onOpenReview?: () => void;
}

export const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  onOpenDeposit,
  onOpenWithdrawal,
  onOpenInvest,
  onOpenKyc,
  onOpenReview,
}) => {
  const {
    currentUser,
    currentWallet,
    investments,
    transactions,
    farmUpdates,
    plans,
    cycles,
    language,
    currency,
    currencySymbol,
    setCurrency,
    formatCurrentCurrency,
    emailDispatches,
    userReferralSummary,
    t,
  } = usePlatform();

  const [selectedUserEmailModal, setSelectedUserEmailModal] = useState<EmailNotificationRecord | null>(null);

  // Tab filtering for dashboard sections
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'activity' | 'ledger' | 'referrals' | 'security'>(
    'overview'
  );

  // Security & Password states
  const [currentPwd, setCurrentPwd] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [newPwd, setNewPwd] = useState('');
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdFeedback, setPwdFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Ledger search & filters
  const [txSearch, setTxSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'investment' | 'payout'>('all');

  const userInvestments = investments.filter((i) => i.user_id === currentUser?.user_id);
  const activeContracts = userInvestments.filter((i) => i.status === 'active');
  const userTransactions = transactions.filter((t) => t.user_id === currentUser?.user_id);
  const hasCompletedPayout = userTransactions.some(
    (t) => t.type === 'withdrawal' && t.status === 'successful'
  );
  const isEligibleForReview = activeContracts.length > 0 || hasCompletedPayout;

  // Total number of birds in the farm from all the facilities (automatically updates on farm additions)
  const totalBirdsAllFacilities = useMemo(() => {
    return cycles.reduce((sum, c) => sum + (c.total_birds || 0), 0);
  }, [cycles]);

  // Official Email Dispatches addressed to this investor
  const userEmails = useMemo(() => {
    if (!currentUser) return [];
    return emailDispatches.filter(
      (e) =>
        e.recipientEmail.toLowerCase() === currentUser.email.toLowerCase() ||
        e.recipientName.toLowerCase() === currentUser.full_name?.toLowerCase() ||
        currentUser.role === 'admin'
    );
  }, [emailDispatches, currentUser]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return userTransactions.filter((tx) => {
      const matchesSearch =
        tx.reference.toLowerCase().includes(txSearch.toLowerCase()) ||
        tx.type.toLowerCase().includes(txSearch.toLowerCase());
      const matchesType = txTypeFilter === 'all' || tx.type === txTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [userTransactions, txSearch, txTypeFilter]);

  // CSV export handler
  const handleExportCsv = () => {
    const headers = ['Reference', 'Date', 'Type', 'Amount (EUR)', 'Gateway', 'Status'];
    const rows = filteredTransactions.map((t) => [
      t.reference,
      t.created_at,
      t.type,
      t.amount.toFixed(2),
      t.payment_gateway,
      t.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `birdgrow_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const kycStatus = currentUser?.kyc_status || 'unverified';

  return (
    <div className="py-6 sm:py-8 bg-[#F7F6F2] min-h-[calc(100vh-140px)]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Breadcrumb & User Welcome Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">
              {t.navInvestorDesk || 'Investor Portal'} / {t.dashOverview || 'Overview'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B] tracking-tight">
              {t.dashWelcome || 'Welcome,'} {currentUser?.full_name || 'Investor'}
            </h1>
          </div>

          {/* Currency Switcher & KYC Status Indicator & Quick Trigger */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Currency Switcher */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#DCDAD0] shadow-2xs">
              {(['GBP', 'EUR', 'USD', 'JPY'] as Currency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    currency === c
                      ? 'bg-[#1B3B2B] text-white shadow-2xs'
                      : 'text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#F7F6F2]'
                  }`}
                  title={`View in ${c}`}
                >
                  {c === 'GBP' ? '£ GBP' : c === 'EUR' ? '€ EUR' : '$ USD'}
                </button>
              ))}
            </div>

            {/* Total Number of Birds in the Farm Badge with slow blinking green dot */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#DCDAD0] text-xs font-mono font-bold text-[#1B3B2B] shadow-2xs min-h-[34px]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-slow-blink shadow-xs shrink-0" />
              <span className="text-[#5C6572] font-sans hidden sm:inline">{t.heroTotalBirdsLabel || 'Total Birds in Farm'}:</span>
              <span className="tabular-nums font-extrabold text-[#1B3B2B]">{totalBirdsAllFacilities.toLocaleString()}</span>
            </div>

            <div
              onClick={onOpenKyc}
              className={`min-h-[34px] flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                kycStatus === 'verified'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : kycStatus === 'pending'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                KYC: <strong>{kycStatus.toUpperCase()}</strong>
              </span>
              {kycStatus !== 'verified' && <span className="underline ml-1">Complete</span>}
            </div>

            {/* Quick Action: New Investment */}
            <button
              onClick={() => onOpenInvest()}
              className="min-h-[38px] px-4 py-2 bg-[#1B3B2B] hover:bg-[#11271D] text-white font-semibold rounded-lg text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#C5A059]" />
              <span>{t.dashAllocateCapital || 'New Allocation'}</span>
            </button>
          </div>
        </div>

        {/* 1. Core Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1: Main Balance */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E3D8] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">
                {t.dashAvailableBalance || 'Main Wallet Balance'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#F7F6F2] border border-[#E5E3D8] flex items-center justify-center text-[#1B3B2B]">
                <WalletIcon className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3 sm:my-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B] font-mono tabular-nums tracking-tight">
                {formatCurrentCurrency(currentWallet?.main_balance || 0)}
              </div>
              <div className="text-xs text-[#5C6572] mt-1">Available for immediate withdrawal or reinvestment</div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#F0EFEA]">
              <button
                onClick={onOpenDeposit}
                className="min-h-[38px] flex-1 py-1.5 bg-[#1B3B2B] hover:bg-[#11271D] text-white rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>{t.dashDepositFunds || 'Deposit'}</span>
              </button>
              <button
                onClick={onOpenWithdrawal}
                className="min-h-[38px] flex-1 py-1.5 bg-white hover:bg-[#F7F6F2] text-[#1B3B2B] border border-[#DCDAD0] rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{t.dashWithdrawFunds || 'Withdraw'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Active Locked Capital */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E3D8] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">
                {t.dashLockedCapital || 'Active Locked Capital'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#F7F6F2] border border-[#E5E3D8] flex items-center justify-center text-[#1B3B2B]">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3 sm:my-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B] font-mono tabular-nums tracking-tight">
                {formatCurrentCurrency(currentWallet?.locked_investment_balance || 0)}
              </div>
              <div className="text-xs text-[#5C6572] mt-1">
                Deployed across {activeContracts.length} live biological production {activeContracts.length === 1 ? 'batch' : 'batches'}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#5C6572] pt-3 border-t border-[#F0EFEA]">
              <span>{t.dashActiveContracts || 'Active Contracts'}</span>
              <span className="font-mono font-bold text-[#1B3B2B] tabular-nums">{activeContracts.length}</span>
            </div>
          </div>

          {/* Card 3: Lifetime Harvest Earnings */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E3D8] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">
                {t.dashTotalEarnings || 'Total Lifetime Earnings'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#F7F6F2] border border-[#E5E3D8] flex items-center justify-center text-[#1B3B2B]">
                <TrendingUp className="w-4 h-4 text-[#16A34A]" />
              </div>
            </div>

            <div className="my-3 sm:my-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#16A34A] font-mono tabular-nums tracking-tight">
                +{formatCurrentCurrency(currentWallet?.earnings_balance || 0)}
              </div>
              <div className="text-xs text-[#5C6572] mt-1">Net ROI realized & paid out to date</div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#5C6572] pt-3 border-t border-[#F0EFEA]">
              <span>Average Cycle ROI</span>
              <span className="font-mono font-bold text-[#16A34A] tabular-nums">+12.4% net</span>
            </div>
          </div>

        </div>

        {/* Verified Profit Withdrawal Review Prompt Banner */}
        {isEligibleForReview && onOpenReview && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border-2 border-[#C5A059]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-[#1B3B2B] flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-[#1B3B2B]">
                    Profit Withdrawal Completed — You're Eligible to Leave a Review!
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#16A34A] text-white">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-[#5C6572] mt-0.5">
                  As an investor who has realized and withdrawn profit, your feedback will carry the verified badge and automatically be labeled under your investment tier on the platform.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenReview}
              className="px-4 py-2.5 bg-[#1B3B2B] hover:bg-[#11271D] text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Drop Verified Review</span>
            </button>
          </div>
        )}

        {/* Tab Navigation for In-Depth Views */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#E5E3D8] pb-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`min-h-[40px] px-3.5 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            {t.dashOverview || 'Overview & Analytics'}
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`min-h-[40px] px-3.5 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'activity'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            {t.dashActivity || 'Activity History'}
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`min-h-[40px] px-3.5 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'contracts'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            {t.dashInvestments || 'Active Holdings'} ({activeContracts.length})
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`min-h-[40px] px-3.5 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'ledger'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            {t.dashWalletLedger || 'Ledger & Transactions'} ({userTransactions.length})
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`min-h-[40px] px-3.5 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'referrals'
                ? 'border-[#C5A059] text-[#11271D] font-black'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.dashReferrals || 'Referral Rewards'}</span>
            {userReferralSummary && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#11271D] text-[#C5A059] font-black">
                {formatNairaCompact(userReferralSummary.totalQualifiedVolume)}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`min-h-[40px] px-3.5 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Security &amp; Password</span>
          </button>
        </div>

        {/* ================================================================ */}
        {/* TAB 1: OVERVIEW & ANALYTICS                                       */}
        {/* ================================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Referral Milestone Progress Teaser Banner */}
            {userReferralSummary && (
              <div className="bg-gradient-to-r from-[#11271D] via-[#1A382A] to-[#11271D] text-white p-5 rounded-2xl border border-[#C5A059]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#C5A059]" />
                      <span>Referral Rewards Program</span>
                    </span>
                    <span className="text-white/40">·</span>
                    <span className="text-[10px] font-bold text-emerald-400">
                      {userReferralSummary.referrerType === 'investor' ? 'Investor Referrer (Top Rates)' : 'Basic Referrer'}
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white flex flex-wrap items-baseline gap-2">
                    <span>Qualified Volume: <strong className="font-mono text-[#C5A059]">{formatNaira(userReferralSummary.totalQualifiedVolume)}</strong></span>
                    {userReferralSummary.nextMilestone && (
                      <span className="text-xs text-[#A7B6AB]">
                        ({formatNaira(userReferralSummary.volumeNeededForNextMilestone)} more to unlock {userReferralSummary.nextMilestone.shortLabel} reward of {formatNaira(userReferralSummary.referrerType === 'investor' ? userReferralSummary.nextMilestone.investorReward : userReferralSummary.nextMilestone.basicReward)})
                      </span>
                    )}
                  </div>
                  <div className="w-full max-w-md bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#C5A059] to-emerald-400 h-full rounded-full transition-all"
                      style={{ width: `${userReferralSummary.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('referrals')}
                    className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38F48] text-[#11271D] text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <span>View Referral Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
            {/* Executive Portfolio Capital Breakdown (No Graphs) */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1B3B2B]">Portfolio Capital & Asset Allocation</h3>
                  <p className="text-xs text-[#5C6572]">
                    Consolidated balance, locked biological production batches, and realized contractual harvest returns
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Active Capital Secured
                  </span>
                </div>
              </div>

              {/* Statistical Capital Summary Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E5E3D8] space-y-1">
                  <span className="text-[11px] font-semibold text-[#5C6572] uppercase">Total Portfolio Capital</span>
                  <div className="text-2xl font-extrabold text-[#1B3B2B] font-mono tabular-nums">
                    {formatCurrentCurrency((currentWallet?.main_balance || 0) + (currentWallet?.locked_investment_balance || 0))}
                  </div>
                  <div className="text-[10px] text-[#5C6572]">Liquid wallet + active batches</div>
                </div>

                <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E5E3D8] space-y-1">
                  <span className="text-[11px] font-semibold text-[#5C6572] uppercase">Locked Escrow Capital</span>
                  <div className="text-2xl font-extrabold text-[#1B3B2B] font-mono tabular-nums">
                    {formatCurrentCurrency(currentWallet?.locked_investment_balance || 0)}
                  </div>
                  <div className="text-[10px] text-[#5C6572]">{activeContracts.length} live growth contracts</div>
                </div>

                <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E5E3D8] space-y-1">
                  <span className="text-[11px] font-semibold text-[#5C6572] uppercase">Total Lifetime ROI</span>
                  <div className="text-2xl font-extrabold text-[#16A34A] font-mono tabular-nums">
                    +{formatCurrentCurrency(currentWallet?.earnings_balance || 0)}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Credited to wallet</div>
                </div>

                <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E5E3D8] space-y-1">
                  <span className="text-[11px] font-semibold text-[#5C6572] uppercase">Pending Harvest Profit</span>
                  <div className="text-2xl font-extrabold text-[#C5A059] font-mono tabular-nums">
                    +{formatCurrentCurrency(activeContracts.reduce((sum, i) => sum + i.expected_roi_amount, 0))}
                  </div>
                  <div className="text-[10px] text-[#5C6572]">Maturing across batches</div>
                </div>
              </div>
            </div>

            {/* Active Production Batches */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                <div>
                  <h4 className="text-base font-bold text-[#1B3B2B]">Active Production Batches</h4>
                  <span className="text-xs text-[#5C6572]">Capital locked in ongoing growth cycles</span>
                </div>
                <button
                  onClick={() => setActiveTab('contracts')}
                  className="text-xs font-semibold text-[#1B3B2B] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({activeContracts.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeContracts.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#5C6572]">
                  No active production contracts. Click "New Allocation" to invest.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeContracts.map((inv) => {
                    const progress = calculateCycleProgress(inv.start_date, inv.maturity_date);
                    const daysLeft = calculateDaysRemaining(inv.maturity_date);
                    return (
                      <div key={inv.id} className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E5E3D8] space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-bold text-[#1B3B2B]">{inv.plan_title}</div>
                            <div className="text-xs text-[#5C6572] flex items-center gap-2 mt-0.5">
                              <span className="font-mono">{inv.cycle_code}</span>
                              <span>·</span>
                              <span>{inv.facility_location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-[#1B3B2B] tabular-nums block">
                              Total: {formatCurrentCurrency(inv.total_payout)}
                            </span>
                            <div className="text-[10px] text-[#5C6572]">
                              {formatCurrentCurrency(inv.principal_amount)} cap + <span className="text-[#16A34A] font-semibold">+{formatCurrentCurrency(inv.expected_roi_amount)} ROI</span>
                            </div>
                          </div>
                        </div>

                        {/* Live Ticking Countdown to Total Payout Drop */}
                        <ContractCountdown
                          maturityDate={inv.maturity_date}
                          isMatured={inv.status === 'matured'}
                          capitalFormatted={formatCurrentCurrency(inv.principal_amount)}
                          expectedProfitFormatted={formatCurrentCurrency(inv.expected_roi_amount)}
                          totalPayoutFormatted={formatCurrentCurrency(inv.total_payout)}
                        />

                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-[#5C6572] font-mono">
                            <span>Maturation: {progress}%</span>
                            <span>{daysLeft} days remaining</span>
                          </div>
                          <div className="w-full bg-[#DCDAD0] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#1B3B2B] h-full rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Overview Activity History Section */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base font-bold text-[#1B3B2B]">Recent Account Events</h4>
                  <p className="text-xs text-[#5C6572]">
                    Chronological activity log of deposits, harvest completions, and withdrawals
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('activity')}
                  className="px-3.5 py-1.5 bg-[#F7F6F2] hover:bg-[#EAE8E0] text-[#1B3B2B] text-xs font-bold rounded-lg border border-[#DCDAD0] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Full Activity Stream</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <ActivityHistory
                compact={true}
                maxItems={3}
                onOpenDeposit={onOpenDeposit}
                onOpenWithdrawal={onOpenWithdrawal}
                onOpenInvest={() => onOpenInvest()}
                onOpenReview={onOpenReview}
              />
            </div>

            {/* Available Investment Plans (Open Production Horizons) */}
            <div id="investor-plans" className="pt-6 border-t border-[#E5E3D8] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Live Agricultural Production Tiers</span>
                  </div>
                  <h4 className="text-base font-bold text-[#1B3B2B] mt-0.5">Investment Plans Ready for Capital Allocation</h4>
                  <p className="text-xs text-[#5C6572]">
                    Select any curated European poultry production cycle to immediately allocate liquid balance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenInvest()}
                  className="self-start sm:self-auto px-3.5 py-1.5 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Custom Allocation</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.filter((p) => p.status === 'active').map((plan) => {
                  return (
                    <div
                      key={plan.id}
                      className="bg-white rounded-xl border border-[#E5E3D8] hover:border-[#C5A059] hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3 cursor-pointer group"
                      onClick={() => onOpenInvest(plan)}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="font-mono text-[#5C6572] font-semibold">{plan.duration_days} Days</span>
                          <span className="text-[#16A34A] font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            +{plan.roi_percentage}% ROI
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-[#1B3B2B] group-hover:text-[#C5A059] transition-colors">
                          {plan.title}
                        </h5>
                        <p className="text-[11px] text-[#5C6572] line-clamp-2 mt-1 leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#F0EFEA] space-y-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#5C6572]">Entry From:</span>
                          <span className="font-mono font-bold text-[#1B3B2B]">
                            {formatCurrentCurrency(plan.min_amount)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenInvest(plan);
                          }}
                          className="w-full py-2 bg-[#1B3B2B] group-hover:bg-[#C5A059] group-hover:text-[#11271D] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Allocate Capital</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ================================================================ */}
        {/* TAB: ACTIVITY HISTORY (FULL CHRONOLOGICAL TIMELINE)               */}
        {/* ================================================================ */}
        {activeTab === 'activity' && (
          <ActivityHistory
            compact={false}
            onOpenDeposit={onOpenDeposit}
            onOpenWithdrawal={onOpenWithdrawal}
            onOpenInvest={() => onOpenInvest()}
            onOpenReview={onOpenReview}
          />
        )}

        {/* ================================================================ */}
        {/* TAB 2: ACTIVE HOLDINGS / CONTRACTS                                */}
        {/* ================================================================ */}
        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#1B3B2B]">Active Production Contracts</h3>
                <p className="text-xs text-[#5C6572]">
                  Legal contracts underwritten by European forward off-take commitments
                </p>
              </div>
              <button
                onClick={() => onOpenInvest()}
                className="px-3.5 py-2 bg-[#1B3B2B] text-white text-xs font-semibold rounded-lg hover:bg-[#11271D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Allocate Capital</span>
              </button>
            </div>

            {userInvestments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-[#E5E3D8] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#F7F6F2] flex items-center justify-center mx-auto text-[#5C6572]">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-[#1B3B2B]">No Investment Contracts Found</div>
                <p className="text-xs text-[#5C6572] max-w-sm mx-auto">
                  Allocate your wallet balance into an active European poultry cycle to start receiving telemetry updates and reliable harvest yields.
                </p>
                <button
                  onClick={() => onOpenInvest()}
                  className="px-4 py-2 bg-[#1B3B2B] text-white rounded-lg text-xs font-semibold hover:bg-[#11271D] transition-colors cursor-pointer"
                >
                  Explore Plans
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userInvestments.map((inv) => {
                  const progress = calculateCycleProgress(inv.start_date, inv.maturity_date);
                  const daysLeft = calculateDaysRemaining(inv.maturity_date);
                  const isMatured = inv.status === 'matured';

                  return (
                    <div
                      key={inv.id}
                      className="bg-white rounded-2xl border border-[#E5E3D8] p-6 space-y-5 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#F7F6F2] text-[#5C6572]">
                              {inv.cycle_code}
                            </span>
                            <h4 className="text-lg font-bold text-[#1B3B2B] mt-1">{inv.plan_title}</h4>
                            <div className="text-xs text-[#5C6572]">{inv.facility_location}</div>
                          </div>

                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              isMatured
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-50 text-blue-800'
                            }`}
                          >
                            {inv.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Financial stats */}
                        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#F7F6F2] border border-[#E5E3D8] text-xs">
                          <div>
                            <span className="text-[#5C6572] block">Principal</span>
                            <span className="font-mono font-bold text-[#1B3B2B] tabular-nums">
                              {formatCurrentCurrency(inv.principal_amount)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#5C6572] block">Net ROI</span>
                            <span className="font-mono font-bold text-[#16A34A] tabular-nums">
                              +{formatCurrentCurrency(inv.expected_roi_amount)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#5C6572] block">Total Payout</span>
                            <span className="font-mono font-bold text-[#C5A059] tabular-nums">
                              {formatCurrentCurrency(inv.total_payout)}
                            </span>
                          </div>
                        </div>

                        {/* Live Ticking Countdown to Total Payout Drop */}
                        <ContractCountdown
                          maturityDate={inv.maturity_date}
                          isMatured={inv.status === 'matured'}
                          capitalFormatted={formatCurrentCurrency(inv.principal_amount)}
                          expectedProfitFormatted={formatCurrentCurrency(inv.expected_roi_amount)}
                          totalPayoutFormatted={formatCurrentCurrency(inv.total_payout)}
                        />

                        {/* Progress */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-[#5C6572] font-mono">
                            <span>Started: {formatDate(inv.start_date)}</span>
                            <span>Maturity: {formatDate(inv.maturity_date)}</span>
                          </div>
                          <div className="w-full bg-[#EAE8E0] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#1B3B2B] h-full rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] text-[#6E7B74]">
                            <span>Progress: {progress}%</span>
                            <span>{isMatured ? 'Harvest Completed' : `${daysLeft} days until total payout`}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#F0EFEA] flex items-center justify-between text-xs text-[#5C6572]">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                          <span>Forward Contract Escrow Locked</span>
                        </span>
                        <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Audited Asset</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: LEDGER & TRANSACTIONS                                      */}
        {/* ================================================================ */}
        {activeTab === 'ledger' && (
          <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-xs overflow-hidden">
            
            {/* Header with Search, Filter & Export */}
            <div className="p-5 border-b border-[#E5E3D8] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#1B3B2B]">Financial Ledger & Settlement History</h3>
                <p className="text-xs text-[#5C6572]">
                  Immutable ledger tracking deposits, capital allocations, and total payouts (capital + profit)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#5C6572] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.target.value)}
                    placeholder="Search reference..."
                    className="pl-8 pr-3 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>

                {/* Filter */}
                <select
                  value={txTypeFilter}
                  onChange={(e: any) => setTxTypeFilter(e.target.value)}
                  className="px-3 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="investment">Investments</option>
                  <option value="payout">Payouts</option>
                  <option value="withdrawal">Withdrawals</option>
                </select>

                {/* CSV Export */}
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 bg-white border border-[#DCDAD0] hover:border-[#1B3B2B] text-[#1B3B2B] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F6F2] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-5">Reference</th>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Type</th>
                    <th className="py-3 px-5">Gateway</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Amount ({currencySymbol})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEA]">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#5C6572]">
                        No matching transactions found.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#FBFBFA] transition-colors">
                        <td className="py-3 px-5 font-mono text-[#1B3B2B] font-semibold">{tx.reference}</td>
                        <td className="py-3 px-5 text-[#5C6572]">{formatDate(tx.created_at)}</td>
                        <td className="py-3 px-5">
                          <span
                            className={`capitalize font-semibold ${
                              tx.type === 'payout' || tx.type === 'deposit'
                                ? 'text-emerald-700'
                                : 'text-[#1B3B2B]'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-5 uppercase font-mono text-[11px] text-[#5C6572]">
                          {tx.payment_gateway}
                        </td>
                        <td className="py-3 px-5">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              tx.status === 'successful'
                                ? 'bg-emerald-100 text-emerald-800'
                                : tx.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-5 text-right font-mono font-bold tabular-nums text-sm ${
                            tx.type === 'payout' || tx.type === 'deposit'
                              ? 'text-emerald-700'
                              : 'text-[#1B3B2B]'
                          }`}
                        >
                          {tx.type === 'payout' || tx.type === 'deposit' ? '+' : '-'}
                          {formatEuro(tx.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 5: REFERRAL REWARDS HUB                                      */}
        {/* ================================================================ */}
        {activeTab === 'referrals' && (
          <ReferralDashboard onOpenInvestModal={() => onOpenInvest()} />
        )}

        {/* ================================================================ */}
        {/* TAB 6: SECURITY & PASSWORD SETTINGS                              */}
        {/* ================================================================ */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E3D8] p-6 sm:p-8 shadow-xs">
              <div className="max-w-2xl space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-[#C5A059] font-mono text-xs font-bold uppercase tracking-wider">
                    <Key className="w-4 h-4" />
                    <span>Credentials &amp; Access Controls</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1B3B2B] mt-1">
                    Password &amp; Security Settings
                  </h3>
                  <p className="text-xs text-[#5C6572] mt-0.5">
                    Update your account credentials. Every password field includes an eye icon toggle to reveal or hide your characters.
                  </p>
                </div>

                {pwdFeedback && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                      pwdFeedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-red-50 text-red-800 border-red-300'
                    }`}
                  >
                    {pwdFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{pwdFeedback.message}</span>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPwdFeedback(null);
                    if (!newPwd) {
                      setPwdFeedback({ type: 'error', message: 'Please enter a new password.' });
                      return;
                    }
                    if (newPwd.length < 6) {
                      setPwdFeedback({ type: 'error', message: 'New password must be at least 6 characters long.' });
                      return;
                    }
                    if (newPwd !== confirmPwd) {
                      setPwdFeedback({ type: 'error', message: 'New password and confirmation do not match.' });
                      return;
                    }
                    setPwdFeedback({
                      type: 'success',
                      message: 'Password updated successfully! Your new password is now active for future logins.',
                    });
                    setCurrentPwd('');
                    setNewPwd('');
                    setConfirmPwd('');
                  }}
                  className="space-y-4"
                >
                  {/* Current Password Field */}
                  <div>
                    <label className="text-xs font-semibold text-[#1B3B2B] block mb-1.5 flex items-center justify-between">
                      <span>Current Password</span>
                      <span className="text-[10px] text-[#7C887E]">Click eye to reveal</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#7C887E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showCurrentPwd ? 'text' : 'password'}
                        value={currentPwd}
                        onChange={(e) => setCurrentPwd(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full pl-9 pr-11 py-2.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                        title={showCurrentPwd ? 'Hide password' : 'Show password'}
                        aria-label={showCurrentPwd ? 'Hide password' : 'Show password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#EAE8E0] transition-colors cursor-pointer"
                      >
                        {showCurrentPwd ? (
                          <EyeOff className="w-4 h-4 text-[#1B3B2B]" />
                        ) : (
                          <Eye className="w-4 h-4 text-[#5C6572]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password Field */}
                  <div>
                    <label className="text-xs font-semibold text-[#1B3B2B] block mb-1.5 flex items-center justify-between">
                      <span>New Password</span>
                      <span className="text-[10px] text-[#7C887E]">Click eye to reveal</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#7C887E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showNewPwd ? 'text' : 'password'}
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-9 pr-11 py-2.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        title={showNewPwd ? 'Hide password' : 'Show password'}
                        aria-label={showNewPwd ? 'Hide password' : 'Show password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#EAE8E0] transition-colors cursor-pointer"
                      >
                        {showNewPwd ? (
                          <EyeOff className="w-4 h-4 text-[#1B3B2B]" />
                        ) : (
                          <Eye className="w-4 h-4 text-[#5C6572]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password Field */}
                  <div>
                    <label className="text-xs font-semibold text-[#1B3B2B] block mb-1.5 flex items-center justify-between">
                      <span>Confirm New Password</span>
                      <span className="text-[10px] text-[#7C887E]">Click eye to reveal</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#7C887E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showConfirmPwd ? 'text' : 'password'}
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full pl-9 pr-11 py-2.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        title={showConfirmPwd ? 'Hide password' : 'Show password'}
                        aria-label={showConfirmPwd ? 'Hide password' : 'Show password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#EAE8E0] transition-colors cursor-pointer"
                      >
                        {showConfirmPwd ? (
                          <EyeOff className="w-4 h-4 text-[#1B3B2B]" />
                        ) : (
                          <Eye className="w-4 h-4 text-[#5C6572]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>

                <div className="pt-6 border-t border-[#F0EFEA] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#E5E3D8]">
                    <div className="text-[10px] text-[#7C887E] font-medium">Authentication Type</div>
                    <div className="font-bold text-[#1B3B2B] mt-0.5">Argon2 / SHA-256 Hash</div>
                  </div>
                  <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#E5E3D8]">
                    <div className="text-[10px] text-[#7C887E] font-medium">Session Protection</div>
                    <div className="font-bold text-emerald-700 mt-0.5">Active (Encrypted TLS)</div>
                  </div>
                  <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#E5E3D8]">
                    <div className="text-[10px] text-[#7C887E] font-medium">KYC Verification</div>
                    <div className="font-bold text-[#1B3B2B] mt-0.5 capitalize">{kycStatus}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
