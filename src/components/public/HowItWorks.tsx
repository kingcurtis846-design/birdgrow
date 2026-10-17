import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Wallet,
  Sparkles,
  Globe2,
  Egg,
  Wheat,
  Building2,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Sun,
  ShieldAlert,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { t, formatCurrentCurrency } = usePlatform();
  const [selectedExpensePillar, setSelectedExpensePillar] = useState<number>(0);

  const steps = [
    {
      step: '01',
      icon: Wallet,
      title: t.howStep1Title || 'Capital Allocation & Contract Setup',
      description:
        t.howStep1Desc ||
        'Select an investment horizon (15 to 60 days). Your funds enter European escrow and are immediately assigned to an active agricultural cycle.',
      highlight: t.howStep1Highlight || `From ${formatCurrentCurrency(500, true)} entry threshold · 15–60 Days Turnaround`,
    },
    {
      step: '02',
      icon: Sparkles,
      title: t.howStep2Title || 'Physical Pairing with Farm Expenses',
      description:
        t.howStep2Desc ||
        'Your capital does not sit idle. Every euro is physically deployed into direct flock production, automated feed milling, and 4-tier climate-resilient facility engineering.',
      highlight: t.howStep2Highlight || 'Direct real-world asset collateralization & 100% Non-GMO feed',
    },
    {
      step: '03',
      icon: Globe2,
      title: t.howStep3Title || 'Supermarket Distribution & Settlement',
      description:
        t.howStep3Desc ||
        'Upon cycle completion, our products—millions of certified grade-A table eggs and heritage poultry—are distributed to supermarket networks with contractual yield settled to your wallet.',
      highlight: t.howStep3Highlight || 'Worldwide egg & poultry distribution · Instant automated settlement',
    },
  ];

  const farmExpensePillars = [
    {
      id: 'production',
      title: t.howExpensePillar1 || '1. Flock Production & Day-Old Placement',
      tag: t.howExpensePillar1Tag || 'Biological Capital Asset',
      sharePct: '38%',
      icon: Egg,
      summary: t.howExpensePillar1Summary || 'Sourcing, brooding, and raising premium organic poultry lines under strict EU animal welfare protocols.',
      details: [
        'Certified Day-Old Chickens: Hubbard JA57, Sasso Silver, Bresse Heritage, and Lohmann Brown/Dekalb White layers.',
        'Veterinary Bio-Security: Automated daily health logging, pathogen screening (Salmonella/Campylobacter negative), and micro-nutrient tracking.',
        'Welfare Standards: Free-range outdoor access, low-density pastures, natural daylight cycles, and certified antibiotic-free growth.',
      ],
      capitalUsage: 'Funds day-old chick placement, organic bedding, veterinary certifications, and biological cycle insurance.',
    },
    {
      id: 'feed_production',
      title: t.howExpensePillar2 || '2. Feed Production & Precision Milling',
      tag: t.howExpensePillar2Tag || 'Nutritional Efficiency Core',
      sharePct: '32%',
      icon: Wheat,
      summary: t.howExpensePillar2Summary || 'On-site closed-loop feed production and grain formulations to eliminate 3rd-party markup and achieve 1.5:1 FCR.',
      details: [
        'Raw Grains Procurement: Locally sourced non-GMO European wheat, alpine barley, golden corn, and field peas.',
        'Automated Precision Milling: Micro-dosed essential amino acids, probiotics, and calcium carbonate for superior eggshell density.',
        'Feed Conversion Optimization: Metabolic efficiency monitored in real time, insulating investor ROI from grain market fluctuations.',
      ],
      capitalUsage: 'Directly finances bulk seasonal grain reserves, feed milling energy, automated silo conveyors, and nutritional testing.',
    },
    {
      id: 'facility_building',
      title: t.howExpensePillar3 || '3. Geothermal Heating Loops & 4-Tier Energy Resilience',
      tag: t.howExpensePillar3Tag || 'Infrastructure & Real Property',
      sharePct: '20%',
      icon: Building2,
      summary: t.howExpensePillar3Summary || 'Constructing and modernizing climate-controlled facilities powered by Tier 1 geothermal ground loops, 24/7 grid stability, summer peak-shaving solar, and emergency life-safety generators.',
      details: [
        'Tier 1 Primary Heat: Subterranean deep or shallow geothermal loops providing 100% of base brooding heat (COP 4.2), completely immune to European winter sub-zero freezes.',
        'Tier 2 & 3 Power Mix: Three-phase 400V grid power for continuous 24/7 ventilation, coupled with rooftop solar & battery strictly for summer peak shaving when fans run hard in July and August.',
        'Tier 4 Lifeline Backup: Industrial on-site diesel/biomass generators with Automatic Transfer Switches (<10s failover) mandated by EU animal welfare directives to prevent fatal flock suffocation.',
      ],
      capitalUsage: 'Funds geothermal borehole drilling, 3-phase grid transformer integration, summer peak-shaving rooftop solar arrays, automated ventilation ducts, and biosecurity sanitation airlocks.',
    },
    {
      id: 'operational_expenses',
      title: t.howExpensePillar4 || '4. Farm Operating Expenses & Cold-Chain Logistics',
      tag: t.howExpensePillar4Tag || 'Turnaround & Distribution',
      sharePct: '10%',
      icon: Flame,
      summary: t.howExpensePillar4Summary || 'All day-to-day farm overheads, environmental compliance, and temperature-controlled logistics to wholesale off-takers.',
      details: [
        'Daily Overhead & Utilities: Water filtration, bio-security disinfectant protocols, and certified agricultural farm personnel.',
        'Packaging & Grading: Automated acoustic egg freshness sorting, organic packaging, and traceability QR coding.',
        'Forward Off-Take Delivery: Transport via refrigerated cold-chain trucks directly to pre-contracted European supermarket networks.',
      ],
      capitalUsage: 'Underwrites routine farm utilities, distribution freight, logistics insurance, and statutory compliance certifications.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#F7F6F2] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">{t.howSubtitle}</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1B3B2B] tracking-tight text-balance">
            {t.howTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#5C6572] leading-relaxed">
            {t.howDesc}
          </p>
        </div>

        {/* 3 Step High-Level Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E3D8] hover:border-[#1B3B2B] transition-all flex flex-col justify-between shadow-2xs relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <span className="text-xs font-mono font-bold text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-1 rounded">
                      {t.howStage} {item.step}
                    </span>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#F7F6F2] border border-[#E5E3D8] flex items-center justify-center text-[#1B3B2B] group-hover:border-[#1B3B2B] transition-colors">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#1B3B2B] mb-2 sm:mb-2.5">{item.title}</h3>
                  <p className="text-xs text-[#5C6572] leading-relaxed mb-5 sm:mb-6">{item.description}</p>
                </div>

                <div className="pt-3.5 sm:pt-4 border-t border-[#F0EFEA] text-[11px] font-semibold text-[#1B3B2B] flex items-center gap-1.5">
                  <span className="text-[#16A34A] font-bold">✓</span>
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive: How Investor Capital is Paired with Farm Expenses */}
        <div className="bg-white rounded-3xl border-2 border-[#1B3B2B]/20 p-5 sm:p-10 shadow-xs space-y-6 sm:space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E5E3D8]">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#1B3B2B] text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{t.howExpenseSubtitle}</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-[#1B3B2B]">
                {t.howExpenseTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6572] leading-relaxed">
                {t.howExpenseDesc}
              </p>
            </div>

            {/* Quick Summary Pill Bar */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-mono font-bold bg-[#F7F6F2] p-2 sm:p-2.5 rounded-2xl border border-[#E5E3D8]">
              <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg">{t.howExpenseTab1}</span>
              <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">{t.howExpenseTab2}</span>
              <span className="bg-blue-100 text-blue-900 px-2.5 py-1 rounded-lg">{t.howExpenseTab3}</span>
              <span className="bg-gray-200 text-gray-800 px-2.5 py-1 rounded-lg">{t.howExpenseTab4}</span>
            </div>
          </div>

          {/* Interactive 4 Pillars Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {farmExpensePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isSelected = selectedExpensePillar === idx;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedExpensePillar(idx)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1B3B2B] text-white border-[#1B3B2B] shadow-md ring-2 ring-[#C5A059]/40'
                      : 'bg-[#F7F6F2] hover:bg-[#EAE8E0] text-[#1B3B2B] border-[#E5E3D8]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-white/15 text-[#C5A059]' : 'bg-white text-[#1B3B2B] border border-[#E5E3D8]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                        isSelected ? 'bg-[#C5A059] text-[#11271D]' : 'bg-[#E5E3D8] text-[#5C6572]'
                      }`}
                    >
                      {pillar.sharePct}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider block mb-0.5 ${
                        isSelected ? 'text-[#C5A059]' : 'text-[#7C887E]'
                      }`}
                    >
                      {pillar.tag}
                    </span>
                    <h4 className="font-extrabold text-xs leading-snug">{pillar.title}</h4>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Pillar Presentation */}
          {(() => {
            const active = farmExpensePillars[selectedExpensePillar];
            const Icon = active.icon;
            return (
              <div className="bg-[#FAF9F5] border border-[#E5E3D8] rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E3D8] pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">{active.tag}</span>
                        <span className="text-xs font-mono font-black bg-[#1B3B2B] text-white px-2 py-0.5 rounded">
                          {active.sharePct} of Deployed Capital
                        </span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-[#1B3B2B]">{active.title}</h4>
                    </div>
                  </div>

                  <div className="text-xs text-[#5C6572] sm:text-right max-w-xs font-medium">
                    {active.summary}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bulleted specifications */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#1B3B2B] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                      <span>Operational Scope & Quality Assurance:</span>
                    </h5>
                    <ul className="space-y-2.5">
                      {active.details.map((point, pIdx) => (
                        <li key={pIdx} className="text-xs text-[#4A5568] flex items-start gap-2 leading-relaxed">
                          <span className="text-[#C5A059] font-bold mt-0.5">▸</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Financial & Collateral Link */}
                  <div className="bg-white p-5 rounded-xl border border-[#E5E3D8] space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-[#5C6572] block mb-1">
                        Capital Deployment Ledger Mechanism
                      </span>
                      <h6 className="text-sm font-extrabold text-[#1B3B2B] mb-2">Direct Expense Allocation</h6>
                      <p className="text-xs text-[#5C6572] leading-relaxed">
                        {active.capitalUsage}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F7F6F2] rounded-lg border border-[#E5E3D8] text-[11px] text-[#1B3B2B] flex items-center justify-between">
                      <span className="font-semibold">Harvest Liquidity Settlement:</span>
                      <span className="font-mono font-bold text-[#16A34A]">Guaranteed European Off-Take</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>

      </div>
    </section>
  );
};