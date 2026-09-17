# 🛠️ Resolução de Incidentes (Troubleshooting) — O Bazar do Bruxo

## 1. Visão Geral
Este guia detalha os procedimentos de diagnóstico e remediação para os incidentes técnicos e operacionais mais frequentes no ecossistema do **Bazar do Bruxo**.

## 2. Matriz Rápida de Incidentes e Resoluções

| Sintoma | Diagnóstico Provável | Ação de Remediação |
| :--- | :--- | :--- |
| **Status Vermelho em `/api/payment-health`** | `MP_ACCESS_TOKEN` expirado, revogado ou inválido. | Atualizar a credencial no `.env.local` e reiniciar o container Next.js. |
| **Status Vermelho em `/api/whatsapp-health`** | Instância do WhatsApp desconectada na Evolution API. | Acessar o painel da Evolution API e escanear o QR Code de reconexão do número `13998039867`. |
| **Status Amarelo em `/api/database-health`** | Sistema operando em fallback de memória. | Verificar se `NEXT_PUBLIC_SUPABASE_URL` e chaves estão configuradas corretamente. |
| **Cliente pagou PIX mas status não atualizou** | Falha de entrega do Webhook ou atraso bancário. | 1. Consultar o pagamento no Mercado Pago. 2. Se aprovado, acessar `/admin/orders` e forçar sincronização via botão "Sincronizar Gateway". |
| **Pedido travado em `MANUAL_REVIEW`** | Divergência de CEP ou margem de lucro negativa detectada. | Inspecionar `validation_errors` no pedido, corrigir o endereço ou renegociar frete, e liberar o despacho manualmente. |
| **Bot Guardião respondendo quando deveria estar mudo** | Chamado humano não ativou a flag `is_silenced`. | Acessar `/admin/tickets`, selecionar o ticket e clicar em "Forçar Silêncio do Bot". |

## 3. Investigação Forense em `audit_logs`
Todas as ações operacionais, alterações em pedidos, tentativas de login e erros de automação são gravados na tabela `audit_logs`.
Para inspecionar incidentes recentes via SQL:
```sql
SELECT 
    created_at, 
    action, 
    actor_email, 
    target_resource, 
    details
FROM audit_logs
WHERE severity IN ('WARNING', 'CRITICAL')
ORDER BY created_at DESC
LIMIT 50;
```

## 4. Reprocessamento de Webhooks Não Entregues
Se o Mercado Pago registrar falha de entrega (ex: durante reinicialização de servidor):
1. Acesse o Painel do Desenvolvedor Mercado Pago > Notificações Webhook.
2. Localize as notificações com código de status HTTP diferente de 200.
3. Clique em **Reenviar Notificação (Retry)**.
4. Graças à trava de idempotência implementada em `/api/webhooks/mercadopago`, reenvios nunca duplicarão lançamentos financeiros.

## 5. Falha na Sincronização de Fornecedores Dropshipping
Se um fornecedor relatar não ter recebido ordens de despacho:
1. Verifique `/api/supplier-health`.
2. Confirme se `DROPSHIPPING_DISPATCH_ENABLED` está como `true`.
3. Verifique se o pedido está com status `PAID` (o sistema proíbe categoricamente o despacho de pedidos não pagos).
4. No painel `/admin/orders`, clique em "Reenviar Ordem ao Fornecedor".
