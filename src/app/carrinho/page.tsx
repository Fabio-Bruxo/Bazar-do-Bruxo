'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  Tag, 
  CheckCircle2 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/currency';
import { ALL_INITIAL_PRODUCTS, getStoredProducts } from '@/data/db';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

export default function CarrinhoPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeShippingThreshold,
    remainingForFreeShipping,
    isFreeShippingReached,
    coupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);

  useEffect(() => {
    setCatalogProducts(getStoredProducts());
    const handleUpdate = () => setCatalogProducts(getStoredProducts());
    window.addEventListener('bazar_catalog_updated', handleUpdate);
    return () => window.removeEventListener('bazar_catalog_updated', handleUpdate);
  }, []);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setFeedback(res);
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const crossSellProducts = catalogProducts.filter(
    (p) => p.commercialStatus !== 'inativo' && !items.some((i) => i.product.id === p.id)
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-bazar-gold uppercase mb-2">
          <ShoppingBag className="w-4 h-4 text-bazar-gold" /> Sacola do Bazar
        </span>
        <h1 className="font-mystic text-3xl font-extrabold text-bazar-parchment uppercase">
          SEU CARRINHO DE RITUAIS
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-bazar-charcoal-light/40 rounded-3xl border border-bazar-charcoal-border max-w-lg mx-auto p-8">
          <Sparkles className="w-12 h-12 text-bazar-gold/50 mx-auto mb-3" />
          <h2 className="font-mystic text-lg font-bold text-bazar-parchment">
            Seu carrinho está vazio
          </h2>
          <p className="text-xs text-bazar-parchment/60 mt-1 mb-6">
            Nenhum achado foi guardado ainda. Navegue por nossos cristais ou faça o quiz para receber sua indicação.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cristais"
              className="px-6 py-3 rounded-xl bg-bazar-wine hover:bg-bazar-wine-light text-bazar-parchment text-xs font-bold tracking-wider transition-colors"
            >
              EXPLORAR CRISTAIS
            </Link>
            <Link
              href="/quiz"
              className="px-6 py-3 rounded-xl bg-bazar-charcoal border border-bazar-gold/50 text-bazar-gold text-xs font-bold tracking-wider hover:bg-bazar-gold hover:text-bazar-charcoal transition-colors"
            >
              FAZER O QUIZ
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Lista de Itens (8 colunas) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Barra de Frete Grátis */}
            <div className="p-4 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-bazar-gold" />
                  {isFreeShippingReached ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Parabéns! Seu frete é grátis!
                    </span>
                  ) : (
                    <span className="text-bazar-parchment/80">
                      Faltam <strong className="text-bazar-gold">{formatCurrency(remainingForFreeShipping)}</strong> para o <strong className="text-emerald-400">Frete Grátis</strong>
                    </span>
                  )}
                </div>
                <span className="font-mono text-bazar-parchment/60">{progressPercent}%</span>
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

            {/* Tabela de Produtos */}
            <div className="bg-bazar-charcoal-light rounded-2xl border border-bazar-charcoal-border divide-y divide-bazar-charcoal-border">
              {items.map(({ product, quantity }) => {
                const price = product.promotionalPrice || product.price;
                return (
                  <div key={product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-bazar-charcoal-border shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <span className="text-[10px] text-bazar-gold font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                      <Link href={`/produto/${product.slug}`}>
                        <h3 className="font-mystic text-sm sm:text-base font-bold text-bazar-parchment hover:text-bazar-gold transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-bazar-parchment/60 truncate mt-0.5">
                        {product.subtitle}
                      </p>
                      <p className="text-sm font-bold text-bazar-gold mt-1">
                        {formatCurrency(price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-bazar-charcoal-border rounded-xl bg-bazar-charcoal">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-2 text-bazar-parchment/60 hover:text-bazar-parchment"
                          aria-label="Diminuir"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-bazar-parchment">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-2 text-bazar-parchment/60 hover:text-bazar-parchment"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-bazar-parchment min-w-[70px] text-right">
                        {formatCurrency(price * quantity)}
                      </span>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-2 text-bazar-parchment/40 hover:text-rose-400 transition-colors"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumo do Pedido e Cupom (4 colunas) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-bazar-charcoal-light p-6 rounded-2xl border border-bazar-charcoal-border space-y-4 shadow-mystic">
              <h2 className="font-mystic text-base font-bold text-bazar-parchment uppercase tracking-wider border-b border-bazar-charcoal-border pb-3">
                Resumo do Ritual
              </h2>

              {/* Formulário de Cupom */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bazar-wine/40 border border-bazar-gold/50 text-xs">
                    <span className="text-bazar-gold font-bold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Cupom {coupon} ativo
                    </span>
                    <button onClick={removeCoupon} className="text-bazar-parchment/60 hover:text-bazar-parchment underline">
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código de cupom (Ex: PRIMEIRORITUAL)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-xs text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none focus:border-bazar-gold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-bazar-charcoal border border-bazar-gold text-bazar-gold hover:bg-bazar-gold hover:text-bazar-charcoal text-xs font-bold rounded-xl transition-colors"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
                {feedback && (
                  <p className={`text-[11px] mt-1.5 ${feedback.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {feedback.message}
                  </p>
                )}
              </div>

              {/* Subtotal, Desconto, Frete */}
              <div className="space-y-2 text-xs text-bazar-parchment/80 pt-2 border-t border-bazar-charcoal-border">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Desconto</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>
                    {isFreeShippingReached ? (
                      <strong className="text-emerald-400">GRÁTIS</strong>
                    ) : (
                      'Calculado no próximo passo'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-bazar-parchment pt-3 border-t border-bazar-charcoal-border">
                  <span className="font-mystic">Total</span>
                  <span className="text-bazar-gold text-xl">
                    {formatCurrency(Math.max(0, subtotal - discountAmount))}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-mystic border border-bazar-gold/50 transition-all"
              >
                <span>SEGUIR PARA O CHECKOUT</span>
                <ArrowRight className="w-4 h-4 text-bazar-gold" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Sugestões Complementares no rodapé do carrinho */}
      {items.length > 0 && crossSellProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-bazar-charcoal-border">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-bazar-gold uppercase block mb-1">
              Complete seu Envio
            </span>
            <h3 className="font-mystic text-xl sm:text-2xl font-bold text-bazar-parchment uppercase">
              ACHADOS QUE OUTROS VIAJANTES LEVAM JUNTOS
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {crossSellProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
