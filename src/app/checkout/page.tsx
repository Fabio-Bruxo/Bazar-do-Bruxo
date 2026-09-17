'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  Check, 
  Copy, 
  Sparkles, 
  Truck, 
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  ChevronLeft,
  UserCheck
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, calculatePixDiscount } from '@/utils/currency';
import { trackEvent } from '@/utils/analytics';
import { Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, coupon, clearCart, isFreeShippingReached } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Dados do formulário (Autopreenchimento se o usuário estiver logado)
  const [customer, setCustomer] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    document: user?.document || '',
    zipCode: user?.address?.zipCode || '',
    street: user?.address?.street || '',
    number: user?.address?.number || '',
    complement: user?.address?.complement || '',
    neighborhood: user?.address?.neighborhood || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
  });

  useEffect(() => {
    if (user) {
      setCustomer({
        name: user.name,
        email: user.email,
        phone: user.phone,
        document: user.document,
        zipCode: user.address.zipCode,
        street: user.address.street,
        number: user.address.number,
        complement: user.address.complement || '',
        neighborhood: user.address.neighborhood,
        city: user.address.city,
        state: user.address.state,
      });
    }
  }, [user]);

  // Frete
  const [shippingMethod, setShippingMethod] = useState<'pac' | 'sedex'>('pac');
  const shippingCost = isFreeShippingReached
    ? 0
    : shippingMethod === 'pac'
    ? 18.90
    : 34.00;

  // Order Bump ("Quer completar seu ritual?")
  const [orderBumpSelected, setOrderBumpSelected] = useState(false);
  const orderBumpPrice = 14.90;

  // Forma de pagamento
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    name: customer.name.toUpperCase(),
    expiry: '12/29',
    cvv: '888',
    installments: 1,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Cálculos finais
  const bumpCost = orderBumpSelected ? orderBumpPrice : 0;
  const currentSubtotal = subtotal + bumpCost;
  const totalBeforePix = Math.max(0, currentSubtotal - discountAmount + shippingCost);

  const pixDiscount = paymentMethod === 'pix' ? totalBeforePix * 0.05 : 0;
  const finalTotal = totalBeforePix - pixDiscount;

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsProcessing(true);
    trackEvent('initiate_checkout', {
      value: finalTotal,
      currency: 'BRL',
      items_count: items.length,
      paymentMethod,
      orderBumpSelected,
    });

    const newOrderId = `ord-${Date.now().toString().slice(-4)}`;
    const newOrderCode = `BZR-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderRecord: Order = {
      id: newOrderId,
      code: newOrderCode,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        document: customer.document,
        address: {
          zipCode: customer.zipCode,
          street: customer.street,
          number: customer.number,
          complement: customer.complement,
          neighborhood: customer.neighborhood,
          city: customer.city,
          state: customer.state,
        },
      },
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.promotionalPrice || i.product.price,
        quantity: i.quantity,
        image: i.product.images[0],
      })),
      subtotal: currentSubtotal,
      shipping: shippingCost,
      discount: discountAmount + pixDiscount,
      total: finalTotal,
      paymentMethod,
      paymentStatus: 'paid',
      orderStatus: 'recebido',
      trackingCode: `BR${Math.floor(100000000 + Math.random() * 900000000)}XP`,
      appliedCoupon: coupon || undefined,
      orderBumpAccepted: orderBumpSelected,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('bazar_orders') || '[]');
      existing.unshift(orderRecord);
      localStorage.setItem('bazar_orders', JSON.stringify(existing));
    } catch (err) {}

    trackEvent('purchase', {
      order_id: newOrderCode,
      value: finalTotal,
      items_count: items.length,
    });

    setTimeout(() => {
      clearCart();
      router.push(`/checkout/sucesso/${newOrderId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bazar-charcoal py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Limpo de Checkout */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-bazar-charcoal-border">
          <Link href="/carrinho" className="flex items-center gap-1.5 text-xs text-bazar-parchment/70 hover:text-bazar-gold transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar ao carrinho</span>
          </Link>
          <div className="text-center">
            <span className="font-mystic text-lg sm:text-xl font-bold tracking-widest text-bazar-parchment block">
              O BAZAR DO BRUXO
            </span>
            <span className="font-editorial italic text-xs text-bazar-gold">
              Ambiente de Compra Blindado
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Checkout Seguro</span>
          </div>
        </div>

        {/* Aviso de Usuário Conectado */}
        {isAuthenticated && user && (
          <div className="mb-6 p-3.5 rounded-2xl bg-bazar-wine/30 border border-bazar-gold/40 flex items-center justify-between text-xs text-bazar-parchment">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-bazar-gold shrink-0" />
              <span>
                Comprando conectado como <strong>{user.name}</strong> ({user.email}). Seus dados e endereço foram preenchidos automaticamente!
              </span>
            </div>
            <Link href="/minha-conta" className="text-bazar-gold underline font-semibold shrink-0">
              Ver Meu Perfil
            </Link>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20 bg-bazar-charcoal-light/40 rounded-3xl border border-bazar-charcoal-border max-w-md mx-auto p-8">
            <h2 className="font-mystic text-lg font-bold text-bazar-parchment">
              Nenhum item para checkout
            </h2>
            <p className="text-xs text-bazar-parchment/60 mt-1 mb-6">
              Adicione algum achado ao seu carrinho antes de fechar o pedido.
            </p>
            <Link
              href="/cristais"
              className="px-6 py-3 rounded-xl bg-bazar-wine text-bazar-parchment text-xs font-bold tracking-wider"
            >
              EXPLORAR CRISTAIS
            </Link>
          </div>
        ) : (
          <form onSubmit={handleFinishOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Dados do Cliente e Pagamento (7 colunas) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Etapa 1: Dados Pessoais */}
              <div className="bg-bazar-charcoal-light p-6 rounded-2xl border border-bazar-charcoal-border space-y-4">
                <h2 className="font-mystic text-sm font-bold text-bazar-gold uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> 1. Dados para Envio
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="text-bazar-parchment/70 block mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-bazar-parchment/70 block mb-1">E-mail para Rastreio</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-bazar-parchment/70 block mb-1">WhatsApp com DDD</label>
                    <input
                      type="text"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-bazar-charcoal-border/60">
                  <div>
                    <label className="text-bazar-parchment/70 block mb-1">CEP</label>
                    <input
                      type="text"
                      required
                      value={customer.zipCode}
                      onChange={(e) => setCustomer({ ...customer, zipCode: e.target.value })}
                      className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-bazar-parchment/70 block mb-1">Rua / Avenida</label>
                    <input
                      type="text"
                      required
                      value={customer.street}
                      onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                      className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-bazar-parchment/70 block mb-1">Número</label>
                    <input
                      type="text"
                      required
                      value={customer.number}
                      onChange={(e) => setCustomer({ ...customer, number: e.target.value })}
                      className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-bazar-parchment/70 block mb-1">Bairro</label>
                    <input
                      type="text"
                      required
                      value={customer.neighborhood}
                      onChange={(e) => setCustomer({ ...customer, neighborhood: e.target.value })}
                      className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-bazar-parchment/70 block mb-1">Cidade - UF</label>
                    <input
                      type="text"
                      required
                      value={`${customer.city} - ${customer.state}`}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Etapa 2: Escolha de Frete */}
              <div className="bg-bazar-charcoal-light p-6 rounded-2xl border border-bazar-charcoal-border space-y-3">
                <h2 className="font-mystic text-sm font-bold text-bazar-gold uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4" /> 2. Modalidade de Envio
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    onClick={() => setShippingMethod('pac')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      shippingMethod === 'pac'
                        ? 'border-bazar-gold bg-bazar-charcoal'
                        : 'border-bazar-charcoal-border bg-bazar-charcoal/50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-bazar-parchment block">PAC Econômico</span>
                      <span className="text-[11px] text-bazar-parchment/60">5 a 8 dias úteis</span>
                    </div>
                    <span className="font-bold text-emerald-400">
                      {isFreeShippingReached ? 'GRÁTIS' : 'R$ 18,90'}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('sedex')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      shippingMethod === 'sedex'
                        ? 'border-bazar-gold bg-bazar-charcoal'
                        : 'border-bazar-charcoal-border bg-bazar-charcoal/50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-bazar-parchment block">Sedex Expresso</span>
                      <span className="text-[11px] text-bazar-parchment/60">2 a 3 dias úteis</span>
                    </div>
                    <span className="font-bold text-bazar-gold">
                      R$ 34,00
                    </span>
                  </label>
                </div>
              </div>

              {/* Etapa 3: Forma de Pagamento */}
              <div className="bg-bazar-charcoal-light p-6 rounded-2xl border border-bazar-charcoal-border space-y-4">
                <h2 className="font-mystic text-sm font-bold text-bazar-gold uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> 3. Pagamento
                </h2>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3.5 rounded-xl border font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-sm'
                        : 'border-bazar-charcoal-border bg-bazar-charcoal text-bazar-parchment/60 hover:text-bazar-parchment'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>PIX Instantâneo</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                      5% DE DESCONTO
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3.5 rounded-xl border font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-bazar-gold bg-bazar-charcoal text-bazar-gold shadow-sm'
                        : 'border-bazar-charcoal-border bg-bazar-charcoal text-bazar-parchment/60 hover:text-bazar-parchment'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Cartão de Crédito</span>
                    <span className="text-[10px] text-bazar-parchment/50">
                      Até 6x sem juros
                    </span>
                  </button>
                </div>

                {paymentMethod === 'pix' && (
                  <div className="p-4 rounded-xl bg-bazar-charcoal border border-emerald-500/40 text-xs space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>Desconto de 5% aplicado no PIX!</span>
                    </div>
                    <p className="text-bazar-parchment/80 leading-relaxed">
                      Ao clicar em &quot;Concluir Ritual&quot;, geraremos o QR Code e o código Pix Copia e Cola para pagamento imediato.
                    </p>
                  </div>
                )}

                {paymentMethod === 'credit_card' && (
                  <div className="p-4 rounded-xl bg-bazar-charcoal border border-bazar-charcoal-border text-xs space-y-3">
                    <div>
                      <label className="text-bazar-parchment/70 block mb-1">Número do Cartão</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-bazar-parchment/70 block mb-1">Validade</label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-bazar-parchment/70 block mb-1">CVV</label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna Direita: Resumo + ORDER BUMP (5 colunas) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* ORDER BUMP */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-bazar-purple/50 to-bazar-charcoal-light border-2 border-dashed border-bazar-gold/60 space-y-3 shadow-mystic">
                <div className="flex items-center gap-2 text-bazar-gold font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Oferta Exclusiva de Checkout
                </div>
                
                <h3 className="font-mystic text-base font-bold text-bazar-parchment">
                  Quer completar seu ritual?
                </h3>
                
                <p className="text-xs text-bazar-parchment/80 leading-relaxed font-editorial text-sm">
                  Adicione uma caixa de <strong>Incenso Botânico Artesanal de Lavanda & Mirra</strong> de <s>R$ 24,90</s> por apenas <strong>R$ 14,90</strong>.
                </p>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-bazar-charcoal border border-bazar-gold/40 cursor-pointer hover:border-bazar-gold transition-colors">
                  <input
                    type="checkbox"
                    checked={orderBumpSelected}
                    onChange={(e) => setOrderBumpSelected(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-bazar-gold text-bazar-wine focus:ring-bazar-gold cursor-pointer accent-bazar-wine"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-bazar-parchment block">
                      SIM! Quero adicionar o Incenso por apenas R$ 14,90
                    </span>
                    <span className="text-[11px] text-emerald-400">
                      Economize R$ 10,00 no mesmo frete.
                    </span>
                  </div>
                </label>
              </div>

              {/* Resumo Financeiro */}
              <div className="bg-bazar-charcoal-light p-6 rounded-2xl border border-bazar-charcoal-border space-y-4 shadow-mystic">
                <h3 className="font-mystic text-base font-bold text-bazar-parchment uppercase tracking-wider border-b border-bazar-charcoal-border pb-3">
                  Seus Achados ({items.length})
                </h3>

                <div className="divide-y divide-bazar-charcoal-border max-h-48 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={product.images[0]} alt={product.name} className="w-9 h-9 object-cover rounded border border-bazar-charcoal-border shrink-0" />
                        <span className="text-bazar-parchment truncate">{quantity}x {product.name}</span>
                      </div>
                      <span className="font-bold text-bazar-gold ml-2 shrink-0">
                        {formatCurrency((product.promotionalPrice || product.price) * quantity)}
                      </span>
                    </div>
                  ))}
                  {orderBumpSelected && (
                    <div className="py-2.5 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                      <span>1x Incenso Botânico Lavanda (Order Bump)</span>
                      <span>{formatCurrency(orderBumpPrice)}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs text-bazar-parchment/80 pt-3 border-t border-bazar-charcoal-border">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(currentSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Cupom ({coupon})</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span>
                      {shippingCost === 0 ? (
                        <strong className="text-emerald-400">GRÁTIS</strong>
                      ) : (
                        formatCurrency(shippingCost)
                      )}
                    </span>
                  </div>
                  {pixDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Desconto PIX (5%)</span>
                      <span>-{formatCurrency(pixDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-bazar-parchment pt-3 border-t border-bazar-charcoal-border">
                    <span className="font-mystic">Total a Pagar</span>
                    <span className="text-bazar-gold text-2xl font-extrabold">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment text-xs font-extrabold tracking-widest uppercase flex items-center justify-center gap-2 shadow-mystic border border-bazar-gold/50 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>CONSAGRANDO PEDIDO...</span>
                  ) : (
                    <>
                      <span>CONCLUIR MEU RITUAL</span>
                      <ArrowRight className="w-4 h-4 text-bazar-gold" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-bazar-parchment/50 text-center flex items-center justify-center gap-1.5 pt-1">
                  <Lock className="w-3.5 h-3.5 text-bazar-gold" />
                  Transação protegida com criptografia SSL 256 bits
                </p>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
