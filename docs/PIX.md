# ⚡ Especificação e Operação do PIX — O Bazar do Bruxo

## 1. Arquitetura do PIX Dinâmico
No **Bazar do Bruxo**, todas as cobranças PIX são geradas de forma **dinâmica** e exclusiva por pedido, integradas diretamente com a API do Mercado Pago.
Isso garante:
- Rastreabilidade 1:1 entre transação bancária e número do pedido.
- Impossibilidade de duplicidade ou pagamentos com valores incorretos.
- Baixa automática em menos de 3 segundos via Webhook oficial.

## 2. Ciclo de Vida do Pedido PIX
```text
1. CLIENTE CLICA EM "FINALIZAR COM PIX"
   │
   ▼
2. BACKEND CHAMA MERCADO PAGO (/v1/payments)
   │  payment_method_id: "pix"
   │  transaction_amount: <total do pedido>
   │  date_of_expiration: NOW() + 30 min
   │
   ▼
3. RETORNO DO PAYLOAD PIX
   ├── qr_code_base64: Exibido na tela para leitura de câmera
   └── qr_code: Texto EMVCo copiado via botão "Copiar Código PIX"
   │
   ▼
4. CLIENTE PAGA NO APLICATIVO DO SEU BANCO
   │
   ▼
5. WEBHOOK DO MERCADO PAGO DISPARA NOTIFICAÇÃO
   │  POST /api/webhooks/mercadopago
   │  status: "approved"
   │
   ▼
6. ATUALIZAÇÃO IMEDIATA E CONTÁBIL
   ├── Pedido marcado como "PAID"
   ├── Partidas lançadas no financial_ledger
   └── Notificação acolhedora enviada no WhatsApp do cliente
```

## 3. Estrutura do Objeto PIX Retornado
Ao criar o pagamento, o Mercado Pago retorna o objeto `point_of_interaction`:
```json
{
  "id": 1234567890,
  "status": "pending",
  "status_detail": "waiting_transfer",
  "point_of_interaction": {
    "type": "CHECKOUT",
    "transaction_data": {
      "qr_code": "00020101021226870014br.gov.bcb.pix2565qrcodes-pix.mercadopago.com/...",
      "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
      "ticket_url": "https://www.mercadopago.com.br/payments/1234567890/ticket"
    }
  },
  "date_of_expiration": "2026-09-17T18:30:00.000-03:00"
}
```

## 4. Polling vs. Webhook
- **Webhook (Primário):** Mecanismo oficial e instantâneo que processa a aprovação no backend em milissegundos.
- **Polling no Checkout (Secundário / UX):** O frontend consulta `/api/orders/[id]` a cada 3 a 5 segundos enquanto o cliente visualiza o QR Code. Assim que o webhook altera o status para `PAID`, a tela do cliente transita automaticamente para a comemoração de sucesso sem necessidade de recarregar a página.

## 5. Expiração e Recuperação
- Se o PIX não for pago em até 30 minutos, o status transita para `EXPIRED`.
- O n8n Workflow 08 (`08_pix_reminder.json`) monitora PIX pendentes e envia um lembrete afetuoso no WhatsApp 15 minutos antes da expiração com o link e o código copia-e-cola.
- Caso expire, o cliente pode clicar no link do pedido para gerar um novo código dinâmico com facilidade.
