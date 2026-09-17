# 💳 Integração Mercado Pago — O Bazar do Bruxo

## 1. Visão Geral
O Mercado Pago é o gateway de pagamentos oficial d'**O Bazar do Bruxo**, responsável pelo processamento de transações via PIX dinâmico (com QR Code e código copia-e-cola), cartão de crédito com parcelamento e split de pagamentos nativo para vendedores/fornecedores parceiros.

## 2. Credenciais de API
Configure no arquivo `.env.local`:
```env
# Credenciais Principais
MP_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx # Ou PROD
MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MP_CLIENT_ID=xxxxxxxxxxxx
MP_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Chave secreta de Webhooks para assinatura HMAC
MP_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Taxa padrão do marketplace (ex: 12%)
MARKETPLACE_FEE_PERCENT=12.0
```

> [!NOTE]
> Para alternar entre o ambiente de testes (Sandbox) e produção, basta utilizar os tokens iniciados com `TEST-` ou `APP_USR-` fornecidos no Painel de Desenvolvedores do Mercado Pago.

## 3. Métodos de Pagamento Habilitados

### 3.1. PIX Dinâmico
- Transação instantânea gerada via API `/v1/payments`.
- Retorna o payload completo com:
  - `qr_code`: Chave alfanumérica copia-e-cola (BR Code EMVCo).
  - `qr_code_base64`: Imagem renderizável do QR Code na tela de checkout.
  - `date_of_expiration`: Tempo de tolerância configurado (padrão 30 minutos).

### 3.2. Cartão de Crédito
- Tokenização de cartão segura via MercadoPago.js no frontend do cliente.
- Envio de token cifrado para o backend com `installments` (parcelas), `payer` com CPF/CNPJ e billing address.
- Suporte a verificação de risco e antifraude nativo.

## 4. Split de Pagamento (Marketplace)
Quando um pedido contém itens fornecidos por terceiros (dropshipping ou parceiros):
1. O marketplace cobra o valor total do cliente.
2. A taxa do marketplace (`marketplace_fee`) é retida na conta principal d'O Bazar do Bruxo.
3. O valor líquido do fornecedor é direcionado para a conta do Mercado Pago conectada do fornecedor via OAuth.

## 5. Validação Criptográfica de Webhooks
Para evitar fraudes e requisições forjadas, o endpoint `/api/webhooks/mercadopago` valida os cabeçalhos `x-signature` e `x-request-id`:
```typescript
// Validação HMAC-SHA256:
const [tsPart, v1Part] = xSignature.split(',');
const ts = tsPart.split('=')[1];
const v1 = v1Part.split('=')[1];
const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
const hmac = crypto.createHmac('sha256', MP_WEBHOOK_SECRET).update(manifest).digest('hex');

if (hmac !== v1) {
  return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
}
```

## 6. Diagnóstico e Saúde da Conexão
O status da integração pode ser monitorado em tempo real em `/api/payment-health`, que verifica a validade do `MP_ACCESS_TOKEN` e a conectividade com os servidores do Mercado Pago.
