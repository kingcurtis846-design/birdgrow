export type ReferrerType = 'basic' | 'investor';

export type MilestoneRewardStatus = 'locked' | 'in_progress' | 'unlocked' | 'pending' | 'paid' | 'reversed';

export type ReferralInvestmentQualification = 'qualified' | 'pending_verification' | 'reversed' | 'fraud_flagged';

export interface ReferralMilestoneDefinition {
  id: string;
  name: string; // e.g. "Seedling Pioneer", "Silver Flock Ambassador", "Gold Estate Syndicator", "Platinum Agri-Director", "Diamond Crown Principal"
  volumeThreshold: number; // e.g. 500, 100000, 250000, 500000, 500000
  label: string; // "€500", "€100,000"
  shortLabel: string; // "€500", "€100K"
  basicReward: number; // 5% calculation (€25, €5,000, €12,500, €30,000, €75,000)
  investorReward: number; // 10% calculation (€50, €10,000, €25,000, €60,000, €150,000)
  image?: string; // Image asset displayed by the left side of the milestone
  cycle?: number; // 1 for first bar, 2 for subsequent bar
}

export interface ReferralMilestoneReward {
  id: string;
  userId: string;
  milestoneId: string;
  volumeThreshold: number;
  rewardAmount: number;
  referrerTypeAtAward: ReferrerType;
  status: MilestoneRewardStatus;
  referenceId: string; // Immutable ref e.g. REF-REW-100K-928172
  awardedAt: string;
  paidAt?: string;
  notes?: string;
  cycle?: number; // 1 or 2
}

export interface ReferralRelationship {
  id: string;
  referrerUserId: string; // Referrer's user_id
  referrerCode: string; // The code used
  referredUserId: string; // The new user
  referredUserName: string;
  referredUserEmail: string;
  registrationDate: string;
  status: 'active' | 'suspended';
}

export interface ReferralQualifiedInvestment {
  id: string;
  investmentId: string;
  referrerUserId: string;
  referredUserId: string;
  referredUserName: string;
  amount: number;
  qualificationStatus: ReferralInvestmentQualification;
  investmentDate: string;
  qualificationDate: string;
  notes?: string;
}

export interface MilestoneProgressItem {
  definition: ReferralMilestoneDefinition;
  status: MilestoneRewardStatus;
  rewardAmount: number;
  isCompleted: boolean;
  isCurrentTarget: boolean;
  isLocked: boolean;
  awardedRecord?: ReferralMilestoneReward;
}

export interface MilestoneCycleBar {
  cycle: number;
  title: string;
  isCompleted: boolean;
  isPaymentReflected: boolean;
  currentVolume: number;
  targetVolume: number;
  progressPercentage: number;
  nextMilestone: ReferralMilestoneDefinition | null;
  volumeNeededForNextMilestone: number;
  milestones: MilestoneProgressItem[];
}

export interface ReferralUserSummary {
  userId: string;
  referrerType: ReferrerType;
  referralCode: string;
  referralLink: string;
  totalReferredCount: number;
  activeReferredInvestorsCount: number;
  totalQualifiedVolume: number;
  totalRewardsEarned: number;
  totalRewardsPaid: number;
  pendingRewards: number;
  availableRewards: number;
  currentMilestone: ReferralMilestoneDefinition | null;
  nextMilestone: ReferralMilestoneDefinition | null;
  volumeNeededForNextMilestone: number;
  progressPercentage: number;
  milestones: MilestoneProgressItem[];
  cycle1Completed: boolean;
  cycle1PaymentReflected: boolean;
  cycleBars: MilestoneCycleBar[];
  referrals: Array<{
    relationship: ReferralRelationship;
    investments: ReferralQualifiedInvestment[];
    totalInvested: number;
    hasActiveInvestment: boolean;
    lastInvestmentDate?: string;
  }>;
}
