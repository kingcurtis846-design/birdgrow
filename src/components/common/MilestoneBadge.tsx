import React from 'react';
import { Award, Sparkles, Sprout, ShieldCheck, Crown, Gem, Medal } from 'lucide-react';
import { formatCurrencyCompact } from '../../lib/formatters';

interface MilestoneBadgeProps {
  volumeThreshold: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MilestoneBadge: React.FC<MilestoneBadgeProps> = ({
  volumeThreshold,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { container: 'w-8 h-8 rounded-lg', icon: 'w-4 h-4', text: 'text-[9px]' },
    md: { container: 'w-11 h-11 rounded-xl', icon: 'w-5 h-5', text: 'text-[10px]' },
    lg: { container: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7', text: 'text-xs' },
  }[size];

  // Specific badges for each of the 5 milestone thresholds
  if (volumeThreshold <= 500) {
    // Milestone 1: Seedling Pioneer
    return (
      <div
        className={`${sizeMap.container} bg-gradient-to-br from-emerald-100 via-emerald-200 to-teal-300 border-2 border-emerald-500 text-emerald-900 flex flex-col items-center justify-center shrink-0 shadow-2xs select-none relative group ${className}`}
        title={`Seedling Pioneer Badge (Tier 1 · ${formatCurrencyCompact(500)})`}
      >
        <Sprout className={`${sizeMap.icon} text-emerald-800 drop-shadow-2xs`} />
        <span className="sr-only">Seedling Pioneer</span>
      </div>
    );
  }

  if (volumeThreshold <= 100000) {
    // Milestone 2: Silver Flock Ambassador
    return (
      <div
        className={`${sizeMap.container} bg-gradient-to-br from-slate-100 via-slate-200 to-zinc-300 border-2 border-slate-400 text-slate-800 flex flex-col items-center justify-center shrink-0 shadow-2xs select-none relative group ${className}`}
        title={`Silver Flock Ambassador Badge (Tier 2 · ${formatCurrencyCompact(100000)})`}
      >
        <Medal className={`${sizeMap.icon} text-slate-700 drop-shadow-2xs`} />
        <span className="sr-only">Silver Flock Ambassador</span>
      </div>
    );
  }

  if (volumeThreshold <= 250000) {
    // Milestone 3: Gold Estate Syndicator
    return (
      <div
        className={`${sizeMap.container} bg-gradient-to-br from-amber-100 via-amber-200 to-[#C5A059] border-2 border-amber-500 text-amber-950 flex flex-col items-center justify-center shrink-0 shadow-2xs select-none relative group ${className}`}
        title={`Gold Estate Syndicator Badge (Tier 3 · ${formatCurrencyCompact(250000)})`}
      >
        <Award className={`${sizeMap.icon} text-amber-900 drop-shadow-2xs`} />
        <span className="sr-only">Gold Estate Syndicator</span>
      </div>
    );
  }

  if (volumeThreshold <= 500000) {
    // Milestone 4: Platinum Agri-Director
    return (
      <div
        className={`${sizeMap.container} bg-gradient-to-br from-cyan-100 via-sky-200 to-indigo-300 border-2 border-cyan-500 text-indigo-950 flex flex-col items-center justify-center shrink-0 shadow-2xs select-none relative group ${className}`}
        title={`Platinum Agri-Director Badge (Tier 4 · ${formatCurrencyCompact(500000)})`}
      >
        <Gem className={`${sizeMap.icon} text-cyan-900 drop-shadow-2xs`} />
        <span className="sr-only">Platinum Agri-Director</span>
      </div>
    );
  }
}
