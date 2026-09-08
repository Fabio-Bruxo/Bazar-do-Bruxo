import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/paymentService';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-signature');
    const requestId = req.headers.get('x-request-id');

    const body = await req.json();

    // Mercado Pago envia o objeto com { type: 'payment', data: { id: '...' } } ou query param
    const paymentId = body?.data?.id || req.nextUrl.searchParams.get('data.id') || req.nextUrl.searchParams.get('id');

    if (!paymentId) {
      return NextResponse.json({ message: 'No payment ID found in webhook payload' }, { status: 200 });
    }

    // Validação da assinatura criptográfica
    const isSignatureValid = PaymentService.verifyWebhookSignature(signature, requestId, String(paymentId));
    if (!isSignatureValid) {
      console.warn('[WEBHOOK MERCADOPAGO] Assinatura inválida para o pagamento:', paymentId);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Processamento idempotente do pagamento
    const result = await PaymentService.processPaymentNotification(String(paymentId));

    return NextResponse.json({
      received: true,
      processed: result.success,
      isDuplicate: result.isDuplicate,
      orderCode: result.orderCode,
      status: result.newStatus,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[WEBHOOK MERCADOPAGO EXCEPTION]', error);
    // Sempre retornar 200 para evitar que o gateway entre em loop infinito de retentativas se o erro for de payload
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}
