# 🗄️ Dicionário do Banco de Dados — O Bazar do Bruxo

## 1. Visão Geral
O banco de dados relacional utiliza **Supabase PostgreSQL** com migrations versionadas em `database/migrations/`:
- `001_initial_schema.sql`: Estrutura canônica básica (30 tabelas).
- `002_financial_ledger_and_rls.sql`: Tabelas contábeis, eventos de pagamento, liquidações, reembolsos e ativação de Row Level Security (RLS).

## 2. Tabelas Canônicas Principais

### `users` & `admins`
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `role` (VARCHAR: `customer`, `admin`, `staff`)
- `permissions` (JSONB)
- `is_superadmin` (BOOLEAN)

### `customers`
- `id` (UUID, PK)
- `name`, `email`, `phone`, `whatsapp`, `document`
- `address` (JSONB: street, number, neighborhood, city, state, zipCode)
- `marketing_consent`, `whatsapp_consent`
- `total_orders`, `total_spent`

### `products` & `product_variants`
- `id` (UUID, PK)
- `sku` (VARCHAR, UNIQUE)
- `slug` (VARCHAR, UNIQUE)
- `name`, `subtitle`, `description`
- `price`, `sale_price`, `cost`, `minimum_price`
- `product_type` (`OWN`, `DROPSHIPPING`, `AFFILIATE`)
- `commercial_status` (`ACTIVE`, `INACTIVE`, `REVIEW`, `RESTRICTED`)
- `stock_mode` (`INTERNAL`, `SUPPLIER_SYNC`)
- `supplier_id` (UUID FK suppliers)
- `is_demo` (BOOLEAN)

### `orders` & `order_items`
- `id` (UUID, PK)
- `code` (VARCHAR, UNIQUE, ex: `OBZ-8899-LUA`)
- `subtotal`, `shipping_cost`, `discount_amount`, `total`
- `payment_method` (`PIX`, `CREDIT_CARD`)
- `payment_status` (`PENDING`, `PAID`, `REJECTED`, `REFUNDED`)
- `order_status` (`NEW`, `WAITING_PAYMENT`, `PAID`, `PROCESSING`, `WAITING_SUPPLIER`, `SUPPLIER_CONFIRMED`, `SHIPPED`, `DELIVERED`, `MANUAL_REVIEW`, `CANCELLED`)

### `payments` & `payment_events`
- `id` (UUID, PK)
- `order_id` (UUID FK orders)
- `gateway` (`MERCADOPAGO`)
- `gateway_payment_id` (VARCHAR)
- `idempotency_key` (VARCHAR, UNIQUE)
- `amount`, `status`, `pix_qr_code`, `pix_copy_paste`

### `financial_ledger`
- `id` (UUID, PK)
- `order_id` (UUID FK orders)
- `entry_type` (`CUSTOMER_PAYMENT`, `SUPPLIER_SHARE`, `MARKETPLACE_REVENUE`, `PAYMENT_FEE`, `AFFILIATE_COMMISSION`, `REFUND`, `CHARGEBACK`, `ADJUSTMENT`)
- `direction` (`CREDIT`, `DEBIT`)
- `amount` (NUMERIC)
- `entity_id` (`marketplace`, supplier_id, affiliate_id)
- `reconciled` (BOOLEAN)

### `suppliers` & `supplier_settlements`
- `id` (UUID, PK)
- `name`, `email`, `whatsapp`
- `status` (`ACTIVE`, `PAUSED`, `UNAVAILABLE`, `REVIEW`)
- `lead_time_days`, `shipping_cost_base`
- `gross_amount`, `supplier_amount`, `marketplace_amount`, `payment_fee`, `net_estimate`

### `conversations`, `messages` & `human_tickets`
- `phone` (VARCHAR)
- `conversation_mode` (`BOT`, `HUMAN`)
- `is_silenced` (BOOLEAN)
- `reason`, `priority` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), `status` (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`)

## 3. Índices Críticos de Integridade e Performance
```sql
CREATE INDEX idx_payments_idempotency ON payments(idempotency_key);
CREATE INDEX idx_orders_code ON orders(code);
CREATE INDEX idx_financial_ledger_order_id ON financial_ledger(order_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_conversations_phone ON conversations(phone);
CREATE INDEX idx_human_tickets_status ON human_tickets(status);
```
