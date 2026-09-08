-- =========================================================
-- O BAZAR DO BRUXO - MIGRAÇÃO INICIAL DO BANCO POSTGRESQL
-- Tabelas Canônicas para E-commerce e Atendimento
-- =========================================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ADMINS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '["all"]'::jsonb,
    is_superadmin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUSTOMERS (Item 9 da especificação)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    document VARCHAR(50),
    address JSONB,
    marketing_consent BOOLEAN DEFAULT FALSE,
    whatsapp_consent BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_purchase_at TIMESTAMP WITH TIME ZONE,
    total_orders INT DEFAULT 0,
    total_spent NUMERIC(10, 2) DEFAULT 0.00
);

-- 3. CATEGORIES & COLLECTIONS
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    banner_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SUPPLIERS (Fornecedores de Dropshipping)
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    dropshipping_enabled BOOLEAN DEFAULT FALSE,
    direct_shipping_enabled BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, UNAVAILABLE, REVIEW
    lead_time_days INT DEFAULT 3,
    shipping_cost_base NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PRODUCTS (Item 10 e 11 da especificação)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    subtitle VARCHAR(255),
    short_description TEXT,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    sale_price NUMERIC(10, 2),
    cost NUMERIC(10, 2) NOT NULL,
    minimum_price NUMERIC(10, 2) NOT NULL,
    product_type VARCHAR(50) DEFAULT 'OWN', -- OWN, DROPSHIPPING, AFFILIATE
    commercial_status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, REVIEW, RESTRICTED
    stock_mode VARCHAR(50) DEFAULT 'INTERNAL', -- INTERNAL, SUPPLIER_SYNC
    stock_status VARCHAR(50) DEFAULT 'IN_STOCK',
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    supplier_sku VARCHAR(100),
    weight NUMERIC(8, 3) DEFAULT 0.00, -- em kg
    width NUMERIC(8, 2) DEFAULT 0.00, -- em cm
    height NUMERIC(8, 2) DEFAULT 0.00,
    length NUMERIC(8, 2) DEFAULT 0.00,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    images JSONB DEFAULT '[]'::jsonb,
    intentions JSONB DEFAULT '[]'::jsonb,
    details JSONB DEFAULT '{}'::jsonb,
    affiliate_url TEXT,
    partner_name VARCHAR(255),
    seo_title VARCHAR(255),
    seo_description TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2),
    stock INT DEFAULT 0,
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supplier_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    supplier_sku VARCHAR(100) NOT NULL,
    cost_price NUMERIC(10, 2) NOT NULL,
    stock_available INT DEFAULT 0,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INT DEFAULT 0,
    reserved_quantity INT DEFAULT 0,
    location VARCHAR(100) DEFAULT 'MAIN_WAREHOUSE',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CARTS & CART ITEMS (Para recuperação de carrinho)
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    subtotal NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, ABANDONED, CONVERTED
    recovery_attempts INT DEFAULT 0,
    last_recovery_at TIMESTAMP WITH TIME ZONE,
    opted_out BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL
);

-- 7. COUPONS, UPSELLS & CROSS-SELLS
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent NUMERIC(5, 2) DEFAULT 0.00,
    discount_value NUMERIC(10, 2) DEFAULT 0.00,
    min_subtotal NUMERIC(10, 2) DEFAULT 0.00,
    max_uses INT,
    used_count INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS upsells (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    origin_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    target_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    discount_percent NUMERIC(5, 2) DEFAULT 0.00,
    special_price NUMERIC(10, 2),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cross_sells (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    origin_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    target_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ORDERS & ORDER ITEMS (Fluxo do item 19)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_snapshot JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_cost NUMERIC(10, 2) DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- PIX, CREDIT_CARD, BOLETO
    payment_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PAID, REJECTED, REFUNDED
    order_status VARCHAR(50) DEFAULT 'NEW', -- NEW, WAITING_PAYMENT, PAID, PROCESSING, WAITING_SUPPLIER, SUPPLIER_CONFIRMED, SHIPPED, DELIVERED, MANUAL_REVIEW, CANCELLED
    has_dropshipping BOOLEAN DEFAULT FALSE,
    applied_coupon VARCHAR(50),
    order_bump_accepted BOOLEAN DEFAULT FALSE,
    post_purchase_upsell_accepted BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price NUMERIC(10, 2) NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    supplier_order_id VARCHAR(100),
    supplier_status VARCHAR(50) DEFAULT 'PENDING'
);

-- 9. PAYMENTS & IDEMPOTÊNCIA (Item 20 e 21 da especificação)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    gateway VARCHAR(50) DEFAULT 'MERCADOPAGO',
    gateway_payment_id VARCHAR(100),
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'BRL',
    status VARCHAR(50) NOT NULL, -- PENDING, APPROVED, REJECTED, REFUNDED
    status_detail VARCHAR(100),
    payment_method VARCHAR(50),
    pix_qr_code TEXT,
    pix_copy_paste TEXT,
    raw_payload JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SHIPMENTS & RASTREAMENTO (Item 26 da especificação)
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    carrier VARCHAR(100) DEFAULT 'CORREIOS',
    tracking_code VARCHAR(100),
    tracking_url TEXT,
    status VARCHAR(50) DEFAULT 'PREPARING', -- PREPARING, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RETURNED
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. ATENDIMENTO WHATSAPP & BOT "O GUARDIÃO" (Itens 27 a 43)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    phone VARCHAR(50) NOT NULL,
    provider VARCHAR(50) DEFAULT 'EVOLUTION_API',
    conversation_mode VARCHAR(50) DEFAULT 'BOT', -- BOT, HUMAN
    current_intent VARCHAR(50),
    state_context JSONB DEFAULT '{}'::jsonb,
    is_silenced BOOLEAN DEFAULT FALSE,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    direction VARCHAR(20) NOT NULL, -- INBOUND, OUTBOUND
    sender_type VARCHAR(20) NOT NULL, -- CUSTOMER, BOT, HUMAN
    content TEXT NOT NULL,
    intent_detected VARCHAR(50),
    external_message_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'SENT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS human_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    reason VARCHAR(100) NOT NULL, -- CLIENT_REQUESTED, FINANCIAL_ISSUE, REFUND, WRONG_ITEM, DAMAGED_ITEM, ADDRESS_ERROR, DELAY, COMPLAINT, UNKNOWN_QUESTION
    priority VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, RESOLVED, CLOSED
    assigned_admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 12. PROGRAMA DE AFILIADOS (GUARDIÕES DO BAZAR)
CREATE TABLE IF NOT EXISTS affiliate_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    affiliate_code VARCHAR(50) UNIQUE NOT NULL,
    commission_percent NUMERIC(5, 2) DEFAULT 15.00,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    total_clicks INT DEFAULT 0,
    total_sales INT DEFAULT 0,
    total_commission NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliate_partners(id) ON DELETE CASCADE,
    ip_address VARCHAR(50),
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS affiliate_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliate_partners(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    order_total NUMERIC(10, 2) NOT NULL,
    commission_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, PAID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. QUIZ & LEADS
CREATE TABLE IF NOT EXISTS quiz_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    answers JSONB NOT NULL,
    winner_archetype VARCHAR(50) NOT NULL,
    suggested_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    converted_to_sale BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    preference VARCHAR(50) DEFAULT 'CRISTAIS',
    source VARCHAR(50) DEFAULT 'NEWSLETTER', -- NEWSLETTER, QUIZ, CHECKOUT
    consent_given BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. AUDITORIA, EVENTOS, AUTOMAÇÃO & NOTIFICAÇÕES (Itens 51, 52, 53)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    event_type VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    target_id VARCHAR(100),
    previous_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS automation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_type VARCHAR(100) NOT NULL,
    payload JSONB,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    last_error TEXT,
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_type VARCHAR(50) NOT NULL, -- CUSTOMER, ADMIN
    recipient_target VARCHAR(255) NOT NULL,
    channel VARCHAR(50) NOT NULL, -- WHATSAPP, EMAIL, SYSTEM
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'QUEUED', -- QUEUED, SENT, FAILED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP WITH TIME ZONE
);

-- 15. SYSTEM SETTINGS & EMERGENCY CONTROLS (Item 44 e 45 da especificação)
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES DE PERFORMANCE E IDEMPOTÊNCIA
CREATE INDEX IF NOT EXISTS idx_payments_idempotency ON payments(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(code);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_conversations_phone ON conversations(phone);
CREATE INDEX IF NOT EXISTS idx_human_tickets_status ON human_tickets(status);
CREATE INDEX IF NOT EXISTS idx_carts_status ON carts(status);

