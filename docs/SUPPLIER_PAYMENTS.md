# 📦 Pagamentos e Liquidação de Fornecedores — O Bazar do Bruxo

## 1. Visão Geral
O Bazar do Bruxo opera com parceiros de produtos artesanais e dropshipping. Para garantir a segurança financeira do marketplace e a pontualidade na remuneração dos fornecedores, foi instituído o fluxo de **Liquidação e Garantia de Entrega (Escrow Operacional)**.

## 2. Regras de Retenção e Ciclo de Repasse
Para prevenir perdas decorrentes de disputas de clientes, atrasos ou produtos avariados:
- **Janela de Custódia (Escrow):** O valor devido ao fornecedor (`SUPPLIER_SHARE`) fica retido temporariamente até a confirmação do código de rastreamento válido nos Correios ou transportadora parceira.
- **Ciclo de Liquidação:** Padrão D+14 (14 dias após o envio) ou quinzenal fechado (dias 1 e 16 de cada mês).
- **Taxa Mínima de Sucesso:** Fornecedores com taxa de estorno ou atraso superior a 5% têm o ciclo estendido para D+30 preventivamente.

## 3. Fluxo Operacional de Liquidação
```text
1. PEDIDO COM ITEM DROPSHIPPING APROVADO
   │
   ▼
2. NOTIFICAÇÃO ENVIADA AO FORNECEDOR (n8n Workflow 06 / E-mail / WhatsApp)
   │
   ▼
3. FORNECEDOR DESPACHA O ITEM E INSERE O RASTREIO
   │  POST /api/suppliers/orders/{id}/tracking
   │
   ▼
4. N8N WORKFLOW 11 VERIFICA O CÓDIGO DE RASTREIO
   │  Valida movimentação na transportadora
   │  Transita status do item para "SHIPPED"
   │
   ▼
5. RASTREIO CONFIRMA ENTREGA AO CLIENTE ("DELIVERED")
   │
   ▼
6. GERAÇÃO DE LOTE DE LIQUIDAÇÃO (supplier_settlements)
   │  - Calcula: Soma dos itens entregues (-) estornos (-) taxas
   │  - Status: "PENDING_PAYOUT"
   │
   ▼
7. REPASSE FINANCEIRO EFETUADO (PIX / Transferência / Split Direto)
   │  - Status atualizado para "PAID"
   │  - Lançamento de SUPPLIER_PAYOUT registrado no financial_ledger
   │  - Comprovante de liquidação disponibilizado no painel do fornecedor
```

## 4. Tabela de Auditoria `supplier_settlements`
Todos os repasses e deduções são rastreados na tabela `supplier_settlements`:
- `id`: Identificador único do lote de liquidação.
- `supplier_id`: Fornecedor beneficiário.
- `period_start` / `period_end`: Intervalo de datas das ordens contempladas.
- `total_orders_amount`: Valor bruto faturado dos produtos do fornecedor.
- `marketplace_fee_total`: Total retido pelo Bazar a título de comissão.
- `refund_deductions`: Descontos decorrentes de devoluções ou itens cancelados.
- `net_payout_amount`: Valor líquido a ser repassado ao fornecedor.
- `payout_status`: `DRAFT`, `PENDING_PAYOUT`, `PAID`, `CANCELLED`.
- `payout_date`: Data da efetiva transferência bancária.
- `payout_reference`: Chave PIX ou comprovante bancário da operação.

## 5. Tratamento de Cancelamentos e Disputas
Caso um pedido seja contestado ou devolvido antes da liquidação:
- O valor é debitado imediatamente do saldo acumulado do fornecedor.
- Se o repasse já tiver ocorrido, o valor é lançado como saldo devedor e descontado no lote subsequente.
