import React from 'react';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import CatalogView from '@/components/CatalogView';

export const metadata = {
  title: 'Ervas & Natureza Sagrada | O Bazar do Bruxo',
  description: 'Botânica mística, resinas florestais e elementos orgânicos para conexão com a terra.',
};

export default function ErvasNaturezaPage() {
  const products = ALL_INITIAL_PRODUCTS.filter(
    (p) => p.intentions.includes('natureza') || p.categorySlug === 'ervas-natureza' || p.name.includes('Lavanda') || p.name.includes('Sândalo')
  );

  return (
    <CatalogView
      title="ERVAS & NATUREZA"
      subtitle="A sabedoria silenciosa do reino vegetal: resinas, flores desidratadas e elementos da terra."
      initialProducts={products.length > 0 ? products : ALL_INITIAL_PRODUCTS.slice(0, 6)}
      currentCategorySlug="ervas-natureza"
    />
  );
}
