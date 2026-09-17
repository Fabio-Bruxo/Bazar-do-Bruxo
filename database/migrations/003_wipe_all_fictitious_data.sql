-- ====================================================================
-- O BAZAR DO BRUXO — LIMPEZA E ZERAMENTO TOTAL DE DADOS FICTÍCIOS (003)
-- Zera completamente produtos, pedidos, leads, carrinhos, tickets e repasses.
-- Preserva EXCLUSIVAMENTE a conta oficial de administrador e configurações.
-- ====================================================================

-- 1. Limpeza em cascata de todas as tabelas transacionais e de catálogo
TRUNCATE TABLE 
    financial_ledger,
    supplier_settlements,
    payment_events,
    refunds,
    chargebacks,
    marketplace_fees,
    order_items,
    orders,
    cart_items,
    carts,
    supplier_products,
    product_variants,
    products,
    human_tickets,
    messages,
    conversations,
    affiliate_sales,
    affiliate_clicks,
    affiliate_partners,
    quiz_results,
    quiz_sessions,
    leads,
    audit_logs,
    notifications,
    automation_jobs,
    events
CASCADE;

-- 2. Limpar usuários fictícios, mantendo estritamente a conta do Administrador
DELETE FROM users 
WHERE email NOT IN ('fabinhojr6336@gmail.com');

DELETE FROM customers 
WHERE email NOT IN ('fabinhojr6336@gmail.com');

-- 3. Garantir a existência e privilégios da conta de Administrador Oficial
INSERT INTO users (
    id, email, full_name, phone, role, is_active, created_at, updated_at
) VALUES (
    'u1000000-0000-0000-0000-000000000001',
    'fabinhojr6336@gmail.com',
    'Fabinho (Administrador)',
    '5513998039867',
    'ADMIN',
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET 
    role = 'ADMIN',
    is_active = true,
    phone = '5513998039867',
    updated_at = NOW();

-- 4. Registrar papéis canônicos de segurança para o Administrador
INSERT INTO user_roles (user_id, role)
SELECT id, 'ADMIN' 
FROM users 
WHERE email = 'fabinhojr6336@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 5. Preservar as configurações mestres de operação e atendimento
INSERT INTO system_settings (key, value, description) VALUES
('BOT_ENABLED', 'true'::jsonb, 'Controle mestre do Guardião do Bazar (WhatsApp Bot)'),
('AUTOMATIC_SALES_ENABLED', 'true'::jsonb, 'Permite criação e checkout de pedidos automáticos'),
('DROPSHIPPING_DISPATCH_ENABLED', 'true'::jsonb, 'Permite encaminhamento de pedidos para fornecedores de dropshipping'),
('STORE_NAME', '"O Bazar do Bruxo"'::jsonb, 'Nome oficial da loja'),
('STORE_SLOGAN', '"Tudo para o seu ritual."'::jsonb, 'Slogan oficial'),
('FREE_SHIPPING_THRESHOLD', '199.00'::jsonb, 'Valor mínimo em reais para frete grátis nacional'),
('HUMAN_SUPPORT_WHATSAPP', '"5513998039867"'::jsonb, 'WhatsApp da equipe de suporte humano')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
