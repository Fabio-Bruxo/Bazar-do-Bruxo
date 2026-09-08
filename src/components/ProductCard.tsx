'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ExternalLink, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency, calculatePixDiscount, calculateInstallments } from '@/utils/currency';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);
  const currentPrice = product.promotionalPrice || product.price;
  const { pixPrice } = calculatePixDiscount(currentPrice, product.pixDiscountPercent);
  const installments = calculateInstallments(currentPrice, product.maxInstallments);

  // Mapeamento de cor da badge de intenção
  const getIntentionBadge = (intention: string) => {
    switch (intention) {
      case 'calma':
        return { label: 'Calma & Serenidade', bg: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30' };
      case 'protecao':
        return { label: 'Proteção & Escudo', bg: 'bg-zinc-900/90 text-zinc-300 border-zinc-500/40' };
      case 'amor-proprio':
        return { label: 'Amor-Próprio', bg: 'bg-rose-950/80 text-rose-300 border-rose-500/30' };
      case 'coragem':
        return { label: 'Coragem & Foco', bg: 'bg-amber-950/80 text-amber-300 border-amber-500/30' };
      case 'prosperidade':
        return { label: 'Prosperidade & Luz', bg: 'bg-yellow-950/80 text-yellow-300 border-yellow-500/30' };
      case 'intuicao':
        return { label: 'Intuição Sutil', bg: 'bg-purple-950/80 text-purple-300 border-purple-500/30' };
      default:
        return { label: 'Equilíbrio', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' };
    }
  };

  const primaryIntention = product.intentions[0];
  const intentionStyle = primaryIntention ? getIntentionBadge(primaryIntention) : null;

  return (
    <div className="group relative bg-bazar-charcoal-light/60 rounded-2xl border border-bazar-charcoal-border hover:border-bazar-gold/50 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-mystic">
      
      {/* Imagem do Produto */}
      <div className="relative aspect-square overflow-hidden bg-bazar-charcoal">
        <Link href={`/produto/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badge de Intenção */}
        {intentionStyle && (
          <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm ${intentionStyle.bg}`}>
            {intentionStyle.label}
          </span>
        )}

        {/* Badge de Desconto Promocional */}
        {product.promotionalPrice && (
          <span className="absolute top-2.5 right-11 bg-bazar-wine text-bazar-parchment text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-bazar-gold/40">
            OFERTA
          </span>
        )}

        {/* Botão de Favoritar */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors ${
            isFavorite 
              ? 'bg-bazar-wine text-bazar-gold' 
              : 'bg-black/50 text-bazar-parchment/80 hover:text-bazar-gold'
          }`}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Tag especial de Dropshipping / Afiliado */}
        {product.type === 'afiliado' && (
          <span className="absolute bottom-2 left-2 bg-bazar-purple/90 text-bazar-gold text-[9px] font-bold px-2 py-0.5 rounded border border-bazar-gold/40">
            Parceiro Oficial
          </span>
        )}
      </div>

      {/* Informações e Detalhes */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-bazar-gold/80 block mb-1">
            {product.category}
          </span>
          <Link href={`/produto/${product.slug}`}>
            <h3 className="text-sm sm:text-base font-bold text-bazar-parchment group-hover:text-bazar-gold transition-colors line-clamp-1 font-mystic">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-bazar-parchment/60 line-clamp-2 mt-1 min-h-[32px] font-editorial italic">
            &ldquo;{product.subtitle}&rdquo;
          </p>
        </div>

        {/* Preços e Ações */}
        <div className="mt-4 pt-3 border-t border-bazar-charcoal-border/50">
          <div className="flex items-baseline gap-2">
            {product.promotionalPrice && (
              <span className="text-xs text-bazar-parchment/40 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-bazar-parchment">
              {formatCurrency(currentPrice)}
            </span>
          </div>

          {/* Preço no PIX */}
          {product.type !== 'afiliado' && (
            <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
              <strong className="text-bazar-gold font-bold">{formatCurrency(pixPrice)}</strong> no PIX ({product.pixDiscountPercent}% off)
            </p>
          )}

          {/* Parcelamento */}
          {product.type !== 'afiliado' && (
            <p className="text-[10px] text-bazar-parchment/50">
              {installments.text}
            </p>
          )}

          {/* Botão de Compra / CTA */}
          <div className="mt-3">
            {product.type === 'afiliado' ? (
              <a
                href={product.affiliateUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-bazar-purple hover:bg-bazar-purple-light text-bazar-gold border border-bazar-gold/50 text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>VER NO PARCEIRO</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                className="w-full py-2.5 px-3 rounded-xl bg-bazar-charcoal hover:bg-bazar-wine border border-bazar-gold/40 hover:border-bazar-gold text-bazar-parchment text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all duration-200 group/btn"
              >
                <ShoppingBag className="w-4 h-4 text-bazar-gold group-hover/btn:scale-110 transition-transform" />
                <span>ADICIONAR AO RITUAL</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
