import React, { useState, useMemo } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  MapPin,
  Egg,
  Feather,
  CheckCircle2,
  Search,
  Building2,
  ChevronDown,
  Sparkles,
  Zap,
  ArrowRight,
  Sun,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { PoultryCycle } from '../../types';

interface FeaturedHub {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  location: string;
  category: string;
  birds: string;
  output: string;
  solar: string;
  stage: string;
  stageBadgeClass: string;
  image: string;
  highlight: string;
}

const FEATURED_HUBS: FeaturedHub[] = [
  {
    id: 'normandy-hub',
    name: 'Normandy Bio-Secure Hub',
    country: 'France',
    countryFlag: '🇫🇷',
    location: 'Normandy, France',
    category: 'Free-Range Broilers & Layers',
    birds: '1,850 Birds',
    output: '450 eggs/day',
    solar: '65 kWp Solar',
    stage: 'Active Laying',
    stageBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    image: '/images/farm_normandy_facility_1790556829062.jpg',
    highlight: 'Certified Bio-Terre Label Rouge Standard',
  },
  {
    id: 'bavaria-hub',
    name: 'Bavaria Geo-Thermal Farm',
    country: 'Germany',
    countryFlag: '🇩🇪',
    location: 'Bavaria, Germany',
    category: 'Commercial Bio-Broiler Facility',
    birds: '2,000 Birds',
    output: 'Rewe / Edeka Retail Trays',
    solar: '85 kWp Solar',
    stage: 'Finishing Stage',
    stageBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    image: '/images/farm_bavaria_facility_1790556807167.jpg',
    highlight: 'Zero-Emission Closed Bio-Pellet Heating',
  },
  {
    id: 'utrecht-hub',
    name: 'Utrecht Smart Agro-Tech Hub',
    country: 'Netherlands',
    countryFlag: '🇳🇱',
    location: 'Utrecht, Netherlands',
    category: 'High-Density Automated Layer',
    birds: '3,100 Birds',
    output: '900 eggs/day',
    solar: '95 kWp Microgrid',
    stage: 'Fully Commissioned',
    stageBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    image: '/images/farm_utrecht_facility_1790556818162.jpg',
    highlight: 'Robotic Egg Grading & Albert Heijn Off-Take',
  },
  {
    id: 'arctic-hub',
    name: 'Arctic Geothermal Bio-Dome',
    country: 'USA / Alaska',
    countryFlag: '❄️',
    location: 'Alaska / Arctic Expansion',
    category: 'Sub-Zero Geothermal Colony',
    birds: '1,200 Birds',
    output: '250 eggs/day',
    solar: '55 kWp Microgrid',
    stage: '65% Commissioned',
    stageBadgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
    image: '/images/farm_alaska_facility_1790558782367.jpg',
    highlight: 'Flagship Frontier Polar Agricultural Dome',
  },
];

export const FacilitiesSection: React.FC = () => {
  const { cycles, t } = usePlatform();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'dual' | 'layers_eggs' | 'broilers' | 'alaska'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Alaska farm from platform context
  const alaskaFarm = useMemo(() => {
    return cycles.find((c) => c.id === 'cyc-alaska-01' || c.facility_location.toLowerCase().includes('alaska'));
  }, [cycles]);

  const alaskaProgress = alaskaFarm?.construction_progress ?? 65;

  // Aggregate metrics
  const totalFarms = cycles.length;
  const dualFarms = useMemo(() => cycles.filter((c) => c.category === 'dual_layers_broilers' || (c.has_layers && c.has_broilers)), [cycles]);
  const layerFarms = useMemo(() => cycles.filter((c) => c.category === 'layers_eggs' || c.category === 'dual_layers_broilers' || c.has_layers || !!c.daily_egg_capacity), [cycles]);
  const broilerFarms = useMemo(() => cycles.filter((c) => c.category === 'broilers' || c.category === 'dual_layers_broilers' || c.has_broilers), [cycles]);
  const layerPercentage = totalFarms > 0 ? ((layerFarms.length / totalFarms) * 100).toFixed(1) : '65.6';

  // Total daily egg capacity
  const totalDailyEggs = useMemo(() => {
    return layerFarms.reduce((acc, curr) => acc + (curr.daily_egg_capacity || 0), 0);
  }, [layerFarms]);

  // Total bird capacity
  const totalBirdCapacity = useMemo(() => {
    return cycles.reduce((acc, curr) => acc + (curr.total_birds || 0), 0);
  }, [cycles]);

  // Unique countries
  const countries = useMemo(() => {
    const list = Array.from(new Set(cycles.map((c) => c.country).filter(Boolean)));
    return list.sort();
  }, [cycles]);

  // Filtered list
  const filteredCycles = useMemo(() => {
    return cycles.filter((c) => {
      if (categoryFilter === 'dual' && c.category !== 'dual_layers_broilers' && (!c.has_layers || !c.has_broilers)) return false;
      if (categoryFilter === 'layers_eggs' && c.category !== 'layers_eggs' && c.category !== 'dual_layers_broilers' && !c.has_layers && !c.daily_egg_capacity) return false;
      if (categoryFilter === 'broilers' && c.category !== 'broilers' && c.category !== 'dual_layers_broilers' && !c.has_broilers) return false;
      if (categoryFilter === 'alaska' && !c.is_opening_soon && !c.facility_location.toLowerCase().includes('alaska') && !c.facility_location.toLowerCase().includes('norway')) return false;

      if (countryFilter !== 'all' && c.country !== countryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (c.facility_name || '').toLowerCase().includes(q);
        const matchesLoc = c.facility_location.toLowerCase().includes(q);
        const matchesBreed = c.breed.toLowerCase().includes(q);
        const matchesProd = (c.production_type || '').toLowerCase().includes(q);
        const matchesEgg = (c.egg_type || '').toLowerCase().includes(q);
        return matchesName || matchesLoc || matchesBreed || matchesProd || matchesEgg;
      }

      return true;
    });
  }, [cycles, categoryFilter, countryFilter, searchQuery]);

  return (
    <section id="facilities" className="py-20 bg-white border-b border-[#E5E3D8] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================= */}
        {/* 1. SECTION HEADER WITH EVENLY SPACED METRICS               */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Text Block (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3B2B]/5 border border-[#1B3B2B]/15 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{t.facSubtitle || 'European Production Network'}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1B3B2B] tracking-tight leading-tight">
              {t.facTitle || '30+ Certified European Production Hubs & Arctic Expansion'}
            </h2>
            
            <p className="text-sm sm:text-base text-[#5C6572] leading-relaxed max-w-2xl">
              {t.facDesc || 'Our industrial infrastructure spans bio-secure facilities across France, Germany, the Netherlands, Poland, and Austria, with cutting-edge geothermal expansion in polar climates. Every facility is underwritten by forward retail contracts.'}
            </p>
          </div>

          {/* Right Metrics Grid (5 cols, 4 uniform boxes in 2x2 grid) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            
            <div className="h-full min-h-[92px] flex flex-col justify-between p-3.5 sm:p-4 bg-[#F7F6F2] rounded-2xl border border-[#E5E3D8] hover:border-[#C5A059]/40 transition-colors">
              <div className="text-[10px] sm:text-[11px] font-bold text-[#5C6572] uppercase tracking-wider flex items-center justify-between">
                <span>{t.facActiveHubsCount || 'Active Hubs'}</span>
                <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#1B3B2B] font-mono leading-none mt-1">
                {totalFarms} <span className="text-xs font-normal text-[#5C6572]">Farms</span>
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold">10 European Nations</div>
            </div>

            <div className="h-full min-h-[92px] flex flex-col justify-between p-3.5 sm:p-4 bg-[#F7F6F2] rounded-2xl border border-[#E5E3D8] hover:border-[#C5A059]/40 transition-colors">
              <div className="text-[10px] sm:text-[11px] font-bold text-[#5C6572] uppercase tracking-wider flex items-center justify-between">
                <span>{t.facTotalCapacityCount || 'Live Capacity'}</span>
                <Feather className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#1B3B2B] font-mono leading-none mt-1">
                {(totalBirdCapacity / 1000).toFixed(0)}k <span className="text-xs font-normal text-[#5C6572]">Birds</span>
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold">Strict EU Biosafety</div>
            </div>

            <div className="h-full min-h-[92px] flex flex-col justify-between p-3.5 sm:p-4 bg-[#F7F6F2] rounded-2xl border border-[#E5E3D8] hover:border-[#C5A059]/40 transition-colors">
              <div className="text-[10px] sm:text-[11px] font-bold text-[#5C6572] uppercase tracking-wider flex items-center justify-between">
                <span>{t.facDailyEggOutputCount || 'Daily Output'}</span>
                <Egg className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-800 font-mono leading-none mt-1">
                {(totalDailyEggs / 1000).toFixed(0)}k <span className="text-xs font-normal text-[#5C6572]">/ day</span>
              </div>
              <div className="text-[10px] text-[#5C6572] font-semibold">{layerPercentage}% Layer Capacity</div>
            </div>

            <div className="h-full min-h-[92px] flex flex-col justify-between p-3.5 sm:p-4 bg-[#F7F6F2] rounded-2xl border border-[#E5E3D8] hover:border-[#C5A059]/40 transition-colors">
              <div className="text-[10px] sm:text-[11px] font-bold text-[#5C6572] uppercase tracking-wider flex items-center justify-between">
                <span>{t.facRetailOfftake || 'Retail Off-Take'}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#C5A059] font-mono leading-none mt-1">
                100% <span className="text-xs font-normal text-[#5C6572]">Pre-Sold</span>
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold">Top Tier EU Grocers</div>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* 2. COMBINED SHOWCASE: HUBS TO SUPERMARKET-SEALED TRAYS     */}
        {/* ========================================================= */}
        <div className="mb-14 rounded-3xl bg-[#11271D] border-2 border-[#C5A059]/40 p-5 sm:p-8 lg:p-10 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Image: Clingfilm-Wrapped Broilers on Retail Grocery Trays */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl group">
              <img
                src="/images/clingfilm_broilers_1790812565922.jpg"
                alt="European supermarket retail chilled meat display with whole fresh raw broilers properly slaughtered, dressed, and wrapped in clear clingfilm on grocery trays"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 bg-[#1B3B2B]/95 backdrop-blur-md text-[#C5A059] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-[#C5A059]/40 shadow-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{t.facRetailReadyBadge || 'Supermarket Retail Ready · Clingfilm Sealed'}</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 bg-black/85 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-mono p-2.5 sm:p-3 rounded-xl border border-white/20 flex items-center justify-between">
                <span>{t.facCleanedDressedBadge || 'Cleaned · Dressed · Sealed Trays'}</span>
                <span className="text-[#C5A059] font-bold">{t.facEuStandard || 'EU Sanitary Standard'}</span>
              </div>
            </div>

            {/* Right Text & Evenly Spaced Specifications Grid */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/15 px-3 py-1 rounded-full border border-[#C5A059]/30">
                  Agric Production → Retail Distribution
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Pre-Sold Off-Take</span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                {t.facShowcaseTitle || 'From Our European Agric Hubs to Supermarket Shelves Across the Continent'}
              </h3>

              <p className="text-xs sm:text-sm text-[#D8DFD9] leading-relaxed">
                {t.facShowcaseDesc || 'Every broiler flock raised across our certified European production hubs is underwritten by legally binding forward off-take agreements with leading retail grocery networks before chick placement. Birds are grown under strict EU veterinary biosafety standards, cleanly dressed, and sealed in clear protective clingfilm on food-grade retail trays ready for consumer refrigeration shelves in Rewe, Carrefour, Edeka, and Albert Heijn.'}
              </p>

              {/* Evenly Spaced 4-Card Specifications Grid (Matching heights) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                
                <div className="h-full min-h-[96px] flex flex-col justify-between p-3.5 bg-white/5 rounded-xl border border-white/10 hover:border-[#C5A059]/40 transition-colors">
                  <div className="text-[10px] text-[#A7B6AB] uppercase font-mono font-semibold">Packaging Format</div>
                  <div className="font-extrabold text-white text-xs sm:text-sm leading-tight">Clingfilm Trays</div>
                  <div className="text-[10px] text-[#C5A059] font-medium">Sanitary EU Retail</div>
                </div>

                <div className="h-full min-h-[96px] flex flex-col justify-between p-3.5 bg-white/5 rounded-xl border border-white/10 hover:border-[#C5A059]/40 transition-colors">
                  <div className="text-[10px] text-[#A7B6AB] uppercase font-mono font-semibold">Turnaround Horizon</div>
                  <div className="font-extrabold text-emerald-400 text-xs sm:text-sm leading-tight">15–60 Days</div>
                  <div className="text-[10px] text-white/70 font-medium">Contractual Cycle</div>
                </div>

                <div className="h-full min-h-[96px] flex flex-col justify-between p-3.5 bg-white/5 rounded-xl border border-white/10 hover:border-[#C5A059]/40 transition-colors">
                  <div className="text-[10px] text-[#A7B6AB] uppercase font-mono font-semibold">Grocery Off-Takers</div>
                  <div className="font-extrabold text-[#C5A059] text-xs sm:text-sm leading-tight">Top EU Chains</div>
                  <div className="text-[10px] text-white/70 font-medium">Rewe, Carrefour, Edeka</div>
                </div>

                <div className="h-full min-h-[96px] flex flex-col justify-between p-3.5 bg-white/5 rounded-xl border border-white/10 hover:border-[#C5A059]/40 transition-colors">
                  <div className="text-[10px] text-[#A7B6AB] uppercase font-mono font-semibold">Price Risk</div>
                  <div className="font-extrabold text-white text-xs sm:text-sm leading-tight">Zero Open Risk</div>
                  <div className="text-[10px] text-emerald-400 font-medium">Guaranteed Forward Floor</div>
                </div>

              </div>

              {/* Action Button to Filter to Broiler Hubs */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(true);
                    setCategoryFilter('broilers');
                    setTimeout(() => {
                      document.getElementById('facility-list-anchor')?.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#C5A059] hover:bg-[#B38F46] text-[#11271D] text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <Feather className="w-4 h-4" />
                  <span>Explore {broilerFarms.length} Certified Broiler Facilities Supplying Supermarket Trays</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. FOUR FEATURED FLAGSHIP HUBS SPOTLIGHT (Evenly Spaced)   */}
        {/* ========================================================= */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                Production Highlights
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#1B3B2B] tracking-tight">
                Featured European Flagship Agricultural Complexes
              </h3>
            </div>
            <p className="text-xs text-[#5C6572] max-w-md">
              High-efficiency bio-secure centers equipped with solar arrays, subterranean geo-thermal heating, and contractual supermarket links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_HUBS.map((hub) => (
              <div
                key={hub.id}
                className="h-full flex flex-col bg-[#F7F6F2] rounded-2xl border-2 border-[#E5E3D8] hover:border-[#1B3B2B] transition-all overflow-hidden shadow-xs hover:shadow-md group"
              >
                {/* Photo Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={hub.image}
                    alt={hub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Country Flag & Stage */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-bold">
                      {hub.countryFlag} {hub.country}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${hub.stageBadgeClass}`}>
                      {hub.stage}
                    </span>
                    <span className="text-[10px] font-mono text-[#C5A059] font-bold flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded">
                      <Sun className="w-3 h-3 text-[#C5A059]" />
                      {hub.solar}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-[#1B3B2B] leading-snug group-hover:text-[#C5A059] transition-colors">
                      {hub.name}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-[#5C6572] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>{hub.location}</span>
                    </div>
                  </div>

                  {/* Uniform 2-Column Specs */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E3D8] text-xs">
                    <div className="bg-white p-2 rounded-xl border border-[#E5E3D8]/80">
                      <div className="text-[9px] uppercase font-mono text-[#5C6572]">Flock Size</div>
                      <div className="font-mono font-extrabold text-[#1B3B2B] text-xs">{hub.birds}</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-[#E5E3D8]/80">
                      <div className="text-[9px] uppercase font-mono text-[#5C6572]">Contract Output</div>
                      <div className="font-mono font-bold text-emerald-800 text-[11px] truncate">{hub.output}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#5C6572] bg-white/70 p-2 rounded-xl border border-[#E5E3D8]/60 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-tight">{hub.highlight}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. PRODUCTION DIRECTORY CONTAINER (All 32 Facilities)      */}
        {/* ========================================================= */}
        <div id="facility-list-anchor" className="rounded-3xl border-2 border-[#E5E3D8] bg-[#F7F6F2] p-5 sm:p-7 transition-all shadow-xs">
          
          {/* Directory Collapsible Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#1B3B2B] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Building2 className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-[#1B3B2B]">
                    Complete European Production Directory ({totalFarms} Facilities)
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {layerFarms.length} Layers & Eggs ({layerPercentage}%)
                  </span>
                </div>
                <p className="text-xs text-[#5C6572] mt-1">
                  {isDropdownOpen
                    ? 'Explore complete facility specifications, bird capacity, breed genetics, and operational stages below.'
                    : 'Facilities are neatly tucked away to keep page layout clean. Click to expand all 32 facilities across 10 European nations.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#11271D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0 active:scale-98"
            >
              <span>{isDropdownOpen ? 'Collapse Directory ▲' : 'Explore All 32 Facilities (Dropdown) ▼'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded List View */}
          {isDropdownOpen && (
            <div className="mt-8 pt-6 border-t border-[#E5E3D8] space-y-6 animate-in fade-in duration-300">
              
              {/* ALASKA COMMISSIONING FEATURE CARD */}
              {alaskaFarm && (
                <div className="rounded-2xl border-2 border-[#1B3B2B]/20 bg-white p-5 sm:p-6 relative overflow-hidden shadow-xs">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#1B3B2B] text-white">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{t.facAlaskaSubtitle || 'Strategic Expansion · New Farm Opening'}</span>
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B3B2B]">{alaskaFarm.facility_name}</h3>
                        <div className="flex items-center gap-2 text-xs text-[#5C6572] mt-0.5">
                          <MapPin className="w-4 h-4 text-[#C5A059]" />
                          <span>{alaskaFarm.facility_location}</span>
                          <span>·</span>
                          <span className="font-semibold text-emerald-700">Sub-Zero Arctic Geo-Thermal Hub</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#4A5568] leading-relaxed">
                        {t.facAlaskaDesc || 'Pioneering closed-loop bio-dome agriculture in sub-zero climate. Utilizing geothermal subterranean heating and closed-cycle solar microgrids, this flagship facility houses cold-hardy Icelandic and Bovans layer hens producing certified organic table eggs.'}
                      </p>
                    </div>

                    {/* Right Alaska Specs & Commissioning Progress */}
                    <div className="w-full lg:w-96 bg-[#FAF9F5] p-4 rounded-xl border border-[#E5E3D8] space-y-3 shrink-0">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#1B3B2B] uppercase">{t.facConstructionProgress || 'Commissioning Progress'}</span>
                        <span className="font-mono font-extrabold text-sm text-[#1B3B2B]">{alaskaProgress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#EAE8E0] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#1B3B2B] to-[#C5A059]"
                          style={{ width: `${alaskaProgress}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#E5E3D8]">
                        <div>
                          <span className="text-[#5C6572] block text-[10px] uppercase">{t.facTotalBirds || 'Capacity'}</span>
                          <span className="font-mono font-bold text-[#1B3B2B]">{alaskaFarm.total_birds.toLocaleString()} Birds</span>
                        </div>
                        <div>
                          <span className="text-[#5C6572] block text-[10px] uppercase">{t.facDailyEggs || 'Daily Egg Output'}</span>
                          <span className="font-mono font-bold text-amber-900">25,000 / Day</span>
                        </div>
                        <div>
                          <span className="text-[#5C6572] block text-[10px] uppercase">{t.facSolarCapacity || 'Solar Array'}</span>
                          <span className="font-mono font-bold text-[#1B3B2B]">{alaskaFarm.solar_power_kw} kW</span>
                        </div>
                        <div>
                          <span className="text-[#5C6572] block text-[10px] uppercase">Status</span>
                          <span className="font-bold text-amber-800 uppercase text-[11px]">
                            {alaskaProgress >= 100 ? 'Commissioned' : 'Under Construction'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Controls Row (Category Tabs + Search + Country Dropdown) */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                
                {/* Category Tabs */}
                <div className="flex items-center gap-1.5 p-1.5 bg-[#EAE8E0] rounded-2xl border border-[#DCDAD0] overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      categoryFilter === 'all'
                        ? 'bg-white text-[#1B3B2B] shadow-2xs'
                        : 'text-[#5C6572] hover:text-[#1B3B2B]'
                    }`}
                  >
                    <span>{t.facFilterAll || 'All Facilities'}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E5E3D8] text-[#1B3B2B]">
                      {cycles.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setCategoryFilter('dual')}
                    className={`min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      categoryFilter === 'dual'
                        ? 'bg-[#1B3B2B] text-white shadow-2xs'
                        : 'text-[#5C6572] hover:text-[#1B3B2B]'
                    }`}
                  >
                    <span className="flex items-center -space-x-1">
                      <Egg className="w-3.5 h-3.5 text-[#C5A059]" />
                      <Feather className="w-3.5 h-3.5 text-emerald-300" />
                    </span>
                    <span>{t.facFilterDual || 'Layers & Broilers'}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${categoryFilter === 'dual' ? 'bg-[#11271D] text-white' : 'bg-[#E5E3D8] text-[#1B3B2B]'}`}>
                      {dualFarms.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setCategoryFilter('layers_eggs')}
                    className={`min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      categoryFilter === 'layers_eggs'
                        ? 'bg-emerald-900 text-white shadow-2xs'
                        : 'text-[#5C6572] hover:text-[#1B3B2B]'
                    }`}
                  >
                    <Egg className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{t.facFilterLayers || 'Layers & Eggs'}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${categoryFilter === 'layers_eggs' ? 'bg-emerald-800 text-white' : 'bg-[#E5E3D8] text-[#1B3B2B]'}`}>
                      {layerFarms.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setCategoryFilter('broilers')}
                    className={`min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      categoryFilter === 'broilers'
                        ? 'bg-[#1B3B2B] text-white shadow-2xs'
                        : 'text-[#5C6572] hover:text-[#1B3B2B]'
                    }`}
                  >
                    <Feather className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{t.facFilterBroilers || 'Bio-Broilers'}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${categoryFilter === 'broilers' ? 'bg-[#11271D] text-white' : 'bg-[#E5E3D8] text-[#1B3B2B]'}`}>
                      {broilerFarms.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setCategoryFilter('alaska')}
                    className={`min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      categoryFilter === 'alaska'
                        ? 'bg-[#B45309] text-white shadow-2xs'
                        : 'text-[#5C6572] hover:text-[#1B3B2B]'
                    }`}
                  >
                    <span>❄️ {t.facFilterAlaska || 'Alaska Expansion'}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${categoryFilter === 'alaska' ? 'bg-[#92400E] text-white' : 'bg-[#E5E3D8] text-[#1B3B2B]'}`}>
                      1
                    </span>
                  </button>
                </div>

                {/* Search & Country Filter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-lg">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6572]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.facSearchPlaceholder || 'Search facility, breed, eggs...'}
                      className="w-full min-h-[44px] pl-10 pr-3.5 py-2 bg-white border border-[#E5E3D8] rounded-xl text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                    />
                  </div>

                  <select
                    value={countryFilter}
                    aria-label="Filter by Country"
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="min-h-[44px] px-3.5 py-2 bg-white border border-[#E5E3D8] rounded-xl text-xs font-bold text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B] cursor-pointer"
                  >
                    <option value="all">All Countries ({countries.length})</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c === 'USA' ? 'Alaska (USA)' : `${c} Region`}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* FACILITIES TABLE & CARD LIST (Evenly Spaced Grid) */}
              <div className="bg-white rounded-2xl border border-[#E5E3D8] overflow-hidden shadow-xs">
                
                {/* Table Header */}
                <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#FAF9F5] border-b border-[#E5E3D8] text-[11px] font-bold text-[#5C6572] uppercase tracking-wider">
                  <div className="col-span-4">Facility & Location</div>
                  <div className="col-span-3">Category & Breed Genetics</div>
                  <div className="col-span-2 text-right">Capacity of Birds</div>
                  <div className="col-span-2 text-right">Daily Egg / Output</div>
                  <div className="col-span-1 text-right">Stage</div>
                </div>

                {/* List Items */}
                <div className="divide-y divide-[#F0EFEA]">
                  {filteredCycles.map((facility) => {
                    const isLayer = facility.category === 'layers_eggs';
                    const isCompleted = facility.current_stage === 'completed';
                    const isAlaska = facility.id === 'cyc-alaska-01' || facility.facility_location.includes('Alaska');

                    return (
                      <div
                        key={facility.id}
                        className="p-4 sm:px-6 hover:bg-[#FAF9F5] transition-colors flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 lg:items-center text-xs"
                      >
                        {/* Col 1: Facility & Location */}
                        <div className="lg:col-span-4 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-[#5C6572] bg-[#F7F6F2] px-2 py-0.5 rounded border border-[#E5E3D8]">
                              {facility.cycle_code}
                            </span>
                            <span className="font-bold text-sm text-[#1B3B2B]">{facility.facility_name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#5C6572] text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                            <span>{facility.facility_location}</span>
                            <span className="text-[#C5A059]">·</span>
                            <span className="font-semibold text-[#1B3B2B]">{facility.country}</span>
                          </div>
                        </div>

                        {/* Col 2: Category & Breed Genetics */}
                        <div className="lg:col-span-3 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {facility.category === 'dual_layers_broilers' || (facility.has_layers && facility.has_broilers) ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-950 border border-amber-300">
                                <Egg className="w-3 h-3 text-amber-700" />
                                <Feather className="w-3 h-3 text-emerald-700" />
                                <span>Layers & Broilers</span>
                              </span>
                            ) : isLayer ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                <Egg className="w-3 h-3 text-amber-700" />
                                <span>Layers & Eggs</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                                <Feather className="w-3 h-3 text-emerald-700" />
                                <span>Bio-Broiler</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#4A5568]">
                            Breeds: <strong className="text-[#1B3B2B]">{facility.breed}</strong>
                          </div>
                          {(facility.category === 'broilers' || facility.has_broilers) && (
                            <div className="text-[10px] text-emerald-800 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>Supermarket Off-Take: Clingfilm Sealed Trays</span>
                            </div>
                          )}
                        </div>

                        {/* Col 3: Capacity of Birds */}
                        <div className="lg:col-span-2 lg:text-right flex items-center justify-between lg:justify-end gap-2">
                          <span className="lg:hidden text-[#5C6572] font-semibold text-[11px]">Capacity:</span>
                          <div className="inline-flex flex-col items-end gap-0.5 bg-[#F7F6F2] px-3 py-1.5 rounded-xl border border-[#E5E3D8]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-extrabold text-sm text-[#1B3B2B] tabular-nums">
                                {facility.total_birds.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-[#5C6572] font-semibold">Birds</span>
                            </div>
                            {(facility.layers_count || facility.broilers_count) && (
                              <div className="text-[9px] font-mono text-[#5C6572]">
                                {facility.layers_count ? `${facility.layers_count.toLocaleString()} layers` : ''}
                                {facility.layers_count && facility.broilers_count ? ' + ' : ''}
                                {facility.broilers_count ? `${facility.broilers_count.toLocaleString()} broilers` : ''}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Col 4: Daily Egg / Output */}
                        <div className="lg:col-span-2 lg:text-right flex items-center justify-between lg:justify-end gap-2 text-[11px]">
                          <span className="lg:hidden text-[#5C6572] font-semibold">Output:</span>
                          {facility.daily_egg_capacity ? (
                            <div className="font-mono font-bold text-amber-950">
                              {facility.daily_egg_capacity.toLocaleString()} <span className="text-[10px] font-normal text-[#5C6572]">eggs/day</span>
                              {(facility.category === 'dual_layers_broilers' || facility.has_broilers) && (
                                <span className="block text-[9px] text-emerald-800 font-normal">+ Organic Table Meat</span>
                              )}
                            </div>
                          ) : (
                            <div className="text-[#5C6572] font-mono">
                              {facility.solar_power_kw || 450} kWp Solar
                            </div>
                          )}
                        </div>

                        {/* Col 5: Stage Badge */}
                        <div className="lg:col-span-1 lg:text-right flex items-center justify-between lg:justify-end">
                          <span className="lg:hidden text-[#5C6572] font-semibold">Stage:</span>
                          {isCompleted ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>COMPLETED</span>
                            </span>
                          ) : isAlaska && alaskaProgress < 100 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              {alaskaProgress}% COMMS
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                              {facility.current_stage.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredCycles.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-sm text-[#5C6572]">No production hubs match your current filter criteria.</p>
                  </div>
                )}
              </div>

              {/* Bottom Collapse Button */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    document.getElementById('facilities')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 text-xs font-bold text-[#1B3B2B] hover:text-black underline cursor-pointer"
                >
                  Hide Facilities Directory ▲
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
