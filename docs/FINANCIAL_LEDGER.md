# 📊 Livro Razão Contábil (Financial Ledger) — O Bazar do Bruxo

## 1. Visão Geral
O Bazar do Bruxo adota um modelo de **Livro Razão Imutável (Financial Ledger)** baseado nos princípios de partidas contábeis e auditoria forense. Nenhum registro financeiro é sobrescrito ou deletado (`UPDATE` ou `DELETE` são desabilitados por políticas RLS e triggers de banco). Quaisquer estornos, correções ou ajustes são lançados como novas transações compensatórias.

## 2. Tipos Canônicos de Lançamento (`entry_type`)
Cada linha na tabela `financial_ledger` possui uma natureza contábil e direção explícita:

| Tipo Canônico | Natureza | Descrição |
| :--- | :--- | :--- |
| `CUSTOMER_PAYMENT` | CRÉDITO | Valor total bruto pago pelo cliente (PIX, Cartão ou Boleto). |
| `PAYMENT_FEE` | DÉBITO | Taxa de processamento descontada pelo gateway Mercado Pago. |
| `SUPPLIER_SHARE` | DÉBITO | Parcela do pedido destinada ao fornecedor/artesão parceiro. |
| `MARKETPLACE_REVENUE` | CRÉDITO | Comissão operacional líquida retida pelo Bazar do Bruxo. |
| `AFFILIATE_COMMISSION` | DÉBITO | Comissão devida a influenciador ou afiliado do Bazar. |
| `SUPPLIER_PAYOUT` | DÉBITO | Baixa financeira de repasse transferido para a conta bancária do fornecedor. |
| `REFUND_DEBIT` | DÉBITO | Compensação de estorno ou devolução amigável ao consumidor. |
| `CHARGEBACK_DEBIT` | DÉBITO | Desconto forçado decorrente de contestação bancária (chargeback). |

## 3. Esquema da Tabela `financial_ledger`
```sql
CREATE TABLE financial_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    entry_type VARCHAR(50) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('CREDIT', 'DEBIT')),
    account VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'POSTED',
    reference_id VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. O Motor de Lançamento: `FinancialLedgerService`
Localizado em `src/services/financialLedgerService.ts`, o serviço orquestra a decomposição contábil automática na confirmação de pagamento:
```typescript
await FinancialLedgerService.processOrderPaymentApproval(order, {
  paymentId: mpPaymentId,
  gatewayFee: feeCalculada,
  supplierShare: valorFornecedor,
  marketplaceRevenue: comissaoBazar
});
```

## 5. Rotina de Reconciliação e Auditoria
A reconciliação pode ser disparada manualmente na **Central Financeira** (`/admin/financeiro`) ou automaticamente pelo n8n Workflow 17 (`17_reconciliation.json`):
- Compara a soma dos pedidos pagos (`orders.total_amount WHERE status = 'PAID'`) contra o somatório de créditos `CUSTOMER_PAYMENT` no ledger.
- Se a discrepância for zero (`R$ 0,00`), o status de conciliação é marcado como `CONCILIADO (100%)`.
- Se houver qualquer divergência (ex: transações orfãs ou falha de webhook), o sistema gera um chamado de alerta crítico para investigação contábil.
