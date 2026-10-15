import React, { useState } from 'react';
import {
  Award,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import {
  REFERRAL_MILESTONES,
  formatReferralCurrency,
  formatReferralCompact,
} from '../../lib/referralEngine';
import { ReferralPayoutTicker } from './ReferralPayoutTicker';
import { MilestoneBadge } from '../common/MilestoneBadge';
import { CURRENCY_NAMES } from '../../lib/formatters';

interface ReferralSectionProps {
  onOpenAuth: () => void;
  onNavigateToDashboard?: () => void;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({
  onOpenAuth,
  onNavigateToDashboard,
}) => {
  const {
    isAuthenticated,
    currentUser,
    userReferralSummary,
    currency,
    formatCurrentCurrency,
    formatCurrentCurrencyCompact,
    t,
  } = usePlatform();
  const [copied, setCopied] = useState(false);

  const referralLink = userReferralSummary?.referralLink || '';
  const isInvestor = userReferralSummary?.referrerType === 'investor';

  const handleCopyLink = () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAction = () => {
    if (!isAuthenticated) {
      onOpenAuth();
    } else if (onNavigateToDashboard) {
      onNavigateToDashboard();
    }
  };

  return (
    <section id="referrals" className="bg-[#F2F0E8] border-t border-[#E5E3D8] relative overflow-hidden">
      {/* Gliding Real-Time Referral Payout Stream (Above Referral Section) */}
      <ReferralPayoutTicker />

      {/* Background radial glow */}
      <div className="absolute left-1/2 -top-24 -translate-x-1/2 w-[700px] h-[350px] bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10 space-y-8 sm:space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-xs font-mono font-bold text-emerald-950 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.refCumulativeBadge || 'Cumulative Milestone Referral Program'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1B3B2B] text-balance">
            {t.refHeroHeadline || 'Refer Partners & Earn up to'} <span className="text-[#C5A059]">{formatCurrentCurrency(124300, false)}</span> {t.refHeroInACycle || 'in a Cycle'}
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-[#5C6572] leading-relaxed">
            {t.refNoNeedInvestNotice || 'You do not need to have invested to start referring and earning rewards! Anyone can register, generate a unique referral link, and accumulate volume. Single milestone payouts reach up to 50,000, with cumulative cycle rewards totaling up to 124,300.'}
          </p>
        </div>

        {/* Highlight Card: Basic Referrer vs Investor Referrer Advantage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Card 1: Basic Referrer (Yet to Invest) */}
          <div className="bg-white rounded-2xl border-2 border-[#DCDAD0] p-5 sm:p-8 space-y-4 sm:space-y-5 shadow-xs relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#5C6572] bg-[#F7F6F2] px-3 py-1 rounded-full border border-[#DCDAD0]">
                Tier 1 Status
              </span>
              <span className="text-xs font-bold text-[#1B3B2B]">Open to Everyone</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1B3B2B]">{t.refBasicReferrer || 'Basic Referrer'}</h3>
              <p className="text-xs text-[#5C6572] mt-1">
                {t.refBasicDesc || 'For partners who haven’t yet made an investment on BirdGrow.'}
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-[#3D4A41]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Instant Registration:</strong> {t.refInstantReg || 'Create a referral link immediately with zero initial deposit.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>{t.refPotentialMax || 'Potential Max Payout in a Cycle'}:</strong> Earn up to <strong>{formatCurrentCurrency(62150, false)}</strong> total cumulative payout per {formatCurrentCurrency(500000, false)} cycle.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>{t.refAutoRenewal || 'Automatic Renewal'}:</strong> Once {formatCurrentCurrencyCompact(500000)} target is reached and payment reflected, a new referral bar appears starting from {formatCurrentCurrency(500, false)}!</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-[#F0EFEA] flex items-center justify-between text-xs">
              <span className="text-[#5C6572]">{t.refSingleMilestoneRange || 'Single Milestone Payout Range'}:</span>
              <span className="font-mono font-bold text-[#1B3B2B] text-sm">{formatCurrentCurrency(25, false)} – {formatCurrentCurrency(25000, false)}</span>
            </div>
          </div>

          {/* Card 2: Investor Referrer (Invested Members - 2X HIGHER) */}
          <div className="bg-[#11271D] rounded-2xl border-2 border-[#C5A059] p-5 sm:p-8 space-y-4 sm:space-y-5 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bg-[#C5A059] text-[#11271D] text-[10px] font-black uppercase tracking-wider px-3 sm:px-4 py-1 rounded-bl-xl shadow-xs">
              👑 2x Higher Rewards Boost
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#C5A059] bg-white/10 px-3 py-1 rounded-full border border-white/20">
                Tier 2 Elite Status
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{t.refInvestorReferrer || 'Investor Referrer'}</h3>
              <p className="text-xs text-[#A7B6AB] mt-1">
                {t.refInvestorDesc || 'Unlocked automatically when you make your first platform investment.'}
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-[#D8DFD9]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span><strong>{t.refDoubleRewards || 'Double Milestone Payouts'}:</strong> Earn from <strong>{formatCurrentCurrency(50, false)}</strong> up to <strong>{formatCurrentCurrency(50000, false)}</strong> for a single milestone!</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span><strong>{t.refPotentialMax || 'Potential Max Payout in a Cycle'}:</strong> Accumulate up to <strong>{formatCurrentCurrency(124300, false)}</strong> total across all 10 milestones in a single {formatCurrentCurrency(500000, false)} cycle!</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span><strong>Multi-Bar Continuity:</strong> Reaching {formatCurrentCurrencyCompact(500000)} and payment reflection activates a fresh milestone bar starting from {formatCurrentCurrency(500, false)}.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span><strong>Same Referral Volume:</strong> You get 2x rewards for the exact same partners referred!</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="text-[#A7B6AB]">{t.refSingleMilestoneRange || 'Single Milestone Payout Range'}:</span>
              <span className="font-mono font-black text-[#C5A059] text-base">{formatCurrentCurrency(50, false)} – {formatCurrentCurrency(50000, false)}</span>
            </div>
          </div>
        </div>

        {/* Motivational Banner Explaining the Upgrade Mechanism */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#1B3B2B] to-[#11271D] border border-[#C5A059]/40 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-[#C5A059] shrink-0 mt-1" />
            <div className="space-y-1">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span>How the Referral Upgrade Works</span>
                <span className="text-[10px] font-mono text-[#C5A059] bg-[#C5A059]/20 px-2 py-0.5 rounded border border-[#C5A059]/40">
                  Automatic &amp; Instant
                </span>
              </div>
              <p className="text-xs text-[#A7B6AB] leading-relaxed max-w-3xl">
                Start sharing your link today even if you haven't invested yet. Whenever you make your first agricultural investment, the system instantly upgrades your referral status to <strong>Investor Referrer</strong>, doubling all upcoming milestone payouts without requiring any new links!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAction}
            className="self-stretch md:self-auto min-h-[44px] px-5 py-2.5 bg-[#C5A059] hover:bg-[#B38F48] text-[#11271D] text-xs font-black rounded-xl transition-all cursor-pointer shadow-md whitespace-nowrap flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>{isAuthenticated ? (t.refDashboardCta || 'Open Referral Hub') : (t.refJoinProgram || 'Get Referral Link')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual 5-Milestone Cards Showcase (with Images by the Left Side) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-extrabold text-[#1B3B2B] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C5A059]" />
                <span>10-Tier Milestone Visual Showcase</span>
              </h3>
              <p className="text-xs text-[#5C6572]">
                Each milestone features dedicated agricultural breeding assets, volume qualification thresholds, and instant reward unlocks.
              </p>
            </div>
            <div className="text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-[#DCDAD0] text-[#1B3B2B] self-start sm:self-auto">
              Max Single Milestone Claim: <strong className="text-[#C5A059]">{formatCurrentCurrency(50000, false)}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {REFERRAL_MILESTONES.map((m) => {
              const isTop = m.volumeThreshold === 500000;
              return (
                <div
                  key={`card-${m.id}`}
                  className={`rounded-2xl border p-3.5 bg-white transition-all hover:shadow-md flex flex-col justify-between space-y-3 relative ${
                    isTop
                      ? 'border-2 border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-sm bg-[#FAF9F5]'
                      : 'border-[#E5E3D8]'
                  }`}
                >
                  {isTop && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#C5A059] text-[#11271D] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap z-10">
                      👑 Top Milestone
                    </span>
                  )}

                  {/* Top: Milestone Badge by Left Side + Milestone Name & Threshold */}
                  <div className="flex items-center gap-3">
                    <MilestoneBadge volumeThreshold={m.volumeThreshold} size="md" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono font-bold text-[#5C6572] bg-[#F7F6F2] px-1.5 py-0.5 rounded border border-[#E5E3D8]">
                        {formatCurrentCurrencyCompact(m.volumeThreshold)} Target
                      </span>
                      <h4 className="text-xs font-bold text-[#1B3B2B] leading-tight truncate mt-1">
                        {m.name}
                      </h4>
                    </div>
                  </div>

                  {/* Bottom: Rewards breakdown */}
                  <div className="space-y-1.5 pt-2 border-t border-[#F0EFEA] text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#5C6572]">Basic:</span>
                      <span className="font-mono font-semibold text-[#1B3B2B]">
                        {formatReferralCurrency(m.basicReward)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-800 font-semibold flex items-center gap-1">
                        <span>Investor:</span>
                        <span className="text-[9px] font-mono text-[#C5A059] bg-[#C5A059]/15 px-1 rounded">2x</span>
                      </span>
                      <span className="font-mono font-black text-emerald-700">
                        {formatReferralCurrency(m.investorReward)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Ladder Table (In Active Currency) */}
        <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#E5E3D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#1B3B2B]">
                Milestone Payout Ladder &amp; Named Tiers
              </h3>
              <p className="text-xs text-[#5C6572]">
                Rewards are paid at every milestone reached. Each milestone is paid once per cycle with automatic renewal upon 1M payment.
              </p>
            </div>
            <div className="text-xs font-mono text-[#1B3B2B] bg-[#F7F6F2] px-3 py-1.5 rounded-lg border border-[#DCDAD0] self-start sm:self-auto">
              Currency: <strong>{CURRENCY_NAMES[currency] || currency}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-5">Milestone Tier</th>
                  <th className="py-3 px-5">Basic Referrer Reward</th>
                  <th className="py-3 px-5">Investor Referrer Reward</th>
                  <th className="py-3 px-5 text-right">Investor Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEA]">
                {REFERRAL_MILESTONES.map((m) => (
                  <tr key={m.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3 px-5">
                      <div>
                        <div className="font-bold text-[#1B3B2B] text-sm flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{m.name}</span>
                        </div>
                        <div className="text-[11px] text-[#5C6572] font-mono mt-0.5">
                          {formatCurrentCurrency(m.volumeThreshold, false)} volume threshold
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 font-mono font-semibold text-[#5C6572]">
                      {formatReferralCurrency(m.basicReward)}
                    </td>
                    <td className="py-3 px-5 font-mono font-black text-emerald-700 text-sm">
                      {formatReferralCurrency(m.investorReward)}
                    </td>
                    <td className="py-3 px-5 text-right font-mono font-bold text-[#C5A059]">
                      +100% (2x Payout)
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#F7F6F2] font-bold text-[#1B3B2B]">
                  <td className="py-3.5 px-5">
                    <div className="text-sm font-black text-[#1B3B2B]">Current Max Potential Payout in a Cycle</div>
                    <div className="text-[11px] text-[#5C6572] font-normal">Cumulative across all 10 milestones up to {formatCurrentCurrency(500000, false)} target</div>
                  </td>
                  <td className="py-3.5 px-5 font-mono font-bold text-[#5C6572] text-sm">
                    {formatCurrentCurrency(62150, false)}
                  </td>
                  <td className="py-3.5 px-5 font-mono font-black text-emerald-800 text-base">
                    {formatCurrentCurrency(124300, false)}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-[#C5A059]">
                    +{formatCurrentCurrency(62150, false)} Bonus (2x)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Link Generator & Sharing for Public Visitors */}
        <div className="bg-white rounded-2xl border border-[#E5E3D8] p-5 sm:p-8 space-y-4 text-center max-w-2xl mx-auto shadow-xs">
          <Award className="w-10 h-10 text-[#C5A059] mx-auto" />
          <h3 className="text-xl font-bold text-[#1B3B2B]">
            {t.refTitle || 'Ready to Start Earning Referral Rewards?'}
          </h3>
          <p className="text-xs text-[#5C6572] leading-relaxed">
            {isAuthenticated
              ? `You are signed in as ${currentUser?.full_name}. Your referral link is ready to share with partners across Europe.`
              : (t.refDesc || 'Join BirdGrow free in under 60 seconds to get your personalized European referral link and start accumulating qualified volume.')}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? (t.refCopied || 'Link Copied!') : (t.refCopyLink || 'Copy My Referral Link')}</span>
                </button>
                {onNavigateToDashboard && (
                  <button
                    type="button"
                    onClick={onNavigateToDashboard}
                    className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#C5A059] hover:bg-[#B38F48] text-[#11271D] text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>{t.refDashboardCta || 'View Dashboard Referral Stats'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-sm font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <span>{t.refJoinProgram || 'Register to Get Your Referral Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};