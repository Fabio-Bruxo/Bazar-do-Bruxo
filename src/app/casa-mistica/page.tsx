import React from 'react';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import CatalogView from '@/components/CatalogView';

export const metadata = {
  title: 'Casa Mística & Decoração Sagrada | O Bazar do Bruxo',
  description: 'Incensários de cascata, árvores da vida em pedra natural e peças para transformar seu lar em um santuário.',
};

export default function CasaMisticaPage() {
  const products = ALL_INITIAL_PRODUCTS.filter(
    (p) => p.categorySlug === 'casa-mistica' || p.category === 'Casa Mística' || p.name.includes('Incensário') || p.name.includes('Árvore') || p.name.includes('Drusa')
  );

  return (
    <CatalogView
      title="CASA MÍSTICA"
      subtitle="Decoração orgânica, esculturas em pedras naturais e objetos de contemplação para acolher sua casa."
      initialProducts={products}
      currentCategorySlug="casa-mistica"
    />
  );
}
