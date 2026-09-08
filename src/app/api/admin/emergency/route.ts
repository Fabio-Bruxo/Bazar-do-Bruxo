import { NextRequest, NextResponse } from 'next/server';
import { getSystemSetting, setSystemSetting, recordAuditLog } from '@/lib/db';

export async function GET() {
  const botEnabled = await getSystemSetting<boolean>('BOT_ENABLED', true);
  const salesEnabled = await getSystemSetting<boolean>('AUTOMATIC_SALES_ENABLED', true);
  const dropshipEnabled = await getSystemSetting<boolean>('DROPSHIPPING_DISPATCH_ENABLED', true);

  return NextResponse.json({
    BOT_ENABLED: botEnabled,
    AUTOMATIC_SALES_ENABLED: salesEnabled,
    DROPSHIPPING_DISPATCH_ENABLED: dropshipEnabled,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value, adminId } = body;

    const allowedKeys = ['BOT_ENABLED', 'AUTOMATIC_SALES_ENABLED', 'DROPSHIPPING_DISPATCH_ENABLED'];
    if (!allowedKeys.includes(key)) {
      return NextResponse.json({ error: 'Invalid emergency setting key' }, { status: 400 });
    }

    const previousValue = await getSystemSetting<boolean>(key, true);
    await setSystemSetting(key, Boolean(value), `Controle de emergência alterado por admin`);

    await recordAuditLog({
      userId: adminId || 'admin-master',
      eventType: 'EMERGENCY_CONTROL_TOGGLED',
      targetEntity: 'system_settings',
      targetId: key,
      previousValue: { [key]: previousValue },
      newValue: { [key]: value },
    });

    return NextResponse.json({
      success: true,
      key,
      value: Boolean(value),
      previousValue,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
