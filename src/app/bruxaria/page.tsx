import React from 'react';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import CatalogView from '@/components/CatalogView';

export const metadata = {
  title: 'Bruxaria Natural & Alquimia | O Bazar do Bruxo',
  description: 'Caldeirões de ferro fundido, pêndulos facetados, espelhos de obsidiana e kits alquímicos.',
};

export default function BruxariaPage() {
  const products = ALL_INITIAL_PRODUCTS.filter(
    (p) => p.categorySlug === 'bruxaria' || p.category === 'Bruxaria' || p.name.includes('Pêndulo') || p.name.includes('Caldeirão') || p.name.includes('Kit Bruxo')
  );

  return (
    <CatalogView
      title="BRUXARIA NATURAL"
      subtitle="O contato respeitoso com os ciclos naturais, as estações da terra e a alquimia cotidiana."
      initialProducts={products}
      currentCategorySlug="bruxaria"
    />
  );
}
