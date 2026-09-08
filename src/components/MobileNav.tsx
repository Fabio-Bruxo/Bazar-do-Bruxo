'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function MobileNav() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { wishlist } = useWishlist();

  // Não exibir no checkout para evitar distrações de conversão
  if (pathname.startsWith('/checkout')) {
    return null;
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bazar-charcoal/95 backdrop-blur-md border-t border-bazar-charcoal-border py-2 px-3 safe-area-bottom">
      <div className="flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/' ? 'text-bazar-gold font-bold' : 'text-bazar-parchment/60 hover:text-bazar-parchment'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-wider">Início</span>
        </Link>

        <Link
          href="/cristais"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname.startsWith('/cristais') || pathname.startsWith('/kits')
              ? 'text-bazar-gold font-bold'
              : 'text-bazar-parchment/60 hover:text-bazar-parchment'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] tracking-wider">Categorias</span>
        </Link>

        <Link
          href="/quiz"
          className={`flex flex-col items-center gap-1 -mt-4 bg-gradient-to-tr from-bazar-wine to-bazar-purple p-2.5 rounded-full border-2 border-bazar-gold shadow-mystic text-bazar-gold`}
        >
          <Search className="w-5 h-5 text-bazar-parchment" />
          <span className="sr-only">Buscar ou Quiz</span>
        </Link>

        <Link
          href="/favoritos"
          className={`relative flex flex-col items-center gap-1 transition-colors ${
            pathname === '/favoritos' ? 'text-bazar-gold font-bold' : 'text-bazar-parchment/60 hover:text-bazar-parchment'
          }`}
        >
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 bg-bazar-wine text-bazar-parchment text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-bazar-gold">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] tracking-wider">Favoritos</span>
        </Link>

        <button
          onClick={openCart}
          className="relative flex flex-col items-center gap-1 text-bazar-parchment/70 hover:text-bazar-gold transition-colors"
          aria-label="Abrir Carrinho"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 right-1.5 bg-bazar-gold text-bazar-charcoal text-[10px] font-extrabold rounded-full px-1 min-w-[16px] text-center leading-tight">
              {totalItems}
            </span>
          )}
          <span className="text-[10px] tracking-wider">Carrinho</span>
        </button>
      </div>
    </nav>
  );
}
