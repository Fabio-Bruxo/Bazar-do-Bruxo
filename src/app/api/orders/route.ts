import { NextResponse } from 'next/server';
import { INITIAL_ORDERS } from '@/data/db';
import { Order } from '@/types';

export async function GET() {
  return NextResponse.json({
    orders: INITIAL_ORDERS,
  });
}

export async function POST(request: Request) {
  try {
    const body: Order = await request.json();
    return NextResponse.json({
      success: true,
      order: body,
      message: 'Pedido registrado com sucesso no Bazar do Bruxo',
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Erro ao processar pedido' }, { status: 400 });
  }
}
