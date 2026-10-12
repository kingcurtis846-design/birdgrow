import React, { useState, useRef } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Award,
  Sparkles,
  Globe2,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { usePlatform, normalizeReviewLanguage } from '../../context/PlatformContext';

interface TestimonialsSectionProps {
  onOpenReview?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onOpenReview }) => {
  const { reviews, hasInvested, t, selectedLanguage, setSelectedLanguage, languageCounts } = usePlatform();
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Requirement: Display reviews approved by admin and matching normalized language
  const approvedReviews = reviews.filter((r) => {
    const isApproved = r.status === 'approved' || (!r.status && r.verified);
    const normalizedLang = normalizeReviewLanguage(r.language);
    const matchesLanguage = selectedLanguage === 'all' || normalizedLang === selectedLanguage.toLowerCase();
    return isApproved && matchesLanguage;
  });

  // Duplicate list to achieve continuous seamless loop
  const duplicatedReviews = [...approvedReviews, ...approvedReviews];

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section id="testimonials" className="py-14 sm:py-24 bg-[#F7F6F2] scroll-mt-20 overflow-hidden relative">
      {/* Decorative background lines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 sm:space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1B3B2B]/10 text-[#1B3B2B] border border-[#1B3B2B]/20">
              <Globe2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>{t.revNetworkBadge || 'Global Investor Network'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1B3B2B]">
              {t.revTitle || 'Real Yield. Verified Across 6 Continents.'}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#5C6572] leading-relaxed">
              {t.revDesc || 'Family offices, sovereign wealth desks, and private agricultural allocators from Tokyo to Austin compound returns on BirdGrow. Watch their verified harvest reviews glide through in real time.'}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex flex-wrap gap-2 my-4">
              <button
                onClick={() => setSelectedLanguage('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${selectedLanguage === 'all' ? 'bg-[#1B3B2B] text-white' : 'bg-white text-[#1B3B2B] border border-[#DCDAD0]'}`}
              >
                All ({languageCounts.all})
              </button>
              <button
                onClick={() => setSelectedLanguage('zh')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${selectedLanguage === 'zh' ? 'bg-[#1B3B2B] text-white' : 'bg-white text-[#1B3B2B] border border-[#DCDAD0]'}`}
              >
                🇨🇳 Chinese ({languageCounts.zh})
              </button>
              <button
                onClick={() => setSelectedLanguage('fr')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${selectedLanguage === 'fr' ? 'bg-[#1B3B2B] text-white' : 'bg-white text-[#1B3B2B] border border-[#DCDAD0]'}`}
              >
                🇫🇷 French ({languageCounts.fr})
              </button>
              <button
                onClick={() => setSelectedLanguage('es')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${selectedLanguage === 'es' ? 'bg-[#1B3B2B] text-white' : 'bg-white text-[#1B3B2B] border border-[#DCDAD0]'}`}
              >
                🇪🇸 Spanish ({languageCounts.es})
              </button>
              <button
                onClick={() => setSelectedLanguage('hi')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${selectedLanguage === 'hi' ? 'bg-[#1B3B2B] text-white' : 'bg-white text-[#1B3B2B] border border-[#DCDAD0]'}`}
              >
                🇮🇳 Hindi ({languageCounts.hi})
              </button>
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${selectedLanguage === 'en' ? 'bg-[#1B3B2B] text-white' : 'bg-white text-[#1B3B2B] border border-[#DCDAD0]'}`}
              >
                🌐 English ({languageCounts.en})
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {onOpenReview && (
                <button
                  onClick={onOpenReview}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#11271D] text-white font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <Award className="w-4 h-4 text-[#C5A059]" />
                  <span>{t.revDropReview || 'Drop a Review'}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              )}

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#DCDAD0] shadow-2xs">
                <button
                  onClick={handleScrollLeft}
                  aria-label={t.revScrollLeft || 'Scroll reviews left'}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#1B3B2B] hover:bg-[#F7F6F2] transition-colors cursor-pointer"
                  title={t.revScrollLeft || 'Scroll Left'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  aria-label={isPaused ? (t.revGliding || 'Resume Glide') : (t.revPaused || 'Pause Glide')}
                  className="px-2.5 h-9 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-[#1B3B2B] hover:bg-[#F7F6F2] transition-colors cursor-pointer"
                  title={isPaused ? 'Resume glide' : 'Pause glide'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 text-[#16A34A]" /> : <Pause className="w-3.5 h-3.5 text-[#5C6572]" />}
                  <span className="text-[11px] font-mono">{isPaused ? (t.revPaused || 'Paused') : (t.revGliding || 'Gliding')}</span>
                </button>

                <button
                  onClick={handleScrollRight}
                  aria-label={t.revScrollRight || 'Scroll reviews right'}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#1B3B2B] hover:bg-[#F7F6F2] transition-colors cursor-pointer"
                  title={t.revScrollRight || 'Scroll Right'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Hubs Badges Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 sm:py-3 mt-4 text-xs font-mono text-[#5C6572] border-t border-[#E5E3D8]/80 no-scrollbar">
          <span className="font-bold text-[#1B3B2B] shrink-0 uppercase tracking-wider text-[10px] sm:text-[11px]">
            {t.revAllocatorsTitle || 'Worldwide Allocators:'}
          </span>
          <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3D8] shrink-0 text-[11px]">🇯🇵 Tokyo</span>
          <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3D8] shrink-0 text-[11px]">🇦🇪 Dubai</span>
          <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3D8] shrink-0 text-[11px]">🇨🇭 Zurich</span>
          <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3D8] shrink-0 text-[11px]">🇺🇸 Austin, TX</span>
          <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3D8] shrink-0 text-[11px]">🇸🇬 Singapore</span>
          <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3D8] shrink-0 text-[11px]">🇧🇷 São Paulo</span>
          <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3D8] shrink-0 text-[11px]">🇨🇦 Toronto</span>
          <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3D8] shrink-0 text-[11px]">🇦🇺 Melbourne</span>
          <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3D8] shrink-0 text-[11px]">🇩🇪 Munich</span>
          <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3D8] shrink-0 text-[11px]">🇳🇴 Oslo</span>
        </div>
      </div>

      {/* Infinite Gliding Track (Glides right to left) */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar py-2 sm:py-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div
          className="animate-glide-left flex gap-4 sm:gap-6 px-4"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedReviews.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[280px] sm:w-[360px] md:w-[400px] bg-white p-5 sm:p-7 rounded-2xl border border-[#E5E3D8] shadow-xs hover:border-[#1B3B2B] transition-all flex flex-col justify-between shrink-0 group hover:shadow-md"
            >
              <div className="space-y-3 sm:space-y-3.5">
                {/* Top: Stars + Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-current" />
                    ))}
                  </div>

                  {item.verified && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
                      <span>{t.revVerifiedInvestor || 'Verified Harvest'}</span>
                    </span>
                  )}
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-[#2D3748] leading-relaxed italic line-clamp-5">
                  "{item.quote}"
                </p>
              </div>

              {/* Bottom: Investment Option Label + Author details */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-[#F0EFEA] space-y-2.5 sm:space-y-3">
                <div className="bg-[#FAF9F5] p-2 sm:p-2.5 rounded-xl border border-[#E5E3D8] text-[11px] sm:text-xs font-mono font-medium text-[#1B3B2B] flex items-center gap-2 group-hover:border-[#1B3B2B]/40 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span className="truncate">{item.yieldAchieved}</span>
                </div>

                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#1B3B2B] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#5C6572] truncate">{item.role}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-[#1B3B2B] bg-[#F7F6F2] px-2 py-0.5 rounded border border-[#E5E3D8]">
                      <MapPin className="w-3 h-3 text-[#C5A059]" />
                      <span>{item.city}</span>
                    </span>
                    <div className="text-[9px] sm:text-[10px] font-mono text-[#5C6572] mt-0.5">
                      {item.portfolio}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Hint */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 text-center">
        <span className="text-[11px] text-[#5C6572] font-mono">
          ← Hover or touch any review card to pause glide →
        </span>
      </div>
    </section>
  );
};