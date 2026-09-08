import React from 'react';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import CatalogView from '@/components/CatalogView';

export const metadata = {
  title: 'Instrumentos Rituais & Meditação | O Bazar do Bruxo',
  description: 'Japamalas de 108 contas, pêndulos de radiestesia, incensários de cascata e kits para o seu altar pessoal.',
};

export default function RituaisPage() {
  const products = ALL_INITIAL_PRODUCTS.filter(
    (p) => p.categorySlug === 'rituais' || p.category === 'Rituais' || p.name.includes('Japamala') || p.name.includes('Pêndulo') || p.categorySlug === 'kits'
  );

  return (
    <CatalogView
      title="RITUAIS & MEDITAÇÃO"
      subtitle="Ferramentas práticas para ancorar a presença, desacelerar a respiração e consagrar seus momentos de quietude."
      initialProducts={products}
      currentCategorySlug="rituais"
    />
  );
}
