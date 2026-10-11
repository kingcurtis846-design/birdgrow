import React, { useState, useMemo } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { formatEuro, formatDate } from '../../lib/formatters';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { AccountEvent } from '../../types';

interface ActivityHistoryProps {
  onOpenDeposit?: () => void;
  onOpenWithdrawal?: () => void;
  onOpenInvest?: () => void;
  onOpenReview?: () => void;
  compact?: boolean;
  maxItems?: number;
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({
  onOpenDeposit,
  onOpenWithdrawal,
  onOpenInvest,
  onOpenReview,
  compact = false,
  maxItems,
}) => {
  const { currentUser, transactions, investments, plans, cycles, hasWithdrawnProfit, formatCurrentCurrency, t } = usePlatform();

  const [activeFilter, setActiveFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'investment' | 'payout'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Generate unified, chronologically ordered events from transactions and investments
  const allEvents = useMemo<AccountEvent[]>(() => {
    if (!currentUser) return [];

    const userTxs = transactions.filter((t) => t.user_id === currentUser.user_id);
    const userInvs = investments.filter((i) => i.user_id === currentUser.user_id);

    const eventList: AccountEvent[] = [];

    // Map all ledger transactions
    userTxs.forEach((tx) => {
      let title = 'Account Event';
      let description = 'Transaction recorded on the financial ledger.';
      let amountDirection: 'inflow' | 'outflow' | 'neutral' = 'neutral';

      if (tx.type === 'deposit') {
        const coin = tx.metadata?.cryptoCoin || 'USDT';
        title = `Deposit Cleared (${coin})`;
        description = `Capital deposited via ${tx.payment_gateway.toUpperCase()} (${tx.metadata?.network || 'On-chain cryptographic settlement'}) to main wallet balance.`;
        amountDirection = 'inflow';
      } else if (tx.type === 'withdrawal') {
        const coin = tx.metadata?.cryptoCoin || 'USDT';
        if (tx.status === 'failed') {
          title = `Withdrawal Declined`;
          description = tx.metadata?.errorMessage
            ? `Transfer declined: ${tx.metadata.errorMessage}. Capital restored to wallet balance.`
            : `Withdrawal transfer declined by treasury desk.`;
          amountDirection = 'neutral';
        } else if (tx.status === 'partial' || tx.metadata?.isPartialPayout) {
          title = `Partial Payout Dispatched (${coin})`;
          description = `Partial disbursement of ${formatCurrentCurrency(tx.metadata?.partialPayoutAmount || tx.amount)} processed. Remaining balance returned to wallet.`;
          amountDirection = 'outflow';
        } else {
          title = `Profit Withdrawal Dispatched`;
          description = `Harvest profits withdrawn to external ${coin} wallet address: ${tx.metadata?.address || tx.metadata?.walletAddress ? (tx.metadata?.address || tx.metadata?.walletAddress).slice(0, 8) + '••••' + (tx.metadata?.address || tx.metadata?.walletAddress).slice(-6) : 'Verified destination'}.`;
          amountDirection = 'outflow';
        }
      } else if (tx.type === 'investment') {
        title = `Capital Allocated to Batch`;
        description = `Deployed into ${tx.metadata?.planTitle || 'European Poultry Production Run'} (${tx.metadata?.cycleCode || 'EU Hub'}).`;
        amountDirection = 'neutral';
      } else if (tx.type === 'payout') {
        title = `Harvest Return & Principal Settled`;
        description = tx.metadata?.note || `Contractual production harvest matured with full ROI payout credited to wallet.`;
        amountDirection = 'inflow';
      }

      eventList.push({
        id: tx.id,
        timestamp: tx.created_at,
        type: tx.type,
        title,
        description,
        amount: tx.amount,
        amountDirection,
        status: tx.status as any,
        reference: tx.reference,
        planTitle: tx.metadata?.planTitle,
        cycleCode: tx.metadata?.cycleCode,
        gateway: tx.payment_gateway,
        details: tx.metadata,
      });
    });

    // Check investments to ensure completion events are prominently captured
    userInvs.forEach((inv) => {
      if (inv.status === 'matured') {
        const alreadyExists = eventList.some(
          (e) => e.type === 'payout' && (e.reference.includes(inv.cycle_code) || e.cycleCode === inv.cycle_code)
        );
        if (!alreadyExists) {
          eventList.push({
            id: `mat-${inv.id}`,
            timestamp: inv.maturity_date + 'T12:00:00Z',
            type: 'payout',
            title: `Batch Maturation & Return Realized`,
            description: `Full contractual yield (+${formatCurrentCurrency(inv.expected_roi_amount)}) and principal (+${formatCurrentCurrency(inv.principal_amount)}) matured on ${inv.plan_title} at ${inv.facility_location}.`,
            amount: inv.total_payout,
            amountDirection: 'inflow',
            status: 'completed',
            reference: `COMPLETION-${inv.cycle_code}`,
            planTitle: inv.plan_title,
            cycleCode: inv.cycle_code,
            facilityLocation: inv.facility_location,
            details: {
              principal: inv.principal_amount,
              expectedRoi: inv.expected_roi_amount,
              totalPayout: inv.total_payout,
              offtaker: 'Pre-contracted European Supermarket Network',
            },
          });
        }
      }
    });

    // Order strictly chronologically (newest first)
    return eventList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [currentUser, transactions, investments]);

  // Aggregate stats
  const totals = useMemo(() => {
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalAllocations = 0;
    let totalPayouts = 0;

    allEvents.forEach((e) => {
      if (e.type === 'deposit' && e.status === 'successful') totalDeposits += e.amount;
      if (e.type === 'withdrawal' && (e.status === 'successful' || e.status === 'pending')) totalWithdrawals += e.amount;
      if (e.type === 'investment' && e.status === 'successful') totalAllocations += e.amount;
      if (e.type === 'payout' && (e.status === 'successful' || e.status === 'completed')) totalPayouts += e.amount;
    });

    return { totalDeposits, totalWithdrawals, totalAllocations, totalPayouts };
  }, [allEvents]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      if (activeFilter !== 'all' && event.type !== activeFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = event.reference.toLowerCase().includes(q);
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesDesc = event.description.toLowerCase().includes(q);
        const matchesPlan = (event.planTitle || '').toLowerCase().includes(q);
        const matchesCycle = (event.cycleCode || '').toLowerCase().includes(q);
        return matchesRef || matchesTitle || matchesDesc || matchesPlan || matchesCycle;
      }

      return true;
    });
  }, [allEvents, activeFilter, searchQuery]);

  const displayedEvents = maxItems ? filteredEvents.slice(0, maxItems) : filteredEvents;

  const handleExportCsv = () => {
    const headers = ['Event ID', 'Date & Time', 'Type', 'Title', 'Reference', 'Amount (EUR)', 'Status'];
    const rows = filteredEvents.map((e) => [
      e.id,
      e.timestamp,
      e.type,
      `"${e.title}"`,
      e.reference,
      e.amount.toFixed(2),
      e.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `birdgrow_activity_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEventIcon = (type: AccountEvent['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-700" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-amber-700" />;
      case 'investment':
        return <Layers className="w-4 h-4 text-[#1B3B2B]" />;
      case 'payout':
        return <Sparkles className="w-4 h-4 text-[#C5A059]" />;
      default:
        return <Clock className="w-4 h-4 text-[#5C6572]" />;
    }
  };

  const getBadgeStyle = (type: AccountEvent['type']) => {
    switch (type) {
      case 'deposit':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'withdrawal':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'investment':
        return 'bg-[#F0EFEA] text-[#1B3B2B] border-[#DCDAD0]';
      case 'payout':
        return 'bg-[#C5A059]/15 text-[#8F702B] border-[#C5A059]/40';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards Row (only when not compact) */}
      {!compact && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5E3D8] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#5C6572] mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] truncate">Total Inflow Deposits</span>
              <ArrowDownLeft className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-[#1B3B2B] tabular-nums">
              +{formatCurrentCurrency(totals.totalDeposits)}
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#5C6572] mt-0.5 truncate">Cleared into main wallet</div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5E3D8] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#5C6572] mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] truncate">Capital Allocated</span>
              <Layers className="w-4 h-4 text-[#1B3B2B] shrink-0" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-[#1B3B2B] tabular-nums">
              {formatCurrentCurrency(totals.totalAllocations)}
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#5C6572] mt-0.5 truncate">Deployed across production runs</div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5E3D8] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#5C6572] mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] truncate">Harvest Completions</span>
              <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-[#16A34A] tabular-nums">
              +{formatCurrentCurrency(totals.totalPayouts)}
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#5C6572] mt-0.5 truncate">Realized principal + profit</div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5E3D8] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#5C6572] mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] truncate">Profits Withdrawn</span>
              <ArrowUpRight className="w-4 h-4 text-amber-600 shrink-0" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-amber-900 tabular-nums">
              -{formatCurrentCurrency(totals.totalWithdrawals)}
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#5C6572] mt-0.5 truncate">Dispatched to external wallets</div>
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-xs overflow-hidden">
        
        {/* Header & Controls */}
        <div className="p-5 border-b border-[#E5E3D8] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-[#1B3B2B]">Activity History</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#F0EFEA] text-[#1B3B2B] border border-[#DCDAD0]">
                  {filteredEvents.length} Events
                </span>
              </div>
              <p className="text-xs text-[#5C6572] mt-0.5">
                Chronologically ordered record of all account events, deposits, profit withdrawals, and investment completions.
              </p>
            </div>

            {!compact && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 bg-white border border-[#DCDAD0] hover:border-[#1B3B2B] text-[#1B3B2B] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export History</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#1B3B2B] text-white shadow-2xs'
                    : 'bg-[#F7F6F2] text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#EAE8E0]'
                }`}
              >
                All Events ({allEvents.length})
              </button>

              <button
                onClick={() => setActiveFilter('deposit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'deposit'
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-[#F7F6F2] text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#EAE8E0]'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Deposits</span>
              </button>

              <button
                onClick={() => setActiveFilter('withdrawal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'withdrawal'
                    ? 'bg-amber-800 text-white shadow-2xs'
                    : 'bg-[#F7F6F2] text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#EAE8E0]'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Withdrawals</span>
              </button>

              <button
                onClick={() => setActiveFilter('investment')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'investment'
                    ? 'bg-[#11271D] text-white shadow-2xs'
                    : 'bg-[#F7F6F2] text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#EAE8E0]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Allocations</span>
              </button>

              <button
                onClick={() => setActiveFilter('payout')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'payout'
                    ? 'bg-[#8F702B] text-white shadow-2xs'
                    : 'bg-[#F7F6F2] text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#EAE8E0]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Completions</span>
              </button>
            </div>

            <div className="relative sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6572]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by ref, coin, plan..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>
          </div>
        </div>

        {/* Timeline Events List */}
        <div className="divide-y divide-[#F0EFEA]">
          {displayedEvents.length === 0 ? (
            <div className="py-16 text-center space-y-3 px-4">
              <div className="w-12 h-12 rounded-full bg-[#F7F6F2] border border-[#E5E3D8] flex items-center justify-center mx-auto text-[#5C6572]">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-[#1B3B2B]">No Account Events Found</div>
              <p className="text-xs text-[#5C6572] max-w-sm mx-auto">
                {searchQuery
                  ? 'No events match your search query. Try clearing your search or selecting a different filter.'
                  : 'Your account event activity stream will populate automatically when you make a deposit, allocation, or withdrawal.'}
              </p>
              {onOpenDeposit && (
                <button
                  onClick={onOpenDeposit}
                  className="px-4 py-2 bg-[#1B3B2B] text-white rounded-lg text-xs font-semibold hover:bg-[#11271D] transition-colors cursor-pointer"
                >
                  Make First Deposit
                </button>
              )}
            </div>
          ) : (
            displayedEvents.map((event, idx) => {
              const isExpanded = expandedEventId === event.id;
              const dateObj = new Date(event.timestamp);
              const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={event.id}
                  className="p-4 sm:p-5 hover:bg-[#FAF9F5] transition-colors group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left node with icon */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#F7F6F2] border border-[#E5E3D8] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#1B3B2B] transition-colors shadow-2xs">
                        {getEventIcon(event.type)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-[#1B3B2B]">
                            {event.title}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${getBadgeStyle(
                              event.type
                            )}`}
                          >
                            {event.type}
                          </span>

                          {event.status === 'successful' && (
                            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              ✓ COMPLETED
                            </span>
                          )}
                          {event.status === 'pending' && (
                            <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 animate-pulse">
                              ⏳ PENDING APPROVAL
                            </span>
                          )}
                          {event.status === 'failed' && (
                            <span className="text-[11px] font-mono font-bold text-red-800 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                              ✕ DECLINED
                            </span>
                          )}
                          {event.status === 'partial' && (
                            <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                              ⚡ PARTIAL PAYOUT
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#4A5568] leading-relaxed max-w-2xl">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#5C6572] pt-1">
                          <span className="font-mono flex items-center gap-1 text-[#1B3B2B] font-semibold">
                            <span>Ref:</span>
                            <span className="font-mono">{event.reference}</span>
                          </span>
                          <span>·</span>
                          <span>{formatDate(event.timestamp)} at {formattedTime}</span>
                          {event.planTitle && (
                            <>
                              <span>·</span>
                              <span className="font-medium text-[#1B3B2B]">{event.planTitle}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right amount column */}
                    <div className="text-right shrink-0 flex flex-col items-end">
                      <div
                        className={`text-base font-extrabold font-mono tabular-nums ${
                          event.amountDirection === 'inflow'
                            ? 'text-[#16A34A]'
                            : event.amountDirection === 'outflow'
                            ? 'text-amber-800'
                            : 'text-[#1B3B2B]'
                        }`}
                      >
                        {event.amountDirection === 'inflow' && '+'}
                        {event.amountDirection === 'outflow' && '-'}
                        {formatEuro(event.amount)}
                      </div>

                      <button
                        onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                        className="text-[11px] font-semibold text-[#5C6572] hover:text-[#1B3B2B] mt-1 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Less' : 'Details'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded metadata drawer */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-[#E5E3D8] bg-[#F7F6F2] p-3.5 rounded-xl space-y-2.5 text-xs text-[#3D4A41] animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="text-[#5C6572] block text-[10px] uppercase font-semibold">
                            Full Timestamp
                          </span>
                          <span className="font-mono text-xs font-medium text-[#1B3B2B]">
                            {new Date(event.timestamp).toUTCString()}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#5C6572] block text-[10px] uppercase font-semibold">
                            Settlement Layer
                          </span>
                          <span className="font-mono text-xs font-medium text-[#1B3B2B] uppercase">
                            {event.gateway || 'Platform Internal Escrow'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#5C6572] block text-[10px] uppercase font-semibold">
                            Audit Verification
                          </span>
                          <span className="text-xs font-medium text-[#16A34A] flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>BaFin & ECSP Compliant Log</span>
                          </span>
                        </div>
                      </div>

                      {/* Custom Declined Error and Issues Notice */}
                      {event.details?.errorMessage && (
                        <div className="p-3.5 bg-red-50/90 border border-red-200 rounded-xl space-y-2">
                          <div className="text-red-900 font-bold flex items-center gap-1.5 text-xs">
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                            <span>Transfer Declined Notice &amp; Identified Issues:</span>
                          </div>
                          <p className="text-xs text-red-800 font-medium leading-relaxed">
                            {event.details.errorMessage}
                          </p>
                          {event.details.issues && event.details.issues.length > 0 && (
                            <div className="pt-1 space-y-1">
                              <span className="text-[10px] uppercase font-bold text-red-900 tracking-wider">
                                Checklist of Specific Issues:
                              </span>
                              <ul className="space-y-1">
                                {event.details.issues.map((iss: string, iIdx: number) => (
                                  <li key={iIdx} className="text-[11px] text-red-700 flex items-start gap-1.5">
                                    <span className="text-red-500 font-bold">⚠️</span>
                                    <span>{iss}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {event.details.refundedToWallet !== false && (
                            <div className="text-[11px] text-emerald-800 font-semibold pt-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Your requested capital was safely refunded to your wallet balance.</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Custom Partial Payout Notice */}
                      {event.details?.isPartialPayout && (
                        <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-xl space-y-2">
                          <div className="text-amber-950 font-bold flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-[#C5A059]" />
                              <span>Partial Tranche Payout Processed</span>
                            </span>
                            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900">
                              Original Request: {formatEuro(event.details.originalRequestedAmount || event.amount)}
                            </span>
                          </div>
                          {event.details.partialMessage && (
                            <p className="text-xs text-amber-900 italic leading-relaxed bg-white/70 p-2.5 rounded-lg border border-amber-200">
                              "{event.details.partialMessage}"
                            </p>
                          )}
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                            <div className="p-2 bg-white rounded border border-amber-200">
                              <span className="text-[#5C6572] block text-[10px]">Tranche Dispatched:</span>
                              <strong className="text-emerald-700">+{formatEuro(event.details.partialPayoutAmount || event.amount)}</strong>
                            </div>
                            <div className="p-2 bg-white rounded border border-amber-200">
                              <span className="text-[#5C6572] block text-[10px]">Restored to Wallet:</span>
                              <strong className="text-[#C5A059]">+{formatEuro(event.details.remainingAmount || 0)}</strong>
                            </div>
                          </div>
                          {event.details.capitalPairingCategory && (
                            <div className="text-[11px] text-[#5C6572] pt-0.5">
                              Capital paired with: <strong className="text-[#1B3B2B] capitalize">{event.details.capitalPairingCategory.replace('_', ' ')}</strong>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Event specific details */}
                      {event.details && (
                        <div className="pt-2 border-t border-[#E5E3D8] text-[11px] font-mono text-[#5C6572] flex flex-wrap gap-x-4 gap-y-1">
                          {event.details.txHash && (
                            <span className="truncate max-w-xs">
                              <strong>Tx Hash:</strong> {event.details.txHash}
                            </span>
                          )}
                          {event.details.network && (
                            <span>
                              <strong>Network:</strong> {event.details.network}
                            </span>
                          )}
                          {event.details.address && (
                            <span className="truncate max-w-xs">
                              <strong>Address:</strong> {event.details.address}
                            </span>
                          )}
                          {event.details.note && (
                            <span>
                              <strong>Note:</strong> {event.details.note}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Contextual actions */}
                      <div className="pt-2 flex items-center justify-between">
                        <div className="text-[11px] text-[#5C6572]">
                          Permanent audit reference: <strong className="font-mono">{event.id}</strong>
                        </div>

                        {/* If withdrawal or payout, invite investor to leave verified review */}
                        {(event.type === 'withdrawal' || event.type === 'payout') && onOpenReview && hasWithdrawnProfit && (
                          <button
                            onClick={onOpenReview}
                            className="px-2.5 py-1 bg-[#1B3B2B] text-white rounded text-[11px] font-bold hover:bg-[#11271D] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3 text-[#C5A059]" />
                            <span>Leave Verified Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-4 bg-[#F7F6F2] border-t border-[#E5E3D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5C6572]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Immutable real-time audit ledger · Underwritten forward off-take settlements</span>
          </div>
          <span className="font-mono text-[11px] text-[#8C988F]">
            Last ledger refresh: {new Date().toISOString().slice(0, 10)}
          </span>
        </div>

      </div>
    </div>
  );
};
