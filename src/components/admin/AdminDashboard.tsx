import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { formatEuro, formatDate, maskCryptoAddress, maskIBAN } from '../../lib/formatters';
import { Logo } from '../common/Logo';
import { EmailNotificationRecord } from '../../types';
import {
  ADMIN_USER_GROWTH_DATA,
  ADMIN_PLAN_PERFORMANCE_DATA,
  ADMIN_CASH_FLOW_DATA,
  ADMIN_REGIONAL_PROFIT_DATA,
} from '../../lib/mockData';
import {
  ShieldCheck,
  TrendingUp,
  Banknote,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Settings,
  Activity,
  Layers,
  FileCheck,
  AlertTriangle,
  Play,
  RotateCw,
  Bell,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Coins,
  Check,
  Clock,
  MapPin,
  Flame,
  Wallet,
  Egg,
  Lock,
  Plus,
  Minus,
  Building2,
  Sparkles,
  Feather,
  Trash2,
  UserPlus,
  Headphones,
  Mail,
  Send,
  MessageSquare,
  Phone,
  X,
  Award,
  Star,
  Wheat,
} from 'lucide-react';
import { CycleStage, InvestmentPlan, Profile } from '../../types';
import { AdminReferralSection } from './AdminReferralSection';

export const AdminDashboard: React.FC = () => {
  const {
    totalTvl,
    totalPayoutsIssued,
    activeInvestorCount,
    profiles,
    wallets,
    plans,
    cycles,
    investments,
    transactions,
    settings,
    adminNotifications,
    unreadNotificationCount,
    markNotificationRead,
    clearAllNotifications,
    reviewKyc,
    updateTransactionStatus,
    createPlan,
    updatePlan,
    archivePlan,
    updateCycleStage,
    addNewFarm,
    updatePortugalProgress,
    adjustUserBalance,
    updateUserDirectBalances,
    addFarmUpdate,
    triggerMaturityPayout,
    updateSettings,
    simulateWebhookEvent,
    humanInquiries,
    replyHumanSupportInquiry,
    addUser,
    deleteUser,
    confirmDeposit,
    denyDeposit,
    language,
    reviews,
    approveReview,
    rejectReview,
    deleteReview,
    emailDispatches,
    bugReports,
    updateBugReportStatus,
    adminCredentials,
    updateAdminCredentials,
    currency,
    currencySymbol,
    formatCurrentCurrency,
    formatCurrentCurrencyCompact,
    adminFeePurse,
    sweepFeePurse,
    approveFullWithdrawal,
    declineWithdrawal,
    partialPayoutWithdrawal,
  } = usePlatform();

  const [adminTab, setAdminTab] = useState<
    | 'analytics'
    | 'notifications'
    | 'fee_purse'
    | 'reviews'
    | 'emails'
    | 'wallets'
    | 'inquiries'
    | 'kyc'
    | 'ledger'
    | 'plans'
    | 'cycles'
    | 'settings'
    | 'referrals'
  >('analytics');

  // Dedicated Withdrawal Action Modals State
  const [declineTargetTx, setDeclineTargetTx] = useState<any | null>(null);
  const [declineErrorMessage, setDeclineErrorMessage] = useState('');
  const [declineIssues, setDeclineIssues] = useState<string[]>([]);
  const [newCustomIssueText, setNewCustomIssueText] = useState('');
  const [declineRefundToWallet, setDeclineRefundToWallet] = useState(true);
  const [isSubmittingDecline, setIsSubmittingDecline] = useState(false);

  const [partialTargetTx, setPartialTargetTx] = useState<any | null>(null);
  const [partialPayoutAmount, setPartialPayoutAmount] = useState<number | ''>('');
  const [partialExplanationMessage, setPartialExplanationMessage] = useState('');
  const [partialRefundRemaining, setPartialRefundRemaining] = useState(true);
  const [partialCategory, setPartialCategory] = useState<string>('production');
  const [isSubmittingPartial, setIsSubmittingPartial] = useState(false);

  const [approveConfirmTx, setApproveConfirmTx] = useState<any | null>(null);
  const [approveCategory, setApproveCategory] = useState<string>('production');
  const [isSubmittingApprove, setIsSubmittingApprove] = useState(false);

  // Fee Purse Sweep & Settings State
  const [showSweepModal, setShowSweepModal] = useState(false);
  const [sweepAmount, setSweepAmount] = useState<number | ''>('');
  const [sweepDestination, setSweepDestination] = useState(settings.cryptoAddresses.USDT);
  const [isSubmittingSweep, setIsSubmittingSweep] = useState(false);
  const [feePurseFeedback, setFeePurseFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isEditingFeeRate, setIsEditingFeeRate] = useState(false);
  const [feeRateInput, setFeeRateInput] = useState<number>(settings.platformFeePercentage || 1.5);

  // Special Admin credentials management state
  const [specialAdminEmail, setSpecialAdminEmail] = useState(adminCredentials.email);
  const [specialAdminPassword, setSpecialAdminPassword] = useState(adminCredentials.password);
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminCredFeedback, setAdminCredFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSaveAdminCreds = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateAdminCredentials(specialAdminEmail, specialAdminPassword);
    setAdminCredFeedback({ type: res.success ? 'success' : 'error', message: res.message });
    setTimeout(() => setAdminCredFeedback(null), 4000);
  };

  const [selectedEmailPreview, setSelectedEmailPreview] = useState<EmailNotificationRecord | null>(null);
  const [emailFilter, setEmailFilter] = useState<'all' | 'investment_matured' | 'review_approved'>('all');

  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // User management (Add & Delete) state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserCountry, setNewUserCountry] = useState('DE');
  const [newUserInitialBalance, setNewUserInitialBalance] = useState<number>(0);
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin'>('user');
  const [newUserKyc, setNewUserKyc] = useState<'verified' | 'pending'>('verified');
  const [isSubmittingNewUser, setIsSubmittingNewUser] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<Profile | null>(null);
  const [userOpFeedback, setUserOpFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Human Support Inquiries state
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [replyingInquiryId, setReplyingInquiryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Wallet adjustment modal / state
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedAdjustUser, setSelectedAdjustUser] = useState<Profile | null>(null);
  const [adjustmentMode, setAdjustmentMode] = useState<'direct_override' | 'delta_adjust'>('direct_override');
  const [directMainBalance, setDirectMainBalance] = useState<number | ''>('');
  const [directEarningsBalance, setDirectEarningsBalance] = useState<number | ''>('');
  const [adjAmount, setAdjAmount] = useState<number>(1000);
  const [adjType, setAdjType] = useState<'credit' | 'debit'>('credit');
  const [adjBalanceType, setAdjBalanceType] = useState<'main' | 'earnings'>('main');
  const [adjReason, setAdjReason] = useState('Payment confirmed via off-platform deposit');
  const [walletFeedback, setWalletFeedback] = useState<string | null>(null);
  const [isSubmittingAdjustment, setIsSubmittingAdjustment] = useState(false);

  // Portugal progress state
  const PortugalFarm = cycles.find((c) => c.id === 'cyc-Portugal-01' || c.facility_location.includes('Portugal'));
  const [PortugalProgressVal, setPortugalProgressVal] = useState<number>(PortugalFarm?.construction_progress ?? 65);
  const [PortugalSaveFeedback, setPortugalSaveFeedback] = useState<string | null>(null);

  // Cycle filter state in cycles tab
  const [cycleCategoryFilter, setCycleCategoryFilter] = useState<'all' | 'layers_eggs' | 'broilers'>('all');

  // Plan creation modal / state
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
  const [planTitle, setPlanTitle] = useState('');
  const [planMin, setPlanMin] = useState(500);
  const [planMax, setPlanMax] = useState(4999);
  const [planDuration, setPlanDuration] = useState(15);
  const [planRoi, setPlanRoi] = useState(50.0);
  const [planRating, setPlanRating] = useState<'A+' | 'A' | 'A-'>('A+');
  const [planDesc, setPlanDesc] = useState('');
  const [planBreed, setPlanBreed] = useState('Hubbard JA57 Rapid');

  // Farm telemetry update modal / state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateCycleId, setUpdateCycleId] = useState(cycles[0]?.id || '');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDesc, setUpdateDesc] = useState('');
  const [updateWeek, setUpdateWeek] = useState(3);
  const [updateWeight, setUpdateWeight] = useState(1.45);
  const [updateFcr, setUpdateFcr] = useState(1.52);
  const [updateMortality, setUpdateMortality] = useState(0.35);
  const [updateHealth, setUpdateHealth] = useState('Nominal - High flock uniformity');

  // New Farm Opening / Facility Creation modal state
  const [showNewFarmModal, setShowNewFarmModal] = useState(false);
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmLocation, setNewFarmLocation] = useState('');
  const [newFarmCountry, setNewFarmCountry] = useState('DE');
  const [newFarmCategory, setNewFarmCategory] = useState<'dual_layers_broilers' | 'layers_eggs' | 'broilers'>('dual_layers_broilers');
  const [newFarmBreeds, setNewFarmBreeds] = useState('Lohmann Brown (Layers) & Ross 308 (Broilers)');
  const [newFarmTotalBirds, setNewFarmTotalBirds] = useState<number | ''>(45000);
  const [newFarmLayersCount, setNewFarmLayersCount] = useState<number | ''>(24999);
  const [newFarmBroilersCount, setNewFarmBroilersCount] = useState<number | ''>(20000);
  const [newFarmDailyEggs, setNewFarmDailyEggs] = useState<number | ''>(23000);
  const [newFarmStage, setNewFarmStage] = useState<CycleStage>('chick_placement');
  const [newFarmSolarKw, setNewFarmSolarKw] = useState(480);
  const [newFarmFeedback, setNewFarmFeedback] = useState<string | null>(null);

  // Webhook test state
  const [webhookLog, setWebhookLog] = useState<string | null>(null);

  // Settings form
  const [stripeMode, setStripeMode] = useState(settings.stripeMode);
  const [sepaCreditor, setSepaCreditor] = useState(settings.sepaCreditorId);
  const [platformFee, setPlatformFee] = useState(settings.platformFeePercentage);
  const [minWithdrawal, setMinWithdrawal] = useState(settings.minimumWithdrawal);
  const [adminEmailState, setAdminEmailState] = useState(settings.adminEmail || 'foodcriticdan@gmail.com');
  const [btcAddress, setBtcAddress] = useState(settings.cryptoAddresses?.BTC || 'bc1q7w8x9y0z1a2b3c4d5e6f7g8h9j0k1l2m3n4p5q');
  const [ethAddress, setEthAddress] = useState(settings.cryptoAddresses?.ETH || '0x71C8364860D4cE3F27eE57fC970427a92A13dD4B');
  const [usdtTrc20Address, setUsdtTrc20Address] = useState(settings.cryptoAddresses?.USDT || 'TN9qR7vK4b8wY5xM3zL1jP6sD2fH8nB4vX');
  const [usdtErc20Address, setUsdtErc20Address] = useState(settings.cryptoAddresses?.USDT_ERC20 || '0x49857d4B2375d04F4c2780e227918a24F18c39De');
  const [usdcAddress, setUsdcAddress] = useState(settings.cryptoAddresses?.USDC || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');

  const activeInvestments = investments.filter((i) => i.status === 'active');
  const pendingKycProfiles = profiles.filter((p) => p.kyc_status === 'pending');
  const allUserProfiles = profiles.filter((p) => p.role === 'user');
  const pendingWithdrawals = transactions.filter((t) => t.type === 'withdrawal' && t.status === 'pending');
  const pendingReviews = reviews.filter((r) => r.status === 'pending');
  const approvedReviews = reviews.filter((r) => r.status === 'approved' || (!r.status && r.verified));
  const rejectedReviews = reviews.filter((r) => r.status === 'rejected');
  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'all') return true;
    if (reviewFilter === 'approved') return r.status === 'approved' || (!r.status && r.verified);
    return r.status === reviewFilter;
  });

  const handleOpenPlanCreate = () => {
    setEditingPlan(null);
    setPlanTitle('');
    setPlanMin(500);
    setPlanMax(4999);
    setPlanDuration(15);
    setPlanRoi(50.0);
    setPlanRating('A+');
    setPlanDesc('15-day accelerated poultry production cycle with confirmed retail delivery.');
    setPlanBreed('Hubbard JA57 Rapid');
    setShowPlanModal(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlan) {
      updatePlan({
        ...editingPlan,
        title: planTitle,
        min_amount: planMin,
        max_amount: planMax,
        duration_days: planDuration,
        roi_percentage: planRoi,
        risk_rating: planRating,
        description: planDesc,
        poultry_breed: planBreed,
      });
    } else {
      createPlan({
        title: planTitle,
        min_amount: planMin,
        max_amount: planMax,
        duration_days: planDuration,
        roi_percentage: planRoi,
        risk_rating: planRating,
        status: 'active',
        description: planDesc,
        poultry_breed: planBreed,
        features: [
          `${planDuration}-day production cycle`,
          `${planRoi}% target net payout`,
          'Bio-Security Level 3 standards',
          'Contractual retail off-take assurance',
        ],
        esg_score: 95,
      });
    }
    setShowPlanModal(false);
  };

  const handleSaveFarmUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    addFarmUpdate({
      cycle_id: updateCycleId,
      title: updateTitle,
      description: updateDesc,
      week_number: updateWeek,
      average_weight_kg: updateWeight,
      feed_efficiency: updateFcr,
      mortality_rate: updateMortality,
      health_status: updateHealth,
    });
    setShowUpdateModal(false);
    setUpdateTitle('');
    setUpdateDesc('');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      setUserOpFeedback({ type: 'error', message: 'Name and email are required.' });
      return;
    }
    setIsSubmittingNewUser(true);
    try {
      const res = await addUser({
        full_name: newUserName.trim(),
        email: newUserEmail.trim(),
        country_code: newUserCountry,
        initial_balance: newUserInitialBalance,
        role: newUserRole,
        kyc_status: newUserKyc,
      });
      if (res.success) {
        setUserOpFeedback({ type: 'success', message: res.message });
        setTimeout(() => {
          setShowAddUserModal(false);
          setUserOpFeedback(null);
        }, 1200);
      } else {
        setUserOpFeedback({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setUserOpFeedback({ type: 'error', message: err.message || 'Error creating user' });
    } finally {
      setIsSubmittingNewUser(false);
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    try {
      const res = await deleteUser(deleteConfirmUser.user_id);
      if (res.success) {
        setDeleteConfirmUser(null);
      } else {
        alert(res.message);
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting user');
    }
  };

  const handleSendInquiryReply = (inquiryId: string) => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);
    replyHumanSupportInquiry(inquiryId, replyText.trim());
    setReplyingInquiryId(null);
    setReplyText('');
    setIsSubmittingReply(false);
  };

  const filteredInquiries = humanInquiries.filter((inq) => {
    if (inquiryFilter === 'all') return true;
    return inq.status === inquiryFilter;
  });

  const openBalanceModalForUser = (user: Profile | null, mode: 'direct_override' | 'delta_adjust' = 'direct_override') => {
    if (!user) return;
    setSelectedAdjustUser(user);
    setAdjustmentMode(mode);
    setDirectMainBalance('');
    setDirectEarningsBalance('');
    setAdjAmount(1000);
    setAdjType('credit');
    setAdjBalanceType('main');
    setAdjReason('Off-platform payment confirmed via blockchain / wire');
    setWalletFeedback(null);
    setShowWalletModal(true);
  };

  const handleConfirmBalanceAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdjustUser) return;
    setIsSubmittingAdjustment(true);
    setWalletFeedback(null);
    try {
      if (adjustmentMode === 'direct_override') {
        const hasMain = directMainBalance !== '';
        const hasEarnings = directEarningsBalance !== '';
        if (!hasMain && !hasEarnings) {
          setWalletFeedback(`Error: Enter a value of ${currencySymbol}1 or greater for at least one balance. Blank fields remain unchanged.`);
          setIsSubmittingAdjustment(false);
          return;
        }

        const currentWal = wallets[selectedAdjustUser.user_id];
        const newMain = hasMain ? Number(directMainBalance) : (currentWal?.main_balance || 0);
        const newEarnings = hasEarnings ? Number(directEarningsBalance) : (currentWal?.earnings_balance || 0);

        if (hasMain && (isNaN(newMain) || newMain < 1)) {
          setWalletFeedback('Error: Main balance cannot register any value lesser than 1.');
          setIsSubmittingAdjustment(false);
          return;
        }
        if (hasEarnings && (isNaN(newEarnings) || newEarnings < 1)) {
          setWalletFeedback('Error: Earnings balance cannot register any value lesser than 1.');
          setIsSubmittingAdjustment(false);
          return;
        }

        const res = await updateUserDirectBalances(
          selectedAdjustUser.user_id,
          {
            main_balance: Math.round(newMain),
            earnings_balance: Math.round(newEarnings),
          },
          adjReason
        );
        if (res.success) {
          setWalletFeedback(`✓ ${res.message}`);
          setTimeout(() => {
            setShowWalletModal(false);
            setWalletFeedback(null);
            setIsSubmittingAdjustment(false);
          }, 1500);
        } else {
          setWalletFeedback(`Error: ${res.message}`);
          setIsSubmittingAdjustment(false);
        }
      } else {
        const rawAmt = Number(adjAmount);
        const wholeNumberAmt = Math.round(rawAmt);
        if (isNaN(rawAmt) || wholeNumberAmt < 1) {
          setWalletFeedback(`Error: Payment amount must be a whole number of 1 or greater (e.g. ${currencySymbol}1, ${currencySymbol}2, ${currencySymbol}5, ${currencySymbol}25, ${currencySymbol}100...).`);
          setIsSubmittingAdjustment(false);
          return;
        }
        const finalAmount = adjType === 'credit' ? wholeNumberAmt : -wholeNumberAmt;
        const res = await adjustUserBalance(selectedAdjustUser.user_id, finalAmount, adjBalanceType, adjReason);
        if (res.success) {
          setWalletFeedback(`✓ ${res.message}`);
          setTimeout(() => {
            setShowWalletModal(false);
            setWalletFeedback(null);
            setIsSubmittingAdjustment(false);
          }, 1500);
        } else {
          setWalletFeedback(`Error: ${res.message}`);
          setIsSubmittingAdjustment(false);
        }
      }
    } catch (err: any) {
      setWalletFeedback(`Error: ${err.message || 'Adjustment failed'}`);
      setIsSubmittingAdjustment(false);
    }
  };

  const handleUpdatePortugal = (val: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(val)));
    setPortugalProgressVal(clamped);
    updatePortugalProgress(clamped);
    setPortugalSaveFeedback(
      `Portugal Bio-Dome progress set to ${clamped}%. ${
        clamped >= 100
          ? '🎉 100% Commissioned! Imagery unblurred across entire platform.'
          : 'Public image remains blurred until 100% is reached.'
      }`
    );
    setTimeout(() => setPortugalSaveFeedback(null), 5000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      stripeMode,
      sepaCreditorId: sepaCreditor,
      platformFeePercentage: platformFee,
      minimumWithdrawal: minWithdrawal,
      adminEmail: adminEmailState.trim(),
      cryptoAddresses: {
        BTC: btcAddress.trim(),
        ETH: ethAddress.trim(),
        USDT: usdtTrc20Address.trim(),
        USDT_ERC20: usdtErc20Address.trim(),
        USDC: usdcAddress.trim(),
      },
    });
    alert('System settings and receiving crypto addresses updated successfully! Payments will now route to these addresses.');
  };

  const handleRunWebhookSimulation = (gateway: 'crypto' | 'stripe' | 'sepa') => {
    const res = simulateWebhookEvent(
      gateway,
      gateway === 'crypto' ? 'crypto.tx.confirmed' : 'payment.cleared',
      5000.0
    );
    setWebhookLog(res.log);
  };

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmName.trim() || !newFarmLocation.trim()) {
      setNewFarmFeedback('Please provide a valid facility name and location.');
      return;
    }
    const total = Number(newFarmTotalBirds) || ((Number(newFarmLayersCount) || 0) + (Number(newFarmBroilersCount) || 0)) || 35000;
    if (total < 100) {
      setNewFarmFeedback('Capacity must be at least 100 birds.');
      return;
    }

    addNewFarm({
      facility_name: newFarmName.trim(),
      facility_location: newFarmLocation.trim(),
      country: newFarmCountry,
      category: newFarmCategory,
      breed: newFarmBreeds.trim(),
      total_birds: total,
      layers_count: newFarmCategory !== 'broilers' ? Number(newFarmLayersCount) || Math.round(total * 0.6) : undefined,
      broilers_count: newFarmCategory !== 'layers_eggs' ? Number(newFarmBroilersCount) || Math.round(total * 0.4) : undefined,
      daily_egg_capacity: newFarmCategory !== 'broilers' ? Number(newFarmDailyEggs) || Math.round(total * 0.75) : undefined,
      current_stage: newFarmStage,
      solar_power_kw: Number(newFarmSolarKw) || 450,
    });

    setNewFarmFeedback('✓ New farm successfully added! Total number of birds in the farm from all facilities automatically updated.');
    setTimeout(() => {
      setShowNewFarmModal(false);
      setNewFarmFeedback(null);
      setNewFarmName('');
      setNewFarmLocation('');
    }, 1200);
  };

  // WITHDRAWAL REVIEW & ACTIONS HANDLERS
  const handleInitiateDecline = (tx: any) => {
    setDeclineTargetTx(tx);
    setDeclineErrorMessage(
      'Destination Network Discrepancy: Selected TRC-20 protocol is incompatible with the provided recipient address format.'
    );
    setDeclineIssues([
      'Destination address prefix mismatch with selected blockchain network.',
      'Recipient beneficiary name could not be reconciled with KYC verified passport dossier.',
    ]);
    setNewCustomIssueText('');
    setDeclineRefundToWallet(true);
  };

  const handleAddDeclineIssue = () => {
    const trimmed = newCustomIssueText.trim();
    if (!trimmed) return;
    if (!declineIssues.includes(trimmed)) {
      setDeclineIssues([...declineIssues, trimmed]);
    }
    setNewCustomIssueText('');
  };

  const handleRemoveDeclineIssue = (idxToRemove: number) => {
    setDeclineIssues((prev) => prev.filter((_, i) => i !== idxToRemove));
  };

  const handleSubmitDecline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declineTargetTx) return;
    if (!declineErrorMessage.trim()) {
      alert('Please specify the primary error message explaining the transfer decline.');
      return;
    }
    setIsSubmittingDecline(true);
    try {
      const res = await declineWithdrawal(declineTargetTx.id, {
        errorMessage: declineErrorMessage.trim(),
        issues: declineIssues,
        refundToWallet: declineRefundToWallet,
      });
      alert(res.message);
      setDeclineTargetTx(null);
    } catch (err: any) {
      alert(err.message || 'Error declining withdrawal');
    } finally {
      setIsSubmittingDecline(false);
    }
  };

  const handleInitiatePartial = (tx: any) => {
    setPartialTargetTx(tx);
    const suggestedHalf = Math.round((tx.amount / 2) * 100) / 100;
    setPartialPayoutAmount(suggestedHalf);
    setPartialCategory(tx.metadata?.capitalPairingCategory || 'production');
    setPartialRefundRemaining(true);
    setPartialExplanationMessage(
      `A partial disbursement of ${formatCurrentCurrency(suggestedHalf, true)} has been processed. The remaining balance of ${formatCurrentCurrency(tx.amount - suggestedHalf, true)} has been credited back to your available wallet balance as underlying capital is actively deployed in live poultry flock growth, on-site feed milling, and facility building.`
    );
  };

  const handleSubmitPartial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partialTargetTx) return;
    const pAmt = Number(partialPayoutAmount);
    if (isNaN(pAmt) || pAmt <= 0) {
      alert('Please enter a valid partial payout amount greater than zero.');
      return;
    }
    if (pAmt >= partialTargetTx.amount) {
      alert(`Partial payout amount must be strictly less than requested amount (${formatCurrentCurrency(partialTargetTx.amount, true)}). Use full approval instead.`);
      return;
    }
    if (!partialExplanationMessage.trim()) {
      alert('Please include an operational explanation note for the partial tranche.');
      return;
    }

    setIsSubmittingPartial(true);
    try {
      const res = await partialPayoutWithdrawal(partialTargetTx.id, {
        payoutAmount: pAmt,
        explanationMessage: partialExplanationMessage.trim(),
        refundRemainingToWallet: partialRefundRemaining,
        capitalPairingCategory: partialCategory,
      });
      alert(res.message);
      setPartialTargetTx(null);
    } catch (err: any) {
      alert(err.message || 'Error processing partial payout');
    } finally {
      setIsSubmittingPartial(false);
    }
  };

  const handleInitiateApprove = (tx: any) => {
    setApproveConfirmTx(tx);
    setApproveCategory(tx.metadata?.capitalPairingCategory || 'production');
  };

  const handleSubmitApprove = async () => {
    if (!approveConfirmTx) return;
    setIsSubmittingApprove(true);
    try {
      const res = await approveFullWithdrawal(approveConfirmTx.id, {
        capitalPairingCategory: approveCategory,
      });
      alert(res.message);
      setApproveConfirmTx(null);
    } catch (err: any) {
      alert(err.message || 'Error approving withdrawal');
    } finally {
      setIsSubmittingApprove(false);
    }
  };

  // Fee Purse Sweep & Update Handlers
  const handleOpenSweepModal = () => {
    setSweepAmount(adminFeePurse.totalAccumulatedBalance);
    setSweepDestination(settings.cryptoAddresses.USDT);
    setShowSweepModal(true);
  };

  const handleExecuteSweep = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(sweepAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid sweep amount.');
      return;
    }
    setIsSubmittingSweep(true);
    try {
      const res = await sweepFeePurse(amt, sweepDestination);
      alert(res.message);
      setShowSweepModal(false);
    } catch (err: any) {
      alert(err.message || 'Error sweeping purse');
    } finally {
      setIsSubmittingSweep(false);
    }
  };

  const handleSaveFeeRate = () => {
    const rate = Number(feeRateInput);
    if (isNaN(rate) || rate < 0 || rate > 25) {
      alert('Fee percentage must be between 0% and 25%.');
      return;
    }
    updateSettings({ platformFeePercentage: rate });
    setIsEditingFeeRate(false);
    setFeePurseFeedback({
      type: 'success',
      message: `Withdrawal fee rate updated to ${rate}%. New withdrawals will automatically deduct this rate into the Fee Purse.`,
    });
    setTimeout(() => setFeePurseFeedback(null), 4000);
  };

  return (
    <div className="py-8 bg-[#F7F6F2] min-h-[calc(100vh-140px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="lg" variant="default" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                Executive Operations System
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B] tracking-tight">
                European Agricultural Admin Console
              </h1>
            </div>
          </div>

          {/* Real-time Notification Banner / Trigger & Balance Adjustment Tool */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openBalanceModalForUser(allUserProfiles[0] || null, 'direct_override')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer bg-[#1B3B2B] text-white hover:bg-[#11271D] shadow-xs active:scale-98"
            >
              <Coins className="w-4 h-4 text-[#C5A059]" />
              <span>Balance Adjustment Tool</span>
            </button>

            <button
              onClick={() => setAdminTab('notifications')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                unreadNotificationCount > 0
                  ? 'bg-red-50 text-red-800 border-red-200 animate-pulse hover:bg-red-100'
                  : 'bg-white text-[#1B3B2B] border-[#DCDAD0] hover:border-[#1B3B2B]'
              }`}
            >
              <Bell className="w-4 h-4 text-red-600" />
              <span>Pending Approvals</span>
              {unreadNotificationCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {unreadNotificationCount} New
                </span>
              )}
            </button>
            <span className="text-xs px-2.5 py-1 rounded bg-[#1B3B2B] text-white font-mono font-semibold">
              Live Operations
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E5E3D8] pb-1 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setAdminTab('analytics')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'analytics'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Advanced Analytics</span>
          </button>

          <button
            onClick={() => setAdminTab('notifications')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'notifications'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Withdrawal Requests</span>
            {pendingWithdrawals.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingWithdrawals.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('fee_purse')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'fee_purse'
                ? 'border-[#C5A059] text-[#1B3B2B] bg-[#C5A059]/10 rounded-t-lg font-bold'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Fee Treasury Purse</span>
            <span className="bg-[#1B3B2B] text-[#C5A059] text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shadow-xs">
              {formatCurrentCurrency(adminFeePurse.totalAccumulatedBalance, true)}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('reviews')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'reviews'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Investor Reviews</span>
            {pendingReviews.length > 0 && (
              <span className="bg-[#C5A059] text-[#11271D] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingReviews.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('emails')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'emails'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Email Dispatches</span>
            <span className="bg-[#EAE8E0] text-[#1B3B2B] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {emailDispatches.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('wallets')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'wallets'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>User Accounts & Wallets</span>
          </button>

          <button
            onClick={() => setAdminTab('inquiries')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'inquiries'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-amber-600" />
            <span>Support Desk (Inquiries)</span>
            {humanInquiries.filter((i) => i.status === 'pending').length > 0 && (
              <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {humanInquiries.filter((i) => i.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('kyc')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'kyc'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>KYC Compliance</span>
            {pendingKycProfiles.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingKycProfiles.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('ledger')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'ledger'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Transactions</span>
          </button>

          <button
            onClick={() => setAdminTab('plans')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'plans'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Plan Creator (4 Tiers)</span>
          </button>

          <button
            onClick={() => setAdminTab('cycles')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'cycles'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Farm Cycles & Harvest</span>
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'settings'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Crypto Rails</span>
          </button>

          <button
            onClick={() => setAdminTab('referrals')}
            className={`px-4 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'referrals'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Referrals &amp; Milestones</span>
          </button>
        </div>

        {/* TAB 1: ADVANCED ANALYTICS */}
        {adminTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#E5E3D8] shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">Total Capital (TVL)</span>
                <div className="text-3xl font-extrabold text-[#1B3B2B] font-mono tabular-nums mt-2">
                  {formatEuro(totalTvl, true, language)}
                </div>
                <div className="text-xs text-[#16A34A] font-semibold mt-1">↑ +24.8% vs last month</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E5E3D8] shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">Total Matured Payouts</span>
                <div className="text-3xl font-extrabold text-[#16A34A] font-mono tabular-nums mt-2">
                  {formatEuro(totalPayoutsIssued, true, language)}
                </div>
                <div className="text-xs text-[#5C6572] mt-1">100% on-time settlement rate</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E5E3D8] shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">Active European Investors</span>
                <div className="text-3xl font-extrabold text-[#1B3B2B] font-mono tabular-nums mt-2">
                  {activeInvestorCount}
                </div>
                <div className="text-xs text-[#5C6572] mt-1">Across DE, NL, FR, AT, ES</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E5E3D8] shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">Avg. Biological Gross Margin</span>
                <div className="text-3xl font-extrabold text-[#1B3B2B] font-mono tabular-nums mt-2">
                  67.1%
                </div>
                <div className="text-xs text-[#16A34A] font-semibold mt-1">FCR 1.54 across facilities</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1B3B2B]">Investor Base & Onboarding Trends</h3>
                    <p className="text-xs text-[#5C6572]">Verified investors and monthly onboarding velocity</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +680% YoY
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F5] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Month</th>
                        <th className="py-2.5 px-3 text-right">Total Investors</th>
                        <th className="py-2.5 px-3 text-right">New Inbound</th>
                        <th className="py-2.5 px-3 text-right">KYC Verified</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EFEA]">
                      {ADMIN_USER_GROWTH_DATA.map((row) => (
                        <tr key={row.month} className="hover:bg-[#FAF9F5] transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-[#1B3B2B]">{row.month}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-[#1B3B2B]">
                            {row.totalInvestors.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                            +{row.newInvestors.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#5C6572]">
                            {row.kycVerified.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1B3B2B]">Investment Plan Allocation Volumes</h3>
                    <p className="text-xs text-[#5C6572]">Capital deployed across 50% (15d), 84% (21d), 150% (30d), and 320% (60d) tiers</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1B3B2B] bg-[#F7F6F2] px-2 py-0.5 rounded border border-[#E5E3D8]">
                    4 Production Tiers
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F5] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Plan Tier</th>
                        <th className="py-2.5 px-3 text-right">Capital Deployed</th>
                        <th className="py-2.5 px-3 text-right">Allocators</th>
                        <th className="py-2.5 px-3 text-right">Avg Ticket</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EFEA]">
                      {ADMIN_PLAN_PERFORMANCE_DATA.map((plan) => (
                        <tr key={plan.planName} className="hover:bg-[#FAF9F5] transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-[#1B3B2B]">{plan.fullName}</div>
                            <div className="text-[10px] text-[#5C6572] font-mono">{plan.planName}</div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-[#1B3B2B]">
                            {formatEuro(plan.capitalDeployed, false, language)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#5C6572]">
                            {plan.investorCount.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-semibold">
                            {formatEuro(plan.avgAllocation, false, language)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1B3B2B]">Weekly Cash Inflow vs Outflow</h3>
                    <p className="text-xs text-[#5C6572]">Crypto deposits received vs harvest withdrawals settled ({currencySymbol})</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Net Positive Escrow
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F5] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Week</th>
                        <th className="py-2.5 px-3 text-right">Deposits (In)</th>
                        <th className="py-2.5 px-3 text-right">Withdrawals (Out)</th>
                        <th className="py-2.5 px-3 text-right">Net Liquidity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EFEA]">
                      {ADMIN_CASH_FLOW_DATA.map((cf) => (
                        <tr key={cf.week} className="hover:bg-[#FAF9F5] transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#1B3B2B]">{cf.week}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                            +{formatEuro(cf.deposits, false, language)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#C5A059] font-semibold">
                            -{formatEuro(cf.withdrawals, false, language)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-[#1B3B2B]">
                            +{formatEuro(cf.netFlow, false, language)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1B3B2B]">Regional Farm Cycle Profitability</h3>
                    <p className="text-xs text-[#5C6572]">Bavaria (DE), Utrecht (NL), and Normandy (FR) gross margins</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1B3B2B] bg-[#F7F6F2] px-2 py-0.5 rounded border border-[#E5E3D8]">
                    3 EU Hubs
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F5] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Region</th>
                        <th className="py-2.5 px-3 text-right">Flock Capacity</th>
                        <th className="py-2.5 px-3 text-right">Wholesale Rev</th>
                        <th className="py-2.5 px-3 text-right">Gross Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EFEA]">
                      {ADMIN_REGIONAL_PROFIT_DATA.map((reg) => (
                        <tr key={reg.region} className="hover:bg-[#FAF9F5] transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-[#1B3B2B]">{reg.region}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#5C6572]">
                            {reg.flockCapacity.toLocaleString()} Birds
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-[#1B3B2B]">
                            {formatEuro(reg.wholesaleRevenue, false, language)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                            {reg.grossMargin}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NOTIFICATIONS */}
        {adminTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-xs overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEA]">
              <div>
                <h3 className="text-lg font-bold text-[#1B3B2B]">Deposit Approvals & Withdrawal Feed</h3>
                <p className="text-xs text-[#5C6572]">
                  Real-time notifications dispatched when investors request credit confirmation or submit withdrawal payouts
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearAllNotifications}
                  className="px-3 py-1.5 border border-[#DCDAD0] text-[#5C6572] hover:text-[#1B3B2B] rounded text-xs font-semibold cursor-pointer"
                >
                  Mark All as Read
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {adminNotifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#5C6572]">
                  No active notifications or pending withdrawal requests.
                </div>
              ) : (
                adminNotifications.map((notif) => {
                  const isWithdrawal = notif.type === 'withdrawal_request';
                  const isDeposit = notif.type === 'deposit_confirmation_request';
                  const relatedTx = transactions.find((t) => t.id === notif.metadata?.txId);

                  const isWithdrawalCompleted =
                    isWithdrawal &&
                    (notif.metadata?.actionCompleted === true ||
                      (relatedTx && relatedTx.status !== 'pending'));

                  const withdrawalActionTaken: 'approved' | 'partial' | 'declined' | null =
                    isWithdrawalCompleted
                      ? (notif.metadata?.actionTaken as any) ||
                        (relatedTx?.status === 'successful'
                          ? 'approved'
                          : relatedTx?.status === 'partial'
                          ? 'partial'
                          : relatedTx?.status === 'failed' || relatedTx?.status === 'cancelled'
                          ? 'declined'
                          : 'approved')
                      : null;

                  const isDepositCompleted =
                    isDeposit &&
                    (notif.metadata?.actionCompleted === true ||
                      (relatedTx && relatedTx.status !== 'pending'));

                  const depositActionTaken: 'approved' | 'denied' | null =
                    isDepositCompleted
                      ? (notif.metadata?.actionTaken as any) ||
                        (relatedTx?.status === 'successful' ? 'approved' : 'denied')
                      : null;

                  let cardStyle = 'bg-[#F7F6F2] border-[#E5E3D8]';
                  if (!notif.read && !isWithdrawalCompleted && !isDepositCompleted) {
                    cardStyle = 'bg-amber-50/60 border-amber-200 shadow-2xs';
                  } else if (isWithdrawalCompleted) {
                    if (withdrawalActionTaken === 'approved') {
                      cardStyle = 'bg-emerald-50/85 border-2 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20';
                    } else if (withdrawalActionTaken === 'partial') {
                      cardStyle = 'bg-amber-50/85 border-2 border-amber-500 shadow-sm ring-2 ring-amber-500/20';
                    } else if (withdrawalActionTaken === 'declined') {
                      cardStyle = 'bg-rose-50/85 border-2 border-rose-500 shadow-sm ring-2 ring-rose-500/20';
                    }
                  } else if (isDepositCompleted) {
                    if (depositActionTaken === 'approved') {
                      cardStyle = 'bg-emerald-50/85 border-2 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20';
                    } else {
                      cardStyle = 'bg-rose-50/85 border-2 border-rose-500 shadow-sm ring-2 ring-rose-500/20';
                    }
                  }

                  return (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardStyle}`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-[#1B3B2B]">{notif.title}</span>
                          {!notif.read && !isWithdrawalCompleted && !isDepositCompleted && (
                            <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-full uppercase">
                              Action Required
                            </span>
                          )}

                          {isWithdrawalCompleted && (
                            <>
                              {withdrawalActionTaken === 'approved' && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full uppercase shadow-2xs">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                  <span>✓ Action Selected: Full Payout Approved</span>
                                </span>
                              )}
                              {withdrawalActionTaken === 'partial' && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-black bg-[#C5A059] text-[#11271D] px-2.5 py-0.5 rounded-full uppercase shadow-2xs">
                                  <Sparkles className="w-3.5 h-3.5 text-[#11271D]" />
                                  <span>⚡ Action Selected: Partial Tranche Disbursed</span>
                                </span>
                              )}
                              {withdrawalActionTaken === 'declined' && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-black bg-red-600 text-white px-2.5 py-0.5 rounded-full uppercase shadow-2xs">
                                  <X className="w-3.5 h-3.5 text-white" />
                                  <span>✕ Action Selected: Transfer Declined &amp; Issues Logged</span>
                                </span>
                              )}
                            </>
                          )}

                          {isDepositCompleted && (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-black px-2 py-0.5 rounded-full uppercase shadow-2xs ${
                              depositActionTaken === 'approved' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                            }`}>
                              {depositActionTaken === 'approved' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-white" />
                                  <span>✓ Action Selected: Deposit Confirmed</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-3 h-3 text-white" />
                                  <span>✕ Action Selected: Deposit Denied</span>
                                </>
                              )}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#4A5568]">{notif.message}</p>
                        <div className="text-[11px] font-mono text-[#7C887E]">
                          Investor: {notif.userName} ({notif.userId}) · {formatDate(notif.timestamp, language)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isDeposit && notif.metadata?.txId && (
                          <>
                            {isDepositCompleted ? (
                              <div className="flex items-center gap-1.5 p-1 bg-white/90 rounded-xl border border-black/10 shadow-2xs">
                                <button
                                  type="button"
                                  disabled
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed flex items-center gap-1 ${
                                    depositActionTaken === 'approved'
                                      ? 'bg-emerald-600 text-white shadow-xs opacity-100 ring-2 ring-emerald-600/30'
                                      : 'bg-gray-100 text-gray-400 opacity-30'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{depositActionTaken === 'approved' ? '✓ Confirmed' : 'Confirm'}</span>
                                </button>
                                <button
                                  type="button"
                                  disabled
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed flex items-center gap-1 ${
                                    depositActionTaken === 'denied'
                                      ? 'bg-red-600 text-white shadow-xs opacity-100 ring-2 ring-red-600/30'
                                      : 'bg-gray-100 text-gray-400 opacity-30'
                                  }`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>{depositActionTaken === 'denied' ? '✓ Denied' : 'Deny'}</span>
                                </button>
                                <span className="text-[10px] font-mono font-bold text-[#5C6572] bg-[#FAF9F5] px-2 py-1 rounded-md border border-[#E5E3D8]">
                                  🔒 Locked
                                </span>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={async () => {
                                    const res = await confirmDeposit(notif.metadata!.txId!);
                                    markNotificationRead(notif.id);
                                    alert(res.message);
                                  }}
                                  className="px-3 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Confirm Payment &amp; Fund Wallet</span>
                                </button>
                                <button
                                  onClick={async () => {
                                    const res = await denyDeposit(notif.metadata!.txId!, 'Deposit rejected by admin verification');
                                    markNotificationRead(notif.id);
                                    alert(res.message);
                                  }}
                                  className="px-3 py-1.5 bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Deny Payment
                                </button>
                              </>
                            )}
                          </>
                        )}

                        {isWithdrawal && (
                          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                            {isWithdrawalCompleted ? (
                              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/90 rounded-xl border border-black/10 shadow-2xs">
                                <button
                                  type="button"
                                  disabled
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-none flex items-center gap-1 cursor-not-allowed ${
                                    withdrawalActionTaken === 'approved'
                                      ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-600/40 opacity-100 font-extrabold'
                                      : 'bg-gray-100 text-gray-400 opacity-30'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{withdrawalActionTaken === 'approved' ? '✓ Approved Full' : 'Approve Full'}</span>
                                </button>
                                <button
                                  type="button"
                                  disabled
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-none flex items-center gap-1 cursor-not-allowed ${
                                    withdrawalActionTaken === 'partial'
                                      ? 'bg-[#C5A059] text-[#11271D] shadow-xs ring-2 ring-[#C5A059]/40 opacity-100 font-extrabold'
                                      : 'bg-gray-100 text-gray-400 opacity-30'
                                  }`}
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>{withdrawalActionTaken === 'partial' ? '✓ Partial Payout' : 'Partial Payout'}</span>
                                </button>
                                <button
                                  type="button"
                                  disabled
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-none flex items-center gap-1 cursor-not-allowed ${
                                    withdrawalActionTaken === 'declined'
                                      ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-600/40 opacity-100 font-extrabold'
                                      : 'bg-gray-100 text-gray-400 opacity-30'
                                  }`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>{withdrawalActionTaken === 'declined' ? '✓ Declined' : 'Decline'}</span>
                                </button>
                                <span className="text-[10px] font-mono font-bold text-[#1B3B2B] bg-[#FAF9F5] px-2 py-1 rounded-md border border-[#E5E3D8] whitespace-nowrap flex items-center gap-1">
                                  <span>🔒 Locked · Settled</span>
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-wrap items-center gap-1.5">
                                {(() => {
                                  const targetTx = relatedTx || {
                                    id: notif.metadata?.txId || notif.id,
                                    user_id: notif.userId || 'usr-investor-01',
                                    amount: notif.amount || 1200,
                                    reference: notif.metadata?.txRef || 'WTH-REQ',
                                    payment_gateway: (notif.metadata?.cryptoCoin ? 'crypto' : 'sepa') as any,
                                    metadata: notif.metadata || {},
                                    status: 'pending' as const,
                                  };
                                  return (
                                    <>
                                      <button
                                        onClick={() => handleInitiateApprove(targetTx)}
                                        className="px-3 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-98"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Approve Full</span>
                                      </button>
                                      <button
                                        onClick={() => handleInitiatePartial(targetTx)}
                                        className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#b08d47] text-[#11271D] rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-98"
                                      >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Partial Payout</span>
                                      </button>
                                      <button
                                        onClick={() => handleInitiateDecline(targetTx)}
                                        className="px-3 py-1.5 bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                        <span>Decline &amp; Issues</span>
                                      </button>
                                    </>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        )}

                        {!notif.read && (
                          <button
                            onClick={() => markNotificationRead(notif.id)}
                            className="p-1.5 text-[#5C6572] hover:text-[#1B3B2B] cursor-pointer"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB: FEE PURSE */}
        {adminTab === 'fee_purse' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-xs p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E5E3D8] pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C5A059]/15 text-[#8F702B]">
                    <Coins className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Dedicated Protocol Treasury Escrow</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1B3B2B] flex items-center gap-2">
                    <span>Withdrawal Fee Revenue Purse</span>
                    <span className="text-xs font-mono font-bold bg-[#1B3B2B] text-[#C5A059] px-2.5 py-0.5 rounded-full">
                      Segregated Account
                    </span>
                  </h3>
                  <p className="text-xs text-[#5C6572] max-w-2xl leading-relaxed">
                    All withdrawal fees deducted from investor payouts are deposited into this dedicated purse. These revenues are completely separated from active farm production cycles and flock operating capital.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {isEditingFeeRate ? (
                    <div className="flex items-center gap-2 bg-[#F7F6F2] p-1.5 rounded-xl border border-[#DCDAD0]">
                      <span className="text-xs font-bold text-[#1B3B2B] pl-2">Rate:</span>
                      <input
                        type="number"
                        min="0"
                        max="25"
                        step="0.1"
                        value={feeRateInput}
                        onChange={(e) => setFeeRateInput(parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-white border border-[#DCDAD0] rounded text-xs font-mono font-bold text-[#1B3B2B]"
                      />
                      <span className="text-xs font-mono font-bold">%</span>
                      <button
                        onClick={handleSaveFeeRate}
                        className="px-2.5 py-1 bg-[#16A34A] text-white rounded text-xs font-bold hover:bg-[#15803D] cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingFeeRate(false)}
                        className="px-2.5 py-1 bg-gray-200 text-[#5C6572] rounded text-xs font-semibold hover:bg-gray-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setFeeRateInput(settings.platformFeePercentage || 1.5);
                        setIsEditingFeeRate(true);
                      }}
                      className="px-3.5 py-2 bg-[#F7F6F2] hover:bg-[#EAE8E0] text-[#1B3B2B] rounded-xl text-xs font-semibold border border-[#DCDAD0] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#5C6572]" />
                      <span>Fee Rate: {settings.platformFeePercentage || 1.5}%</span>
                      <span className="text-[10px] text-[#C5A059] font-bold uppercase underline">Edit</span>
                    </button>
                  )}

                  <button
                    onClick={handleOpenSweepModal}
                    disabled={adminFeePurse.totalAccumulatedBalance <= 0}
                    className="px-4 py-2 bg-[#1B3B2B] hover:bg-[#11271D] disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
                  >
                    <ArrowUpRight className="w-4 h-4 text-[#C5A059]" />
                    <span>Sweep Purse to Treasury</span>
                  </button>
                </div>
              </div>

              {feePurseFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    feePurseFeedback.type === 'success'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {feePurseFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                  )}
                  <span>{feePurseFeedback.message}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E5E3D8] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#5C6572]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Fee Purse Balance</span>
                    <Coins className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B] font-mono tabular-nums">
                    {formatCurrentCurrency(adminFeePurse.totalAccumulatedBalance, true)}
                  </div>
                  <div className="text-[11px] text-[#16A34A] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Segregated corporate reserve</span>
                  </div>
                </div>

                <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E5E3D8] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#5C6572]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Total Fees Collected</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B] font-mono tabular-nums">
                    {adminFeePurse.totalFeesCollectedCount}
                  </div>
                  <div className="text-[11px] text-[#5C6572]">
                    Settled withdrawal deductions
                  </div>
                </div>

                <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E5E3D8] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#5C6572]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Current Deduction Rate</span>
                    <Settings className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B] font-mono tabular-nums">
                    {settings.platformFeePercentage || 1.5}%
                  </div>
                  <div className="text-[11px] text-[#5C6572]">
                    Applied to both full & partial payouts
                  </div>
                </div>

                <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E5E3D8] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#5C6572]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Fee Per Settlement</span>
                    <TrendingUp className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B] font-mono tabular-nums">
                    {adminFeePurse.totalFeesCollectedCount > 0
                      ? formatCurrentCurrency(
                          adminFeePurse.totalAccumulatedBalance / adminFeePurse.totalFeesCollectedCount,
                          true
                        )
                      : formatCurrentCurrency(0, true)}
                  </div>
                  <div className="text-[11px] text-[#5C6572]">
                    Across recorded payouts
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Capital Pairing Banner - Refactored away from solar */}
            <div className="bg-gradient-to-r from-[#1B3B2B] to-[#11271D] text-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#C5A059] text-[#11271D] flex items-center justify-center font-black">
                    <Wheat className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">
                      Farm Capital Pairing & Operational Expense Allocation Architecture
                    </h4>
                    <p className="text-xs text-white/70">
                      How investor capital is actively paired with tangible real-world farm cost centers
                    </p>
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold bg-white/10 px-3 py-1 rounded-lg border border-white/15 text-[#C5A059]">
                  Audited European Agriculture
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="font-bold text-[#C5A059] flex items-center gap-1.5 mb-1">
                    <Egg className="w-3.5 h-3.5" />
                    <span>38% Biological Production</span>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    Day-old chick placement (Hubbard, Sasso, Bresse), brooding heat, veterinary diagnostics & vaccination.
                  </p>
                </div>

                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="font-bold text-[#C5A059] flex items-center gap-1.5 mb-1">
                    <Wheat className="w-3.5 h-3.5" />
                    <span>32% Feed Production</span>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    On-site precision milling, non-GMO grain silos, automated micro-nutrient dispensing & 1.54:1 FCR targeting.
                  </p>
                </div>

                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="font-bold text-[#C5A059] flex items-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>20% Facility Building</span>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    Sub-zero thermal bio-domes, automated aviary conveyors, geothermal loops & summer peak-shaving solar.
                  </p>
                </div>

                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="font-bold text-[#C5A059] flex items-center gap-1.5 mb-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>10% Farm Operating Logistics</span>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    Cold-chain refrigerated transit, automated acoustic egg sorting & direct distribution to European supermarket chains.
                  </p>
                </div>
              </div>
            </div>

            {/* Fee Deductions Ledger */}
            <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-xs overflow-hidden space-y-4 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEA]">
                <div>
                  <h3 className="text-base font-bold text-[#1B3B2B] flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#C5A059]" />
                    <span>Segregated Fee Deductions Ledger</span>
                  </h3>
                  <p className="text-xs text-[#5C6572]">
                    Detailed record of every withdrawal fee deducted, credited to this purse, and disbursed to the investor
                  </p>
                </div>

                <div className="text-xs font-mono font-bold text-[#1B3B2B] bg-[#F7F6F2] px-3 py-1.5 rounded-xl border border-[#E5E3D8]">
                  Total Collected: {formatCurrentCurrency(adminFeePurse.totalAccumulatedBalance, true)} ({adminFeePurse.entries.length} Records)
                </div>
              </div>

              {adminFeePurse.entries.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#5C6572] bg-[#FAF9F5] rounded-xl border border-[#E5E3D8] space-y-2">
                  <Coins className="w-8 h-8 text-[#C5A059] mx-auto opacity-50" />
                  <p className="font-bold text-[#1B3B2B]">No Fee Deductions Recorded Yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F5] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                      <tr>
                        <th className="py-3 px-3">Date / Timestamp</th>
                        <th className="py-3 px-3">Transaction Ref</th>
                        <th className="py-3 px-3">Investor</th>
                        <th className="py-3 px-3 text-right">Gross Requested</th>
                        <th className="py-3 px-3 text-right">Fee Rate</th>
                        <th className="py-3 px-3 text-right">Fee to Purse</th>
                        <th className="py-3 px-3 text-right">Net Disbursed</th>
                        <th className="py-3 px-3">Payout Type</th>
                        <th className="py-3 px-3">Expense Pairing</th>
                        <th className="py-3 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EFEA]">
                      {adminFeePurse.entries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-[#FAF9F5] transition-colors">
                          <td className="py-3 px-3 text-[#5C6572] whitespace-nowrap">
                            <div className="font-semibold text-[#1B3B2B]">{formatDate(entry.createdAt, language)}</div>
                            <div className="text-[10px] font-mono text-[#7C887E]">
                              {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#1B3B2B] whitespace-nowrap">
                            {entry.txRef}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="font-bold text-[#1B3B2B]">{entry.userName}</div>
                            <div className="text-[10px] font-mono text-[#5C6572]">{entry.userId}</div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-semibold text-[#1B3B2B]">
                            {formatCurrentCurrency(entry.grossAmount, true)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[#5C6572]">
                            {entry.feePercentage}%
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-extrabold text-[#C5A059] bg-[#C5A059]/5 px-2 rounded">
                            +{formatCurrentCurrency(entry.feeAmount, true)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                            {formatCurrentCurrency(entry.netPayoutAmount, true)}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                entry.payoutType === 'full'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {entry.payoutType === 'full' ? 'Full Approval' : 'Partial Tranche'}
                            </span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="text-[11px] font-semibold text-[#1B3B2B] bg-[#F7F6F2] px-2 py-0.5 rounded border border-[#E5E3D8] capitalize">
                              {entry.capitalPairingCategory?.replace('_', ' ') || 'Production'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#1B3B2B] text-[#C5A059]">
                              <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                              <span>Secured in Purse</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: REVIEWS */}
        {adminTab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E3D8] pb-5">
              <div>
                <h3 className="text-lg font-bold text-[#1B3B2B] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#C5A059]" />
                  <span>Investor Reviews & Testimonials Moderation</span>
                </h3>
                <p className="text-xs text-[#5C6572] mt-0.5">
                  Approve or decline submitted investor reviews before they appear on the homepage.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setReviewFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                      reviewFilter === filter
                        ? 'bg-[#1B3B2B] text-white shadow-xs'
                        : 'bg-[#F7F6F2] text-[#5C6572] hover:bg-[#EAE8E0]'
                    }`}
                  >
                    {filter === 'all' && `All (${reviews.length})`}
                    {filter === 'pending' && `Pending Approval (${pendingReviews.length})`}
                    {filter === 'approved' && `Approved (${approvedReviews.length})`}
                    {filter === 'rejected' && `Rejected (${rejectedReviews.length})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="p-12 text-center bg-[#F7F6F2] rounded-xl border border-[#E5E3D8] text-xs text-[#5C6572] space-y-2">
                  <Award className="w-8 h-8 text-[#5C6572] mx-auto opacity-40" />
                  <p className="font-semibold">No reviews found matching the "{reviewFilter}" filter.</p>
                </div>
              ) : (
                filteredReviews.map((rev) => {
                  const isPending = rev.status === 'pending';
                  const isApproved = rev.status === 'approved' || (!rev.status && rev.verified);
                  const isRejected = rev.status === 'rejected';

                  return (
                    <div
                      key={rev.id}
                      className={`p-5 rounded-xl border transition-all ${
                        isPending
                          ? 'border-amber-300 bg-amber-50/40 shadow-xs'
                          : isApproved
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-red-200 bg-red-50/20 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-[#1B3B2B] text-sm">
                              {rev.name}
                            </span>
                            <span className="text-xs text-[#5C6572]">· {rev.role}</span>
                            <span className="text-xs font-mono text-[#5C6572] bg-white px-2 py-0.5 rounded border border-[#E5E3D8] flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#C5A059]" />
                              <span>{rev.city}</span>
                            </span>
                            
                            {isPending && (
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-700" />
                                <span>Pending Admin Approval</span>
                              </span>
                            )}
                            {isApproved && (
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                <span>Approved · Live on Homepage</span>
                              </span>
                            )}
                            {isRejected && (
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-900 border border-red-300 flex items-center gap-1">
                                <X className="w-3 h-3 text-red-700" />
                                <span>Rejected · Hidden from Homepage</span>
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <div className="flex items-center text-[#C5A059]">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                              ))}
                            </div>
                            <span className="text-[11px] font-mono font-bold text-[#1B3B2B] bg-white px-2 py-0.5 rounded border border-[#E5E3D8]">
                              {rev.plan_title || rev.yieldAchieved}
                            </span>
                            <span className="text-[11px] text-[#5C6572] font-mono">
                              {rev.portfolio}
                            </span>
                            <span className="text-[11px] text-[#7C887E]">
                              {formatDate(rev.created_at, language)}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-[#2D3748] italic bg-white p-3.5 rounded-xl border border-[#E5E3D8] leading-relaxed">
                            "{rev.quote}"
                          </p>
                        </div>

                        <div className="flex md:flex-col items-center gap-2 shrink-0 self-end md:self-start">
                          {!isApproved && (
                            <button
                              onClick={() => approveReview(rev.id)}
                              className="px-3.5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap active:scale-98"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve & Publish</span>
                            </button>
                          )}
                          {isApproved && (
                            <button
                              onClick={() => rejectReview(rev.id)}
                              className="px-3.5 py-2 bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                            >
                              <X className="w-3.5 h-3.5 text-amber-600" />
                              <span>Unpublish from Home</span>
                            </button>
                          )}
                          {isPending && (
                            <button
                              onClick={() => rejectReview(rev.id)}
                              className="px-3.5 py-2 bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject Review</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteReview(rev.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB: EMAILS */}
        {adminTab === 'emails' && (
          <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E3D8] pb-5">
              <div>
                <h3 className="text-lg font-bold text-[#1B3B2B] flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>Automated Email Dispatches & Investor Notices</span>
                </h3>
                <p className="text-xs text-[#5C6572] mt-0.5">
                  Professional email notifications automatically triggered upon investment maturity payouts or review approvals.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setEmailFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    emailFilter === 'all'
                      ? 'bg-[#1B3B2B] text-white shadow-xs'
                      : 'bg-[#F7F6F2] text-[#5C6572] hover:bg-[#EAE8E0]'
                  }`}
                >
                  All Dispatches ({emailDispatches.length})
                </button>
                <button
                  onClick={() => setEmailFilter('investment_matured')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    emailFilter === 'investment_matured'
                      ? 'bg-[#1B3B2B] text-white shadow-xs'
                      : 'bg-[#F7F6F2] text-[#5C6572] hover:bg-[#EAE8E0]'
                  }`}
                >
                  Investment Matured ({emailDispatches.filter((e) => e.type === 'investment_matured').length})
                </button>
                <button
                  onClick={() => setEmailFilter('review_approved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    emailFilter === 'review_approved'
                      ? 'bg-[#1B3B2B] text-white shadow-xs'
                      : 'bg-[#F7F6F2] text-[#5C6572] hover:bg-[#EAE8E0]'
                  }`}
                >
                  Review Approved ({emailDispatches.filter((e) => e.type === 'review_approved').length})
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {emailDispatches
                .filter((item) => (emailFilter === 'all' ? true : item.type === emailFilter))
                .length === 0 ? (
                <div className="p-12 text-center bg-[#F7F6F2] rounded-xl border border-[#E5E3D8] text-xs text-[#5C6572]">
                  <Mail className="w-8 h-8 text-[#5C6572] mx-auto opacity-40 mb-2" />
                  <p className="font-semibold">No emails match the selected filter.</p>
                </div>
              ) : (
                emailDispatches
                  .filter((item) => (emailFilter === 'all' ? true : item.type === emailFilter))
                  .map((email) => {
                    const isMatured = email.type === 'investment_matured';
                    return (
                      <div
                        key={email.id}
                        className="p-4 rounded-xl border border-[#E5E3D8] bg-[#FAF9F5] hover:bg-white hover:border-[#C5A059]/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                                isMatured
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-blue-100 text-blue-900 border border-blue-300'
                              }`}
                            >
                              {isMatured ? (
                                <>
                                  <Sparkles className="w-3 h-3 text-emerald-700" />
                                  <span>Investment Matured</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-blue-700" />
                                  <span>Review Approved</span>
                                </>
                              )}
                            </span>
                            <span className="text-xs font-bold text-[#1B3B2B]">
                              To: {email.recipientName} ({email.recipientEmail})
                            </span>
                            <span className="text-[10px] text-[#5C6572] font-mono">
                              · {formatDate(email.sentAt, language)}
                            </span>
                          </div>

                          <div className="text-sm font-extrabold text-[#1B3B2B]">
                            {email.subject}
                          </div>

                          <p className="text-xs text-[#5C6572] line-clamp-1">
                            {email.previewText}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Delivered</span>
                          </span>
                          <button
                            onClick={() => setSelectedEmailPreview(email)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>View Full Email</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}

        {/* TAB: WALLETS */}
        {adminTab === 'wallets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#1B3B2B]">Investor Wallets & Capital Balance Adjustments</h3>
                <p className="text-xs text-[#5C6572]">
                  Directly add (credit) or remove (debit) funds from any investor's wallet once external payments or wire transfers are confirmed.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                <button
                  onClick={() => {
                    setNewUserName('');
                    setNewUserEmail('');
                    setNewUserCountry('DE');
                    setNewUserInitialBalance(0);
                    setNewUserRole('user');
                    setNewUserKyc('verified');
                    setUserOpFeedback(null);
                    setShowAddUserModal(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add New User</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedAdjustUser(allUserProfiles[0] || null);
                    setAdjType('credit');
                    setAdjAmount(1000);
                    setAdjReason('Payment confirmed via Bitcoin deposit');
                    setShowWalletModal(true);
                  }}
                  className="px-3.5 py-2 bg-[#1B3B2B] hover:bg-[#11271D] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Adjust User Balance</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E5E3D8] shadow-2xs">
                <span className="text-[11px] font-semibold text-[#5C6572] uppercase">Total Active Investors</span>
                <div className="text-2xl font-bold font-mono text-[#1B3B2B] mt-1">{allUserProfiles.length} Users</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E5E3D8] shadow-2xs">
                <span className="text-[11px] font-semibold text-[#5C6572] uppercase">Total User Main Balances</span>
                <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
                  {formatEuro(Object.values(wallets).reduce((a, b) => a + (b.main_balance || 0), 0), true, language)}
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E5E3D8] shadow-2xs">
                <span className="text-[11px] font-semibold text-[#5C6572] uppercase">Total Locked in Farm Batches</span>
                <div className="text-2xl font-bold font-mono text-[#1B3B2B] mt-1">
                  {formatEuro(Object.values(wallets).reduce((a, b) => a + (b.locked_investment_balance || 0), 0), true, language)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E3D8] overflow-hidden shadow-xs">
              <div className="p-4 bg-[#F7F6F2] border-b border-[#E5E3D8] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B3B2B] uppercase tracking-wider">
                  Investor Profiles & Current Wallet Balances
                </span>
                <span className="text-xs text-[#5C6572]">
                  Add users, adjust capital balances, or delete profiles from admin end
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-[#E5E3D8] text-[#5C6572] font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-5">Investor</th>
                      <th className="py-3 px-5">KYC Status</th>
                      <th className="py-3 px-5 text-right">Main Balance</th>
                      <th className="py-3 px-5 text-right">Earnings Balance</th>
                      <th className="py-3 px-5 text-right">Locked Investment</th>
                      <th className="py-3 px-5 text-center">Account Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EFEA]">
                    {allUserProfiles.map((user) => {
                      const uWal = wallets[user.user_id] || {
                        main_balance: 0,
                        earnings_balance: 0,
                        locked_investment_balance: 0,
                      };

                      return (
                        <tr key={user.id} className="hover:bg-[#FAF9F5] transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-[#1B3B2B]">{user.full_name}</div>
                            <div className="text-[#5C6572] text-[11px] font-mono">{user.email} · {user.user_id}</div>
                          </td>
                          <td className="py-3.5 px-5">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              user.kyc_status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {user.kyc_status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono font-bold text-[#1B3B2B] text-sm tabular-nums">
                            {formatEuro(uWal.main_balance, true, language)}
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono font-bold text-emerald-700 text-sm tabular-nums">
                            {formatEuro(uWal.earnings_balance, true, language)}
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono text-[#5C6572] text-sm tabular-nums">
                            {formatEuro(uWal.locked_investment_balance, true, language)}
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              <button
                                onClick={() => openBalanceModalForUser(user, 'direct_override')}
                                className="px-2.5 py-1 bg-[#1B3B2B] hover:bg-[#11271D] text-white rounded text-xs font-semibold cursor-pointer shadow-2xs flex items-center gap-1"
                              >
                                <Coins className="w-3 h-3 text-[#C5A059]" />
                                <span>Direct Set</span>
                              </button>
                              <button
                                onClick={() => {
                                  openBalanceModalForUser(user, 'delta_adjust');
                                  setAdjType('credit');
                                  setAdjAmount(1000);
                                  setAdjReason('Payment confirmed by Administrator');
                                }}
                                className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold cursor-pointer shadow-2xs flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Credit</span>
                              </button>
                              <button
                                onClick={() => {
                                  openBalanceModalForUser(user, 'delta_adjust');
                                  setAdjType('debit');
                                  setAdjAmount(500);
                                  setAdjReason('Manual deduction / wire reconciliation');
                                }}
                                className="px-2 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-semibold cursor-pointer shadow-2xs flex items-center gap-1"
                              >
                                <Minus className="w-3 h-3" />
                                <span>Debit</span>
                              </button>
                              <button
                                onClick={() => setDeleteConfirmUser(user)}
                                disabled={user.user_id === 'usr-admin-01'}
                                className={`px-2 py-1 rounded text-xs font-semibold shadow-2xs flex items-center gap-1 ${
                                  user.user_id === 'usr-admin-01'
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-700 hover:bg-red-800 text-white cursor-pointer'
                                }`}
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
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
        )}

        {/* TAB: INQUIRIES */}
        {adminTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                    <Headphones className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1B3B2B]">Live Human Support Inquiries & Tickets</h3>
                </div>
                <p className="text-xs text-[#5C6572] mt-1">
                  Direct messages dispatched from the public floating Human Support bubble. Each inquiry sends a live notification here and an email alert to <strong>jayjaybusiness05@gmail.com</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#5C6572]">Filter:</span>
                {(['all', 'pending', 'resolved'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setInquiryFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      inquiryFilter === filter
                        ? 'bg-[#1B3B2B] text-white shadow-xs'
                        : 'bg-white border border-[#DCDAD0] text-[#5C6572] hover:text-[#1B3B2B]'
                    }`}
                  >
                    {filter === 'all' && `All (${humanInquiries.length})`}
                    {filter === 'pending' && `Pending (${humanInquiries.filter((i) => i.status === 'pending').length})`}
                    {filter === 'resolved' && `Resolved (${humanInquiries.filter((i) => i.status === 'resolved').length})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-sm text-[#1B3B2B]">Executive Email Routing Synchronized: jayjaybusiness05@gmail.com</div>
                <p className="leading-relaxed text-emerald-800">
                  When visitors choose human support over AI, their message is immediately recorded in your console and an automated notification is delivered to <strong>jayjaybusiness05@gmail.com</strong>.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {filteredInquiries.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E5E3D8] p-12 text-center text-xs text-[#5C6572] space-y-2">
                  <Headphones className="w-8 h-8 text-[#5C6572]/40 mx-auto" />
                  <p className="font-semibold text-sm text-[#1B3B2B]">No inquiries matching "{inquiryFilter}" filter</p>
                </div>
              ) : (
                filteredInquiries.map((inq) => (
                  <div key={inq.id} className="bg-white rounded-2xl border border-[#E5E3D8] p-5 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EFEA] pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-[#1B3B2B] bg-[#F7F6F2] px-2 py-0.5 rounded border border-[#E5E3D8]">
                          {inq.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inq.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {inq.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-[#5C6572]">
                          {new Date(inq.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Notification dispatched to jayjaybusiness05@gmail.com</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#E5E3D8] space-y-1.5 text-xs">
                        <span className="text-[10px] font-semibold text-[#5C6572] uppercase">Sender Contact</span>
                        <div className="font-bold text-[#1B3B2B] text-sm">{inq.senderName}</div>
                        <div className="font-mono text-[#5C6572] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#5C6572]" />
                          <span>{inq.senderEmail}</span>
                        </div>
                        {inq.senderPhone && (
                          <div className="font-mono text-[#5C6572] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#5C6572]" />
                            <span>{inq.senderPhone}</span>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2 space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] font-semibold text-[#5C6572] uppercase block">Inquiry Category</span>
                          <div className="font-bold text-[#1B3B2B] text-sm">{inq.subject}</div>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-[#5C6572] uppercase block">Message</span>
                          <p className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E3D8] text-[#2D3748] leading-relaxed whitespace-pre-wrap">
                            {inq.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    {inq.reply && (
                      <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center justify-between text-emerald-900 font-bold">
                          <span>Executive Response Dispatched</span>
                          {inq.repliedAt && <span className="font-normal text-[11px] text-emerald-700">{new Date(inq.repliedAt).toLocaleString()}</span>}
                        </div>
                        <p className="text-emerald-800 leading-relaxed">{inq.reply}</p>
                      </div>
                    )}

                    {inq.status === 'pending' && (
                      <div>
                        {replyingInquiryId === inq.id ? (
                          <div className="space-y-2 pt-2 border-t border-[#F0EFEA]">
                            <label className="text-xs font-bold text-[#1B3B2B] block">Executive Reply to {inq.senderName}</label>
                            <textarea
                              rows={3}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your official executive response here..."
                              className="w-full p-2.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setReplyingInquiryId(null);
                                  setReplyText('');
                                }}
                                className="px-3 py-1.5 border border-[#DCDAD0] rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSendInquiryReply(inq.id)}
                                disabled={isSubmittingReply || !replyText.trim()}
                                className="px-4 py-1.5 bg-[#1B3B2B] hover:bg-[#11271D] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Send Executive Reply & Resolve Ticket</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end pt-2 border-t border-[#F0EFEA]">
                            <button
                              onClick={() => {
                                setReplyingInquiryId(inq.id);
                                setReplyText(`Dear ${inq.senderName},\n\nThank you for contacting our Executive Operations Desk regarding "${inq.subject}". `);
                              }}
                              className="px-4 py-2 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>Reply to Investor</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: KYC */}
        {adminTab === 'kyc' && (
          <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E5E3D8]">
              <h3 className="text-lg font-bold text-[#1B3B2B]">Investor Identity & Compliance Center</h3>
              <p className="text-xs text-[#5C6572]">
                Review submitted identity dossiers according to EU AML & BaFin regulations
              </p>
            </div>

            <div className="divide-y divide-[#F0EFEA]">
              {allUserProfiles.map((user) => {
                const isPending = user.kyc_status === 'pending';
                const isVerified = user.kyc_status === 'verified';

                return (
                  <div key={user.id} className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-[#1B3B2B]">{user.full_name}</span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              isVerified
                                ? 'bg-emerald-100 text-emerald-800'
                                : isPending
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.kyc_status}
                          </span>
                        </div>
                        <div className="text-xs text-[#5C6572] mt-0.5">
                          {user.email} · Country: {user.country_code} · Registered: {formatDate(user.created_at, language)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {user.kyc_status !== 'verified' && (
                          <button
                            onClick={() => reviewKyc(user.user_id, true)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve KYC</span>
                          </button>
                        )}
                        {user.kyc_status !== 'rejected' && (
                          <button
                            onClick={() => reviewKyc(user.user_id, false, 'Address or identification details unverified')}
                            className="px-3 py-1.5 bg-white border border-red-300 hover:bg-red-50 text-red-700 rounded text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {user.kyc_data && (
                      <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#E5E3D8] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-[#5C6572] block">Country & City:</span>
                          <span className="font-medium text-[#1B3B2B]">
                            {user.kyc_data.city ? `${user.kyc_data.city}, ` : ''}{user.kyc_data.country || user.country_code}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#5C6572] block">Residential Address:</span>
                          <span className="font-medium text-[#1B3B2B]">{user.kyc_data.address || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[#5C6572] block">Contact Phone:</span>
                          <span className="font-mono text-[11px] text-[#1B3B2B]">
                            {user.kyc_data.phoneNumber || user.phone || '—'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: LEDGER */}
        {adminTab === 'ledger' && (
          <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E5E3D8]">
              <h3 className="text-lg font-bold text-[#1B3B2B]">Platform Transaction Ledger & Overrides</h3>
              <p className="text-xs text-[#5C6572]">
                Inspect deposits, withdrawals, allocations, and total payouts (capital + profit)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F6F2] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-5">Ref</th>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">User</th>
                    <th className="py-3 px-5">Type</th>
                    <th className="py-3 px-5">Amount ({currencySymbol})</th>
                    <th className="py-3 px-5">Rail</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEA]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#FBFBFA]">
                      <td className="py-3 px-5 font-mono font-bold text-[#1B3B2B]">{tx.reference}</td>
                      <td className="py-3 px-5 text-[#5C6572]">{formatDate(tx.created_at, language)}</td>
                      <td className="py-3 px-5 font-mono text-[#5C6572]">{tx.user_id}</td>
                      <td className="py-3 px-5 uppercase font-semibold text-[#1B3B2B]">{tx.type}</td>
                      <td className="py-3 px-5 font-mono font-bold tabular-nums text-[#1B3B2B]">
                        {formatEuro(tx.amount, true, language)}
                      </td>
                      <td className="py-3 px-5 uppercase font-mono text-[#5C6572]">{tx.payment_gateway}</td>
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
                      <td className="py-3 px-5 text-right">
                        {tx.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {tx.type === 'deposit' ? (
                              <>
                                <button
                                  onClick={async () => {
                                    const res = await confirmDeposit(tx.id);
                                    alert(res.message);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold hover:bg-emerald-800 cursor-pointer shadow-2xs"
                                >
                                  Confirm Payment
                                </button>
                                <button
                                  onClick={async () => {
                                    const res = await denyDeposit(tx.id, 'Deposit denied by administrator');
                                    alert(res.message);
                                  }}
                                  className="px-2.5 py-1 bg-red-600 text-white rounded text-[11px] font-semibold hover:bg-red-700 cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            ) : tx.type === 'withdrawal' ? (
                              <>
                                <button
                                  onClick={() => handleInitiateApprove(tx)}
                                  className="px-2.5 py-1 bg-[#16A34A] hover:bg-[#15803D] text-white rounded text-[11px] font-bold cursor-pointer shadow-2xs flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleInitiatePartial(tx)}
                                  className="px-2.5 py-1 bg-[#C5A059] hover:bg-[#b08d47] text-[#11271D] rounded text-[11px] font-bold cursor-pointer shadow-2xs flex items-center gap-1"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Partial</span>
                                </button>
                                <button
                                  onClick={() => handleInitiateDecline(tx)}
                                  className="px-2.5 py-1 bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded text-[11px] font-semibold cursor-pointer flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" />
                                  <span>Decline</span>
                                </button>
                              </>
                            ) : null}
                          </div>
                        ) : (
                          <div className="flex items-center justify-end">
                            {tx.type === 'withdrawal' ? (
                              tx.status === 'successful' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold shadow-2xs">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Full Approved · Locked</span>
                                </span>
                              ) : tx.status === 'partial' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold shadow-2xs">
                                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                                  <span>Partial Dispatched · Locked</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-800 border border-red-300 rounded-lg text-[11px] font-bold shadow-2xs">
                                  <X className="w-3 h-3 text-red-600" />
                                  <span>Declined &amp; Issues · Locked</span>
                                </span>
                              )
                            ) : tx.type === 'deposit' ? (
                              tx.status === 'successful' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-semibold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Confirmed · Locked</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-800 border border-red-300 rounded-lg text-[11px] font-semibold">
                                  <X className="w-3 h-3 text-red-600" />
                                  <span>Denied · Locked</span>
                                </span>
                              )
                            ) : (
                              <span className="text-[11px] font-mono text-[#7C887E]">Settled</span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PLANS */}
        {adminTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#1B3B2B]">Curated 4-Tier Investment Plans</h3>
                <p className="text-xs text-[#5C6572]">
                  Configured Tiers: 50% in 15d (£500–£4,499), 84% in 21d (£4,500–£11,499), 150% in 30d (£11,500–£99,999), 320% in 60d (£100,000–£1,000,000)
                </p>
              </div>
              <button
                onClick={handleOpenPlanCreate}
                className="px-4 py-2 bg-[#1B3B2B] hover:bg-[#11271D] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Add Custom Plan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((p) => (
                <div key={p.id} className="bg-white p-6 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-[#5C6572] font-mono">Rating: {p.risk_rating} · ESG: {p.esg_score}/100</div>
                      <h4 className="text-lg font-bold text-[#1B3B2B] mt-0.5">{p.title}</h4>
                      <p className="text-xs text-[#5C6572] line-clamp-2 mt-1">{p.description}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {p.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#F7F6F2] border border-[#E5E3D8] text-xs">
                    <div>
                      <span className="text-[#5C6572] block">Min / Max</span>
                      <strong className="font-mono text-[#1B3B2B]">
                        {formatEuro(p.min_amount, false, language)} – {formatEuro(p.max_amount, false, language)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#5C6572] block">Duration</span>
                      <strong className="font-mono text-[#1B3B2B]">{p.duration_days} Days</strong>
                    </div>
                    <div>
                      <span className="text-[#5C6572] block">Net ROI</span>
                      <strong className="font-mono text-[#16A34A]">+{p.roi_percentage.toFixed(0)}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0EFEA]">
                    <button
                      onClick={() => archivePlan(p.id)}
                      className="px-3 py-1.5 border border-[#DCDAD0] text-[#5C6572] hover:text-[#1B3B2B] rounded text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {p.status === 'active' ? 'Archive' : 'Restore'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingPlan(p);
                        setPlanTitle(p.title);
                        setPlanMin(p.min_amount);
                        setPlanMax(p.max_amount);
                        setPlanDuration(p.duration_days);
                        setPlanRoi(p.roi_percentage);
                        setPlanRating(p.risk_rating as any);
                        setPlanDesc(p.description);
                        setPlanBreed(p.poultry_breed);
                        setShowPlanModal(true);
                      }}
                      className="px-3 py-1.5 bg-[#1B3B2B] text-white rounded text-xs font-semibold hover:bg-[#11271D] cursor-pointer"
                    >
                      Edit Parameters
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CYCLES */}
        {adminTab === 'cycles' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#1B3B2B]">
                  Production Hubs Network ({cycles.length} Farms) & Portugal Expansion
                </h3>
                <p className="text-xs text-[#5C6572]">
                  Manage 30+ European & Arctic facilities (65% Layers & Egg hubs). Update growth stages, telemetry, and Portugal commissioning progress.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowNewFarmModal(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Add New Production Facility</span>
                </button>
              </div>
            </div>

            {/* Portugal Controller */}
            <div className="bg-[#F7F6F2] p-6 rounded-2xl border-2 border-[#1B3B2B]/25 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-[#1B3B2B] text-white">
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    <span>Admin Control · New Farm Opening</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#1B3B2B] mt-1">
                    Portugal Smart Agro Farm Progress Controller
                  </h4>
                  <p className="text-xs text-[#5C6572]">
                    Manually update the construction & commissioning progress (0%–100%). The public image is blurred until 100% is reached!
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-[#5C6572] uppercase font-semibold">Current Progress</div>
                  <div className="text-3xl font-extrabold text-[#1B3B2B] font-mono tabular-nums">
                    {PortugalProgressVal}%
                  </div>
                </div>
              </div>

              {PortugalSaveFeedback && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{PortugalSaveFeedback}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white p-5 rounded-xl border border-[#E5E3D8]">
                <div className="lg:col-span-8 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#1B3B2B] mb-2">
                      <span>Drag Progress Slider:</span>
                      <span className="font-mono text-emerald-700 font-bold">{PortugalProgressVal}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={PortugalProgressVal}
                      onChange={(e) => handleUpdatePortugal(Number(e.target.value))}
                      className="w-full h-2.5 bg-[#EAE8E0] rounded-lg appearance-none cursor-pointer accent-[#1B3B2B]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[#5C6572] font-medium text-[11px]">Quick Presets:</span>
                    {[25, 50, 65, 80, 95].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleUpdatePortugal(pct)}
                        className={`px-3 py-1 rounded-lg font-mono font-semibold transition-all cursor-pointer ${
                          PortugalProgressVal === pct
                            ? 'bg-[#1B3B2B] text-white shadow-2xs'
                            : 'bg-[#F0EFEA] hover:bg-[#E5E3D8] text-[#1B3B2B]'
                        }`}
                      >
                        {pct}% (Blurred)
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleUpdatePortugal(100)}
                      className={`px-3 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        PortugalProgressVal === 100
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>100% Commissioned (Reveal Image)</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 relative h-36 rounded-xl overflow-hidden border border-[#E5E3D8] bg-black">
                  <img
                    src={PortugalFarm?.image_url}
                    alt="Portugal preview"
                    referrerPolicy="no-referrer"
                    style={{
                      filter: PortugalProgressVal >= 100 ? 'none' : 'blur(14px)',
                      transform: PortugalProgressVal >= 100 ? 'none' : 'scale(1.08)',
                      transition: 'filter 0.5s ease',
                    }}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-3 text-center">
                    {PortugalProgressVal >= 100 ? (
                      <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-bold shadow-md">
                        🎉 Unlocked & Clear (100%)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-[#B45309] text-white text-xs font-bold shadow-md flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Blurred ({PortugalProgressVal}%)</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Cycles Filter */}
            <div className="flex items-center gap-2 p-1 bg-[#F0EFEA] rounded-xl border border-[#E5E3D8] self-start w-fit">
              <button
                type="button"
                onClick={() => setCycleCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  cycleCategoryFilter === 'all'
                    ? 'bg-white text-[#1B3B2B] shadow-2xs'
                    : 'text-[#5C6572] hover:text-[#1B3B2B]'
                }`}
              >
                All Facilities ({cycles.length})
              </button>
              <button
                type="button"
                onClick={() => setCycleCategoryFilter('layers_eggs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  cycleCategoryFilter === 'layers_eggs'
                    ? 'bg-emerald-900 text-white shadow-2xs'
                    : 'text-[#5C6572] hover:text-[#1B3B2B]'
                }`}
              >
                <Egg className="w-3 h-3 text-[#C5A059]" />
                <span>Layers & Eggs (21 Hubs · 65.6%)</span>
              </button>
              <button
                type="button"
                onClick={() => setCycleCategoryFilter('broilers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  cycleCategoryFilter === 'broilers'
                    ? 'bg-[#1B3B2B] text-white shadow-2xs'
                    : 'text-[#5C6572] hover:text-[#1B3B2B]'
                }`}
              >
                <Feather className="w-3 h-3 text-[#C5A059]" />
                <span>Broilers (11 Hubs)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cycles
                .filter((cyc) => {
                  if (cycleCategoryFilter === 'layers_eggs') return cyc.category === 'layers_eggs';
                  if (cycleCategoryFilter === 'broilers') return cyc.category === 'broilers';
                  return true;
                })
                .map((cyc) => {
                  const stages: CycleStage[] = [
                    'planning',
                    'chick_placement',
                    'growth',
                    'finishing',
                    'harvest',
                    'completed',
                    'construction',
                  ];
                  const isLayer = cyc.category === 'layers_eggs';
                  const isPortugal = cyc.id === 'cyc-Portugal-01' || cyc.facility_location.includes('Portugal');
                  const isBlurred = isPortugal && PortugalProgressVal < 100;

                  return (
                    <div key={cyc.id} className="bg-white p-6 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-[#C5A059]">{cyc.cycle_code}</span>
                            {isLayer ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                                🥚 Layer & Eggs
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                                🍗 Broiler
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-bold text-[#1B3B2B] mt-1">{cyc.facility_name || cyc.facility_location}</h4>
                          <div className="text-[11px] text-[#5C6572]">{cyc.facility_location}</div>
                        </div>
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-[#F7F6F2] rounded text-[#1B3B2B]">
                          {cyc.total_birds.toLocaleString()} birds
                        </span>
                      </div>

                      {isLayer && cyc.daily_egg_capacity && (
                        <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-xs flex justify-between">
                          <span className="text-amber-900 font-semibold">Egg Capacity:</span>
                          <span className="font-mono font-bold text-amber-950">
                            {cyc.daily_egg_capacity.toLocaleString()} eggs/day
                          </span>
                        </div>
                      )}

                      {isPortugal && (
                        <div className="p-2 rounded-lg bg-slate-100 border border-slate-300 text-xs flex justify-between items-center">
                          <span className="text-slate-700 font-semibold flex items-center gap-1">
                            {isBlurred ? <Lock className="w-3 h-3 text-amber-700" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            <span>Image Blur Status:</span>
                          </span>
                          <span className={`font-mono font-bold ${isBlurred ? 'text-amber-800' : 'text-emerald-700'}`}>
                            {isBlurred ? `Blurred (${PortugalProgressVal}%)` : '100% Unlocked'}
                          </span>
                        </div>
                      )}

                      <div className="space-y-2 text-xs">
                        <label className="font-semibold text-[#1B3B2B] block">Current Stage:</label>
                        <select
                          value={cyc.current_stage}
                          onChange={(e: any) => updateCycleStage(cyc.id, e.target.value)}
                          className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs font-semibold text-[#1B3B2B]"
                        >
                          {stages.map((st) => (
                            <option key={st} value={st}>
                              {st.replace('_', ' ').toUpperCase()}
                            </option>
                          ))}
                        </select>

                        {cyc.current_stage !== 'completed' ? (
                          <button
                            type="button"
                            onClick={() => updateCycleStage(cyc.id, 'completed')}
                            className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Mark Farm Completed ({cyc.total_birds.toLocaleString()} Birds)</span>
                          </button>
                        ) : (
                          <div className="w-full py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Farm Completed · Capacity Reflecting on Platform</span>
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E5E3D8] grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[#5C6572] block">Current Avg Weight:</span>
                          <span className="font-mono font-bold">{cyc.current_weight_kg || 1.2} kg</span>
                        </div>
                        <div>
                          <span className="text-[#5C6572] block">Mortality Rate:</span>
                          <span className="font-mono font-bold text-[#16A34A]">{cyc.mortality_rate || 0.4}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Maturity Payout Execution Box */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                <div>
                  <h4 className="text-base font-bold text-[#1B3B2B]">Active Contracts Eligible for Harvest Settlement</h4>
                  <p className="text-xs text-[#5C6572]">
                    Simulate contractual completion: releases total payout (combination of locked capital + profit) to investor wallet
                  </p>
                </div>
              </div>

              {activeInvestments.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#5C6572]">
                  No active investments waiting for maturity.
                </div>
              ) : (
                <div className="divide-y divide-[#F0EFEA]">
                  {activeInvestments.map((inv) => (
                    <div key={inv.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="font-bold text-[#1B3B2B]">
                          {inv.plan_title} ({inv.cycle_code})
                        </div>
                        <div className="text-[#5C6572]">
                          Investor: {inv.user_id} · Principal: {formatEuro(inv.principal_amount, true, language)} · Net Return: +{formatEuro(inv.expected_roi_amount, true, language)}
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          const res = await triggerMaturityPayout(inv.id);
                          if (res.success) {
                            alert(res.message);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        Trigger Total Payout ({formatEuro(inv.total_payout, true, language)})
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS */}
        {adminTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-[#E5E3D8] p-6 sm:p-8 shadow-xs space-y-6 max-w-2xl">
            {/* Special Admin Credentials Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#11271D] via-[#1B3B2B] to-[#11271D] border-2 border-[#C5A059] text-white shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] border border-[#C5A059]/40">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Admin Portal Access Credentials</h3>
                    <p className="text-xs text-[#A7B6AB]">Set your special email and password required to log into the admin portal</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase bg-[#C5A059] text-[#11271D] font-black px-2 py-0.5 rounded">
                  Admin Only
                </span>
              </div>

              {adminCredFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                    adminCredFeedback.type === 'success'
                      ? 'bg-emerald-900/60 border border-emerald-400 text-emerald-200'
                      : 'bg-red-900/60 border border-red-400 text-red-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{adminCredFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSaveAdminCreds} className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-[#D8DFD9] block mb-1">
                    Special Admin Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={specialAdminEmail}
                    onChange={(e) => setSpecialAdminEmail(e.target.value)}
                    placeholder="admin@birdgrow.eu"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#D8DFD9] block mb-1 flex items-center justify-between">
                    <span>Special Admin Password</span>
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="text-[10px] text-[#C5A059] hover:underline cursor-pointer"
                    >
                      {showAdminPass ? 'Hide Password' : 'Show Password'}
                    </button>
                  </label>
                  <input
                    type={showAdminPass ? 'text' : 'password'}
                    required
                    value={specialAdminPassword}
                    onChange={(e) => setSpecialAdminPassword(e.target.value)}
                    placeholder="Enter new admin password (min 6 characters)"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[10px] text-[#A7B6AB]">
                    Only users entering these exact credentials can access the admin dashboard.
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-[#11271D] text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
                  >
                    Save New Credentials
                  </button>
                </div>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#1B3B2B]">Crypto Settlement Rails &amp; Escrow Simulation</h3>
              <p className="text-xs text-[#5C6572]">
                Test on-chain confirmations and webhook handlers for Bitcoin, USDT, Ethereum, and USDC
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#E5E3D8] space-y-3">
                <div className="text-xs font-bold text-[#1B3B2B]">Simulate Inbound Crypto Settlement Event</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleRunWebhookSimulation('crypto')}
                    className="px-3 py-1.5 bg-[#1B3B2B] text-white rounded text-xs font-semibold hover:bg-[#11271D] cursor-pointer"
                  >
                    Simulate USDT Deposit ({formatCurrentCurrency(5000, false)})
                  </button>
                  <button
                    onClick={() => handleRunWebhookSimulation('crypto')}
                    className="px-3 py-1.5 bg-[#C5A059] text-[#11271D] rounded text-xs font-bold hover:bg-[#B38F46] cursor-pointer"
                  >
                    Simulate BTC Deposit ({formatCurrentCurrency(5000, false)})
                  </button>
                </div>
                {webhookLog && (
                  <div className="p-3 rounded-lg bg-[#11271D] text-emerald-400 font-mono text-[11px] leading-relaxed">
                    {webhookLog}
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#E5E3D8] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1B3B2B] flex items-center gap-1.5">
                      <span>Administrator Notification & Settlement Email</span>
                    </label>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                      Receives Alerts & Credit Inquiries
                    </span>
                  </div>
                  <input
                    type="email"
                    required
                    value={adminEmailState}
                    onChange={(e) => setAdminEmailState(e.target.value)}
                    placeholder="e.g. foodcriticdan@gmail.com"
                    className="w-full px-3 py-2 bg-white border border-[#DCDAD0] rounded-lg text-xs font-medium text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  />
                  <p className="text-[11px] text-[#5C6572]">
                    Deposit confirmation popups, withdrawal notifications, and human support inquiries are automatically routed to this address.
                  </p>
                </div>

                <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#E5E3D8] space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#1B3B2B]">Deposit Payment Receiving Addresses</h4>
                    <p className="text-[11px] text-[#5C6572]">
                      Edit your official receiving addresses below. These destinations immediately reflect in the investor deposit modal.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="text-[11px] font-semibold text-[#1B3B2B] block mb-1">
                        Bitcoin (BTC) Address
                      </label>
                      <input
                        type="text"
                        required
                        value={btcAddress}
                        onChange={(e) => setBtcAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DCDAD0] rounded-lg text-xs font-mono text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#1B3B2B] block mb-1">
                        Ethereum (ETH) Address
                      </label>
                      <input
                        type="text"
                        required
                        value={ethAddress}
                        onChange={(e) => setEthAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DCDAD0] rounded-lg text-xs font-mono text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#1B3B2B] block mb-1">
                          USDT (TRC-20 Tron) Address
                        </label>
                        <input
                          type="text"
                          required
                          value={usdtTrc20Address}
                          onChange={(e) => setUsdtTrc20Address(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#DCDAD0] rounded-lg text-xs font-mono text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#1B3B2B] block mb-1">
                          USDT (ERC-20 Ethereum) Address
                        </label>
                        <input
                          type="text"
                          required
                          value={usdtErc20Address}
                          onChange={(e) => setUsdtErc20Address(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#DCDAD0] rounded-lg text-xs font-mono text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#1B3B2B] block mb-1">
                        USDC (ERC-20) Address
                      </label>
                      <input
                        type="text"
                        required
                        value={usdcAddress}
                        onChange={(e) => setUsdcAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DCDAD0] rounded-lg text-xs font-mono text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#1B3B2B] block mb-1">Platform Commission Fee (%)</label>
                    <input
                      type="number"
                      step={0.1}
                      value={platformFee}
                      onChange={(e) => setPlatformFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs font-mono text-[#1B3B2B]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1B3B2B] block mb-1">Minimum Withdrawal (€)</label>
                    <input
                      type="number"
                      value={minWithdrawal}
                      onChange={(e) => setMinWithdrawal(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs font-mono text-[#1B3B2B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 bg-[#1B3B2B] hover:bg-[#11271D] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-2"
                >
                  <Coins className="w-4 h-4 text-[#C5A059]" />
                  <span>Save Receiving Addresses & Settings</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 12: REFERRALS */}
        {adminTab === 'referrals' && <AdminReferralSection />}

      </div>

      {/* Plan Creation / Edit Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E5E3D8] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#1B3B2B]">
              {editingPlan ? 'Edit Plan Parameters' : 'Create New Investment Tier'}
            </h3>

            <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="e.g. Starter Plan"
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Min Entry ({currencySymbol})</label>
                  <input
                    type="number"
                    value={planMin}
                    onChange={(e) => setPlanMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Max Cap ({currencySymbol})</label>
                  <input
                    type="number"
                    value={planMax}
                    onChange={(e) => setPlanMax(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Duration (d)</label>
                  <input
                    type="number"
                    value={planDuration}
                    onChange={(e) => setPlanDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Net ROI (%)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={planRoi}
                    onChange={(e) => setPlanRoi(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Rating</label>
                  <select
                    value={planRating}
                    onChange={(e: any) => setPlanRating(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Poultry Breed Genetics</label>
                <input
                  type="text"
                  value={planBreed}
                  onChange={(e) => setPlanBreed(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={planDesc}
                  onChange={(e) => setPlanDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-3 py-1.5 border border-[#DCDAD0] rounded text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1B3B2B] text-white rounded text-xs font-semibold hover:bg-[#11271D] cursor-pointer"
                >
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Farm Telemetry Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E5E3D8] shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#1B3B2B]">Publish Live Farm Telemetry Log</h3>

            <form onSubmit={handleSaveFarmUpdate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select European Batch</label>
                <select
                  value={updateCycleId}
                  onChange={(e) => setUpdateCycleId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs font-semibold"
                >
                  {cycles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.cycle_code} ({c.facility_location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Update Headline</label>
                <input
                  type="text"
                  required
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  placeholder="e.g. Day 14 Sensory Report & Pasture Access"
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Detailed Operational Log</label>
                <textarea
                  rows={3}
                  required
                  value={updateDesc}
                  onChange={(e) => setUpdateDesc(e.target.value)}
                  placeholder="Flock weight gains ahead of schedule, optimal humidity and feed conversion..."
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Week</label>
                  <input
                    type="number"
                    value={updateWeek}
                    onChange={(e) => setUpdateWeek(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step={0.01}
                    value={updateWeight}
                    onChange={(e) => setUpdateWeight(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">FCR</label>
                  <input
                    type="number"
                    step={0.01}
                    value={updateFcr}
                    onChange={(e) => setUpdateFcr(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Mortality %</label>
                  <input
                    type="number"
                    step={0.01}
                    value={updateMortality}
                    onChange={(e) => setUpdateMortality(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Veterinary Health Status</label>
                <input
                  type="text"
                  value={updateHealth}
                  onChange={(e) => setUpdateHealth(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-3 py-1.5 border border-[#DCDAD0] rounded text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1B3B2B] text-white rounded text-xs font-semibold hover:bg-[#11271D] cursor-pointer"
                >
                  Publish Log to Investors
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Farm Opening / Facility Creation Modal */}
      {showNewFarmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E5E3D8] shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E3D8]">
              <div>
                <h3 className="text-base font-bold text-[#1B3B2B]">Add New European Production Facility</h3>
                <p className="text-xs text-[#5C6572]">
                  Add a bio-secure poultry facility (dual layers & broilers or specialized hub). Bird capacity will automatically update platform totals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewFarmModal(false)}
                className="p-1.5 hover:bg-[#F7F6F2] rounded-lg text-[#5C6572] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {newFarmFeedback && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                newFarmFeedback.startsWith('✓') ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-300'
              }`}>
                {newFarmFeedback.startsWith('✓') ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
                <span>{newFarmFeedback}</span>
              </div>
            )}

            <form onSubmit={handleCreateFarm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Facility Name</label>
                  <input
                    type="text"
                    required
                    value={newFarmName}
                    onChange={(e) => setNewFarmName(e.target.value)}
                    placeholder="e.g. Styria Dual Bio-Hub"
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs font-bold text-[#1B3B2B]"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Location & Country</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={newFarmLocation}
                      onChange={(e) => setNewFarmLocation(e.target.value)}
                      placeholder="e.g. Styria Foothills"
                      className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                    />
                    <select
                      value={newFarmCountry}
                      onChange={(e) => setNewFarmCountry(e.target.value)}
                      className="px-2 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs font-bold uppercase"
                    >
                      <option value="DE">DE</option>
                      <option value="NL">NL</option>
                      <option value="FR">FR</option>
                      <option value="AT">AT</option>
                      <option value="CH">CH</option>
                      <option value="DK">DK</option>
                      <option value="BE">BE</option>
                      <option value="SE">SE</option>
                      <option value="NO">NO</option>
                      <option value="PL">PL</option>
                      <option value="ES">ES</option>
                      <option value="IT">IT</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Facility Production Category</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewFarmCategory('dual_layers_broilers');
                      setNewFarmBreeds('Lohmann Brown (Layers) & Ross 308 (Broilers)');
                    }}
                    className={`py-2 px-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      newFarmCategory === 'dual_layers_broilers'
                        ? 'border-[#1B3B2B] bg-[#1B3B2B] text-white shadow-xs font-bold'
                        : 'border-[#DCDAD0] bg-[#F7F6F2] text-[#2D3748]'
                    }`}
                  >
                    <div className="text-xs">Dual Layers & Broilers</div>
                    <div className={`text-[10px] ${newFarmCategory === 'dual_layers_broilers' ? 'text-white/80' : 'text-[#5C6572]'}`}>
                      Eggs + Meat
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewFarmCategory('layers_eggs');
                      setNewFarmBreeds('Lohmann Brown-Classic');
                    }}
                    className={`py-2 px-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      newFarmCategory === 'layers_eggs'
                        ? 'border-[#1B3B2B] bg-[#1B3B2B] text-white shadow-xs font-bold'
                        : 'border-[#DCDAD0] bg-[#F7F6F2] text-[#2D3748]'
                    }`}
                  >
                    <div className="text-xs">Layers & Eggs</div>
                    <div className={`text-[10px] ${newFarmCategory === 'layers_eggs' ? 'text-white/80' : 'text-[#5C6572]'}`}>
                      Certified Table Eggs
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewFarmCategory('broilers');
                      setNewFarmBreeds('Hubbard JA57 Rapid');
                    }}
                    className={`py-2 px-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      newFarmCategory === 'broilers'
                        ? 'border-[#1B3B2B] bg-[#1B3B2B] text-white shadow-xs font-bold'
                        : 'border-[#DCDAD0] bg-[#F7F6F2] text-[#2D3748]'
                    }`}
                  >
                    <div className="text-xs">Bio-Broilers</div>
                    <div className={`text-[10px] ${newFarmCategory === 'broilers' ? 'text-white/80' : 'text-[#5C6572]'}`}>
                      Table Poultry
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Genetic Breeds in Facility</label>
                <input
                  type="text"
                  required
                  value={newFarmBreeds}
                  onChange={(e) => setNewFarmBreeds(e.target.value)}
                  placeholder="e.g. Lohmann Brown (Layers) & Ross 308 (Broilers)"
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E3D8]">
                {newFarmCategory !== 'broilers' && (
                  <div>
                    <label className="font-semibold text-[#1B3B2B] block mb-1">Layers Capacity</label>
                    <input
                      type="number"
                      step={100}
                      value={newFarmLayersCount}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setNewFarmLayersCount(val);
                        if (newFarmCategory === 'dual_layers_broilers') {
                          setNewFarmTotalBirds(val + (Number(newFarmBroilersCount) || 0));
                        } else {
                          setNewFarmTotalBirds(val);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#DCDAD0] rounded-lg font-mono font-bold text-xs"
                    />
                  </div>
                )}

                {newFarmCategory !== 'layers_eggs' && (
                  <div>
                    <label className="font-semibold text-[#1B3B2B] block mb-1">Broilers Capacity</label>
                    <input
                      type="number"
                      step={100}
                      value={newFarmBroilersCount}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setNewFarmBroilersCount(val);
                        if (newFarmCategory === 'dual_layers_broilers') {
                          setNewFarmTotalBirds((Number(newFarmLayersCount) || 0) + val);
                        } else {
                          setNewFarmTotalBirds(val);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#DCDAD0] rounded-lg font-mono font-bold text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="font-semibold text-[#1B3B2B] block mb-1">Total Birds Capacity</label>
                  <input
                    type="number"
                    step={100}
                    required
                    value={newFarmTotalBirds}
                    onChange={(e) => setNewFarmTotalBirds(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#1B3B2B] rounded-lg font-mono font-bold text-xs text-[#1B3B2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {newFarmCategory !== 'broilers' && (
                  <div>
                    <label className="font-semibold block mb-1">Daily Eggs Output</label>
                    <input
                      type="number"
                      value={newFarmDailyEggs}
                      onChange={(e) => setNewFarmDailyEggs(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded text-xs font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="font-semibold block mb-1">Initial Lifecycle Stage</label>
                  <select
                    value={newFarmStage}
                    onChange={(e: any) => setNewFarmStage(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded text-xs font-bold"
                  >
                    <option value="chick_placement">CHICK PLACEMENT</option>
                    <option value="growth">GROWTH</option>
                    <option value="finishing">FINISHING</option>
                    <option value="completed">COMPLETED</option>
                    <option value="planning">PLANNING</option>
                  </select>
                </div>

                {/* Summer Peak Shaving Solar Input */}
                <div>
                  <label className="font-semibold block mb-1">Summer Peak Shaving Solar (kWp)</label>
                  <input
                    type="number"
                    value={newFarmSolarKw}
                    onChange={(e) => setNewFarmSolarKw(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E3D8]">
                <button
                  type="button"
                  onClick={() => setShowNewFarmModal(false)}
                  className="px-4 py-2 border border-[#DCDAD0] rounded-lg text-xs font-semibold cursor-pointer hover:bg-[#F7F6F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  Add Production Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Balance Adjustment Tool Modal */}
      {showWalletModal && selectedAdjustUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E5E3D8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#F7F6F2] border-b border-[#E5E3D8] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1B3B2B] text-white flex items-center justify-center">
                    <Coins className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <h4 className="text-base font-bold text-[#1B3B2B]">
                    Manual Balance Adjustment Tool
                  </h4>
                </div>
                <p className="text-xs text-[#5C6572] mt-0.5">
                  Direct database balance modification upon off-platform payment confirmation
                </p>
              </div>
              <button
                onClick={() => {
                  setShowWalletModal(false);
                  setWalletFeedback(null);
                }}
                className="p-1 rounded-lg text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#EAE8E0] cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBalanceAdjustment} className="p-5 space-y-4 text-xs">
              {walletFeedback && (
                <div
                  className={`p-3 rounded-xl font-semibold flex items-center gap-2 ${
                    walletFeedback.startsWith('✓')
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {walletFeedback.startsWith('✓') ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                  )}
                  <span>{walletFeedback}</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-[#1B3B2B] block mb-1">Target Investor Profile</label>
                <select
                  value={selectedAdjustUser.user_id}
                  onChange={(e) => {
                    const u = profiles.find((p) => p.user_id === e.target.value);
                    if (u) {
                      setSelectedAdjustUser(u);
                      const wal = wallets[u.user_id];
                      setDirectMainBalance(wal?.main_balance || 0);
                      setDirectEarningsBalance(wal?.earnings_balance || 0);
                      setWalletFeedback(null);
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg font-bold text-xs text-[#1B3B2B]"
                >
                  {allUserProfiles.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.full_name} ({user.email}) · UID: {user.user_id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E3D8] grid grid-cols-2 gap-3">
                <div className="p-2 bg-white rounded-lg border border-[#E5E3D8]">
                  <span className="text-[#5C6572] text-[11px] block">Current Main Balance:</span>
                  <span className="font-mono font-bold text-base text-[#1B3B2B]">
                    {formatEuro(wallets[selectedAdjustUser.user_id]?.main_balance || 0, true, language)}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#E5E3D8]">
                  <span className="text-[#5C6572] text-[11px] block">Current Earnings Balance:</span>
                  <span className="font-mono font-bold text-base text-emerald-700">
                    {formatEuro(wallets[selectedAdjustUser.user_id]?.earnings_balance || 0, true, language)}
                  </span>
                </div>
              </div>

              <div className="flex rounded-xl bg-[#EAE8E0] p-1 border border-[#DCDAD0] gap-1">
                <button
                  type="button"
                  onClick={() => setAdjustmentMode('direct_override')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                    adjustmentMode === 'direct_override'
                      ? 'bg-white text-[#1B3B2B] shadow-2xs'
                      : 'text-[#5C6572] hover:text-[#1B3B2B]'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Direct Set (main_balance & earnings_balance)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentMode('delta_adjust')}
                  className={`py-1.5 px-3 rounded-lg font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                    adjustmentMode === 'delta_adjust'
                      ? 'bg-white text-[#1B3B2B] shadow-2xs'
                      : 'text-[#5C6572] hover:text-[#1B3B2B]'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Delta (Credit / Debit)</span>
                </button>
              </div>

              {adjustmentMode === 'direct_override' && (
                <div className="space-y-3 bg-[#F7F6F2] p-3.5 rounded-xl border border-[#E5E3D8]">
                  <div className="text-[11px] text-[#5C6572] font-medium leading-relaxed">
                    Directly update the exact numerical value of <strong>'main_balance'</strong> and <strong>'earnings_balance'</strong> in the database upon verified off-platform deposit.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[#1B3B2B] block mb-1">
                        New 'main_balance' ({currencySymbol})
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5C6572]">{currencySymbol}</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Blank (keep current)"
                          value={directMainBalance}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                            if (clean === '') {
                              setDirectMainBalance('');
                            } else {
                              const num = parseInt(clean, 10);
                              if (num >= 1) {
                                setDirectMainBalance(num);
                              }
                            }
                          }}
                          className="w-full pl-7 pr-3 py-2 bg-white border border-[#DCDAD0] rounded-lg font-mono font-bold text-sm text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-[#1B3B2B] block mb-1">
                        New 'earnings_balance' ({currencySymbol})
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5C6572]">{currencySymbol}</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Blank (keep current)"
                          value={directEarningsBalance}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                            if (clean === '') {
                              setDirectEarningsBalance('');
                            } else {
                              const num = parseInt(clean, 10);
                              if (num >= 1) {
                                setDirectEarningsBalance(num);
                              }
                            }
                          }}
                          className="w-full pl-7 pr-3 py-2 bg-white border border-[#DCDAD0] rounded-lg font-mono font-bold text-sm text-emerald-800 focus:outline-none focus:border-[#1B3B2B]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {adjustmentMode === 'delta_adjust' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-[#1B3B2B] block mb-1">Action Type</label>
                      <select
                        value={adjType}
                        onChange={(e: any) => setAdjType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg font-bold"
                      >
                        <option value="credit">+ Add Money (Credit)</option>
                        <option value="debit">- Remove Money (Debit)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-[#1B3B2B] block mb-1">Target Balance</label>
                      <select
                        value={adjBalanceType}
                        onChange={(e: any) => setAdjBalanceType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg font-bold"
                      >
                        <option value="main">Main Balance</option>
                        <option value="earnings">Earnings Balance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#1B3B2B] block mb-1">Payment Amount ({currencySymbol})</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5C6572]">{currencySymbol}</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={adjAmount}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            setAdjAmount(1);
                            return;
                          }
                          const parsed = parseInt(val, 10);
                          setAdjAmount(isNaN(parsed) ? 1 : Math.max(1, parsed));
                        }}
                        className="w-full pl-7 pr-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg font-mono font-bold text-base text-[#1B3B2B]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-[#1B3B2B] block mb-1">
                  Off-Platform Payment Confirmation Reference / Note
                </label>
                <input
                  type="text"
                  required
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  placeholder="e.g. Bitcoin deposit confirmed on blockchain TXID: 0x8f2..."
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EFEA]">
                <button
                  type="button"
                  onClick={() => {
                    setShowWalletModal(false);
                    setWalletFeedback(null);
                  }}
                  className="px-4 py-2 border border-[#DCDAD0] rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdjustment}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#1B3B2B] hover:bg-[#11271D] disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>
                    {isSubmittingAdjustment
                      ? 'Updating Database...'
                      : adjustmentMode === 'direct_override'
                      ? 'Update Balances in Database'
                      : adjType === 'credit'
                      ? `Confirm +${currencySymbol}${adjAmount.toLocaleString()} Credit`
                      : `Confirm -${currencySymbol}${adjAmount.toLocaleString()} Debit`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E5E3D8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#11271D] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C5A059] text-[#11271D] flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Create New Investor Profile</h4>
                  <p className="text-[11px] text-white/70">Provision internal account and initial balance</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setUserOpFeedback(null);
                }}
                className="text-white/70 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-3.5 text-xs">
              {userOpFeedback && (
                <div className={`p-3 rounded-xl flex items-center gap-2 ${
                  userOpFeedback.type === 'success'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {userOpFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{userOpFeedback.message}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-[#1B3B2B] block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs focus:outline-none focus:border-[#1B3B2B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1B3B2B] block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. elena.rostova@familyoffice.eu"
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs focus:outline-none focus:border-[#1B3B2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1B3B2B] block mb-1">Country Jurisdiction</label>
                  <select
                    value={newUserCountry}
                    onChange={(e) => setNewUserCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1B3B2B]"
                  >
                    <option value="DE">Germany (DE)</option>
                    <option value="FR">France (FR)</option>
                    <option value="NL">Netherlands (NL)</option>
                    <option value="CH">Switzerland (CH)</option>
                    <option value="GB">United Kingdom (GB)</option>
                    <option value="US">United States (US)</option>
                    <option value="JP">Japan (JP)</option>
                    <option value="AE">UAE (Dubai) (AE)</option>
                    <option value="SG">Singapore (SG)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1B3B2B] block mb-1">Account Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e: any) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1B3B2B]"
                  >
                    <option value="user">Investor (Standard)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1B3B2B] block mb-1">KYC Status</label>
                  <select
                    value={newUserKyc}
                    onChange={(e: any) => setNewUserKyc(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1B3B2B]"
                  >
                    <option value="verified">Verified (Full Access)</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1B3B2B] block mb-1">Initial Balance ({currencySymbol})</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={newUserInitialBalance === 0 ? '' : newUserInitialBalance}
                    placeholder={`0 (min. ${currencySymbol}1 to fund)`}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      const stripped = raw.replace(/^0+/, '');
                      if (stripped === '') {
                        setNewUserInitialBalance(0);
                        return;
                      }
                      const val = parseInt(stripped, 10);
                      if (val >= 1) setNewUserInitialBalance(val);
                    }}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F0EFEA]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setUserOpFeedback(null);
                  }}
                  className="px-3.5 py-2 border border-[#DCDAD0] rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNewUser}
                  className="px-4 py-2 bg-[#1B3B2B] hover:bg-[#11271D] text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{isSubmittingNewUser ? 'Creating...' : 'Create Investor Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-[#E5E3D8] shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#1B3B2B]">Confirm User Account Deletion</h4>
              <p className="text-xs text-[#5C6572] leading-relaxed">
                Are you sure you want to permanently delete <strong>{deleteConfirmUser.full_name}</strong> ({deleteConfirmUser.email})?
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 border border-[#DCDAD0] rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs"
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {selectedEmailPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E5E3D8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-4 bg-[#F7F6F2] border-b border-[#E5E3D8] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1B3B2B]">
                    {selectedEmailPreview.subject}
                  </h4>
                  <p className="text-[11px] text-[#5C6572]">
                    Dispatched to: <strong>{selectedEmailPreview.recipientName}</strong> &lt;{selectedEmailPreview.recipientEmail}&gt; · {formatDate(selectedEmailPreview.sentAt, language)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmailPreview(null)}
                className="p-1 rounded-lg text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#EAE8E0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-2.5 bg-[#FAF9F5] border-b border-[#E5E3D8] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#5C6572]">Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Delivered via BirdGrow European Relay</span>
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#5C6572]">
                Ref: {selectedEmailPreview.id}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-[#F7F6F2]">
              <div
                className="bg-white rounded-xl shadow-xs border border-[#E5E3D8] overflow-hidden"
                dangerouslySetInnerHTML={{ __html: selectedEmailPreview.htmlBody }}
              />
            </div>

            <div className="p-4 bg-white border-t border-[#E5E3D8] flex justify-end">
              <button
                onClick={() => setSelectedEmailPreview(null)}
                className="px-5 py-2 bg-[#1B3B2B] text-white rounded-xl text-xs font-bold hover:bg-[#11271D] cursor-pointer transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Withdrawal Modal */}
      {declineTargetTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-red-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-red-900 to-red-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 text-red-200 flex items-center justify-center font-bold">
                  <X className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Decline Withdrawal Transfer
                  </h4>
                  <p className="text-xs text-red-100">
                    Specify error details and issues checklist dispatched directly to investor
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeclineTargetTx(null)}
                className="p-1 rounded-lg text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDecline} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E5E3D8] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[#5C6572] block text-[10px] uppercase font-semibold">Transaction Ref</span>
                  <span className="font-mono font-bold text-[#1B3B2B]">{declineTargetTx.reference}</span>
                </div>
                <div>
                  <span className="text-[#5C6572] block text-[10px] uppercase font-semibold">Requested Amount</span>
                  <span className="font-mono font-bold text-red-700">
                    {formatCurrentCurrency(declineTargetTx.amount, true)}
                  </span>
                </div>
                <div>
                  <span className="text-[#5C6572] block text-[10px] uppercase font-semibold">Gateway</span>
                  <span className="font-mono uppercase font-semibold text-[#1B3B2B]">
                    {declineTargetTx.payment_gateway} ({declineTargetTx.metadata?.cryptoCoin || 'SEPA'})
                  </span>
                </div>
                <div>
                  <span className="text-[#5C6572] block text-[10px] uppercase font-semibold">Investor ID</span>
                  <span className="font-mono text-[#5C6572]">{declineTargetTx.user_id}</span>
                </div>
              </div>

              <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#DCDAD0] text-xs">
                <span className="text-[#5C6572] font-semibold block mb-0.5">Target Destination Provided:</span>
                <span className="font-mono text-[11px] text-[#1B3B2B] break-all font-bold">
                  {declineTargetTx.metadata?.address ||
                    declineTargetTx.metadata?.walletAddress ||
                    declineTargetTx.metadata?.iban ||
                    'External Payout Account'}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#1B3B2B] block">
                  Primary Error Message * <span className="text-[#5C6572] font-normal">(Sent in investor notice and email)</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={declineErrorMessage}
                  onChange={(e) => setDeclineErrorMessage(e.target.value)}
                  placeholder="e.g. Incompatible blockchain destination network or unverified recipient KYC dossier..."
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs focus:outline-none focus:border-red-600 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#1B3B2B] block">
                    Identified Issues Checklist ({declineIssues.length})
                  </label>
                  <span className="text-[10px] text-[#5C6572]">Itemized compliance & operational flags</span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {declineIssues.length === 0 ? (
                    <div className="text-[11px] text-[#5C6572] italic p-2 bg-[#FAF9F5] rounded-lg border border-[#E5E3D8]">
                      No specific issue items added yet. Add items below or select from quick templates.
                    </div>
                  ) : (
                    declineIssues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-2 p-2 bg-red-50 text-red-900 rounded-lg border border-red-200 text-[11px]"
                      >
                        <span className="flex items-start gap-1.5 font-medium leading-tight">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                          <span>{issue}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDeclineIssue(idx)}
                          className="text-red-500 hover:text-red-800 p-0.5 cursor-pointer shrink-0"
                          title="Remove this issue"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newCustomIssueText}
                    onChange={(e) => setNewCustomIssueText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDeclineIssue();
                      }
                    }}
                    placeholder="Type an identified issue and press Add..."
                    className="flex-1 px-3 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs focus:outline-none focus:border-[#1B3B2B]"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeclineIssue}
                    className="px-3 py-1.5 bg-[#1B3B2B] text-white rounded-lg text-xs font-semibold hover:bg-[#11271D] cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="pt-1.5 space-y-1">
                  <span className="text-[10px] text-[#5C6572] font-semibold uppercase tracking-wider block">
                    Quick Suggestion Issues:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Destination address prefix mismatch with selected network (TRC-20 vs ERC-20)',
                      'Beneficiary legal name does not match verified European KYC passport',
                      'IBAN recipient clearing account rejected by correspondent banking network',
                      'Active biological production flock lock prevents full liquidation',
                      'Daily withdrawal velocity exceeds unverified account tier limit',
                    ].map((template) => (
                      <button
                        key={template}
                        type="button"
                        onClick={() => {
                          if (!declineIssues.includes(template)) {
                            setDeclineIssues([...declineIssues, template]);
                          }
                        }}
                        className="text-[10px] px-2 py-0.5 bg-[#F0EFEA] hover:bg-[#E5E3D8] text-[#1B3B2B] rounded-md transition-colors cursor-pointer text-left"
                      >
                        + {template}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-950 block text-xs">
                    Refund Requested Capital to Investor Wallet
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    Immediately returns {formatCurrentCurrency(declineTargetTx.amount, true)} to user's main wallet balance.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declineRefundToWallet}
                    onChange={(e) => setDeclineRefundToWallet(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5E3D8]">
                <button
                  type="button"
                  onClick={() => setDeclineTargetTx(null)}
                  className="px-4 py-2 border border-[#DCDAD0] rounded-xl text-xs font-semibold text-[#5C6572] hover:bg-[#F7F6F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDecline}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                >
                  <X className="w-4 h-4" />
                  <span>{isSubmittingDecline ? 'Declining Transfer...' : 'Decline Transfer & Dispatch Error Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partial Payout Modal */}
      {partialTargetTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-amber-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-[#1B3B2B] to-[#11271D] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-[#11271D] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Execute Partial Payout Tranche
                  </h4>
                  <p className="text-xs text-white/70">
                    Disburse partial funds & pair remainder with live farm production expenses
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPartialTargetTx(null)}
                className="p-1 rounded-lg text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPartial} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E5E3D8] grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[#5C6572] block text-[10px] uppercase font-semibold">Total Requested</span>
                  <span className="font-mono font-extrabold text-[#1B3B2B] text-sm">
                    {formatCurrentCurrency(partialTargetTx.amount, true)}
                  </span>
                </div>
                <div>
                  <span className="text-[#5C6572] block text-[10px] uppercase font-semibold">Deduction Fee Rate</span>
                  <span className="font-mono font-bold text-[#C5A059] text-sm">
                    {partialTargetTx.metadata?.feePercentage || settings.platformFeePercentage || 1.5}%
                  </span>
                </div>
                <div>
                  <span className="text-[#5C6572] block text-[10px] uppercase font-semibold">Investor Profile</span>
                  <span className="font-mono font-semibold text-[#1B3B2B] truncate block">
                    {partialTargetTx.user_id}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#1B3B2B] block">
                    Partial Payout Tranche Amount ({currencySymbol}) *
                  </label>
                  <span className="text-[10px] text-[#5C6572] font-mono">
                    Must be strictly less than {formatCurrentCurrency(partialTargetTx.amount, true)}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#5C6572]">{currencySymbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={partialTargetTx.amount - 0.01}
                    required
                    value={partialPayoutAmount}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                      setPartialPayoutAmount(val);
                    }}
                    placeholder={`e.g. ${Math.round(partialTargetTx.amount / 2)}`}
                    className="w-full pl-7 pr-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl font-mono font-bold text-sm text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-[#5C6572] font-semibold">Quick Tranche:</span>
                  {[0.25, 0.5, 0.75].map((pct) => {
                    const presetVal = Math.round(partialTargetTx.amount * pct * 100) / 100;
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setPartialPayoutAmount(presetVal)}
                        className="px-2.5 py-1 bg-[#FAF9F5] hover:bg-[#E5E3D8] border border-[#DCDAD0] rounded-lg text-[11px] font-mono font-bold text-[#1B3B2B] cursor-pointer"
                      >
                        {pct * 100}% ({formatCurrentCurrency(presetVal, true)})
                      </button>
                    );
                  })}
                </div>
              </div>

              {typeof partialPayoutAmount === 'number' && partialPayoutAmount > 0 && (
                <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-amber-300 space-y-2 text-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#8F702B] flex items-center justify-between">
                    <span>Disbursement & Fee Purse Allocation:</span>
                    <span className="font-mono">Live Simulation</span>
                  </div>
                  {(() => {
                    const feePct = partialTargetTx.metadata?.feePercentage || settings.platformFeePercentage || 1.5;
                    const fee = Math.round((partialPayoutAmount * (feePct / 100)) * 100) / 100;
                    const net = Math.round((partialPayoutAmount - fee) * 100) / 100;
                    const rem = Math.round((partialTargetTx.amount - partialPayoutAmount) * 100) / 100;
                    return (
                      <div className="grid grid-cols-3 gap-2 font-mono">
                        <div className="p-2 bg-white rounded-lg border border-[#E5E3D8]">
                          <span className="text-[10px] text-[#5C6572] block">Net Sent to User:</span>
                          <strong className="text-emerald-700 text-xs">{formatCurrentCurrency(net, true)}</strong>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-[#E5E3D8]">
                          <span className="text-[10px] text-[#5C6572] block">Fee to Fee Purse ({feePct}%):</span>
                          <strong className="text-[#C5A059] text-xs">+{formatCurrentCurrency(fee, true)}</strong>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-[#E5E3D8]">
                          <span className="text-[10px] text-[#5C6572] block">Restored to Wallet:</span>
                          <strong className="text-[#1B3B2B] text-xs">+{formatCurrentCurrency(rem, true)}</strong>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Capital Pairing Category Selector - Refactored away from solar */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#1B3B2B] block">
                  Capital Pairing Farm Expense Center *
                </label>
                <select
                  value={partialCategory}
                  onChange={(e) => setPartialCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs font-semibold text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                >
                  <option value="production">1. Biological Flock Production (Day-old chick placement, brooding, veterinary care)</option>
                  <option value="feed_production">2. Feed Production & Precision Milling (Grain silos, nutritional batching, 1.54 FCR)</option>
                  <option value="facility_building">3. Bio-Dome Facility Building (Geothermal loops & summer peak-shaving solar)</option>
                  <option value="operational_expenses">4. Farm Operating Logistics (Refrigerated transit & European supermarket delivery)</option>
                </select>
                <p className="text-[10px] text-[#5C6572]">
                  Explains to the investor which agricultural cost center currently deploys their remaining capital.
                </p>
              </div>

              {/* Operational Explanation Message */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#1B3B2B] block">
                    Investor Tranche &amp; Farm Expense Explanation Note *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const pAmt = typeof partialPayoutAmount === 'number' ? partialPayoutAmount : partialTargetTx.amount / 2;
                      const rem = partialTargetTx.amount - pAmt;
                      setPartialExplanationMessage(
                        `A partial disbursement of ${formatCurrentCurrency(pAmt, true)} has been processed. The remaining balance of ${formatCurrentCurrency(rem, true)} has been credited back to your available wallet balance as underlying capital is actively deployed in live poultry flock growth, on-site feed milling, and facility building.`
                      );
                    }}
                    className="text-[10px] text-[#C5A059] font-bold hover:underline cursor-pointer"
                  >
                    Reset to Standard Text
                  </button>
                </div>
                <textarea
                  required
                  rows={3}
                  value={partialExplanationMessage}
                  onChange={(e) => setPartialExplanationMessage(e.target.value)}
                  placeholder="Explain why a partial payout is executed and how capital is paired with farm expenses..."
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs focus:outline-none focus:border-[#1B3B2B] focus:bg-white leading-relaxed"
                />
              </div>

              {/* Quick Template Chips for Partial Message - Refactored away from solar */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#5C6572] font-semibold uppercase tracking-wider block">
                  Quick Explanation Templates:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    {
                      label: 'Feed Procurement & Milling Allocation',
                      text: `Disbursing partial tranche. Balance is actively financing seasonal grain contracts and automated feed milling for maximum metabolic efficiency across European poultry hubs.`,
                    },
                    {
                      label: 'Flock Growth Finishing Phase',
                      text: `Disbursing partial tranche. Your remaining capital is paired with the finishing growth cycle of certified organic broilers, with final wholesale distribution scheduled next week.`,
                    },
                    {
                      label: 'Bio-Dome Facility Construction',
                      text: `Disbursing partial tranche. Remaining capital is paired with structural thermal bio-dome commissioning, geothermal heating loops, and emergency failover generator installation at our Bavaria and Portugal facilities.`,
                    },
                  ].map((tpl) => (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() => setPartialExplanationMessage(tpl.text)}
                      className="text-[10px] px-2 py-0.5 bg-[#F0EFEA] hover:bg-[#E5E3D8] text-[#1B3B2B] rounded-md transition-colors cursor-pointer text-left"
                    >
                      + {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-950 block text-xs">
                    Restore Remaining Balance to User Wallet
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    Immediately credits the unpaid remainder back into the investor's available main balance.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={partialRefundRemaining}
                    onChange={(e) => setPartialRefundRemaining(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5E3D8]">
                <button
                  type="button"
                  onClick={() => setPartialTargetTx(null)}
                  className="px-4 py-2 border border-[#DCDAD0] rounded-xl text-xs font-semibold text-[#5C6572] hover:bg-[#F7F6F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPartial}
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#b08d47] disabled:opacity-50 text-[#11271D] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmittingPartial ? 'Processing Payout...' : 'Confirm Partial Payout & Dispatch Tranche'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Withdrawal Approval Modal */}
      {approveConfirmTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-emerald-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#16A34A] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Confirm Full Withdrawal</h4>
                  <p className="text-xs text-white/80">Disburse payout & credit fee into Admin Fee Purse</p>
                </div>
              </div>
              <button
                onClick={() => setApproveConfirmTx(null)}
                className="text-white/70 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {(() => {
                const feePct = approveConfirmTx.metadata?.feePercentage || settings.platformFeePercentage || 1.5;
                const fee = Math.round((approveConfirmTx.amount * (feePct / 100)) * 100) / 100;
                const net = Math.round((approveConfirmTx.amount - fee) * 100) / 100;
                return (
                  <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E5E3D8] space-y-3">
                    <div className="flex items-center justify-between text-[#5C6572]">
                      <span>Gross Requested:</span>
                      <span className="font-mono font-bold text-[#1B3B2B] text-sm">
                        {formatCurrentCurrency(approveConfirmTx.amount, true)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#C5A059] bg-[#C5A059]/10 p-2 rounded-lg">
                      <span className="font-semibold flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span>Withdrawal Fee to Purse ({feePct}%):</span>
                      </span>
                      <span className="font-mono font-extrabold">
                        +{formatCurrentCurrency(fee, true)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-800 border-t border-[#E5E3D8] pt-2">
                      <span className="font-bold">Net Sent to Investor:</span>
                      <span className="font-mono font-extrabold text-base">
                        {formatCurrentCurrency(net, true)}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#DCDAD0] space-y-1">
                <span className="text-[#5C6572] block text-[10px] uppercase font-semibold">Recipient Destination</span>
                <span className="font-mono font-bold text-[#1B3B2B] text-[11px] break-all">
                  {approveConfirmTx.metadata?.address ||
                    approveConfirmTx.metadata?.walletAddress ||
                    approveConfirmTx.metadata?.iban ||
                    'Verified Investor Account'}
                </span>
              </div>

              {/* Capital Pairing Classification - Refactored away from solar */}
              <div className="space-y-1">
                <label className="font-bold text-[#1B3B2B] block">Capital Pairing Classification</label>
                <select
                  value={approveCategory}
                  onChange={(e) => setApproveCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs font-semibold text-[#1B3B2B]"
                >
                  <option value="production">Biological Flock Production & Brooding</option>
                  <option value="feed_production">Feed Production & Grain Milling</option>
                  <option value="facility_building">Facility Building & Geothermal Resilience</option>
                  <option value="operational_expenses">Farm Operations & Supermarket Distribution</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E5E3D8]">
                <button
                  type="button"
                  onClick={() => setApproveConfirmTx(null)}
                  className="px-4 py-2 border border-[#DCDAD0] rounded-xl text-xs font-semibold text-[#5C6572] hover:bg-[#F7F6F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmittingApprove}
                  onClick={handleSubmitApprove}
                  className="px-5 py-2 bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmittingApprove ? 'Approving...' : 'Approve & Deposit Fee into Purse'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sweep Fee Purse Modal */}
      {showSweepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#C5A059] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#1B3B2B] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-[#11271D] flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Treasury Fee Purse Sweep</h4>
                  <p className="text-xs text-white/70">Disburse accumulated withdrawal fees to treasury</p>
                </div>
              </div>
              <button
                onClick={() => setShowSweepModal(false)}
                className="text-white/70 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteSweep} className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E5E3D8] space-y-1">
                <span className="text-[#5C6572] block text-[10px] uppercase font-semibold">
                  Total Accumulated Balance in Fee Purse
                </span>
                <span className="text-2xl font-extrabold text-[#1B3B2B] font-mono">
                  {formatCurrentCurrency(adminFeePurse.totalAccumulatedBalance, true)}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#1B3B2B] block">Sweep Amount ({currencySymbol}) *</label>
                  <button
                    type="button"
                    onClick={() => setSweepAmount(adminFeePurse.totalAccumulatedBalance)}
                    className="text-[10px] font-mono font-bold text-[#C5A059] hover:underline cursor-pointer"
                  >
                    Max ({formatCurrentCurrency(adminFeePurse.totalAccumulatedBalance, true)})
                  </button>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={adminFeePurse.totalAccumulatedBalance}
                  required
                  value={sweepAmount}
                  onChange={(e) => setSweepAmount(parseFloat(e.target.value) || '')}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl font-mono font-bold text-sm text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#1B3B2B] block">
                  Corporate Destination Address / Treasury Account *
                </label>
                <input
                  type="text"
                  required
                  value={sweepDestination}
                  onChange={(e) => setSweepDestination(e.target.value)}
                  placeholder="e.g. USDT TRC20 wallet or corporate treasury IBAN"
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl font-mono text-xs focus:outline-none focus:border-[#1B3B2B]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E5E3D8]">
                <button
                  type="button"
                  onClick={() => setShowSweepModal(false)}
                  className="px-4 py-2 border border-[#DCDAD0] rounded-xl text-xs font-semibold text-[#5C6572] hover:bg-[#F7F6F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSweep || adminFeePurse.totalAccumulatedBalance <= 0}
                  className="px-5 py-2 bg-[#1B3B2B] hover:bg-[#11271D] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                >
                  <ArrowUpRight className="w-4 h-4 text-[#C5A059]" />
                  <span>{isSubmittingSweep ? 'Executing Sweep...' : 'Execute Treasury Sweep'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};