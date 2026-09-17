# 🪝 Processamento de Webhooks — O Bazar do Bruxo

## 1. Visão Geral
Os webhooks constituem a espinha dorsal de sincronização e autoridade transacional d'**O Bazar do Bruxo**. O frontend da loja nunca decide o estado de um pedido; apenas o backend, mediante recebimento e validação de webhooks autenticados, pode marcar pedidos como pagos, estornados ou cancelados.

## 2. Endpoint Oficial de Webhook
- **URL do Webhook:** `POST /api/webhooks/mercadopago`
- **Tópicos Suportados:**
  - `payment`: Notificações de criação, aprovação, estorno ou recusa de pagamentos.
  - `merchant_order`: Notificações de consolidação de pedidos múltiplos.
  - `chargebacks`: Notificações de contestações abertas por portadores de cartão.

## 3. Arquitetura de Idempotência e Segurança
```text
1. REQUISIÇÃO POST CHEGA EM /api/webhooks/mercadopago
   │
   ├──► [ VALIDAÇÃO HMAC-SHA256 ]
   │    Compara header x-signature contra MP_WEBHOOK_SECRET
   │    Se inválido ──► HTTP 401 Unauthorized (Bloqueio Imediato)
   │
   ├──► [ VERIFICAÇÃO DE IDEMPOTÊNCIA ]
   │    Consulta se o event_id / action já foi processado em `payment_events`
   │    Se já processado ──► HTTP 200 OK ("Already processed, skipping")
   │
   ├──► [ CONSULTA OFICIAL À API DO MERCADO PAGO ]
   │    GET https://api.mercadopago.com/v1/payments/{id}
   │    Garante integridade dos dados reais contra adulterações no payload
   │
   ├──► [ TRANSIÇÃO DE ESTADO ATÔMICA ]
   │    Se status == "approved":
   │      - Pedido atualizado para "PAID"
   │      - Gravação de partidas no financial_ledger
   │      - Despacho automático de dropshipping (se aplicável)
   │      - Notificação acolhedora no WhatsApp do cliente
   │    Se status == "refunded":
   │      - Pedido atualizado para "REFUNDED"
   │      - Lançamento de REFUND_DEBIT no ledger
   │    Se status == "charged_back":
   │      - Pedido atualizado para "CHARGED_BACK"
   │      - Alerta de risco e bloqueio de fornecedor/cliente
   │
   └──► HTTP 200 OK (Confirmação ao Mercado Pago)
```

## 4. Tabela de Auditoria `payment_events`
Cada webhook recebido é registrado integralmente na tabela `payment_events` com:
- `id`: UUID único.
- `payment_id`: ID oficial da transação no Mercado Pago.
- `event_type`: Ex: `payment.updated`.
- `status`: Ex: `approved`.
- `raw_payload`: JSON completo recebido na notificação para fins forenses e auditoria.
- `processed_at`: Timestamp de finalização do processamento.

## 5. Tolerância a Falhas e Reprocessamento
Caso a API do Mercado Pago envie retentativas devido a instabilidade temporária na rede:
- O mecanismo de idempotência impede lançamentos contábeis duplicados.
- Se o banco de dados principal estiver temporariamente inacessível, a requisição responde com código de erro `HTTP 500` para que o Mercado Pago reenvie a notificação conforme sua política de backoff exponencial.
