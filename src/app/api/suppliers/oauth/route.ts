import { NextResponse } from 'next/server';
import { recordAuditLog, memoryStore } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get('supplierId') || 'supp-default';
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // 1. Inicia fluxo de autorização OAuth Mercado Pago
  if (!code) {
    const appId = process.env.MERCADOPAGO_APP_ID || '1234567890';
    const redirectUri = encodeURIComponent(`${process.env.APP_URL || 'http://localhost:3000'}/api/suppliers/oauth`);
    const authUrl = `https://auth.mercadopago.com.br/authorization?client_id=${appId}&response_type=code&platform_id=mp&state=${supplierId}&redirect_uri=${redirectUri}`;

    return NextResponse.json({
      success: true,
      authUrl,
      supplierId,
      message: 'Redirecione o fornecedor para authUrl para vincular sua conta Mercado Pago ao Marketplace',
    });
  }

  // 2. Callback de autorização recebido com código
  try {
    const targetSupplier = state || supplierId;

    // Em produção: troca code por access_token e refresh_token via POST https://api.mercadopago.com/oauth/token
    const connectedSeller = {
      supplierId: targetSupplier,
      status: 'CONNECTED',
      connectedAt: new Date().toISOString(),
      mercadoPagoUserId: `MP-SELLER-${Date.now()}`,
    };

    memoryStore.supplierSettlements.unshift(connectedSeller);

    await recordAuditLog({
      userId: 'admin_oauth',
      eventType: 'SUPPLIER_OAUTH_CONNECTED',
      targetEntity: 'supplier',
      targetId: targetSupplier,
      newValue: { status: 'CONNECTED' },
    });

    return NextResponse.json({
      success: true,
      status: 'CONNECTED',
      message: `Conta Mercado Pago vinculada com sucesso ao fornecedor #${targetSupplier}`,
      seller: connectedSeller,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Falha na autorização OAuth: ' + err.message },
      { status: 500 }
    );
  }
}
