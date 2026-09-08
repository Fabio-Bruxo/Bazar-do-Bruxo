import React from 'react';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import CatalogView from '@/components/CatalogView';

export const metadata = {
  title: 'Cristais Naturais e Autênticos | O Bazar do Bruxo',
  description: 'Ametistas, quartzos, turmalinas e pedras autênticas selecionadas para calma, proteção e intenção.',
};

export default function CristaisPage() {
  const cristais = ALL_INITIAL_PRODUCTS.filter(
    (p) => p.categorySlug === 'cristais' || p.category === 'Cristais'
  );

  return (
    <CatalogView
      title="CRISTAIS & MINERAIS"
      subtitle="Formações autênticas da terra para ancorar intenções e transformar espaços em refúgios de silêncio."
      initialProducts={cristais.length > 0 ? cristais : ALL_INITIAL_PRODUCTS}
      currentCategorySlug="cristais"
    />
  );
}
