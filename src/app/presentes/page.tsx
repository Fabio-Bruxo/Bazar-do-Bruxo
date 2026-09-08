import React from 'react';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import CatalogView from '@/components/CatalogView';

export const metadata = {
  title: 'Presentes com Significado & Amuletos | O Bazar do Bruxo',
  description: 'Joias em prata envelhecida, pulseiras alquímicas de pedras genuínas e presentes inesquecíveis.',
};

export default function PresentesPage() {
  const products = ALL_INITIAL_PRODUCTS.filter(
    (p) => p.categorySlug === 'presentes' || p.category === 'Presentes' || p.name.includes('Pingente') || p.name.includes('Pulseira') || p.categorySlug === 'kits'
  );

  return (
    <CatalogView
      title="PRESENTES COM SIGNIFICADO"
      subtitle="Amuletos para carregar junto ao peito ou surpreender quem você ama com carinho e proteção."
      initialProducts={products}
      currentCategorySlug="presentes"
    />
  );
}
