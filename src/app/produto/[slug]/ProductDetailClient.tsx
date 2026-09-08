'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Heart, 
  Share2, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ExternalLink,
  Plus,
  Minus,
  MessageCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency, calculatePixDiscount, calculateInstallments } from '@/utils/currency';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  upsellProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  upsellProducts,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState('');
  const [shippingResult, setShippingResult] = useState<{
    pac: { price: number; days: number };
    sedex: { price: number; days: number };
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);
  const currentPrice = product.promotionalPrice || product.price;
  const { pixPrice, discountAmount } = calculatePixDiscount(currentPrice, product.pixDiscountPercent);
  const installments = calculateInstallments(currentPrice, product.maxInstallments);

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.replace(/\D/g, '').length === 8) {
      setShippingResult({
        pac: { price: 18.90, days: 5 },
        sedex: { price: 34.50, days: 2 },
      });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-bazar-parchment/60 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-bazar-gold">Início</Link>
        <span>/</span>
        <Link href={`/${product.categorySlug}`} className="hover:text-bazar-gold">{product.category}</Link>
        <span>/</span>
        <span className="text-bazar-gold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Grid Principal: Galeria + Detalhes Comerciais */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Galeria de Imagens (5 colunas) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-bazar-charcoal border border-bazar-charcoal-border shadow-mystic">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.promotionalPrice && (
              <span className="absolute top-4 left-4 bg-bazar-wine text-bazar-parchment text-xs font-extrabold px-3 py-1 rounded-lg border border-bazar-gold/40 shadow-sm">
                OFERTA ESPECIAL
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-colors ${
                isFavorite
                  ? 'bg-bazar-wine text-bazar-gold'
                  : 'bg-black/60 text-bazar-parchment hover:text-bazar-gold'
              }`}
              aria-label="Favoritar"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Miniaturas */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? 'border-bazar-gold shadow-mystic-gold scale-105'
                      : 'border-bazar-charcoal-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} foto ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações Comerciais e Compra (6 colunas) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-bazar-gold">
                {product.category} • SKU: {product.sku}
              </span>
              <button
                onClick={handleShare}
                className="text-xs text-bazar-parchment/60 hover:text-bazar-gold flex items-center gap-1 transition-colors"
                title="Compartilhar achado"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isCopied ? 'Link Copiado!' : 'Compartilhar'}</span>
              </button>
            </div>

            <h1 className="font-mystic text-2xl sm:text-3xl lg:text-4xl font-extrabold text-bazar-parchment">
              {product.name}
            </h1>

            <p className="font-editorial italic text-base sm:text-lg text-bazar-gold/90 mt-1">
              &ldquo;{product.subtitle}&rdquo;
            </p>

            {/* Preços e Condições de Pagamento */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border shadow-sm">
              <div className="flex items-baseline gap-3">
                {product.promotionalPrice && (
                  <span className="text-sm sm:text-base text-bazar-parchment/40 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-extrabold text-bazar-parchment">
                  {formatCurrency(currentPrice)}
                </span>
              </div>

              {/* PIX com Desconto */}
              {product.type !== 'afiliado' && (
                <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-400 font-semibold block">
                      Preço no PIX com {product.pixDiscountPercent}% de desconto:
                    </span>
                    <span className="text-lg font-extrabold text-bazar-gold">
                      {formatCurrency(pixPrice)}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-300 font-medium">
                    Economize {formatCurrency(discountAmount)}
                  </span>
                </div>
              )}

              {/* Parcelamento */}
              {product.type !== 'afiliado' && (
                <p className="text-xs text-bazar-parchment/70 mt-2">
                  Ou em até <strong>{installments.text}</strong>
                </p>
              )}
            </div>

            {/* Disponibilidade / Estoque */}
            <div className="mt-4 flex items-center gap-2 text-xs text-bazar-parchment/80">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                {product.stock > 5 ? 'Em estoque pronto para envio' : `Últimas ${product.stock} unidades disponíveis`}
              </span>
            </div>

            {/* Seletor de Quantidade e Ação de Compra */}
            <div className="mt-6 space-y-3">
              {product.type === 'afiliado' ? (
                <div>
                  <a
                    href={product.affiliateUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-2xl bg-bazar-purple hover:bg-bazar-purple-light text-bazar-gold text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 border border-bazar-gold shadow-mystic transition-all"
                  >
                    <span>VER NO PARCEIRO OFICIAL</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-[11px] text-bazar-parchment/50 text-center mt-2">
                    Parceiro certificado: {product.partnerName}. Compra e entrega gerenciadas pelo parceiro.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Seletor de Qtd */}
                  <div className="flex items-center justify-between border border-bazar-charcoal-border rounded-xl bg-bazar-charcoal px-3 py-2 w-full sm:w-32">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-bazar-parchment/60 hover:text-bazar-parchment"
                      aria-label="Diminuir"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm text-bazar-parchment">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-bazar-parchment/60 hover:text-bazar-parchment"
                      aria-label="Aumentar"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Botão Adicionar ao Carrinho */}
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment text-xs sm:text-sm font-extrabold tracking-widest uppercase flex items-center justify-center gap-2.5 shadow-mystic border border-bazar-gold/50 transition-all hover:scale-[1.01]"
                  >
                    <ShoppingBag className="w-5 h-5 text-bazar-gold" />
                    <span>ADICIONAR AO RITUAL</span>
                  </button>
                </div>
              )}
            </div>

            {/* Simulador de Frete */}
            {product.type !== 'afiliado' && (
              <div className="mt-6 pt-5 border-t border-bazar-charcoal-border">
                <form onSubmit={handleCalculateShipping} className="flex gap-2">
                  <div className="relative flex-1">
                    <Truck className="w-4 h-4 text-bazar-gold absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Digite seu CEP para prazo e frete"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      maxLength={9}
                      className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl pl-9 pr-3 py-2 text-xs text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none focus:border-bazar-gold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-gold text-xs font-bold rounded-xl transition-colors"
                  >
                    Calcular
                  </button>
                </form>

                {shippingResult && (
                  <div className="mt-3 p-3 bg-bazar-charcoal rounded-xl border border-bazar-charcoal-border text-xs space-y-1.5 animate-in fade-in">
                    <div className="flex justify-between">
                      <span className="text-bazar-parchment/80">PAC Econômico ({shippingResult.pac.days} dias úteis):</span>
                      <strong className="text-bazar-gold">{formatCurrency(shippingResult.pac.price)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-bazar-parchment/80">Sedex Expresso ({shippingResult.sedex.days} dias úteis):</span>
                      <strong className="text-bazar-gold">{formatCurrency(shippingResult.sedex.price)}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dúvida rápida via WhatsApp */}
          <div className="p-3.5 rounded-xl bg-bazar-charcoal border border-bazar-charcoal-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-bazar-parchment/70">
              <HelpCircle className="w-4 h-4 text-bazar-gold" />
              <span>Dúvida sobre este cristal ou ritual?</span>
            </div>
            <a
              href={`https://wa.me/5513998039867?text=${encodeURIComponent(`Olá! Gostaria de tirar uma dúvida sobre o produto ${product.name} (SKU: ${product.sku})`)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* PADRÃO DE COPY OBRIGATÓRIO EM ABAS/SEÇÕES ESTRUTURADAS */}
      <div className="mt-16 pt-12 border-t border-bazar-charcoal-border">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* O QUE É? */}
          <section className="bg-bazar-charcoal-light/50 p-6 sm:p-8 rounded-3xl border border-bazar-charcoal-border">
            <h2 className="font-mystic text-lg font-bold text-bazar-gold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> O QUE É?
            </h2>
            <p className="text-sm text-bazar-parchment/90 leading-relaxed font-editorial text-base">
              {product.description.whatIs}
            </p>
          </section>

          {/* POR QUE ELE CHAMOU SUA ATENÇÃO? */}
          <section className="bg-bazar-charcoal-light/50 p-6 sm:p-8 rounded-3xl border border-bazar-charcoal-border">
            <h2 className="font-mystic text-lg font-bold text-bazar-gold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> POR QUE ELE CHAMOU SUA ATENÇÃO?
            </h2>
            <p className="text-sm text-bazar-parchment/90 leading-relaxed font-editorial text-base">
              {product.description.whyItCalledYou}
            </p>
          </section>

          {/* SOBRE O SIMBOLISMO (Conformidade Estrita) */}
          <section className="bg-bazar-charcoal-light/50 p-6 sm:p-8 rounded-3xl border border-bazar-charcoal-border">
            <h2 className="font-mystic text-lg font-bold text-bazar-gold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> SOBRE O SIMBOLISMO
            </h2>
            <p className="text-sm text-bazar-parchment/90 leading-relaxed font-editorial text-base">
              {product.description.symbolism}
            </p>
            <div className="mt-4 p-3 rounded-xl bg-bazar-charcoal/80 border border-bazar-charcoal-border flex items-start gap-2.5 text-xs text-bazar-parchment/60">
              <Info className="w-4 h-4 text-bazar-gold shrink-0 mt-0.5" />
              <span>
                Nota de conformidade: O simbolismo aqui apresentado reflete tradições e práticas contemplativas históricas. Minerais não substituem acompanhamento de saúde ou tratamentos médicos.
              </span>
            </div>
          </section>

          {/* COMO USAR */}
          <section className="bg-bazar-charcoal-light/50 p-6 sm:p-8 rounded-3xl border border-bazar-charcoal-border">
            <h2 className="font-mystic text-lg font-bold text-bazar-gold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> COMO USAR
            </h2>
            <p className="text-sm text-bazar-parchment/90 leading-relaxed font-editorial text-base">
              {product.description.howToUse}
            </p>
          </section>

          {/* DETALHES TÉCNICOS */}
          <section className="bg-bazar-charcoal-light/50 p-6 sm:p-8 rounded-3xl border border-bazar-charcoal-border">
            <h2 className="font-mystic text-lg font-bold text-bazar-gold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> DETALHES TÉCNICOS
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-bazar-charcoal rounded-xl border border-bazar-charcoal-border">
                <dt className="text-bazar-parchment/50 font-semibold uppercase tracking-wider">Origem</dt>
                <dd className="text-bazar-parchment font-medium mt-1">{product.details.origin}</dd>
              </div>
              <div className="p-3 bg-bazar-charcoal rounded-xl border border-bazar-charcoal-border">
                <dt className="text-bazar-parchment/50 font-semibold uppercase tracking-wider">Material</dt>
                <dd className="text-bazar-parchment font-medium mt-1">{product.details.material}</dd>
              </div>
              <div className="p-3 bg-bazar-charcoal rounded-xl border border-bazar-charcoal-border">
                <dt className="text-bazar-parchment/50 font-semibold uppercase tracking-wider">Dimensões</dt>
                <dd className="text-bazar-parchment font-medium mt-1">{product.details.dimensions}</dd>
              </div>
              <div className="p-3 bg-bazar-charcoal rounded-xl border border-bazar-charcoal-border">
                <dt className="text-bazar-parchment/50 font-semibold uppercase tracking-wider">Peso Estimado</dt>
                <dd className="text-bazar-parchment font-medium mt-1">{product.details.weight}</dd>
              </div>
              <div className="sm:col-span-2 p-3 bg-bazar-charcoal rounded-xl border border-bazar-charcoal-border">
                <dt className="text-bazar-parchment/50 font-semibold uppercase tracking-wider">Cuidados e Manuseio</dt>
                <dd className="text-bazar-parchment font-medium mt-1">{product.details.care}</dd>
              </div>
              {product.details.notes && (
                <div className="sm:col-span-2 p-3 bg-bazar-charcoal rounded-xl border border-bazar-charcoal-border">
                  <dt className="text-bazar-parchment/50 font-semibold uppercase tracking-wider">Observações</dt>
                  <dd className="text-bazar-parchment font-medium mt-1">{product.details.notes}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>

      {/* UPSELL IMEDIATO: COMPLETE SEU RITUAL */}
      {upsellProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-bazar-charcoal-border">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-bazar-gold uppercase block mb-1">
              Harmonização Recomendada
            </span>
            <h2 className="font-mystic text-2xl font-bold text-bazar-parchment uppercase">
              COMPLETE SEU RITUAL
            </h2>
            <p className="text-xs text-bazar-parchment/60 mt-1 font-editorial text-sm">
              Peças que complementam naturalmente a presença deste achado.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {upsellProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* PRODUTOS RELACIONADOS */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-bazar-charcoal-border">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-bazar-gold uppercase block mb-1">
              Outros Encontros
            </span>
            <h2 className="font-mystic text-2xl font-bold text-bazar-parchment uppercase">
              VOCÊ TAMBÉM PODE SE AFINAR COM
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
