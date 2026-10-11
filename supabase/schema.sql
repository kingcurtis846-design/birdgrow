-- ====================================================================
-- BirdGrow - European Agricultural Fintech & Investment Platform
-- Database Schema & Security Architecture (PostgreSQL / Supabase)
-- ====================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Types & Enums
CREATE TYPE kyc_status_enum AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
CREATE TYPE plan_status_enum AS ENUM ('active', 'archived');
CREATE TYPE investment_status_enum AS ENUM ('pending', 'active', 'matured', 'cancelled');
CREATE TYPE transaction_type_enum AS ENUM ('deposit', 'withdrawal', 'investment', 'payout');
CREATE TYPE transaction_status_enum AS ENUM ('pending', 'successful', 'failed', 'cancelled');
CREATE TYPE payment_gateway_enum AS ENUM ('sepa', 'stripe', 'internal');
CREATE TYPE cycle_stage_enum AS ENUM ('planning', 'chick_placement', 'growth', 'finishing', 'harvest', 'completed');

-- ====================================================================
-- 3. Core Tables
-- ====================================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    country_code VARCHAR(10) DEFAULT 'DE',
    kyc_status kyc_status_enum DEFAULT 'unverified',
    kyc_data JSONB DEFAULT '{}'::jsonb, -- { passport_hash, tax_id, document_url, address, verified_at }
    role user_role_enum DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallets table (atomic balance tracking)
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    main_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (main_balance >= 0),
    earnings_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (earnings_balance >= 0),
    locked_investment_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (locked_investment_balance >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investment Plans table
CREATE TABLE IF NOT EXISTS investment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    min_amount NUMERIC(12, 2) NOT NULL CHECK (min_amount > 0),
    max_amount NUMERIC(12, 2) NOT NULL CHECK (max_amount >= min_amount),
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    roi_percentage NUMERIC(5, 2) NOT NULL CHECK (roi_percentage > 0),
    risk_rating VARCHAR(10) NOT NULL DEFAULT 'A',
    status plan_status_enum DEFAULT 'active',
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poultry Production Cycles table
CREATE TABLE IF NOT EXISTS poultry_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_code VARCHAR(50) UNIQUE NOT NULL,
    facility_location VARCHAR(255) NOT NULL, -- e.g., 'Bavaria, Germany', 'Utrecht, Netherlands'
    total_birds INTEGER NOT NULL CHECK (total_birds > 0),
    current_stage cycle_stage_enum DEFAULT 'planning',
    start_date DATE NOT NULL,
    expected_completion_date DATE NOT NULL,
    certified_organic BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investments table
CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
    plan_id UUID NOT NULL REFERENCES investment_plans(id) ON DELETE RESTRICT,
    principal_amount NUMERIC(15, 2) NOT NULL CHECK (principal_amount > 0),
    expected_roi_amount NUMERIC(15, 2) NOT NULL CHECK (expected_roi_amount >= 0),
    total_payout NUMERIC(15, 2) NOT NULL CHECK (total_payout >= principal_amount),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    maturity_date DATE NOT NULL,
    cycle_id UUID REFERENCES poultry_cycles(id) ON DELETE SET NULL,
    status investment_status_enum DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial Transactions ledger
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    type transaction_type_enum NOT NULL,
    status transaction_status_enum DEFAULT 'pending',
    reference VARCHAR(100) UNIQUE NOT NULL,
    payment_gateway payment_gateway_enum NOT NULL DEFAULT 'sepa',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Farm Telemetry and Weekly Updates
CREATE TABLE IF NOT EXISTS farm_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id UUID NOT NULL REFERENCES poultry_cycles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    week_number INTEGER NOT NULL CHECK (week_number > 0),
    average_weight_kg NUMERIC(6, 3) NOT NULL,
    feed_efficiency NUMERIC(5, 2) NOT NULL, -- FCR (Feed Conversion Ratio)
    mortality_rate NUMERIC(5, 2) NOT NULL, -- percentage
    health_status VARCHAR(100) NOT NULL DEFAULT 'Nominal - Optimal Vitality',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Validated Investor Bank Payout Accounts (SEPA / IBAN)
CREATE TABLE IF NOT EXISTS payout_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    bank_name VARCHAR(255) NOT NULL,
    iban VARCHAR(34) NOT NULL,
    bic_swift VARCHAR(11) NOT NULL,
    account_holder_name VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 4. Indexes for Performance
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
CREATE INDEX IF NOT EXISTS idx_farm_updates_cycle_id ON farm_updates(cycle_id);

-- ====================================================================
-- 5. Row Level Security (RLS) Policies
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE poultry_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_accounts ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users read/update their own, admins read all
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id OR is_admin());

-- Wallets: user views own wallet, admins view all
CREATE POLICY "Users can view own wallet" ON wallets
    FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- Investment Plans: public read for active plans, admins manage
CREATE POLICY "Anyone can view active plans" ON investment_plans
    FOR SELECT USING (status = 'active' OR is_admin());

CREATE POLICY "Admins can manage plans" ON investment_plans
    FOR ALL USING (is_admin());

-- Poultry Cycles & Farm Updates: authenticated investors can view
CREATE POLICY "Users can view cycles" ON poultry_cycles
    FOR SELECT USING (auth.role() = 'authenticated' OR is_admin());

CREATE POLICY "Admins manage cycles" ON poultry_cycles
    FOR ALL USING (is_admin());

CREATE POLICY "Users can view farm updates" ON farm_updates
    FOR SELECT USING (auth.role() = 'authenticated' OR is_admin());

CREATE POLICY "Admins manage farm updates" ON farm_updates
    FOR ALL USING (is_admin());

-- Investments: investors view own, admins view all
CREATE POLICY "Users can view own investments" ON investments
    FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- Transactions: investors view own ledger, admins view all
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- Payout Accounts: investors manage their own
CREATE POLICY "Users can view and manage payout accounts" ON payout_accounts
    FOR ALL USING (auth.uid() = user_id OR is_admin());

-- ====================================================================
-- 6. Atomic RPC Stored Procedures (Funding, Locks, and Payouts)
-- ====================================================================

-- Atomic RPC: Execute Investment (Deducts main balance, locks capital, creates investment & ledger)
CREATE OR REPLACE FUNCTION execute_investment_rpc(
    p_user_id UUID,
    p_plan_id UUID,
    p_amount NUMERIC(15, 2)
)
RETURNS JSONB AS $$
DECLARE
    v_wallet RECORD;
    v_plan RECORD;
    v_cycle RECORD;
    v_roi_amount NUMERIC(15, 2);
    v_total_payout NUMERIC(15, 2);
    v_investment_id UUID;
    v_ref VARCHAR(100);
BEGIN
    -- 1. Check plan validity
    SELECT * INTO v_plan FROM investment_plans WHERE id = p_plan_id AND status = 'active';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Investment plan not found or inactive';
    END IF;

    IF p_amount < v_plan.min_amount OR p_amount > v_plan.max_amount THEN
        RAISE EXCEPTION 'Amount €% is outside allowed range (€% - €%)', p_amount, v_plan.min_amount, v_plan.max_amount;
    END IF;

    -- 2. Lock wallet row for update to guarantee atomicity
    SELECT * INTO v_wallet FROM wallets WHERE user_id = p_user_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
    END IF;

    IF v_wallet.main_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance: available €%, required €%', v_wallet.main_balance, p_amount;
    END IF;

    -- 3. Calculate financial returns
    v_roi_amount := ROUND((p_amount * (v_plan.roi_percentage / 100.0)), 2);
    v_total_payout := p_amount + v_roi_amount;

    -- 4. Find active poultry cycle
    SELECT * INTO v_cycle FROM poultry_cycles 
    WHERE current_stage IN ('chick_placement', 'growth') 
    ORDER BY created_at DESC LIMIT 1;

    -- 5. Deduct main balance and lock investment balance
    UPDATE wallets
    SET main_balance = main_balance - p_amount,
        locked_investment_balance = locked_investment_balance + p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- 6. Insert investment record
    INSERT INTO investments (
        user_id, plan_id, principal_amount, expected_roi_amount, 
        total_payout, start_date, maturity_date, cycle_id, status
    ) VALUES (
        p_user_id, p_plan_id, p_amount, v_roi_amount,
        v_total_payout, CURRENT_DATE, CURRENT_DATE + (v_plan.duration_days || ' days')::INTERVAL, 
        v_cycle.id, 'active'
    ) RETURNING id INTO v_investment_id;

    -- 7. Record transaction ledger
    v_ref := 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 6));
    INSERT INTO transactions (
        user_id, amount, type, status, reference, payment_gateway, metadata
    ) VALUES (
        p_user_id, p_amount, 'investment', 'successful', v_ref, 'internal',
        jsonb_build_object('investment_id', v_investment_id, 'plan_title', v_plan.title)
    );

    RETURN jsonb_build_object(
        'success', true,
        'investment_id', v_investment_id,
        'reference', v_ref,
        'principal_amount', p_amount,
        'expected_roi_amount', v_roi_amount,
        'total_payout', v_total_payout
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic RPC: Mature Investment Payout (Releases locked capital + adds earnings to balance)
CREATE OR REPLACE FUNCTION mature_investment_payout_rpc(
    p_investment_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_inv RECORD;
    v_ref VARCHAR(100);
BEGIN
    SELECT * INTO v_inv FROM investments WHERE id = p_investment_id AND status = 'active' FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Active investment not found';
    END IF;

    -- Release locked balance, credit main balance and earnings balance
    UPDATE wallets
    SET locked_investment_balance = locked_investment_balance - v_inv.principal_amount,
        main_balance = main_balance + v_inv.total_payout,
        earnings_balance = earnings_balance + v_inv.expected_roi_amount,
        updated_at = NOW()
    WHERE user_id = v_inv.user_id;

    -- Update investment status
    UPDATE investments
    SET status = 'matured'
    WHERE id = p_investment_id;

    -- Record transaction
    v_ref := 'PAY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 6));
    INSERT INTO transactions (
        user_id, amount, type, status, reference, payment_gateway, metadata
    ) VALUES (
        v_inv.user_id, v_inv.total_payout, 'payout', 'successful', v_ref, 'internal',
        jsonb_build_object('investment_id', p_investment_id, 'roi_amount', v_inv.expected_roi_amount)
    );

    RETURN jsonb_build_object(
        'success', true,
        'payout_amount', v_inv.total_payout,
        'reference', v_ref
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
