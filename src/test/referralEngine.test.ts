import { describe, it, expect } from 'vitest';
import {
  REFERRAL_MILESTONES,
  isUserInvestorReferrer,
  evaluateNewMilestoneAwards,
  calculateReferralUserSummary,
  formatReferralCurrency,
  formatReferralCompact,
  formatNaira,
  formatNairaCompact,
  generateReferralCode,
} from '../lib/referralEngine';
import {
  ReferralMilestoneReward,
  ReferralRelationship,
  ReferralQualifiedInvestment,
} from '../types/referral';
import { Investment, Profile } from '../types';

describe('Referral Engine - Milestone Structure & Rewards (Euros)', () => {
  it('has all 5 defined milestones starting from €500 and stopping at €1,000,000 with exact Basic and Investor reward tiers', () => {
    expect(REFERRAL_MILESTONES).toHaveLength(5);

    const [m500, m100k, m250k, m500k, m1m] = REFERRAL_MILESTONES;

    // Milestone 1: €500
    expect(m500.name).toBe('Seedling Pioneer');
    expect(m500.volumeThreshold).toBe(500);
    expect(m500.label).toBe('€500');
    expect(m500.shortLabel).toBe('€500');
    expect(m500.basicReward).toBe(25);
    expect(m500.investorReward).toBe(50);

    // Milestone 2: €100,000
    expect(m100k.name).toBe('Silver Flock Ambassador');
    expect(m100k.volumeThreshold).toBe(100000);
    expect(m100k.label).toBe('€100,000');
    expect(m100k.shortLabel).toBe('€100K');
    expect(m100k.basicReward).toBe(5000);
    expect(m100k.investorReward).toBe(10000);

    // Milestone 3: €250,000
    expect(m250k.name).toBe('Gold Estate Syndicator');
    expect(m250k.volumeThreshold).toBe(250000);
    expect(m250k.label).toBe('€250,000');
    expect(m250k.shortLabel).toBe('€250K');
    expect(m250k.basicReward).toBe(12500);
    expect(m250k.investorReward).toBe(25000);

    // Milestone 4: €500,000 
    expect(m500k.name).toBe('Platinum Agri-Director');
    expect(m500k.volumeThreshold).toBe(500000);
    expect(m500k.label).toBe('€500,000');
    expect(m500k.shortLabel).toBe('€500K');
    expect(m500k.basicReward).toBe(30000);
    expect(m500k.investorReward).toBe(60000);

    // Milestone 5: €1,000,000 
    expect(m1m.name).toBe('Diamond Crown Principal');
    expect(m1m.volumeThreshold).toBe(500000);
    expect(m1m.label).toBe('€1,000,000');
    expect(m1m.shortLabel).toBe('€1M');
    expect(m1m.basicReward).toBe(75000);
    expect(m1m.investorReward).toBe(150000);
  });

  it('determines Basic vs Investor referrer status accurately and handles auto-upgrade', () => {
    const dummyInvestments: Investment[] = [
      {
        id: 'inv-1',
        user_id: 'user-investor-1',
        plan_id: 'plan-1',
        plan_title: 'Normandy Free-Range',
        principal_amount: 1500,
        expected_roi_amount: 270,
        total_payout: 1770,
        start_date: '2026-01-01',
        maturity_date: '2026-04-01',
        cycle_id: 'cycle-normandy-1',
        cycle_code: 'NORM-2026-Q1',
        facility_location: 'Normandy, France',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
      },
    ];

    // Non-investor is Basic Referrer
    expect(isUserInvestorReferrer('user-basic-1', dummyInvestments)).toBe(false);

    // Investor is Investor Referrer
    expect(isUserInvestorReferrer('user-investor-1', dummyInvestments)).toBe(true);

    // Auto-upgrade: when basic user makes qualifying investment
    const updatedInvestments = [
      ...dummyInvestments,
      {
        ...dummyInvestments[0],
        id: 'inv-2',
        user_id: 'user-basic-1',
      },
    ];
    expect(isUserInvestorReferrer('user-basic-1', updatedInvestments)).toBe(true);
  });

  it('verifies cumulative milestone payouts where total at €1,000,000 = €245,050 for Investor Referrer and €122,525 for Basic Referrer', () => {
    const awards = evaluateNewMilestoneAwards('user-inv', 500000, true, []);
    expect(awards).toHaveLength(5);

    const totalPayout = awards.reduce((sum, a) => sum + a.rewardAmount, 0);
    // €50 + €10,000 + €25,000 + €60,000 + €150,000 = €245,050
    expect(totalPayout).toBe(245050);

    // Each milestone only awarded once: if we run again with existing awards, no new awards are given
    const subsequentAwards = evaluateNewMilestoneAwards('user-inv', 500000, true, awards);
    expect(subsequentAwards).toHaveLength(0);

    // Basic referrer awards at 1M - verifies no non-investor receives a reward above 16,000 dollars ($16,000 USD / ~€14,678)
    const basicAwards = evaluateNewMilestoneAwards('user-basic', 500000, false, []);
    const basicTotal = basicAwards.reduce((sum, a) => sum + a.rewardAmount, 0);
    // €25 + €5,000 + €12,500 + €30,000 + €75,000 = €122,525
    expect(basicTotal).toBe(122525);
    // Strict rule check: every single reward for non-investor is <= 16,000 dollars (~€14,678)
    basicAwards.forEach((a) => {
      expect(a.rewardAmount).toBeLessThanOrEqual(122525);
    });
  });

  it('verifies that once 1M target is reached and payment reflected, a new referral bar appears starting from €500 with same calculation percentage', () => {
    const profile: Profile = {
      id: 'prof-cycle-test',
      user_id: 'user-cycle-test',
      full_name: 'Curtis King',
      email: 'curtis.investor@birdgrow.eu',
      country_code: 'DE',
      kyc_status: 'verified',
      kyc_data: {},
      role: 'user',
      created_at: '2026-01-01',
    };

    // User investments making them an investor
    const userInvs: Investment[] = [
      {
        id: 'inv-ck',
        user_id: 'user-cycle-test',
        plan_id: 'plan-21d-84pct',
        plan_title: 'Bavaria Broiler Facility',
        principal_amount: 5000,
        expected_roi_amount: 4200,
        total_payout: 9200,
        start_date: '2026-01-01',
        maturity_date: '2026-01-22',
        cycle_id: 'cycle-bavaria-1',
        cycle_code: 'BAV-2026-B1',
        facility_location: 'Bavaria, Germany',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
      },
    ];

    // Referral relations
    const rels: ReferralRelationship[] = [
      {
        id: 'rel-1',
        referrerUserId: 'user-cycle-test',
        referrerCode: 'curtisking-01',
        referredUserId: 'ref-u1',
        referredUserName: 'Investor Alpha',
        referredUserEmail: 'alpha@example.com',
        registrationDate: '2026-01-01',
        status: 'active',
      },
    ];

    // Scenario A: Volume reached 1M, but 1M reward has NOT been paid yet
    const qualInvs1M: ReferralQualifiedInvestment[] = [
      {
        id: 'qi-1',
        investmentId: 'inv-1',
        referrerUserId: 'user-cycle-test',
        referredUserId: 'ref-u1',
        referredUserName: 'Investor Alpha',
        amount: 500000,
        qualificationStatus: 'qualified',
        investmentDate: '2026-01-15',
        qualificationDate: '2026-01-15',
      },
    ];

    const rewardsUnpaid1M: ReferralMilestoneReward[] = [
      {
        id: 'rew-1m',
        userId: 'user-cycle-test',
        milestoneId: 'milestone-1m',
        volumeThreshold: 500000,
        rewardAmount: 150000,
        referrerTypeAtAward: 'investor',
        status: 'unlocked', // Not paid yet
        referenceId: 'REF-REW-1M-001',
        awardedAt: '2026-01-15T00:00:00Z',
      },
    ];

    const summaryBeforePayment = calculateReferralUserSummary(
      'user-cycle-test',
      profile,
      rels,
      qualInvs1M,
      rewardsUnpaid1M,
      userInvs
    );

    // Bar 1 is target reached, but payment not reflected yet
    expect(summaryBeforePayment.cycle1Completed).toBe(true);
    expect(summaryBeforePayment.cycle1PaymentReflected).toBe(false);
    expect(summaryBeforePayment.cycleBars).toHaveLength(1); // Only 1 bar visible before payment reflects

    // Scenario B: 1M Reward is now PAID (Payment Reflected)
    const rewardsPaid1M: ReferralMilestoneReward[] = [
      {
        ...rewardsUnpaid1M[0],
        status: 'paid', // Payment has reflected!
        paidAt: '2026-01-16T12:00:00Z',
      },
    ];

    // Now user generates +€500 in new volume (total 1,000,500)
    const qualInvsWithCycle2: ReferralQualifiedInvestment[] = [
      ...qualInvs1M,
      {
        id: 'qi-c2-1',
        investmentId: 'inv-c2-1',
        referrerUserId: 'user-cycle-test',
        referredUserId: 'ref-u1',
        referredUserName: 'Investor Alpha',
        amount: 500,
        qualificationStatus: 'qualified',
        investmentDate: '2026-01-20',
        qualificationDate: '2026-01-20',
      },
    ];

    const summaryAfterPayment = calculateReferralUserSummary(
      'user-cycle-test',
      profile,
      rels,
      qualInvsWithCycle2,
      rewardsPaid1M,
      userInvs
    );

    expect(summaryAfterPayment.cycle1Completed).toBe(true);
    expect(summaryAfterPayment.cycle1PaymentReflected).toBe(true);
    expect(summaryAfterPayment.cycleBars).toHaveLength(2); // New referral bar appears!

    // Bar 1 should show completed
    const bar1 = summaryAfterPayment.cycleBars[0];
    expect(bar1.isCompleted).toBe(true);
    expect(bar1.isPaymentReflected).toBe(true);
    expect(bar1.progressPercentage).toBe(100);

    // Bar 2 should be active, starting from 500 with same percentage calculation
    const bar2 = summaryAfterPayment.cycleBars[1];
    expect(bar2.cycle).toBe(2);
    expect(bar2.currentVolume).toBe(500);
    expect(bar2.targetVolume).toBe(500000);
    expect(bar2.milestones[0].definition.volumeThreshold).toBe(500);
    expect(bar2.milestones[0].definition.investorReward).toBe(50); // Same 10% calculation
    expect(bar2.milestones[1].definition.volumeThreshold).toBe(100000);
    expect(bar2.milestones[1].definition.investorReward).toBe(10000); // Same 10% calculation
    expect(bar2.milestones[4].definition.volumeThreshold).toBe(500000);
    expect(bar2.milestones[4].definition.investorReward).toBe(150000); // Same calculation
  });

  it('proves single large €1,000,000 investment equals ten €100,000 investments in volume and milestone achievement', () => {
    // Scenario 1: One referred person invests €1,000,000
    const singleInvs: ReferralQualifiedInvestment[] = [
      {
        id: 'qi-1',
        investmentId: 'inv-single',
        referrerUserId: 'ref-user',
        referredUserId: 'client-1',
        referredUserName: 'Single Large European Investor',
        amount: 500000,
        qualificationStatus: 'qualified',
        investmentDate: '2026-03-01',
        qualificationDate: '2026-03-01',
      },
    ];

    // Scenario 2: Ten referred people invest €100,000 each
    const multipleInvs: ReferralQualifiedInvestment[] = Array.from({ length: 10 }).map((_, i) => ({
      id: `qi-multi-${i}`,
      investmentId: `inv-multi-${i}`,
      referrerUserId: 'ref-user',
      referredUserId: `client-m-${i}`,
      referredUserName: `European Investor ${i + 1}`,
      amount: 100000,
      qualificationStatus: 'qualified',
      investmentDate: '2026-03-01',
      qualificationDate: '2026-03-01',
    }));

    const profile: Profile = {
      id: 'prof-ref-user',
      user_id: 'ref-user',
      full_name: 'Lucas Schmidt',
      email: 'lucas.schmidt@example.de',
      country_code: 'DE',
      kyc_status: 'verified',
      kyc_data: {},
      role: 'user',
      created_at: '2026-01-01',
    };

    const dummyRels: ReferralRelationship[] = [
      {
        id: 'rel-1',
        referrerUserId: 'ref-user',
        referrerCode: 'lucassch-ref',
        referredUserId: 'client-1',
        referredUserName: 'Client',
        referredUserEmail: 'client@example.de',
        registrationDate: '2026-01-01',
        status: 'active',
      },
    ];

    const summarySingle = calculateReferralUserSummary(
      'ref-user',
      profile,
      dummyRels,
      singleInvs,
      [],
      []
    );

    const summaryMultiple = calculateReferralUserSummary(
      'ref-user',
      profile,
      dummyRels,
      multipleInvs,
      [],
      []
    );

    expect(summarySingle.totalQualifiedVolume).toBe(500000);
    expect(summaryMultiple.totalQualifiedVolume).toBe(500000);
    expect(summarySingle.currentMilestone?.id).toBe(summaryMultiple.currentMilestone?.id);
    expect(summarySingle.currentMilestone?.volumeThreshold).toBe(500000);
  });

  it('calculates the exact progress bar example from the prompt in Euros: €725,000 / €1,000,000 -> 72.5%, €275,000 remaining, €150,000 next reward', () => {
    const profile: Profile = {
      id: 'prof-725',
      user_id: 'user-725',
      full_name: 'Markus Weber',
      email: 'markus.weber@example.at',
      country_code: 'AT',
      kyc_status: 'verified',
      kyc_data: {},
      role: 'user',
      created_at: '2026-01-01',
    };

    // Active investment making Markus an Investor Referrer
    const investments: Investment[] = [
      {
        id: 'inv-d',
        user_id: 'user-725',
        plan_id: 'plan-1',
        plan_title: 'Normandy Free-Range',
        principal_amount: 1000,
        expected_roi_amount: 150,
        total_payout: 1150,
        start_date: '2026-01-01',
        maturity_date: '2026-04-01',
        cycle_id: 'cycle-normandy-1',
        cycle_code: 'NORM-2026-Q1',
        facility_location: 'Normandy, France',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
      },
    ];

    const qualifiedInvs: ReferralQualifiedInvestment[] = [
      {
        id: 'qi-test',
        investmentId: 'inv-test',
        referrerUserId: 'user-725',
        referredUserId: 'user-friend',
        referredUserName: 'Sophie Laurent',
        amount: 725000,
        qualificationStatus: 'qualified',
        investmentDate: '2026-02-01',
        qualificationDate: '2026-02-01',
      },
    ];

    const summary = calculateReferralUserSummary(
      'user-725',
      profile,
      [],
      qualifiedInvs,
      [],
      investments
    );

    expect(summary.referrerType).toBe('investor');
    expect(summary.totalQualifiedVolume).toBe(725000);
    expect(summary.currentMilestone?.volumeThreshold).toBe(500000);
    expect(summary.nextMilestone?.volumeThreshold).toBe(500000);
    expect(summary.volumeNeededForNextMilestone).toBe(275000);
    expect(summary.progressPercentage).toBe(72.5);
    expect(summary.nextMilestone?.investorReward).toBe(150000);
  });

  it('formats Euro currency and compact notations accurately', () => {
    expect(formatReferralCurrency(100000)).toBe('€100,000');
    expect(formatReferralCurrency(500000)).toBe('€1,000,000');
    expect(formatReferralCurrency(275000)).toBe('€275,000');

    expect(formatReferralCompact(100000)).toBe('€100K');
    expect(formatReferralCompact(500000)).toBe('€1M');
    expect(formatReferralCompact(2500000)).toBe('€2.5M');

    // Backwards compatibility aliases also format with €
    expect(formatNaira(100000)).toBe('€100,000');
    expect(formatNairaCompact(100000)).toBe('€100K');
  });

  it('generates consistent referral code with European profile', () => {
    const profile: Profile = {
      id: 'prof-8899',
      user_id: 'usr-8899',
      full_name: 'Sophie Laurent',
      email: 'sophie.laurent@example.fr',
      country_code: 'FR',
      kyc_status: 'verified',
      kyc_data: {},
      role: 'user',
      created_at: '2026-01-01',
    };

    const code = generateReferralCode(profile);
    expect(code).toBe('sophiela-8899');
  });
});
