import { NextRequest, NextResponse } from 'next/server';
import { memoryStore, recordAuditLog, query } from '@/lib/db';

export interface SupplierData {
  id: string;
  name: string;
  document: string; // CNPJ ou CPF
  email: string;
  whatsapp: string;
  contactName?: string;
  shippingTimeDays: number;
  shippingCostBase: number;
  marketplaceFeePercent: number;
  mpConnected: boolean;
  mpUserId?: string;
  mpTokenExpiresAt?: string;
  status: 'ACTIVE' | 'PAUSED' | 'REVIEW';
  createdAt: string;
}

// Iniciar com lista vazia (zero fictício)
if (!(memoryStore as any).suppliersList) {
  (memoryStore as any).suppliersList = [] as SupplierData[];
}

export async function GET() {
  try {
    const suppliers: SupplierData[] = (memoryStore as any).suppliersList || [];
    return NextResponse.json({
      success: true,
      total: suppliers.length,
      suppliers,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, document, email, whatsapp, contactName, shippingTimeDays, shippingCostBase, marketplaceFeePercent } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e E-mail são obrigatórios' }, { status: 400 });
    }

    const newSupplier: SupplierData = {
      id: `supp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      document: document || '',
      email,
      whatsapp: whatsapp || '',
      contactName: contactName || '',
      shippingTimeDays: Number(shippingTimeDays) || 3,
      shippingCostBase: Number(shippingCostBase) || 15.00,
      marketplaceFeePercent: Number(marketplaceFeePercent) || 12.00,
      mpConnected: false,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    if (!(memoryStore as any).suppliersList) {
      (memoryStore as any).suppliersList = [];
    }
    (memoryStore as any).suppliersList.push(newSupplier);

    await recordAuditLog({
      userId: 'fabinhojr6336@gmail.com',
      eventType: 'SUPPLIER_CREATED',
      targetEntity: 'supplier',
      targetId: newSupplier.id,
      newValue: newSupplier,
    });

    return NextResponse.json({ success: true, supplier: newSupplier }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, ...updates } = body;

    const suppliers: SupplierData[] = (memoryStore as any).suppliersList || [];
    const supp = suppliers.find((s) => s.id === id);

    if (!supp) {
      return NextResponse.json({ error: 'Fornecedor não encontrado' }, { status: 404 });
    }

    if (action === 'TOGGLE_STATUS') {
      supp.status = supp.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    } else if (action === 'SIMULATE_OAUTH') {
      supp.mpConnected = !supp.mpConnected;
      supp.mpUserId = supp.mpConnected ? `MP-USER-${Date.now()}` : undefined;
    } else {
      Object.assign(supp, updates);
    }

    await recordAuditLog({
      userId: 'fabinhojr6336@gmail.com',
      eventType: 'SUPPLIER_UPDATED',
      targetEntity: 'supplier',
      targetId: id,
      newValue: supp,
    });

    return NextResponse.json({ success: true, supplier: supp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
