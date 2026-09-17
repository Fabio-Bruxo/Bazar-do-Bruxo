# 🐘 Guia de Integração Supabase — O Bazar do Bruxo

## 1. Visão Geral
O Supabase fornece o banco de dados relacional PostgreSQL, autenticação e armazenamento de objetos para o e-commerce d'**O Bazar do Bruxo**. O sistema foi concebido para funcionar tanto com conexão PostgreSQL/Supabase ativa quanto em modo desacoplado em memória (fallback) para testes e desenvolvimento local offline.

## 2. Configuração do Projeto e Variáveis de Ambiente
No arquivo `.env.local`, defina as credenciais do seu projeto Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
DATABASE_URL=postgresql://postgres:<senha>@db.<seu-projeto>.supabase.co:5432/postgres
```

## 3. Estrutura de Migrações
O schema completo está dividido em migrações idempotentes no diretório `database/migrations/`:
1. `001_complete_schema.sql`: 30 tabelas fundamentais incluindo catálogo, pedidos, clientes, fornecedores, tickets de atendimento, auditoria e métricas.
2. `002_financial_ledger_and_rls.sql`: Tabelas do ledger contábil (`financial_ledger`, `payment_events`, `refunds`, `chargebacks`, `supplier_settlements`, `marketplace_fees`), perfis com papéis canônicos e políticas RLS detalhadas.

### Aplicação das Migrações
Execute no Editor SQL do painel do Supabase ou via CLI:
```bash
supabase db push
# ou execute diretamente o conteúdo de 001_complete_schema.sql seguido de 002_financial_ledger_and_rls.sql
```

## 4. Papéis Canônicos (RBAC)
Os usuários registrados na tabela `user_roles` ou no campo `role` dos perfis possuem 5 níveis canônicos:
- `ADMIN`: Acesso irrestrito a configurações sensíveis, relatórios financeiros, conciliação e chaves de API.
- `STAFF`: Gestão de pedidos, catálogo, estoque e atendimento aos chamados humanos (`human_tickets`).
- `SUPPLIER`: Acesso restrito aos próprios produtos dropshipping, pedidos atribuídos e extrato de liquidação (`supplier_settlements`).
- `CUSTOMER`: Acesso somente à leitura do catálogo público e aos próprios pedidos, endereços e tickets.
- `AFFILIATE`: Acesso exclusivo aos links de indicação e relatório de comissões.

## 5. Row Level Security (RLS)
Todas as tabelas críticas possuem RLS ativado (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`):
- `orders`: Clientes enxergam apenas pedidos com seu `customer_id`. Fornecedores enxergam apenas pedidos associados ao seu `supplier_id`. Admins e Staff possuem acesso total.
- `financial_ledger`: Acesso exclusivo para administradores (`ADMIN`) e serviços com `SUPABASE_SERVICE_ROLE_KEY`.
- `supplier_settlements`: Fornecedores enxergam exclusivamente suas próprias liquidações.
- `human_tickets`: Clientes leem seus próprios chamados; staff e admins gerenciam a fila.

## 6. Storage Buckets
Crie dois buckets públicos/protegidos no Supabase Storage:
1. `product-images`: Armazenamento de fotos dos produtos (formatos JPG/PNG/WebP, max 5MB).
2. `supplier-proofs`: Armazenamento de comprovantes fiscais, notas de envio e despachos de fornecedores (privado, acesso via signed URLs).

## 7. Verificação de Saúde
O endpoint `/api/database-health` valida a conectividade em tempo real com o banco de dados Supabase:
- `VERDE`: Conexão estabelecida com sucesso e latência < 200ms.
- `AMARELO`: Conexão em fallback in-memory seguro ou latência > 200ms.
- `VERMELHO`: Falha crítica de conexão e impossibilidade de operar.
