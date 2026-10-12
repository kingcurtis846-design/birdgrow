import { Language } from '../types';

export interface Translations {
  // Navigation & Header
  navOverview: string;
  navHowItWorks: string;
  navFacilities: string;
  navPlans: string;
  navCalculator: string;
  navInvestorPortal: string;
  navAdminConsole: string;
  navSignIn: string;
  navStartInvesting: string;
  navSignOut: string;
  navAvailableBalance: string;
  navReferrals: string;
  navInvestorLounge: string;
  navSelectCurrency: string;
  navSelectLanguage: string;
  navAdmin: string;
  navWebsite: string;
  navInvestorDesk: string;
  navAdminDesk: string;
  navAiSupport: string;
  navHumanSupport: string;
  navInstantAssistant: string;
  navOperationsDesk: string;
  navUpTo: string;

  // Regulatory banner
  riskBanner?: string;
  riskNoticeLabel?: string;
  dismissNotice?: string;

  // Hero
  heroKicker: string;
  heroTitle: string;
  heroSubtext: string;
  heroCtaExplore: string;
  heroCtaCalc: string;
  heroCtaRefer: string;
  heroTotalBirdsLabel: string;
  heroMetricBatches: string;
  heroMetricBatchesSub: string;
  heroMetricCapital?: string;
  heroMetricCapitalSub: string;
  heroMetricVelocity?: string;
  heroMetricVelocitySub: string;
  heroMetricEsg?: string;
  heroMetricEsgSub: string;
  heroTotalFlock: string;
  heroForwardContracts: string;
  heroSolarPowered: string;
  heroNetRoiTarget: string;
  heroTargetReturn: string;
  heroHorizon: string;
  heroStatus: string;
  heroDays: string;
  heroPrevFarm: string;
  heroNextFarm: string;
  heroPause: string;
  heroResume: string;
  heroActiveLaying: string;
  heroGrowth: string;
  heroFinishing: string;
  heroChickPlacement: string;
  heroCommissioning: string;
  heroWorldwideAllocators: string;

  // Why Poultry
  whyTitle: string;
  whySubtitle: string;
  whyDesc: string;
  whyPillar1Title: string;
  whyPillar1Desc: string;
  whyPillar1Label: string;
  whyPillar2Title: string;
  whyPillar2Desc: string;
  whyPillar2Label: string;
  whyPillar3Title: string;
  whyPillar3Desc: string;
  whyPillar3Label: string;
  whyPillar4Title: string;
  whyPillar4Desc: string;
  whyPillar4Label: string;

  // How It Works
  howTitle: string;
  howSubtitle: string;
  howDesc: string;
  howStage: string;
  howStep1Title: string;
  howStep1Desc: string;
  howStep1Highlight: string;
  howStep2Title: string;
  howStep2Desc: string;
  howStep2Highlight: string;
  howStep3Title: string;
  howStep3Desc: string;
  howStep3Highlight: string;
  howExpenseTitle: string;
  howExpenseSubtitle: string;
  howExpenseDesc: string;
  howExpenseTab1: string;
  howExpenseTab2: string;
  howExpenseTab3: string;
  howExpenseTab4: string;
  howExpensePillar1: string;
  howExpensePillar1Tag: string;
  howExpensePillar1Summary: string;
  howExpensePillar2: string;
  howExpensePillar2Tag: string;
  howExpensePillar2Summary: string;
  howExpensePillar3: string;
  howExpensePillar3Tag: string;
  howExpensePillar3Summary: string;
  howExpensePillar4: string;
  howExpensePillar4Tag: string;
  howExpensePillar4Summary: string;

  // Facilities
  facTitle: string;
  facSubtitle: string;
  facDesc: string;
  facActiveHubsCount: string;
  facTotalCapacityCount: string;
  facDailyEggOutputCount: string;
  facRetailOfftake: string;
  facPreSold: string;
  facFarms: string;
  facBirds: string;
  facDay: string;
  facRetailReadyBadge: string;
  facCleanedDressedBadge: string;
  facEuStandard: string;
  facShowcaseTitle: string;
  facShowcaseDesc: string;
  facShowcasePillar1: string;
  facShowcasePillar2: string;
  facShowcasePillar3: string;
  facAlaskaTitle: string;
  facAlaskaSubtitle: string;
  facAlaskaDesc: string;
  facConstructionProgress: string;
  facFilterAll: string;
  facFilterBroilers: string;
  facFilterLayers: string;
  facFilterDual: string;
  facFilterAlaska: string;
  facSearchPlaceholder: string;
  facTotalFarms: string;
  facDailyEggs: string;
  facTotalBirds: string;
  facCertifiedOrganic: string;
  facActiveFlock: string;
  facSolarCapacity: string;
  facEggCapacity: string;
  facViewDetails: string;

  // Plans Section
  plansTitle: string;
  plansSubtitle: string;
  plansDesc: string;
  plansMin: string;
  plansMax: string;
  plansDuration: string;
  plansInvestNow: string;
  plansSelected: string;
  plansSelect: string;
  plansMostPopular: string;
  plansSovereign: string;
  plansContractualRoi: string;
  plansDays: string;
  plansRating: string;
  plansHighlights: string;
  plansBreed: string;

  // Yield Calculator
  calcTitle: string;
  calcSubtitle: string;
  calcDesc: string;
  calcSelectHorizon: string;
  calcCapitalAmount: string;
  calcEstimatedProfit: string;
  calcTotalPayout: string;
  calcApy: string;
  calcTargetDate: string;
  calcCta: string;
  calcInputAmountTier: string;
  calcAmountOutsideRange: string;
  calcQuickPresets: string;
  calcDailyEarningsEst: string;
  calcContractProtection: string;
  calcActiveTier: string;
  calcTopTier: string;
  calcValidRangeLabel: string;
  calcEnterAmount: string;
  calcForecastReturns: string;
  calcNoPotentialRoi: string;
  calcCycleLengthLabel: string;
  calcFixedPayoutLabel: string;
  calcPrincipalCapital: string;
  calcNetProfitLabel: string;
  calcAnnualizedRate: string;
  calcTotalPayoutLabel: string;
  calcCapPlusProfit: string;
  calcPaymentDropDate: string;
  calcCompletionNotice: string;
  calcLockAllocation: string;
  calcMinAllocationIs: string;
  calcMaxAllocationIs: string;
  calcInvalidMinDesc: string;
  calcInvalidMaxDesc: string;
  calcContactDesk: string;
  calcStarterMinPreset: string;
  calcGrowthTierPreset: string;
  calcCommercialTierPreset: string;
  calcEnterprisePreset: string;
  calcMaxSovereignPreset: string;

  // Referral Program
  refTitle: string;
  refSubtitle: string;
  refDesc: string;
  refCopyLink: string;
  refCopied: string;
  refJoinProgram: string;
  refDashboardCta: string;
  refYourLink: string;
  refEarnMilestones: string;
  refMaxReward: string;
  refCumulativeBadge: string;
  refHeroHeadline: string;
  refHeroInACycle: string;
  refNoNeedInvestNotice: string;
  refBasicReferrer: string;
  refInvestorReferrer: string;
  refBasicDesc: string;
  refInvestorDesc: string;
  refInstantReg: string;
  refNamedMilestones: string;
  refPotentialMax: string;
  refAutoRenewal: string;
  refDoubleRewards: string;
  refPriorityPayouts: string;
  refSingleMilestoneRange: string;
  refCodeLabel: string;
  refShareDirectly: string;
  refClaim: string;
  refClaimed: string;
  refLocked: string;
  refActiveMembers: string;
  refTotalVolume: string;
  refEarnedRewards: string;
  refAvailable: string;
  refTickerLive: string;

  // Testimonials & Reviews
  revTitle: string;
  revSubtitle?: string;
  revDesc: string;
  revDropReview: string;
  revVerifiedInvestor: string;
  revRoiAchieved?: string;
  revNetworkBadge: string;
  revGliding: string;
  revPaused: string;
  revScrollLeft: string;
  revScrollRight: string;
  revAllocatorsTitle: string;

  // Footer
  footerAbout: string;
  footerSolutions: string;
  footerTransparency: string;
  footerLegal: string;
  footerAllRightsReserved: string;
  footerOperatingReg: string;
  footerNonGmoNotice: string;
  footerSettlement: string;
  footerBtcEth: string;
  footerUsdtUsdc: string;
  footerEscrow: string;
  footerAmlKyc: string;
  footerRiskDisclaimer: string;
  footerPrivacy: string;
  footerTerms: string;
  footerEsg: string;

  // Investor Dashboard
  dashWelcome: string;
  dashOverview: string;
  dashInvestments: string;
  dashWalletLedger: string;
  dashReferrals: string;
  dashTelemetry: string;
  dashActivity: string;
  dashOfficialEmails: string;
  dashReviews: string;
  dashAvailableBalance: string;
  dashLockedCapital: string;
  dashTotalEarnings: string;
  dashDepositFunds: string;
  dashWithdrawFunds: string;
  dashAllocateCapital: string;
  dashActiveContracts: string;
  dashCountdownLabel: string;
  dashDaysRemaining: string;
  dashMaturedPayout: string;
  dashTransactionHistory: string;
  dashExportCsv: string;
  dashStatusPending: string;
  dashStatusSuccessful: string;
  dashStatusFailed: string;
  dashStatusPartial: string;
  dashCountdown: string;
  dashAutoCredit: string;
  dashComplete: string;
  dashDays: string;
  dashHours: string;
  dashMins: string;
  dashSecs: string;

  // Modals & General
  depositCryptoTitle: string;
  withdrawTitle: string;
  investTitle: string;
  authTitle: string;
  copyAddress: string;
  copied: string;
  closeModal: string;
  confirmAction: string;
  cancelAction: string;
  amountLabel: string;
  networkLabel: string;
  walletAddressLabel: string;
  destinationAccount: string;
  submitWithdrawal: string;
  submitDeposit: string;
  submitInvestment: string;

  // Auth Modal
  authSignIn: string;
  authCreateAccount: string;
  authAdminKey: string;
  authEmail: string;
  authPassword: string;
  authConfirmPassword: string;
  authFullName: string;
  authCountry: string;
  authReferralCode: string;
  authRequiredFields: string;
  authPassMin: string;
  authPassMismatch: string;
  authInvalidLogin: string;
  authAccessDenied: string;

  // Deposit Modal
  depositTitle: string;
  depositSub: string;
  depositApprox: string;
  depositMinNotice: string;
  depositTxHash: string;
  depositConfirm: string;
  depositProcessing: string;

  // Withdrawal Modal
  withdrawSub: string;
  withdrawKycNotice: string;
  withdrawInsufficient: string;
  withdrawConfirm: string;
  withdrawProcessing: string;

  // Invest Modal
  investSub: string;
  investInsufficient: string;
  investDepositFirst: string;
  investConfirm: string;
  investProcessing: string;

  // KYC Modal
  kycTitle: string;
  kycSub: string;
  kycLegalName: string;
  kycAddress: string;
  kycCity: string;
  kycCountry: string;
  kycPhone: string;
  kycSubmit: string;
  kycVerified: string;
  kycPending: string;

  // Review Modal
  reviewTitle: string;
  reviewSub: string;
  reviewQuote: string;
  reviewSubmit: string;

  // 2-Step Review Eligibility Flow Keys
  reviewEligibilityTitle: string;
  step1BannerTitle: string;
  step1BannerDesc: string;
  step1ActionBtn: string;
  step2BannerTitle: string;
  step2BannerDesc: string;
  step2ActionBtn: string;
  eligibleBannerTitle: string;
  eligibleBannerDesc: string;
  eligibleActionBtn: string;

  // Dashboard Metrics & Actions
  availableBalance: string;
  availableBalanceSubtitle: string;
  activeCapitalDeployed: string;
  activeCapitalSubtitle: string;
  totalNetProfitAccrued: string;
  totalNetProfitSubtitle: string;
  portfolioOverview: string;
  portfolioOverviewDesc: string;
  quickActions: string;
  activeCycles: string;
  recentActivity: string;
  depositFunds: string;
  requestWithdrawal: string;
  allocateCapital: string;
  leaveReviewBtn: string;
  viewAll: string;
  cancel: string;
  submit: string;
  hoverToPause: string;

  // Language Tabs
  langAll: string;
  langZh: string;
  langFr: string;
  langEs: string;
  langHi: string;
  langEn: string;
  platformName: string;
  tagline: string;

  // UI Convenience Helpers
  nav: {
    dashboard: string;
    plans: string;
    cycles: string;
    wallet: string;
    referrals: string;
    chat: string;
    admin: string;
    logout: string;
    login: string;
  };
  stats: {
    tvl: string;
    payouts: string;
    investors: string;
    activeCycles: string;
  };
  actions: {
    investNow: string;
    deposit: string;
    withdraw: string;
    details: string;
    confirm: string;
    cancel: string;
  };

  [key: string]: any;
}

export const translations: Record<Language, any> = {
  en: {
    // Navigation & Header
    navOverview: 'Home',
    navHowItWorks: 'How It Works',
    navFacilities: 'Facilities',
    navPlans: 'Investment Plans',
    navCalculator: 'Yield Calculator',
    navInvestorPortal: 'Investor Portal',
    navAdminConsole: 'Admin Console',
    navSignIn: 'Sign In',
    navStartInvesting: 'Start Investing',
    navSignOut: 'Sign Out',
    navAvailableBalance: 'Available Balance',
    navReferrals: 'Refer & Earn',
    navInvestorLounge: 'Investor Lounge',
    navSelectCurrency: 'Select Currency',
    navSelectLanguage: 'Select Language',
    navAdmin: 'Admin',
    navWebsite: 'Website',
    navInvestorDesk: 'Investor Portal',
    navAdminDesk: 'Admin Desk',
    navAiSupport: 'AI Support',
    navHumanSupport: 'Human Support',
    navInstantAssistant: 'Instant Assistant',
    navOperationsDesk: 'Operations Desk',
    navUpTo: 'Up to',

    // Hero
    heroKicker: 'EU Agri-Fintech · Real-Asset Crowdinvesting · Crypto & Escrow Settled',
    heroTitle: 'Invest in Sustainable Poultry Farming Across Europe.',
    heroSubtext: 'Participate in transparent European poultry production cycles and track your portfolio from chick placement to market distribution with contractual forward off-taker security.',
    heroCtaExplore: 'Explore Investment Plans',
    heroCtaCalc: 'Yield Calculator',
    heroCtaRefer: 'Refer & Earn Rewards',
    heroTotalBirdsLabel: 'Total Birds in Farm',
    heroMetricBatches: '15–60 Days Turnaround',
    heroMetricBatchesSub: 'Contractual biological harvest turnaround',
    heroMetricCapital: '£4.2M+',
    heroMetricCapitalSub: 'In Total Capital Deployed Across Our Farms',
    heroMetricVelocity: '15–60d',
    heroMetricVelocitySub: 'Fast biological capital liquidity',
    heroMetricEsg: '96/100',
    heroMetricEsgSub: '96 / 100 ESG Score',
    heroTotalFlock: 'Live Birds Under Management',
    heroForwardContracts: 'Guaranteed Off-Take Contracts',
    heroSolarPowered: 'Solar-Powered Facilities',
    heroNetRoiTarget: '50% – 320% Net Target ROI',
    heroTargetReturn: 'Target Return',
    heroHorizon: 'Horizon',
    heroStatus: 'Status',
    heroDays: 'Days',
    heroPrevFarm: 'Previous Farm',
    heroNextFarm: 'Next Farm',
    heroPause: 'Pause Slideshow',
    heroResume: 'Resume Slideshow',
    heroActiveLaying: 'Active Laying',
    heroGrowth: 'Growth',
    heroFinishing: 'Finishing',
    heroChickPlacement: 'Chick Placement',
    heroCommissioning: 'Commissioning',
    heroWorldwideAllocators: 'Worldwide Allocators',

    // Why Poultry
    whyTitle: 'Why European Poultry Outperforms Traditional Real Assets.',
    whySubtitle: 'Strategic Fundamentals',
    whyDesc: 'By combining biological efficiency, short production horizons, and transparent off-take agreements, sustainable European poultry delivers predictable, asset-backed yields.',
    whyPillar1Title: 'Unrivaled Feed Conversion Efficiency',
    whyPillar1Desc: 'Poultry converts feed to protein at an exceptional 1.45–1.62 ratio, compared to 6.0+ for beef. This dramatic metabolic efficiency shields investor returns from global grain price shocks while lowering the carbon footprint by up to 70%.',
    whyPillar1Label: 'Average metabolic feed conversion',
    whyPillar2Title: 'Rapid 15 to 60-Day Capital Velocity',
    whyPillar2Desc: 'Unlike multi-year cattle or timber investments, modern ethical broiler and layer cycles mature in 15 to 60 days. This allows investors to compound capital with high liquidity and minimal duration risk across European production runs.',
    whyPillar2Label: 'Contractual cycle turnaround',
    whyPillar3Title: 'Inelastic European Consumer Demand',
    whyPillar3Desc: 'Poultry is Europe’s fastest-growing staple protein. Every batch is pre-contracted through guaranteed forward off-take agreements with leading European supermarket chains and certified organic wholesalers before chick placement.',
    whyPillar3Label: 'Pre-contracted off-taker security',
    whyPillar4Title: 'Strict EU Biosafety & Veterinary Audits',
    whyPillar4Desc: 'All partner facilities enforce Bio-Security Level 3 standards with continuous automated monitoring of temperature, air exchange, humidity, and water intake, eliminating epidemiological risks and maintaining pristine bird health.',
    whyPillar4Label: 'Industry-low average flock mortality',

    // How It Works
    howTitle: 'How BirdGrow Works: Real Farm Asset Pairing',
    howSubtitle: 'Operational Architecture',
    howDesc: 'Unlike speculative financial instruments, your capital is paired directly with physical farm expenses—powering bird production, feed milling, and facility building across sustainable European agricultural hubs.',
    howStage: 'STAGE',
    howStep1Title: 'Capital Allocation & Contract Setup',
    howStep1Desc: 'Select an investment horizon (15 to 60 days). Your funds enter European escrow and are immediately assigned to an active agricultural cycle.',
    howStep1Highlight: 'From £500 entry threshold · 15–60 Days Turnaround',
    howStep2Title: 'Physical Pairing with Farm Expenses',
    howStep2Desc: 'Your capital does not sit idle. Every euro is physically deployed into direct flock production, automated feed milling, and bio-secure facility construction.',
    howStep2Highlight: 'Direct real-world asset collateralization & 100% Non-GMO feed',
    howStep3Title: 'Supermarket Distribution & Settlement',
    howStep3Desc: 'Upon cycle completion, our products—millions of certified grade-A table eggs and heritage poultry—are distributed to supermarket networks with contractual yield settled to your wallet.',
    howStep3Highlight: 'Worldwide egg & poultry distribution · Instant automated settlement',
    howExpenseTitle: 'Real Farm Asset Pairing & Capital Allocation',
    howExpenseSubtitle: 'Transparent Balance Sheet',
    howExpenseDesc: 'See how every euro of investor capital is allocated across active poultry operations, feed reserves, solar infrastructure, and cold-chain distribution.',
    howExpenseTab1: 'Flock Production (38%)',
    howExpenseTab2: 'Feed Milling (32%)',
    howExpenseTab3: 'Bio-Domes & Solar (20%)',
    howExpenseTab4: 'Logistics & Operations (10%)',
    howExpensePillar1: '1. Flock Production & Day-Old Placement',
    howExpensePillar1Tag: 'Biological Capital Asset',
    howExpensePillar1Summary: 'Sourcing, brooding, and raising premium organic poultry lines under strict EU animal welfare protocols.',
    howExpensePillar2: '2. Feed Production & Precision Milling',
    howExpensePillar2Tag: 'Nutritional Efficiency Core',
    howExpensePillar2Summary: 'On-site closed-loop feed production and grain formulations to eliminate 3rd-party markup and achieve 1.5:1 FCR.',
    howExpensePillar3: '3. Bio-Dome Facility Building & Solar Microgrids',
    howExpensePillar3Tag: 'Infrastructure & Real Property',
    howExpensePillar3Summary: 'Constructing and modernizing climate-controlled bio-domes across Germany, Netherlands, France, and Arctic Alaska.',
    howExpensePillar4: '4. Farm Operating Expenses & Cold-Chain Logistics',
    howExpensePillar4Tag: 'Turnaround & Distribution',
    howExpensePillar4Summary: 'All day-to-day farm overheads, environmental compliance, and temperature-controlled logistics to wholesale off-takers.',

    // Facilities
    facTitle: '30+ Certified European Production Hubs & Arctic Expansion',
    facSubtitle: 'European Agricultural Hubs',
    facDesc: 'Every euro invested is tied to concrete physical infrastructure. Over 60% of our network is dedicated to cage-free layers and organic table egg production, coupled with high-tech bio-secure broiler hubs.',
    facActiveHubsCount: 'Active Hubs',
    facTotalCapacityCount: 'Total Capacity',
    facDailyEggOutputCount: 'Daily Egg Output',
    facRetailOfftake: 'Retail Off-Take',
    facPreSold: '100% Pre-Sold',
    facFarms: 'Farms',
    facBirds: 'Birds',
    facDay: 'day',
    facRetailReadyBadge: 'Supermarket Retail Ready · Clingfilm Sealed',
    facCleanedDressedBadge: 'Cleaned · Dressed · Sealed Trays',
    facEuStandard: 'EU Sanitary Standard',
    facShowcaseTitle: 'From Biosecure European Farms to Supermarket Shelves',
    facShowcaseDesc: 'Our integrated supply chain connects every agricultural euro with retail distribution. Whole birds are hygienically slaughtered, dressed, and sealed in clear clingfilm grocery trays for European supermarket shelves.',
    facShowcasePillar1: 'Direct Supermarket Off-Take',
    facShowcasePillar2: 'Farm-to-Tray Traceability',
    facShowcasePillar3: 'Contractual Revenue Security',
    facAlaskaTitle: 'Alaska Arctic Sub-Zero Bio-Dome Hub',
    facAlaskaSubtitle: 'Construction & Commissioning Progress',
    facAlaskaDesc: 'Pioneering sub-zero geothermal & solar bio-domes in Fairbanks, Alaska, providing fresh organic table eggs and cold-hardy poultry to northern markets.',
    facConstructionProgress: 'Construction Progress',
    facFilterAll: 'All Facilities',
    facFilterBroilers: 'Broiler Hubs',
    facFilterLayers: 'Layers & Eggs',
    facFilterDual: 'Dual-Use Aviaries',
    facFilterAlaska: 'Arctic Alaska Hub',
    facSearchPlaceholder: 'Search facilities by name, country, breed or egg type...',
    facTotalFarms: 'Active Hubs',
    facDailyEggs: 'Daily Egg Output',
    facTotalBirds: 'Total Live Flock',
    facCertifiedOrganic: '100% EU Organic & Non-GMO',
    facActiveFlock: 'Active Flock Size',
    facSolarCapacity: 'Solar Array Capacity',
    facEggCapacity: 'Daily Table Eggs',
    facViewDetails: 'Explore Facility',

    // Plans Section
    plansTitle: 'Curated European Investment Plans.',
    plansSubtitle: 'Asset-Backed Allocations',
    plansDesc: 'High-performance short-turnaround poultry production plans underwritten by confirmed supermarket off-take agreements.',
    plansMin: 'Min. Entry',
    plansMax: 'Max. Tranche',
    plansDuration: 'Duration',
    plansInvestNow: 'Allocate Capital',
    plansSelected: 'Selected',
    plansSelect: 'Select Tier',
    plansMostPopular: 'Most Popular',
    plansSovereign: 'Sovereign Institutional',
    plansContractualRoi: 'Contractual Net Return',
    plansDays: 'Days',
    plansRating: 'Rating',
    plansHighlights: 'Highlights',
    plansBreed: 'Breed',

    // Yield Calculator
    calcTitle: 'Agricultural Return & Maturation Engine',
    calcSubtitle: 'Interactive Return Simulation',
    calcDesc: 'Calculate your contractual harvest ROI across all 4 European production horizons from £500 up to £1,000,000.',
    calcSelectHorizon: 'Select Production Horizon',
    calcCapitalAmount: 'Capital Allocation Amount',
    calcEstimatedProfit: 'Estimated Net Profit',
    calcTotalPayout: 'Total Estimated Payout',
    calcApy: 'Effective Annualized Yield (APY)',
    calcTargetDate: 'Estimated Harvest Settlement Date',
    calcCta: 'Allocate Capital to This Tier',
    calcInputAmountTier: 'Input Amount Tier',
    calcAmountOutsideRange: 'Amount Outside Valid Range (£500 – £1,000,000)',
    calcQuickPresets: 'Quick Preset Amounts',
    calcDailyEarningsEst: 'Estimated Daily Accrual',
    calcContractProtection: '100% Contractually Protected by Supermarket Off-Take',
    calcActiveTier: 'Active Tier',
    calcTopTier: 'Top Tier',
    calcValidRangeLabel: 'Valid Range',
    calcEnterAmount: 'Enter allocation amount',
    calcForecastReturns: 'Forecasted Harvest Returns',
    calcNoPotentialRoi: 'No Potential ROI',
    calcCycleLengthLabel: 'Cycle Length',
    calcFixedPayoutLabel: 'Fixed Contractual Payout',
    calcPrincipalCapital: 'Principal Capital',
    calcNetProfitLabel: 'Contractual Net Profit',
    calcAnnualizedRate: 'Annualized Run-Rate',
    calcTotalPayoutLabel: 'Total Payout',
    calcCapPlusProfit: 'Combination of Capital + Profit',
    calcPaymentDropDate: 'Payment Drop Date',
    calcCompletionNotice: 'Upon completion, your full principal and net profit automatically drop into your wallet balance.',
    calcLockAllocation: 'Lock Allocation in',
    calcMinAllocationIs: 'Minimum Allocation is',
    calcMaxAllocationIs: 'Maximum Allocation is',
    calcInvalidMinDesc: 'Invalid Allocation Amount: Minimum investment is £500. Amounts below £500 do not qualify for contractual poultry cycles.',
    calcInvalidMaxDesc: 'Invalid Allocation Amount: Allocation exceeds the platform limit of £1,000,000.',
    calcContactDesk: 'Please contact our administrative desk for private institutional OTC custody.',
    calcStarterMinPreset: 'Starter Min',
    calcGrowthTierPreset: 'Growth Tier',
    calcCommercialTierPreset: 'Commercial Tier',
    calcEnterprisePreset: 'Enterprise',
    calcMaxSovereignPreset: 'Max Sovereign',

    // Referral Program
    refTitle: 'European Partner & Referral Milestone Engine',
    refSubtitle: 'Community Volume Rewards',
    refDesc: 'Earn up to £245,050 in cumulative referral bonuses. Share your unique partner link with private allocators and earn on every qualified investment cycle.',
    refCopyLink: 'Copy Referral Link',
    refCopied: 'Copied to Clipboard!',
    refJoinProgram: 'Join Partner Program',
    refDashboardCta: 'View Referral Dashboard',
    refYourLink: 'Your Unique Invite Link',
    refEarnMilestones: 'Earn Tier Milestone Rewards',
    refMaxReward: 'Up to £245,050 Max Payout',
    refCumulativeBadge: 'Cumulative Milestone Referral Program',
    refHeroHeadline: 'Refer Partners & Earn up to',
    refHeroInACycle: 'in a Cycle',
    refNoNeedInvestNotice: 'You do not need to have invested to start referring and earning rewards! Anyone can register, generate a unique referral link, and accumulate volume.',
    refBasicReferrer: 'Basic Referrer',
    refInvestorReferrer: 'Investor Referrer',
    refBasicDesc: 'For partners who haven’t yet made an investment on BirdGrow.',
    refInvestorDesc: 'For active investors on BirdGrow — unlocks 2X higher milestone payouts!',
    refInstantReg: 'Instant Registration: Create a referral link immediately with zero initial deposit.',
    refNamedMilestones: 'Named Milestones: Progress from Seedling Pioneer to Diamond Crown Principal.',
    refPotentialMax: 'Potential Max Payout in a Cycle',
    refAutoRenewal: 'Automatic Renewal: Once cycle target is reached and payment reflected, a new referral bar appears!',
    refDoubleRewards: '2X Higher Milestone Rewards across all levels.',
    refPriorityPayouts: 'Priority settlement into your main wallet.',
    refSingleMilestoneRange: 'Single Milestone Payout Range',
    refCodeLabel: 'Code',
    refShareDirectly: 'Share Directly with Contacts',
    refClaim: 'Claim',
    refClaimed: 'Claimed',
    refLocked: 'Locked',
    refActiveMembers: 'Active Members',
    refTotalVolume: 'Total Volume',
    refEarnedRewards: 'Earned Rewards',
    refAvailable: 'Available',
    refTickerLive: 'Live Referral Milestone Payouts',

    // Testimonials & Reviews
    revTitle: 'Real Yield. Verified Across 6 Continents.',
    revSubtitle: 'Global Investor Network',
    revDesc: 'Family offices, sovereign wealth desks, and private agricultural allocators from Tokyo to Austin compound returns on BirdGrow. Watch their verified harvest reviews glide through in real time.',
    revDropReview: 'Drop a Review',
    revVerifiedInvestor: 'Verified Harvest Investor',
    revRoiAchieved: 'Contractual ROI Achieved',
    revNetworkBadge: 'Global Investor Network',
    revGliding: 'Gliding',
    revPaused: 'Paused',
    revScrollLeft: 'Scroll Left',
    revScrollRight: 'Scroll Right',
    revAllocatorsTitle: 'Worldwide Allocators',

    // Footer
    footerAbout: 'Sustainable European poultry farming investment platform connecting private and institutional capital with transparent, bio-secure agricultural production cycles and reliable returns.',
    footerSolutions: 'Investment Solutions',
    footerTransparency: 'Agricultural Infrastructure',
    footerLegal: 'Regulatory & Governance',
    footerAllRightsReserved: 'All rights reserved. BirdGrow European Agri-Fintech S.A.',
    footerOperatingReg: 'Operating in accordance with EU Crowdfunding Regulation (ECSP 2020/1503)',
    footerNonGmoNotice: '100% Non-GMO EU Feed Standard & Verified Solar-Powered Facilities',
    footerSettlement: 'Settlement & Safety',
    footerBtcEth: 'Bitcoin (BTC) & Ethereum (ETH) Settlement',
    footerUsdtUsdc: 'Tether (USDT TRC20/ERC20) & USDC Stablecoins',
    footerEscrow: 'Tier 1 Custodial Escrow',
    footerAmlKyc: 'EU AML & KYC Verification',
    footerRiskDisclaimer: 'Regulatory & Risk Notice: Investing in agricultural production contracts involves biological risks, weather volatility, feed price fluctuations, and operational variances. Past cycle yields do not guarantee identical future results.',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Service',
    footerEsg: 'ESG Taxonomy & Sustainability Disclosure',

    // Investor Dashboard
    dashWelcome: 'Welcome back,',
    dashOverview: 'Overview',
    dashInvestments: 'My Contracts',
    dashWalletLedger: 'Wallet & Ledger',
    dashReferrals: 'Referral Hub',
    dashTelemetry: 'Farm Telemetry',
    dashActivity: 'Activity History',
    dashOfficialEmails: 'Official Dispatches',
    dashReviews: 'Investor Reviews',
    dashAvailableBalance: 'AVAILABLE BALANCE',
    dashLockedCapital: 'ACTIVE CAPITAL DEPLOYED',
    dashTotalEarnings: 'TOTAL NET PROFIT ACCRUED',
    dashDepositFunds: 'Deposit Capital',
    dashWithdrawFunds: 'Request Withdrawal',
    dashAllocateCapital: 'Deploy Capital',
    dashActiveContracts: 'Active Production Cycles',
    dashCountdownLabel: 'Harvest Settlement In',
    dashDaysRemaining: 'Days Remaining',
    dashMaturedPayout: 'Matured & Settled',
    dashTransactionHistory: 'Audit Ledger & Transactions',
    dashExportCsv: 'Export CSV Audit',
    dashStatusPending: 'Pending Verification',
    dashStatusSuccessful: 'Settled & Cleared',
    dashStatusFailed: 'Declined / Cancelled',
    dashStatusPartial: 'Partial Disbursement',
    dashCountdown: 'Settlement Countdown',
    dashAutoCredit: 'Auto-Credited at 00:00',
    dashComplete: 'Harvest Tenure Complete',
    dashDays: 'DAYS',
    dashHours: 'HOURS',
    dashMins: 'MINS',
    dashSecs: 'SECS',

    // Modals & General
    depositCryptoTitle: 'Deposit via Cryptocurrency',
    withdrawTitle: 'Withdraw Funds & Capital',
    investTitle: 'Allocate Capital to Production Plan',
    authTitle: 'Investor Access & Account Portal',
    copyAddress: 'Copy Address',
    copied: 'Copied!',
    closeModal: 'Close',
    confirmAction: 'Confirm & Proceed',
    cancelAction: 'Cancel',
    amountLabel: 'Amount',
    networkLabel: 'Blockchain Network',
    walletAddressLabel: 'Recipient Wallet Address',
    destinationAccount: 'Destination Account',
    submitWithdrawal: 'Confirm Withdrawal Request',
    submitDeposit: 'Notify Admin of Payment',
    submitInvestment: 'Confirm Capital Allocation',

    // Auth Modal
    authSignIn: 'Sign In',
    authCreateAccount: 'Create Account',
    authAdminKey: 'Admin Key',
    authEmail: 'Email Address',
    authPassword: 'Password',
    authConfirmPassword: 'Confirm Password',
    authFullName: 'Full Legal Name',
    authCountry: 'Country / Residency',
    authReferralCode: 'Referral Code (Optional)',
    authRequiredFields: 'Please complete all required fields',
    authPassMin: 'Password must be at least 6 characters',
    authPassMismatch: 'Passwords do not match',
    authInvalidLogin: 'Invalid login credentials. Please verify your details.',
    authAccessDenied: 'Access Denied: Invalid admin credentials.',

    // Deposit Modal
    depositTitle: 'Deposit Crypto Capital',
    depositSub: 'Fund your account wallet balance via secure blockchain transfer',
    depositApprox: 'Approximate Crypto Equivalent',
    depositMinNotice: 'Minimum deposit is',
    depositTxHash: 'Transaction Hash / Reference (Optional)',
    depositConfirm: 'Notify Admin of Payment',
    depositProcessing: 'Submitting Deposit...',

    // Withdrawal Modal
    withdrawSub: 'Request capital and accrued harvest payout to your personal wallet',
    withdrawKycNotice: 'Under European AML Directives, withdrawals require identity verification (KYC).',
    withdrawInsufficient: 'Requested amount exceeds available balance.',
    withdrawConfirm: 'Confirm Withdrawal Request',
    withdrawProcessing: 'Submitting Request...',

    // Invest Modal
    investSub: 'Secure your contractual share of an active European poultry cycle',
    investInsufficient: 'Insufficient Wallet Balance',
    investDepositFirst: 'Deposit Funds First',
    investConfirm: 'Confirm Capital Allocation',
    investProcessing: 'Allocating Capital...',

    // KYC Modal
    kycTitle: 'European Regulatory KYC Verification',
    kycSub: 'Fulfill EU ECSP 2020/1503 compliance for unlimited capital withdrawals',
    kycLegalName: 'Full Legal Name',
    kycAddress: 'Residential Address',
    kycCity: 'City',
    kycCountry: 'Country of Residence',
    kycPhone: 'Phone Number',
    kycSubmit: 'Submit Verification Documents',
    kycVerified: 'KYC Status: Verified',
    kycPending: 'KYC Status: Pending Review',

    // Review Modal
    reviewTitle: 'Submit Verified Investor Review',
    reviewSub: 'Share your experience compounding capital across European poultry harvests',
    reviewQuote: 'Your Review & Experience',
    reviewSubmit: 'Submit Harvest Review',

    // 2-Step Review Eligibility Flow Keys
    reviewEligibilityTitle: 'Investor Review Qualification',
    step1BannerTitle: 'Step 1 of 2: Deploy Capital',
    step1BannerDesc: 'Make your first capital allocation to start your investment journey.',
    step1ActionBtn: 'Deploy Capital Now',
    step2BannerTitle: 'Step 2 of 2: Complete a Withdrawal',
    step2BannerDesc: 'You just made your first capital allocation! Once you request and receive your first profit withdrawal, you will be eligible to leave a public review.',
    step2ActionBtn: 'Request Withdrawal',
    eligibleBannerTitle: 'You are eligible to leave a review!',
    eligibleBannerDesc: 'You are eligible to leave a review! Your verified harvest experience helps guide global allocators.',
    eligibleActionBtn: 'Write Your Review',

    // Dashboard Metrics & Actions
    availableBalance: 'AVAILABLE BALANCE',
    availableBalanceSubtitle: 'Liquid capital ready for deployment or withdrawal',
    activeCapitalDeployed: 'ACTIVE CAPITAL DEPLOYED',
    activeCapitalSubtitle: 'Contractually secured across active cycles',
    totalNetProfitAccrued: 'TOTAL NET PROFIT ACCRUED',
    totalNetProfitSubtitle: 'Cumulative audited yield returned to portfolio',
    portfolioOverview: 'Portfolio Overview',
    portfolioOverviewDesc: 'Real-time ledger balance, poultry allocations, and contractual yield accrual.',
    quickActions: 'Quick Actions',
    activeCycles: 'Active Agricultural Cycles',
    recentActivity: 'Recent Financial Operations',
    depositFunds: 'Deposit Funds',
    requestWithdrawal: 'Request Withdrawal',
    allocateCapital: 'Deploy Capital',
    leaveReviewBtn: 'Leave a Review',
    viewAll: 'View All',
    cancel: 'Cancel',
    submit: 'Submit Review',
    hoverToPause: 'Hover or touch any review card to pause glide',

    // Language Tabs
    langAll: 'All',
    langZh: 'Chinese',
    langFr: 'French',
    langEs: 'Spanish',
    langHi: 'Hindi',
    langEn: 'English',
    platformName: 'BirdGrow',
    tagline: 'European Agri-Fintech Asset Management',

    nav: {
      dashboard: 'Dashboard',
      plans: 'Investment Plans',
      cycles: 'Live Cycles & Facilities',
      wallet: 'Wallet & Treasury',
      referrals: 'Ambassador & Referrals',
      chat: 'Investor Community',
      admin: 'Operations Console',
      logout: 'Sign Out',
      login: 'Sign In',
    },
    stats: {
      tvl: 'Total Value Locked',
      payouts: 'Harvest Yields Settled',
      investors: 'Verified Backers',
      activeCycles: 'Active Bio-Domes',
    },
    actions: {
      investNow: 'Allocate Capital',
      deposit: 'Deposit Funds',
      withdraw: 'Request Withdrawal',
      details: 'View Details',
      confirm: 'Confirm Action',
      cancel: 'Cancel',
    },
  },

  de: {
    // Navigation & Header
    navOverview: 'Startseite',
    navHowItWorks: 'Funktionsweise',
    navFacilities: 'Betriebe',
    navPlans: 'Anlagepläne',
    navCalculator: 'Renditerechner',
    navInvestorPortal: 'Investorenportal',
    navAdminConsole: 'Admin-Konsole',
    navSignIn: 'Anmelden',
    navStartInvesting: 'Jetzt Investieren',
    navSignOut: 'Abmelden',
    navAvailableBalance: 'Verfügbares Guthaben',
    navReferrals: 'Partnerprogramm',
    navInvestorLounge: 'Investoren-Lounge',
    navSelectCurrency: 'Währung wählen',
    navSelectLanguage: 'Sprache wählen',
    navAdmin: 'Admin',
    navWebsite: 'Webseite',
    navInvestorDesk: 'Investorenportal',
    navAdminDesk: 'Admin-Pult',
    navAiSupport: 'KI-Support',
    navHumanSupport: 'Mitarbeiter-Support',
    navInstantAssistant: 'Sofort-Assistent',
    navOperationsDesk: 'Betriebs-Desk',
    navUpTo: 'Bis zu',

    // Hero
    heroKicker: 'EU Agrar-Fintech · Sachwert-Crowdinvesting · Krypto & Treuhand',
    heroTitle: 'Investieren Sie in nachhaltige Geflügelzucht in Europa.',
    heroSubtext: 'Nehmen Sie an transparenten europäischen Geflügelproduktionszyklen teil und verfolgen Sie Ihr Portfolio vom Kükenschlupf bis zur Vermarktung mit gesicherten Festabnahmeverträgen.',
    heroCtaExplore: 'Anlagepläne ansehen',
    heroCtaCalc: 'Renditerechner',
    heroCtaRefer: 'Empfehlen & Prämien Sichern',
    heroTotalBirdsLabel: 'Tierbestand gesamt',
    heroMetricBatches: '15–60 Tage Umschlag',
    heroMetricBatchesSub: 'Vertraglich abgesicherter Produktionsumschlag',
    heroMetricCapital: '45,2 Mio. £',
    heroMetricCapitalSub: 'Gesamtkapital, das in unseren Farmen eingesetzt wird',
    heroMetricVelocity: '15–60 T.',
    heroMetricVelocitySub: 'Schnelle biologische Liquidität',
    heroMetricEsg: '96/100',
    heroMetricEsgSub: '96 / 100 ESG-Index',
    heroTotalFlock: 'Aktiver Tierbestand unter Management',
    heroForwardContracts: 'Feste Abnahmeverträge',
    heroSolarPowered: 'Solarbetriebene Anlagen',
    heroNetRoiTarget: '50% – 320% Netto-Zielrendite',
    heroTargetReturn: 'Zielrendite',
    heroHorizon: 'Laufzeit',
    heroStatus: 'Status',
    heroDays: 'Tage',
    heroPrevFarm: 'Vorheriger Betrieb',
    heroNextFarm: 'Nächster Betrieb',
    heroPause: 'Diashow pausieren',
    heroResume: 'Diashow fortsetzen',
    heroActiveLaying: 'Aktive Legephase',
    heroGrowth: 'Wachstum',
    heroFinishing: 'Endmast',
    heroChickPlacement: 'Kükeneinstallung',
    heroCommissioning: 'Inbetriebnahme',
    heroWorldwideAllocators: 'Internationale Investoren',

    // Why Poultry
    whyTitle: 'Warum europäisches Geflügel traditionelle Sachwerte übertrifft.',
    whySubtitle: 'Strategische Grundlagen',
    whyDesc: 'Durch die Kombination von Futterverwertungseffizienz, kurzen Zyklen und festen Abnahmeverträgen liefert Geflügel planbare, inflationsgeschützte Erträge.',
    whyPillar1Title: 'Unübertroffene Futterverwertungseffizienz',
    whyPillar1Desc: 'Geflügel wandelt Futter mit einem exzellenten Verhältnis von 1,45–1,62 in Protein um (Rind: 6,0+). Diese metabolische Effizienz schützt Investoren vor Getreidepreisschwankungen und senkt den CO2-Fußabdruck um bis zu 70%.',
    whyPillar1Label: 'Durchschnittliche Futterverwertung',
    whyPillar2Title: 'Schneller Umschlag in 15 bis 60 Tagen',
    whyPillar2Desc: 'Anders als mehrjährige Rinder- oder Forstwirtschaftsprojekte reifen moderne Geflügelzyklen in 15 bis 60 Tagen. Das ermöglicht schnelle Zinseszins-Effekte bei minimalem Laufzeitrisiko.',
    whyPillar2Label: 'Vertraglicher Produktionsumschlag',
    whyPillar3Title: 'Konstant hohe europäische Nachfrage',
    whyPillar3Desc: 'Geflügel ist die am schnellsten wachsende Proteinquelle in Europa. Jede Charge ist vor Kükeneinstallung durch garantierte Vorabverträge mit führenden Supermarktketten und Bio-Großhändlern fest kontrahiert.',
    whyPillar3Label: '100% vorvertraglich garantierte Abnahme',
    whyPillar4Title: 'Strenge EU-Biosicherheits- & Veterinärausdits',
    whyPillar4Desc: 'Alle Partnerbetriebe erfüllen Biosicherheitsstufe 3 mit automatisierter Echtzeit-Überwachung von Stalltemperatur, Luftaustausch, Feuchtigkeit und Trinkwasserhygiene.',
    whyPillar4Label: 'Branchenweit minimale Verlustrate',

    // How It Works
    howTitle: 'So funktioniert BirdGrow: Reale Sachwert-Kopplung',
    howSubtitle: 'Operativer Ablauf',
    howDesc: 'Anders als spekulative Finanzprodukte ist Ihr Kapital direkt an reale Agrarausgaben gekoppelt – Tierzucht, Futtermühlen und bio-klimatisierte Stallbauten.',
    howStage: 'STUFE',
    howStep1Title: 'Kapitalallokation & Vertragsabschluss',
    howStep1Desc: 'Wählen Sie Ihren Anlagehorizont (15 bis 60 Tage). Ihre Mittel fließen auf ein europäisches Treuhandkonto und werden direkt einem aktiven Zyklus zugeordnet.',
    howStep1Highlight: 'Ab £500 Mindestanlage · 15–60 Tage Laufzeit',
    howStep2Title: 'Physische Verknüpfung mit Sachwerten',
    howStep2Desc: 'Ihr Kapital liegt nicht brach. Jeder Euro fließt direkt in Geflügelbestand, hofeigene Futtermühlen und modernste Bio-Sicherheitsställe.',
    howStep2Highlight: 'Direkte Besicherung durch reale Agrarwerte & 100% GVO-freies Futter',
    howStep3Title: 'Supermarkt-Auslieferung & Abrechnung',
    howStep3Desc: 'Nach Zyklusende werden die Produkte (zertifizierte Frischeier und Freilandgeflügel) an Lebensmitteleinzelhändler geliefert und der Ertrag wird sofort ausgezahlt.',
    howStep3Highlight: 'Weltweite Distribution · Sofortige automatisierte Auszahlung',
    howExpenseTitle: 'Transparente Sachwert-Kopplung & Mittelverwendung',
    howExpenseSubtitle: 'Offene Bilanztransparenz',
    howExpenseDesc: 'Erfahren Sie, wie jeder investierte Euro präzise in Tieraufzucht, Futterreserven, Solaranlagen und Kühlkettenlogistik fließt.',
    howExpenseTab1: 'Tieraufzucht (38%)',
    howExpenseTab2: 'Futtermühlen (32%)',
    howExpenseTab3: 'Bio-Domes & Solar (20%)',
    howExpenseTab4: 'Logistik & Betrieb (10%)',
    howExpensePillar1: '1. Tieraufzucht & Kükeneinstallung',
    howExpensePillar1Tag: 'Biologisches Anlagevermögen',
    howExpensePillar1Summary: 'Beschaffung, Aufzucht und Pflege hochwertiger Bio-Geflügellinien nach strengsten EU-Tierwohlstandards.',
    howExpensePillar2: '2. Futtermühlen & Präzisionsmischung',
    howExpensePillar2Tag: 'Ernährungs-Effizienzkern',
    howExpensePillar2Summary: 'Hofeigene geschlossene Futtermühlen und Rezepturen zur Eliminierung von Zwischenhändlermargen und Erreichung einer FCR von 1,5:1.',
    howExpensePillar3: '3. Bio-Dome Stallbauten & Solar-Mikronetze',
    howExpensePillar3Tag: 'Infrastruktur & Sachanlagen',
    howExpensePillar3Summary: 'Bau und Modernisierung klimatisierter Bio-Domes in Deutschland, den Niederlanden, Frankreich und Arktis-Alaska.',
    howExpensePillar4: '4. Betriebskosten & Kühlkettenlogistik',
    howExpensePillar4Tag: 'Umschlag & Distribution',
    howExpensePillar4Summary: 'Laufende Betriebsausgaben, Hygiene-Audits und temperaturgeführte Logistik direkt zu Großabnehmern.',

    // Facilities
    facTitle: '30+ Zertifizierte Europäische Betriebe & Arktis-Expansion',
    facSubtitle: 'Europäische Agrarzentren',
    facDesc: 'Jeder investierte Betrag fließt direkt in reale Stall- und Weideinfrastruktur. Über 60% unseres Netzes produzieren Bio-Eier in Freilandhaltung, ergänzt durch hochmoderne Broiler-Hubs.',
    facActiveHubsCount: 'Aktive Betriebe',
    facTotalCapacityCount: 'Gesamtkapazität',
    facDailyEggOutputCount: 'Tägliche Eiproduktion',
    facRetailOfftake: 'Handelsabnahme',
    facPreSold: '100% Vorverkauft',
    facFarms: 'Betriebe',
    facBirds: 'Tiere',
    facDay: 'Tag',
    facRetailReadyBadge: 'Verkaufsfertig für Supermärkte · Frischhaltefolie versiegelt',
    facCleanedDressedBadge: 'Küchenfertig · Versiegelte Schalen',
    facEuStandard: 'EU-Hygienestandard',
    facShowcaseTitle: 'Vom europäischen Bio-Betrieb ins Supermarktregal',
    facShowcaseDesc: 'Unsere Lieferkette verbindet jeden Agrar-Euro mit dem Lebensmitteleinzelhandel. Schlachtgeflügel wird hygienisch verarbeitet und auf Frischetassen mit Klarsichtfolie versiegelt geliefert.',
    facShowcasePillar1: 'Feste Supermarkt-Abnahme',
    facShowcasePillar2: 'Vollständige Rückverfolgbarkeit',
    facShowcasePillar3: 'Vertragliche Ertragssicherheit',
    facAlaskaTitle: 'Arktis-Bio-Dome Alaska Hub',
    facAlaskaSubtitle: 'Bau- & Inbetriebnahme-Fortschritt',
    facAlaskaDesc: 'Pionierarbeit mit geothermischen und solaren Bio-Domes in Fairbanks, Alaska, zur regionalen Versorgung mit Bio-Eiern und kälteresistentem Geflügel.',
    facConstructionProgress: 'Baufortschritt',
    facFilterAll: 'Alle Betriebe',
    facFilterBroilers: 'Masthähnchen-Hubs',
    facFilterLayers: 'Legehennen & Eier',
    facFilterDual: 'Mehrzweck-Volieren',
    facFilterAlaska: 'Arktis-Hub Alaska',
    facSearchPlaceholder: 'Betriebe nach Name, Land, Rasse oder Eityp suchen...',
    facTotalFarms: 'Aktive Betriebe',
    facDailyEggs: 'Tägliche Eiproduktion',
    facTotalBirds: 'Gesamtbestand',
    facCertifiedOrganic: '100% Bio & GVO-Frei',
    facActiveFlock: 'Herdengröße',
    facSolarCapacity: 'Solarstrom-Leistung',
    facEggCapacity: 'Tägliche Speiseeier',
    facViewDetails: 'Betrieb ansehen',

    // Plans Section
    plansTitle: 'Kurierte europäische Anlagepläne.',
    plansSubtitle: 'Sachwertgestützte Allokationen',
    plansDesc: 'Hochrentable Kurzläuferpläne mit vorvertraglichen Abnahmegarantien des Lebensmitteleinzelhandels.',
    plansMin: 'Mindesteinlage',
    plansMax: 'Maximale Tranche',
    plansDuration: 'Laufzeit',
    plansInvestNow: 'Kapital anlegen',
    plansSelected: 'Ausgewählt',
    plansSelect: 'Plan wählen',
    plansMostPopular: 'Sehr Beliebt',
    plansSovereign: 'Institutionell',
    plansContractualRoi: 'Vertragliche Nettorendite',
    plansDays: 'Tage',
    plansRating: 'Rating',
    plansHighlights: 'Besonderheiten',
    plansBreed: 'Rasse',

    // Yield Calculator
    calcTitle: 'Renditerechner & Reifegrad-Engine',
    calcSubtitle: 'Interaktive Ertragssimulation',
    calcDesc: 'Berechnen Sie Ihre vertragliche Ernte-Rendite über alle 4 europäischen Horizonte von £500 bis zu £1.000.000.',
    calcSelectHorizon: 'Investitionshorizont wählen',
    calcCapitalAmount: 'Investitionsbetrag',
    calcEstimatedProfit: 'Geschätzter Nettogewinn',
    calcTotalPayout: 'Voraussichtliche Gesamtauszahlung',
    calcApy: 'Effektive annualisierte Rendite (APY)',
    calcTargetDate: 'Auszahlungsdatum nach Ernte',
    calcCta: 'Kapital in diesen Plan anlegen',
    calcInputAmountTier: 'Zugeordneter Anlageplan',
    calcAmountOutsideRange: 'Betrag außerhalb der Bandbreite (£500 – £1.000.000)',
    calcQuickPresets: 'Schnellwahl-Beträge',
    calcDailyEarningsEst: 'Geschätzter täglicher Zuwachs',
    calcContractProtection: '100% Vertraglich gesichert durch Supermarkt-Abnahme',
    calcActiveTier: 'Aktiver Plan',
    calcTopTier: 'Spitzenplan',
    calcValidRangeLabel: 'Gültige Bandbreite',
    calcEnterAmount: 'Investitionsbetrag eingeben',
    calcForecastReturns: 'Prognostizierte Ernte-Erträge',
    calcNoPotentialRoi: 'Keine Rendite-Berechnung',
    calcCycleLengthLabel: 'Zyklusdauer',
    calcFixedPayoutLabel: 'Feste vertragliche Auszahlung',
    calcPrincipalCapital: 'Investiertes Eigenkapital',
    calcNetProfitLabel: 'Vertraglicher Nettogewinn',
    calcAnnualizedRate: 'Annualisierte Rendite (APR)',
    calcTotalPayoutLabel: 'Gesamtauszahlung',
    calcCapPlusProfit: 'Kapitalrückzahlung + Gewinn',
    calcPaymentDropDate: 'Auszahlungsdatum',
    calcCompletionNotice: 'Nach Zyklusabschluss werden Ihr gesamtes Kapital und der Gewinn automatisch Ihrem Guthaben gutgeschrieben.',
    calcLockAllocation: 'Kapital anlegen in',
    calcMinAllocationIs: 'Mindestanlage beträgt',
    calcMaxAllocationIs: 'Höchstanlage beträgt',
    calcInvalidMinDesc: 'Ungültiger Betrag: Die Mindesteinlage beträgt £500. Beträge darunter qualifizieren sich nicht für Agrarzyklen.',
    calcInvalidMaxDesc: 'Ungültiger Betrag: Die Einlage übersteigt die Plattform-Obergrenze von £1.000.000.',
    calcContactDesk: 'Bitte kontaktieren Sie unser institutionelles OTC-Desk für größere Volumina.',
    calcStarterMinPreset: 'Starter Min',
    calcGrowthTierPreset: 'Wachstums-Plan',
    calcCommercialTierPreset: 'Gewerbe-Plan',
    calcEnterprisePreset: 'Enterprise',
    calcMaxSovereignPreset: 'Max Institutionell',

    // Referral Program
    refTitle: 'Europäisches Partnerprogramm & Meilenstein-Prämien',
    refSubtitle: 'Gemeinschafts-Bonus',
    refDesc: 'Verdienen Sie bis zu £245.050 an kumulierten Empfehlungsprämien. Teilen Sie Ihren Partner-Link und profitieren Sie von jedem qualifizierten Zyklus.',
    refCopyLink: 'Partner-Link kopieren',
    refCopied: 'In Zwischenablage kopiert!',
    refJoinProgram: 'Partnerprogramm beitreten',
    refDashboardCta: 'Partner-Dashboard öffnen',
    refYourLink: 'Ihr persönlicher Einladungslink',
    refEarnMilestones: 'Meilenstein-Boni freischalten',
    refMaxReward: 'Bis zu £245.050 Maximalprämie',
    refCumulativeBadge: 'Kumulatives Meilenstein-Partnerprogramm',
    refHeroHeadline: 'Partner empfehlen & bis zu',
    refHeroInACycle: 'pro Zyklus verdienen',
    refNoNeedInvestNotice: 'Sie müssen nicht selbst investiert haben, um Prämien zu erhalten! Jeder kann sich registrieren, einen Einladungslink erstellen und Volumen aufbauen.',
    refBasicReferrer: 'Basis-Partner',
    refInvestorReferrer: 'Investoren-Partner',
    refBasicDesc: 'Für Partner, die noch keine eigene Investition auf BirdGrow getätigt haben.',
    refInvestorDesc: 'Für aktive Investoren auf BirdGrow – schaltet doppelte (2X) Meilenstein-Auszahlungen frei!',
    refInstantReg: 'Sofortige Registrierung: Einladungslink ohne Mindesteinzahlung direkt erstellen.',
    refNamedMilestones: 'Gestaffelte Meilensteine vom Seedling Pioneer bis zum Diamond Crown Principal.',
    refPotentialMax: 'Maximal möglicher Bonus pro Zyklus',
    refAutoRenewal: 'Automatische Verlängerung: Sobald das Zyklusziel erreicht ist, startet ein neuer Balken!',
    refDoubleRewards: 'Doppelte Meilenstein-Boni auf allen Stufen.',
    refPriorityPayouts: 'Prioritäre Gutschrift direkt auf Ihr Hauptguthaben.',
    refSingleMilestoneRange: 'Prämienbandbreite einzelner Meilensteine',
    refCodeLabel: 'Code',
    refShareDirectly: 'Direkt mit Kontakten teilen',
    refClaim: 'Einfordern',
    refClaimed: 'Eingefordert',
    refLocked: 'Gesperrt',
    refActiveMembers: 'Aktive Mitglieder',
    refTotalVolume: 'Gesamtvolumen',
    refEarnedRewards: 'Verdiente Boni',
    refAvailable: 'Verfügbar',
    refTickerLive: 'Live-Empfehlungsauszahlungen',

    // Testimonials & Reviews
    revTitle: 'Reale Rendite. Bestätigt auf 6 Kontinenten.',
    revSubtitle: 'Globales Investoren-Netzwerk',
    revDesc: 'Family Offices, Vermögensverwalter und Privatinvestoren von Tokio bis München vermehren ihr Vermögen mit BirdGrow. Lesen Sie verifizierte Erfahrungsberichte in Echtzeit.',
    revDropReview: 'Bewertung abgeben',
    revVerifiedInvestor: 'Verifizierter Ernte-Investor',
    revRoiAchieved: 'Erzielte Nettorendite',
    revNetworkBadge: 'Weltweites Investorennetzwerk',
    revGliding: 'Gleitend',
    revPaused: 'Pausiert',
    revScrollLeft: 'Nach links scrollen',
    revScrollRight: 'Nach rechts scrollen',
    revAllocatorsTitle: 'Internationale Investoren',

    // Footer
    footerAbout: 'Nachhaltige europäische Geflügelzucht-Plattform, die privates und institutionelles Kapital mit transparenten, biosicheren Produktionszyklen verbindet.',
    footerSolutions: 'Anlagelösungen',
    footerTransparency: 'Agrarinfrastruktur',
    footerLegal: 'Rechtliches & Aufsicht',
    footerAllRightsReserved: 'Alle Rechte vorbehalten. BirdGrow European Agri-Fintech S.A.',
    footerOperatingReg: 'Reguliert nach EU-Crowdfunding-Verordnung (ECSP 2020/1503)',
    footerNonGmoNotice: '100% GVO-freies Futter & verifizierte Solar-Betriebe',
    footerSettlement: 'Abrechnung & Sicherheit',
    footerBtcEth: 'Bitcoin (BTC) & Ethereum (ETH) Abrechnung',
    footerUsdtUsdc: 'Tether (USDT TRC20/ERC20) & USDC Stablecoins',
    footerEscrow: 'Tier-1 Treuhand-Verwahrung',
    footerAmlKyc: 'EU-konforme Geldwäsche- und Identitätsprüfung',
    footerRiskDisclaimer: 'Risikohinweis: Agrarinvestitionen unterliegen biologischen Risiken, Wetter- und Futterpreisschwankungen. Frühere Zyklen garantieren keine zukünftigen Renditen.',
    footerPrivacy: 'Datenschutzrichtlinie',
    footerTerms: 'Anlagebedingungen',
    footerEsg: 'ESG-Offenlegung',

    // Investor Dashboard
    dashWelcome: 'Willkommen zurück,',
    dashOverview: 'Übersicht',
    dashInvestments: 'Meine Verträge',
    dashWalletLedger: 'Guthaben & Ledger',
    dashReferrals: 'Partnerprogramm',
    dashTelemetry: 'Stall-Telemetrie',
    dashActivity: 'Aktivitätsverlauf',
    dashOfficialEmails: 'Offizielle Mitteilungen',
    dashReviews: 'Investoren-Bewertungen',
    dashAvailableBalance: 'VERFÜGBARES GUTHABEN',
    dashLockedCapital: 'AKTIVES INVESTIERTES KAPITAL',
    dashTotalEarnings: 'ANGEHÄUFTER NETTOGEWINN',
    dashDepositFunds: 'Kapital einzahlen',
    dashWithdrawFunds: 'Auszahlung anfordern',
    dashAllocateCapital: 'Kapital investieren',
    dashActiveContracts: 'Laufende Produktionszyklen',
    dashCountdownLabel: 'Ernte-Ausschüttung in',
    dashDaysRemaining: 'Verbleibende Tage',
    dashMaturedPayout: 'Ausgereift & Abgerechnet',
    dashTransactionHistory: 'Prüfungs-Ledger & Transaktionen',
    dashExportCsv: 'CSV-Export herunterladen',
    dashStatusPending: 'In Prüfung',
    dashStatusSuccessful: 'Erfolgreich abgerechnet',
    dashStatusFailed: 'Abgelehnt / Storniert',
    dashStatusPartial: 'Teilauszahlung erfolgt',
    dashCountdown: 'Abrechnungs-Countdown',
    dashAutoCredit: 'Automatische Gutschrift um 00:00 Uhr',
    dashComplete: 'Laufzeit abgeschlossen',
    dashDays: 'TAGE',
    dashHours: 'STUNDEN',
    dashMins: 'MIN',
    dashSecs: 'SEK',

    // Modals & General
    depositCryptoTitle: 'Einzahlung via Kryptowährung',
    withdrawTitle: 'Guthaben & Kapital auszahlen',
    investTitle: 'Kapital in Produktionsplan anlegen',
    authTitle: 'Investoren-Login & Registrierung',
    copyAddress: 'Adresse kopieren',
    copied: 'Kopiert!',
    closeModal: 'Schließen',
    confirmAction: 'Bestätigen & Fortfahren',
    cancelAction: 'Abbrechen',
    amountLabel: 'Betrag',
    networkLabel: 'Blockchain-Netzwerk',
    walletAddressLabel: 'Empfänger-Wallet-Adresse',
    destinationAccount: 'Zielkonto',
    submitWithdrawal: 'Auszahlungsantrag einreichen',
    submitDeposit: 'Zahlung an Admin melden',
    submitInvestment: 'Kapitalzuteilung bestätigen',

    // Auth Modal
    authSignIn: 'Anmelden',
    authCreateAccount: 'Konto erstellen',
    authAdminKey: 'Admin-Schlüssel',
    authEmail: 'E-Mail-Adresse',
    authPassword: 'Passwort',
    authConfirmPassword: 'Passwort bestätigen',
    authFullName: 'Vollständiger Name',
    authCountry: 'Land / Wohnsitz',
    authReferralCode: 'Empfehlungscode (Optional)',
    authRequiredFields: 'Bitte füllen Sie alle Pflichtfelder aus',
    authPassMin: 'Das Passwort muss mindestens 6 Zeichen lang sein',
    authPassMismatch: 'Die Passwörter stimmen nicht überein',
    authInvalidLogin: 'Ungültige Zugangsdaten. Bitte überprüfen Sie Ihre Eingaben.',
    authAccessDenied: 'Zugriff verweigert: Ungültige Admin-Zugangsdaten.',

    // Deposit Modal
    depositTitle: 'Krypto-Kapital einzahlen',
    depositSub: 'Laden Sie Ihr Guthaben sicher per Blockchain-Überweisung auf',
    depositApprox: 'Ungefährer Krypto-Gegenwert',
    depositMinNotice: 'Mindesteinzahlung beträgt',
    depositTxHash: 'Transaktions-Hash / Referenz (Optional)',
    depositConfirm: 'Zahlung an Admin melden',
    depositProcessing: 'Einzahlung wird übermittelt...',

    // Withdrawal Modal
    withdrawSub: 'Fordern Sie Kapital und Ernte-Gewinne auf Ihre private Wallet an',
    withdrawKycNotice: 'Gemäß EU-Geldwäscherichtlinien ist vor Auszahlungen eine Identitätsprüfung (KYC) erforderlich.',
    withdrawInsufficient: 'Der gewünschte Betrag übersteigt Ihr verfügbares Guthaben.',
    withdrawConfirm: 'Auszahlungsantrag bestätigen',
    withdrawProcessing: 'Wird übermittelt...',

    // Invest Modal
    investSub: 'Sichern Sie sich Ihren vertraglichen Anteil an einem aktiven EU-Geflügelzyklus',
    investInsufficient: 'Unzureichendes Guthaben',
    investDepositFirst: 'Zuerst Guthaben einzahlen',
    investConfirm: 'Kapitalzuteilung bestätigen',
    investProcessing: 'Kapital wird zugewiesen...',

    // KYC Modal
    kycTitle: 'Europäische KYC-Identitätsprüfung',
    kycSub: 'Erfüllt die EU-Vorgaben nach ECSP 2020/1503 für unbegrenzte Kapitalauszahlungen',
    kycLegalName: 'Vollständiger amtlicher Name',
    kycAddress: 'Wohnanschrift',
    kycCity: 'Stadt',
    kycCountry: 'Wohnsitzland',
    kycPhone: 'Telefonnummer',
    kycSubmit: 'Prüfungsunterlagen einreichen',
    kycVerified: 'KYC-Status: Verifiziert',
    kycPending: 'KYC-Status: In Prüfung',

    // Review Modal
    reviewTitle: 'Erfahrungsbericht einreichen',
    reviewSub: 'Teilen Sie Ihre Erfahrungen mit realen Agrar-Renditen auf BirdGrow',
    reviewQuote: 'Ihr Erfahrungsbericht',
    reviewSubmit: 'Bewertung absenden',

    // 2-Step Review Eligibility Flow
    reviewEligibilityTitle: 'Qualifikation für Investorenbewertung',
    step1BannerTitle: 'Schritt 1 von 2: Kapital Investieren',
    step1BannerDesc: 'Tätigen Sie Ihre erste Kapitalallokation, um Ihre Investitionsreise zu beginnen.',
    step1ActionBtn: 'Jetzt Investieren',
    step2BannerTitle: 'Schritt 2 von 2: Auszahlung Abschließen',
    step2BannerDesc: 'Sie haben Ihre erste Kapitalallokation vorgenommen! Sobald Sie Ihre erste Gewinnauszahlung beantragen und erhalten, können Sie eine öffentliche Bewertung abgeben.',
    step2ActionBtn: 'Auszahlung Beantragen',
    eligibleBannerTitle: 'Sie sind berechtigt, eine Bewertung abzugeben!',
    eligibleBannerDesc: 'Sie sind berechtigt, eine Bewertung abzugeben! Ihre verifizierten Erfahrungen unterstützen globale Investoren.',
    eligibleActionBtn: 'Bewertung Verfassen',

    // Standard Dashboard Cards & Elements
    availableBalance: 'VERFÜGBARES GUTHABEN',
    availableBalanceSubtitle: 'Liquides Kapital bereit zur Anlage oder Auszahlung',
    activeCapitalDeployed: 'AKTIVES INVESTIERTES KAPITAL',
    activeCapitalSubtitle: 'Vertraglich gesichert in aktiven Geflügelzyklen',
    totalNetProfitAccrued: 'ANGEHÄUFTER NETTOGEWINN',
    totalNetProfitSubtitle: 'Kumulierte geprüfte Erträge für Ihr Portfolio',
    portfolioOverview: 'Portfolio-Übersicht',
    portfolioOverviewDesc: 'Echtzeit-Hauptbuch, Geflügelallokationen und vertragliche Ertragsbildung.',
    quickActions: 'Schnellaktionen',
    activeCycles: 'Aktive Agrarzyklen',
    recentActivity: 'Letzte Finanzoperationen',
    depositFunds: 'Guthaben Einzahlen',
    requestWithdrawal: 'Auszahlung Beantragen',
    allocateCapital: 'Kapital Investieren',
    leaveReviewBtn: 'Bewertung Abgeben',
    viewAll: 'Alle Anzeigen',
    cancel: 'Abbrechen',
    submit: 'Bewertung Einreichen',
    hoverToPause: 'Über eine Karte fahren, um das Gleiten anzuhalten',

    langAll: 'Alle',
    langZh: 'Chinesisch',
    langFr: 'Französisch',
    langEs: 'Spanisch',
    langHi: 'Hindi',
    langEn: 'Englisch',
    platformName: 'BirdGrow',
    tagline: 'Europäische Agrarvermögensverwaltung',

    nav: {
      dashboard: 'Übersicht',
      plans: 'Anlagepläne',
      cycles: 'Aktive Zyklen',
      wallet: 'Geldbörse & Kasse',
      referrals: 'Empfehlungsprogramm',
      chat: 'Investoren-Community',
      admin: 'Verwaltungskonsole',
      logout: 'Abmelden',
      login: 'Anmelden',
    },
    stats: {
      tvl: 'Gesamtwert der Anlagen',
      payouts: 'Ausgezahlte Erträge',
      investors: 'Verifizierte Investoren',
      activeCycles: 'Aktive Bio-Anlagen',
    },
    actions: {
      investNow: 'Kapital anlegen',
      deposit: 'Guthaben einzahlen',
      withdraw: 'Auszahlung anfordern',
      details: 'Details ansehen',
      confirm: 'Bestätigen',
      cancel: 'Abbrechen',
    },
  },
  fr: {
    // Navigation & Header
    navOverview: 'Accueil',
    navHowItWorks: 'Fonctionnement',
    navFacilities: 'Exploitations',
    navPlans: 'Plans d’Investissement',
    navCalculator: 'Calculateur de Rendement',
    navInvestorPortal: 'Espace Investisseur',
    navAdminConsole: 'Console Admin',
    navSignIn: 'Connexion',
    navStartInvesting: 'Commencer à Investir',
    navSignOut: 'Déconnexion',
    navAvailableBalance: 'Solde Disponible',
    navReferrals: 'Parrainage & Gains',
    navInvestorLounge: 'Salon Investisseurs',
    navSelectCurrency: 'Changer de Devise',
    navSelectLanguage: 'Changer de Langue',
    navAdmin: 'Admin',
    navWebsite: 'Site Web',
    navInvestorDesk: 'Portail Investisseur',
    navAdminDesk: 'Bureau Admin',
    navAiSupport: 'Support IA',
    navHumanSupport: 'Support Humain',
    navInstantAssistant: 'Assistant Instantané',
    navOperationsDesk: 'Bureau des Opérations',
    navUpTo: 'Jusqu’à',

    // Hero
    heroKicker: 'Agri-Fintech UE · Investissement Participatif en Actifs Réels · Crypto & Séquestre',
    heroTitle: 'Investissez dans l’aviculture durable à travers l’Europe.',
    heroSubtext: 'Participez à des cycles de production avicole transparents et suivez votre portefeuille de l’éclosion des poussins jusqu’à la distribution commerciale avec des débouchés garantis.',
    heroCtaExplore: 'Découvrir les Plans',
    heroCtaCalc: 'Calculateur de Rendement',
    heroCtaRefer: 'Parrainer & Gagner',
    heroTotalBirdsLabel: 'Total Volailles du Réseau',
    heroMetricBatches: '15 à 60 Jours de Rotation',
    heroMetricBatchesSub: 'Rotation biologique contractuelle',
    heroMetricCapital: '45,2 M £',
    heroMetricCapitalSub: 'En capital total déployé dans nos exploitations',
    heroMetricVelocity: '15–60j',
    heroMetricVelocitySub: 'Liquidité biologique accélérée',
    heroMetricEsg: '96/100',
    heroMetricEsgSub: '96 / 100 Score ESG',
    heroTotalFlock: 'Volailles Vivantes sous Gestion',
    heroForwardContracts: 'Contrats d’Enlèvement Garantis',
    heroSolarPowered: 'Installations Solaires',
    heroNetRoiTarget: '50% à 320% de Rendement Net Cible',
    heroTargetReturn: 'Rendement Cible',
    heroHorizon: 'Durée du Cycle',
    heroStatus: 'Statut',
    heroDays: 'Jours',
    heroPrevFarm: 'Exploitation Précédente',
    heroNextFarm: 'Exploitation Suivante',
    heroPause: 'Mettre en pause',
    heroResume: 'Reprendre le défilement',
    heroActiveLaying: 'Ponte Active',
    heroGrowth: 'Croissance',
    heroFinishing: 'Finition',
    heroChickPlacement: 'Placement Poussins',
    heroCommissioning: 'Mise en service',
    heroWorldwideAllocators: 'Investisseurs Mondiaux',

    // Why Poultry
    whyTitle: 'Pourquoi l’aviculture européenne surpasse les actifs traditionnels.',
    whySubtitle: 'Fondamentaux Stratégiques',
    whyDesc: 'En alliant efficacité métabolique, cycles courts et contrats de reprise fermes, la filière avicole offre des rendements prévisibles adossés à des actifs tangibles.',
    whyPillar1Title: 'Efficacité Alimentaire Inégalée',
    whyPillar1Desc: 'La volaille transforme le grain en protéine avec un indice exceptionnel de 1,45–1,62 (contre 6,0+ pour le bœuf). Cela protège les marges contre les chocs de céréales tout en réduisant l’empreinte carbone de 70%.',
    whyPillar1Label: 'Indice de conversion alimentaire moyen',
    whyPillar2Title: 'Rotation Rapide en 15 à 60 Jours',
    whyPillar2Desc: 'Contrairement aux cycles bovins ou forestiers sur plusieurs années, nos élevages éthiques arrivent à maturité en 15 à 60 jours, libérant un réinvestissement rapide du capital.',
    whyPillar2Label: 'Délai de rotation contractuel',
    whyPillar3Title: 'Demande Européenne Constante & Inélastique',
    whyPillar3Desc: 'La volaille est la protéine animale la plus consommée d’Europe. Chaque lot bénéficie de contrats fermes pré-établis avec la grande distribution et des grossistes bio certifiés.',
    whyPillar3Label: '100% sous contrats de distribution fermes',
    whyPillar4Title: 'Biosécurité & Contrôles Vétérinaires Stricts',
    whyPillar4Desc: 'Toutes les exploitations appliquent la norme Biosécurité Niveau 3 avec monitoring continu de la température, de la ventilation, de l’hygrométrie et de l’eau.',
    whyPillar4Label: 'Taux de mortalité minimal record',

    // How It Works
    howTitle: 'BirdGrow : Adossement Réel aux Dépenses d’Exploitation',
    howSubtitle: 'Architecture Opérationnelle',
    howDesc: 'Loin des produits financiers spéculatifs, votre capital est directement alloué aux dépenses matérielles : élevage des volailles, meuneries et bio-dômes solaires.',
    howStage: 'ÉTAPE',
    howStep1Title: 'Allocation du Capital & Séquestre',
    howStep1Desc: 'Sélectionnez un horizon d’investissement (15 à 60 jours). Vos fonds sont placés sous séquestre européen et immédiatement rattachés à un cycle actif.',
    howStep1Highlight: 'Dès 500 £ de seuil d’entrée · Rotation de 15 à 60 jours',
    howStep2Title: 'Adossement Physique aux Dépenses Agricoles',
    howStep2Desc: 'Chaque euro est directement investi dans les poussins d’un jour, l’alimentation fabriquée à la ferme et la modernisation des bio-dômes solaires.',
    howStep2Highlight: 'Garantie collatérale sur actifs réels & aliments 100% sans OGM',
    howStep3Title: 'Distribution Commerciale & Reversement',
    howStep3Desc: 'À l’issue du cycle, les œufs et volailles sont livrés aux réseaux de distribution partenaires et votre capital plus rendement net sont immédiatement versés.',
    howStep3Highlight: 'Distribution internationale · Règlement automatisé instantané',
    howExpenseTitle: 'Adossement Réel aux Actifs & Ventilation du Capital',
    howExpenseSubtitle: 'Transparence de Bilan',
    howExpenseDesc: 'Découvrez comment chaque euro est alloué entre l’élevage, les moulins d’aliments, les bio-dômes solaires et la logistique sous chaîne du froid.',
    howExpenseTab1: 'Élevage du Cheptel (38%)',
    howExpenseTab2: 'Meunerie & Aliments (32%)',
    howExpenseTab3: 'Bio-Dômes & Solaire (20%)',
    howExpenseTab4: 'Logistique & Opérations (10%)',
    howExpensePillar1: '1. Élevage du Cheptel & Poussins d’un Jour',
    howExpensePillar1Tag: 'Actif Biologique Tangible',
    howExpensePillar1Summary: 'Sélection, couvaison et élevage de volailles biologiques selon les directives de bien-être animal les plus strictes d’Europe.',
    howExpensePillar2: '2. Meunerie & Fabrication d’Aliments',
    howExpensePillar2Tag: 'Optimisation Nutritionnelle',
    howExpensePillar2Summary: 'Moulins sur site en circuit court pour supprimer les marges d’intermédiaires et atteindre un ratio FCR de 1,5:1.',
    howExpensePillar3: '3. Bio-Dômes & Micro-Réseaux Solaires',
    howExpensePillar3Tag: 'Infrastructures & Bâtiments',
    howExpensePillar3Summary: 'Construction et équipement de serres géodésiques et toitures solaires en Allemagne, aux Pays-Bas, en France et en Alaska.',
    howExpensePillar4: '4. Exploitation Courante & Chaîne du Froid',
    howExpensePillar4Tag: 'Logistique & Distribution',
    howExpensePillar4Summary: 'Frais de gestion quotidienne, audits vétérinaires et transport frigorifique direct vers les enseignes de supermarchés.',

    // Facilities
    facTitle: '30+ Pôles de Production Européens Certifiés & Expansion Arctique',
    facSubtitle: 'Pôles Agricoles Européens',
    facDesc: 'Chaque euro investi soutient des fermes certifiées biosécurité niveau 3. Plus de 60% du parc produit des œufs bio de plein air, complété par des volailles de chair haute technologie.',
    facActiveHubsCount: 'Pôles Actifs',
    facTotalCapacityCount: 'Capacité Totale',
    facDailyEggOutputCount: 'Production Quotidienne d’Œufs',
    facRetailOfftake: 'Débouchés Commerciaux',
    facPreSold: '100% Pré-Vendu',
    facFarms: 'Fermes',
    facBirds: 'Oiseaux',
    facDay: 'jour',
    facRetailReadyBadge: 'Prêt pour Rayon Supermarché · Film Plastique Scellé',
    facCleanedDressedBadge: 'Prêt à Cuire · Barquettes Hermétiques',
    facEuStandard: 'Norme Sanitaire UE',
    facShowcaseTitle: 'De l’élevage européen aux barquettes sous film en supermarché',
    facShowcaseDesc: 'Notre filière intégrée relie chaque euro agricole à la grande distribution. Les volailles sont abattues avec soin, parées et scellées sous film étirable transparent pour les rayons frais européens.',
    facShowcasePillar1: 'Enlèvement Garanti par les Supermarchés',
    facShowcasePillar2: 'Traçabilité Totale Ferme-au-Rayon',
    facShowcasePillar3: 'Sécurité Contractuelle des Revenus',
    facAlaskaTitle: 'Bio-Dôme Polaire Alaska Hub',
    facAlaskaSubtitle: 'Avancement de la Construction & des Tests',
    facAlaskaDesc: 'Projet pionnier de bio-dômes géothermiques et solaires à Fairbanks, Alaska, pour alimenter les marchés nordiques en œufs frais et volailles rustiques.',
    facConstructionProgress: 'Progression des Travaux',
    facFilterAll: 'Toutes les Exploitations',
    facFilterBroilers: 'Poulets de Chair',
    facFilterLayers: 'Poules Pondeuses & Œufs',
    facFilterDual: 'Volières Mixtes',
    facFilterAlaska: 'Bio-Dôme Arctique Alaska',
    facSearchPlaceholder: 'Rechercher par nom, pays, race ou type d’œuf...',
    facTotalFarms: 'Pôles Actifs',
    facDailyEggs: 'Production Quotidienne d’Œufs',
    facTotalBirds: 'Total Volailles Vivantes',
    facCertifiedOrganic: '100% Bio UE & Sans OGM',
    facActiveFlock: 'Taille du Cheptel',
    facSolarCapacity: 'Puissance Solaire',
    facEggCapacity: 'Œufs de Table / Jour',
    facViewDetails: 'Voir l’Exploitation',

    // Plans Section
    plansTitle: 'Plans d’Investissement Agricoles Européens.',
    plansSubtitle: 'Allotissements Adossés à des Actifs',
    plansDesc: 'Offres à cycles courts et rendements cibles contractuels garantis par la distribution agroalimentaire européenne.',
    plansMin: 'Entrée Min.',
    plansMax: 'Tranche Max.',
    plansDuration: 'Durée',
    plansInvestNow: 'Allouer le capital',
    plansSelected: 'Sélectionné',
    plansSelect: 'Choisir ce plan',
    plansMostPopular: 'Le Plus Populaire',
    plansSovereign: 'Institutionnel',
    plansContractualRoi: 'Rendement Net Contractuel',
    plansDays: 'Jours',
    plansRating: 'Notation',
    plansHighlights: 'Points Forts',
    plansBreed: 'Race',

    // Yield Calculator
    calcTitle: 'Simulateur de Rendement & Maturation Agricole',
    calcSubtitle: 'Simulation Interactive',
    calcDesc: 'Calculez votre rendement contractuel à travers nos 4 horizons européens de 500 £ jusqu’à 1 000 000 £.',
    calcSelectHorizon: 'Choisir la durée du cycle',
    calcCapitalAmount: 'Montant à allouer',
    calcEstimatedProfit: 'Bénéfice Net Estimé',
    calcTotalPayout: 'Versement Total Prévu',
    calcApy: 'Rendement Annualisé Effectif (APY)',
    calcTargetDate: 'Date estimée de versement',
    calcCta: 'Investir dans ce plan',
    calcInputAmountTier: 'Palier Correspondant au Montant',
    calcAmountOutsideRange: 'Montant hors limites autorisées (500 £ – 1 000 000 £)',
    calcQuickPresets: 'Montants Prédéfinis',
    calcDailyEarningsEst: 'Gains Quotidiens Estimés',
    calcContractProtection: '100% Garanti Contractuellement par Enlèvement Supermarché',
    calcActiveTier: 'Plan Actif',
    calcTopTier: 'Palier Supérieur',
    calcValidRangeLabel: 'Fourchette Autorisée',
    calcEnterAmount: 'Saisir le montant à allouer',
    calcForecastReturns: 'Rendements Prévisionnels de Récolte',
    calcNoPotentialRoi: 'Aucun Rendement Estimé',
    calcCycleLengthLabel: 'Durée du Cycle',
    calcFixedPayoutLabel: 'Versement Contractuel Fixe',
    calcPrincipalCapital: 'Capital Principal',
    calcNetProfitLabel: 'Bénéfice Net Contractuel',
    calcAnnualizedRate: 'Taux Annualisé (APR)',
    calcTotalPayoutLabel: 'Versement Total',
    calcCapPlusProfit: 'Capital Restitué + Bénéfice Net',
    calcPaymentDropDate: 'Date d’Abonnement du Paiement',
    calcCompletionNotice: 'À l’échéance du cycle, votre capital et le bénéfice net sont automatiquement crédités sur votre portefeuille.',
    calcLockAllocation: 'Valider l’allocation dans',
    calcMinAllocationIs: 'L’allocation minimale est de',
    calcMaxAllocationIs: 'L’allocation maximale est de',
    calcInvalidMinDesc: 'Montant Invalide : L’allocation minimale est de 500 £. Les montants inférieurs ne sont pas éligibles aux cycles agricoles.',
    calcInvalidMaxDesc: 'Montant Invalide : L’allocation dépasse le plafond de 1 000 000 £.',
    calcContactDesk: 'Veuillez contacter notre desk institutionnel pour des volumes plus élevés.',
    calcStarterMinPreset: 'Min Découverte',
    calcGrowthTierPreset: 'Palier Croissance',
    calcCommercialTierPreset: 'Palier Commercial',
    calcEnterprisePreset: 'Entreprise',
    calcMaxSovereignPreset: 'Plafond Institutionnel',

    // Referral Program
    refTitle: 'Programme de Parrainage & Paliers de Primes',
    refSubtitle: 'Récompenses sur Volume Communautaire',
    refDesc: 'Gagnez jusqu’à 245 050 £ en primes de parrainage cumulatives. Partagez votre lien exclusif et touchez des commissions sur chaque cycle validé.',
    refCopyLink: 'Copier mon lien de parrainage',
    refCopied: 'Copié dans le presse-papier !',
    refJoinProgram: 'Rejoindre le Programme',
    refDashboardCta: 'Ouvrir l’Espace Parrainage',
    refYourLink: 'Votre Lien d’Invitation Unique',
    refEarnMilestones: 'Débloquer les Primes par Palier',
    refMaxReward: 'Jusqu’à 245 050 £ de Gain Maximum',
    refCumulativeBadge: 'Programme Cumulatif de Parrainage par Paliers',
    refHeroHeadline: 'Parrainez des Partenaires et Gagnez jusqu’à',
    refHeroInACycle: 'par Cycle',
    refNoNeedInvestNotice: 'Vous n’avez pas besoin d’avoir investi pour commencer à parrainer et toucher des primes ! Tout membre peut s’inscrire, générer son lien et cumuler du volume.',
    refBasicReferrer: 'Parrain Standard',
    refInvestorReferrer: 'Parrain Investisseur',
    refBasicDesc: 'Pour les affiliés n’ayant pas encore effectué d’investissement sur BirdGrow.',
    refInvestorDesc: 'Pour les investisseurs actifs — débloque des primes 2X plus élevées à chaque palier !',
    refInstantReg: 'Inscription Immédiate : Générez votre lien sans aucun dépôt initial.',
    refNamedMilestones: 'Paliers Nommés : De Seedling Pioneer jusqu’à Diamond Crown Principal.',
    refPotentialMax: 'Gain Maximum Potentiel par Cycle',
    refAutoRenewal: 'Renouvellement Automatique : Une fois le plafond du cycle atteint, un nouveau cycle de parrainage s’ouvre !',
    refDoubleRewards: 'Boni Doublés (2X) sur l’ensemble des paliers.',
    refPriorityPayouts: 'Reversement prioritaire sur votre solde disponible.',
    refSingleMilestoneRange: 'Montants des Primes par Palier',
    refCodeLabel: 'Code',
    refShareDirectly: 'Partager Directement',
    refClaim: 'Réclamer',
    refClaimed: 'Réclamé',
    refLocked: 'Verrouillé',
    refActiveMembers: 'Membres Actifs',
    refTotalVolume: 'Volume Cumulé',
    refEarnedRewards: 'Primes Gagnées',
    refAvailable: 'Disponible',
    refTickerLive: 'Versements des Primes de Parrainage en Direct',

    // Testimonials & Reviews
    revTitle: 'Rendements Tangibles. Validés sur 6 Continents.',
    revSubtitle: 'Réseau Mondial d’Investisseurs',
    revDesc: 'Family offices, gestionnaires de patrimoine et investisseurs privés de Tokyo à Paris capitalisent sur BirdGrow. Consultez leurs avis certifiés en direct.',
    revDropReview: 'Déposer un Avis',
    revVerifiedInvestor: 'Investisseur Agricole Vérifié',
    revRoiAchieved: 'Rendement Net Confirmé',
    revNetworkBadge: 'Réseau Mondial d’Investisseurs',
    revGliding: 'Défilement',
    revPaused: 'En Pause',
    revScrollLeft: 'Défiler vers la gauche',
    revScrollRight: 'Défiler vers la droite',
    revAllocatorsTitle: 'Investisseurs à Travers le Monde',

    // Footer
    footerAbout: 'Plateforme européenne d’investissement avicole durable connectant capitaux privés et institutionnels à des cycles de production biosécurisés et transparents.',
    footerSolutions: 'Solutions d’Investissement',
    footerTransparency: 'Infrastructures Agricoles',
    footerLegal: 'Gouvernance & Régulation',
    footerAllRightsReserved: 'Tous droits réservés. BirdGrow European Agri-Fintech S.A.',
    footerOperatingReg: 'Régulé selon le règlement européen ECSP 2020/1503',
    footerNonGmoNotice: 'Alimentation 100% sans OGM & fermes autonomes en énergie solaire',
    footerSettlement: 'Règlement & Sécurité',
    footerBtcEth: 'Règlement en Bitcoin (BTC) & Ethereum (ETH)',
    footerUsdtUsdc: 'Stablecoins Tether (USDT TRC20/ERC20) & USDC',
    footerEscrow: 'Séquestre Bancaire Sécurisé de Rang 1',
    footerAmlKyc: 'Vérification de Conformité AML & KYC Européenne',
    footerRiskDisclaimer: 'Avertissement sur les Risques : Investir dans la production agricole comporte des aléas biologiques, climatiques et de cours des céréales. Les cycles passés ne préjugent pas des rendements futurs.',
    footerPrivacy: 'Politique de Confidentialité',
    footerTerms: 'Conditions d’Investissement',
    footerEsg: 'Transparence Taxonomie ESG',

    // Investor Dashboard
    dashWelcome: 'Bienvenue,',
    dashOverview: 'Aperçu',
    dashInvestments: 'Mes Contrats',
    dashWalletLedger: 'Portefeuille & Grand Livre',
    dashReferrals: 'Espace Parrainage',
    dashTelemetry: 'Télémétrie des Fermes',
    dashActivity: 'Historique des Événements',
    dashOfficialEmails: 'Courriers Officiels',
    dashReviews: 'Avis Investisseurs',
    dashAvailableBalance: 'SOLDE DISPONIBLE',
    dashLockedCapital: 'CAPITAL ACTIF DÉPLOYÉ',
    dashTotalEarnings: 'BÉNÉFICE NET TOTAL ACCUMULÉ',
    dashDepositFunds: 'Déposer des Fonds',
    dashWithdrawFunds: 'Demander un Retrait',
    dashAllocateCapital: 'Déployer le Capital',
    dashActiveContracts: 'Cycles de Production Actifs',
    dashCountdownLabel: 'Versement de la Récolte dans',
    dashDaysRemaining: 'Jours Restants',
    dashMaturedPayout: 'Arrivé à Maturité & Réglé',
    dashTransactionHistory: 'Grand Livre & Transactions',
    dashExportCsv: 'Exporter l’Audit CSV',
    dashStatusPending: 'En attente de validation',
    dashStatusSuccessful: 'Règlement effectué',
    dashStatusFailed: 'Refusé / Annulé',
    dashStatusPartial: 'Paiement partiel versé',
    dashCountdown: 'Compte à Rebours du Règlement',
    dashAutoCredit: 'Crédité automatiquement à 00h00',
    dashComplete: 'Cycle de Récolte Terminé',
    dashDays: 'JOURS',
    dashHours: 'HEURES',
    dashMins: 'MIN',
    dashSecs: 'SEC',

    // Modals & General
    depositCryptoTitle: 'Dépôt par Cryptomonnaie',
    withdrawTitle: 'Demande de Retrait de Fonds',
    investTitle: 'Allouer le Capital au Plan de Production',
    authTitle: 'Accès Investisseur & Création de Compte',
    copyAddress: 'Copier l’adresse',
    copied: 'Copié !',
    closeModal: 'Fermer',
    confirmAction: 'Confirmer & Continuer',
    cancelAction: 'Annuler',
    amountLabel: 'Montant',
    networkLabel: 'Réseau Blockchain',
    walletAddressLabel: 'Adresse du Portefeuille Bénéficiaire',
    destinationAccount: 'Compte de Destination',
    submitWithdrawal: 'Confirmer la Demande de Retrait',
    submitDeposit: 'Notifier le Paiement à l’Admin',
    submitInvestment: 'Confirmer l’Allocation de Capital',

    // Auth Modal
    authSignIn: 'Connexion',
    authCreateAccount: 'Créer un Compte',
    authAdminKey: 'Clé Administrateur',
    authEmail: 'Adresse E-mail',
    authPassword: 'Mot de Passe',
    authConfirmPassword: 'Confirmer le Mot de Passe',
    authFullName: 'Nom Légal Complet',
    authCountry: 'Pays de Résidence',
    authReferralCode: 'Code de Parrainage (Optionnel)',
    authRequiredFields: 'Veuillez renseigner tous les champs obligatoires',
    authPassMin: 'Le mot de passe doit contenir au moins 6 caractères',
    authPassMismatch: 'Les mots de passe ne correspondent pas',
    authInvalidLogin: 'Identifiants invalides. Veuillez vérifier vos informations.',
    authAccessDenied: 'Accès Refusé : Identifiants administrateur incorrects.',

    // Deposit Modal
    depositTitle: 'Déposer des Fonds en Crypto',
    depositSub: 'Alimentez votre portefeuille par virement blockchain sécurisé',
    depositApprox: 'Équivalent Crypto Approximatif',
    depositMinNotice: 'Le dépôt minimum est de',
    depositTxHash: 'Hash de Transaction / Réf. (Optionnel)',
    depositConfirm: 'Notifier le Paiement à l’Admin',
    depositProcessing: 'Envoi du dépôt en cours...',

    // Withdrawal Modal
    withdrawSub: 'Transférez votre capital et vos gains vers votre portefeuille personnel',
    withdrawKycNotice: 'Conformément aux directives anti-blanchiment européennes, les retraits requièrent une vérification d’identité (KYC).',
    withdrawInsufficient: 'Le montant demandé dépasse votre solde disponible.',
    withdrawConfirm: 'Confirmer la Demande de Retrait',
    withdrawProcessing: 'Traitement de la demande...',

    // Invest Modal
    investSub: 'Réservez votre part contractuelle d’un cycle avicole européen actif',
    investInsufficient: 'Solde Insuffisant',
    investDepositFirst: 'Déposer des Fonds d’Abord',
    investConfirm: 'Confirmer l’Allocation',
    investProcessing: 'Allocation en cours...',

    // KYC Modal
    kycTitle: 'Vérification d’Identité Réglementaire Européenne',
    kycSub: 'Conformité au règlement européen ECSP 2020/1503 pour des retraits sans limite',
    kycLegalName: 'Nom et Prénom Officiels',
    kycAddress: 'Adresse de Domicile',
    kycCity: 'Ville',
    kycCountry: 'Pays de Résidence',
    kycPhone: 'Numéro de Téléphone',
    kycSubmit: 'Soumettre les Pièces Justificatives',
    kycVerified: 'Statut KYC : Vérifié',
    kycPending: 'Statut KYC : En cours d’examen',

    // Review Modal
    reviewTitle: 'Publier un Avis Vérifié',
    reviewSub: 'Partagez votre expérience d’investissement sur nos cycles avicoles européens',
    reviewQuote: 'Votre Témoignage',
    reviewSubmit: 'Soumettre l’Avis',

    // 2-Step Review Eligibility Flow
    reviewEligibilityTitle: 'Éligibilité à l’Avis Investisseur',
    step1BannerTitle: 'Étape 1 sur 2 : Déployer le Capital',
    step1BannerDesc: 'Faites votre première allocation de capital pour débuter votre parcours d’investissement.',
    step1ActionBtn: 'Déployer Maintenant',
    step2BannerTitle: 'Étape 2 sur 2 : Compléter un Retrait',
    step2BannerDesc: 'Vous venez d’effectuer votre première allocation ! Dès que vous demanderez et recevrez votre premier retrait de bénéfices, vous serez éligible pour laisser un avis public.',
    step2ActionBtn: 'Demander un Retrait',
    eligibleBannerTitle: 'Vous êtes éligible pour laisser un avis !',
    eligibleBannerDesc: 'Vous êtes éligible pour laisser un avis ! Votre expérience vérifiée guide notre réseau mondial.',
    eligibleActionBtn: 'Rédiger un Avis',

    // Standard Dashboard Cards & Elements
    availableBalance: 'SOLDE DISPONIBLE',
    availableBalanceSubtitle: 'Capital liquide prêt à être déployé ou retiré',
    activeCapitalDeployed: 'CAPITAL ACTIF DÉPLOYÉ',
    activeCapitalSubtitle: 'Contractuellement sécurisé dans les cycles actifs',
    totalNetProfitAccrued: 'BÉNÉFICE NET TOTAL ACCUMULÉ',
    totalNetProfitSubtitle: 'Rendement audité cumulé reversé au portefeuille',
    portfolioOverview: 'Aperçu du Portefeuille',
    portfolioOverviewDesc: 'Grand livre en temps réel, allocations avicoles et cumul des rendements.',
    quickActions: 'Actions Rapides',
    activeCycles: 'Cycles Agricoles Actifs',
    recentActivity: 'Opérations Récentes',
    depositFunds: 'Déposer des Fonds',
    requestWithdrawal: 'Demander un Retrait',
    allocateCapital: 'Déployer le Capital',
    leaveReviewBtn: 'Laisser un Avis',
    viewAll: 'Voir Tout',
    cancel: 'Annuler',
    submit: 'Envoyer l’Avis',
    hoverToPause: 'Survolez une carte pour suspendre le défilement',

    langAll: 'Tous',
    langZh: 'Chinois',
    langFr: 'Français',
    langEs: 'Espagnol',
    langHi: 'Hindi',
    langEn: 'Anglais',
    platformName: 'BirdGrow',
    tagline: 'Gestion Institutionnelle d’Actifs Agricoles',

    nav: {
      dashboard: 'Tableau de bord',
      plans: "Plans d'investissement",
      cycles: 'Cycles en direct',
      wallet: 'Portefeuille',
      referrals: 'Parrainage & Récompenses',
      chat: 'Communauté Investisseurs',
      admin: 'Console Opérations',
      logout: 'Déconnexion',
      login: 'Connexion',
    },
    stats: {
      tvl: 'Valeur Totale Allouée',
      payouts: 'Rendements Débloqués',
      investors: 'Investisseurs Vérifiés',
      activeCycles: 'Installations Actives',
    },
    actions: {
      investNow: 'Allouer des fonds',
      deposit: 'Déposer des fonds',
      withdraw: 'Demander un retrait',
      details: 'Voir les détails',
      confirm: 'Confirmer',
      cancel: 'Annuler',
    },
  },

  es: {
    // Navigation & Header
    navOverview: 'Inicio',
    navHowItWorks: 'Cómo Funciona',
    navFacilities: 'Instalaciones',
    navPlans: 'Planes de Inversión',
    navCalculator: 'Calculadora de Rendimiento',
    navInvestorPortal: 'Portal del Inversor',
    navAdminConsole: 'Consola de Admin',
    navSignIn: 'Iniciar Sesión',
    navStartInvesting: 'Comenzar a Invertir',
    navSignOut: 'Cerrar Sesión',
    navAvailableBalance: 'Saldo Disponible',
    navReferrals: 'Invitar y Ganar',
    navInvestorLounge: 'Comunidad de Inversores',
    navSelectCurrency: 'Cambiar Moneda',
    navSelectLanguage: 'Cambiar Idioma',
    navAdmin: 'Admin',
    navWebsite: 'Sitio Web',
    navInvestorDesk: 'Portal del Inversor',
    navAdminDesk: 'Panel Admin',
    navAiSupport: 'Soporte IA',
    navHumanSupport: 'Soporte Humano',
    navInstantAssistant: 'Asistente Instantáneo',
    navOperationsDesk: 'Mesa de Operaciones',
    navUpTo: 'Hasta',

    // Hero
    heroKicker: 'Agri-Fintech de la UE · Inversión en Activos Reales · Cripto & Custodia',
    heroTitle: 'Invierta en avicultura sostenible en toda Europa.',
    heroSubtext: 'Participe en ciclos transparentes de producción avícola europea y supervise su cartera desde la incubación hasta la distribución comercial con contratos de compra garantizados.',
    heroCtaExplore: 'Explorar Planes',
    heroCtaCalc: 'Calculadora de Rentabilidad',
    heroCtaRefer: 'Invitar y Ganar Recompensas',
    heroTotalBirdsLabel: 'Total de Aves en la Red',
    heroMetricBatches: 'Rotación de 15 a 60 Días',
    heroMetricBatchesSub: 'Rotación de ciclo biológico contractual',
    heroMetricCapital: '45,2 M £',
    heroMetricCapitalSub: 'En el capital total desplegado en nuestras granjas',
    heroMetricVelocity: '15–60d',
    heroMetricVelocitySub: 'Rápida liquidez del capital biológico',
    heroMetricEsg: '100% No transgénico',
    heroMetricEsgSub: '100% No transgénico & energía solar',
    heroTotalFlock: 'Aves Vivas Bajo Gestión',
    heroForwardContracts: 'Contratos Mayoristas Cerrados',
    heroSolarPowered: 'Granjas con Energía Solar',
    heroNetRoiTarget: '50% a 320% de Rentabilidad Neta Objetivo',
    heroTargetReturn: 'Rentabilidad Objetivo',
    heroHorizon: 'Plazo',
    heroStatus: 'Estado',
    heroDays: 'Días',
    heroPrevFarm: 'Granja Anterior',
    heroNextFarm: 'Granja Siguiente',
    heroPause: 'Pausar rotación',
    heroResume: 'Reanudar rotación',
    heroActiveLaying: 'Puesta Activa',
    heroGrowth: 'Crecimiento',
    heroFinishing: 'Engorde Final',
    heroChickPlacement: 'Recepción de Polluelos',
    heroCommissioning: 'Puesta en Marcha',
    heroWorldwideAllocators: 'Inversores Globales',

    // Why Poultry
    whyTitle: 'Por qué la avicultura europea supera a los activos tradicionales.',
    whySubtitle: 'Fundamentos Estratégicos',
    whyDesc: 'Al combinar una alta tasa de conversión alimenticia, ciclos rápidos y contratos de compra cerrada, la avicultura sostenible genera rentabilidades predecibles y tangibles.',
    whyPillar1Title: 'Eficiencia de Conversión Alimenticia Inigualable',
    whyPillar1Desc: 'Las aves convierten pienso en proteína con un ratio extraordinario de 1,45–1,62 (frente a más de 6,0 en vacuno). Esto protege los beneficios ante subidas del grano y reduce la huella de carbono un 70%.',
    whyPillar1Label: 'Tasa media de conversión metabólica',
    whyPillar2Title: 'Rotación Acelerada de 15 a 60 Días',
    whyPillar2Desc: 'A diferencia de inversiones ganaderas o forestales a varios años, nuestros ciclos avícolas maduran en 15 a 60 días, permitiendo capitalizar retornos con gran liquidez.',
    whyPillar2Label: 'Plazo contractual de rotación',
    whyPillar3Title: 'Demanda de Consumo Inelástica en Europa',
    whyPillar3Desc: 'El pollo y los huevos son las proteínas más demandadas en Europa. Cada lote se asegura antes del nacimiento con contratos de compra cerrada con cadenas de supermercados.',
    whyPillar3Label: '100% compra mayorista garantizada',
    whyPillar4Title: 'Estrictas Normas de Bioseguridad y Auditorías UE',
    whyPillar4Desc: 'Nuestras granjas aplican Nivel 3 de Bioseguridad con supervisión automatizada de temperatura, aireación, humedad y calidad del agua en tiempo real.',
    whyPillar4Label: 'Tasa mínima de mortalidad del sector',

    // How It Works
    howTitle: 'Cómo Funciona BirdGrow: Respaldo con Gastos Reales de Granja',
    howSubtitle: 'Arquitectura Operativa',
    howDesc: 'A diferencia de productos financieros especulativos, su capital financia directamente activos físicos: crianza de aves, molienda de pienso y construcción de granjas sostenibles.',
    howStage: 'ETAPA',
    howStep1Title: 'Asignación de Capital y Depósito en Custodia',
    howStep1Desc: 'Seleccione un plazo de producción (15 a 60 días). Sus fondos entran en custodia europea y se vinculan de inmediato a un ciclo productivo activo.',
    howStep1Highlight: 'Desde £500 de entrada · Rotación de 15 a 60 días',
    howStep2Title: 'Vinculación Física con Activos de Granja',
    howStep2Desc: 'Su capital no permanece inactivo: financia la adquisición de polluelos, la producción automatizada de pienso y naves bioclimáticas sostenibles.',
    howStep2Highlight: 'Respaldo directo con activos tangibles y piensos 100% libres de OGM',
    howStep3Title: 'Distribución en Supermercados y Liquidación',
    howStep3Desc: 'Al concluir el ciclo, los huevos camperos y aves se distribuyen a cadenas de supermercados y su rentabilidad contractual se abona a su billetera.',
    howStep3Highlight: 'Distribución internacional · Liquidación automatizada instantánea',
    howExpenseTitle: 'Asignación Transparente a Gastos Agrícolas Reales',
    howExpenseSubtitle: 'Balance Abierto y Auditable',
    howExpenseDesc: 'Compruebe cómo cada euro se distribuye con exactitud entre crianza, silos de cereal, naves solares y transporte refrigerado.',
    howExpenseTab1: 'Producción de Aves (38%)',
    howExpenseTab2: 'Molino de Pienso (32%)',
    howExpenseTab3: 'Naves & Solar (20%)',
    howExpenseTab4: 'Logística & Operaciones (10%)',
    howExpensePillar1: '1. Crianza de Aves y Recepción de Polluelos',
    howExpensePillar1Tag: 'Activo Biológico Tangible',
    howExpensePillar1Summary: 'Adquisición, crianza ética y cuidado de estirpes avícolas ecológicas bajo los más exigentes estándares europeos de bienestar animal.',
    howExpensePillar2: '2. Producción y Molienda de Pienso',
    howExpensePillar2Tag: 'Núcleo de Eficiencia Nutricional',
    howExpensePillar2Summary: 'Molienda propia en circuito cerrado y formulación exacta para suprimir márgenes de intermediarios y lograr un índice FCR de 1,5:1.',
    howExpensePillar3: '3. Bio-Domes y Microrredes Solares',
    howExpensePillar3Tag: 'Infraestructura Inmobiliaria',
    howExpensePillar3Summary: 'Construcción y climatización de bio-domes en Alemania, Países Bajos, Francia y el Ártico de Alaska.',
    howExpensePillar4: '4. Operaciones Corrientes y Cadena de Frío',
    howExpensePillar4Tag: 'Distribución Mayorista',
    howExpensePillar4Summary: 'Gastos de mantenimiento diario, certificaciones veterinarias y transporte refrigerado directo a cadenas de supermercados.',

    // Facilities
    facTitle: 'Más de 30 Centros de Producción Europeos Certificados y Expansión Ártica',
    facSubtitle: 'Centros Agrícolas Europeos',
    facDesc: 'Cada euro invertido respalda granjas bioseguras de nivel 3 con energía solar fotovoltaica. Más del 60% de nuestra red produce huevos camperos ecológicos, sumado a centros de engorde de alta tecnología.',
    facActiveHubsCount: 'Centros Activos',
    facTotalCapacityCount: 'Capacidad Total',
    facDailyEggOutputCount: 'Producción Diaria de Huevos',
    facRetailOfftake: 'Venta Mayorista',
    facPreSold: '100% Pre-Vendido',
    facFarms: 'Granjas',
    facBirds: 'Aves',
    facDay: 'día',
    facRetailReadyBadge: 'Listo para Supermercado · Envasado en Film',
    facCleanedDressedBadge: 'Limpio · Despiezado · Bandejas Selladas',
    facEuStandard: 'Norma Sanitaria de la UE',
    facShowcaseTitle: 'De la granja europea certificada a la bandeja sellada en el supermercado',
    facShowcaseDesc: 'Nuestra cadena de suministro integral conecta cada euro invertido con los lineales de los supermercados. Las aves son faenadas higiénicamente y selladas en bandejas con film transparente de grado alimentario.',
    facShowcasePillar1: 'Venta Directa a Cadenas de Supermercados',
    facShowcasePillar2: 'Trazabilidad Integral Granja-a-Bandeja',
    facShowcasePillar3: 'Ingresos Respaldados por Contrato',
    facAlaskaTitle: 'Centro Bio-Dome Polar Alaska Hub',
    facAlaskaSubtitle: 'Avance de Obras y Pruebas Operativas',
    facAlaskaDesc: 'Complejo pionero con tecnología geotérmica y paneles solares en Fairbanks, Alaska, para abastecer mercados nórdicos con huevos camperos frescos.',
    facConstructionProgress: 'Progreso de Construcción',
    facFilterAll: 'Todas las Instalaciones',
    facFilterBroilers: 'Centros de Broilers',
    facFilterLayers: 'Gallinas Ponedoras & Huevos',
    facFilterDual: 'Aviarios de Doble Propósito',
    facFilterAlaska: 'Centro Ártico Alaska',
    facSearchPlaceholder: 'Buscar granjas por nombre, país, raza o tipo de huevo...',
    facTotalFarms: 'Centros Activos',
    facDailyEggs: 'Producción Diaria de Huevos',
    facTotalBirds: 'Total de Aves Vivas',
    facCertifiedOrganic: '100% Ecológico UE y Sin OGM',
    facActiveFlock: 'Tamaño del Lote',
    facSolarCapacity: 'Potencia Solar Instalada',
    facEggCapacity: 'Huevos de Mesa al Día',
    facViewDetails: 'Ver Granja',

    // Plans Section
    plansTitle: 'Planes de Inversión Agrícola Europea.',
    plansSubtitle: 'Cartera Respaldada por Activos',
    plansDesc: 'Planes de alta velocidad biológica asegurados mediante contratos de suministro con supermercados europeos.',
    plansMin: 'Mínimo',
    plansMax: 'Máximo',
    plansDuration: 'Plazo',
    plansInvestNow: 'Asignar Fondos',
    plansSelected: 'Seleccionado',
    plansSelect: 'Elegir Plan',
    plansMostPopular: 'Más Popular',
    plansSovereign: 'Institucional',
    plansContractualRoi: 'Retorno Neto Contractual',
    plansDays: 'Días',
    plansRating: 'Calificación',
    plansHighlights: 'Aspectos Destacados',
    plansBreed: 'Raza',

    // Yield Calculator
    calcTitle: 'Calculadora de Rentabilidad & Maduración Agrícola',
    calcSubtitle: 'Simulación de Rentabilidad',
    calcDesc: 'Proyecte sus beneficios contractuales según el plazo de producción desde £500 hasta £1.000.000.',
    calcSelectHorizon: 'Seleccione el horizonte de producción',
    calcCapitalAmount: 'Capital a invertir',
    calcEstimatedProfit: 'Beneficio Neto Estimado',
    calcTotalPayout: 'Pago Total Estimado',
    calcApy: 'Rendimiento Anualizado Efectivo (APY)',
    calcTargetDate: 'Fecha estimada de liquidación',
    calcCta: 'Asignar capital a este plan',
    calcInputAmountTier: 'Nivel Asignado Según Importe',
    calcAmountOutsideRange: 'Importe fuera del rango permitido (£500 – £1.000.000)',
    calcQuickPresets: 'Importes Predefinidos',
    calcDailyEarningsEst: 'Ganancia Diaria Estimada',
    calcContractProtection: '100% Protegido por Contrato de Compra con Supermercados',
    calcActiveTier: 'Nivel Activo',
    calcTopTier: 'Nivel Superior',
    calcValidRangeLabel: 'Rango Válido',
    calcEnterAmount: 'Ingrese el importe a asignar',
    calcForecastReturns: 'Rendimientos de Cosecha Proyectados',
    calcNoPotentialRoi: 'Sin Cálculo de Rentabilidad',
    calcCycleLengthLabel: 'Duración del Ciclo',
    calcFixedPayoutLabel: 'Liquidación Contractual Fija',
    calcPrincipalCapital: 'Capital Principal',
    calcNetProfitLabel: 'Beneficio Neto Contractual',
    calcAnnualizedRate: 'Tasa Anualizada (APR)',
    calcTotalPayoutLabel: 'Pago Total',
    calcCapPlusProfit: 'Capital Reembolsado + Beneficio',
    calcPaymentDropDate: 'Fecha de Abono del Pago',
    calcCompletionNotice: 'Al concluir el ciclo, su capital completo y el beneficio neto se abonarán automáticamente en su saldo.',
    calcLockAllocation: 'Confirmar asignación en',
    calcMinAllocationIs: 'La inversión mínima es de',
    calcMaxAllocationIs: 'La inversión máxima es de',
    calcInvalidMinDesc: 'Importe no válido: La inversión mínima es de £500. Cantidades menores no califican para ciclos agrícolas.',
    calcInvalidMaxDesc: 'Importe no válido: La inversión excede el límite permitido de £1.000.000.',
    calcContactDesk: 'Póngase en contacto con nuestra mesa institucional para operaciones OTC de gran volumen.',
    calcStarterMinPreset: 'Mínimo Inicial',
    calcGrowthTierPreset: 'Nivel Crecimiento',
    calcCommercialTierPreset: 'Nivel Comercial',
    calcEnterprisePreset: 'Empresarial',
    calcMaxSovereignPreset: 'Máximo Institucional',

    // Referral Program
    refTitle: 'Programa Europeo de Afiliados y Bonos por Hitos',
    refSubtitle: 'Recompensas por Volumen de Comunidad',
    refDesc: 'Gane hasta £245.050 en bonificaciones acumulativas por recomendación. Comparta su enlace exclusivo y obtenga comisiones en cada ciclo.',
    refCopyLink: 'Copiar Enlace de Afiliado',
    refCopied: '¡Copiado al portapapeles!',
    refJoinProgram: 'Unirse al Programa',
    refDashboardCta: 'Abrir Panel de Afiliados',
    refYourLink: 'Su Enlace de Invitación Exclusivo',
    refEarnMilestones: 'Desbloquear Bonos por Niveles',
    refMaxReward: 'Hasta £245.050 Pago Máximo',
    refCumulativeBadge: 'Programa de Afiliados con Bonos por Hitos Acumulativos',
    refHeroHeadline: 'Recomiende Socios y Gane hasta',
    refHeroInACycle: 'en un Ciclo',
    refNoNeedInvestNotice: '¡No necesita haber invertido para comenzar a recomendar y ganar bonos! Cualquier usuario puede registrarse, obtener su enlace exclusivo y acumular volumen.',
    refBasicReferrer: 'Afiliado Básico',
    refInvestorReferrer: 'Afiliado Inversor',
    refBasicDesc: 'Para usuarios que aún no han realizado una inversión en BirdGrow.',
    refInvestorDesc: 'Para inversores activos en BirdGrow: ¡acceso a pagos de bonos 2X mayores en cada hito!',
    refInstantReg: 'Registro Inmediato: Genere su enlace al instante sin necesidad de saldo inicial.',
    refNamedMilestones: 'Hitos Progresivos: Desde Seedling Pioneer hasta Diamond Crown Principal.',
    refPotentialMax: 'Pago Máximo Potencial por Ciclo',
    refAutoRenewal: 'Renovación Automática: ¡Al alcanzar el objetivo del ciclo, se inicia una nueva barra de hitos!',
    refDoubleRewards: 'Bonos Duplicados (2X) en todos los niveles.',
    refPriorityPayouts: 'Liquidación prioritaria directamente en su saldo disponible.',
    refSingleMilestoneRange: 'Rango de Bonos por Hito Individual',
    refCodeLabel: 'Código',
    refShareDirectly: 'Compartir Directamente',
    refClaim: 'Reclamar',
    refClaimed: 'Reclamado',
    refLocked: 'Bloqueado',
    refActiveMembers: 'Miembros Activos',
    refTotalVolume: 'Volumen Acumulado',
    refEarnedRewards: 'Bonos Ganados',
    refAvailable: 'Disponible',
    refTickerLive: 'Pagos de Bonos de Afiliados en Tiempo Real',

    // Testimonials & Reviews
    revTitle: 'Rentabilidad Real. Verificada en 6 Continentes.',
    revSubtitle: 'Red Global de Inversores',
    revDesc: 'Family offices, gestores de patrimonio e inversores particulares de Tokio a Madrid rentabilizan su capital en BirdGrow. Vea sus reseñas en tiempo real.',
    revDropReview: 'Publicar una Reseña',
    revVerifiedInvestor: 'Inversor Agrícola Verificado',
    revRoiAchieved: 'Rentabilidad Neta Obtenida',
    revNetworkBadge: 'Red Global de Inversores',
    revGliding: 'Desplazamiento',
    revPaused: 'En Pausa',
    revScrollLeft: 'Desplazar a la izquierda',
    revScrollRight: 'Desplazar a la derecha',
    revAllocatorsTitle: 'Inversores en Todo el Mundo',

    // Footer
    footerAbout: 'Plataforma europea de inversión avícola sostenible que conecta capital privado e institucional con ciclos de producción bioseguros y trazables.',
    footerSolutions: 'Soluciones de Inversión',
    footerTransparency: 'Infraestructura Agrícola',
    footerLegal: 'Regulación & Cumplimiento',
    footerAllRightsReserved: 'Todos los derechos reservados. BirdGrow European Agri-Fintech S.A.',
    footerOperatingReg: 'Regulado bajo normativa europea de crowdfunding (ECSP 2020/1503)',
    footerNonGmoNotice: 'Piensos 100% libres de transgénicos y granjas con energía solar',
    footerSettlement: 'Liquidación & Seguridad',
    footerBtcEth: 'Liquidación en Bitcoin (BTC) y Ethereum (ETH)',
    footerUsdtUsdc: 'Stablecoins Tether (USDT TRC20/ERC20) y USDC',
    footerEscrow: 'Custodia en Fideicomiso de Nivel 1',
    footerAmlKyc: 'Cumplimiento Normativo Europeo AML y KYC',
    footerRiskDisclaimer: 'Aviso sobre Riesgos: La inversión en contratos de producción agrícola conlleva riesgos biológicos, meteorológicos y de fluctuación en los precios de los piensos. Los resultados de ciclos pasados no garantizan rentabilidades futuras.',
    footerPrivacy: 'Política de Privacidad',
    footerTerms: 'Términos de Inversión',
    footerEsg: 'Desglose de Taxonomía ESG',

    // Investor Dashboard
    dashWelcome: 'Bienvenido/a,',
    dashOverview: 'Visión General',
    dashInvestments: 'Mis Contratos',
    dashWalletLedger: 'Billetera & Libro Mayor',
    dashReferrals: 'Portal de Afiliados',
    dashTelemetry: 'Telemetría de Granjas',
    dashActivity: 'Historial de Eventos',
    dashOfficialEmails: 'Comunicaciones Oficiales',
    dashReviews: 'Reseñas de Inversores',
    dashAvailableBalance: 'SALDO DISPONIBLE',
    dashLockedCapital: 'CAPITAL ACTIVO ASIGNADO',
    dashTotalEarnings: 'BENEFICIO NETO TOTAL ACUMULADO',
    dashDepositFunds: 'Depositar Fondos',
    dashWithdrawFunds: 'Solicitar Retiro',
    dashAllocateCapital: 'Nueva Inversión',
    dashActiveContracts: 'Ciclos de Producción Activos',
    dashCountdownLabel: 'Liquidación de Cosecha en',
    dashDaysRemaining: 'Días Restantes',
    dashMaturedPayout: 'Madurado & Liquidado',
    dashTransactionHistory: 'Libro Mayor de Auditoría y Transacciones',
    dashExportCsv: 'Descargar Auditoría CSV',
    dashStatusPending: 'Pendiente de Verificación',
    dashStatusSuccessful: 'Liquidado y Aprobado',
    dashStatusFailed: 'Rechazado / Cancelado',
    dashStatusPartial: 'Desembolso Parcial Efectuado',
    dashCountdown: 'Cuenta Atrás de Liquidación',
    dashAutoCredit: 'Abonado automáticamente a las 00:00 h',
    dashComplete: 'Ciclo de Cosecha Completado',
    dashDays: 'DÍAS',
    dashHours: 'HORAS',
    dashMins: 'MIN',
    dashSecs: 'SEG',

    // Modals & General
    depositCryptoTitle: 'Depósito con Criptomoneda',
    withdrawTitle: 'Solicitar Retiro de Fondos',
    investTitle: 'Asignar Capital al Plan de Producción',
    authTitle: 'Acceso de Inversores y Registro',
    copyAddress: 'Copiar dirección',
    copied: '¡Copiado!',
    closeModal: 'Cerrar',
    confirmAction: 'Confirmar y Continuar',
    cancelAction: 'Cancelar',
    amountLabel: 'Importe',
    networkLabel: 'Red Blockchain',
    walletAddressLabel: 'Dirección de Billetera de Destino',
    destinationAccount: 'Cuenta de Destino',
    submitWithdrawal: 'Confirmar Solicitud de Retiro',
    submitDeposit: 'Notificar Pago al Administrador',
    submitInvestment: 'Confirmar Asignación de Capital',

    // Auth Modal
    authSignIn: 'Iniciar Sesión',
    authCreateAccount: 'Crear Cuenta',
    authAdminKey: 'Clave de Administrador',
    authEmail: 'Correo Electrónico',
    authPassword: 'Contraseña',
    authConfirmPassword: 'Confirmar Contraseña',
    authFullName: 'Nombre Legal Completo',
    authCountry: 'País de Residencia',
    authReferralCode: 'Código de Recomendación (Opcional)',
    authRequiredFields: 'Por favor, complete todos los campos obligatorios',
    authPassMin: 'La contraseña debe contener al menos 6 caracteres',
    authPassMismatch: 'Las contraseñas no coinciden',
    authInvalidLogin: 'Credenciales no válidas. Por favor verifique sus datos.',
    authAccessDenied: 'Acceso Denegado: Credenciales de administrador no válidas.',

    // Deposit Modal
    depositTitle: 'Depositar Fondos en Criptomoneda',
    depositSub: 'Abastezca su billetera de forma segura mediante transferencia blockchain',
    depositApprox: 'Equivalente Aproximado en Cripto',
    depositMinNotice: 'El depósito mínimo es de',
    depositTxHash: 'Hash de Transacción / Ref. (Opcional)',
    depositConfirm: 'Notificar Pago al Administrador',
    depositProcessing: 'Enviando comprobante...',

    // Withdrawal Modal
    withdrawSub: 'Solicite la transferencia de su capital y beneficios a su billetera personal',
    withdrawKycNotice: 'De acuerdo con las normativas antiblanqueo europeas, los retiros requieren verificación de identidad (KYC).',
    withdrawInsufficient: 'El importe solicitado supera su saldo disponible.',
    withdrawConfirm: 'Confirmar Solicitud de Retiro',
    withdrawProcessing: 'Procesando solicitud...',

    // Invest Modal
    investSub: 'Asegure su participación contractual en un ciclo avícola europeo activo',
    investInsufficient: 'Saldo Insuficiente en Billetera',
    investDepositFirst: 'Depositar Fondos Primero',
    investConfirm: 'Confirmar Asignación de Capital',
    investProcessing: 'Asignando capital...',

    // KYC Modal
    kycTitle: 'Verificación Regulatoria de Identidad KYC',
    kycSub: 'Cumplimiento normativo europeo ECSP 2020/1503 para retiros de fondos sin límite',
    kycLegalName: 'Nombre Completo Oficial',
    kycAddress: 'Dirección de Residencia',
    kycCity: 'Ciudad',
    kycCountry: 'País de Residencia',
    kycPhone: 'Número de Teléfono',
    kycSubmit: 'Enviar Documentos de Identidad',
    kycVerified: 'Estado KYC: Verificado',
    kycPending: 'Estado KYC: En Revisión',

    // Review Modal
    reviewTitle: 'Publicar Reseña de Inversor',
    reviewSub: 'Comparta su experiencia rentabilizando capital en la avicultura europea',
    reviewQuote: 'Su Reseña y Experiencia',
    reviewSubmit: 'Publicar Reseña',

    // 2-Step Review Eligibility Flow
    reviewEligibilityTitle: 'Cualificación para Reseña de Inversor',
    step1BannerTitle: 'Paso 1 de 2: Asignar Capital',
    step1BannerDesc: 'Realice su primera asignación de capital para iniciar su trayectoria de inversión.',
    step1ActionBtn: 'Asignar Capital Ahora',
    step2BannerTitle: 'Paso 2 de 2: Completar un Retiro',
    step2BannerDesc: '¡Acaba de realizar su primera asignación! Una vez que solicite y reciba su primer retiro de ganancias, podrá publicar una reseña.',
    step2ActionBtn: 'Solicitar Retiro',
    eligibleBannerTitle: '¡Es elegible para dejar una reseña!',
    eligibleBannerDesc: '¡Es elegible para dejar una reseña! Su experiencia verificada guía a inversores globales.',
    eligibleActionBtn: 'Escribir Reseña',

    // Standard Dashboard Cards & Elements
    availableBalance: 'SALDO DISPONIBLE',
    availableBalanceSubtitle: 'Capital líquido listo para asignación o retiro',
    activeCapitalDeployed: 'CAPITAL ACTIVO ASIGNADO',
    activeCapitalSubtitle: 'Asegurado contractualmente en ciclos avícolas activos',
    totalNetProfitAccrued: 'BENEFICIO NETO TOTAL ACUMULADO',
    totalNetProfitSubtitle: 'Rendimiento auditado acumulado devuelto a la cartera',
    portfolioOverview: 'Resumen de la Cartera',
    portfolioOverviewDesc: 'Libro mayor en tiempo real, asignaciones avícolas y acumulación de rendimientos.',
    quickActions: 'Acciones Rápidas',
    activeCycles: 'Ciclos Agrícolas Activos',
    recentActivity: 'Operaciones Financieras Recientes',
    depositFunds: 'Depositar Fondos',
    requestWithdrawal: 'Solicitar Retiro',
    allocateCapital: 'Nueva Inversión',
    leaveReviewBtn: 'Publicar una Reseña',
    viewAll: 'Ver Todo',
    cancel: 'Cancelar',
    submit: 'Enviar Reseña',
    hoverToPause: 'Pase el cursor sobre una tarjeta para pausar el deslizamiento',

    langAll: 'Todos',
    langZh: 'Chino',
    langFr: 'Francés',
    langEs: 'Español',
    langHi: 'Hindi',
    langEn: 'Inglés',
    platformName: 'BirdGrow',
    tagline: 'Gestión Institucional de Activos Agrícolas',

    nav: {
      dashboard: 'Panel de Control',
      plans: 'Planes de Inversión',
      cycles: 'Ciclos en Vivo',
      wallet: 'Billetera y Fondos',
      referrals: 'Embajadores y Referidos',
      chat: 'Comunidad Inversores',
      admin: 'Consola de Operaciones',
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión',
    },
    stats: {
      tvl: 'Valor Total Bloqueado',
      payouts: 'Rendimientos Pagados',
      investors: 'Inversores Verificados',
      activeCycles: 'Instalaciones Activas',
    },
    actions: {
      investNow: 'Invertir Ahora',
      deposit: 'Depositar Fondos',
      withdraw: 'Solicitar Retiro',
      details: 'Ver Detalles',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
    },
  },
};