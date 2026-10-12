import React, { useState } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Wallet as WalletIcon,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import {
  formatReferralCurrency,
  formatReferralCompact,
  REFERRAL_MILESTONES,
  buildSocialShareLinks,
} from '../../lib/referralEngine';
import { InviteModal } from './InviteModal';

const formatNaira = formatReferralCurrency;
const formatNairaCompact = formatReferralCompact;

interface ReferralDashboardProps {
  onOpenInvestModal?: () => void;
}

export const ReferralDashboard: React.FC<ReferralDashboardProps> = ({
  onOpenInvestModal,
}) => {
  const {
    currentUser,
    userReferralSummary,
    claimReferralReward,
    simulateReferralInvestment,
    formatCurrentCurrency,
    formatCurrentCurrencyCompact,
    t,
  } = usePlatform();

  const [copied, setCopied] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [simulatedAmount, setSimulatedAmount] = useState<number>(275000);
  const [simulatedUserName, setSimulatedUserName] = useState<string>('Lucas Schmidt');
  const [simFeedback, setSimFeedback] = useState<string | null>(null);
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'invested' | 'pending'>('all');

  if (!currentUser || !userReferralSummary) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E3D8] p-12 text-center text-[#5C6572]">
        Please sign in to access the Referral Rewards System.
      </div>
    );
  }

  const {
    referrerType,
    referralCode,
    referralLink,
    totalReferredCount,
    activeReferredInvestorsCount,
    totalQualifiedVolume,
    totalRewardsEarned,
    totalRewardsPaid,
    pendingRewards,
    availableRewards,
    currentMilestone,
    nextMilestone,
    volumeNeededForNextMilestone,
    progressPercentage,
    milestones,
    cycle1Completed,
    cycle1PaymentReflected,
    cycleBars,
    referrals,
  } = userReferralSummary;

  const isInvestor = referrerType === 'investor';
  const socialLinks = buildSocialShareLinks(referralLink, referralCode);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaim = async (rewardId: string) => {
    setClaimingId(rewardId);
    await claimReferralReward(rewardId);
    setClaimingId(null);
  };

  const handleSimulate = (amount: number, name: string) => {
    const res = simulateReferralInvestment(amount, name);
    setSimFeedback(res.message);
    setTimeout(() => setSimFeedback(null), 5000);
  };

  // Filter referrals table
  const filteredReferrals = referrals.filter((item) => {
    const matchesSearch =
      item.relationship.referredUserName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      item.relationship.referredUserEmail.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'invested'
        ? item.hasActiveInvestment
        : !item.hasActiveInvestment;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ================================================================ */}
      {/* 1. REFERRAL OVERVIEW HERO CARD & STATUS                          */}
      {/* ================================================================ */}
      <div className="bg-[#11271D] rounded-2xl border border-[#244D38] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{t.refCumulativeBadge || 'Cumulative Milestone Engine'}</span>
              </span>
              <span className="text-[#A7B6AB]">·</span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                isInvestor
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/80'
                  : 'bg-amber-950/80 text-amber-400 border-amber-700/80'
              }`}>
                {isInvestor ? `👑 ${t.refInvestorReferrer || 'Investor Referrer'} (2x Higher Rewards)` : (t.refBasicReferrer || 'Basic Referrer')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t.refTitle || 'Referral Rewards Program'}
            </h2>
            <p className="text-xs sm:text-sm text-[#A7B6AB] leading-relaxed">
              {t.refDesc || `Earn cumulative milestone payouts determined by the total qualified investment volume generated through your referral link. One investor contributing ${formatCurrentCurrency(1000000, false)} unlocks the exact same milestone as ten investors contributing ${formatCurrentCurrency(100000, false)} each.`}
            </p>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsInviteOpen(true)}
              className="min-h-[44px] px-5 py-3 bg-[#C5A059] hover:bg-[#B38F48] text-[#11271D] text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02]"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.refShareDirectly || 'Invite Partner'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="min-h-[44px] px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (t.refCopied || 'Link Copied!') : (t.refCopyLink || 'Copy Referral Link')}</span>
            </button>
          </div>
        </div>

        {/* Upgrade Banner for Basic Referrers */}
        {!isInvestor && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-900/40 to-emerald-950/50 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block font-bold">
                  Upgrade to Investor Referrer Status
                </strong>
                <span className="text-white/80">
                  You are currently earning standard Basic Referrer milestone payouts. Make any platform investment to instantly upgrade your status to Investor Referrer and unlock up to {formatCurrentCurrency(150000, false)} per milestone and <strong>{formatCurrentCurrency(245050, false)}</strong> maximum potential payout in this cycle!
                </span>
              </div>
            </div>
            {onOpenInvestModal && (
              <button
                type="button"
                onClick={onOpenInvestModal}
                className="self-start sm:self-auto px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#11271D] font-black rounded-lg text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                Make First Investment →
              </button>
            )}
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[#A7B6AB] block text-[11px] font-medium">Referred Partners</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-mono font-black text-white">
                {totalReferredCount}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                ({activeReferredInvestorsCount} active)
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[#A7B6AB] block text-[11px] font-medium">Qualified Volume</span>
            <span className="text-xl sm:text-2xl font-mono font-black text-[#C5A059] block">
              {formatNaira(totalQualifiedVolume)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[#A7B6AB] block text-[11px] font-medium">Total Rewards Earned</span>
            <span className="text-xl sm:text-2xl font-mono font-black text-emerald-400 block">
              {formatNaira(totalRewardsEarned)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[#A7B6AB] block text-[11px] font-medium">Claimable / Paid</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-mono font-black text-white">
                {formatNaira(totalRewardsPaid)}
              </span>
              {availableRewards > 0 && (
                <span className="text-[10px] text-[#C5A059] font-bold">
                  +{formatNaira(availableRewards)} pending claim
                </span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/40 space-y-1 col-span-2 md:col-span-1">
            <span className="text-[#C5A059] block text-[11px] font-bold uppercase tracking-wider">Potential Max Payout</span>
            <span className="text-xl sm:text-2xl font-mono font-black text-white block">
              {isInvestor ? formatCurrentCurrency(245050, false) : formatCurrentCurrency(122525, false)}
            </span>
            <span className="text-[10px] text-white/70 block">Current cycle ceiling</span>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. DYNAMIC REFERRAL PROGRESS BARS & MILESTONE TRACKER            */}
      {/* ================================================================ */}
      <div className="space-y-6">

        {/* Milestone 1M Target Reached - Action Banner if payment not yet reflected */}
        {cycle1Completed && !cycle1PaymentReflected && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-[#C5A059] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5A059]">
                  Milestone Target {formatCurrentCurrency(1000000, false)} Reached!
                </span>
              </div>
              <h4 className="text-base font-extrabold text-[#1B3B2B]">
                Claim Your {formatCurrentCurrency(150000, false)} Milestone Payout to Reflect Payment
              </h4>
              <p className="text-xs text-[#5C6572] leading-relaxed">
                Your cumulative qualified referral volume reached {formatCurrentCurrency(1000000, false)}. Once you claim this payout and payment reflects in your balance, Cycle 1 will mark as <strong>Completed</strong> and a new referral bar with the same milestone rewards starting from {formatCurrentCurrency(500, false)} will activate!
              </p>
            </div>
            {availableRewards > 0 && (
              <button
                type="button"
                onClick={() => {
                  const rew1m = milestones.find(
                    (m) => m.definition.volumeThreshold === 1000000 && m.awardedRecord?.status === 'unlocked'
                  );
                  if (rew1m?.awardedRecord) {
                    handleClaim(rew1m.awardedRecord.id);
                  }
                }}
                className="px-6 py-3 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>Claim {formatCurrentCurrency(150000, false)} Payout</span>
              </button>
            )}
          </div>
        )}

        {/* Render each Milestone Track Bar (Cycle 1, and Cycle 2 once payment has reflected) */}
        {cycleBars.map((bar) => {
          const isBarCompleted = bar.isCompleted && bar.isPaymentReflected;
          const isCycle2 = bar.cycle === 2;

          return (
            <div
              key={`cycle-bar-${bar.cycle}`}
              className={`rounded-2xl border p-6 sm:p-8 space-y-6 shadow-xs transition-all ${
                isBarCompleted
                  ? 'bg-gradient-to-br from-[#FAF9F5] via-emerald-50/30 to-[#F7F6F2] border-emerald-300 ring-1 ring-emerald-200'
                  : isCycle2
                  ? 'bg-white border-2 border-[#C5A059] ring-2 ring-[#C5A059]/15 shadow-md'
                  : 'bg-white border-[#E5E3D8]'
              }`}
            >
              {/* Progress Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1.5 ${
                        isBarCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isCycle2
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-[#F7F6F2] text-[#C5A059] border border-[#DCDAD0]'
                      }`}
                    >
                      {isBarCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Bar 1 · Completed &amp; Paid (100%)</span>
                        </>
                      ) : isCycle2 ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Bar 2 · Renewed Referral Bar (Active)</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Bar 1 · Cumulative Volume Progression</span>
                        </>
                      )}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#1B3B2B] mt-1.5">
                    {bar.title}
                  </h3>
                </div>

                {/* Volume Target Badge */}
                <div className="self-start sm:self-auto text-right">
                  <div className="font-mono text-base sm:text-lg font-black text-[#1B3B2B]">
                    <span className="text-[#C5A059]">{formatNaira(bar.currentVolume)}</span>
                    <span className="text-[#7C887E]"> / </span>
                    <span>{formatNaira(bar.targetVolume)}</span>
                  </div>
                  {isBarCompleted ? (
                    <div className="text-xs text-emerald-700 font-bold mt-0.5 flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{formatCurrentCurrency(1000000, false)} Target Fully Paid</span>
                    </div>
                  ) : bar.nextMilestone ? (
                    <div className="text-xs text-[#16A34A] font-semibold mt-0.5">
                      {formatNaira(bar.volumeNeededForNextMilestone)} more to unlock{' '}
                      <strong className="font-mono">
                        {formatNaira(isInvestor ? bar.nextMilestone.investorReward : bar.nextMilestone.basicReward)}
                      </strong>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Big Animated Progress Bar */}
              <div className="space-y-2">
                <div className="relative w-full h-5 sm:h-6 bg-[#EAE8E0] rounded-full overflow-hidden p-0.5 border border-[#DCDAD0] shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-700 relative overflow-hidden ${
                      isBarCompleted
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500'
                        : 'bg-gradient-to-r from-[#1B3B2B] via-[#2F5E46] to-[#C5A059]'
                    }`}
                    style={{ width: `${Math.max(4, Math.min(100, bar.progressPercentage))}%` }}
                  >
                    {/* Shimmer animation */}
                    <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-pulse" />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-[#5C6572] font-mono">
                  <span>
                    Milestone Progress:{' '}
                    <strong className="text-[#1B3B2B]">{bar.progressPercentage}%</strong>
                  </span>
                  <span>
                    {isBarCompleted
                      ? 'All Bar 1 Milestones Fully Completed & Paid!'
                      : bar.nextMilestone
                      ? `Target: ${formatCurrentCurrencyCompact(bar.nextMilestone.volumeThreshold)} (${formatNaira(isInvestor ? bar.nextMilestone.investorReward : bar.nextMilestone.basicReward)} Reward)`
                      : 'All Milestones Reached!'}
                  </span>
                </div>
              </div>

              {/* Visual Milestone Tracker */}
              <div className="pt-6 border-t border-[#F0EFEA] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1B3B2B]">
                    Milestone Reward Tiers ({isInvestor ? 'Investor Referrer Rates' : 'Basic Referrer Rates'})
                  </span>
                  <span className="text-[11px] text-[#5C6572]">
                    Starts from {formatCurrentCurrency(500, false)} · Cumulative · Stops at {formatCurrentCurrency(1000000, false)}
                  </span>
                </div>

                {/* Responsive Milestone Cards Grid (5 Tiers) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {bar.milestones.map((m, mIdx) => {
                    const rewardVal = isInvestor ? m.definition.investorReward : m.definition.basicReward;
                    const milestoneIcons = ['🌱', '🥈', '🥇', '💎', '👑'];
                    const milestoneIcon = milestoneIcons[mIdx % milestoneIcons.length];

                    return (
                      <div
                        key={`${bar.cycle}-${m.definition.id}`}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 relative ${
                          m.isCompleted
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs'
                            : m.isCurrentTarget
                            ? 'bg-[#FAF9F5] border-2 border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-md scale-[1.02]'
                            : 'bg-[#F7F6F2] border-[#E5E3D8] text-[#7C887E] opacity-75'
                        }`}
                      >
                        {/* Status Indicator Chip */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono font-bold text-[#5C6572] bg-white/80 px-1.5 py-0.5 rounded border border-[#E5E3D8]">
                            {m.definition.shortLabel}
                          </span>
                          {m.isCompleted ? (
                            <span className="flex items-center text-emerald-600" title="Milestone Completed">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                          ) : m.isCurrentTarget ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-ping" title="Current Target" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-[#A7B6AB]" />
                          )}
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 min-h-[22px]">
                              <span className="text-xs select-none" aria-hidden="true">{milestoneIcon}</span>
                              <span className="text-xs font-bold text-[#1B3B2B] leading-tight truncate">
                                {m.definition.name}
                              </span>
                            </div>
                            <div
                              className={`font-mono text-sm font-black mt-0.5 ${
                                m.isCompleted
                                  ? 'text-emerald-700'
                                  : m.isCurrentTarget
                                  ? 'text-[#C5A059]'
                                  : 'text-[#7C887E]'
                              }`}
                            >
                              {formatNaira(rewardVal)}
                            </div>
                            <div className="text-[10px] text-[#5C6572] mt-0.5">
                              {m.isCompleted ? 'Earned & Unlocked' : m.isCurrentTarget ? 'Current Target' : 'Locked'}
                            </div>
                          </div>
                        </div>

                        {/* Claim Button if Unlocked but not yet claimed */}
                        {m.awardedRecord && m.awardedRecord.status === 'unlocked' && (
                          <button
                            type="button"
                            disabled={claimingId === m.awardedRecord.id}
                            onClick={() => handleClaim(m.awardedRecord!.id)}
                            className="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded transition-colors cursor-pointer"
                          >
                            {claimingId === m.awardedRecord.id ? 'Claiming...' : 'Claim to Wallet'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E5E3D8] text-xs text-[#5C6572] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-medium text-[#1B3B2B]">
                    <Award className="w-4 h-4 text-[#C5A059]" />
                    <span>Current Max Potential Payout in this Cycle (5 Named Milestones):</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <strong className="font-mono text-emerald-800 text-sm font-black">
                      {isInvestor ? formatCurrentCurrency(245050, false) : formatCurrentCurrency(122525, false)}
                    </strong>
                    <span className="text-[11px] text-[#5C6572]">
                      ({isInvestor ? 'Investor Referrer Rate' : 'Basic Referrer Rate'})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/* 3. MY REFERRAL LINK & MULTI-CHANNEL SHARING                      */}
      {/* ================================================================ */}
      <div className="bg-white rounded-2xl border border-[#E5E3D8] p-6 sm:p-8 space-y-4 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-[#1B3B2B]">
            My Referral Link &amp; Sharing Tools
          </h3>
          <p className="text-xs text-[#5C6572]">
            Share your unique link across messaging and social channels. New investors who register via your link are permanently associated with your account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 px-4 py-3 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs font-mono text-[#1B3B2B] truncate select-all">
            {referralLink}
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-5 py-3 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Referral Link'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="px-5 py-3 bg-[#C5A059] hover:bg-[#B38F48] text-[#11271D] text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Share2 className="w-4 h-4" />
            <span>Invite Partner</span>
          </button>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-[#5C6572] font-semibold text-[11px] mr-1">One-Click Share:</span>
          
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-[11px] transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp</span>
          </a>

          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] font-bold text-[11px] transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-[#0088cc]" />
            <span>Telegram</span>
          </a>

          <a
            href={socialLinks.x}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-black font-bold text-[11px] transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>X (Twitter)</span>
          </a>

          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-bold text-[11px] transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#1877F2]" />
            <span>Facebook</span>
          </a>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 4. MY REFERRALS DIRECTORY (RESPONSIVE TABLE + SEARCH)            */}
      {/* ================================================================ */}
      <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E5E3D8] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#1B3B2B]">
              My Referred Investors &amp; Volume Contributions
            </h3>
            <p className="text-xs text-[#5C6572]">
              Track each referred partner's qualified investment volume. Sensitive personal balances remain strictly private.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#7C887E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search partner name..."
                className="pl-8 pr-3 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B] w-44"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
            >
              <option value="all">All Partners ({referrals.length})</option>
              <option value="invested">Active Investors Only ({activeReferredInvestorsCount})</option>
              <option value="pending">Pending Investment</option>
            </select>
          </div>
        </div>

        {filteredReferrals.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5C6572] space-y-2">
            <Users className="w-8 h-8 text-[#A7B6AB] mx-auto" />
            <p className="font-semibold text-[#1B3B2B]">No referred partners found</p>
            <p className="text-[11px] max-w-sm mx-auto">
              Share your link with colleagues and partners to begin accumulating qualified investment volume.
            </p>
            <button
              type="button"
              onClick={() => setIsInviteOpen(true)}
              className="mt-2 px-4 py-2 bg-[#1B3B2B] text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Invite Your First Partner
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-5">Referred User</th>
                  <th className="py-3 px-5">Registration Date</th>
                  <th className="py-3 px-5">Investment Status</th>
                  <th className="py-3 px-5">Qualified Volume</th>
                  <th className="py-3 px-5">Latest Date</th>
                  <th className="py-3 px-5">Qualification Status</th>
                  <th className="py-3 px-5 text-right">Volume Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEA]">
                {filteredReferrals.map((item) => (
                  <tr key={item.relationship.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#1B3B2B]">
                        {item.relationship.referredUserName}
                      </div>
                      <div className="text-[11px] text-[#5C6572]">
                        {item.relationship.referredUserEmail}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[#5C6572]">
                      {item.relationship.registrationDate}
                    </td>
                    <td className="py-3.5 px-5">
                      {item.hasActiveInvestment ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active Investor</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Registered / Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 font-mono font-bold text-[#1B3B2B]">
                      {formatNaira(item.totalInvested)}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[#5C6572]">
                      {item.lastInvestmentDate || '—'}
                    </td>
                    <td className="py-3.5 px-5">
                      {item.totalInvested > 0 ? (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified Qualified</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#7C887E]">Awaiting Allocation</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-black text-[#C5A059]">
                      +{formatNaira(item.totalInvested)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* 5. REWARD WALLET & HISTORICAL LEDGER                             */}
      {/* ================================================================ */}
      <div className="bg-white rounded-2xl border border-[#E5E3D8] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EFEA]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
              <WalletIcon className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Reward Custody</span>
            </div>
            <h3 className="text-lg font-bold text-[#1B3B2B] mt-0.5">
              Referral Rewards Wallet
            </h3>
            <p className="text-xs text-[#5C6572]">
              Immutable audit ledger of every milestone unlocked and settled.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#5C6572] block">Cumulative Earned</span>
              <span className="text-xl font-mono font-black text-emerald-600">
                {formatNaira(totalRewardsEarned)}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Transaction History */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#1B3B2B]">Milestone Settlement Records</div>
          
          {milestones.filter((m) => m.isCompleted).length === 0 ? (
            <div className="p-6 bg-[#F7F6F2] rounded-xl text-center text-xs text-[#5C6572]">
              No milestone rewards unlocked yet. Reach {formatCurrentCurrency(500, false)} qualified referral volume to claim your first reward!
            </div>
          ) : (
            <div className="divide-y divide-[#F0EFEA] border border-[#E5E3D8] rounded-xl overflow-hidden text-xs">
              {milestones
                .filter((m) => m.isCompleted)
                .map((m) => {
                  const rec = m.awardedRecord;
                  const amt = rec ? rec.rewardAmount : (isInvestor ? m.definition.investorReward : m.definition.basicReward);
                  const refId = rec ? rec.referenceId : `REF-REW-${m.definition.shortLabel}-PENDING`;
                  const isPaid = rec?.status === 'paid';

                  return (
                    <div key={m.definition.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-[#FAF9F5] transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1B3B2B]">
                            {m.definition.name} ({formatCurrentCurrency(m.definition.volumeThreshold, false)})
                          </span>
                          <span className="font-mono text-[10px] text-[#5C6572] bg-[#F7F6F2] px-2 py-0.5 rounded border border-[#E5E3D8]">
                            Ref: {refId}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#5C6572]">
                          Awarded at qualified volume threshold of {m.definition.label} · Status: {isPaid ? 'Credited to Wallet' : 'Unlocked & Ready to Claim'}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <span className="font-mono font-black text-emerald-600 text-sm block">
                            +{formatNaira(amt)}
                          </span>
                          <span className={`text-[10px] font-semibold ${isPaid ? 'text-emerald-700' : 'text-[#C5A059]'}`}>
                            {isPaid ? '✓ Paid & Cleared' : '⏳ Available'}
                          </span>
                        </div>

                        {!isPaid && rec && (
                          <button
                            type="button"
                            disabled={claimingId === rec.id}
                            onClick={() => handleClaim(rec.id)}
                            className="px-3.5 py-1.5 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                          >
                            {claimingId === rec.id ? 'Claiming...' : 'Claim Payout'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        referralCode={referralCode}
        referralLink={referralLink}
        isInvestor={isInvestor}
      />
    </div>
  );
};
