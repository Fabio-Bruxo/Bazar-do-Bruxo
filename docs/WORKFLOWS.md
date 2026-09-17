# 🔄 Guia dos 17 Workflows n8n — O Bazar do Bruxo

## 1. Visão Geral
Toda a automação assíncrona, orquestração de pós-venda, recuperação de carrinhos e monitoramento de integridade do **Bazar do Bruxo** é estruturada em **17 workflows modulares** para n8n Community Edition, salvos no formato JSON nativo em `automation/n8n/`.

## 2. Mapa Geral dos Workflows

| # | Arquivo | Gatilho | Propósito Principal |
| :--- | :--- | :--- | :--- |
| **01** | `01_payment_webhook.json` | Webhook HTTP | Recebe notificações do Mercado Pago e valida assinatura HMAC. |
| **02** | `02_whatsapp_inbound.json` | Webhook HTTP | Recebe mensagens do WhatsApp (Evolution API) e direciona para o Guardião. |
| **03** | `03_guardiao_engine.json` | Sub-workflow | FSM de atendimento determinístico sem IA paga com busca no catálogo real. |
| **04** | `04_human_handoff.json` | Sub-workflow | Silencia o bot e abre chamado de suporte em `human_tickets`. |
| **05** | `05_order_paid_flow.json` | Evento de Pedido | Dispara boas-vindas calorosas e confirmação de pagamento no WhatsApp. |
| **06** | `06_supplier_order_dispatch.json` | Evento de Pedido | Envia ordem de despacho com trava de segurança para o fornecedor. |
| **07** | `07_cart_recovery.json` | Cron (a cada 30 min) | Localiza carrinhos abandonados há >1h e dispara mensagem de recuperação. |
| **08** | `08_pix_reminder.json` | Cron (a cada 5 min) | Alerta clientes sobre PIX com vencimento iminente (15 min restantes). |
| **09** | `09_post_purchase_feedback.json` | Cron (diário) | Solicita avaliação afetuosa 7 dias após a entrega confirmada. |
| **10** | `10_upsell_crosssell.json` | Cron / Evento | Sugere produtos complementares misticamente compatíveis com o pedido. |
| **11** | `11_tracking_updates.json` | Cron (a cada 1h) | Consulta APIs de rastreio e avisa o cliente no WhatsApp a cada trânsito. |
| **12** | `12_inventory_alerts.json` | Cron (a cada 2h) | Alerta a equipe administrativa sobre produtos com estoque crítico (< 3 un). |
| **13** | `13_daily_metrics.json` | Cron (diário 23h59) | Consolida faturamento, ticket médio e conversão do dia. |
| **14** | `14_health_check_monitor.json` | Cron (a cada 15 min) | Monitora os 6 endpoints de saúde (`/api/*-health`) e avisa sobre incidentes. |
| **15** | `15_supplier_payouts.json` | Cron (dias 1 e 16) | Consolida lotes de liquidação para artesãos e fornecedores parceiros. |
| **16** | `16_oauth_token_refresh.json` | Cron (semanal) | Renova tokens OAuth de fornecedores no Mercado Pago antes de expirarem. |
| **17** | `17_reconciliation.json` | Cron (diário 03h00) | Executa auditoria contábil entre pedidos e lançamentos no `financial_ledger`. |

## 3. Instalação e Importação no n8n
1. Acesse seu painel n8n (ex: `http://localhost:5678` ou VPS da operação).
2. Clique em **Workflows** > **Import from File...**
3. Selecione os arquivos JSON da pasta `automation/n8n/` em lote ou individualmente.
4. Configure as Credenciais do n8n:
   - `Postgres DB`: Dados de conexão ao PostgreSQL do Supabase.
   - `Mercado Pago API`: Chaves de API e Webhook Secret.
   - `Evolution API / WhatsApp`: URL da instância e token de autorização.
5. Ative os workflows (`Active = true`).

## 4. Tratamento de Erros e Dead Letter Queue
Cada workflow crítico inclui um nó `Error Trigger` que:
- Registra o incidente na tabela `audit_logs` com stack trace.
- Notifica imediatamente o grupo de emergência no WhatsApp corporativo caso ocorra falha de execução.
