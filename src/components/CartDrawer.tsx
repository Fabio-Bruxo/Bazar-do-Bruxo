'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Tag,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/currency';
import { getStoredProducts, Product } from '@/data/db';

export default function CartDrawer() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    totalItems,
    freeShippingThreshold,
    remainingForFreeShipping,
    isFreeShippingReached,
    coupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    addToCart
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; message?: string } | null>(null);
  const [catalog, setCatalog] = useState<Product[]>([]);

  useEffect(() => {
    setCatalog(getStoredProducts());
    const handleUpdate = () => setCatalog(getStoredProducts());
    window.addEventListener('bazar_catalog_updated', handleUpdate);
    return () => window.removeEventListener('bazar_catalog_updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  // Produtos rápidos de cross-sell para o carrinho
  const availableItems = catalog.filter((p) => !items.some((i) => i.product.id === p.id));
  const preferredMatches = availableItems.filter((p) => p.id === 'prod-15' || p.id === 'prod-18' || p.id === 'prod-02' || p.isFeatured);
  const crossSellProducts = (preferredMatches.length > 0 ? preferredMatches : availableItems).slice(0, 2);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-bazar-charcoal border-l border-bazar-charcoal-border shadow-mystic flex flex-col">
          
          {/* Header do Carrinho */}
          <div className="p-4 sm:p-5 border-b border-bazar-charcoal-border flex items-center justify-between bg-bazar-charcoal-light">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-bazar-gold" />
              <h2 className="font-mystic text-lg font-bold text-bazar-parchment tracking-wide">
                Seu Carrinho
              </h2>
              <span className="bg-bazar-wine text-bazar-parchment text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <button 
              onClick={closeCart}
              className="text-bazar-parchment/60 hover:text-bazar-gold p-1 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra Inteligente de Frete Grátis Dinâmica */}
          <div className="bg-bazar-purple/40 border-b border-bazar-purple p-3.5">
            <div className="flex items-center gap-2 text-xs mb-1.5">
              <Truck className="w-4 h-4 text-bazar-gold" />
              {isFreeShippingReached ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Parabéns! Você ganhou Frete Grátis!
                </span>
              ) : (
                <span className="text-bazar-parchment/90">
                  Faltam <strong className="text-bazar-gold font-bold">{formatCurrency(remainingForFreeShipping)}</strong> para o <strong className="text-emerald-400">Frete Grátis</strong>
                </span>
              )}
            </div>
            <div className="w-full bg-bazar-charcoal rounded-full h-2 overflow-hidden border border-bazar-charcoal-border">
              <div 
                className={`h-full transition-all duration-500 ${
                  isFreeShippingReached ? 'bg-emerald-500' : 'bg-gradient-to-r from-bazar-wine to-bazar-gold'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Conteúdo: Itens do Carrinho */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bazar-charcoal-light border border-bazar-charcoal-border flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-bazar-gold/60" />
                </div>
                <h3 className="font-mystic text-base font-bold text-bazar-parchment mb-1">
                  Seu carrinho está silencioso
                </h3>
                <p className="text-xs text-bazar-parchment/60 mb-6 max-w-xs mx-auto">
                  Os achados do Bazar estão prontos para encontrar você. Explore nossos cristais ou faça o quiz.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={closeCart}
                    className="w-full py-2.5 px-4 rounded-xl bg-bazar-wine hover:bg-bazar-wine-light text-bazar-parchment text-xs font-bold tracking-wider transition-colors"
                  >
                    CONTINUAR EXPLORANDO
                  </button>
                  <Link
                    href="/quiz"
                    onClick={closeCart}
                    className="block w-full py-2 px-4 rounded-xl bg-bazar-charcoal-light border border-bazar-gold/40 text-bazar-gold text-xs font-semibold hover:border-bazar-gold transition-colors"
                  >
                    Fazer o Quiz de Cristais
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {items.map(({ product, quantity }) => {
                    const currentPrice = product.promotionalPrice || product.price;
                    return (
                      <div 
                        key={product.id}
                        className="flex gap-3 p-3 bg-bazar-charcoal-light/70 rounded-xl border border-bazar-charcoal-border/70 hover:border-bazar-gold/30 transition-colors"
                      >
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-bazar-charcoal-border shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-bazar-parchment truncate">
                              {product.name}
                            </h4>
                            <span className="text-[11px] text-bazar-gold font-semibold">
                              {formatCurrency(currentPrice)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Contador de Quantidade */}
                            <div className="flex items-center border border-bazar-charcoal-border rounded-lg bg-bazar-charcoal">
                              <button
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="p-1 text-bazar-parchment/60 hover:text-bazar-parchment"
                                aria-label="Diminuir"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-bold text-bazar-parchment min-w-[24px] text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="p-1 text-bazar-parchment/60 hover:text-bazar-parchment"
                                aria-label="Aumentar"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Botão de Excluir */}
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-bazar-parchment/40 hover:text-rose-400 p-1 transition-colors"
                              title="Remover item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cross-sell no Carrinho ("Completar seu ritual") */}
                {crossSellProducts.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-bazar-charcoal-border">
                    <p className="text-xs font-bold text-bazar-gold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Complete seu ritual com:
                    </p>
                    <div className="space-y-2">
                      {crossSellProducts.map((p) => (
                        <div 
                          key={p.id}
                          className="flex items-center justify-between p-2.5 bg-bazar-charcoal border border-bazar-charcoal-border rounded-lg"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img 
                              src={p.images[0]} 
                              alt={p.name} 
                              className="w-10 h-10 object-cover rounded border border-bazar-charcoal-border shrink-0"
                            />
                            <div className="truncate">
                              <p className="text-xs font-semibold text-bazar-parchment truncate">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-bazar-gold">
                                {formatCurrency(p.promotionalPrice || p.price)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="shrink-0 px-2.5 py-1 bg-bazar-wine/80 hover:bg-bazar-wine text-bazar-parchment text-[11px] font-bold rounded-md transition-colors border border-bazar-gold/30"
                          >
                            + Adicionar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer do Carrinho (Cupom, Subtotal e Checkout) */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-bazar-charcoal-border bg-bazar-charcoal-light space-y-3.5">
              
              {/* Cupom de Desconto */}
              {coupon ? (
                <div className="flex items-center justify-between bg-bazar-wine/30 border border-bazar-gold/40 px-3 py-1.5 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-bazar-gold font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Cupom {coupon} ({discountAmount > 0 ? `-${formatCurrency(discountAmount)}` : ''})</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-bazar-parchment/60 hover:text-bazar-parchment underline text-[11px]"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Possui cupom? (Ex: PRIMEIRORITUAL)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-bazar-charcoal border border-bazar-charcoal-border rounded-lg px-3 py-1.5 text-xs text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none focus:border-bazar-gold"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-bazar-charcoal border border-bazar-gold/60 text-bazar-gold hover:bg-bazar-gold hover:text-bazar-charcoal text-xs font-bold rounded-lg transition-colors"
                  >
                    Aplicar
                  </button>
                </form>
              )}

              {couponFeedback && (
                <p className={`text-[11px] ${couponFeedback.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {couponFeedback.message}
                </p>
              )}

              {/* Subtotal e Descontos */}
              <div className="space-y-1.5 text-xs border-t border-bazar-charcoal-border/50 pt-2">
                <div className="flex justify-between text-bazar-parchment/70">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Desconto ({coupon})</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-bazar-parchment/70">
                  <span>Frete</span>
                  <span>
                    {isFreeShippingReached ? (
                      <span className="text-emerald-400 font-bold">GRÁTIS</span>
                    ) : (
                      'Calculado no checkout'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-bazar-parchment pt-1.5 border-t border-bazar-charcoal-border">
                  <span className="font-mystic">Total Estimado</span>
                  <span className="text-bazar-gold text-base">
                    {formatCurrency(Math.max(0, subtotal - discountAmount))}
                  </span>
                </div>
              </div>

              {/* Botão de Finalização para o Checkout */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-mystic border border-bazar-gold/40 transition-all"
              >
                <span>FECHAR MEU PEDIDO</span>
                <ArrowRight className="w-4 h-4 text-bazar-gold" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
