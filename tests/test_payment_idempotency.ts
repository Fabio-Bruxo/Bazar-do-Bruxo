import { PaymentService } from '../src/services/paymentService';
import { memoryStore } from '../src/lib/db';

export async function testPaymentIdempotency(): Promise<boolean> {
  console.log('\n--- [TEST] 1. IDEMPOTÊNCIA DE PAGAMENTO MERCADO PAGO ---');

  const testPaymentId = `TEST_PAY_${Date.now()}`;
  const mockPayload = {
    orderId: 'ord-test-01',
    orderCode: 'OBZ-TEST-001',
    amount: 179.80,
    status: 'approved' as const,
  };

  // 1ª Chamada do Webhook
  const firstRun = await PaymentService.processPaymentNotification(testPaymentId, mockPayload);
  console.log('1ª Execução:', firstRun);

  if (!firstRun.success || firstRun.isDuplicate) {
    console.error('❌ Falha na 1ª execução do webhook de pagamento.');
    return false;
  }

  // 2ª Chamada Idêntica do Webhook (Simulando retry do Mercado Pago ou clique duplo)
  const secondRun = await PaymentService.processPaymentNotification(testPaymentId, mockPayload);
  console.log('2ª Execução (Duplicada):', secondRun);

  if (!secondRun.success || !secondRun.isDuplicate) {
    console.error('❌ Falha na detecção de duplicidade idempotente.');
    return false;
  }

  console.log('✅ TESTE DE IDEMPOTÊNCIA: APROVADO COM SUCESSO!');
  return true;
}
