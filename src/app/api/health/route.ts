import { NextResponse } from 'next/server';
import { isDbConnected } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export async function GET() {
  const dbStatus = isDbConnected || isSupabaseConfigured() ? 'VERDE' : 'AMARELO';
  const paymentStatus = process.env.MERCADOPAGO_ACCESS_TOKEN ? 'VERDE' : 'AMARELO';
  const whatsappStatus = 'VERDE'; // Motor determinístico sem IA sempre operacional
  const automationStatus = 'VERDE';

  const overall = (dbStatus === 'VERDE' && paymentStatus === 'VERDE') ? 'VERDE' : 'AMARELO';

  return NextResponse.json({
    status: overall,
    timestamp: new Date().toISOString(),
    system: 'O Bazar do Bruxo',
    services: {
      database: dbStatus,
      payment: paymentStatus,
      whatsapp: whatsappStatus,
      automation: automationStatus,
      suppliers: 'VERDE',
    },
    version: '1.0.0-canonical',
  });
}
