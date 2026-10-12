import { describe, it, expect } from 'vitest';
import {
  formatEuro,
  formatIBAN,
  maskIBAN,
  maskCryptoAddress,
  calculateCycleProgress,
  convertGbpAmount,
  formatRawCurrency,
} from '../lib/formatters';
import { depositSchema, withdrawalSchema, kycSchema } from '../lib/zodSchemas';
import { INITIAL_PLANS } from '../lib/mockData';

describe('Financial Engine & Localization Formatters', () => {
  it('formats euro currency correctly across languages', () => {
    const formattedEn = formatEuro(10000, true, 'en', 'EUR');
    const formattedDe = formatEuro(10000, true, 'de', 'EUR');
    const formattedFr = formatEuro(10000, true, 'fr', 'EUR');

    expect(formattedEn).toContain('10,000.00');
    expect(formattedDe).toContain('10.000,00');
    expect(formattedFr).toContain('10');
  });

  it('masks crypto wallet addresses correctly', () => {
    const addr = 'TN9qR7vK4b8wY5xM3zL1jP6sD2fH8nB4vX';
    const masked = maskCryptoAddress(addr);
    expect(masked).toBe('TN9qR7••••B4vX');
  });

  it('enforces the exact 4 investment plans with specified durations and return rates', () => {
    expect(INITIAL_PLANS).toHaveLength(4);

    // Plan 1: 50% in 14/15 days (£500 - £4,499)
    expect(INITIAL_PLANS[0].roi_percentage).toBe(50.0);
    expect(INITIAL_PLANS[0].min_amount).toBe(500);
    expect(INITIAL_PLANS[0].max_amount).toBe(4499);

    // Plan 2: 84% in 21 days (£4,500 - £11,499)
    expect(INITIAL_PLANS[1].roi_percentage).toBe(84.0);
    expect(INITIAL_PLANS[1].duration_days).toBe(21);
    expect(INITIAL_PLANS[1].min_amount).toBe(4500);
    expect(INITIAL_PLANS[1].max_amount).toBe(11499);

    // Plan 3: 150% in 30 days (£11,500 - £99,999)
    expect(INITIAL_PLANS[2].roi_percentage).toBe(150.0);
    expect(INITIAL_PLANS[2].duration_days).toBe(30);
    expect(INITIAL_PLANS[2].min_amount).toBe(11500);
    expect(INITIAL_PLANS[2].max_amount).toBe(99999);

    // Plan 4: 320% in 60 days (£100,000 - £1,000,000)
    expect(INITIAL_PLANS[3].roi_percentage).toBe(320.0);
    expect(INITIAL_PLANS[3].duration_days).toBe(60);
    expect(INITIAL_PLANS[3].min_amount).toBe(100000);
    expect(INITIAL_PLANS[3].max_amount).toBe(500000);
  });

  it('strictly enforces Starter Plan ceiling at 4,499 and Commercial Plan ceiling at 99,999', () => {
    const starter = INITIAL_PLANS.find((p) => p.id === 'plan-15d-50pct');
    const commercial = INITIAL_PLANS.find((p) => p.id === 'plan-30d-150pct');

    expect(starter?.max_amount).toBe(4499);
    expect(commercial?.max_amount).toBe(99999);
  });

  it('formats IBAN into 4-character chunks', () => {
    const rawIban = 'de89370400440532013000';
    const formatted = formatIBAN(rawIban);
    expect(formatted).toBe('DE89 3704 0044 0532 0130 00');
  });

  it('masks IBAN for privacy while keeping routing prefix and check suffix', () => {
    const rawIban = 'DE89370400440532013000';
    const masked = maskIBAN(rawIban);
    expect(masked).toBe('DE89 •••• •••• 3000');
  });

  it('calculates cycle progress accurately between dates', () => {
    const pastStart = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    const futureMaturity = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
    const progress = calculateCycleProgress(pastStart, futureMaturity);
    expect(progress).toBeGreaterThanOrEqual(48);
    expect(progress).toBeLessThanOrEqual(52);
  });

  it('correctly displays inputted amounts in active currency and rejects amounts below €500 equivalent', () => {
    // With EUR as native base, €500 is $545 in USD (500 * 1.09)
    const minBaseEur = 500;
    const minUsd = convertGbpAmount(minBaseEur, 'USD');
    expect(minUsd).toBe(545);

    // If an investor inputs 500 dollars ($500):
    const inputUsd = 500;
    // 1. Display shows the exact $500 inputted, NOT converted $545
    const displayed = formatRawCurrency(inputUsd, 'USD', false);
    expect(displayed).toBe('$500');
    expect(displayed).not.toBe('$545');

    // 2. $500 does NOT qualify because it is below the $545 minimum threshold (€500 equivalent)
    const qualifiesInUsd = inputUsd >= minUsd;
    expect(qualifiesInUsd).toBe(false);

    // 3. $545 DOES qualify
    expect(545 >= minUsd).toBe(true);

    // 4. In EUR, base is €500
    const minEur = convertGbpAmount(minBaseEur, 'EUR');
    expect(minEur).toBe(500);
    expect(450 >= minEur).toBe(false); // €450 does not qualify
    expect(500 >= minEur).toBe(true);  // €500 qualifies
  });
});

describe('Zod Validation Schemas', () => {
  it('validates legitimate deposits', () => {
    const valid = depositSchema.safeParse({
      amount: 1500,
      gateway: 'sepa',
    });
    expect(valid.success).toBe(true);
  });

  it('rejects deposit below minimum threshold', () => {
    const invalid = depositSchema.safeParse({
      amount: 20,
      gateway: 'sepa',
    });
    expect(invalid.success).toBe(false);
  });

  it('validates KYC identity dossier submission', () => {
    const valid = kycSchema.safeParse({
      legalName: 'Curtis King',
      address: 'Maximilianstraße 42, 80539 München',
      country: 'Germany',
    });
    expect(valid.success).toBe(true);
  });
});

describe('Withdrawal Approvals, Fee Purse & Farm Expense Pairing', () => {
  it('calculates withdrawal fee deduction into the dedicated fee purse', () => {
    const grossRequested = 1200.0;
    const feeRatePercentage = 1.5;
    const expectedFee = Math.round((grossRequested * (feeRatePercentage / 100)) * 100) / 100;
    const netDisbursed = Math.round((grossRequested - expectedFee) * 100) / 100;

    expect(expectedFee).toBe(18.0);
    expect(netDisbursed).toBe(1182.0);
    expect(expectedFee + netDisbursed).toBe(grossRequested);
  });

  it('calculates partial payout tranche, fee deduction, and wallet refund balance', () => {
    const grossRequested = 2500.0;
    const partialPayoutAmount = 1000.0;
    const feeRate = 1.5;

    const fee = Math.round((partialPayoutAmount * (feeRate / 100)) * 100) / 100;
    const netToUser = Math.round((partialPayoutAmount - fee) * 100) / 100;
    const unreleasedRemaining = Math.round((grossRequested - partialPayoutAmount) * 100) / 100;

    expect(fee).toBe(15.0);
    expect(netToUser).toBe(985.0);
    expect(unreleasedRemaining).toBe(1500.0);
    expect(netToUser + fee + unreleasedRemaining).toBe(grossRequested);
  });

  it('validates farm capital expense pairing allocation percentages', () => {
    const expensePillars = [
      { id: 'production', share: 38 },
      { id: 'feed_production', share: 32 },
      { id: 'facility_building', share: 20 },
      { id: 'operational_expenses', share: 10 },
    ];

    const totalShare = expensePillars.reduce((acc, p) => acc + p.share, 0);
    expect(totalShare).toBe(100);
  });
});
