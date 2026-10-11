import React, { useState, useEffect } from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/public/Hero';
import { WhyPoultry } from './components/public/WhyPoultry';
import { HowItWorks } from './components/public/HowItWorks';
import { FacilitiesSection } from './components/public/FacilitiesSection';
import { YieldCalculator } from './components/public/YieldCalculator';
import { PlansSection } from './components/public/PlansSection';
import { TestimonialsSection } from './components/public/TestimonialsSection';
import { ReferralSection } from './components/public/ReferralSection';
import { InvestorDashboard } from './components/dashboard/InvestorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { DepositModal } from './components/common/DepositModal';
import { WithdrawalModal } from './components/common/WithdrawalModal';
import { InvestModal } from './components/common/InvestModal';
import { KycModal } from './components/common/KycModal';
import { ReviewModal } from './components/common/ReviewModal';
import { FloatingChatButton } from './components/chat/FloatingChatButton';
import { HumanSupportModal } from './components/chat/HumanSupportModal';
import { InvestmentPlan } from './types';

const MainApp: React.FC = () => {
  const { plans, isAuthenticated, isAdmin, loginAsAdmin, currency, convertAmount } = usePlatform();
  const [currentView, setCurrentView] = useState<'public' | 'dashboard' | 'admin'>('public');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isHumanSupportOpen, setIsHumanSupportOpen] = useState(false);
  const [selectedPlanForInvest, setSelectedPlanForInvest] = useState<InvestmentPlan | null>(null);
  const [selectedHorizonPlanId, setSelectedHorizonPlanId] = useState<string>('plan-21d-84pct');
  const [investInitialAmount, setInvestInitialAmount] = useState<number>(() => convertAmount(5000));

  // If user accesses dashboard while unauthenticated, trigger auth modal
  const handleNavigateView = (view: 'public' | 'dashboard' | 'admin') => {
    if (view === 'dashboard' && !isAuthenticated) {
      setIsAuthOpen(true);
      return;
    }
    if (view === 'admin' && !isAdmin) {
      setIsAuthOpen(true);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Requirement: when a yield horizon is selected, let there be a border highlight to indicate selection
  // and it should then take you to the product horizon where you put your details
  const handleSelectPlanFromYieldHorizons = (plan: InvestmentPlan) => {
    setSelectedHorizonPlanId(plan.id);
    setSelectedPlanForInvest(plan);
    setInvestInitialAmount(convertAmount(plan.min_amount));
    const calculatorEl = document.getElementById('calculator');
    if (calculatorEl) {
      calculatorEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTierFromCalculator = (planId: string, amount: number) => {
    const matched = plans.find((p) => p.id === planId) || null;
    setSelectedPlanForInvest(matched);
    setSelectedHorizonPlanId(planId);
    setInvestInitialAmount(amount);
    if (!isAuthenticated) {
      setIsAuthOpen(true);
    } else {
      setIsInvestOpen(true);
    }
  };

  const handleSelectPlanFromFooter = (planId: string) => {
    const matched = plans.find((p) => p.id === planId) || plans[0];
    setSelectedPlanForInvest(matched);
    setSelectedHorizonPlanId(matched.id);
    setInvestInitialAmount(convertAmount(matched.min_amount));

    if (currentView === 'dashboard') {
      setIsInvestOpen(true);
    } else {
      setCurrentView('public');
      setTimeout(() => {
        const el = document.getElementById('plans');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    if (currentView === 'dashboard' && (sectionId === 'plans' || sectionId === 'investor-plans')) {
      const el = document.getElementById('investor-plans');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      setIsInvestOpen(true);
      return;
    }
    setCurrentView('public');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F6F2] text-[#1B3B2B] font-sans">
      {/* Regulatory Risk Notice Banner */}
      

      {/* Top Bar Navigation Contract */}
      <Navbar
        currentView={currentView}
        setCurrentView={handleNavigateView}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDeposit={() => setIsDepositOpen(true)}
        onOpenInvest={() => {
          if (!isAuthenticated) setIsAuthOpen(true);
          else setIsInvestOpen(true);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'public' && (
          <>
            <Hero
              onExplorePlans={() => {
                document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenCalculator={() => {
                document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
            {/* Investment Plans brought up prominently with border highlight on selection */}
            <PlansSection
              onSelectPlan={handleSelectPlanFromYieldHorizons}
              selectedPlanId={selectedHorizonPlanId}
            />
            {/* Interactive Production Horizon & Yield Engine */}
            <YieldCalculator
              selectedPlanId={selectedHorizonPlanId}
              onSelectPlanId={setSelectedHorizonPlanId}
              onSelectTierToInvest={handleSelectTierFromCalculator}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
            <WhyPoultry />
            <HowItWorks />
            <FacilitiesSection />
            <ReferralSection
              onOpenAuth={() => setIsAuthOpen(true)}
              onNavigateToDashboard={() => setCurrentView('dashboard')}
            />
            <TestimonialsSection onOpenReview={() => setIsReviewOpen(true)} />
          </>
        )}

        {currentView === 'dashboard' && (
          <InvestorDashboard
            onOpenDeposit={() => setIsDepositOpen(true)}
            onOpenWithdrawal={() => setIsWithdrawalOpen(true)}
            onOpenInvest={(plan) => {
              setSelectedPlanForInvest(plan || null);
              setIsInvestOpen(true);
            }}
            onOpenKyc={() => setIsKycOpen(true)}
            onOpenReview={() => setIsReviewOpen(true)}
          />
        )}

        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* European Agri-Fintech Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onSelectPlan={handleSelectPlanFromFooter}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Interactive Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(targetRole?: 'admin' | 'dashboard') => {
          if (targetRole === 'admin') {
            setCurrentView('admin');
          } else {
            setCurrentView('dashboard');
          }
        }}
      />

      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
      />

      <WithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        onOpenKyc={() => setIsKycOpen(true)}
      />

      <InvestModal
        isOpen={isInvestOpen}
        onClose={() => setIsInvestOpen(false)}
        selectedPlan={selectedPlanForInvest}
        initialAmount={investInitialAmount}
        onOpenDeposit={() => setIsDepositOpen(true)}
      />

      <KycModal
        isOpen={isKycOpen}
        onClose={() => setIsKycOpen(false)}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />

      {/* Floating Chat Launchers (AI Support & Live Human Support) */}
      <FloatingChatButton onOpenHumanSupport={() => setIsHumanSupportOpen(true)} />

      {/* Human Support Modal (Direct to Dashboard & Email jayjaybusiness05@gmail.com) */}
      <HumanSupportModal
        isOpen={isHumanSupportOpen}
        onClose={() => setIsHumanSupportOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <MainApp />
    </PlatformProvider>
  );
}
