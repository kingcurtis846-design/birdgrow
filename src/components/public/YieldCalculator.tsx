import React, { useState, useMemo, useEffect, useRef } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { convertGbpAmount, convertToGbp, formatRawCurrency } from '../../lib/formatters';
import { ArrowRight, ShieldCheck, AlertCircle, Sparkles, CheckCircle2, Calendar } from 'lucide-react';

interface YieldCalculatorProps {
  onSelectTierToInvest?: (planId: string, amount: number) => void;
  onOpenAuth?: () => void;
  selectedPlanId?: string;
  onSelectPlanId?: (id: string) => void;
}

interface TierOption {
  planId: string;
  name: string;
  durationDays: number;
  roiPct: number;
  minAmount: number;
  maxAmount: number;
  riskRating: string;
}

// 4 European Tiers matching the Yield Horizons names and parameters (in base GBP)
const DEFAULT_TIERS: TierOption[] = [
  {
    planId: 'plan-15d-50pct',
    name: 'Starter Plan',
    durationDays: 15,
    roiPct: 50.0,
    minAmount: 500,
    maxAmount: 4999,
    riskRating: 'A+',
  },
  {
    planId: 'plan-21d-84pct',
    name: 'Growth Plan',
    durationDays: 21,
    roiPct: 84.0,
    minAmount: 5000,
    maxAmount: 24999,
    riskRating: 'A',
  },
  {
    planId: 'plan-30d-150pct',
    name: 'Commercial Plan',
    durationDays: 30,
    roiPct: 150.0,
    minAmount: 25000,
    maxAmount: 99999,
    riskRating: 'A+',
  },
  {
    planId: 'plan-60d-320pct',
    name: 'Enterprise Plan',
    durationDays: 60,
    roiPct: 320.0,
    minAmount: 100000,
    maxAmount: 500000,
    riskRating: 'AAA',
  },
];

export const YieldCalculator: React.FC<YieldCalculatorProps> = ({
  onSelectTierToInvest,
  onOpenAuth,
  selectedPlanId: propSelectedPlanId,
  onSelectPlanId,
}) => {
  const { plans, language, settings, currency, currencySymbol, t } = usePlatform();
  const [internalSelectedPlanId, setInternalSelectedPlanId] = useState<string>('plan-21d-84pct');

  // Amount is held in the ACTIVE CURRENCY (the exact currency symbol shown to the user)
  const [amount, setAmount] = useState<number>(() => convertGbpAmount(5000, currency));
  const prevCurrencyRef = useRef(currency);

  // Sync tiers from context plans so names always match the yield horizons exactly
  const tiers: TierOption[] = useMemo(() => {
    if (plans && plans.length >= 4) {
      return plans
        .filter((p) => p.status === 'active')
        .sort((a, b) => a.duration_days - b.duration_days)
        .map((p) => ({
          planId: p.id,
          name: p.title,
          durationDays: p.duration_days,
          roiPct: p.roi_percentage,
          minAmount: p.min_amount,
          maxAmount: p.max_amount,
          riskRating: p.risk_rating,
        }));
    }
    return DEFAULT_TIERS;
  }, [plans]);

  // When currency changes in the navbar, adapt the current input amount to the new currency
  useEffect(() => {
    if (prevCurrencyRef.current !== currency) {
      const prevCurr = prevCurrencyRef.current;
      prevCurrencyRef.current = currency;
      setAmount((currAmount) => {
        if (currAmount <= 0) return 0;
        const inGbp = convertToGbp(currAmount, prevCurr);
        return convertGbpAmount(inGbp, currency);
      });
    }
  }, [currency]);

  // Qualification limits in the ACTIVE CURRENCY:
  // Base rule: amounts below 500 Euros (€500) do not qualify.
  // In USD (1.09): 500 * 1.09 = $545 minimum qualifying.
  // In EUR: €500 minimum qualifying.
  // In GBP (0.85): 500 * 0.85 = £425 minimum qualifying.
  const minQualifyingInActive = useMemo(() => convertGbpAmount(500, currency), [currency]);
  const maxQualifyingInActive = useMemo(() => convertGbpAmount(500000, currency), [currency]);

  // Amount is entered in the active currency directly.
  // Compare against minQualifyingInActive ($545 in USD, €500 in EUR, £425 in GBP)
  const isValidAmount = amount >= minQualifyingInActive && amount <= maxQualifyingInActive;
  const isBelowMin = amount < minQualifyingInActive;
  const isAboveMax = amount > maxQualifyingInActive;

  const selectedPlanId = propSelectedPlanId || internalSelectedPlanId;

  // Sync when propSelectedPlanId changes (e.g. user selected from Yield Horizons section)
  useEffect(() => {
    if (propSelectedPlanId) {
      setInternalSelectedPlanId(propSelectedPlanId);
      const targetTier = tiers.find((t) => t.planId === propSelectedPlanId);
      if (targetTier) {
        const tierMinInActive = convertGbpAmount(targetTier.minAmount, currency);
        const tierMaxInActive = convertGbpAmount(targetTier.maxAmount, currency);
        if (amount < tierMinInActive || amount > tierMaxInActive) {
          setAmount(tierMinInActive);
        }
      }
    }
  }, [propSelectedPlanId, tiers, currency]);

  // Match tier based on active currency limits
  const matchingTierForAmount = useMemo(() => {
    if (!isValidAmount) return null;
    return tiers.find((t) => {
      const tMin = convertGbpAmount(t.minAmount, currency);
      const tMax = convertGbpAmount(t.maxAmount, currency);
      return amount >= tMin && amount <= tMax;
    }) || null;
  }, [amount, tiers, isValidAmount, currency]);

  // The effectively active and highlighted tier
  const activeTier = (isValidAmount && matchingTierForAmount)
    ? matchingTierForAmount
    : tiers.find((t) => t.planId === selectedPlanId) || tiers[1];

  const highlightedPlanId = isValidAmount ? activeTier.planId : null;

  const adminEmail = settings?.adminEmail || 'foodcriticdan@gmail.com';

  const handleSelectPlan = (tier: TierOption) => {
    if (onSelectPlanId) {
      onSelectPlanId(tier.planId);
    }
    setInternalSelectedPlanId(tier.planId);

    const tierMinInActive = convertGbpAmount(tier.minAmount, currency);
    const tierMaxInActive = convertGbpAmount(tier.maxAmount, currency);

    // Set amount to this tier's minimum in active currency if outside range
    if (amount < tierMinInActive || amount > tierMaxInActive) {
      setAmount(tierMinInActive);
    }
  };

  const calculation = useMemo(() => {
    if (!isValidAmount) {
      return {
        netProfit: 0,
        totalPayout: 0,
        annualizedRoi: '0',
        maturityDate: new Date(),
        formattedMaturityDate: '—',
      };
    }

    // Profit calculated on the active currency amount directly
    const netProfit = Math.round(amount * (activeTier.roiPct / 100) * 100) / 100;
    const totalPayout = Math.round((amount + netProfit) * 100) / 100;
    const annualizedRoi = (activeTier.roiPct * (365 / activeTier.durationDays)).toFixed(1);

    const maturityDate = new Date();
    maturityDate.setDate(maturityDate.getDate() + activeTier.durationDays);

    const locale =
      language === 'de' ? 'de-DE' : language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-GB';

    const formattedMaturityDate = maturityDate.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      netProfit,
      totalPayout,
      annualizedRoi,
      maturityDate,
      formattedMaturityDate,
    };
  }, [amount, activeTier, language, isValidAmount]);

  // Quick Presets in active currency
  const presets = useMemo(() => [
    { label: t.calcStarterMinPreset || 'Starter Min', val: convertGbpAmount(500, currency) },
    { label: t.calcGrowthTierPreset || 'Growth Tier', val: convertGbpAmount(5000, currency) },
    { label: t.calcCommercialTierPreset || 'Commercial Tier', val: convertGbpAmount(24999, currency) },
    { label: `${t.calcEnterprisePreset || 'Enterprise'} ${formatRawCurrency(convertGbpAmount(100000, currency), currency, false, language)}`, val: convertGbpAmount(100000, currency) },
    { label: `Macro ${formatRawCurrency(convertGbpAmount(165000, currency), currency, false, language)}`, val: convertGbpAmount(165000, currency) },
    { label: t.calcMaxSovereignPreset || 'Max Sovereign', val: convertGbpAmount(500000, currency) },
  ], [currency, language, t]);

  return (
    <section id="calculator" className="py-24 bg-[#F7F6F2] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.calcSubtitle || 'Interactive Return Simulation'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B3B2B] tracking-tight">
            {t.calcTitle || 'Agricultural Return & Maturation Engine'}
          </h2>
          <p className="text-base text-[#5C6572]">
            {t.calcDesc || 'Calculate your contractual harvest ROI across all 4 European production horizons.'}
            {' '}Qualifying allocations start from <strong className="text-[#1B3B2B]">{formatRawCurrency(minQualifyingInActive, currency, false, language)}</strong>{currency !== 'GBP' ? ` (the equivalent of £500)` : ''} up to <strong className="text-[#1B3B2B]">{formatRawCurrency(maxQualifyingInActive, currency, false, language)}</strong>.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-sm overflow-hidden p-5 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Left Column: Sliders & Controls */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Plan Presets (All 4 Production Horizon Tiers) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#1B3B2B] block">
                    {t.calcSelectHorizon || 'Select Production Horizon'}
                  </label>
                  {isValidAmount && matchingTierForAmount && (
                    <span className="text-[11px] font-bold text-[#1B3B2B] bg-[#EAE8E0] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#C5A059]" />
                      <span>{t.calcInputAmountTier || 'Input Amount Tier'}: <strong className="text-[#16A34A]">{matchingTierForAmount.name} ({matchingTierForAmount.durationDays}d)</strong></span>
                    </span>
                  )}
                  {isBelowMin && (
                    <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                      Does Not Qualify (Below {formatRawCurrency(minQualifyingInActive, currency, false, language)}{currency !== 'GBP' ? ' / £500' : ''})
                    </span>
                  )}
                  {isAboveMax && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Exceeds {formatRawCurrency(maxQualifyingInActive, currency, false, language)} Limit
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {tiers.map((tier) => {
                    const isHighlighted = highlightedPlanId === tier.planId;
                    const isEnterprise = tier.durationDays === 60;
                    const tierMin = convertGbpAmount(tier.minAmount, currency);
                    const tierMax = convertGbpAmount(tier.maxAmount, currency);

                    return (
                      <button
                        key={tier.planId}
                        type="button"
                        onClick={() => handleSelectPlan(tier)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                          isHighlighted
                            ? 'border-2 border-[#1B3B2B] bg-[#1B3B2B] text-white shadow-md ring-2 ring-[#C5A059]'
                            : isEnterprise
                            ? 'border-[#C5A059] bg-[#FAF9F5] text-[#1B3B2B] hover:border-[#1B3B2B]'
                            : 'border-[#E5E3D8] bg-[#F7F6F2] text-[#2D3748] hover:border-[#B8B4A8]'
                        }`}
                      >
                        {/* Highlighting Tag for active / matching tier */}
                        {isHighlighted ? (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-wider bg-[#C5A059] text-[#11271D] px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap z-10 flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>{t.calcActiveTier}</span>
                          </span>
                        ) : isEnterprise ? (
                          <span className="absolute -top-2 right-2 text-[9px] font-bold bg-[#C5A059] text-[#11271D] px-1.5 py-0.2 rounded-full shadow-2xs">
                            {t.calcTopTier}
                          </span>
                        ) : null}

                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isHighlighted ? 'text-[#C5A059]' : 'text-[#1B3B2B]'}`}>
                            {tier.durationDays} {t.heroDays}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              isHighlighted ? 'bg-white/20 text-white' : 'bg-white text-[#5C6572]'
                            }`}
                          >
                            {tier.riskRating}
                          </span>
                        </div>

                        {/* Name matches yield horizons */}
                        <div className="text-xs font-bold mt-1 truncate">{tier.name}</div>

                        <div
                          className={`text-sm font-extrabold tabular-nums mt-1 font-mono ${
                            isHighlighted ? 'text-[#F7F6F2]' : 'text-[#16A34A]'
                          }`}
                        >
                          +{tier.roiPct.toFixed(0)}% ROI
                        </div>

                        <div
                          className={`text-[10px] mt-1 font-mono ${
                            isHighlighted ? 'text-[#D8DFD9]' : 'text-[#5C6572]'
                          }`}
                        >
                          {formatRawCurrency(tierMin, currency, false, language)} – {formatRawCurrency(tierMax, currency, false, language)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Input & Slider */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#1B3B2B]">
                    {t.calcCapitalAmount} ({currency})
                  </label>
                  <span className="text-xs font-mono text-[#5C6572]">
                    {t.calcValidRangeLabel}: <strong className="text-[#1B3B2B]">{formatRawCurrency(minQualifyingInActive, currency, false, language)} – {formatRawCurrency(maxQualifyingInActive, currency, false, language)}</strong>
                    {currency !== 'GBP' && <span className="text-[11px] text-[#8C827A] ml-1">(£500 – £1,000,000 equivalent)</span>}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[#5C6572]">{currencySymbol}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={amount === 0 ? '' : amount.toLocaleString()}
                    placeholder={`${t.calcEnterAmount} (${formatRawCurrency(minQualifyingInActive, currency, false, language)} – ${formatRawCurrency(maxQualifyingInActive, currency, false, language)})`}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      const stripped = raw.replace(/^0+/, '');
                      if (stripped === '') {
                        setAmount(0);
                        return;
                      }
                      const val = parseInt(stripped, 10);
                      if (val >= 0) {
                        setAmount(val);
                      }
                    }}
                    className={`w-full pl-9 pr-4 py-3 bg-[#F7F6F2] border rounded-xl text-xl sm:text-2xl font-bold font-mono text-[#1B3B2B] focus:outline-none tabular-nums ${
                      !isValidAmount
                        ? 'border-red-400 bg-red-50/20 text-red-900 focus:border-red-500'
                        : 'border-[#DCDAD0] focus:border-[#1B3B2B]'
                    }`}
                  />
                </div>

                {/* Validation Warnings: Clearly explain why input does not qualify */}
                {isBelowMin && (
                  <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 flex items-start gap-2.5 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="block text-red-900 font-bold mb-0.5">
                        Allocation does not qualify:
                      </strong>
                      Minimum qualifying entry is <strong className="font-mono text-red-950 font-bold">{formatRawCurrency(minQualifyingInActive, currency, false, language)}</strong>
                      {currency !== 'EUR' ? ` (the equivalent of €500 Euros)` : ''}.
                      {' '}Your entered amount of <strong className="font-mono text-red-950 font-bold">{formatRawCurrency(amount, currency, false, language)}</strong> is below the threshold and cannot be accepted for agricultural production cycles.
                    </div>
                  </div>
                )}

                {isAboveMax && (
                  <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 flex items-start gap-2.5 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong>Maximum single allocation exceeded ({formatRawCurrency(maxQualifyingInActive, currency, false, language)}):</strong> {t.calcContactDesk}{' '}
                    </div>
                  </div>
                )}

                {/* Range slider */}
                <input
                  type="range"
                  min={minQualifyingInActive}
                  max={maxQualifyingInActive}
                  step={amount >= convertGbpAmount(100000, currency) ? 10000 : amount >= convertGbpAmount(25000, currency) ? 2500 : 500}
                  value={Math.min(maxQualifyingInActive, Math.max(minQualifyingInActive, amount))}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-[#DCDAD0] rounded-lg appearance-none cursor-pointer accent-[#1B3B2B]"
                />

                {/* Quick Presets across all horizons in active currency */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setAmount(preset.val)}
                      className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border font-mono transition-colors cursor-pointer min-h-[36px] ${
                        amount === preset.val
                          ? 'bg-[#1B3B2B] text-white border-[#1B3B2B]'
                          : 'bg-[#F7F6F2] text-[#5C6572] border-[#DCDAD0] hover:border-[#1B3B2B]'
                      }`}
                    >
                      {formatRawCurrency(preset.val, currency, false, language)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Projected Return Card */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#11271D] text-white p-5 sm:p-7 md:p-8 rounded-2xl shadow-xl border border-[#C5A059]/40 relative overflow-hidden">
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <div className="text-xs uppercase font-semibold tracking-wider text-[#C5A059] flex items-center justify-between">
                    <span>{t.calcForecastReturns}</span>
                    {isValidAmount ? (
                      <span className="font-mono text-emerald-400 font-extrabold">+{activeTier.roiPct}% ROI</span>
                    ) : (
                      <span className="font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-[11px] font-bold">
                        {isBelowMin ? 'Does Not Qualify' : t.calcAmountOutsideRange}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {isValidAmount ? activeTier.name : isBelowMin ? 'Allocation Below Qualification Minimum' : t.calcNoPotentialRoi}
                  </h3>
                  <div className="text-xs text-white/75 mt-0.5">
                    {isValidAmount
                      ? `${t.calcCycleLengthLabel}: ${activeTier.durationDays} ${t.heroDays} · ${t.calcFixedPayoutLabel}`
                      : `${t.calcValidRangeLabel}: ${formatRawCurrency(minQualifyingInActive, currency, false, language)} – ${formatRawCurrency(maxQualifyingInActive, currency, false, language)}`}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/10">
                  {/* PRINCIPAL CAPITAL: Shows the EXACT amount entered by the user in the active currency */}
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-white/70">{t.calcPrincipalCapital}:</span>
                    <span className="text-sm font-mono font-bold text-white tabular-nums">
                      {amount > 0 ? formatRawCurrency(amount, currency, false, language) : formatRawCurrency(0, currency, false, language)}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-emerald-300 font-medium">{t.calcNetProfitLabel}:</span>
                    {isValidAmount ? (
                      <span className="text-lg sm:text-xl font-mono font-extrabold text-emerald-400 tabular-nums">
                        +{formatRawCurrency(calculation.netProfit, currency, false, language)}
                      </span>
                    ) : (
                      <span className="text-lg sm:text-xl font-mono font-bold text-white/40 tabular-nums">
                        —
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-white/70">{t.calcAnnualizedRate}:</span>
                    {isValidAmount ? (
                      <span className="text-xs font-mono font-semibold text-white/90">
                        {calculation.annualizedRoi}% APR
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-semibold text-white/40">
                        —
                      </span>
                    )}
                  </div>

                  {/* BOLD TOTAL MATURITY WALLET (ONLY SHOWN FOR VALID AMOUNTS) */}
                  <div className={`pt-3 pb-3 px-3 sm:px-4 -mx-1 sm:-mx-2 rounded-xl border-2 space-y-2 mt-2 transition-colors ${
                    isValidAmount
                      ? 'bg-white/10 border-[#C5A059] shadow-inner'
                      : 'bg-white/5 border-white/10 opacity-70'
                  }`}>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-white block">
                          {t.calcTotalPayoutLabel}:
                        </span>
                        <span className="text-[10px] text-white/70 font-medium">
                          {t.calcCapPlusProfit}
                        </span>
                      </div>
                      {isValidAmount ? (
                        <div className="text-right">
                          <span className="text-xl sm:text-3xl font-mono font-black text-[#C5A059] tabular-nums drop-shadow-sm block">
                            {formatRawCurrency(calculation.totalPayout, currency, false, language)}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-mono text-emerald-300">
                            ({formatRawCurrency(amount, currency, false, language)} + {formatRawCurrency(calculation.netProfit, currency, false, language)})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl sm:text-3xl font-mono font-bold text-white/40 tabular-nums">
                          —
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isValidAmount ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`}></span>
                        {t.calcPaymentDropDate}:
                      </span>
                      <span className="text-xs sm:text-sm font-black font-mono text-white flex items-center gap-1 sm:justify-end">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                        {isValidAmount ? calculation.formattedMaturityDate : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {isValidAmount ? (
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] text-white/80 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span>
                      {t.calcCompletionNotice}
                    </span>
                  </div>
                ) : isBelowMin ? (
                  <div className="p-3.5 bg-red-500/10 rounded-xl border border-red-500/30 text-xs text-red-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="text-white block font-semibold mb-0.5">Allocation Does Not Qualify ({currencySymbol}{amount.toLocaleString()})</strong>
                      Minimum qualifying allocation is <strong className="text-[#C5A059] font-mono font-bold">{formatRawCurrency(minQualifyingInActive, currency, false, language)}</strong>
                      {currency !== 'EUR' ? ` (the equivalent of €500 Euros)` : ''}.
                      {' '}Your input of <span className="font-mono font-bold text-red-300">{formatRawCurrency(amount, currency, false, language)}</span> does not qualify and generates no contractual ROI.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      {`${t.calcMaxAllocationIs} ${formatRawCurrency(maxQualifyingInActive, currency, false, language)}.`}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button: Disabled when invalid */}
              <div className="pt-6">
                <button
                  type="button"
                  disabled={!isValidAmount}
                  onClick={() => {
                    if (isValidAmount && onSelectTierToInvest) {
                      onSelectTierToInvest(activeTier.planId, amount);
                    }
                  }}
                  className={`w-full min-h-[48px] py-3.5 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                    isValidAmount
                      ? 'bg-[#C5A059] hover:bg-[#B38F46] text-[#11271D] cursor-pointer active:scale-98'
                      : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10 shadow-none'
                  }`}
                >
                  <span>
                    {isValidAmount
                      ? `${t.calcLockAllocation} ${activeTier.name} (${formatRawCurrency(amount, currency, false, language)})`
                      : isBelowMin
                      ? `Minimum Allocation is ${formatRawCurrency(minQualifyingInActive, currency, false, language)}${currency !== 'GBP' ? ' (£500 equivalent)' : ''} · ${formatRawCurrency(amount, currency, false, language)} Does Not Qualify`
                      : `${t.calcMaxAllocationIs} ${formatRawCurrency(maxQualifyingInActive, currency, false, language)}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

