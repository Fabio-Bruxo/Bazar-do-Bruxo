'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { getStoredProducts } from '@/data/db';
import { Product } from '@/types';

interface HomeBestSellersProps {
  initialProducts: Product[];
}

export default function HomeBestSellers({ initialProducts }: HomeBestSellersProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const update = () => {
      const stored = getStoredProducts().filter((p) => p.commercialStatus !== 'inativo');
      const featured = stored.filter((p) => p.isFeatured);
      const display = featured.length >= 4 ? featured.slice(0, 8) : stored.slice(0, 8);
      setProducts(display);
    };

    update();
    window.addEventListener('bazar_catalog_updated', update);
    return () => window.removeEventListener('bazar_catalog_updated', update);
  }, []);

  if (products.length === 0) {
    return (
      <div className="col-span-full py-12 text-center text-bazar-parchment/50 font-editorial italic text-sm border border-dashed border-bazar-charcoal-border rounded-2xl p-8">
        ✦ Nenhum item ativo no catálogo no momento. O administrador pode adicionar novos produtos a qualquer momento. ✦
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
