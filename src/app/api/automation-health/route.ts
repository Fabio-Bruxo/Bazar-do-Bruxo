import { NextResponse } from 'next/server';

export async function GET() {
  const hasN8n = Boolean(process.env.N8N_WEBHOOK_URL);

  return NextResponse.json({
    status: 'VERDE',
    service: 'automation_watchdog',
    n8nConfigured: hasN8n,
    watchdogRules: [
      'stuck_orders_monitor',
      'failed_webhook_retry',
      'unresponsive_supplier_alert',
      'silenced_bot_reminder',
    ],
    timestamp: new Date().toISOString(),
  });
}
