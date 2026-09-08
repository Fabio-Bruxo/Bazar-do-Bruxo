import { NextRequest, NextResponse } from 'next/server';
import { memoryStore, recordAuditLog } from '@/lib/db';
import { GuardiaoEngine } from '@/services/bot/guardiao_engine';

export async function GET() {
  return NextResponse.json({
    tickets: memoryStore.tickets,
    conversations: Array.from(memoryStore.conversations.values()),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ticketId, phone, notes } = body;

    if (action === 'RESUME_BOT' && phone) {
      const resumed = await GuardiaoEngine.resumeBotConversation(phone);
      return NextResponse.json({ success: resumed, message: 'Guardião reativado para este cliente.' });
    }

    if (action === 'RESOLVE_TICKET' && ticketId) {
      const ticket = memoryStore.tickets.find((t) => t.id === ticketId);
      if (ticket) {
        ticket.status = 'RESOLVED';
        ticket.resolutionNotes = notes || 'Resolvido pelo atendente humano.';
        ticket.resolvedAt = new Date().toISOString();

        await recordAuditLog({
          eventType: 'TICKET_RESOLVED',
          targetEntity: 'ticket',
          targetId: ticketId,
          newValue: { status: 'RESOLVED', notes },
        });

        if (phone) {
          await GuardiaoEngine.resumeBotConversation(phone);
        }

        return NextResponse.json({ success: true, ticket });
      }
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
