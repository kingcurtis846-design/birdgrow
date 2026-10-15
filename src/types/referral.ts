export type ReferrerType = 'basic' | 'investor';

export type ReferralInvestmentQualification = 'qualified' | 'pending' | 'ineligible' | 'reversed';

export interface ReferralMilestoneDefinition {
  id: string;
  name: string;
  volumeThreshold: number;
  label: string;
  shortLabel: string;
  basicReward: number;
  investorReward: number;
  image?: string;
  cycle?: number;
  [key: string]: any;
}

export interface ReferralMilestoneReward {
  id: string;
  userId: string;
  milestoneId: string;
  volumeThreshold: number;
  rewardAmount: number;
  referrerTypeAtAward: ReferrerType;
  status: 'unlocked' | 'pending' | 'approved' | 'paid' | 'rejected' | 'reversed';
  referenceId: string;
  awardedAt: string;
  cycle: number;
  notes?: string;
  paidAt?: string;
  [key: string]: any;
}

export interface ReferralRelationship {
  id: string;
  referrerUserId?: string;
  referrer_user_id?: string;
  referredUserId?: string;
  referred_user_id?: string;
  referredUserName?: string;
  referred_user_name?: string;
  referredUserEmail?: string;
  referred_user_email?: string;
  referrerCode?: string;
  referrer_code?: string;
  referralCode?: string;
  referral_code?: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt?: string;
  created_at?: string;
  [key: string]: any;
}

export interface ReferralQualifiedInvestment {
  id: string;
  referrerUserId?: string;
  referrer_user_id?: string;
  referredUserId?: string;
  referred_user_id?: string;
  referredUserName?: string;
  referred_user_name?: string;
  investmentId?: string;
  investment_id?: string;
  amount: number;
  qualificationStatus?: ReferralInvestmentQualification;
  qualification_status?: ReferralInvestmentQualification;
  investmentDate?: string;
  investment_date?: string;
  qualifiedAt?: string;
  cycle?: number;
  [key: string]: any;
}

export interface MilestoneProgressItem {
  definition: ReferralMilestoneDefinition;
  status: 'locked' | 'in_progress' | 'unlocked' | 'pending' | 'approved' | 'paid' | 'rejected' | 'reversed';
  rewardAmount: number;
  isCompleted: boolean;
  isCurrentTarget: boolean;
  isLocked: boolean;
  awardedRecord?: ReferralMilestoneReward;
  [key: string]: any;
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
  [key: string]: any;
}

export interface ReferralReferredUserItem {
  relationship: ReferralRelationship;
  investments: ReferralQualifiedInvestment[];
  totalInvested: number;
  hasActiveInvestment: boolean;
  lastInvestmentDate?: string;
  [key: string]: any;
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
  referrals: ReferralReferredUserItem[];

  // Backwards compatibility properties
  totalReferralsCount?: number;
  activeReferredCount?: number;
  totalRewardsUnlocked?: number;
  pendingPayoutAmount?: number;
  currentCycle?: number;
  [key: string]: any;
}

export type ReferralCycleMilestoneItem = MilestoneProgressItem;
export type ReferralCycleBar = MilestoneCycleBar;