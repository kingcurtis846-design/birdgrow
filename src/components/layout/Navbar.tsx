import React, { useState, useEffect, useRef } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  ShieldCheck,
  User,
  LogOut,
  ArrowRight,
  Globe,
  Menu,
  X,
  Coins,
  Award,
  Home,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { Language, Currency } from '../../types';

interface NavbarProps {
  currentView: 'public' | 'dashboard' | 'admin';
  setCurrentView: (view: 'public' | 'dashboard' | 'admin') => void;
  onOpenAuth: (mode?: 'login' | 'register' | 'admin') => void;
  onOpenInvest?: () => void;
  onOpenDeposit?: () => void;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

const CURRENCIES: { code: Currency; symbol: string; label: string; isNative?: boolean }[] = [
  { code: 'EUR', symbol: '€', label: 'EUR (€) · Native', isNative: true },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenAuth,
  onOpenInvest,
  onOpenDeposit,
}) => {
  const {
    currentUser,
    isAuthenticated,
    isAdmin,
    loginAsInvestor,
    logout,
    language,
    setLanguage,
    currency,
    setCurrency,
    formatCurrentCurrencyCompact,
    unreadNotificationCount,
    t,
  } = usePlatform();

  // Dropdown states
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currencyRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setIsCurrencyMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(target)) {
        setIsLangMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCurrencyMenuOpen(false);
        setIsLangMenuOpen(false);
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavClick = (sectionId?: string) => {
    setIsMobileMenuOpen(false);
    if (!sectionId) {
      setCurrentView('public');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentView !== 'public') {
      setCurrentView('public');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSwitchProfile = (target: 'public' | 'investor' | 'admin') => {
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);

    if (target === 'public') {
      setCurrentView('public');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'investor') {
      if (isAdmin) {
        loginAsInvestor();
      }
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'admin') {
      // SECURITY FIX: Never auto-login as admin without credentials!
      if (!isAdmin) {
        onOpenAuth('admin');
        return;
      }
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F6F2]/95 backdrop-blur-md border-b border-[#E5E3D8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 lg:hidden text-[#1B3B2B] hover:bg-[#EAE8E0] rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle Mobile Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              setCurrentView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left cursor-pointer group"
          >
            <Logo size="md" variant="default" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1B3B2B] leading-none">
                Bird<span className="text-[#C5A059]">Grow</span>
              </span>
              <span className="hidden md:block text-[9px] font-mono uppercase tracking-widest text-[#5C6572] leading-none mt-1">
                Agri-Fintech · EU
              </span>
            </div>
          </button>
        </div>

        {/* Center: Primary Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs font-semibold text-[#2D3748]">
          <button
            onClick={() => handleNavClick()}
            className={`transition-colors hover:text-[#1B3B2B] cursor-pointer flex items-center gap-1.5 ${
              currentView === 'public' ? 'text-[#1B3B2B] font-extrabold' : ''
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t.navOverview || 'Home'}</span>
          </button>
          <a
            href="#plans"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('plans');
            }}
            className="hover:text-[#1B3B2B] transition-colors cursor-pointer"
          >
            {t.navPlans}
          </a>
          <a
            href="#calculator"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('calculator');
            }}
            className="hover:text-[#1B3B2B] transition-colors cursor-pointer"
          >
            {t.navCalculator}
          </a>
          <a
            href="#facilities"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('facilities');
            }}
            className="hover:text-[#1B3B2B] transition-colors cursor-pointer"
          >
            {t.navFacilities}
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('how-it-works');
            }}
            className="hover:text-[#1B3B2B] transition-colors cursor-pointer"
          >
            {t.navHowItWorks}
          </a>
          <a
            href="#referrals"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('referrals');
            }}
            className="flex items-center gap-1.5 text-[#C5A059] hover:text-[#1B3B2B] font-bold transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t.navReferrals}</span>
            <span className="text-[10px] bg-[#C5A059] text-[#11271D] font-black px-1.5 py-0.2 rounded">
              +{formatCurrentCurrencyCompact(124300)}
            </span>
          </a>
        </nav>

        {/* Right: Currency, Language & Profile Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* CURRENCY SELECTOR DROPDOWN */}
          <div className="hidden md:block relative" ref={currencyRef}>
            <button
              onClick={() => {
                setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
                setIsLangMenuOpen(false);
                setIsProfileMenuOpen(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#DCDAD0] bg-white text-xs font-bold text-[#1B3B2B] hover:border-[#1B3B2B] transition-all cursor-pointer shadow-2xs"
              title="Platform Currency (EUR € Native, USD $, GBP £)"
              aria-expanded={isCurrencyMenuOpen}
            >
              <Coins className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{currency}</span>
              <ChevronDown className={`w-3 h-3 text-[#5C6572] transition-transform duration-200 ${isCurrencyMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCurrencyMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-[#E5E3D8] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#5C6572] border-b border-[#F0EFEA]">
                  Select Currency
                </div>
                {CURRENCIES.map((curr) => {
                  const isSelected = currency === curr.code;
                  return (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code);
                        setIsCurrencyMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#F7F6F2] font-extrabold text-[#1B3B2B]'
                          : 'text-[#4A5568] hover:bg-[#F0EFEA]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{curr.label}</span>
                      </div>
                      {curr.isNative && (
                        <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1 rounded">
                          Native
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* LANGUAGE SELECTOR DROPDOWN */}
          <div className="hidden md:block relative" ref={langRef}>
            <button
              onClick={() => {
                setIsLangMenuOpen(!isLangMenuOpen);
                setIsCurrencyMenuOpen(false);
                setIsProfileMenuOpen(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#DCDAD0] bg-white text-xs font-bold text-[#1B3B2B] hover:border-[#1B3B2B] transition-all cursor-pointer shadow-2xs"
              title="Change Language"
              aria-expanded={isLangMenuOpen}
            >
              <Globe className="w-3.5 h-3.5 text-[#5C6572]" />
              <span className="uppercase">{language}</span>
              <ChevronDown className={`w-3 h-3 text-[#5C6572] transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl border border-[#E5E3D8] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#5C6572] border-b border-[#F0EFEA]">
                  Select Language
                </div>
                {LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#F7F6F2] font-extrabold text-[#1B3B2B]'
                          : 'text-[#4A5568] hover:bg-[#F0EFEA]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* PROFILE & ROLE SWITCHER */}
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                  setIsCurrencyMenuOpen(false);
                  setIsLangMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#DCDAD0] bg-white hover:border-[#1B3B2B] text-xs text-[#1B3B2B] transition-all cursor-pointer shadow-2xs group"
                aria-expanded={isProfileMenuOpen}
                title="Account profile and role switcher"
              >
                <div className="w-6 h-6 rounded-lg bg-[#1B3B2B] text-white flex items-center justify-center font-bold text-[10px]">
                  {isAdmin
                    ? 'AD'
                    : currentUser?.full_name
                    ? currentUser.full_name.trim().split(/\s+/).map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
                    : 'BG'}
                </div>
                <span className="font-extrabold truncate max-w-[130px] hidden sm:block">
                  {currentUser?.full_name || (isAdmin ? 'Operations Admin' : 'Investor')}
                </span>
                <ChevronDown className={`w-3 h-3 text-[#5C6572] transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E5E3D8] shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100">

                  {/* Active Profile Info Header */}
                  <div className="p-2.5 bg-[#F7F6F2] rounded-xl border border-[#E5E3D8] flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#1B3B2B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {isAdmin
                        ? 'AD'
                        : currentUser?.full_name
                        ? currentUser.full_name.trim().split(/\s+/).map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
                        : 'BG'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#1B3B2B] truncate">
                          {currentUser?.full_name || (isAdmin ? 'Operations Admin' : 'Investor')}
                        </span>
                        {currentUser?.kyc_status === 'verified' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-[#5C6572] truncate">
                        {currentUser?.email || (isAdmin ? 'compliance@birdgrow.eu' : '')}
                      </div>
                      
                      {/* VERIFIED STATUS ONLY ON COMPLETED KYC */}
                      <div className={`text-[10px] font-semibold mt-0.5 ${
                        isAdmin
                          ? 'text-amber-800'
                          : currentUser?.kyc_status === 'verified'
                          ? 'text-emerald-700'
                          : currentUser?.kyc_status === 'pending'
                          ? 'text-amber-700'
                          : 'text-red-700'
                      }`}>
                        {isAdmin
                          ? '🛡️ Operations Desk'
                          : currentUser?.kyc_status === 'verified'
                          ? '✓ Verified Investor'
                          : currentUser?.kyc_status === 'pending'
                          ? '⏳ KYC Under Review'
                          : '⚠️ Unverified Account'}
                      </div>
                    </div>
                  </div>

                  {/* Switch Views Section */}
                  <div className="space-y-1 mt-2">
                    <div className="text-[10px] uppercase font-bold text-[#5C6572] px-1 pb-1">
                      Switch Role / View:
                    </div>

                    {/* Home */}
                    <button
                      onClick={() => handleSwitchProfile('public')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentView === 'public'
                          ? 'bg-[#1B3B2B] text-white'
                          : 'hover:bg-[#F7F6F2] text-[#1B3B2B]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Home className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Home (Public Website)</span>
                      </div>
                      {currentView === 'public' && (
                        <span className="text-[9px] bg-[#C5A059] text-[#11271D] px-1.5 rounded font-black">
                          ACTIVE
                        </span>
                      )}
                    </button>

                    {/* Investor Portal */}
                    <button
                      onClick={() => handleSwitchProfile('investor')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentView === 'dashboard' && !isAdmin
                          ? 'bg-[#1B3B2B] text-white'
                          : 'hover:bg-[#F7F6F2] text-[#1B3B2B]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Investor Portal</span>
                      </div>
                      {currentView === 'dashboard' && !isAdmin && (
                        <span className="text-[9px] bg-[#C5A059] text-[#11271D] px-1.5 rounded font-black">
                          ACTIVE
                        </span>
                      )}
                    </button>

                    {/* Executive Admin Console - ONLY visible to verified admins */}
                    {isAdmin && (
                      <button
                        onClick={() => handleSwitchProfile('admin')}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentView === 'admin'
                            ? 'bg-amber-900 text-white'
                            : 'hover:bg-amber-50 text-amber-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                          <span>Admin Console</span>
                        </div>
                        {unreadNotificationCount > 0 && currentView !== 'admin' && (
                          <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                            {unreadNotificationCount}
                          </span>
                        )}
                        {currentView === 'admin' && (
                          <span className="text-[9px] bg-[#C5A059] text-[#11271D] px-1.5 rounded font-black">
                            ACTIVE
                          </span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Quick CTAs */}
                  <div className="pt-2 border-t border-[#E5E3D8] grid grid-cols-2 gap-2 mt-2">
                    {onOpenDeposit && (
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenDeposit();
                        }}
                        className="py-1.5 px-2 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold rounded-lg transition-colors text-center cursor-pointer"
                      >
                        Deposit
                      </button>
                    )}
                    {onOpenInvest && (
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenInvest();
                        }}
                        className="py-1.5 px-2 bg-[#C5A059] hover:bg-[#B38F46] text-[#11271D] text-xs font-black rounded-lg transition-colors text-center cursor-pointer"
                      >
                        Invest
                      </button>
                    )}
                  </div>

                  {/* Sign Out */}
                  <div className="pt-1 border-t border-[#E5E3D8] mt-2">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-red-700 hover:bg-red-50 rounded-lg transition-colors font-semibold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.navSignOut}</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-[#1B3B2B] hover:text-[#11271D] transition-colors cursor-pointer"
              >
                {t.navSignIn}
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#1B3B2B] hover:bg-[#11271D] rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>{t.navStartInvesting}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* MOBILE COLLAPSIBLE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E3D8] bg-[#F7F6F2] px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-md">
          {/* Mobile Currency & Language Selector Row */}
          <div className="flex items-center justify-between gap-2 pt-1 pb-2 border-b border-[#E5E3D8]">
            <button
              onClick={() => {
                setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
                setIsLangMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white border border-[#DCDAD0] text-xs font-bold text-[#1B3B2B]"
            >
              <span>Currency: {currency}</span>
            </button>
            <button
              onClick={() => {
                setIsLangMenuOpen(!isLangMenuOpen);
                setIsCurrencyMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white border border-[#DCDAD0] text-xs font-bold text-[#1B3B2B]"
            >
              <span>Language</span>
            </button>
          </div>

          {isAuthenticated && (
            <div className="p-3 bg-white rounded-xl border border-[#DCDAD0] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#1B3B2B]">
                <span>Switch Profile / View:</span>
                <span className="text-[10px] text-[#C5A059]">{isAdmin ? 'Admin' : 'Investor'}</span>
              </div>
              <div className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 text-xs font-bold`}>
                <button
                  onClick={() => handleSwitchProfile('public')}
                  className={`p-2 rounded-lg text-center cursor-pointer ${currentView === 'public' ? 'bg-[#1B3B2B] text-white' : 'bg-[#F7F6F2] text-[#1B3B2B]'}`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleSwitchProfile('investor')}
                  className={`p-2 rounded-lg text-center cursor-pointer ${currentView === 'dashboard' && !isAdmin ? 'bg-[#1B3B2B] text-white' : 'bg-[#F7F6F2] text-[#1B3B2B]'}`}
                >
                  Investor
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleSwitchProfile('admin')}
                    className={`p-2 rounded-lg text-center cursor-pointer ${currentView === 'admin' ? 'bg-amber-900 text-white' : 'bg-[#F7F6F2] text-amber-900'}`}
                  >
                    Admin
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#1B3B2B]">
            <button
              onClick={() => handleNavClick()}
              className="p-2.5 rounded-xl bg-white border border-[#DCDAD0] text-left flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{t.navOverview || 'Home'}</span>
            </button>
            <button
              onClick={() => handleNavClick('plans')}
              className="p-2.5 rounded-xl bg-white border border-[#DCDAD0] text-left font-bold text-[#1B3B2B] cursor-pointer"
            >
              {t.navPlans}
            </button>
            <button
              onClick={() => handleNavClick('calculator')}
              className="p-2.5 rounded-xl bg-white border border-[#DCDAD0] text-left cursor-pointer"
            >
              {t.navCalculator}
            </button>
            <button
              onClick={() => handleNavClick('facilities')}
              className="p-2.5 rounded-xl bg-white border border-[#DCDAD0] text-left cursor-pointer"
            >
              {t.navFacilities}
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="p-2.5 rounded-xl bg-white border border-[#DCDAD0] text-left cursor-pointer"
            >
              {t.navHowItWorks}
            </button>
            <button
              onClick={() => handleNavClick('referrals')}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-[#C5A059] text-left flex items-center justify-between col-span-2 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{t.navReferrals}</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};