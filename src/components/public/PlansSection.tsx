import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { formatCurrency } from '../../lib/formatters';
import { Check, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { InvestmentPlan } from '../../types';

interface PlansSectionProps {
  onSelectPlan: (plan: InvestmentPlan) => void;
  selectedPlanId?: string;
}

export const PlansSection: React.FC<PlansSectionProps> = ({ onSelectPlan, selectedPlanId }) => {
  const { plans, currency, language, t } = usePlatform();

  const activePlans = plans.filter((p) => p.status === 'active');

  const handleCardClick = (plan: InvestmentPlan) => {
    onSelectPlan(plan);
  };

  return (
    <section id="plans" className="py-24 bg-white border-b border-[#E5E3D8] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.plansSubtitle || 'European Agricultural Production Tiers'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B3B2B] tracking-tight">
            {t.plansTitle || 'Transparent Agricultural Yield Horizons'}
          </h2>
          <p className="text-base text-[#5C6572]">
            {t.plansDesc || 'Select from our 4 bio-secure cycles. Contractual returns are backed by forward off-take delivery agreements with certified European supermarket chains.'}
          </p>
        </div>

        {/* 4-Tier Grid: 1 col on small phones, 2 on tablet/large mobile, 4 on desktop */}
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {activePlans.map((plan) => {
            const isEnterprise = plan.duration_days === 60;
            const isGrowth = plan.duration_days === 21;
            const isSelected = selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => handleCardClick(plan)}
                className={`rounded-2xl flex flex-col justify-between transition-all duration-300 relative cursor-pointer ${
                  isSelected
                    ? 'border-3 border-[#C5A059] ring-2 sm:ring-4 ring-[#C5A059]/40 shadow-xl scale-[1.01] sm:scale-[1.02] bg-[#FAF9F5]'
                    : isGrowth
                    ? 'border-2 border-[#C5A059] bg-[#FAF9F5] text-[#1B3B2B] shadow-md hover:border-[#C5A059] hover:shadow-lg'
                    : isEnterprise
                    ? 'border-2 border-[#C5A059] bg-[#11271D] text-white shadow-xl hover:shadow-2xl hover:scale-[1.01]'
                    : 'border border-[#E5E3D8] bg-white text-[#1B3B2B] hover:border-[#1B3B2B] shadow-xs hover:shadow-md'
                }`}
              >
                {/* Active Selection / Popular / Enterprise Badge */}
                {isSelected ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C5A059] text-[#11271D] text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3.5 py-0.5 rounded-full shadow-md flex items-center gap-1 z-10 whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#11271D]" />
                    <span>{t.plansSelected || 'Selected'}</span>
                  </div>
                ) : isGrowth ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-[#C5A059] to-amber-600 text-[#11271D] text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3.5 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1 border border-amber-300/80 z-10">
                    <span>🔥 {t.plansMostPopular || 'Most Popular'}</span>
                  </div>
                ) : isEnterprise ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C5A059] text-[#11271D] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 sm:px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                    👑 {t.plansSovereign || 'Sovereign'}
                  </div>
                ) : null}

                <div className="p-4 sm:p-6 space-y-3 sm:space-y-5">
                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                      <span className={isEnterprise && !isSelected ? 'text-white/70' : 'text-[#5C6572]'}>
                        {t.plansRating}: <strong className={`font-mono ${isEnterprise && !isSelected ? 'text-white' : 'text-[#1B3B2B]'}`}>{plan.risk_rating}</strong>
                      </span>
                      <span className={`font-mono font-semibold ${isEnterprise && !isSelected ? 'text-emerald-400' : 'text-[#16A34A]'}`}>
                        ESG {plan.esg_score}
                      </span>
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold leading-tight ${isEnterprise && !isSelected ? 'text-white' : 'text-[#1B3B2B]'}`}>
                      {plan.title}
                    </h3>
                    <p className={`text-xs mt-1 sm:mt-1.5 line-clamp-2 leading-relaxed ${isEnterprise && !isSelected ? 'text-white/80' : 'text-[#5C6572]'}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Return Highlight Box */}
                  <div
                    className={`p-3 sm:p-4 rounded-xl space-y-1 border transition-colors ${
                      isSelected
                        ? 'bg-[#1B3B2B] text-white border-[#1B3B2B]'
                        : isEnterprise
                        ? 'bg-white/10 border-white/20'
                        : isGrowth
                        ? 'bg-[#1B3B2B]/5 border-[#C5A059]/40'
                        : 'bg-white border-[#E5E3D8]'
                    }`}
                  >
                    <div className={`text-[10px] uppercase font-semibold ${isSelected || isEnterprise ? 'text-[#C5A059]' : 'text-[#5C6572]'}`}>
                      {t.plansContractualRoi}
                    </div>
                    <div className="flex items-baseline gap-1 sm:gap-1.5">
                      <span className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${isSelected || isEnterprise ? 'text-[#C5A059]' : isGrowth ? 'text-emerald-800' : 'text-[#1B3B2B]'}`}>
                        +{plan.roi_percentage.toFixed(0)}%
                      </span>
                      <span className={`text-xs ${isSelected || isEnterprise ? 'text-white/80' : 'text-[#5C6572]'}`}>
                        / {plan.duration_days}{t.heroDays?.[0]?.toLowerCase() || 'd'}
                      </span>
                    </div>
                    <div className={`text-[10px] font-medium pt-0.5 sm:pt-1 truncate ${isSelected || isEnterprise ? 'text-white/70' : 'text-[#6E7B74]'}`}>
                      {t.plansBreed}: {plan.poultry_breed}
                    </div>
                  </div>

                  {/* Limits */}
                  <div className={`text-xs space-y-1.5 sm:space-y-2 pt-1 ${isEnterprise && !isSelected ? 'text-white/90' : 'text-[#2D3748]'}`}>
                    <div className="flex justify-between">
                      <span className={isEnterprise && !isSelected ? 'text-white/60' : 'text-[#5C6572]'}>{t.plansMin}:</span>
                      <span className="font-mono font-semibold tabular-nums">
                        {formatCurrency(plan.min_amount, currency, false, language)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isEnterprise && !isSelected ? 'text-white/60' : 'text-[#5C6572]'}>{t.plansMax}:</span>
                      <span className="font-mono font-semibold tabular-nums">
                        {formatCurrency(plan.max_amount, currency, false, language)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isEnterprise && !isSelected ? 'text-white/60' : 'text-[#5C6572]'}>{t.plansDuration}:</span>
                      <span className="font-mono font-semibold tabular-nums">
                        {plan.duration_days} {t.plansDays}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className={`pt-2 sm:pt-3 border-t space-y-1.5 sm:space-y-2 ${isEnterprise && !isSelected ? 'border-white/15' : 'border-[#E5E3D8]'}`}>
                    <div className={`text-[10px] font-semibold uppercase tracking-wider ${isEnterprise && !isSelected ? 'text-[#C5A059]' : 'text-[#1B3B2B]'}`}>
                      {t.plansHighlights}
                    </div>
                    <ul className="space-y-1 sm:space-y-1.5">
                      {plan.features.slice(0, 2).map((feat, fIdx) => (
                        <li key={fIdx} className={`text-xs flex items-start gap-1.5 sm:gap-2 ${isEnterprise && !isSelected ? 'text-white/80' : 'text-[#5C6572]'}`}>
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-[#16A34A]' : isEnterprise ? 'text-[#C5A059]' : 'text-[#16A34A]'}`} />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="p-4 sm:p-6 pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(plan);
                    }}
                    className={`w-full min-h-[44px] py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98 ${
                      isSelected
                        ? 'bg-[#C5A059] text-[#11271D] hover:bg-[#B38F46] font-extrabold shadow-sm'
                        : isGrowth
                        ? 'bg-[#C5A059] hover:bg-[#B38F46] text-[#11271D] font-extrabold'
                        : isEnterprise
                        ? 'bg-[#C5A059] hover:bg-[#B38F46] text-[#11271D]'
                        : 'bg-[#1B3B2B] hover:bg-[#11271D] text-white'
                    }`}
                  >
                    <span>
                      {isSelected
                        ? `${t.plansSelected} ↓`
                        : `${t.plansSelect} ${plan.duration_days}${t.heroDays?.[0]?.toLowerCase() || 'd'}`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
