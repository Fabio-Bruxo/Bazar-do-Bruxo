import React from 'react';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import CatalogView from '@/components/CatalogView';

export const metadata = {
  title: 'Energia, Vitalidade & Limpeza | O Bazar do Bruxo',
  description: 'Selenita para purificação, turmalina para proteção e citrino para vitalidade criativa.',
};

export default function EnergiaPage() {
  const products = ALL_INITIAL_PRODUCTS.filter(
    (p) => p.intentions.includes('coragem') || p.intentions.includes('prosperidade') || p.intentions.includes('protecao')
  );

  return (
    <CatalogView
      title="ENERGIA & VITALIDADE"
      subtitle="Minerais e instrumentos para reaquecer a motivação, ancorar limites e restaurar o equilíbrio do ambiente."
      initialProducts={products}
      currentCategorySlug="energia"
    />
  );
}
