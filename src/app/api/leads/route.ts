import { NextResponse } from 'next/server';
import { INITIAL_LEADS } from '@/data/db';
import { Lead } from '@/types';

export async function GET() {
  return NextResponse.json({
    leads: INITIAL_LEADS,
  });
}

export async function POST(request: Request) {
  try {
    const body: Partial<Lead> = await request.json();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: body.name || 'Viajante',
      email: body.email || '',
      preference: body.preference || 'Geral',
      source: body.source || 'newsletter',
      quizResult: body.quizResult,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      lead: newLead,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Erro ao registrar lead' }, { status: 400 });
  }
}
