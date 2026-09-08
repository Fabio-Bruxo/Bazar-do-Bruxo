import { NextResponse } from 'next/server';
import { QUIZ_RESULTS } from '@/data/quiz';

export async function POST(request: Request) {
  try {
    const { answers } = await request.json();
    
    // Contagem de arquétipos
    const counts: Record<string, number> = {};
    Object.values(answers).forEach((arch: any) => {
      counts[arch] = (counts[arch] || 0) + 1;
    });

    let winner = 'ametista';
    let max = 0;
    Object.entries(counts).forEach(([arch, count]) => {
      if (count > max) {
        max = count;
        winner = arch;
      }
    });

    const result = QUIZ_RESULTS[winner] || QUIZ_RESULTS['ametista'];

    return NextResponse.json({
      success: true,
      archetype: winner,
      result,
      coupon: 'PRIMEIRORITUAL',
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Erro no cálculo do quiz' }, { status: 400 });
  }
}
