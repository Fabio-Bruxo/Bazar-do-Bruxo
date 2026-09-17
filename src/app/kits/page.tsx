import React from 'react';
import { INITIAL_KITS } from '@/data/kits';
import CatalogView from '@/components/CatalogView';

export const metadata = {
  title: 'Kits Rituais Prontos | O Bazar do Bruxo',
  description: 'Kit Lua, Kit Proteção, Kit Amor-Próprio, Kit Energia, Kit Meditação e Kit Bruxo Iniciante.',
};

export default function KitsPage() {
  return (
    <CatalogView
      title="KITS RITUAIS PRONTOS"
      subtitle="Conjuntos completos com minerais, velas botânicas, incensos e manuais rituais para presentear ou consagrar seu espaço."
      initialProducts={[]}
      currentCategorySlug="kits"
    />
  );
}
