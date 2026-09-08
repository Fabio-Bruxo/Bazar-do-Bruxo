import { NextRequest, NextResponse } from 'next/server';
import { GuardiaoEngine } from '@/services/bot/guardiao_engine';

/**
 * Verificação do Webhook (compatível com Meta Cloud API e Evolution API)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'bazar_bruxo_token_2026';

  if (mode === 'subscribe' && token === expectedToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ status: 'OK', service: 'O Guardiao do Bazar Webhook' }, { status: 200 });
}

/**
 * Recepção de Mensagens Inbound (Evolution API / Meta Cloud API / Simulador)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let phone = '';
    let messageText = '';
    let senderName = '';

    // Formato 1: Evolution API
    if (body.event === 'messages.upsert' && body.data) {
      phone = body.data.key?.remoteJid?.split('@')[0] || '';
      messageText =
        body.data.message?.conversation ||
        body.data.message?.extendedTextMessage?.text ||
        '';
      senderName = body.data.pushName || '';
    }
    // Formato 2: Meta Cloud API
    else if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const msg = body.entry[0].changes[0].value.messages[0];
      phone = msg.from;
      messageText = msg.text?.body || '';
      senderName = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || '';
    }
    // Formato 3: Simulador Web Direto / Testes
    else if (body.phone && body.message) {
      phone = body.phone;
      messageText = body.message;
      senderName = body.customerName || 'Buscador';
    }

    if (!phone || !messageText) {
      return NextResponse.json({ error: 'No phone or message text in payload' }, { status: 400 });
    }

    // Processamento determinístico pelo Guardião do Bazar
    const result = await GuardiaoEngine.processMessage({
      phone,
      message: messageText,
      customerName: senderName,
    });

    return NextResponse.json({
      success: true,
      phone,
      reply: result.reply,
      mode: result.mode,
      silenced: result.silenced,
      intent: result.intent,
      ticketCreated: result.ticketCreated,
    });
  } catch (error: any) {
    console.error('[WHATSAPP WEBHOOK ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
