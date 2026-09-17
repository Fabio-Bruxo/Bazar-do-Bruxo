-- =========================================================
-- O BAZAR DO BRUXO - MIGRAÇÃO 002
-- Ledger Financeiro, Eventos de Pagamento, Reembolsos,
-- Chargebacks, Liquidações de Fornecedores e Políticas de RLS
-- =========================================================

-- 1. PAPÉIS DE BANCO (CANONICAL ROLES - Seção 5 da Especificação)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'bazar_admin') THEN
        CREATE ROLE bazar_admin;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'bazar_staff') THEN
        CREATE ROLE bazar_staff;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'bazar_supplier') THEN
        CREATE ROLE bazar_supplier;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'bazar_customer') THEN
        CREATE ROLE bazar_customer;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'bazar_affiliate') THEN
        CREATE ROLE bazar_affiliate;
    END IF;
END $$;

-- 2. PAYMENT EVENTS (Histórico bruto auditável de eventos de gateway - Seção 6 e 19)
CREATE TABLE IF NOT EXISTS payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    gateway VARCHAR(50) DEFAULT 'MERCADOPAGO',
    event_type VARCHAR(100) NOT NULL, -- payment.created, payment.updated, etc.
    event_id VARCHAR(150),
    raw_payload JSONB NOT NULL,
    signature_verified BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_events_payment_id ON payment_events(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_event_id ON payment_events(event_id);

-- 3. FINANCIAL LEDGER (Livro-Razão Financeiro Imutável - Seção 37)
CREATE TABLE IF NOT EXISTS financial_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    entry_type VARCHAR(50) NOT NULL,
    -- CUSTOMER_PAYMENT, SUPPLIER_SHARE, MARKETPLACE_REVENUE, PAYMENT_FEE,
    -- SHIPPING_REVENUE, SHIPPING_COST, AFFILIATE_COMMISSION, REFUND, CHARGEBACK, ADJUSTMENT
    direction VARCHAR(10) NOT NULL, -- DEBIT, CREDIT
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'BRL',
    balance_after NUMERIC(10, 2),
    entity_id VARCHAR(100), -- supplier_id, affiliate_id ou marketplace
    reference_code VARCHAR(100),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    reconciled BOOLEAN DEFAULT FALSE,
    reconciled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_financial_ledger_order_id ON financial_ledger(order_id);
CREATE INDEX IF NOT EXISTS idx_financial_ledger_entry_type ON financial_ledger(entry_type);
CREATE INDEX IF NOT EXISTS idx_financial_ledger_created_at ON financial_ledger(created_at);

-- 4. REFUNDS & CHARGEBACKS (Seções 35 e 36)
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    gateway_refund_id VARCHAR(100),
    amount NUMERIC(10, 2) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'COMPLETED', -- PENDING, COMPLETED, FAILED
    requested_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    ledger_entry_id UUID REFERENCES financial_ledger(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chargebacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    gateway_dispute_id VARCHAR(100),
    amount NUMERIC(10, 2) NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, WON, LOST, MANUAL_REVIEW
    documentation_submitted BOOLEAN DEFAULT FALSE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_chargebacks_order_id ON chargebacks(order_id);

-- 5. SUPPLIER SETTLEMENTS & MARKETPLACE FEES (Seção 23 e 26 - Split)
CREATE TABLE IF NOT EXISTS supplier_settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    gross_amount NUMERIC(10, 2) NOT NULL,
    supplier_cost NUMERIC(10, 2) NOT NULL,
    supplier_amount NUMERIC(10, 2) NOT NULL,
    marketplace_amount NUMERIC(10, 2) NOT NULL,
    payment_fee NUMERIC(10, 2) DEFAULT 0.00,
    shipping_amount NUMERIC(10, 2) DEFAULT 0.00,
    net_estimate NUMERIC(10, 2) NOT NULL,
    split_mode VARCHAR(50) DEFAULT 'MERCADOPAGO_SPLIT', -- DIRECT_SPLIT, INTERNAL_TRANSFER
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, TRANSFERRED, RECONCILED, MANUAL_REVIEW
    transferred_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marketplace_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    fee_type VARCHAR(50) NOT NULL, -- GATEWAY_FEE, PLATFORM_COMMISSION, LOGISTICS_FEE
    percentage NUMERIC(5, 2) DEFAULT 0.00,
    fixed_amount NUMERIC(10, 2) DEFAULT 0.00,
    total_fee NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_supplier_settlements_supplier ON supplier_settlements(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_settlements_order ON supplier_settlements(order_id);

-- 6. ATIVAÇÃO DE ROW LEVEL SECURITY (RLS - Seção 5)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE human_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Admin (Superacesso restrito por role no Supabase Auth)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_full_access_users') THEN
        CREATE POLICY admin_full_access_users ON users FOR ALL USING (
            auth.jwt() ->> 'role' = 'admin' OR current_user = 'bazar_admin'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_full_access_orders') THEN
        CREATE POLICY admin_full_access_orders ON orders FOR ALL USING (
            auth.jwt() ->> 'role' = 'admin' OR current_user = 'bazar_admin'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_full_access_ledger') THEN
        CREATE POLICY admin_full_access_ledger ON financial_ledger FOR ALL USING (
            auth.jwt() ->> 'role' = 'admin' OR current_user = 'bazar_admin'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'customers_own_orders') THEN
        CREATE POLICY customers_own_orders ON orders FOR SELECT USING (
            auth.uid() = customer_id OR customer_id IS NULL
        );
    END IF;
END $$;
