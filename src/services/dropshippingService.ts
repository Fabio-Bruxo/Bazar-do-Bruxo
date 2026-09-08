import { getSystemSetting, recordAuditLog, memoryStore, query } from '@/lib/db';

export interface DropshipOrderItem {
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  salePrice: number;
  expectedCost: number;
  minAllowedPrice: number;
  supplierId: string;
  supplierSku: string;
}

export interface CustomerAddress {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface DropshipOrderPayload {
  orderId: string;
  orderCode: string;
  paymentStatus: 'PAID' | 'PENDING' | 'REJECTED' | 'REFUNDED';
  customer: {
    name: string;
    email: string;
    phone: string;
    document?: string;
    address: CustomerAddress;
  };
  items: DropshipOrderItem[];
}

export interface DropshipValidationResult {
  success: boolean;
  action: 'DISPATCHED' | 'MANUAL_REVIEW' | 'REJECTED';
  reason?: string;
  supplierOrderId?: string;
  details?: Record<string, any>;
}

export class DropshippingService {
  /**
   * Valida e executa o despacho para o fornecedor respeitando as regras estritas de segurança.
   */
  public static async processDropshippingOrder(payload: DropshipOrderPayload): Promise<DropshipValidationResult> {
    const isDispatchGloballyEnabled = await getSystemSetting<boolean>('DROPSHIPPING_DISPATCH_ENABLED', true);

    // 1. Verificação do Botão de Emergência Global
    if (!isDispatchGloballyEnabled) {
      const reason = 'Envio automático a fornecedores temporariamente PAUSADO pela administração.';
      await this.flagManualReview(payload.orderId, payload.orderCode, reason, 'HIGH');
      return {
        success: false,
        action: 'MANUAL_REVIEW',
        reason,
      };
    }

    // 2. Trava Financeira: Pagamento precisa estar 100% confirmado (PAID)
    if (payload.paymentStatus !== 'PAID') {
      const reason = `Pagamento do pedido ${payload.orderCode} não está aprovado (status: ${payload.paymentStatus}). Despacho bloqueado.`;
      return {
        success: false,
        action: 'REJECTED',
        reason,
      };
    }

    // 3. Validação do Endereço de Entrega
    const addr = payload.customer.address;
    if (!addr || !addr.street || !addr.number || !addr.neighborhood || !addr.city || !addr.state || !addr.zipCode) {
      const reason = `Endereço de entrega incompleto para o pedido ${payload.orderCode}. Faltam dados essenciais para etiquetagem.`;
      await this.flagManualReview(payload.orderId, payload.orderCode, reason, 'URGENT', { address: addr });
      return {
        success: false,
        action: 'MANUAL_REVIEW',
        reason,
      };
    }

    // 4. Validação de cada item, fornecedor e custo
    for (const item of payload.items) {
      // Mock de verificação de fornecedor e custo
      // Em produção, consulta a tabela suppliers e supplier_products
      const supplierCost = item.expectedCost; // Simulado
      const margin = item.salePrice - supplierCost;

      if (item.salePrice < item.minAllowedPrice || margin <= 0) {
        const reason = `Margem de lucro violada no item ${item.productName} (SKU: ${item.sku}). Venda: R$ ${item.salePrice}, Custo: R$ ${supplierCost}.`;
        await this.flagManualReview(payload.orderId, payload.orderCode, reason, 'URGENT', { item });
        return {
          success: false,
          action: 'MANUAL_REVIEW',
          reason,
        };
      }
    }

    // 5. Encaminhamento aprovado com sucesso
    const supplierOrderId = `SUPP-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    await recordAuditLog({
      eventType: 'DROPSHIP_DISPATCHED',
      targetEntity: 'order',
      targetId: payload.orderId,
      newValue: {
        orderCode: payload.orderCode,
        supplierOrderId,
        itemCount: payload.items.length,
        dispatchedAt: new Date().toISOString(),
      },
    });

    return {
      success: true,
      action: 'DISPATCHED',
      supplierOrderId,
      details: {
        estimatedDeliveryDays: 5,
        carrier: 'CORREIOS',
      },
    };
  }

  /**
   * Registra um pedido para revisão manual humana e abre ticket prioritário
   */
  private static async flagManualReview(
    orderId: string,
    orderCode: string,
    reason: string,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    details?: any
  ) {
    const ticket = {
      id: `ticket-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId,
      orderCode,
      reason,
      priority,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      details,
    };

    memoryStore.tickets.unshift(ticket);

    await recordAuditLog({
      eventType: 'DROPSHIP_FLAGGED_MANUAL_REVIEW',
      targetEntity: 'order',
      targetId: orderId,
      newValue: { orderCode, reason, priority, details },
    });

    try {
      await query(
        `INSERT INTO human_tickets (order_id, reason, priority, status)
         VALUES ($1, $2, $3, 'OPEN')`,
        [orderId, reason, priority]
      );
    } catch {
      // Memory store already updated
    }
  }
}
