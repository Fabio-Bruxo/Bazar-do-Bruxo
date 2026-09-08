import crypto from 'crypto';
import { memoryStore, recordAuditLog, query } from '@/lib/db';
import { DropshippingService, DropshipOrderPayload } from './dropshippingService';

export interface MercadoPagoWebhookNotification {
  id: number | string;
  live_mode: boolean;
  type: string; // 'payment'
  date_created: string;
  user_id: number | string;
  api_version: string;
  action: string; // 'payment.created', 'payment.updated'
  data: {
    id: string;
  };
}

export interface PaymentProcessResult {
  success: boolean;
  isDuplicate: boolean;
  orderId?: string;
  orderCode?: string;
  newStatus?: string;
  error?: string;
}

export class PaymentService {
  /**
   * Valida a assinatura criptográfica do Webhook do Mercado Pago
   * Headers: x-signature (ts=...,v1=...) e x-request-id
   */
  public static verifyWebhookSignature(
    signatureHeader: string | null,
    requestIdHeader: string | null,
    paymentId: string
  ): boolean {
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

    // Se o segredo não estiver configurado em ambiente de desenvolvimento/demo, aceita com aviso
    if (!webhookSecret) {
      if (process.env.NODE_ENV === 'production') {
        console.error('[SECURITY ERROR] MERCADOPAGO_WEBHOOK_SECRET is not configured in production!');
        return false;
      }
      return true;
    }

    if (!signatureHeader || !requestIdHeader) {
      return false;
    }

    try {
      // O header de assinatura do Mercado Pago tem o formato: ts=12345678,v1=abcdef...
      const parts = signatureHeader.split(',');
      let ts = '';
      let hash = '';

      for (const part of parts) {
        const [k, v] = part.trim().split('=');
        if (k === 'ts') ts = v;
        if (k === 'v1') hash = v;
      }

      if (!ts || !hash) return false;

      // Manifest: id:[data.id];request-id:[x-request-id];ts:[ts];
      const manifest = `id:${paymentId};request-id:${requestIdHeader};ts:${ts};`;
      const expectedHash = crypto.createHmac('sha256', webhookSecret).update(manifest).digest('hex');

      return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
    } catch (err: any) {
      console.error('[WEBHOOK SIGNATURE VERIFY ERROR]', err.message);
      return false;
    }
  }

  /**
   * Processa notificação de pagamento com garantia de IDEMPOTÊNCIA
   */
  public static async processPaymentNotification(
    paymentId: string,
    mockPayload?: {
      orderId: string;
      orderCode: string;
      amount: number;
      status: 'approved' | 'rejected' | 'pending';
      dropshipPayload?: DropshipOrderPayload;
    }
  ): Promise<PaymentProcessResult> {
    const idempotencyKey = `MERCADOPAGO_${paymentId}`;

    // 1. CHECAGEM DE IDEMPOTÊNCIA: Verifica se já foi processado anteriormente
    const existingInMem = memoryStore.payments.get(idempotencyKey);
    if (existingInMem && existingInMem.status === 'APPROVED') {
      console.log(`[PAYMENT IDEMPOTENCY] Pagamento ${paymentId} já foi processado anteriormente. Ignorando duplicata.`);
      return {
        success: true,
        isDuplicate: true,
        orderId: existingInMem.orderId,
        newStatus: existingInMem.status,
      };
    }

    // Consulta idempotência no PostgreSQL se disponível
    try {
      const dbCheck = await query('SELECT id, status, order_id FROM payments WHERE idempotency_key = $1', [idempotencyKey]);
      if (dbCheck.rows && dbCheck.rows.length > 0) {
        const row = dbCheck.rows[0];
        if (row.status === 'APPROVED') {
          console.log(`[PAYMENT IDEMPOTENCY DB] Pagamento ${paymentId} já processado no PostgreSQL.`);
          return {
            success: true,
            isDuplicate: true,
            orderId: row.order_id,
            newStatus: row.status,
          };
        }
      }
    } catch {
      // ignora erro de conexão DB e prossegue
    }

    // 2. Busca os dados reais do pagamento no Mercado Pago ou usa dados do mock
    // Em produção: const mpPayment = await mercadopago.payment.get({ id: paymentId });
    const paymentData = mockPayload || {
      orderId: 'ord-demo-01',
      orderCode: 'OBZ-8899-LUA',
      amount: 149.90,
      status: 'approved' as const,
      dropshipPayload: undefined,
    };

    const isApproved = paymentData.status === 'approved';
    const finalPaymentStatus = isApproved ? 'APPROVED' : 'REJECTED';
    const finalOrderStatus = isApproved ? 'PAID' : 'CANCELLED';

    // 3. Persistência do pagamento e marcação de idempotência
    const paymentRecord = {
      gatewayPaymentId: paymentId,
      idempotencyKey,
      orderId: paymentData.orderId,
      orderCode: paymentData.orderCode,
      amount: paymentData.amount,
      currency: 'BRL',
      status: finalPaymentStatus,
      processedAt: new Date().toISOString(),
    };

    memoryStore.payments.set(idempotencyKey, paymentRecord);

    try {
      await query(
        `INSERT INTO payments (gateway_payment_id, idempotency_key, order_id, amount, currency, status, processed_at)
         VALUES ($1, $2, $3, $4, 'BRL', $5, CURRENT_TIMESTAMP)
         ON CONFLICT (idempotency_key) DO UPDATE SET status = EXCLUDED.status, processed_at = CURRENT_TIMESTAMP`,
        [paymentId, idempotencyKey, paymentData.orderId, paymentData.amount, finalPaymentStatus]
      );

      await query(
        `UPDATE orders SET payment_status = $1, order_status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
        [finalPaymentStatus, finalOrderStatus, paymentData.orderId]
      );
    } catch {
      // Memory store already set
    }

    await recordAuditLog({
      eventType: 'PAYMENT_PROCESSED',
      targetEntity: 'order',
      targetId: paymentData.orderId,
      newValue: {
        paymentId,
        idempotencyKey,
        amount: paymentData.amount,
        status: finalPaymentStatus,
        orderStatus: finalOrderStatus,
      },
    });

    // 4. Se o pagamento foi aprovado e o pedido possui dropshipping, inicia despacho automático
    if (isApproved && paymentData.dropshipPayload) {
      paymentData.dropshipPayload.paymentStatus = 'PAID';
      await DropshippingService.processDropshippingOrder(paymentData.dropshipPayload);
    }

    return {
      success: true,
      isDuplicate: false,
      orderId: paymentData.orderId,
      orderCode: paymentData.orderCode,
      newStatus: finalOrderStatus,
    };
  }
}
