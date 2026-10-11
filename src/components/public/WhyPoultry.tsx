import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Zap, Clock, ShieldCheck, Scale, Check, CheckCircle2, Award, Sparkles } from 'lucide-react';

export const WhyPoultry: React.FC = () => {
  const { t } = usePlatform();

  const pillars = [
    {
      icon: Zap,
      title: t.whyPillar1Title || 'Unrivaled Feed Conversion Efficiency',
      description:
        t.whyPillar1Desc ||
        'Poultry converts feed to protein at an exceptional 1.45–1.62 ratio, compared to 6.0+ for beef. This dramatic metabolic efficiency shields investor returns from global grain price shocks while lowering the carbon footprint by up to 70%.',
      metric: '1.52 FCR',
      metricLabel: t.whyPillar1Label || 'Average metabolic feed conversion',
    },
    {
      icon: Clock,
      title: t.whyPillar2Title || 'Rapid 15 to 60-Day Capital Velocity',
      description:
        t.whyPillar2Desc ||
        'Unlike multi-year cattle or timber investments, modern ethical broiler and layer cycles mature in 15 to 60 days. This allows investors to compound capital with high liquidity and minimal duration risk across European production runs.',
      metric: `15–60 ${t.heroDays || 'Days'}`,
      metricLabel: t.whyPillar2Label || 'Contractual cycle turnaround',
    },
    {
      icon: Scale,
      title: t.whyPillar3Title || 'Inelastic European Consumer Demand',
      description:
        t.whyPillar3Desc ||
        'Poultry is Europe’s fastest-growing staple protein. Every batch is pre-contracted through guaranteed forward off-take agreements with leading European supermarket chains and certified organic wholesalers before chick placement.',
      metric: '100%',
      metricLabel: t.whyPillar3Label || 'Pre-contracted off-taker security',
    },
    {
      icon: ShieldCheck,
      title: t.whyPillar4Title || 'Strict EU Biosafety & Veterinary Audits',
      description:
        t.whyPillar4Desc ||
        'All partner facilities enforce Bio-Security Level 3 standards with continuous automated monitoring of temperature, air exchange, humidity, and water intake, eliminating epidemiological risks and maintaining pristine bird health.',
      metric: '0.4%',
      metricLabel: t.whyPillar4Label || 'Industry-low average flock mortality',
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-[#E5E3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">{t.whySubtitle}</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B3B2B] tracking-tight text-balance">
            {t.whyTitle}
          </h2>
          <p className="text-base text-[#5C6572] leading-relaxed">
            {t.whyDesc}
          </p>
        </div>

        {/* 4 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-xl bg-[#F7F6F2] border border-[#E5E3D8] hover:border-[#1B3B2B] transition-colors flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-white border border-[#DCDAD0] flex items-center justify-center text-[#1B3B2B]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-[#5C6572] tabular-nums">0{idx + 1}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#1B3B2B]">{pillar.title}</h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed">{pillar.description}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E5E3D8] flex items-baseline justify-between">
                  <span className="text-xs text-[#6B7280]">{pillar.metricLabel}</span>
                  <span className="text-xl font-extrabold tabular-nums text-[#1B3B2B] font-mono">{pillar.metric}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
