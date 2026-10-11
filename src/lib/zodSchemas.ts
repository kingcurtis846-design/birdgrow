import { z } from 'zod';

export const depositSchema = z.object({
  amount: z
    .number()
    .min(50, 'Minimum deposit is €50.00')
    .max(500000, 'Maximum single deposit is €500,000.00'),
  gateway: z.enum(['sepa', 'stripe']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

export const withdrawalSchema = z.object({
  amount: z
    .number()
    .min(100, 'Minimum withdrawal is €100.00'),
  iban: z
    .string()
    .min(15, 'IBAN must be at least 15 characters')
    .max(34, 'IBAN cannot exceed 34 characters')
    .regex(/^[A-Z]{2}[0-9A-Z]{13,32}$/, 'Please enter a valid European IBAN format (e.g. DE89370400440532013000)'),
  bic: z
    .string()
    .min(8, 'BIC/SWIFT must be 8 or 11 characters')
    .max(11, 'BIC/SWIFT cannot exceed 11 characters')
    .regex(/^[A-Z0-9]{8,11}$/, 'Please enter a valid SWIFT/BIC code'),
  bankName: z.string().min(2, 'Bank name is required'),
  accountHolder: z.string().min(3, 'Account holder legal name is required'),
});

export const kycSchema = z.object({
  legalName: z.string().min(3, 'Full legal name is required'),
  address: z.string().min(6, 'Full residential address including city is required'),
  country: z.string().min(2, 'Country of residence is required'),
});

export const investmentSchema = z.object({
  planId: z.string().min(1, 'Please select a valid investment tier'),
  amount: z.number().min(250, 'Minimum investment amount is €250.00'),
});

export const planFormSchema = z.object({
  title: z.string().min(3, 'Plan title must be at least 3 characters'),
  min_amount: z.number().min(100, 'Minimum entry amount must be at least €100.00'),
  max_amount: z.number().min(500, 'Maximum amount must be higher than minimum'),
  duration_days: z.number().int().min(30, 'Cycle duration must be at least 30 days'),
  roi_percentage: z.number().min(1, 'ROI percentage must be positive').max(40, 'Max realistic cycle ROI is 40%'),
  risk_rating: z.enum(['A+', 'A', 'A-', 'B+']),
  description: z.string().min(10, 'Detailed agricultural description is required'),
  poultry_breed: z.string().min(3, 'Poultry breed is required'),
  features: z.string().min(5, 'Comma-separated features are required'),
});

export const farmUpdateSchema = z.object({
  cycle_id: z.string().min(1, 'Cycle selection is required'),
  title: z.string().min(4, 'Update title is required'),
  description: z.string().min(10, 'Operational description is required'),
  week_number: z.number().int().min(1, 'Week number must be at least 1'),
  average_weight_kg: z.number().min(0.04, 'Weight must be realistic (kg)'),
  feed_efficiency: z.number().min(1.0, 'Feed Conversion Ratio (FCR) must be at least 1.0'),
  mortality_rate: z.number().min(0.0, 'Mortality rate cannot be negative').max(10.0, 'Mortality rate must be below 10%'),
  health_status: z.string().min(3, 'Health status assessment is required'),
});

export const systemSettingsSchema = z.object({
  stripeMode: z.enum(['test', 'live']),
  stripePublicKey: z.string().min(5, 'Stripe publishable key required'),
  stripeSecretKey: z.string().min(5, 'Stripe secret key required'),
  sepaCreditorId: z.string().min(5, 'Creditor ID required'),
  platformFeePercentage: z.number().min(0).max(10),
  minimumWithdrawal: z.number().min(10),
});
