import React, { useState, useEffect, useMemo } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { InvestmentPlan } from '../../types';
import { convertGbpAmount, convertToGbp, formatRawCurrency } from '../../lib/formatters';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: InvestmentPlan | null;
  initialAmount?: number;
  onOpenDeposit: (prefillAmount?: number) => void; // Updated to pass pre-fill amount
}

export const InvestModal: React.FC<InvestModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  initialAmount,
  onOpenDeposit,
}) => {
  const { plans, currentWallet, executeInvestment, language, settings, currency, currencySymbol, t } = usePlatform();
  const [activePlanId, setActivePlanId] = useState<string>(selectedPlan?.id || plans[0]?.id || '');
  const [amount, setAmount] = useState<number>(() => {
    if (initialAmount && initialAmount > 0) return initialAmount;
    const planMin = selectedPlan?.min_amount || 500;
    return convertGbpAmount(planMin, currency);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const currentPlan = plans.find((p) => p.id === activePlanId) || selectedPlan || plans[0];
  const mainBalance = currentWallet?.main_balance || 0;
  const mainBalanceInActive = convertGbpAmount(mainBalance, currency);

  useEffect(() => {
    if (isOpen) {
      if (selectedPlan) {
        setActivePlanId(selectedPlan.id);
        const planMinInActive = convertGbpAmount(selectedPlan.min_amount, currency);
        setAmount(initialAmount && initialAmount > 0 ? initialAmount : planMinInActive);
      } else if (plans && plans.length > 0) {
        const defaultPlan = plans[0];
        setActivePlanId(defaultPlan.id);
        const planMinInActive = convertGbpAmount(defaultPlan.min_amount, currency);
        setAmount(initialAmount && initialAmount > 0 ? initialAmount : planMinInActive);
      }
      setFeedback(null);
    }
  }, [isOpen, selectedPlan, plans, initialAmount, currency]);

  const currentMinInActive = useMemo(() => convertGbpAmount(currentPlan?.min_amount || 500, currency), [currentPlan, currency]);
  const currentMaxInActive = useMemo(() => convertGbpAmount(currentPlan?.max_amount || 4999, currency), [currentPlan, currency]);
  const globalMinInActive = useMemo(() => convertGbpAmount(500, currency), [currency]);
  const globalMaxInActive = useMemo(() => convertGbpAmount(500000, currency), [currency]);

  const accuratePlanForAmount = useMemo(() => {
    if (!amount || amount <= 0) return null;
    return plans.find((p) => {
      const pMin = convertGbpAmount(p.min_amount, currency);
      const pMax = convertGbpAmount(p.max_amount, currency);
      return amount >= pMin && amount <= pMax;
    }) || null;
  }, [amount, plans, currency]);

  const nextTierPlan = useMemo(() => {
    if (!currentPlan) return null;
    if (amount <= currentMaxInActive) return null;
    if (accuratePlanForAmount && accuratePlanForAmount.id !== currentPlan.id) {
      return accuratePlanForAmount;
    }
    const sorted = [...plans].sort((a, b) => a.min_amount - b.min_amount);
    const currentIndex = sorted.findIndex((p) => p.id === currentPlan.id);
    return currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;
  }, [amount, currentPlan, accuratePlanForAmount, plans, currentMaxInActive]);

  const formattedMaturityDate = useMemo(() => {
    if (!currentPlan) return '';
    const date = new Date();
    date.setDate(date.getDate() + currentPlan.duration_days);
    const locale =
      language === 'de' ? 'de-DE' : language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-GB';
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [currentPlan, language]);

  if (!isOpen) return null;

  const isGlobalValidAmount = amount >= globalMinInActive && amount <= globalMaxInActive;
  const isBelowMin = currentPlan ? amount < currentMinInActive : false;
  const isAboveMax = currentPlan ? amount > currentMaxInActive : false;
  const isExceedingMillion = amount > globalMaxInActive;
  const hasSufficientFunds = mainBalanceInActive >= amount;

  // Calculate the exact shortfall needed to fund this investment
  const shortfallAmount = Math.max(0, Math.ceil(amount - mainBalanceInActive));

  const expectedProfit = (currentPlan && isGlobalValidAmount && !isBelowMin && !isAboveMax)
    ? Math.round(amount * (currentPlan.roi_percentage / 100) * 100) / 100
    : 0;
  const totalPayout = Math.round((amount + expectedProfit) * 100) / 100;

  const adminEmail = settings?.adminEmail || 'compliance@birdgrow.eu';

  const handlePlanChange = (newPlanId: string) => {
    setActivePlanId(newPlanId);
    const p = plans.find((x) => x.id === newPlanId);
    if (p) {
      const pMinInActive = convertGbpAmount(p.min_amount, currency);
      const pMaxInActive = convertGbpAmount(p.max_amount, currency);
      if (amount < pMinInActive || amount > pMaxInActive) {
        setAmount(pMinInActive);
      }
    }
    setFeedback(null);
  };

  const handleSwitchToAccuratePlan = (planId: string) => {
    setActivePlanId(planId);
    setFeedback(null);
  };

  const handleInvestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (isBelowMin) {
      setFeedback({
        type: 'error',
        message: `Allocation rejected: Minimum entry for ${currentPlan.title} is ${formatRawCurrency(currentMinInActive, currency, false, language)}.`,
      });
      return;
    }

    if (isAboveMax) {
      setFeedback({
        type: 'error',
        message: `Allocation rejected: Maximum tranche for ${currentPlan.title} is ${formatRawCurrency(currentMaxInActive, currency, false, language)}. Please switch to a higher tier plan.`,
      });
      return;
    }

    if (!hasSufficientFunds) {
      setFeedback({
        type: 'error',
        message: `Insufficient wallet balance. You need an additional ${formatRawCurrency(shortfallAmount, currency, false, language)} to execute this plan.`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const res = await executeInvestment(currentPlan.id, amount, true);

      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message || 'Capital allocation executed and locked successfully.',
        });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: res.message || 'Investment failed' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Execution error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col border border-[#E5E3D8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#11271D] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-[#11271D] flex items-center justify-center font-bold shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white">{t.invTitle || 'Allocate Investment Capital'}</div>
              <div className="text-[11px] sm:text-xs text-white/75">{t.invSubtitle || 'Lock funds into verified European poultry production cycles'}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleInvestSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Plan Picker */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1B3B2B]">
                {t.invSelectTier || 'Select Investment Tier'}
              </label>
              {accuratePlanForAmount && accuratePlanForAmount.id !== currentPlan.id && (
                <span className="text-[11px] text-[#C5A059] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Amount matches {accuratePlanForAmount.title}</span>
                </span>
              )}
            </div>

            <select
              value={currentPlan.id}
              aria-label="Select Investment Tier"
              onChange={(e) => handlePlanChange(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs sm:text-sm font-semibold text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
            >
              {plans
                .filter((p) => p.status === 'active')
                .map((plan) => {
                  const isMatching = accuratePlanForAmount?.id === plan.id;
                  const pMin = convertGbpAmount(plan.min_amount, currency);
                  const pMax = convertGbpAmount(plan.max_amount, currency);
                  return (
                    <option key={plan.id} value={plan.id}>
                      {isMatching ? '★ [BEST FIT] ' : ''}
                      {plan.title} ({plan.duration_days}d · +{plan.roi_percentage.toFixed(0)}% ROI · {formatRawCurrency(pMin, currency, false, language)} - {formatRawCurrency(pMax, currency, false, language)})
                    </option>
                  );
                })}
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1B3B2B]">
                {t.invAmountLabel || 'Allocation Amount'} ({currencySymbol})
              </label>
              <span className="text-[11px] font-mono text-[#5C6572]">
                Min: <strong className="text-[#1B3B2B] font-semibold">{formatRawCurrency(currentMinInActive, currency, false, language)}</strong> · Max: {formatRawCurrency(currentMaxInActive, currency, false, language)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-[#5C6572]">{currencySymbol}</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={amount === 0 ? '' : amount}
                placeholder="Enter investment amount"
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  const stripped = raw.replace(/^0+/, '');
                  if (stripped === '') {
                    setAmount(0);
                    setFeedback(null);
                    return;
                  }
                  const val = parseInt(stripped, 10);
                  if (val >= 1) {
                    setAmount(val);
                    setFeedback(null);
                  }
                }}
                className={`w-full min-h-[44px] pl-8 pr-4 py-2.5 bg-[#F7F6F2] border rounded-xl text-base sm:text-lg font-bold font-mono text-[#1B3B2B] focus:outline-none tabular-nums ${
                  isBelowMin || isAboveMax
                    ? 'border-amber-400 bg-amber-50/20'
                    : 'border-[#DCDAD0] focus:border-[#1B3B2B]'
                }`}
              />
            </div>

            {isExceedingMillion && (
              <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Notice:</strong> Allocations exceeding <strong>{formatRawCurrency(globalMaxInActive, currency, false, language)}</strong> require bespoke approval. Contact <strong className="underline text-[#11271D]">{adminEmail}</strong>.
                </div>
              </div>
            )}

            {isAboveMax && nextTierPlan && (
              <div className="mt-2.5 p-3.5 bg-[#11271D] text-white rounded-xl border-2 border-[#C5A059] shadow-sm space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#C5A059]">
                    <Sparkles className="w-4 h-4" />
                    <span>Upgrade to Next Tier Plan</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed">
                    Entered amount qualifies for <strong>{nextTierPlan.title}</strong> (+{nextTierPlan.roi_percentage}% ROI):
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSwitchToAccuratePlan(nextTierPlan.id)}
                  className="w-full min-h-[44px] py-2 px-3 bg-[#C5A059] hover:bg-[#B38F46] text-[#11271D] font-extrabold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Switch to {nextTierPlan.title} Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-[#5C6572] mr-1">Quick Set:</span>
            <button
              type="button"
              onClick={() => setAmount(currentMinInActive)}
              className="min-h-[36px] px-2.5 py-1 text-xs rounded-lg bg-[#F0EFEA] hover:bg-[#E5E3D8] text-[#1B3B2B] font-mono font-medium transition-colors cursor-pointer flex items-center"
            >
              Min ({formatRawCurrency(currentMinInActive, currency, false, language)})
            </button>
            <button
              type="button"
              onClick={() => setAmount(Math.round(currentMinInActive * 1.5))}
              className="min-h-[36px] px-2.5 py-1 text-xs rounded-lg bg-[#F0EFEA] hover:bg-[#E5E3D8] text-[#1B3B2B] font-mono font-medium transition-colors cursor-pointer flex items-center"
            >
              {formatRawCurrency(Math.round(currentMinInActive * 1.5), currency, false, language)}
            </button>
            <button
              type="button"
              onClick={() => setAmount(Math.min(currentMaxInActive, currentMinInActive * 2))}
              className="min-h-[36px] px-2.5 py-1 text-xs rounded-lg bg-[#F0EFEA] hover:bg-[#E5E3D8] text-[#1B3B2B] font-mono font-medium transition-colors cursor-pointer flex items-center"
            >
              {formatRawCurrency(Math.min(currentMaxInActive, currentMinInActive * 2), currency, false, language)}
            </button>
          </div>

          {/* Wallet Balance & Direct Deficit Deposit Top-Up */}
          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E3D8] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#5C6572] block">{t.invAvailableWallet || 'Available Wallet Balance'}:</span>
              <span
                className={`font-mono font-bold text-sm tabular-nums ${
                  hasSufficientFunds ? 'text-[#1B3B2B]' : 'text-red-600'
                }`}
              >
                {formatRawCurrency(mainBalanceInActive, currency, true, language)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!hasSufficientFunds && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    // AUTO-LOAD DEPOSIT MODAL PREFILLED WITH THE EXACT SHORTFALL!
                    onOpenDeposit(shortfallAmount);
                  }}
                  className="min-h-[36px] px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Deposit Deficit ({currencySymbol}{shortfallAmount.toLocaleString()})</span>
                </button>
              )}
            </div>
          </div>

          {/* Expected Return Summary */}
          <div className="bg-[#11271D] text-white p-4 rounded-xl space-y-2.5 border-2 border-[#C5A059]/60 shadow-md">
            <div className="text-[11px] uppercase tracking-wider text-[#C5A059] font-bold">
              {t.invContractSummary || 'Contractual Yield Summary'} ({currentPlan.duration_days} {t.heroDays || 'Days'})
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/70 block">{t.invPrincipalLocked || 'Principal Locked'}:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {formatRawCurrency(amount, currency, false, language)}
                </span>
              </div>
              <div>
                <span className="text-white/70 block">{t.invExpectedRoi || 'Net Expected ROI'} (+{currentPlan.roi_percentage}%):</span>
                {isGlobalValidAmount && !isBelowMin && !isAboveMax ? (
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    +{formatRawCurrency(expectedProfit, currency, false, language)}
                  </span>
                ) : (
                  <span className="font-mono font-bold text-white/40 text-sm">—</span>
                )}
              </div>
            </div>
            <div className="pt-2.5 pb-2 px-3 rounded-lg bg-white/10 border border-white/15 space-y-2">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-white block">
                    {t.calcTotalPayoutLabel || 'Total Payout'}:
                  </span>
                  <span className="text-[10px] text-white/70 font-medium">
                    {t.calcCapPlusProfit || 'Combination of Capital + Profit'}
                  </span>
                </div>
                {isGlobalValidAmount && !isBelowMin && !isAboveMax ? (
                  <div className="text-right">
                    <span className="font-mono font-black text-[#C5A059] text-lg sm:text-xl tabular-nums block">
                      {formatRawCurrency(totalPayout, currency, false, language)}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300">
                      ({formatRawCurrency(amount, currency, false, language)} + {formatRawCurrency(expectedProfit, currency, false, language)})
                    </span>
                  </div>
                ) : (
                  <span className="font-mono font-bold text-white/40 text-lg sm:text-xl tabular-nums">—</span>
                )}
              </div>
              {formattedMaturityDate && (
                <div className="pt-1.5 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-emerald-400 font-bold uppercase text-[10px] sm:text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {t.calcPaymentDropDate || 'Payment Drop Date'}:
                  </span>
                  <span className="font-mono font-extrabold text-white text-[11px] sm:text-xs">
                    {isGlobalValidAmount && !isBelowMin && !isAboveMax ? formattedMaturityDate : '—'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Insufficient Balance Notice With 1-Click Top-Up */}
          {!hasSufficientFunds && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start justify-between gap-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>{t.invInsufficientBalance || 'Insufficient balance'}:</strong> Short by{' '}
                  <strong>{currencySymbol}{shortfallAmount.toLocaleString()}</strong>.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDeposit(shortfallAmount);
                }}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shrink-0 text-[11px] cursor-pointer"
              >
                Top-Up Now
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isGlobalValidAmount || isBelowMin || isAboveMax || !hasSufficientFunds}
            className="w-full min-h-[44px] py-3.5 bg-[#1B3B2B] hover:bg-[#11271D] disabled:bg-red-950/20 disabled:text-red-800 disabled:border disabled:border-red-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
          >
            {isSubmitting
              ? (t.invLockingBtn || 'Locking Contract Capital...')
              : !hasSufficientFunds
              ? `Insufficient Balance (Short by ${currencySymbol}${shortfallAmount.toLocaleString()})`
              : !isGlobalValidAmount
              ? (isBelowMin ? `Minimum Allocation is ${formatRawCurrency(currentMinInActive, currency, false, language)}` : `Maximum Allocation is ${formatRawCurrency(globalMaxInActive, currency, false, language)}`)
              : `${t.invExecuteBtn || 'Execute Allocation of'} ${formatRawCurrency(amount, currency, false, language)}`}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="text-[11px] text-[#6E7B74] flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
            <span>Underwritten by forward off-take supermarket delivery contracts</span>
          </div>

        </form>

      </div>
    </div>
  );
};