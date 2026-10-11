import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ShieldCheck, X } from 'lucide-react';

export const RiskDisclaimerBanner: React.FC = () => {
  const { t } = usePlatform();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Regulatory Notice" className="bg-[#11271D] text-[#D8DFD9] text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#244D38]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059] shrink-0" />
          <span className="font-bold text-[#F7F6F2] shrink-0">{t.riskNoticeLabel}</span>
          <span className="text-[#A7B6AB] truncate sm:whitespace-normal">
            {t.riskBanner}
          </span>
        </div>
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setDismissed(true)}
            className="text-[#A7B6AB] hover:text-[#F7F6F2] transition-colors p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
            title={t.dismissNotice || 'Dismiss notice'}
            aria-label={t.dismissNotice || 'Dismiss notice'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
