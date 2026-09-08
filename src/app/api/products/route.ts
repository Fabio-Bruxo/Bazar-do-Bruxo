import { NextResponse } from 'next/server';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const intention = searchParams.get('intention');
  const query = searchParams.get('q');

  let results = [...ALL_INITIAL_PRODUCTS];

  if (category) {
    results = results.filter((p) => p.categorySlug === category);
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
