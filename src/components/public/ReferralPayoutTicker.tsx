import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface ReferralPayoutEvent {
  id: string;
  name: string;
  location: string;
  countryCode: string;
  flag: string;
  milestoneName: string;
  amount: number;
  referrerType: 'basic' | 'investor';
}

const RECENT_PAYOUTS: ReferralPayoutEvent[] = [
  {
    id: 'pay-01',
    name: 'Lukas Weber',
    location: 'Munich',
    countryCode: 'DE',
    flag: '🇩🇪',
    milestoneName: 'Seedling Pioneer',
    amount: 25,
    referrerType: 'basic',
  },
  {
    id: 'pay-02',
    name: 'Henrik van Dijk',
    location: 'Utrecht',
    countryCode: 'NL',
    flag: '🇳🇱',
    milestoneName: 'Seedling Pioneer',
    amount: 50,
    referrerType: 'investor',
  },
  {
    id: 'pay-03',
    name: 'Sophie Martin',
    location: 'Lyon',
    countryCode: 'FR',
    flag: '🇫🇷',
    milestoneName: 'Silver Flock Ambassador',
    amount: 10000,
    referrerType: 'investor',
  },
  {
    id: 'pay-04',
    name: 'Elena Popov',
    location: 'Bucharest',
    countryCode: 'RO',
    flag: '🇷🇴',
    milestoneName: 'Gold Estate Syndicator',
    amount: 12500,
    referrerType: 'basic',
  },
  {
    id: 'pay-05',
    name: 'Mateo Fernandez',
    location: 'Valencia',
    countryCode: 'ES',
    flag: '🇪🇸',
    milestoneName: 'Diamond Crown Principal',
    amount: 150000,
    referrerType: 'investor',
  },
  {
    id: 'pay-06',
    name: 'Anna Kowalski',
    location: 'Warsaw',
    countryCode: 'PL',
    flag: '🇵🇱',
    milestoneName: 'Gold Estate Syndicator',
    amount: 25000,
    referrerType: 'investor',
  },
  {
    id: 'pay-07',
    name: 'David Müller',
    location: 'Frankfurt',
    countryCode: 'DE',
    flag: '🇩🇪',
    milestoneName: 'Seedling Pioneer',
    amount: 25,
    referrerType: 'basic',
  },
  {
    id: 'pay-08',
    name: 'Arthur Dupont',
    location: 'Normandy',
    countryCode: 'FR',
    flag: '🇫🇷',
    milestoneName: 'Platinum Agri-Director',
    amount: 60000,
    referrerType: 'investor',
  },
  {
    id: 'pay-09',
    name: 'Isabella Rossi',
    location: 'Milan',
    countryCode: 'IT',
    flag: '🇮🇹',
    milestoneName: 'Silver Flock Ambassador',
    amount: 5000,
    referrerType: 'basic',
  },
  {
    id: 'pay-10',
    name: 'Carlos Silva',
    location: 'Porto',
    countryCode: 'PT',
    flag: '🇵🇹',
    milestoneName: 'Diamond Crown Principal',
    amount: 75000,
    referrerType: 'investor',
  },
  {
    id: 'pay-11',
    name: 'Viktor Lindqvist',
    location: 'Stockholm',
    countryCode: 'SE',
    flag: '🇸🇪',
    milestoneName: 'Platinum Agri-Director',
    amount: 30000,
    referrerType: 'investor',
  },
  {
    id: 'pay-12',
    name: 'Maximilian Becker',
    location: 'Bavaria',
    countryCode: 'DE',
    flag: '🇩🇪',
    milestoneName: 'Diamond Crown Principal',
    amount: 150000,
    referrerType: 'investor',
  },
];

export const ReferralPayoutTicker: React.FC = () => {
  const { formatCurrentCurrency } = usePlatform();
  // Duplicate for seamless infinite glide loop
  const displayItems = [...RECENT_PAYOUTS, ...RECENT_PAYOUTS];

  return (
    <div className="w-full bg-[#11271D] border-y border-[#244D38] overflow-hidden py-3 select-none relative group">
      {/* Edge gradient masks for seamless fade out on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#11271D] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#11271D] to-transparent z-10 pointer-events-none" />

      {/* Header Bar Tag (No "live" text, no blinking dot) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 flex items-center justify-between text-[11px] text-[#A7B6AB]">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#C5A059]" />
          <span className="font-mono font-bold text-white uppercase tracking-wider">
            Referral Milestone Distributions
          </span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-[#C5A059] font-medium">
            Partners Receiving BirdGrow Awards
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[10px] text-white/60">
          <span>Milestone rewards range from <strong className="text-white">{formatCurrentCurrency(25, false)}</strong> up to <strong className="text-[#C5A059]">{formatCurrentCurrency(150000, false)}</strong></span>
        </div>
      </div>

      {/* Infinite Gliding Feed Track */}
      <div className="animate-glide-left flex items-center gap-3">
        {displayItems.map((item, idx) => {
          const isTopTier = item.amount >= 60000;
          const isMaxMilestone = item.amount === 150000;

          return (
            <div
              key={`${item.id}-${idx}`}
              className={`shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-xl border backdrop-blur-xs transition-colors ${
                isMaxMilestone
                  ? 'bg-gradient-to-r from-amber-950/50 via-[#1B3B2B] to-emerald-950/50 border-[#C5A059] text-white shadow-sm'
                  : isTopTier
                  ? 'bg-[#183627] border-emerald-500/50 text-white'
                  : 'bg-[#152F22] border-[#254F39] text-[#E5E3D8]'
              }`}
            >
              {/* Flag / Country */}
              <span className="text-base" role="img" aria-label={item.countryCode}>
                {item.flag}
              </span>

              {/* Name & Origin */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white whitespace-nowrap">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#A7B6AB] whitespace-nowrap">
                    ({item.location})
                  </span>
                </div>
                <div className="text-[10px] text-white/60 flex items-center gap-1 whitespace-nowrap">
                  <span>{item.milestoneName}</span>
                  {item.referrerType === 'investor' && (
                    <span className="text-[9px] font-mono text-[#C5A059] bg-[#C5A059]/15 px-1 rounded">
                      2x 👑
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow / Award Icon */}
              <div className="text-[#C5A059] px-0.5">
                <Award className="w-3.5 h-3.5" />
              </div>

              {/* Amount Claimed (No time displayed) */}
              <div className="flex flex-col items-end">
                <span
                  className={`font-mono font-black text-xs sm:text-sm tabular-nums whitespace-nowrap ${
                    isMaxMilestone
                      ? 'text-[#C5A059]'
                      : isTopTier
                      ? 'text-emerald-400'
                      : 'text-white'
                  }`}
                >
                  +{formatCurrentCurrency(item.amount, true)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
