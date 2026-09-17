# ✂️ Divisão de Pagamentos (Split Payments) — O Bazar do Bruxo

## 1. Visão Geral
O Bazar do Bruxo opera como loja mística e como marketplace de artesãos, bruxos e fornecedores confiáveis (dropshipping e produção artesanal sob demanda). Para viabilizar a remuneração automática e transparente de todas as partes, o sistema adota a arquitetura de **Split de Pagamentos e Conciliação Contábil**.

## 2. Estrutura de Taxas (Take-Rate)
Cada fornecedor cadastrado na plataforma possui uma taxa acordada registrada na tabela `suppliers`:
- `marketplace_fee_percent`: Percentual de comissão do Bazar (padrão: 12.00%).
- `fixed_fee`: Custo operacional fixo por transação (quando aplicável).

### Exemplo de Cálculo
Para um item de artesanato vendido a R$ 100,00 com frete de R$ 20,00 e comissão de 12%:
- **Total Pago pelo Cliente:** R$ 120,00
- **Receita Bruta do Fornecedor (Produto + Frete reembolsável):** R$ 100,00
- **Comissão do Marketplace (12% do produto):** R$ 12,00
- **Líquido do Fornecedor:** R$ 88,00 (+ R$ 20,00 de repasse de frete) = R$ 108,00
- **Taxa do Gateway (Mercado Pago ex: 0.99% PIX):** R$ 1,19 debitada da receita operacional.

## 3. Modelos de Execução do Split

### Modelo A: Split Nativo via API Mercado Pago (OAuth)
Quando o fornecedor autoriza o Bazar através do fluxo OAuth do Mercado Pago:
- O pagamento é processado utilizando o parâmetro `marketplace_fee`.
- O Mercado Pago credita o valor líquido na conta do vendedor e a comissão na conta do Bazar de forma imediata na aprovação.

### Modelo B: Liquidação Programada (Escrow / Conta Gráfica)
Quando o fornecedor opera no modelo de faturamento consolidado quinzenal ou mensal (D+14 / D+30):
1. O valor total é recebido na conta do Bazar.
2. O sistema grava os lançamentos no `financial_ledger`:
   - `CUSTOMER_PAYMENT`: +R$ 120,00
   - `PAYMENT_FEE`: -R$ 1,19
   - `MARKETPLACE_REVENUE`: +R$ 12,00
   - `SUPPLIER_SHARE`: R$ 106,81 (a pagar ao fornecedor)
3. O saldo acumulado permanece em retenção de garantia (escrow) até que o fornecedor envie o código de rastreio e o comprovante de entrega.
4. Após confirmação, a liquidação é disparada e registrada como `SUPPLIER_PAYOUT`.

## 4. Tratamento de Carrinhos com Múltiplos Fornecedores
Quando o cliente adquire itens de múltiplos fornecedores em um único pedido:
- O checkout cobra o valor unificado do cliente em uma única transação PIX ou Cartão.
- O `FinancialLedgerService` decompõe cada item da ordem (`order_items`), calculando e registrando individualmente as quotas de cada fornecedor (`SUPPLIER_SHARE`) e a receita do Bazar (`MARKETPLACE_REVENUE`).
- Cada fornecedor recebe a sua ordem de separação e despacho de forma isolada, garantindo a privacidade dos dados operacionais.
