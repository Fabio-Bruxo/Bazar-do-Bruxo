# 🏛️ Arquitetura do Sistema — O Bazar do Bruxo

## 1. Visão Geral
**O Bazar do Bruxo** é uma plataforma de e-commerce mística com operação comercial real e agente operacional autônomo ("O Guardião do Bazar"), construída com Next.js 14 App Router, TypeScript, Tailwind CSS, PostgreSQL / Supabase, Mercado Pago oficial e orquestração n8n.

## 2. Princípio Fundamental de Arquitetura: Desacoplamento
O sistema opera sob três garantias fundamentais:
1. **Frontend Desacoplado:** O status de pagamentos, estoques e pedidos nunca é decidido ou confirmado unilateralmente pelo cliente web. Toda transição de estado sensível requer validação autoritativa no backend.
2. **Motor Determinístico do Guardião:** O agente de atendimento opera 100% sem IA generativa paga através de regras rígidas, expressões regulares, busca em catálogo real e máquina de estados finitos (FSM).
3. **Ledger Contábil Imutável:** Todas as entradas financeiras (receita bruta, split, taxas, comissões) são gravadas por partidas no `financial_ledger`.

```
[ CLIENTE WEB / MOBILE ]
         │
         ▼
[ NEXT.JS APP ROUTER FRONTEND ]
         │ (HTTP / API Routes)
         ▼
[ BACKEND API & SERVICES ]
   ├── PaymentService (Mercado Pago SDK + HMAC Webhooks)
   ├── FinancialLedgerService (Partidas dobradas + Reconciliação)
   ├── DropshippingService (Travas de margem, endereço e pagamento)
   └── GuardiaoEngine (Bot determinístico + FSM de atendimento)
         │
         ├──► [ SUPABASE POSTGRESQL ] (38 Tabelas canônicas + RLS)
         ├──► [ N8N COMMUNITY EDITION ] (17 Workflows modulares)
         └──► [ EVOLUTION API / WHATSAPP ] (Mensagens transacionais)
```

## 3. Fluxo de Vida do Pedido
```text
CLIENTE
  │ (Escolhe itens próprios ou dropshipping)
  ▼
CHECKOUT (PIX Dinâmico / Cartão via Mercado Pago)
  │
  ▼
WEBHOOK MERCADO PAGO (/api/webhooks/mercadopago)
  │ (Validação HMAC-SHA256 + Idempotência unívoca)
  ▼
STATUS = APPROVED
  │
  ├──► [ FINANCIAL LEDGER ] (Registra CUSTOMER_PAYMENT, PAYMENT_FEE, SUPPLIER_SHARE)
  ├──► [ DROPSHIPPING SERVICE ] (Se houver item de fornecedor, despacha com travas)
  ├──► [ N8N WORKFLOW 05 ] (Dispara mensagem acolhedora via WhatsApp)
  └──► [ STATUS DO PEDIDO = PAID ]
```

## 4. Regra de Ouro da Transição Humana (Handoff)
Quando um cliente solicitar atendimento humano, relatar problemas financeiros, avarias ou disputas:
- O chamado é registrado em `human_tickets` com prioridade calculada.
- O modo da conversa transita para `conversation_mode = 'HUMAN'`.
- O bot Guardião entra em **silêncio absoluto** (`is_silenced = true`), impedindo qualquer interferência na conversa entre cliente e atendente.
- A reativação do bot é controlada exclusivamente pelo atendente no painel administrativo.
