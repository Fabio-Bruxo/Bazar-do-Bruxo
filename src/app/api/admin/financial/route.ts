import { NextResponse } from 'next/server';
import { FinancialLedgerService } from '@/services/financialLedgerService';
import { memoryStore } from '@/lib/db';

export async function GET() {
  try {
    const summary = await FinancialLedgerService.getLedgerSummary();
    const entries = memoryStore.financialLedger.slice(0, 50);

    return NextResponse.json({
      success: true,
      summary,
      entries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Falha ao obter dados da Central Financeira: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || 'reconcile';

    if (action === 'reconcile') {
      const report = await FinancialLedgerService.reconcileOrdersWithLedger();
      return NextResponse.json({
        success: true,
        report,
      });
    }

    return NextResponse.json({ success: false, error: 'Ação não reconhecida' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erro ao executar operação financeira: ' + error.message },
      { status: 500 }
    );
  }
}
