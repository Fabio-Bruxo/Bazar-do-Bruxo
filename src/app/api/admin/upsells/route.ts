import { NextRequest, NextResponse } from 'next/server';
import { memoryStore, recordAuditLog } from '@/lib/db';

export interface UpsellRule {
  id: string;
  name: string;
  type: 'ORDER_BUMP' | 'POST_PURCHASE' | 'CROSS_SELL';
  triggerCategory?: string;
  triggerProductId?: string;
  offerProductId: string;
  offerProductName: string;
  offerPrice: number;
  originalPrice: number;
  discountPercent: number;
  headline: string;
  description: string;
  active: boolean;
  impressions: number;
  conversions: number;
  createdAt: string;
}

if (!(memoryStore as any).upsellRules) {
  (memoryStore as any).upsellRules = [] as UpsellRule[];
}

export async function GET() {
  try {
    const rules: UpsellRule[] = (memoryStore as any).upsellRules || [];
    return NextResponse.json({
      success: true,
      total: rules.length,
      rules,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      type,
      triggerCategory,
      triggerProductId,
      offerProductId,
      offerProductName,
      offerPrice,
      originalPrice,
      discountPercent,
      headline,
      description,
    } = body;

    if (!name || !offerProductName || !offerPrice) {
      return NextResponse.json({ error: 'Dados essenciais de oferta incompletos' }, { status: 400 });
    }

    const newRule: UpsellRule = {
      id: `upsell-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      type: type || 'ORDER_BUMP',
      triggerCategory: triggerCategory || 'all',
      triggerProductId: triggerProductId || undefined,
      offerProductId: offerProductId || `prod-custom-${Date.now()}`,
      offerProductName,
      offerPrice: Number(offerPrice),
      originalPrice: Number(originalPrice) || Number(offerPrice),
      discountPercent: Number(discountPercent) || 0,
      headline: headline || 'Quer completar seu ritual com esta oferta exclusiva?',
      description: description || 'Oferta especial disponível apenas nesta etapa do pedido.',
      active: true,
      impressions: 0,
      conversions: 0,
      createdAt: new Date().toISOString(),
    };

    if (!(memoryStore as any).upsellRules) {
      (memoryStore as any).upsellRules = [];
    }
    (memoryStore as any).upsellRules.push(newRule);

    await recordAuditLog({
      userId: 'fabinhojr6336@gmail.com',
      eventType: 'UPSELL_RULE_CREATED',
      targetEntity: 'upsell_rule',
      targetId: newRule.id,
      newValue: newRule,
    });

    return NextResponse.json({ success: true, rule: newRule }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;

    const rules: UpsellRule[] = (memoryStore as any).upsellRules || [];
    const rule = rules.find((r) => r.id === id);

    if (!rule) {
      return NextResponse.json({ error: 'Regra não encontrada' }, { status: 404 });
    }

    if (action === 'TOGGLE_ACTIVE') {
      rule.active = !rule.active;
    }

    await recordAuditLog({
      userId: 'fabinhojr6336@gmail.com',
      eventType: 'UPSELL_RULE_UPDATED',
      targetEntity: 'upsell_rule',
      targetId: id,
      newValue: rule,
    });

    return NextResponse.json({ success: true, rule });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const rules: UpsellRule[] = (memoryStore as any).upsellRules || [];
    const index = rules.findIndex((r) => r.id === id);

    if (index !== -1) {
      rules.splice(index, 1);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
