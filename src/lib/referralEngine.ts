import {
  ReferralMilestoneDefinition,
  ReferralMilestoneReward,
  ReferralRelationship,
  ReferralQualifiedInvestment,
  ReferralUserSummary,
  MilestoneProgressItem,
  MilestoneCycleBar,
  ReferrerType,
} from '../types/referral';
import { Investment, Profile, Currency } from '../types';
import {
  getActiveCurrency,
  MOCK_EXCHANGE_RATES,
  CURRENCY_SYMBOLS,
} from './formatters';

export const NON_INVESTOR_MAX_REWARD_USD = 81750;
// With EUR as native platform base (1 EUR = 1.09 USD), $16,000 USD is €14,678.90
export const NON_INVESTOR_MAX_REWARD_BASE = Math.round((81750 / 1.09) * 100) / 100; // ~75,000.00 EUR

export const REFERRAL_MILESTONES: ReferralMilestoneDefinition[] = [
  {
    id: 'milestone-500',
    name: 'Seedling Pioneer',
    volumeThreshold: 500,
    label: '€500',
    shortLabel: '€500',
    basicReward: 25,
    investorReward: 50,
    image: '/images/lohmann_brown_1790702651612.jpg',
    cycle: 1,
  },
  {
    id: 'milestone-100k',
    name: 'Silver Flock Ambassador',
    volumeThreshold: 100000,
    label: '€100,000',
    shortLabel: '€100K',
    basicReward: 5000,
    investorReward: 10000,
    image: '/images/sussex_hen_1790702720503.jpg',
    cycle: 1,
  },
  {
    id: 'milestone-250k',
    name: 'Gold Estate Syndicator',
    volumeThreshold: 250000,
    label: '€250,000',
    shortLabel: '€250K',
    basicReward: 12500,
    investorReward: 24999,
    image: '/images/bresse_chicken_1790702776088.jpg',
    cycle: 1,
  },
  {
    id: 'milestone-500k',
    name: 'Platinum Agri-Director',
    volumeThreshold: 500000,
    label: '€500,000',
    shortLabel: '€500K',
    basicReward: 30000,
    investorReward: 60000,
    image: '/images/marans_layer_1790702676906.jpg',
    cycle: 1,
  },
];

// Subsequent Cycle 2 Milestones (Appears after Cycle 1 target reached and payment reflected)
export const CYCLE_2_MILESTONES: ReferralMilestoneDefinition[] = [
  {
    id: 'c2-milestone-500',
    name: 'Seedling Pioneer',
    volumeThreshold: 500,
    label: '€500',
    shortLabel: '€500',
    basicReward: 25,
    investorReward: 50,
    image: '/images/lohmann_brown_1790702651612.jpg',
    cycle: 2,
  },
  {
    id: 'c2-milestone-100k',
    name: 'Silver Flock Ambassador',
    volumeThreshold: 100000,
    label: '€100,000',
    shortLabel: '€100K',
    basicReward: 5000,
    investorReward: 10000,
    image: '/images/sussex_hen_1790702720503.jpg',
    cycle: 2,
  },
  {
    id: 'c2-milestone-250k',
    name: 'Gold Estate Syndicator',
    volumeThreshold: 250000,
    label: '€250,000',
    shortLabel: '€250K',
    basicReward: 12500,
    investorReward: 24999,
    image: '/images/bresse_chicken_1790702776088.jpg',
    cycle: 2,
  },
  {
    id: 'c2-milestone-500k',
    name: 'Platinum Agri-Director',
    volumeThreshold: 500000,
    label: '€500,000',
    shortLabel: '€500K',
    basicReward: 30000, 
    investorReward: 60000,
    image: '/images/marans_layer_1790702676906.jpg',
    cycle: 2,
  },
];

export const formatReferralCurrency = (
  amount: number,
  showDecimals: boolean = false,
  currencyOverride?: Currency
): string => {
  const curr = currencyOverride || (typeof window === 'undefined' ? 'EUR' : getActiveCurrency());
  const rate = curr === 'EUR' && typeof window === 'undefined' ? 1.0 : (MOCK_EXCHANGE_RATES[curr] || 1.0);
  const converted = Math.round(amount * rate);
  const sym = CURRENCY_SYMBOLS[curr] || '€';
  return (
    sym +
    converted.toLocaleString('en-US', {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    })
  );
};

export const formatReferralCompact = (
  amount: number,
  currencyOverride?: Currency
): string => {
  const curr = currencyOverride || (typeof window === 'undefined' ? 'EUR' : getActiveCurrency());
  const rate = curr === 'EUR' && typeof window === 'undefined' ? 1.0 : (MOCK_EXCHANGE_RATES[curr] || 1.0);
  const converted = amount * rate;
  const sym = CURRENCY_SYMBOLS[curr] || '€';
  if (converted >= 500000) {
    const val = converted / 500000;
    return `${sym}${val % 1 === 0 ? val : val.toFixed(1)}M`;
  }
  if (converted >= 1000) {
    const val = converted / 1000;
    return `${sym}${val % 1 === 0 ? val : val.toFixed(1)}K`;
  }
  return `${sym}${Math.round(converted).toLocaleString()}`;
};

// Aliases for seamless backwards compatibility
export const formatNaira = formatReferralCurrency;
export const formatNairaCompact = formatReferralCompact;

/**
 * Determine whether a user is an Investor Referrer or Basic Referrer.
 * An Investor Referrer has at least one active, pending, or matured investment on the platform.
 */
export const isUserInvestorReferrer = (
  userId: string,
  userInvestments: Investment[]
): boolean => {
  return userInvestments.some(
    (inv) => inv.user_id === userId && inv.status !== 'cancelled'
  );
};

/**
 * Generate a clean, human-readable referral code for a user
 */
export const generateReferralCode = (profile: Profile): string => {
  const cleanName = (profile.full_name || 'member')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 8);
  const suffix = profile.user_id.slice(-4);
  return `${cleanName}-${suffix}`;
};

/**
 * Generate complete registration URL for referral
 */
export const buildReferralLink = (referralCode: string): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://birdgrow.eu';
  return `${origin}/?ref=${referralCode}`;
};

/**
 * Social share links for referral URLs
 */
export const buildSocialShareLinks = (referralLink: string, referralCode: string) => {
  const text = `Join me on BirdGrow to invest in European agricultural poultry production with verified contractual returns! Use my referral link or code (${referralCode}) to get started:`;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(referralLink);

  return {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=BirdGrow,AgriFintech,Investing`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    email: `mailto:?subject=${encodeURIComponent('Invitation to invest on BirdGrow')}&body=${encodedText}%0A%0A${encodedUrl}`,
  };
};

/**
 * Evaluate newly reached milestones when volume increases.
 * Returns array of new rewards to create.
 * Cycle 1 stops at €1,000,000.
 * Once Cycle 1 reaches 1M and payment has reflected, Cycle 2 activates starting from €500 with the same percentages.
 */
export const evaluateNewMilestoneAwards = (
  userId: string,
  qualifiedVolume: number,
  isInvestor: boolean,
  existingRewards: ReferralMilestoneReward[]
): ReferralMilestoneReward[] => {
  const referrerType: ReferrerType = isInvestor ? 'investor' : 'basic';
  const newAwards: ReferralMilestoneReward[] = [];

  // Filter existing active/paid rewards for this user
  const awardedMilestoneIds = new Set(
    existingRewards
      .filter((r) => r.userId === userId && r.status !== 'reversed')
      .map((r) => r.milestoneId)
  );

  // 1. Evaluate Cycle 1 milestones (starts from 500, stops at 1M)
  for (const milestone of REFERRAL_MILESTONES) {
    if (qualifiedVolume >= milestone.volumeThreshold) {
      if (!awardedMilestoneIds.has(milestone.id)) {
        let rewardAmount = isInvestor ? milestone.investorReward : milestone.basicReward;
        let note = `Milestone ${milestone.label} unlocked as ${isInvestor ? 'Investor' : 'Basic'} Referrer`;

        if (!isInvestor) {
          rewardAmount = Math.min(rewardAmount, NON_INVESTOR_MAX_REWARD_BASE);
          note += ` (Non-Investor limit: max $16,000 USD)`;
        }

        const refId = `REF-REW-${milestone.shortLabel.replace(/[^A-Za-z0-9]/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;

        newAwards.push({
          id: `ref-rew-${Date.now()}-${milestone.id}`,
          userId,
          milestoneId: milestone.id,
          volumeThreshold: milestone.volumeThreshold,
          rewardAmount,
          referrerTypeAtAward: referrerType,
          status: 'unlocked',
          referenceId: refId,
          awardedAt: new Date().toISOString(),
          notes: note,
          cycle: 1,
        });

        awardedMilestoneIds.add(milestone.id);
      }
    }
  }

  // 2. Check if Cycle 1 target (1M) has been reached and payment has reflected
  const is1mPaid = existingRewards.some(
    (r) =>
      r.userId === userId &&
      (r.milestoneId === 'milestone-1m' || (r.volumeThreshold === 500000 && r.cycle !== 2)) &&
      r.status === 'paid'
  );

  // If Cycle 1 1M payment has reflected, activate Cycle 2
  if (is1mPaid) {
    const cycle2Volume = Math.max(0, qualifiedVolume - 500000);

    for (const milestone of CYCLE_2_MILESTONES) {
      if (cycle2Volume >= milestone.volumeThreshold) {
        if (!awardedMilestoneIds.has(milestone.id)) {
          let rewardAmount = isInvestor ? milestone.investorReward : milestone.basicReward;
          let note = `Cycle 2 Milestone ${milestone.label} unlocked as ${isInvestor ? 'Investor' : 'Basic'} Referrer`;

          if (!isInvestor) {
            rewardAmount = Math.min(rewardAmount, NON_INVESTOR_MAX_REWARD_BASE);
            note += ` (Non-Investor limit: max $16,000 USD)`;
          }

          const refId = `REF-C2-${milestone.shortLabel.replace(/[^A-Za-z0-9]/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;

          newAwards.push({
            id: `ref-rew-c2-${Date.now()}-${milestone.id}`,
            userId,
            milestoneId: milestone.id,
            volumeThreshold: milestone.volumeThreshold,
            rewardAmount,
            referrerTypeAtAward: referrerType,
            status: 'unlocked',
            referenceId: refId,
            awardedAt: new Date().toISOString(),
            notes: `Cycle 2 Milestone ${milestone.label} unlocked as ${isInvestor ? 'Investor' : 'Basic'} Referrer`,
            cycle: 2,
          });

          awardedMilestoneIds.add(milestone.id);
        }
      }
    }
  }

  return newAwards;
};

/**
 * Calculate comprehensive referral summary for a specific user with multi-cycle bar progression
 */
export const calculateReferralUserSummary = (
  userId: string,
  profile: Profile,
  relationships: ReferralRelationship[],
  qualifiedInvestments: ReferralQualifiedInvestment[],
  milestoneRewards: ReferralMilestoneReward[],
  allInvestments: Investment[]
): ReferralUserSummary => {
  const referralCode = generateReferralCode(profile);
  const referralLink = buildReferralLink(referralCode);

  // Check if current user is Investor or Basic Referrer
  const isInvestor = isUserInvestorReferrer(userId, allInvestments);
  const referrerType: ReferrerType = isInvestor ? 'investor' : 'basic';

  // Find all people referred by this user
  const userRelationships = relationships.filter((r) => r.referrerUserId === userId);

  // Find all qualified investments generated through this user's referrals
  const userQualifiedInvs = qualifiedInvestments.filter(
    (inv) => inv.referrerUserId === userId && inv.qualificationStatus === 'qualified'
  );

  // Cumulative qualified referral volume
  const totalQualifiedVolume = userQualifiedInvs.reduce((sum, inv) => sum + inv.amount, 0);

  // Find active referred investors
  const referredUsersWithInvestments = new Set(userQualifiedInvs.map((inv) => inv.referredUserId));
  const activeReferredInvestorsCount = referredUsersWithInvestments.size;

  // Rewards for this user
  const userRewards = milestoneRewards.filter((r) => r.userId === userId && r.status !== 'reversed');
  const totalRewardsEarned = userRewards.reduce((sum, r) => sum + r.rewardAmount, 0);
  const totalRewardsPaid = userRewards
    .filter((r) => r.status === 'paid')
    .reduce((sum, r) => sum + r.rewardAmount, 0);
  const pendingRewards = userRewards
    .filter((r) => r.status === 'pending')
    .reduce((sum, r) => sum + r.rewardAmount, 0);
  const availableRewards = userRewards
    .filter((r) => r.status === 'unlocked')
    .reduce((sum, r) => sum + r.rewardAmount, 0);

  // Check Cycle 1 Completion and Payment Reflection
  const cycle1Completed = totalQualifiedVolume >= 500000;
  const cycle1PaymentReflected = userRewards.some(
    (r) =>
      (r.milestoneId === 'milestone-1m' || (r.volumeThreshold === 500000 && r.cycle !== 2)) &&
      r.status === 'paid'
  );

  // Cycle 1 Next Milestone & Progress
  const nextMilestoneCycle1 =
    REFERRAL_MILESTONES.find((m) => totalQualifiedVolume < m.volumeThreshold) || null;
  const volumeNeededCycle1 = nextMilestoneCycle1
    ? Math.max(0, nextMilestoneCycle1.volumeThreshold - totalQualifiedVolume)
    : 0;

  // Build Cycle 1 Progress Items
  const cycle1ProgressItems: MilestoneProgressItem[] = REFERRAL_MILESTONES.map((milestone) => {
    const isCompleted = totalQualifiedVolume >= milestone.volumeThreshold;
    const isCurrentTarget = nextMilestoneCycle1?.id === milestone.id;
    const isLocked = !isCompleted && !isCurrentTarget;

    const existingRecord = userRewards.find(
      (r) => r.milestoneId === milestone.id || (r.volumeThreshold === milestone.volumeThreshold && r.cycle !== 2)
    );
    const rewardAmount = existingRecord
      ? existingRecord.rewardAmount
      : isInvestor
      ? milestone.investorReward
      : milestone.basicReward;

    let status: MilestoneProgressItem['status'] = 'locked';
    if (existingRecord) {
      status = existingRecord.status;
    } else if (isCompleted) {
      status = 'unlocked';
    } else if (isCurrentTarget) {
      status = 'in_progress';
    } else {
      status = 'locked';
    }

    return {
      definition: milestone,
      status,
      rewardAmount,
      isCompleted,
      isCurrentTarget,
      isLocked,
      awardedRecord: existingRecord,
    };
  });

  const cycle1Bar: MilestoneCycleBar = {
    cycle: 1,
    title: cycle1PaymentReflected
      ? 'Cycle 1 Milestone Ladder (Completed & Paid)'
      : cycle1Completed
      ? 'Cycle 1 Milestone Ladder (Target Reached · Awaiting Claim/Payment)'
      : `Cycle 1 Milestone Ladder (${formatReferralCurrency(500000)} Target)`,
    isCompleted: cycle1Completed,
    isPaymentReflected: cycle1PaymentReflected,
    currentVolume: Math.min(500000, totalQualifiedVolume),
    targetVolume: 500000,
    progressPercentage: cycle1Completed
      ? 100
      : Math.min(100, Math.max(0, Math.round((totalQualifiedVolume / 500000) * 1000) / 10)),
    nextMilestone: nextMilestoneCycle1,
    volumeNeededForNextMilestone: volumeNeededCycle1,
    milestones: cycle1ProgressItems,
  };

  const cycleBars: MilestoneCycleBar[] = [cycle1Bar];

  // Cycle 2 Bar Setup: Appears once Cycle 1 target reached and payment reflected
  const cycle2Volume = Math.max(0, totalQualifiedVolume - 500000);
  const nextMilestoneCycle2 =
    CYCLE_2_MILESTONES.find((m) => cycle2Volume < m.volumeThreshold) || null;
  const volumeNeededCycle2 = nextMilestoneCycle2
    ? Math.max(0, nextMilestoneCycle2.volumeThreshold - cycle2Volume)
    : 0;

  const cycle2ProgressItems: MilestoneProgressItem[] = CYCLE_2_MILESTONES.map((milestone) => {
    const isCompleted = cycle2Volume >= milestone.volumeThreshold;
    const isCurrentTarget = nextMilestoneCycle2?.id === milestone.id;
    const isLocked = !isCompleted && !isCurrentTarget;

    const existingRecord = userRewards.find(
      (r) => r.milestoneId === milestone.id || (r.volumeThreshold === milestone.volumeThreshold && r.cycle === 2)
    );
    const rewardAmount = existingRecord
      ? existingRecord.rewardAmount
      : isInvestor
      ? milestone.investorReward
      : milestone.basicReward;

    let status: MilestoneProgressItem['status'] = 'locked';
    if (existingRecord) {
      status = existingRecord.status;
    } else if (isCompleted) {
      status = 'unlocked';
    } else if (isCurrentTarget) {
      status = 'in_progress';
    } else {
      status = 'locked';
    }

    return {
      definition: milestone,
      status,
      rewardAmount,
      isCompleted,
      isCurrentTarget,
      isLocked,
      awardedRecord: existingRecord,
    };
  });

  if (cycle1PaymentReflected) {
    const cycle2Bar: MilestoneCycleBar = {
      cycle: 2,
      title: 'Cycle 2 Milestone Ladder (Active · New Referral Bar)',
      isCompleted: cycle2Volume >= 500000,
      isPaymentReflected: userRewards.some((r) => r.milestoneId === 'c2-milestone-1m' && r.status === 'paid'),
      currentVolume: cycle2Volume,
      targetVolume: 500000,
      progressPercentage:
        cycle2Volume >= 500000
          ? 100
          : Math.min(
              100,
              Math.max(
                0,
                Math.round((cycle2Volume / 500000) * 1000) / 10
              )
            ),
      nextMilestone: nextMilestoneCycle2,
      volumeNeededForNextMilestone: volumeNeededCycle2,
      milestones: cycle2ProgressItems,
    };
    cycleBars.push(cycle2Bar);
  }

  // Active milestone and progress view
  const activeBar = cycle1PaymentReflected ? cycleBars[1] : cycleBars[0];
  const currentMilestone = activeBar.milestones
    .filter((m: MilestoneProgressItem) => m.isCompleted)
    .slice(-1)[0]?.definition || null;
  const nextMilestone = activeBar.nextMilestone;
  const volumeNeededForNextMilestone = activeBar.volumeNeededForNextMilestone;
  const progressPercentage = activeBar.progressPercentage;

  // Group referrals with their qualified investments
  const referralsList = userRelationships.map((rel) => {
    const invs = qualifiedInvestments.filter((qi) => qi.referredUserId === rel.referredUserId);
    const totalInvested = invs
      .filter((qi) => qi.qualificationStatus === 'qualified')
      .reduce((sum, qi) => sum + qi.amount, 0);
    const hasActiveInvestment = totalInvested > 0;
    const sortedInvs = [...invs].sort(
      (a, b) => new Date(b.investmentDate).getTime() - new Date(a.investmentDate).getTime()
    );

    return {
      relationship: rel,
      investments: invs,
      totalInvested,
      hasActiveInvestment,
      lastInvestmentDate: sortedInvs[0]?.investmentDate,
    };
  });

  return {
    userId,
    referrerType,
    referralCode,
    referralLink,
    totalReferredCount: userRelationships.length,
    activeReferredInvestorsCount,
    totalQualifiedVolume,
    totalRewardsEarned,
    totalRewardsPaid,
    pendingRewards,
    availableRewards,
    currentMilestone,
    nextMilestone,
    volumeNeededForNextMilestone,
    progressPercentage,
    milestones: activeBar.milestones,
    cycle1Completed,
    cycle1PaymentReflected,
    cycleBars,
    referrals: referralsList,
  };
};
