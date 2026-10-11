import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Headphones } from 'lucide-react';

interface FloatingChatButtonProps {
  onOpenHumanSupport: () => void;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onOpenHumanSupport }) => {
  const { unreadDirectCount, t } = usePlatform();

  return (
    <div className="fixed bottom-3 sm:bottom-6 right-3 sm:right-6 z-40">
      {/* Live Human Support Desk (Routes directly to Admin Operations Desk & Email jayjaybusiness05@gmail.com) */}
      <button
        onClick={onOpenHumanSupport}
        className="group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#11271D] hover:bg-[#0A1811] text-white rounded-full shadow-xl hover:shadow-2xl border-2 border-amber-500/60 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer min-h-[44px]"
        aria-label="Open Live Human Support Desk"
        title="Live Human Support Desk (Dispatched to Admin & Email)"
      >
        <div className="relative flex items-center justify-center">
          <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#11271D] animate-pulse" />
        </div>
        <div className="text-left hidden md:block">
          <div className="text-[11px] font-extrabold flex items-center gap-1 text-white">
            <span>{t.navHumanSupport || 'Human Support'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="text-[9px] text-amber-300 font-mono">{t.navOperationsDesk || 'Operations Desk'}</div>
        </div>
        <span className="text-[11px] font-bold md:hidden">Support</span>

        {unreadDirectCount > 0 && (
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
        )}
      </button>
    </div>
  );
};
