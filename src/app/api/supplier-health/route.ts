import { NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';

export async function GET() {
  const isDropshipEnabled = memoryStore.systemSettings.get('DROPSHIPPING_DISPATCH_ENABLED') ?? true;

  return NextResponse.json({
    status: isDropshipEnabled ? 'VERDE' : 'AMARELO',
    service: 'suppliers_dropshipping',
    dropshipDispatchEnabled: isDropshipEnabled,
    connectedSellersCount: memoryStore.supplierSettlements.length,
    safetyGuards: {
      paymentVerificationRequired: true,
      addressIntegrityCheck: true,
      marginViolationDetection: true,
    },
    timestamp: new Date().toISOString(),
  });
}
