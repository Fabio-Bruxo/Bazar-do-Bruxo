'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Sparkles } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { getStoredProducts, Product } from '@/data/db';
import ProductCard from '@/components/ProductCard';

export default function FavoritosPage() {
  const { wishlist } = useWishlist();
  const [catalog, setCatalog] = useState<Product[]>([]);

  useEffect(() => {
    setCatalog(getStoredProducts());
    const handleUpdate = () => setCatalog(getStoredProducts());
    window.addEventListener('bazar_catalog_updated', handleUpdate);
    return () => window.removeEventListener('bazar_catalog_updated', handleUpdate);
  }, []);

  const favoriteProducts = catalog.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-bazar-gold uppercase mb-2">
          <Heart className="w-4 h-4 fill-current text-bazar-gold" /> Seus Guardados
        </span>
        <h1 className="font-mystic text-3xl font-bold text-bazar-parchment uppercase">
          MEUS ACHADOS FAVORITOS
        </h1>
        <p className="font-editorial italic text-base text-bazar-parchment/70 mt-1">
          As peças que chamaram a sua atenção no Bazar.
        </p>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-bazar-charcoal-light/40 rounded-3xl border border-bazar-charcoal-border max-w-md mx-auto p-8">
          <Heart className="w-12 h-12 text-bazar-parchment/30 mx-auto mb-3" />
          <h3 className="font-mystic text-lg font-bold text-bazar-parchment">
            Sua lista está vazia
          </h3>
          <p className="text-xs text-bazar-parchment/60 mt-2 mb-6">
            Ao navegar pelo Bazar, clique no coração de qualquer peça para salvá-la aqui.
          </p>
          <Link
            href="/cristais"
            className="px-6 py-3 rounded-xl bg-bazar-wine text-bazar-parchment text-xs font-bold tracking-wider hover:bg-bazar-wine-light transition-colors"
          >
            EXPLORAR CRISTAIS
          </Link>
        </div>
      )}
    </div>
  );
}
