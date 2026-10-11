import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  Calculator,
  ShieldCheck,
  Sun,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  MapPin,
  Egg,
  Feather,
  Award,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { formatEuro } from '../../lib/formatters';
import {
  INITIAL_HERO_IMAGE,
  BAVARIA_IMAGE,
  UTRECHT_IMAGE,
  NORMANDY_IMAGE,
  ALASKA_IMAGE,
  FACILITY_UNIQUE_IMAGES,
} from '../../lib/mockData';

interface HeroProps {
  onExplorePlans: () => void;
  onOpenCalculator: () => void;
  onOpenAuth: () => void;
}

const INVESTED_FARMS = [
  {
    id: 'cyc-bav-04',
    name: 'Hub Bavaria',
    code: 'DE-BY-04',
    location: 'Upper Bavaria, Germany',
    flock: '42,000 Free-Range Broilers',
    category: 'Bio-Broilers',
    breed: 'Sasso Silver Heritage',
    roi: '84.00%',
    horizon: '21 Days',
    stage: 'Growth',
    statusColor: '#16A34A',
    image: BAVARIA_IMAGE,
    solarArray: '480 kWp',
  },
  {
    id: 'cyc-utr-02',
    name: 'Utrecht Bio-Complex',
    code: 'EU-NLD-02',
    location: 'Utrecht, Netherlands',
    flock: '38,500 Precision Broilers',
    category: 'Bio-Broilers',
    breed: 'Hubbard JA57 Rapid',
    roi: '50.00%',
    horizon: '15 Days',
    stage: 'Finishing',
    statusColor: '#0284C7',
    image: UTRECHT_IMAGE,
    solarArray: '620 kWp',
  },
  {
    id: 'cyc-fra-03',
    name: 'Normandy Pastures',
    code: 'EU-FRA-03',
    location: 'Normandy, France',
    flock: '26,000 Label Rouge Broilers',
    category: 'Bio-Broilers',
    breed: 'Cou Nu de France',
    roi: '150.00%',
    horizon: '30 Days',
    stage: 'Chick Placement',
    statusColor: '#EAB308',
    image: NORMANDY_IMAGE,
    solarArray: '310 kWp',
  },
  {
    id: 'cyc-de-egg-01',
    name: 'Black Forest Sanctuary',
    code: 'EU-DE-EGG-01',
    location: 'Baden-Württemberg, Germany',
    flock: '34,000 Layers (31k Eggs/Day)',
    category: 'Layers & Eggs',
    breed: 'Lohmann Brown-Classic',
    roi: '84.00%',
    horizon: '21 Days',
    stage: 'Active Laying',
    statusColor: '#16A34A',
    image: FACILITY_UNIQUE_IMAGES['cyc-de-egg-01'] || BAVARIA_IMAGE,
    solarArray: '520 kWp',
  },
  {
    id: 'cyc-alaska-01',
    name: 'Alaska Arctic Bio-Dome',
    code: 'US-AK-2026-01',
    location: 'Fairbanks, Alaska, USA',
    flock: '28,000 Arctic Layers & Eggs',
    category: 'Layers & Eggs',
    breed: 'Bovans Cold-Hardy High-Yield',
    roi: '150.00%',
    horizon: '30 Days',
    stage: 'Commissioning',
    statusColor: '#D97706',
    image: ALASKA_IMAGE,
    solarArray: '650 kWp',
  },
];

export const Hero: React.FC<HeroProps> = ({ onExplorePlans, onOpenCalculator, onOpenAuth }) => {
  const { t, language, currentUser, investments, cycles, formatCurrentCurrency, formatCurrentCurrencyCompact } = usePlatform();

  const [activeFarmIndex, setActiveFarmIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Total number of birds in the farm from all the facilities (automatically updates once a new farm has been added)
  const totalBirdsAllFacilities = useMemo(() => {
    return cycles.reduce((sum, c) => sum + (c.total_birds || 0), 0);
  }, [cycles]);
  const flockLabel = t.heroTotalBirdsLabel;

  // Automatically cycle through invested farms every 4.5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveFarmIndex((prev) => (prev + 1) % INVESTED_FARMS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const activeFarm = INVESTED_FARMS[activeFarmIndex];

  const handlePrevFarm = () => {
    setActiveFarmIndex((prev) => (prev - 1 + INVESTED_FARMS.length) % INVESTED_FARMS.length);
  };

  const handleNextFarm = () => {
    setActiveFarmIndex((prev) => (prev + 1) % INVESTED_FARMS.length);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-20 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Proposition */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Clean unboxed kicker metadata */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B3B2B]/80 flex-wrap">
                <span className="text-[#C5A059]">{t.heroKicker.split('·')[0]}</span>
                <span aria-hidden="true">·</span>
                <span>{t.heroKicker.split('·')[1] || 'Real-Asset Crowdinvesting'}</span>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">{t.heroKicker.split('·')[2] || 'Crypto Settled'}</span>
              </div>

              {/* Total Number of Birds in the Farm Badge with slow blinking green dot */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[11px] font-mono font-bold text-emerald-950 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-slow-blink shadow-xs shrink-0" />
                <span>{flockLabel}:</span>
                <span className="tabular-nums font-extrabold text-[#1B3B2B]">{totalBirdsAllFacilities.toLocaleString()}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1B3B2B] leading-[1.15] sm:leading-[1.1] text-balance">
              {t.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-[#3D4A41] max-w-2xl leading-relaxed">
              {t.heroSubtext}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onExplorePlans}
                className="min-h-[44px] px-6 py-3.5 bg-[#1B3B2B] hover:bg-[#11271D] text-white font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
              >
                <span>{t.heroCtaExplore}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="min-h-[44px] px-6 py-3.5 bg-white hover:bg-[#EAE8E0] text-[#1B3B2B] font-semibold rounded-xl text-sm border border-[#DCDAD0] transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Calculator className="w-4 h-4 text-[#C5A059]" />
                <span>{t.heroCtaCalc}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('referrals');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="min-h-[44px] px-5 py-3.5 bg-gradient-to-r from-[#C5A059] to-[#DFBA73] hover:from-[#B38F48] hover:to-[#C5A059] text-[#11271D] font-bold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group active:scale-98"
                title={`${t.navUpTo} ${formatCurrentCurrency(245050, false)}`}
              >
                <Award className="w-4 h-4 text-[#11271D]" />
                <span>{t.navReferrals} ({t.navUpTo} {formatCurrentCurrencyCompact(245050)})</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#5C6572] border-t border-[#E5E3D8]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1B3B2B] shrink-0" />
                <span>{t.heroForwardContracts}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{t.heroSolarPowered}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#1B3B2B] shrink-0" />
                <span>{t.heroNetRoiTarget}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset - Cycling through invested farms */}
          <div
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E5E3D8] bg-[#11271D] group">
              
              {/* Rotating Farm Image */}
              <div className="relative h-72 sm:h-96 lg:h-[460px] overflow-hidden bg-slate-900">
                <img
                  key={activeFarm.id}
                  src={activeFarm.image}
                  alt={`${activeFarm.name} poultry agricultural facility in ${activeFarm.location}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-opacity duration-700 animate-in fade-in"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 pointer-events-none" />
              </div>

              {/* Top Controls: Nav Controls */}
              <div className="absolute top-3 right-3 flex items-center justify-end pointer-events-auto z-10">
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-md">
                  <button
                    onClick={handlePrevFarm}
                    aria-label={t.heroPrevFarm || 'Previous Farm'}
                    className="w-7 h-7 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    aria-label={isAutoPlaying ? t.heroPause || 'Pause Slideshow' : t.heroResume || 'Resume Slideshow'}
                    className="w-7 h-7 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                    title={isAutoPlaying ? t.heroPause : t.heroResume}
                  >
                    {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-[#C5A059]" />}
                  </button>

                  <button
                    onClick={handleNextFarm}
                    aria-label={t.heroNextFarm || 'Next Farm'}
                    className="w-7 h-7 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Verified Image Overlay Card (Dynamically updates with current farm) */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 sm:p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 text-[#1B3B2B] shadow-lg transition-all">
                <div className="flex items-center justify-between text-xs text-[#5C6572] pb-2 border-b border-[#E5E3D8]">
                  <div className="flex items-center gap-1.5 font-bold text-[#1B3B2B] truncate max-w-[170px] sm:max-w-[200px]">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span className="truncate">{activeFarm.name} ({activeFarm.code})</span>
                  </div>
                  <span className="tabular-nums font-mono text-[10px] sm:text-[11px] font-semibold text-[#1B3B2B] shrink-0">
                    {activeFarm.flock}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 text-center">
                  <div>
                    <div className="text-[10px] sm:text-[11px] text-[#5C6572]">{t.heroTargetReturn}</div>
                    <div className="text-sm sm:text-base font-extrabold tabular-nums text-[#1B3B2B]">
                      {activeFarm.roi}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] text-[#5C6572]">{t.heroHorizon}</div>
                    <div className="text-sm sm:text-base font-extrabold tabular-nums text-[#1B3B2B]">
                      {activeFarm.horizon}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] text-[#5C6572]">{t.heroStatus}</div>
                    <div className="text-xs sm:text-sm font-bold text-[#1B3B2B] flex items-center justify-center gap-1 mt-0.5">
                      <span
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse shrink-0"
                        style={{ backgroundColor: activeFarm.statusColor }}
                      />
                      <span className="truncate">{activeFarm.stage}</span>
                    </div>
                  </div>
                </div>

                {/* Micro Farm Selection Indicators */}
                <div className="flex items-center justify-center gap-1.5 pt-2 mt-1.5 sm:pt-2.5 sm:mt-2 border-t border-[#F0EFEA]">
                  {INVESTED_FARMS.map((farm, idx) => (
                    <button
                      key={farm.id}
                      onClick={() => setActiveFarmIndex(idx)}
                      className={`h-2 sm:h-1.5 rounded-full transition-all cursor-pointer p-0.5 ${
                        idx === activeFarmIndex ? 'w-6 bg-[#1B3B2B]' : 'w-2 bg-[#DCDAD0] hover:bg-[#1B3B2B]/50'
                      }`}
                      title={farm.name}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Live Key Metrics Row */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-[#E5E3D8] grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">
              {t.heroMetricCapital}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-[#1B3B2B]">{formatCurrentCurrencyCompact(1100000)}+</div>
            <div className="text-xs text-[#5C6572]">{t.heroMetricCapitalSub}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">
              {t.heroMetricVelocity}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-[#1B3B2B]">15–60 {t.heroDays}</div>
            <div className="text-xs text-[#5C6572]">{t.heroMetricVelocitySub}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#5C6572]">
              {t.heroMetricEsg}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-[#1B3B2B]">96 / 100</div>
            <div className="text-xs text-[#5C6572]">{t.heroMetricEsgSub}</div>
          </div>

        </div>

      </div>
    </section>
  );
};
