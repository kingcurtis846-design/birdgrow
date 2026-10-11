import React, { useState, useMemo } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import {
  formatReferralCurrency,
  formatReferralCompact,
  REFERRAL_MILESTONES,
  isUserInvestorReferrer,
} from '../../lib/referralEngine';

const formatNaira = formatReferralCurrency;
const formatNairaCompact = formatReferralCompact;

export const AdminReferralSection: React.FC = () => {
  const {
    profiles,
    investments,
    referralRelationships,
    qualifiedInvestments,
    milestoneRewards,
    qualifyReferralInvestment,
    reverseReferralInvestment,
    adminPayMilestoneReward,
    adminReverseMilestoneReward,
    addReferralRelationship,
  } = usePlatform();

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [subTab, setSubTab] = useState<'leaderboard' | 'trees' | 'investments' | 'rewards'>('leaderboard');
  const [statusFilter, setStatusFilter] = useState<'all' | 'qualified' | 'pending_verification' | 'reversed'>('all');
  const [rewardStatusFilter, setRewardStatusFilter] = useState<'all' | 'unlocked' | 'paid' | 'reversed'>('all');

  // Manual link form
  const [showManualLinkForm, setShowManualLinkForm] = useState(false);
  const [manualReferrerCode, setManualReferrerCode] = useState('');
  const [manualReferredUserId, setManualReferredUserId] = useState('');
  const [manualFeedback, setManualFeedback] = useState<string | null>(null);

  // Global referral statistics
  const stats = useMemo(() => {
    const totalVolume = qualifiedInvestments
      .filter((q) => q.qualificationStatus === 'qualified')
      .reduce((sum, q) => sum + q.amount, 0);

    const totalEarned = milestoneRewards
      .filter((r) => r.status !== 'reversed')
      .reduce((sum, r) => sum + r.rewardAmount, 0);

    const totalPaid = milestoneRewards
      .filter((r) => r.status === 'paid')
      .reduce((sum, r) => sum + r.rewardAmount, 0);

    const totalPending = milestoneRewards
      .filter((r) => r.status === 'unlocked' || r.status === 'pending')
      .reduce((sum, r) => sum + r.rewardAmount, 0);

    const totalReversed = milestoneRewards
      .filter((r) => r.status === 'reversed')
      .reduce((sum, r) => sum + r.rewardAmount, 0);

    // Count distinct referrers
    const distinctReferrerIds = Array.from(new Set(referralRelationships.map((r) => r.referrerUserId)));
    let investorReferrers = 0;
    let basicReferrers = 0;

    distinctReferrerIds.forEach((id) => {
      if (isUserInvestorReferrer(id, investments)) {
        investorReferrers++;
      } else {
        basicReferrers++;
      }
    });

    return {
      totalVolume,
      totalEarned,
      totalPaid,
      totalPending,
      totalReversed,
      totalReferrers: distinctReferrerIds.length,
      investorReferrers,
      basicReferrers,
      totalRelationships: referralRelationships.length,
    };
  }, [qualifiedInvestments, milestoneRewards, referralRelationships, investments]);

  // Top Referrers Leaderboard
  const leaderboard = useMemo(() => {
    const map = new Map<string, {
      userId: string;
      profile?: (typeof profiles)[0];
      totalVolume: number;
      referredCount: number;
      investorCount: number;
      isInvestor: boolean;
      rewardsEarned: number;
    }>();

    referralRelationships.forEach((rel) => {
      if (!map.has(rel.referrerUserId)) {
        const prof = profiles.find((p) => p.user_id === rel.referrerUserId);
        map.set(rel.referrerUserId, {
          userId: rel.referrerUserId,
          profile: prof,
          totalVolume: 0,
          referredCount: 0,
          investorCount: 0,
          isInvestor: isUserInvestorReferrer(rel.referrerUserId, investments),
          rewardsEarned: 0,
        });
      }
      const entry = map.get(rel.referrerUserId)!;
      entry.referredCount++;
    });

    qualifiedInvestments.forEach((qi) => {
      if (qi.qualificationStatus === 'qualified' && map.has(qi.referrerUserId)) {
        const entry = map.get(qi.referrerUserId)!;
        entry.totalVolume += qi.amount;
      }
    });

    milestoneRewards.forEach((r) => {
      if (r.status !== 'reversed' && map.has(r.userId)) {
        const entry = map.get(r.userId)!;
        entry.rewardsEarned += r.rewardAmount;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalVolume - a.totalVolume);
  }, [referralRelationships, qualifiedInvestments, milestoneRewards, profiles, investments]);

  // Filtered Qualified Investments
  const filteredInvestments = useMemo(() => {
    return qualifiedInvestments.filter((qi) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        qi.referredUserName.toLowerCase().includes(q) ||
        qi.investmentId.toLowerCase().includes(q) ||
        qi.referrerUserId.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || qi.qualificationStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [qualifiedInvestments, searchTerm, statusFilter]);

  // Filtered Rewards Ledger
  const filteredRewards = useMemo(() => {
    return milestoneRewards.filter((r) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        r.referenceId.toLowerCase().includes(q) ||
        r.userId.toLowerCase().includes(q) ||
        r.milestoneId.toLowerCase().includes(q);
      const matchesStatus = rewardStatusFilter === 'all' || r.status === rewardStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [milestoneRewards, searchTerm, rewardStatusFilter]);

  // Filtered Referral Trees
  const filteredTrees = useMemo(() => {
    return referralRelationships.filter((rel) => {
      const q = searchTerm.toLowerCase();
      return (
        rel.referredUserName.toLowerCase().includes(q) ||
        rel.referredUserEmail.toLowerCase().includes(q) ||
        rel.referrerCode.toLowerCase().includes(q) ||
        rel.referrerUserId.toLowerCase().includes(q)
      );
    });
  }, [referralRelationships, searchTerm]);

  const handleManualLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualReferrerCode || !manualReferredUserId) return;
    const res = addReferralRelationship(manualReferrerCode, manualReferredUserId);
    setManualFeedback(res.message);
    if (res.success) {
      setManualReferrerCode('');
      setManualReferredUserId('');
      setTimeout(() => {
        setManualFeedback(null);
        setShowManualLinkForm(false);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">Total Qualified Volume</span>
          <div className="text-2xl font-black font-mono text-[#1B3B2B]">
            {formatNaira(stats.totalVolume)}
          </div>
          <div className="text-[11px] text-[#16A34A] font-semibold">
            {stats.totalRelationships} registered referral links
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">Milestone Rewards Issued</span>
          <div className="text-2xl font-black font-mono text-emerald-600">
            {formatNaira(stats.totalEarned)}
          </div>
          <div className="text-[11px] text-[#5C6572]">
            Paid: {formatNaira(stats.totalPaid)} · Pending: {formatNaira(stats.totalPending)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">Referrers by Tier</span>
          <div className="text-2xl font-black font-mono text-[#1B3B2B]">
            {stats.totalReferrers}
          </div>
          <div className="text-[11px] text-[#5C6572] flex items-center gap-2">
            <span className="text-emerald-700 font-semibold">{stats.investorReferrers} Investor</span>
            <span>·</span>
            <span className="text-amber-700 font-semibold">{stats.basicReferrers} Basic</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E3D8] shadow-xs space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">Reversals & Fraud Safeguards</span>
          <div className="text-2xl font-black font-mono text-amber-700">
            {formatNaira(stats.totalReversed)}
          </div>
          <div className="text-[11px] text-[#5C6572]">
            Auto-deducted on refund/cancellation
          </div>
        </div>
      </div>

      {/* Main Referral Management Box */}
      <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-xs overflow-hidden">
        
        {/* Header & Sub-Tabs */}
        <div className="p-5 border-b border-[#E5E3D8] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#1B3B2B] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C5A059]" />
              <span>Referral Network &amp; Milestone Engine</span>
            </h3>
            <p className="text-xs text-[#5C6572]">
              Audit referral trees, evaluate cumulative volume triggers, verify qualifications, and manage fraud safeguards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowManualLinkForm(!showManualLinkForm)}
              className="px-3 py-1.5 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Link Referral</span>
            </button>
          </div>
        </div>

        {/* Manual Link Drawer */}
        {showManualLinkForm && (
          <div className="p-4 bg-[#F7F6F2] border-b border-[#E5E3D8] space-y-3 animate-in fade-in">
            <div className="text-xs font-bold text-[#1B3B2B]">Admin Manual Referral Attribution</div>
            {manualFeedback && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                {manualFeedback}
              </div>
            )}
            <form onSubmit={handleManualLink} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                required
                value={manualReferrerCode}
                onChange={(e) => setManualReferrerCode(e.target.value)}
                placeholder="Referrer Code or User ID (e.g. curtisking-01)"
                className="flex-1 px-3 py-2 bg-white border border-[#DCDAD0] rounded-lg text-xs text-[#1B3B2B] font-mono focus:outline-none"
              />
              <select
                required
                value={manualReferredUserId}
                onChange={(e) => setManualReferredUserId(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-[#DCDAD0] rounded-lg text-xs text-[#1B3B2B] focus:outline-none"
              >
                <option value="">Select User to Link...</option>
                {profiles.map((p) => (
                  <option key={p.user_id} value={p.user_id}>
                    {p.full_name} ({p.email}) - {p.user_id}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Link Relationship
              </button>
            </form>
          </div>
        )}

        {/* Sub-Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-[#E5E3D8] px-5 pt-3 overflow-x-auto bg-[#FAF9F5]">
          <button
            onClick={() => setSubTab('leaderboard')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              subTab === 'leaderboard'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            Top Referrers Leaderboard ({leaderboard.length})
          </button>
          <button
            onClick={() => setSubTab('investments')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              subTab === 'investments'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            Qualified Investment Transactions ({qualifiedInvestments.length})
          </button>
          <button
            onClick={() => setSubTab('rewards')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              subTab === 'rewards'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            Milestone Rewards Ledger ({milestoneRewards.length})
          </button>
          <button
            onClick={() => setSubTab('trees')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              subTab === 'trees'
                ? 'border-[#1B3B2B] text-[#1B3B2B]'
                : 'border-transparent text-[#5C6572] hover:text-[#1B3B2B]'
            }`}
          >
            Referral Relationships ({referralRelationships.length})
          </button>
        </div>

        {/* Search Bar & Global Filter */}
        <div className="p-4 bg-white border-b border-[#E5E3D8] flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-3.5 h-3.5 text-[#7C887E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user, code, ref ID, or transaction..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          {subTab === 'investments' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs text-[#1B3B2B]"
            >
              <option value="all">All Qualifications</option>
              <option value="qualified">Qualified</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="reversed">Reversed</option>
            </select>
          )}

          {subTab === 'rewards' && (
            <select
              value={rewardStatusFilter}
              onChange={(e) => setRewardStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs text-[#1B3B2B]"
            >
              <option value="all">All Reward Statuses</option>
              <option value="unlocked">Available / Unlocked</option>
              <option value="paid">Paid & Settled</option>
              <option value="reversed">Reversed</option>
            </select>
          )}
        </div>

        {/* TAB 1: LEADERBOARD */}
        {subTab === 'leaderboard' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-5">Rank &amp; Referrer</th>
                  <th className="py-3 px-5">Status Tier</th>
                  <th className="py-3 px-5">Referred Partners</th>
                  <th className="py-3 px-5">Total Qualified Volume</th>
                  <th className="py-3 px-5">Rewards Earned</th>
                  <th className="py-3 px-5 text-right">Highest Milestone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEA]">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#5C6572]">
                      No referral volume accumulated yet.
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((item, idx) => {
                    const topMilestone = [...REFERRAL_MILESTONES]
                      .reverse()
                      .find((m) => item.totalVolume >= m.volumeThreshold);

                    return (
                      <tr key={item.userId} className="hover:bg-[#FAF9F5] transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#11271D] text-[#C5A059] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <div>
                              <div className="font-bold text-[#1B3B2B]">
                                {item.profile?.full_name || 'Member'}
                              </div>
                              <div className="text-[11px] text-[#5C6572] font-mono">
                                {item.userId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.isInvestor
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {item.isInvestor ? 'Investor Referrer (2x)' : 'Basic Referrer'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-mono font-semibold text-[#1B3B2B]">
                          {item.referredCount}
                        </td>
                        <td className="py-3.5 px-5 font-mono font-black text-[#C5A059] text-sm">
                          {formatNaira(item.totalVolume)}
                        </td>
                        <td className="py-3.5 px-5 font-mono font-bold text-emerald-700">
                          {formatNaira(item.rewardsEarned)}
                        </td>
                        <td className="py-3.5 px-5 text-right font-mono font-bold text-[#1B3B2B]">
                          {topMilestone ? topMilestone.shortLabel : '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: QUALIFIED INVESTMENTS */}
        {subTab === 'investments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-5">Investor (Referred User)</th>
                  <th className="py-3 px-5">Referrer</th>
                  <th className="py-3 px-5">Volume Amount</th>
                  <th className="py-3 px-5">Investment Date</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Compliance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEA]">
                {filteredInvestments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#5C6572]">
                      No matching referral investment records found.
                    </td>
                  </tr>
                ) : (
                  filteredInvestments.map((qi) => (
                    <tr key={qi.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-[#1B3B2B]">{qi.referredUserName}</div>
                        <div className="text-[11px] text-[#5C6572] font-mono">{qi.investmentId}</div>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[#5C6572]">
                        {qi.referrerUserId}
                      </td>
                      <td className="py-3.5 px-5 font-mono font-black text-[#1B3B2B] text-sm">
                        {formatNaira(qi.amount)}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[#5C6572]">
                        {qi.investmentDate}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          qi.qualificationStatus === 'qualified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : qi.qualificationStatus === 'pending_verification'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {qi.qualificationStatus.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        {qi.qualificationStatus !== 'qualified' && (
                          <button
                            type="button"
                            onClick={() => qualifyReferralInvestment(qi.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
                          >
                            Verify &amp; Qualify
                          </button>
                        )}
                        {qi.qualificationStatus !== 'reversed' && (
                          <button
                            type="button"
                            onClick={() => reverseReferralInvestment(qi.id)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
                          >
                            Reverse / Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: MILESTONE REWARDS */}
        {subTab === 'rewards' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-5">Ref ID &amp; User</th>
                  <th className="py-3 px-5">Milestone</th>
                  <th className="py-3 px-5">Reward Amount</th>
                  <th className="py-3 px-5">Tier at Award</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Audit &amp; Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEA]">
                {filteredRewards.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#5C6572]">
                      No matching milestone reward events found.
                    </td>
                  </tr>
                ) : (
                  filteredRewards.map((r) => (
                    <tr key={r.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-mono font-bold text-[#1B3B2B]">{r.referenceId}</div>
                        <div className="text-[11px] text-[#5C6572] font-mono">{r.userId}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-[#1B3B2B] text-xs">
                          {REFERRAL_MILESTONES.find((m) => m.volumeThreshold === r.volumeThreshold)?.name || 'Milestone Tier'}
                        </div>
                        <div className="font-mono text-[11px] text-[#5C6572]">
                          {formatNaira(r.volumeThreshold)} Threshold
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-mono font-black text-emerald-700 text-sm">
                        {formatNaira(r.rewardAmount)}
                      </td>
                      <td className="py-3.5 px-5 capitalize font-semibold text-[#5C6572]">
                        {r.referrerTypeAtAward} Referrer
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          r.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'unlocked'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {r.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        {r.status !== 'paid' && r.status !== 'reversed' && (
                          <button
                            type="button"
                            onClick={() => adminPayMilestoneReward(r.id)}
                            className="px-2.5 py-1 bg-[#1B3B2B] hover:bg-[#11271D] text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        )}
                        {r.status !== 'reversed' && (
                          <button
                            type="button"
                            onClick={() => adminReverseMilestoneReward(r.id)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
                          >
                            Reverse
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: REFERRAL TREES */}
        {subTab === 'trees' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#E5E3D8] text-[#5C6572] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-5">Referred User</th>
                  <th className="py-3 px-5">Referrer Code &amp; User</th>
                  <th className="py-3 px-5">Registration Date</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEA]">
                {filteredTrees.map((rel) => (
                  <tr key={rel.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#1B3B2B]">{rel.referredUserName}</div>
                      <div className="text-[11px] text-[#5C6572]">{rel.referredUserEmail}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-mono font-bold text-[#C5A059]">{rel.referrerCode}</div>
                      <div className="text-[11px] text-[#5C6572] font-mono">{rel.referrerUserId}</div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[#5C6572]">
                      {rel.registrationDate}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[11px] border border-emerald-200">
                        {rel.status.toUpperCase()}
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
  );
};
