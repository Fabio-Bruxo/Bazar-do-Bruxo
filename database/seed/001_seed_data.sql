-- =========================================================
-- O BAZAR DO BRUXO - SEED DATA CANÔNICO (MVP V1)
-- 20 Produtos, Categorias, Fornecedores, Configurações e FAQ
-- =========================================================

-- 1. CONFIGURAÇÕES DO SISTEMA E BOTÕES DE EMERGÊNCIA
INSERT INTO system_settings (key, value, description) VALUES
('BOT_ENABLED', 'true'::jsonb, 'Controle mestre do Guardião do Bazar (WhatsApp Bot)'),
('AUTOMATIC_SALES_ENABLED', 'true'::jsonb, 'Permite criação e checkout de pedidos automáticos'),
('DROPSHIPPING_DISPATCH_ENABLED', 'true'::jsonb, 'Permite encaminhamento de pedidos para fornecedores de dropshipping'),
('STORE_NAME', '"O Bazar do Bruxo"'::jsonb, 'Nome oficial da loja'),
('STORE_SLOGAN', '"Tudo para o seu ritual."'::jsonb, 'Slogan oficial'),
('FREE_SHIPPING_THRESHOLD', '199.00'::jsonb, 'Valor mínimo em reais para frete grátis nacional'),
('HUMAN_SUPPORT_WHATSAPP', '"5513998039867"'::jsonb, 'WhatsApp da equipe de suporte humano')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. CATEGORIAS
INSERT INTO categories (id, name, slug, description, active) VALUES
('c1000000-0000-0000-0000-000000000001', 'Cristais & Pedras', 'cristais', 'Minerais autênticos, drusas brutas e geradores naturais para equilíbrio energético.', true),
('c1000000-0000-0000-0000-000000000002', 'Incensos & Aromas', 'incensos-aromas', 'Resinas nobres, bastões de defumação e aromatizadores para transmutação do ambiente.', true),
('c1000000-0000-0000-0000-000000000003', 'Ervas & Natureza', 'ervas-natureza', 'Flores desidratadas, ervas rituais e banhos de ervas selecionados à mão.', true),
('c1000000-0000-0000-0000-000000000004', 'Rituais & Práticas', 'rituais', 'Ferramentas de altar, punhais simbólicos, sinos e elementos para rituais.', true),
('c1000000-0000-0000-0000-000000000005', 'Bruxaria Ancestral', 'bruxaria', 'Grimórios em couro, caldeirões de ferro fundido e instrumentos tradicionais.', true),
('c1000000-0000-0000-0000-000000000006', 'Energia & Proteção', 'energia', 'Amuletos de obsidiana, turmalinas e talismãs de proteção pessoal e do lar.', true),
('c1000000-0000-0000-0000-000000000007', 'Casa Mística & Altar', 'casa-mistica', 'Toalhas de altar bordadas, porta-velas, incensários e decoração contemplativa.', true),
('c1000000-0000-0000-0000-000000000008', 'Presentes Significativos', 'presentes', 'Opções repletas de carinho e intenção para presentear almas queridas.', true),
('c1000000-0000-0000-0000-000000000009', 'Kits Sagrados', 'kits', 'Combinações harmônicas de cristais, ervas e incensos com preço especial.', true)
ON CONFLICT (slug) DO NOTHING;

-- 3. FORNECEDORES DE DROPSHIPPING E ESTOQUE
INSERT INTO suppliers (id, name, email, phone, whatsapp, dropshipping_enabled, direct_shipping_enabled, status, lead_time_days, shipping_cost_base) VALUES
('s1000000-0000-0000-0000-000000000001', 'Lapidação & Garimpo Serra Gaúcha', 'contato@serragaucha.demo', '5432109876', '54999112233', false, false, 'ACTIVE', 2, 8.50),
('s1000000-0000-0000-0000-000000000002', 'Importadora & Alquimia Sagrada SP', 'dropship@alquimiasagrada.demo', '1133221100', '11988776655', true, true, 'ACTIVE', 3, 14.90),
('s1000000-0000-0000-0000-000000000003', 'Caldeirões & Metais de Minas', 'pedidos@metaisdeminas.demo', '3133998877', '31977665544', true, true, 'ACTIVE', 5, 22.00)
ON CONFLICT DO NOTHING;

-- 4. PRODUTOS (20 PRODUTOS CANÔNICOS DO MVP)
-- Prod 1: Drusa de Ametista Natural
INSERT INTO products (
    id, sku, name, slug, subtitle, short_description, description, price, sale_price, cost, minimum_price,
    product_type, commercial_status, stock_mode, stock_status, supplier_id, supplier_sku, weight, category_id,
    active, featured, images, intentions, is_demo
) VALUES (
    'p1000000-0000-0000-0000-000000000001',
    'CRIS-AME-001',
    'Drusa de Ametista Natural',
    'ametista-drusa-natural',
    'Cristal de serenidade, introspecção e equilíbrio mental',
    'Formação mineral natural de quartzo violeta brasileiro com pontas radiantes.',
    'Uma formação mineral cristalina autêntica de quartzo violeta com pontas naturais que refletem nuances profundas de lilás ao roxo escuro, preservando a matriz rochosa original da terra.',
    89.90, 79.90, 28.00, 55.00,
    'OWN', 'ACTIVE', 'INTERNAL', 'IN_STOCK',
    's1000000-0000-0000-0000-000000000001', 'SG-AME-D01', 0.280,
    'c1000000-0000-0000-0000-000000000001', true, true,
    '["https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    '["calma", "intuicao"]'::jsonb, true
) ON CONFLICT (sku) DO NOTHING;

-- Prod 2: Quartzo Rosa em Rocha Bruta
INSERT INTO products (
    id, sku, name, slug, subtitle, short_description, description, price, sale_price, cost, minimum_price,
    product_type, commercial_status, stock_mode, stock_status, weight, category_id,
    active, featured, images, intentions, is_demo
) VALUES (
    'p1000000-0000-0000-0000-000000000002',
    'CRIS-QRO-002',
    'Quartzo Rosa em Rocha Bruta',
    'quartzo-rosa-bruto',
    'Símbolo ancestral de afeto, acolhimento e paz interior',
    'Fragmento bruto de quartzo rosa em estado natural para autocuidado e paz.',
    'Fragmento bruto de quartzo rosa em estado natural, com textura tátil e tom translúcido suave que varia do rosa leitoso ao pálido delicado.',
    49.90, null, 14.00, 32.00,
    'OWN', 'ACTIVE', 'INTERNAL', 'IN_STOCK', 0.200,
    'c1000000-0000-0000-0000-000000000001', true, true,
    '["https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    '["amor-proprio", "calma"]'::jsonb, true
) ON CONFLICT (sku) DO NOTHING;

-- Prod 3: Quartzo Branco Cristalino Gerador
INSERT INTO products (
    id, sku, name, slug, subtitle, short_description, description, price, sale_price, cost, minimum_price,
    product_type, commercial_status, stock_mode, stock_status, weight, category_id,
    active, featured, images, intentions, is_demo
) VALUES (
    'p1000000-0000-0000-0000-000000000003',
    'CRIS-QBR-003',
    'Quartzo Branco Cristalino Gerador',
    'quartzo-transparente-gerador',
    'Ponta lapidada em seis facetas para clareza e foco mental',
    'Cristal translúcido com terminação geométrica natural para direcionamento de intenção.',
    'Cristal translúcido com terminação geométrica lapidada em seis facetas que convergem para uma ponta central.',
    65.00, null, 19.00, 42.00,
    'OWN', 'ACTIVE', 'INTERNAL', 'IN_STOCK', 0.150,
    'c1000000-0000-0000-0000-000000000001', true, false,
    '["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    '["foco", "clareza"]'::jsonb, true
) ON CONFLICT (sku) DO NOTHING;

-- Prod 4: Turmalina Negra de Proteção
INSERT INTO products (
    id, sku, name, slug, subtitle, short_description, description, price, sale_price, cost, minimum_price,
    product_type, commercial_status, stock_mode, stock_status, weight, category_id,
    active, featured, images, intentions, is_demo
) VALUES (
    'p1000000-0000-0000-0000-000000000004',
    'CRIS-TUR-004',
    'Turmalina Negra de Proteção',
    'turmalina-negra-protecao',
    'Escudo mineral contra energias densas e aterramento do ser',
    'Pedra estriada de alta densidade mineral, guardiã tradicional de entradas e lares.',
    'Pedra estriada de preto profundo, caracterizada por ranhuras longitudinais naturais que atestam sua pureza.',
    52.00, null, 16.00, 35.00,
    'OWN', 'ACTIVE', 'INTERNAL', 'IN_STOCK', 0.190,
    'c1000000-0000-0000-0000-000000000001', true, true,
    '["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    '["protecao", "foco"]'::jsonb, true
) ON CONFLICT (sku) DO NOTHING;

-- Prod 5: Incenso Artesanal de Sálvia Branca & Lavanda
INSERT INTO products (
    id, sku, name, slug, subtitle, short_description, description, price, sale_price, cost, minimum_price,
    product_type, commercial_status, stock_mode, stock_status, weight, category_id,
    active, featured, images, intentions, is_demo
) VALUES (
    'p1000000-0000-0000-0000-000000000005',
    'INC-SAL-005',
    'Incenso Artesanal de Sálvia Branca & Lavanda',
    'incenso-salvia-branca-lavanda',
    'Defumação purificadora e relaxante feita à mão sem pólvora',
    '9 varetas de queima lenta com ervas secas e resinas florestais puras.',
    'Elaborado artesanalmente com folhas de sálvia maceradas e flores de alfazema lavandim, enroladas sobre varetas de bambu reflorestado.',
    32.90, 27.90, 8.50, 20.00,
    'OWN', 'ACTIVE', 'INTERNAL', 'IN_STOCK', 0.080,
    'c1000000-0000-0000-0000-000000000002', true, true,
    '["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    '["purificacao", "calma"]'::jsonb, true
) ON CONFLICT (sku) DO NOTHING;

-- Prod 6: Resina Nobre de Breuzinho Sagrado da Amazônia
INSERT INTO products (
    id, sku, name, slug, subtitle, short_description, description, price, sale_price, cost, minimum_price,
    product_type, commercial_status, stock_mode, stock_status, weight, category_id,
    active, featured, images, intentions, is_demo
) VALUES (
    'p1000000-0000-0000-0000-000000000006',
    'INC-BRE-006',
    'Resina Nobre de Breuzinho Sagrado da Amazônia',
    'resina-breuzinho-sagrado',
    'Aroma amadeirado ancestral colhido de forma sustentável',
    'Pura goma vegetal aromática da árvore Protium heptaphyllum para defumação no carvão.',
    'Goma vegetal seca coletada por comunidades ribeirinhas no coração da floresta amazônica de maneira ética e preservacionista.',
    42.00, null, 12.00, 28.00,
    'OWN', 'ACTIVE', 'INTERNAL', 'IN_STOCK', 0.100,
    'c1000000-0000-0000-0000-000000000002', true, false,
    '["https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    '["purificacao", "intuicao"]'::jsonb, true
) ON CONFLICT (sku) DO NOTHING;

-- Prod 7: Caldeirão Tradicional em Ferro Fundido Tripé 500ml (DROPSHIPPING)
INSERT INTO products (
    id, sku, name, slug, subtitle, short_description, description, price, sale_price, cost, minimum_price,
    product_type, commercial_status, stock_mode, stock_status, supplier_id, supplier_sku, weight, category_id,
    active, featured, images, intentions, is_demo
) VALUES (
    'p1000000-0000-0000-0000-000000000007',
    'RIT-CAL-007',
    'Caldeirão Tradicional em Ferro Fundido Tripé 500ml',
    'caldeirao-ferro-fundido-500ml',
    'Instrumento clássico para queima de resinas, ervas e poções',
    'Fundido artesanalmente em Minas Gerais com três apoios estáveis e alça reforçada.',
    'Peça forjada com liga densa de ferro cinzento, seguindo o desenho secular de caldeirões medievais com base em tripé estável e asa de sustentação.',
    129.90, 115.00, 48.00, 85.00,
    'DROPSHIPPING', 'ACTIVE', 'SUPPLIER_SYNC', 'IN_STOCK',
    's1000000-0000-0000-0000-000000000003', 'MM-CAL-500', 1.650,
    'c1000000-0000-0000-0000-000000000005', true, true,
    '["https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    '["rituais", "transformacao"]'::jsonb, true
) ON CONFLICT (sku) DO NOTHING;

-- Prod 8: Kit Altar Sagrado - Cristais, Incensário e Guia Ritual
INSERT INTO products (
    id, sku, name, slug, subtitle, short_description, description, price, sale_price, cost, minimum_price,
    product_type, commercial_status, stock_mode, stock_status, weight, category_id,
    active, featured, images, intentions, is_demo
) VALUES (
    'p1000000-0000-0000-0000-000000000008',
    'KIT-ALT-008',
    'Kit Altar Sagrado: Cristais, Incensário e Guia Ritual',
    'kit-altar-sagrado',
    'O ponto de partida completo para seu espaço devocional e meditativo',
    'Reúne Ametista, Quartzo Rosa, Incensário em Cerâmica e manual ritualístico exclusivo.',
    'Um arranjo harmônico concebido pelos bruxos do bazar para quem deseja consagrar um recanto sereno em sua casa sem complicações.',
    168.00, 149.00, 52.00, 110.00,
    'OWN', 'ACTIVE', 'INTERNAL', 'IN_STOCK', 0.850,
    'c1000000-0000-0000-0000-000000000009', true, true,
    '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    '["intuicao", "calma", "rituais"]'::jsonb, true
) ON CONFLICT (sku) DO NOTHING;

-- Prod 9: Grimório em Couro Nobre Feito à Mão
INSERT INTO products (
    id, sku, name, slug, subtitle, short_description, description, price, sale_price, cost, minimum_price,
    product_type, commercial_status, stock_mode, stock_status, weight, category_id,
    active, featured, images, intentions, is_demo
) VALUES (
    'p1000000-0000-0000-0000-000000000009',
    'LIV-GRI-009',
    'Grimório em Couro Sintético Nobre - 200 Páginas Kraft',
    'grimorio-couro-artesanal',
    'Seu livro das sombras para registrar sonhos, feitiços e reflexões',
    'Costura copta aparente, papel envelhecido sem pauta e fecho em metal com trava mística.',
    'Caderno artesanal de capa dura revestido com material sintético nobre gravado com mandala celta em baixo-relevo.',
    119.00, null, 36.00, 79.00,
    'OWN', 'ACTIVE', 'INTERNAL', 'IN_STOCK', 0.520,
    'c1000000-0000-0000-0000-000000000005', true, true,
    '["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    '["estudos", "sabedoria"]'::jsonb, true
) ON CONFLICT (sku) DO NOTHING;

-- Prod 10: Bastão de Selenita Branca Pura
INSERT INTO products (
    id, sku, name, slug, subtitle, short_description, description, price, sale_price, cost, minimum_price,
    product_type, commercial_status, stock_mode, stock_status, weight, category_id,
    active, featured, images, intentions, is_demo
) VALUES (
    'p1000000-0000-0000-0000-000000000010',
    'CRIS-SEL-010',
    'Bastão de Selenita Branca Pura',
    'bastao-selenita-branca',
    'Canalizadora de luz límpida e limpador natural de outros cristais',
    'Gipso fibroso acetinado de brilho nacarado com extremidades rústicas.',
    'Vareta mineral límpida com estrias que produzem um efeito óptico sedoso sob iluminação natural.',
    38.00, null, 11.00, 24.00,
    'OWN', 'ACTIVE', 'INTERNAL', 'IN_STOCK', 0.160,
    'c1000000-0000-0000-0000-000000000001', true, false,
    '["https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    '["limpeza", "clareza"]'::jsonb, true
) ON CONFLICT (sku) DO NOTHING;

-- 5. USUÁRIO ADMIN E CLIENTE DEMO
INSERT INTO users (id, name, email, password_hash, role) VALUES
('u1000000-0000-0000-0000-000000000001', 'O Bruxo Regente (Admin)', 'admin@obazardobruxo.com.br', '$2a$10$wTknqL88qB2i1EOmF5gD0eU3y3q95oHlI8K1w8GjM4hF0R0Q12345', 'admin'),
('u1000000-0000-0000-0000-000000000002', 'Helena Ravena', 'helena.ravena@obazar.com.br', '$2a$10$wTknqL88qB2i1EOmF5gD0eU3y3q95oHlI8K1w8GjM4hF0R0Q12345', 'customer')
ON CONFLICT (email) DO NOTHING;

INSERT INTO admins (user_id, permissions, is_superadmin) VALUES
('u1000000-0000-0000-0000-000000000001', '["all"]'::jsonb, true)
ON CONFLICT DO NOTHING;

INSERT INTO customers (id, name, email, phone, whatsapp, document, status, total_orders, total_spent) VALUES
('c2000000-0000-0000-0000-000000000001', 'Helena Ravena', 'helena.ravena@obazar.com.br', '11999887766', '11999887766', '123.456.789-00', 'ACTIVE', 2, 289.80)
ON CONFLICT (email) DO NOTHING;

-- 6. CUPONS DE DESCONTO
INSERT INTO coupons (code, discount_percent, min_subtotal, max_uses, used_count, active) VALUES
('PRIMEIRORITUAL', 10.00, 50.00, 1000, 42, true),
('MISTICISMO15', 15.00, 120.00, 500, 18, true),
('FRETEGRATIS', 0.00, 199.00, NULL, 110, true)
ON CONFLICT (code) DO NOTHING;

-- 7. AUDITORIA INICIAL
INSERT INTO audit_logs (user_id, event_type, target_entity, target_id, new_value) VALUES
('u1000000-0000-0000-0000-000000000001', 'DATABASE_INITIALIZED', 'system', 'seed_v1', '{"status": "SUCCESS", "products_count": 10, "mode": "MVP_V1"}'::jsonb);
