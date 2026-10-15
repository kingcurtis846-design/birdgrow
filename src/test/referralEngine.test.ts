import { describe, it, expect } from 'vitest';
import {
  REFERRAL_MILESTONES,
  CYCLE_2_MILESTONES,
  CYCLE_TARGET_VOLUME,
  NON_INVESTOR_MAX_REWARD_BASE,
  NON_INVESTOR_MAX_REWARD_USD,
  isUserInvestorReferrer,
  evaluateNewMilestoneAwards,
  calculateReferralUserSummary,
  formatReferralCurrency,
  formatReferralCompact,
  formatNaira,
  formatNairaCompact,
  generateReferralCode,
  buildReferralLink,
  buildSocialShareLinks,
} from '../lib/referralEngine';
import { Profile, Investment } from '../types';
import {
  ReferralMilestoneReward,
  ReferralRelationship,
  ReferralQualifiedInvestment,
} from '../types/referral';

// Safe mock builders using Object.assign to guarantee no excess property check errors
const createMockProfile = (overrides?: Partial<Profile>): Profile =>
  Object.assign(
    {
      user_id: 'usr-bob-9999',
      full_name: 'Robert Davis',
      email: 'robert.davis@example.com',
      country: 'FR',
      country_code: 'FR',
    },
    overrides
  ) as Profile;

const createMockInvestment = (overrides?: Partial<Investment>): Investment =>
  Object.assign(
    {
      id: 'inv-001',
      user_id: 'usr-bob-9999',
      principal_amount: 1500,
      status: 'active' as const,
      currency: 'EUR',
      created_at: new Date().toISOString(),
    },
    overrides
  ) as Investment;

const createMockRelationship = (overrides?: Partial<ReferralRelationship>): ReferralRelationship =>
  Object.assign(
    {
      id: 'rel-001',
      referrerUserId: 'usr-bob-9999',
      referredUserId: 'usr-ref-001',
      referredUserName: 'Jean Luc',
      referrerCode: 'robertd-9999',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    overrides
  ) as ReferralRelationship;

const createMockQualifiedInvestment = (
  overrides?: Partial<ReferralQualifiedInvestment>
): ReferralQualifiedInvestment =>
  Object.assign(
    {
      id: 'qi-001',
      referrerUserId: 'usr-bob-9999',
      referredUserId: 'usr-ref-001',
      investmentId: 'inv-target-001',
      amount: 500,
      qualificationStatus: 'qualified' as const,
      investmentDate: new Date().toISOString(),
      cycle: 1,
    },
    overrides
  ) as ReferralQualifiedInvestment;

describe('Referral Engine - Constants & Milestones Definition (10 Milestones)', () => {
  it('should define exactly 10 progressive European referral milestones in Cycle 1', () => {
    expect(REFERRAL_MILESTONES).toHaveLength(10);
    expect(REFERRAL_MILESTONES[0].id).toBe('milestone-500');
    expect(REFERRAL_MILESTONES[1].id).toBe('milestone-2.5k');
    expect(REFERRAL_MILESTONES[2].id).toBe('milestone-5k');
    expect(REFERRAL_MILESTONES[3].id).toBe('milestone-10k');
    expect(REFERRAL_MILESTONES[4].id).toBe('milestone-25k');
    expect(REFERRAL_MILESTONES[5].id).toBe('milestone-50k');
    expect(REFERRAL_MILESTONES[6].id).toBe('milestone-100k');
    expect(REFERRAL_MILESTONES[7].id).toBe('milestone-200k');
    expect(REFERRAL_MILESTONES[8].id).toBe('milestone-350k');
    expect(REFERRAL_MILESTONES[9].id).toBe('milestone-500k');
  });

  it('should have the correct volume thresholds and names in ascending order', () => {
    const thresholds = REFERRAL_MILESTONES.map((m) => m.volumeThreshold);
    expect(thresholds).toEqual([
      500,
      2500,
      5000,
      10000,
      25000,
      50000,
      100000,
      200000,
      350000,
      500000,
    ]);

    const names = REFERRAL_MILESTONES.map((m) => m.name);
    expect(names).toEqual([
      'Seedling Pioneer',
      'Green Sprout Partner',
      'Bronze Farm Advocate',
      'Silver Coop Champion',
      'Golden Flock Leader',
      'Emerald Poultry Patron',
      'Silver Flock Ambassador',
      'Sapphire Estate Partner',
      'Gold Estate Syndicator',
      'Platinum Agri-Director',
    ]);
  });

  it('should have exact reward values for Basic Referrer (5%) and Investor Referrer (10%) across all 10 milestones', () => {
    REFERRAL_MILESTONES.forEach((m) => {
      expect(m.investorReward).toBe(m.volumeThreshold * 0.1);
      expect(m.basicReward).toBe(m.volumeThreshold * 0.05);
      expect(m.investorReward).toBe(m.basicReward * 2);
    });
  });

  it('should match the documented cumulative rewards (€124,300 for Investor, €62,150 for Basic)', () => {
    const totalInvestor = REFERRAL_MILESTONES.reduce((acc, m) => acc + m.investorReward, 0);
    const totalBasic = REFERRAL_MILESTONES.reduce((acc, m) => acc + m.basicReward, 0);
    expect(totalInvestor).toBe(124300);
    expect(totalBasic).toBe(62150);
  });

  it('should have highest milestone capped at €500,000 and match CYCLE_TARGET_VOLUME', () => {
    const highestMilestone = REFERRAL_MILESTONES[REFERRAL_MILESTONES.length - 1];
    expect(highestMilestone.volumeThreshold).toBe(500000);
    expect(CYCLE_TARGET_VOLUME).toBe(500000);
  });
});

describe('isUserInvestorReferrer', () => {
  it('should return false if investments array is empty', () => {
    expect(isUserInvestorReferrer('usr-1', [])).toBe(false);
  });

  it('should return false if user has investments but principal_amount is 0 or less', () => {
    const zeroInv: Investment = createMockInvestment({
      user_id: 'usr-1',
      principal_amount: 0,
      status: 'active',
    });
    const negInv: Investment = createMockInvestment({
      user_id: 'usr-1',
      principal_amount: -50,
      status: 'active',
    });
    expect(isUserInvestorReferrer('usr-1', [zeroInv, negInv])).toBe(false);
  });

  it('should return false if user only has cancelled investments', () => {
    const cancelledInv: Investment = createMockInvestment({
      user_id: 'usr-1',
      principal_amount: 1000,
      status: 'cancelled',
    });
    expect(isUserInvestorReferrer('usr-1', [cancelledInv])).toBe(false);
  });

  it('should return false if investments belong to another user', () => {
    const otherUserInv: Investment = createMockInvestment({
      user_id: 'usr-other',
      principal_amount: 1000,
      status: 'active',
    });
    expect(isUserInvestorReferrer('usr-1', [otherUserInv])).toBe(false);
  });

  it('should return true if user has at least one active non-cancelled investment with principal > 0', () => {
    const activeInv: Investment = createMockInvestment({
      user_id: 'usr-1',
      principal_amount: 500,
      status: 'active',
    });
    expect(isUserInvestorReferrer('usr-1', [activeInv])).toBe(true);
  });

  it('should return true if user has matured non-cancelled investment with principal > 0', () => {
    const maturedInv: Investment = createMockInvestment({
      user_id: 'usr-1',
      principal_amount: 2500,
      status: 'matured',
    });
    expect(isUserInvestorReferrer('usr-1', [maturedInv])).toBe(true);
  });
});

describe('evaluateNewMilestoneAwards', () => {
  it('should return empty array if volume is 0 or below minimum milestone threshold', () => {
    const awards = evaluateNewMilestoneAwards('usr-1', 400, true, []);
    expect(awards).toHaveLength(0);
  });

  it('should award Milestone 1 with 10% (€50) for Investor Referrer at €500', () => {
    const awards = evaluateNewMilestoneAwards('usr-1', 500, true, []);
    expect(awards).toHaveLength(1);
    expect(awards[0].milestoneId).toBe('milestone-500');
    expect(awards[0].rewardAmount).toBe(50);
    expect(awards[0].referrerTypeAtAward).toBe('investor');
  });

  it('should award Milestone 1 with 5% (€25) for Basic Referrer at €500', () => {
    const awards = evaluateNewMilestoneAwards('usr-1', 500, false, []);
    expect(awards).toHaveLength(1);
    expect(awards[0].milestoneId).toBe('milestone-500');
    expect(awards[0].rewardAmount).toBe(25);
    expect(awards[0].referrerTypeAtAward).toBe('basic');
  });

  it('should award multiple milestones if volume jumps across multiple thresholds', () => {
    const awards = evaluateNewMilestoneAwards('usr-1', 10000, true, []);
    expect(awards).toHaveLength(4);
    expect(awards.map((a) => a.milestoneId)).toEqual([
      'milestone-500',
      'milestone-2.5k',
      'milestone-5k',
      'milestone-10k',
    ]);
    const totalAwarded = awards.reduce((sum, a) => sum + a.rewardAmount, 0);
    expect(totalAwarded).toBe(50 + 250 + 500 + 1000); // €1,800
  });

  it('should not duplicate awards that were already given', () => {
    const existingReward: ReferralMilestoneReward = {
      id: 'rew-1',
      userId: 'usr-1',
      milestoneId: 'milestone-500',
      volumeThreshold: 500,
      rewardAmount: 50,
      referrerTypeAtAward: 'investor',
      status: 'unlocked',
      referenceId: 'REF-001',
      awardedAt: new Date().toISOString(),
      cycle: 1,
    };

    const awards = evaluateNewMilestoneAwards('usr-1', 2500, true, [existingReward]);
    expect(awards).toHaveLength(1);
    expect(awards[0].milestoneId).toBe('milestone-2.5k');
    expect(awards[0].rewardAmount).toBe(250);
  });

  it('should work when called without 4th argument (defaults to empty array)', () => {
    const awards = evaluateNewMilestoneAwards('usr-1', 500, true);
    expect(awards).toHaveLength(1);
    expect(awards[0].milestoneId).toBe('milestone-500');
  });
});

describe('calculateReferralUserSummary', () => {
  it('should classify referrer as basic when user has no active investments', () => {
    const profile = createMockProfile();
    const summary = calculateReferralUserSummary(
      profile.user_id,
      profile,
      [],
      [],
      [],
      []
    );
    expect(summary.referrerType).toBe('basic');
  });

  it('should classify referrer as investor when user has active investment', () => {
    const profile = createMockProfile();
    const userInvestments = [createMockInvestment({ user_id: profile.user_id })];
    const summary = calculateReferralUserSummary(
      profile.user_id,
      profile,
      [],
      [],
      [],
      userInvestments
    );
    expect(summary.referrerType).toBe('investor');
  });

  it('should sum only qualified investments and ignore non-qualified ones', () => {
    const profile = createMockProfile();
    const relationships = [createMockRelationship({ referrerUserId: profile.user_id })];
    const qualifiedInvestments = [
      createMockQualifiedInvestment({ amount: 1500, qualificationStatus: 'qualified' }),
      createMockQualifiedInvestment({ amount: 800, qualificationStatus: 'pending' }),
      createMockQualifiedInvestment({ amount: 400, qualificationStatus: 'ineligible' }),
    ];

    const summary = calculateReferralUserSummary(
      profile.user_id,
      profile,
      relationships,
      qualifiedInvestments,
      [],
      []
    );

    expect(summary.totalQualifiedVolume).toBe(1500);
  });

  it('should calculate rewards unlocked and paid correctly', () => {
    const profile = createMockProfile();
    const milestoneRewards: ReferralMilestoneReward[] = [
      {
        id: 'rew-1',
        userId: profile.user_id,
        milestoneId: 'milestone-500',
        volumeThreshold: 500,
        rewardAmount: 50,
        referrerTypeAtAward: 'investor',
        status: 'paid',
        referenceId: 'REF-001',
        awardedAt: new Date().toISOString(),
        cycle: 1,
      },
      {
        id: 'rew-2',
        userId: profile.user_id,
        milestoneId: 'milestone-2.5k',
        volumeThreshold: 2500,
        rewardAmount: 250,
        referrerTypeAtAward: 'investor',
        status: 'unlocked',
        referenceId: 'REF-002',
        awardedAt: new Date().toISOString(),
        cycle: 1,
      },
    ];

    const summary = calculateReferralUserSummary(
      profile.user_id,
      profile,
      [],
      [],
      milestoneRewards,
      []
    );

    expect(summary.totalRewardsEarned).toBe(300);
    expect(summary.totalRewardsPaid).toBe(50);
    expect(summary.availableRewards).toBe(250);
  });

  describe('Multi-cycle Rollover at €500,000', () => {
    it('should complete Cycle 1 at €500,000 but NOT activate Cycle 2 until payment is reflected', () => {
      const profile = createMockProfile();
      const qualifiedInvestments = [
        createMockQualifiedInvestment({ amount: 500000, qualificationStatus: 'qualified' }),
      ];
      const milestoneRewards: ReferralMilestoneReward[] = [
        {
          id: 'rew-500k',
          userId: profile.user_id,
          milestoneId: 'milestone-500k',
          volumeThreshold: 500000,
          rewardAmount: 50000,
          referrerTypeAtAward: 'investor',
          status: 'unlocked', // Not yet paid
          referenceId: 'REF-500K',
          awardedAt: new Date().toISOString(),
          cycle: 1,
        },
      ];

      const summary = calculateReferralUserSummary(
        profile.user_id,
        profile,
        [],
        qualifiedInvestments,
        milestoneRewards,
        []
      );

      expect(summary.cycle1Completed).toBe(true);
      expect(summary.cycle1PaymentReflected).toBe(false);
      expect(summary.cycleBars).toHaveLength(1);
      expect(summary.cycleBars[0].milestones).toHaveLength(10);
      expect(summary.cycleBars[0].isCompleted).toBe(true);
      expect(summary.cycleBars[0].isPaymentReflected).toBe(false);
    });

    it('should rollover into Cycle 2 when €500k milestone is paid and volume exceeds €500,000', () => {
      const profile = createMockProfile();
      const qualifiedInvestments = [
        createMockQualifiedInvestment({ amount: 550000, qualificationStatus: 'qualified' }),
      ];
      const milestoneRewards: ReferralMilestoneReward[] = [
        {
          id: 'rew-500k',
          userId: profile.user_id,
          milestoneId: 'milestone-500k',
          volumeThreshold: 500000,
          rewardAmount: 50000,
          referrerTypeAtAward: 'investor',
          status: 'paid', // Payment reflected!
          referenceId: 'REF-500K',
          awardedAt: new Date().toISOString(),
          cycle: 1,
        },
      ];

      const summary = calculateReferralUserSummary(
        profile.user_id,
        profile,
        [],
        qualifiedInvestments,
        milestoneRewards,
        []
      );

      expect(summary.cycle1Completed).toBe(true);
      expect(summary.cycle1PaymentReflected).toBe(true);
      expect(summary.cycleBars).toHaveLength(2);
      expect(summary.cycleBars[0].cycle).toBe(1);
      expect(summary.cycleBars[1].cycle).toBe(2);
      expect(summary.cycleBars[1].milestones).toHaveLength(10);
      expect(summary.cycleBars[1].currentVolume).toBe(50000);
    });
  });
});

describe('Formatting Helpers', () => {
  it('formatReferralCurrency should format amounts in Euro currency with commas', () => {
    expect(formatReferralCurrency(500)).toBe('€500');
    expect(formatReferralCurrency(2500)).toBe('€2,500');
    expect(formatReferralCurrency(100000)).toBe('€100,000');
    expect(formatReferralCurrency(500000)).toBe('€500,000');
  });

  it('formatReferralCompact should format amounts compactly', () => {
    expect(formatReferralCompact(500)).toBe('€500');
    expect(formatReferralCompact(2500)).toBe('€2.5K');
    expect(formatReferralCompact(5000)).toBe('€5K');
    expect(formatReferralCompact(100000)).toBe('€100K');
    expect(formatReferralCompact(500000)).toBe('€500K');
    expect(formatReferralCompact(1000000)).toBe('€1M');
    expect(formatReferralCompact(2000000)).toBe('€2M');
  });

  it('formatNaira and formatNairaCompact should alias formatReferralCurrency and formatReferralCompact', () => {
    expect(formatNaira(500)).toBe(formatReferralCurrency(500));
    expect(formatNairaCompact(5000)).toBe(formatReferralCompact(5000));
  });
});

describe('generateReferralCode', () => {
  it('should generate a code based on full_name and user_id suffix', () => {
    const profile = createMockProfile({
      user_id: 'usr-bob-1234',
      full_name: 'Robert Davis',
    });
    expect(generateReferralCode(profile)).toBe('robertda-1234');
  });

  it('should handle hyphenated user_id correctly', () => {
    const profile = createMockProfile({
      user_id: 'client-uuid-0042',
      full_name: 'Marcus Vance',
    });
    expect(generateReferralCode(profile)).toBe('marcusva-0042');
  });

  it('should clean special characters and symbols from names', () => {
    const profile = createMockProfile({
      user_id: 'usr-9876',
      full_name: "Jean-François d'Artois!",
    });
    expect(generateReferralCode(profile)).toBe('jeanfran-9876');
  });

  it('should fallback gracefully when name is empty', () => {
    const profile = createMockProfile({
      user_id: 'test-1234',
      full_name: '',
    });
    expect(generateReferralCode(profile)).toBe('member-1234');
  });

  it('should support profile with id instead of user_id', () => {
    const profile = createMockProfile({
      id: 'prof-id-7777',
      user_id: '',
      full_name: 'Elena Rostova',
    });
    expect(generateReferralCode(profile)).toBe('elenaros-7777');
  });
});

describe('buildReferralLink and buildSocialShareLinks', () => {
  it('should build a valid referral link', () => {
    const link = buildReferralLink('robertd-1234');
    expect(link).toContain('?ref=robertd-1234');
  });

  it('should generate social share links for WhatsApp, X, Facebook, and Email', () => {
    const link = buildReferralLink('robertd-1234');
    const links = buildSocialShareLinks(link, 'robertd-1234');
    expect(links.whatsapp).toContain('https://wa.me');
    expect(links.x).toContain('twitter.com/intent/tweet');
    expect(links.facebook).toContain('facebook.com/sharer');
    expect(links.telegram).toContain('t.me/share');
    expect(links.email).toContain('mailto:?subject=');
  });
});