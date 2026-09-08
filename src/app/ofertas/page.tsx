import React from 'react';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import CatalogView from '@/components/CatalogView';

export const metadata = {
  title: 'Ofertas & Achados Especiais | O Bazar do Bruxo',
  description: 'Oportunidades especiais de cristais, kits e incensos com desconto por tempo limitado.',
};

export default function OfertasPage() {
  const promoProducts = ALL_INITIAL_PRODUCTS.filter((p) => p.promotionalPrice && p.promotionalPrice < p.price);

  return (
    <CatalogView
      title="OFERTAS & ACHADOS ESPECIAIS"
      subtitle="Peças selecionadas com condições exclusivas e desconto no PIX."
      initialProducts={promoProducts.length > 0 ? promoProducts : ALL_INITIAL_PRODUCTS}
      currentCategorySlug="ofertas"
    />
  );
}
