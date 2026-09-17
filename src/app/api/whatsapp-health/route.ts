import { NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';

export async function GET() {
  const isBotEnabled = memoryStore.systemSettings.get('BOT_ENABLED') ?? true;
  const whatsappNumber = memoryStore.systemSettings.get('HUMAN_SUPPORT_WHATSAPP') || '5513998039867';
  const openTickets = memoryStore.tickets.filter((t: any) => t.status === 'OPEN').length;

  return NextResponse.json({
    status: isBotEnabled ? 'VERDE' : 'AMARELO',
    service: 'whatsapp_guardiao',
    engine: 'DETERMINISTIC_RULE_BASED (No Paid AI)',
    botEnabled: isBotEnabled,
    supportNumber: whatsappNumber,
    activeConversationsCount: memoryStore.conversations.size,
    openHumanTicketsCount: openTickets,
    timestamp: new Date().toISOString(),
  });
}
