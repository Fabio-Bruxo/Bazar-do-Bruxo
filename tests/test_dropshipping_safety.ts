import { DropshippingService, DropshipOrderPayload } from '../src/services/dropshippingService';

export async function testDropshippingSafety(): Promise<boolean> {
  console.log('\n--- [TEST] 2. TRAVAS DE SEGURANÇA DROPSHIPPING ---');

  // Caso 1: Pedido ainda não pago (PENDING) -> Deve ser rejeitado
  const unpaidOrder: DropshipOrderPayload = {
    orderId: 'ord-unpaid',
    orderCode: 'OBZ-UNPAID',
    paymentStatus: 'PENDING',
    customer: {
      name: 'Cliente Teste',
      email: 'teste@demo.com',
      phone: '11999998888',
      address: {
        street: 'Rua das Bruxas',
        number: '13',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000',
      },
    },
    items: [
      {
        productId: 'prod-07',
        sku: 'RIT-CAL-007',
        productName: 'Caldeirão Ferro',
        quantity: 1,
        salePrice: 129.90,
        expectedCost: 48.00,
        minAllowedPrice: 85.00,
        supplierId: 'supp-01',
        supplierSku: 'MM-CAL-500',
      },
    ],
  };

  const resUnpaid = await DropshippingService.processDropshippingOrder(unpaidOrder);
  console.log('Caso 1 (Pedido Não Pago):', resUnpaid.action);
  if (resUnpaid.action !== 'REJECTED') {
    console.error('❌ Falha: Pedido não pago foi aceito para despacho!');
    return false;
  }

  // Caso 2: Endereço incompleto (sem CEP e sem número) -> Deve ir para MANUAL_REVIEW
  const badAddressOrder: DropshipOrderPayload = {
    ...unpaidOrder,
    orderId: 'ord-bad-addr',
    orderCode: 'OBZ-BAD-ADDR',
    paymentStatus: 'PAID',
    customer: {
      ...unpaidOrder.customer,
      address: {
        street: 'Avenida Mágica',
        // Sem número, sem bairro, sem CEP
      },
    },
  };

  const resBadAddr = await DropshippingService.processDropshippingOrder(badAddressOrder);
  console.log('Caso 2 (Endereço Incompleto):', resBadAddr.action, '-', resBadAddr.reason);
  if (resBadAddr.action !== 'MANUAL_REVIEW') {
    console.error('❌ Falha: Endereço incompleto não foi enviado para MANUAL_REVIEW!');
    return false;
  }

  // Caso 3: Violação de margem de lucro mínima -> Deve ir para MANUAL_REVIEW
  const marginViolationOrder: DropshipOrderPayload = {
    ...unpaidOrder,
    orderId: 'ord-bad-margin',
    orderCode: 'OBZ-BAD-MARGIN',
    paymentStatus: 'PAID',
    items: [
      {
        ...unpaidOrder.items[0],
        salePrice: 40.00, // Menor que o mínimo de R$ 85,00 e menor que o custo de R$ 48,00
      },
    ],
  };

  const resMargin = await DropshippingService.processDropshippingOrder(marginViolationOrder);
  console.log('Caso 3 (Violação de Margem):', resMargin.action, '-', resMargin.reason);
  if (resMargin.action !== 'MANUAL_REVIEW') {
    console.error('❌ Falha: Preço abaixo da margem mínima não foi travado!');
    return false;
  }

  // Caso 4: Pedido 100% válido e pago -> Deve despachar com sucesso
  const validOrder: DropshipOrderPayload = {
    ...unpaidOrder,
    orderId: 'ord-valid',
    orderCode: 'OBZ-VALID-001',
    paymentStatus: 'PAID',
  };

  const resValid = await DropshippingService.processDropshippingOrder(validOrder);
  console.log('Caso 4 (Pedido Válido):', resValid.action, '- ID Fornecedor:', resValid.supplierOrderId);
  if (resValid.action !== 'DISPATCHED' || !resValid.supplierOrderId) {
    console.error('❌ Falha: Pedido válido não foi despachado ao fornecedor!');
    return false;
  }

  console.log('✅ TESTE DE SEGURANÇA DROPSHIPPING: APROVADO COM SUCESSO!');
  return true;
}
