import React from 'react';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import CatalogView from '@/components/CatalogView';

export const metadata = {
  title: 'Incensos Naturais de Massala & Aromas | O Bazar do Bruxo',
  description: 'Incensos enrolados à mão, massala pura sem pólvora, velas botânicas de cera de soja e resinas nobres.',
};

export default function IncensosAromasPage() {
  const products = ALL_INITIAL_PRODUCTS.filter(
    (p) => p.categorySlug === 'incensos-aromas' || p.category.includes('Incenso') || p.category.includes('Aroma')
  );

  return (
    <CatalogView
      title="INCENSOS & AROMAS"
      subtitle="Fumaças sagradas, velas botânicas de soja e aromas que desaceleram os sentidos e purificam a atmosfera."
      initialProducts={products}
      currentCategorySlug="incensos-aromas"
    />
  );
}
