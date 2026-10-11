import React from 'react';
import { ShieldCheck, Leaf, CheckCircle2, ArrowRight } from 'lucide-react';
import { Logo } from '../common/Logo';
import { usePlatform } from '../../context/PlatformContext';

interface FooterProps {
  onNavigateSection?: (sectionId: string) => void;
  onOpenAuth?: () => void;
  onSelectPlan?: (planId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenAuth, onSelectPlan }) => {
  const { formatCurrentCurrency, t } = usePlatform();
  const handleSectionClick = (sectionId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlanClick = (planId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onSelectPlan) {
      onSelectPlan(planId);
    } else if (onNavigateSection) {
      onNavigateSection('plans');
    } else {
      const el = document.getElementById('plans');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#11271D] text-[#D8DFD9] border-t border-[#244D38] pt-12 sm:pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-[#244D38]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <Logo size="lg" variant="light" />
              <span className="text-2xl font-black tracking-tight text-[#F7F6F2]">
                Bird<span className="text-[#C5A059]">Grow</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A7B6AB] max-w-sm leading-relaxed">
              {t.footerAbout || 'Sustainable European poultry farming investment platform connecting private and institutional capital with transparent, bio-secure agricultural production cycles and reliable returns.'}
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-[#C5A059]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#C5A059]" />
                <span>{t.footerOperatingReg || 'Operating in accordance with EU Crowdfunding Regulation (ECSP 2020/1503)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 shrink-0 text-[#C5A059]" />
                <span>{t.footerNonGmoNotice || '100% Non-GMO EU Feed Standard & Verified Solar-Powered Facilities'}</span>
              </div>
            </div>
          </div>

          {/* Column 1: Investment Solutions */}
          <div>
            <button
              type="button"
              onClick={(e) => handleSectionClick('plans', e)}
              className="group text-xs font-semibold uppercase tracking-wider text-[#F7F6F2] mb-4 hover:text-[#C5A059] transition-colors flex items-center gap-1.5 cursor-pointer text-left min-h-[32px]"
            >
              <span>{t.navPlans || 'Investment Plans'}</span>
              <span className="text-[10px] text-[#C5A059] opacity-80 group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
            <ul className="space-y-2 text-xs sm:text-sm text-[#A7B6AB]">
              <li>
                <button
                  type="button"
                  onClick={(e) => handlePlanClick('plan-15d-50pct', e)}
                  className="hover:text-[#F7F6F2] hover:text-[#C5A059] transition-colors text-left cursor-pointer flex items-center gap-1.5 group w-full py-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/60 group-hover:bg-[#C5A059] shrink-0"></span>
                  <span>Starter Plan (15d · 50% ROI)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handlePlanClick('plan-21d-84pct', e)}
                  className="hover:text-[#F7F6F2] hover:text-[#C5A059] transition-colors text-left cursor-pointer flex items-center gap-1.5 group w-full py-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/60 group-hover:bg-[#C5A059] shrink-0"></span>
                  <span>Growth Plan (21d · 84% ROI)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handlePlanClick('plan-30d-150pct', e)}
                  className="hover:text-[#F7F6F2] hover:text-[#C5A059] transition-colors text-left cursor-pointer flex items-center gap-1.5 group w-full py-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/60 group-hover:bg-[#C5A059] shrink-0"></span>
                  <span>Commercial Plan (30d · 150% ROI)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handlePlanClick('plan-60d-320pct', e)}
                  className="hover:text-[#F7F6F2] hover:text-[#C5A059] transition-colors text-left cursor-pointer flex items-center gap-1.5 group w-full py-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/60 group-hover:bg-[#C5A059] shrink-0"></span>
                  <span>Enterprise Plan (60d · 320% ROI)</span>
                </button>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={(e) => handleSectionClick('calculator', e)}
                  className="text-xs text-[#C5A059] hover:text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer py-1"
                >
                  <span>{t.calcTitle || 'Interactive Yield Calculator'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleSectionClick('referrals', e)}
                  className="text-xs text-emerald-400 hover:text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer py-1"
                >
                  <span>{t.navReferrals || 'Refer & Earn'} (Up to {formatCurrentCurrency(245050, false)} / Cycle)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: European Facilities */}
          <div>
            <button
              type="button"
              onClick={(e) => handleSectionClick('facilities', e)}
              className="group text-xs font-semibold uppercase tracking-wider text-[#F7F6F2] mb-4 hover:text-[#C5A059] transition-colors flex items-center gap-1.5 cursor-pointer text-left min-h-[32px]"
            >
              <span>{t.navFacilities || 'Production Hubs'} (30+ Farms)</span>
              <span className="text-[10px] text-[#C5A059] opacity-80 group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
            <ul className="space-y-2 text-xs sm:text-sm text-[#A7B6AB]">
              <li>
                <button
                  type="button"
                  onClick={(e) => handleSectionClick('facilities', e)}
                  className="hover:text-[#F7F6F2] transition-colors text-left cursor-pointer py-1 block w-full"
                >
                  Layers & Organic Egg Hubs (21 Farms · 65%)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleSectionClick('facilities', e)}
                  className="hover:text-[#F7F6F2] transition-colors text-left cursor-pointer py-1 block w-full"
                >
                  Pastured Bio-Broiler Centers (11 Farms)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleSectionClick('facilities', e)}
                  className="hover:text-[#F7F6F2] transition-colors text-left cursor-pointer py-1 block w-full"
                >
                  Alaska Arctic Sub-Zero Bio-Dome (Opening Soon)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleSectionClick('facilities', e)}
                  className="hover:text-[#F7F6F2] transition-colors text-left cursor-pointer py-1 block w-full"
                >
                  Bavaria, Utrecht & Normandy Flagships
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleSectionClick('facilities', e)}
                  className="hover:text-[#F7F6F2] text-[#6E7B74] transition-colors text-left cursor-pointer py-1 block w-full"
                >
                  Bio-Security Level 3 Sanitization
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Compliance & Payments */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F7F6F2] mb-4 min-h-[32px] flex items-center">
              {t.footerSettlement || 'Settlement & Safety'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#A7B6AB]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{t.footerBtcEth || 'Bitcoin (BTC) & Ethereum (ETH) Settlement'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{t.footerUsdtUsdc || 'Tether (USDT TRC20/ERC20) & USDC Stablecoins'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{t.footerEscrow || 'Tier 1 Custodial Escrow'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{t.footerAmlKyc || 'EU AML & KYC Verification'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclosure Bottom */}
        <div className="pt-8 text-xs text-[#7D8E81] space-y-3 leading-relaxed">
          <p>
            <strong className="text-[#A7B6AB]">Regulatory & Risk Notice:</strong> {t.footerRiskDisclaimer || 'Investing in agricultural production contracts involves biological risks, weather volatility, feed price fluctuations, and operational variances. Past cycle yields do not guarantee identical future results. Expected returns are modeled based on verified long-term off-take agreements with European grocery retail chains and certified food processors.'}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1C3628]">
            <p>© {new Date().getFullYear()} BirdGrow European Agri-Fintech S.A. {t.footerAllRightsReserved || 'All rights reserved.'}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
