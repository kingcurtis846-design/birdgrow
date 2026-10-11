import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ShieldCheck, User, Globe } from 'lucide-react';

interface BottomRoleDockProps {
  currentView: 'public' | 'dashboard' | 'admin';
  setCurrentView: (view: 'public' | 'dashboard' | 'admin') => void;
}

export const BottomRoleDock: React.FC<BottomRoleDockProps> = ({ currentView, setCurrentView }) => {
  const { isAdmin, loginAsAdmin, loginAsInvestor, unreadNotificationCount, t } = usePlatform();

  return (
    <div className="fixed bottom-3 sm:bottom-6 left-3 sm:left-6 z-40 max-w-[calc(100vw-120px)] sm:max-w-none">
      <div className="flex items-center p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-[#DCDAD0] shadow-xl hover:shadow-2xl transition-all gap-0.5 sm:gap-1">
        
        {/* Public Website Button */}
        <button
          onClick={() => setCurrentView('public')}
          className={`min-h-[36px] flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
            currentView === 'public'
              ? 'bg-[#1B3B2B] text-white shadow-xs'
              : 'text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#F7F6F2]'
          }`}
          title={t.navWebsite || 'Return to Public Website'}
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{t.navWebsite || 'Website'}</span>
        </button>

        {/* Investor Portal Button */}
        <button
          onClick={() => {
            if (isAdmin) loginAsInvestor();
            setCurrentView('dashboard');
          }}
          className={`min-h-[36px] flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
            currentView === 'dashboard'
              ? 'bg-[#1B3B2B] text-white shadow-xs'
              : 'text-[#5C6572] hover:text-[#1B3B2B] hover:bg-[#F7F6F2]'
          }`}
          title={t.navInvestorDesk || 'Investor Portal Dashboard'}
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="sm:hidden">{t.navInvestorDesk ? t.navInvestorDesk.split(' ')[0] : 'Investor'}</span>
          <span className="hidden sm:inline">{t.navInvestorDesk || 'Investor Portal'}</span>
        </button>

        {/* Admin Console Button */}
        <button
          onClick={() => {
            if (!isAdmin) loginAsAdmin();
            setCurrentView('admin');
          }}
          className={`min-h-[36px] flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
            currentView === 'admin'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-[#5C6572] hover:text-amber-900 hover:bg-[#F7F6F2]'
          }`}
          title={t.navAdminDesk || 'Executive Admin Operations Desk'}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="sm:hidden">{t.navAdmin || 'Admin'}</span>
          <span className="hidden sm:inline">{t.navAdminDesk || 'Admin Desk'}</span>
          {unreadNotificationCount > 0 && (
            <span className="bg-red-500 text-white text-[9px] sm:text-[10px] px-1 py-0.2 rounded-full font-bold">
              {unreadNotificationCount}
            </span>
          )}
        </button>

      </div>
    </div>
  );
};
