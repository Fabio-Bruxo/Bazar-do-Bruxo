import { NextResponse } from 'next/server';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import { memoryStore, recordAuditLog } from '@/lib/db';
import { Product } from '@/types';

let isProductsSeeded = true;

function getLiveProducts(): Product[] {
  return Array.from(memoryStore.products.values());
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const intention = searchParams.get('intention');
  const query = searchParams.get('q');

  let results = getLiveProducts();

  if (category) {
    results = results.filter((p) => p.categorySlug === category || p.category.toLowerCase() === category.toLowerCase());
  }

  if (intention) {
    results = results.filter((p) => p.intentions.includes(intention as any));
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    total: results.length,
    products: results,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const products = getLiveProducts();

    const newId = body.id || `prod-${Date.now()}`;
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      id: newId,
      slug,
      name: body.name || 'Novo Item Místico',
      subtitle: body.subtitle || 'Instrumento sagrado para seus rituais',
      price: Number(body.price) || 0,
      promotionalPrice: body.promotionalPrice ? Number(body.promotionalPrice) : undefined,
      costPrice: Number(body.costPrice) || 0,
      minAllowedPrice: Number(body.minAllowedPrice) || Number(body.costPrice) || 0,
      pixDiscountPercent: body.pixDiscountPercent ?? 5,
      maxInstallments: body.maxInstallments ?? 6,
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [
        'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000&auto=format&fit=crop'
      ],
      category: body.category || 'Cristais & Minerais',
      categorySlug: body.categorySlug || 'cristais',
      intentions: Array.isArray(body.intentions) ? body.intentions : ['calma'],
      stock: Number(body.stock) || 1,
      isAvailable: body.isAvailable ?? true,
      type: body.type || 'proprio',
      commercialStatus: body.commercialStatus || 'ativo',
      description: {
        whatIs: body.description?.whatIs || body.name,
        whyItCalledYou: body.description?.whyItCalledYou || 'Sentiu o chamado das energias sutis.',
        symbolism: body.description?.symbolism || 'Elemento ritualístico tradicional de contemplação.',
        howToUse: body.description?.howToUse || 'Posicione em seu espaço de quietude ou altar.',
      },
      details: body.details || {
        origin: 'Brasil',
        material: 'Natural',
        dimensions: 'Peça selecionada',
        weight: 'Aprox. 200g',
        care: 'Limpar com pano macio e seco.',
      },
      sku: body.sku || `SKU-${Date.now().toString().slice(-6)}`,
      relatedProductIds: Array.isArray(body.relatedProductIds) ? body.relatedProductIds : [],
      upsellProductIds: Array.isArray(body.upsellProductIds) ? body.upsellProductIds : [],
      crossSellProductIds: Array.isArray(body.crossSellProductIds) ? body.crossSellProductIds : [],
      seoTitle: body.seoTitle || (body.name ? `${body.name} | O Bazar do Bruxo` : 'O Bazar do Bruxo'),
      seoDescription: body.seoDescription || body.subtitle || body.name || 'Instrumento místico e ritualístico.',
      rating: body.rating || 5.0,
      reviewCount: body.reviewCount || 1,
    };

    memoryStore.products.set(newId, newProduct);

    await recordAuditLog({
      userId: body.adminEmail || 'admin-fabinho',
      eventType: 'PRODUCT_CREATED',
      targetEntity: 'product',
      targetId: newId,
      newValue: newProduct,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    getLiveProducts();
    const existing = memoryStore.products.get(id);

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = { ...existing, ...updates };
    memoryStore.products.set(id, updatedProduct);

    await recordAuditLog({
      userId: body.adminEmail || 'admin-fabinho',
      eventType: 'PRODUCT_UPDATED',
      targetEntity: 'product',
      targetId: id,
      previousValue: existing,
      newValue: updatedProduct,
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const ids = searchParams.get('ids');
    const all = searchParams.get('all');

    if (all === 'true') {
      const prevCount = memoryStore.products.size;
      memoryStore.products.clear();
      await recordAuditLog({
        userId: 'admin-fabinho',
        eventType: 'ALL_PRODUCTS_CLEARED',
        targetEntity: 'catalog',
        targetId: 'all',
        previousValue: { count: prevCount },
      });
      return NextResponse.json({ success: true, count: 0, message: 'Todos os produtos foram removidos com sucesso.' });
    }

    if (!id && !ids) {
      return NextResponse.json({ success: false, error: 'Product ID or IDs required' }, { status: 400 });
    }

    getLiveProducts();

    if (ids) {
      const idList = ids.split(',').map((s) => s.trim()).filter(Boolean);
      for (const targetId of idList) {
        memoryStore.products.delete(targetId);
      }
      return NextResponse.json({ success: true, count: idList.length });
    }

    const existing = memoryStore.products.get(id!);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    memoryStore.products.delete(id!);

    await recordAuditLog({
      userId: 'admin-fabinho',
      eventType: 'PRODUCT_DELETED',
      targetEntity: 'product',
      targetId: id!,
      previousValue: existing,
    });

    return NextResponse.json({ success: true, message: 'Produto removido com sucesso.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
