# BirdGrow — European Agricultural Fintech & Investment Platform

> **"Sustainable European Poultry Farming. Reliable Capital Growth."**

BirdGrow is a production-grade, full-stack European Agricultural Fintech platform connecting retail and institutional investors directly with asset-backed, bio-secure European poultry production cycles.

---

## 1. Technology Architecture

- **Frontend & UI**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Framer Motion.
- **Financial Visualizations**: Recharts Area & Trajectory analytics with responsive viewports.
- **Data Validation**: Strict Zod schemas enforcing European IBAN formatting, KYC fields, and minimum financial thresholds.
- **Database & RLS**: PostgreSQL (Supabase schema in `/supabase/schema.sql`) with comprehensive Row Level Security policies, indexes, and atomic RPC stored procedures.
- **Payment & Escrow Rails**:
  - **SEPA Credit Transfer**: Virtual escrow IBANs, BIC/SWIFT routing, EPC QR codes, and automated reconciliation.
  - **Stripe API**: Test and Live gateway toggle with 3DS2 support and simulated webhook event handling.
- **Testing & CI/CD**: Vitest unit testing suite, GitHub Actions CI workflow (`/.github/workflows/ci.yml`).

---

## 2. Core Relational Database Schema (`/supabase/schema.sql`)

1. `profiles`: User IDs, legal names, email, country code, KYC verification status, and admin role assignments.
2. `wallets`: Segregated balances (`main_balance`, `earnings_balance`, and `locked_investment_balance`) maintaining ledger integrity.
3. `investment_plans`: Configurable agricultural tiers (Bio-Broiler Starter, Bavarian Free-Range Growth, Normandy Organic Heritage, Continental Agri-Bond).
4. `poultry_cycles`: Physical farm batches (`EU-BAV-2026-04`, `EU-NLD-2026-02`, etc.) with location, breed, total bird counts, and biological stage transitions.
5. `investments`: Capital allocations linking user wallets to production cycles with maturity dates and projected ROI.
6. `transactions`: Immutable audit ledger recording deposits, allocations, withdrawals, and harvest payouts.
7. `farm_updates`: Operational sensor logs (average weights, Feed Conversion Ratio / FCR, mortality rate, veterinary health status).
8. `payout_accounts`: Validated European bank IBANs and BIC/SWIFT records for SEPA withdrawals.

### Atomic Stored Procedures (RPC)
- `execute_investment_rpc`: Atomically locks wallet balance, checks plan limits, assigns the active poultry cycle, and creates both investment and transaction records in a single database transaction.
- `mature_investment_payout_rpc`: Unlocks principal capital, credits profit to wallet earnings, and updates contract status to matured upon successful farm harvest.

---

## 3. European Regulatory & Risk Compliance

- **EU ECSP Regulation 2020/1503**: Full disclosure of agricultural production factors and non-guaranteed statutory capital disclaimers.
- **EU 5th Anti-Money Laundering Directive (AML)**: Mandatory KYC identity verification before outbound SEPA withdrawals are authorized.
- **EU Animal Welfare & Bio-Security**: Partner farms adhere to Category 3 Free-Range and EU Organic standards with 100% non-GMO feed documentation.

---

## 4. User Personas & Instant Sandbox Testing

- **Demo Investor**: `curtis.investor@birdgrow.eu` (Curtis King)
  - Preloaded wallet balance: €9,500.00
  - Verified German IBAN: `DE89 3704 0044 0532 0130 00`
  - Active allocations in Bavarian Free-Range and Utrecht Broiler cycles.
- **Operations Admin**: `admin@birdgrow.net` (Elena Vance)
  - Full management of KYC review queues, transaction approval, cycle progression, telemetry publishing, and webhook simulator.
