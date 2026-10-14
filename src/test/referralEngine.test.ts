import { Profile, Investment } from '../types';
import {
  ReferralMilestoneDefinition,
  ReferralMilestoneReward,
  ReferralRelationship,
  ReferralQualifiedInvestment,
  ReferralUserSummary,
  ReferrerType,
} from '../types/referral';

export interface ReferralCycleMilestoneItem {
  definition: ReferralMilestoneDefinition;
  isReached: boolean;
  isAwarded: boolean;
  reward?: ReferralMilestoneReward;
  progressPercentage: number;
}

export interface ReferralCycleBar {
  cycle: number;
  currentVolume: number;
  targetVolume: number;
  isCompleted: boolean;
  isPaymentReflected: boolean;
  progressPercentage: number;
  milestones: ReferralCycleMilestoneItem[];
}

/**
 * 5 defined milestones for the European Referral Engine (Euros).
 * Milestone 1: €500 (Seedling Pioneer) - 5% Basic (€25), 10% Investor (€50)
 * Milestone 2: €5,000 (Silver Flock Ambassador) - 5% Basic (€250), 10% Investor (€500)
 * Milestone 3: €25,000 (Gold Estate Syndicator) - 5% Basic (€1,250), 10% Investor (€2,500)
 * Milestone 4: €100,000 (Platinum Agri-Director) - 5% Basic (€5,000), 10% Investor (€10,000)
 * Milestone 5: €500,000 (Diamond Global Syndicator) - 5% Basic (€25,000), 10% Investor (€50,000)
 * 
 * Cumulative reward at €500,000:
 * Investor Referrer: €50 + €500 + €2,500 + €10,000 + €50,000 = €63,050
 * Basic Referrer: €25 + €250 + €1,250 + €5,000 + €25,000 = €31,525
 */
export const REFERRAL_MILESTONES: ReferralMilestoneDefinition[] = [
  {
    id: 'milestone-500',
    name: 'Seedling Pioneer',
    volumeThreshold: 500,
    label: '€500',
    shortLabel: '€500',
    basicReward: 25,
    investorReward: 50,
  },
  {
    id: 'milestone-5k',
    name: 'Silver Flock Ambassador',
    volumeThreshold: 5000,
    label: '€5,000',
    shortLabel: '€5K',
    basicReward: 250,
    investorReward: 500,
  },
  {
    id: 'milestone-25k',
    name: 'Gold Estate Syndicator',
    volumeThreshold: 25000,
    label: '€25,000',
    shortLabel: '€25K',
    basicReward: 1250,
    investorReward: 2500,
  },
  {
    id: 'milestone-100k',
    name: 'Platinum Agri-Director',
    volumeThreshold: 100000,
    label: '€100,000',
    shortLabel: '€100K',
    basicReward: 5000,
    investorReward: 10000,
  },
  {
    id: 'milestone-500k',
    name: 'Diamond Global Syndicator',
    volumeThreshold: 500000,
    label: '€500,000',
    shortLabel: '€500K',
    basicReward: 25000,
    investorReward: 50000,
  },
];

export const CYCLE_TARGET_VOLUME = 500000;

/**
 * Checks if a user is an Investor Referrer or Basic Referrer.
 * An Investor Referrer has at least one active, non-cancelled investment.
 */
export function isUserInvestorReferrer(
  userId: string,
  userInvestments: Investment[] = []
): boolean {
  return userInvestments.some(
    (inv) =>
      inv.user_id === userId &&
      inv.principal_amount > 0 &&
      inv.status !== 'cancelled'
  );
}

/**
 * Evaluates newly unlocked milestone awards based on accumulated volume.
 * Each milestone is only awarded once per cycle.
 */
export function evaluateNewMilestoneAwards(
  userId: string,
  volume: number,
  isInvestor: boolean,
  existingAwards: ReferralMilestoneReward[] = [],
  cycle: number = 1
): ReferralMilestoneReward[] {
  const newAwards: ReferralMilestoneReward[] = [];

  for (const milestone of REFERRAL_MILESTONES) {
    if (volume >= milestone.volumeThreshold) {
      const alreadyAwarded = existingAwards.some(
        (award) =>
          award.userId === userId &&
          award.milestoneId === milestone.id &&
          (award.cycle === cycle || (!award.cycle && cycle === 1))
      );

      if (!alreadyAwarded) {
        newAwards.push({
          id: `rew-${milestone.volumeThreshold}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          userId,
          milestoneId: milestone.id,
          volumeThreshold: milestone.volumeThreshold,
          rewardAmount: isInvestor ? milestone.investorReward : milestone.basicReward,
          referrerTypeAtAward: isInvestor ? 'investor' : 'basic',
          status: 'unlocked',
          referenceId: `REF-REW-${milestone.volumeThreshold}-${Math.floor(1000 + Math.random() * 9000)}`,
          awardedAt: new Date().toISOString(),
          cycle,
        });
      }
    }
  }

  return newAwards;
}

/**
 * Calculates full referral summary for a user, including:
 * - Total qualified volume from referred investors
 * - Tier classification (Basic vs Investor)
 * - Current milestone, next milestone, and remaining volume needed
 * - Multi-cycle progress bars with rollover once €500K is reached and payment is reflected
 */
export function calculateReferralUserSummary(
  userId: string,
  profile: Profile,
  relationships: ReferralRelationship[] = [],
  qualifiedInvestments: ReferralQualifiedInvestment[] = [],
  milestoneRewards: ReferralMilestoneReward[] = [],
  userInvestments: Investment[] = []
): ReferralUserSummary {
  const isInvestor = isUserInvestorReferrer(userId, userInvestments);
  const referrerType: ReferrerType = isInvestor ? 'investor' : 'basic';

  const userQualifiedInvs = qualifiedInvestments.filter(
    (qi) => qi.referrerUserId === userId && qi.qualificationStatus === 'qualified'
  );

  const totalQualifiedVolume = userQualifiedInvs.reduce(
    (sum, qi) => sum + qi.amount,
    0
  );

  const cycle1Completed = totalQualifiedVolume >= CYCLE_TARGET_VOLUME;
  const cycle1PaidReward = milestoneRewards.find(
    (r) =>
      r.userId === userId &&
      (r.milestoneId === 'milestone-500k' || r.volumeThreshold === CYCLE_TARGET_VOLUME) &&
      r.status === 'paid' &&
      (r.cycle === 1 || !r.cycle)
  );
  const cycle1PaymentReflected = !!cycle1PaidReward;

  const cycleBars: ReferralCycleBar[] = [];
  let cycleNum = 1;

  while (true) {
    const isFirstCycle = cycleNum === 1;
    const previousBar = cycleBars[cycleNum - 2];
    const canStartCycle = isFirstCycle || (previousBar && previousBar.isCompleted && previousBar.isPaymentReflected);

    if (!canStartCycle) {
      break;
    }

    const cycleStartThreshold = (cycleNum - 1) * CYCLE_TARGET_VOLUME;
    const cycleAccumulatedVolume = Math.max(0, totalQualifiedVolume - cycleStartThreshold);
    const cycleCurrentVolume = Math.min(cycleAccumulatedVolume, CYCLE_TARGET_VOLUME);
    const isCompleted = cycleAccumulatedVolume >= CYCLE_TARGET_VOLUME;

    const cycle500kPaidReward = milestoneRewards.find(
      (r) =>
        r.userId === userId &&
        (r.milestoneId === 'milestone-500k' || r.volumeThreshold === CYCLE_TARGET_VOLUME) &&
        r.status === 'paid' &&
        (r.cycle === cycleNum || (cycleNum === 1 && !r.cycle))
    );
    const isPaymentReflected = !!cycle500kPaidReward;

    const progressPercentage = Math.min(
      100,
      Math.round((cycleCurrentVolume / CYCLE_TARGET_VOLUME) * 10000) / 100
    );

    const milestoneItems: ReferralCycleMilestoneItem[] = REFERRAL_MILESTONES.map((def) => {
      const isReached = cycleAccumulatedVolume >= def.volumeThreshold;
      const reward = milestoneRewards.find(
        (r) =>
          r.userId === userId &&
          (r.milestoneId === def.id || r.volumeThreshold === def.volumeThreshold) &&
          (r.cycle === cycleNum || (cycleNum === 1 && !r.cycle))
      );
      return {
        definition: def,
        isReached,
        isAwarded: !!reward,
        reward,
        progressPercentage: Math.min(
          100,
          Math.round((Math.min(cycleAccumulatedVolume, def.volumeThreshold) / def.volumeThreshold) * 10000) / 100
        ),
      };
    });

    cycleBars.push({
      cycle: cycleNum,
      currentVolume: cycleCurrentVolume,
      targetVolume: CYCLE_TARGET_VOLUME,
      isCompleted,
      isPaymentReflected,
      progressPercentage,
      milestones: milestoneItems,
    });

    if (!isCompleted || !isPaymentReflected) {
      break;
    }

    cycleNum++;
  }

  const activeBar = cycleBars[cycleBars.length - 1] || {
    cycle: 1,
    currentVolume: totalQualifiedVolume,
    targetVolume: CYCLE_TARGET_VOLUME,
    isCompleted: false,
    isPaymentReflected: false,
    progressPercentage: Math.min(100, (totalQualifiedVolume / CYCLE_TARGET_VOLUME) * 100),
  };

  const activeVolume = activeBar.currentVolume;

  let currentMilestone: ReferralMilestoneDefinition | null = null;
  let nextMilestone: ReferralMilestoneDefinition | null = null;

  for (let i = REFERRAL_MILESTONES.length - 1; i >= 0; i--) {
    if (activeVolume >= REFERRAL_MILESTONES[i].volumeThreshold) {
      currentMilestone = REFERRAL_MILESTONES[i];
      break;
    }
  }

  for (const m of REFERRAL_MILESTONES) {
    if (activeVolume < m.volumeThreshold) {
      nextMilestone = m;
      break;
    }
  }

  const volumeNeededForNextMilestone = nextMilestone
    ? Math.max(0, nextMilestone.volumeThreshold - activeVolume)
    : 0;

  const progressPercentage = Math.min(
    100,
    Math.round((activeVolume / CYCLE_TARGET_VOLUME) * 10000) / 100
  );

  const unlockedRewards = milestoneRewards.filter((r) => r.userId === userId && r.status === 'unlocked');
  const paidRewards = milestoneRewards.filter((r) => r.userId === userId && r.status === 'paid');

  const totalRewardsUnlocked = milestoneRewards
    .filter((r) => r.userId === userId)
    .reduce((sum, r) => sum + r.rewardAmount, 0);

  const totalRewardsPaid = paidRewards.reduce((sum, r) => sum + r.rewardAmount, 0);
  const pendingPayoutAmount = unlockedRewards.reduce((sum, r) => sum + r.rewardAmount, 0);

  const totalCount = relationships.length;
  const activeCount = relationships.filter((r) => r.status === 'active').length;

  const summary = {
    userId,
    referrerType,
    totalQualifiedVolume,
    totalReferredCount: totalCount,
    totalReferralsCount: totalCount,
    activeReferredCount: activeCount,
    activeReferralsCount: activeCount,
    currentMilestone,
    nextMilestone,
    volumeNeededForNextMilestone,
    progressPercentage,
    totalRewardsUnlocked,
    totalRewardsPaid,
    pendingPayoutAmount,
    cycle1Completed,
    cycle1PaymentReflected,
    currentCycle: activeBar.cycle,
    cycleBars,
    unlockedRewards,
    paidRewards,
  };

  return summary as unknown as ReferralUserSummary;
}

export function formatReferralCurrency(amount: number): string {
  const rounded = Math.round(amount);
  return `€${rounded.toLocaleString('en-US')}`;
}

export function formatReferralCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace(/\.0$/, '');
    return `€${formatted}M`;
  }
  if (amount >= 1_000) {
    const val = amount / 1_000;
    const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace(/\.0$/, '');
    return `€${formatted}K`;
  }
  return `€${amount.toLocaleString('en-US')}`;
}

export const formatNaira = formatReferralCurrency;
export const formatNairaCompact = formatReferralCompact;

export function generateReferralCode(profile: Profile): string {
  const nameClean = (profile.full_name || 'member')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  const namePart = nameClean.slice(0, 8) || 'investor';

  let suffix = '01';
  if (profile.id && profile.id.includes('-')) {
    suffix = profile.id.split('-').pop() || '01';
  } else if (profile.user_id && profile.user_id.includes('-')) {
    suffix = profile.user_id.split('-').pop() || '01';
  } else if (profile.id && profile.id.length >= 4) {
    suffix = profile.id.slice(-4);
  } else if (profile.user_id && profile.user_id.length >= 4) {
    suffix = profile.user_id.slice(-4);
  }

  return `${namePart}-${suffix}`;
}