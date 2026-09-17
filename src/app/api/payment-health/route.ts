import { NextResponse } from 'next/server';

export async function GET() {
  const hasToken = Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
  const isProd = process.env.NODE_ENV === 'production';
  const hasWebhookSecret = Boolean(process.env.MERCADOPAGO_WEBHOOK_SECRET);

  const status = hasToken ? 'VERDE' : 'AMARELO';

  return NextResponse.json({
    status,
    service: 'mercadopago_payments',
    environment: isProd ? 'PRODUCTION' : 'TEST',
    configured: hasToken,
    webhookSignatureEnabled: hasWebhookSecret,
    splitMarketplaceReady: true,
    timestamp: new Date().toISOString(),
  });
}
