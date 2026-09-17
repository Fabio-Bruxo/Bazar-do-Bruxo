import { NextRequest, NextResponse } from 'next/server';
import { memoryStore, recordAuditLog, query } from '@/lib/db';

export async function GET() {
  try {
    const realExceptions: any[] = [];

    // 1. Verificar pedidos retidos em MANUAL_REVIEW na memória ou banco
    const ordersArray = Array.from(memoryStore.orders.values());
    ordersArray.forEach((order: any) => {
      if (order.orderStatus === 'MANUAL_REVIEW' || order.order_status === 'MANUAL_REVIEW' || order.paymentStatus === 'MANUAL_REVIEW') {
        realExceptions.push({
          id: `exc-order-${order.id}`,
          orderId: order.id,
          orderCode: order.code || order.order_code || `OBZ-${order.id.slice(0, 8)}`,
          type: order.validationErrors?.includes('margem') ? 'MARGIN_VIOLATION' : (order.validationErrors?.includes('endereço') ? 'INCOMPLETE_ADDRESS' : 'PAYMENT_MISMATCH'),
          severity: order.orderStatus === 'MANUAL_REVIEW' ? 'URGENT' : 'HIGH',
          description: order.validationErrors || order.statusNotes || 'Pedido aguardando validação manual de integridade.',
          customerName: order.customer?.name || order.customer_name || 'Cliente',
          customerPhone: order.customer?.phone || order.customer_phone || '',
          amount: Number(order.total || order.total_amount || 0),
          date: new Date(order.createdAt || order.created_at || Date.now()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'PENDING',
        });
      }
    });

    // 2. Verificar tickets críticos de suporte humano abertos
    memoryStore.tickets.forEach((ticket: any) => {
      if (ticket.status === 'OPEN' && (ticket.priority === 'URGENT' || ticket.priority === 'HIGH')) {
        realExceptions.push({
          id: `exc-ticket-${ticket.id}`,
          ticketId: ticket.id,
          orderCode: ticket.orderCode || 'ATENDIMENTO',
          type: 'SUPPLIER_OFFLINE',
          severity: ticket.priority,
          description: ticket.reason || 'Solicitação de suporte humano urgente aberta pelo cliente.',
          customerName: ticket.customerName || 'Cliente em Espera',
          customerPhone: ticket.customerPhone || '',
          amount: 0,
          date: new Date(ticket.createdAt || Date.now()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'PENDING',
        });
      }
    });

    return NextResponse.json({
      success: true,
      total: realExceptions.length,
      exceptions: realExceptions,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { exceptionId, action, reason } = body;

    if (!exceptionId || !action) {
      return NextResponse.json({ error: 'Parâmetros insuficientes' }, { status: 400 });
    }

    if (exceptionId.startsWith('exc-order-')) {
      const orderId = exceptionId.replace('exc-order-', '');
      const order = memoryStore.orders.get(orderId);
      if (order) {
        if (action === 'RELEASE') {
          order.orderStatus = 'PROCESSING';
          order.statusNotes = 'Liberado manualmente pelo administrador via Central de Exceções.';
        } else if (action === 'CANCEL') {
          order.orderStatus = 'CANCELLED';
          order.statusNotes = reason || 'Cancelado pelo administrador via Central de Exceções.';
        }
      }
    }

    if (exceptionId.startsWith('exc-ticket-')) {
      const ticketId = exceptionId.replace('exc-ticket-', '');
      const ticket = memoryStore.tickets.find((t: any) => t.id === ticketId);
      if (ticket) {
        ticket.status = 'RESOLVED';
        ticket.resolvedAt = new Date().toISOString();
      }
    }

    await recordAuditLog({
      userId: 'fabinhojr6336@gmail.com',
      eventType: 'EXCEPTION_RESOLVED',
      targetEntity: 'exception',
      targetId: exceptionId,
      details: { action, reason },
    });

    return NextResponse.json({ success: true, action });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
