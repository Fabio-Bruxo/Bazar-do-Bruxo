'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  QrCode, 
  Sparkles, 
  MessageCircle, 
  ShoppingBag, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { ALL_INITIAL_PRODUCTS, INITIAL_ORDERS } from '@/data/db';
import { Order, Product } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { trackEvent } from '@/utils/analytics';

interface Props {
  params: { orderId: string };
}

export default function OrderSuccessPage({ params }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [upsellAccepted, setUpsellAccepted] = useState(false);

  const fakePixCode = '00020126580014br.gov.bcb.pix0136bazar-bruxo-pix-chave-aleatoria-9995204000053039865802BR5920O BAZAR DO BRUXO6009SAO PAULO62070503***6304ABCD';

  useEffect(() => {
    try {
      const savedOrders: Order[] = JSON.parse(localStorage.getItem('bazar_orders') || '[]');
      const found = savedOrders.find((o) => o.id === params.orderId) || INITIAL_ORDERS[0];
      setOrder(found);
    } catch (e) {
      setOrder(INITIAL_ORDERS[0]);
    }
    trackEvent('upsell_view');
  }, [params.orderId]);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(fakePixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  // Produtos para o Upsell Pós-Compra (Itens de alta afinidade)
  const upsellCandidates = ALL_INITIAL_PRODUCTS.filter(
    (p) => p.id === 'prod-18' || p.id === 'prod-06'
  );

  const handleAcceptUpsell = (product: Product) => {
    setUpsellAccepted(true);
    trackEvent('upsell_accept', { product_id: product.id, name: product.name });
  };

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-bazar-parchment/60">Carregando confirmação do ritual...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Mensagem de Boas-Vindas e Confirmação */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-mystic">
          <PackageCheck className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-bazar-gold tracking-widest uppercase block">
          Ritual Confirmado
        </span>
        <h1 className="font-mystic text-3xl sm:text-4xl font-extrabold text-bazar-parchment uppercase">
          SEU ACHADO JÁ É SEU
        </h1>
        <p className="font-editorial italic text-base sm:text-lg text-bazar-parchment/80">
          Pedido <strong>#{order.code}</strong> consagrado com sucesso. Nossos guardiões já estão preparando sua encomenda.
        </p>
      </div>

      {/* Bloco de Pagamento PIX (se método for PIX) */}
      {order.paymentMethod === 'pix' && (
        <div className="bg-bazar-charcoal-light border border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-mystic max-w-xl mx-auto space-y-5 text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <QrCode className="w-4 h-4" /> Pagamento via PIX Instantâneo
          </div>

          <p className="text-xs text-bazar-parchment/80 max-w-md mx-auto">
            Escaneie o QR Code abaixo pelo aplicativo do seu banco ou use a chave Copia e Cola para validar sua compra.
          </p>

          {/* QR Code Simulado Estilizado */}
          <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-md flex items-center justify-center border-4 border-bazar-gold/60">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://obazardobruxo.com.br"
              alt="QR Code do PIX"
              className="w-full h-full"
            />
          </div>

          <div className="text-xs">
            <span className="text-bazar-parchment/60 block mb-1">Total com 5% de desconto:</span>
            <strong className="text-2xl font-extrabold text-bazar-gold">
              {formatCurrency(order.total)}
            </strong>
          </div>

          {/* Botão Copiar Chave */}
          <div className="pt-2">
            <button
              onClick={handleCopyPix}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-sm transition-colors"
            >
              {copiedPix ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Código PIX Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPIAR CÓDIGO PIX COPIA E COLA</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* UPSELL PÓS-COMPRA: "SEU ACHADO JÁ É SEU. QUER COMPLETAR?" */}
      <div className="bg-gradient-to-r from-bazar-wine-deep via-bazar-charcoal-light to-bazar-purple p-6 sm:p-10 rounded-3xl border border-bazar-gold/60 shadow-mystic space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-bazar-gold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Oportunidade Especial de Envio
          </span>
          <h2 className="font-mystic text-xl sm:text-2xl font-bold text-bazar-parchment uppercase">
            SEU ACHADO JÁ É SEU. QUER COMPLETAR?
          </h2>
          <p className="text-xs sm:text-sm text-bazar-parchment/80 mt-1 font-editorial text-base">
            Como sua caixa ainda está sendo empacotada no ateliê, você pode incluir este item complementar sem pagar nenhum frete adicional.
          </p>
        </div>

        {upsellAccepted ? (
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-center max-w-md mx-auto space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
            <p className="text-xs font-bold text-emerald-300">
              Item adicionado ao seu pacote com sucesso!
            </p>
            <p className="text-[11px] text-bazar-parchment/70">
              O valor adicional foi anexado ao seu pedido sem custos de frete.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {upsellCandidates.map((product) => (
              <div
                key={product.id}
                className="p-4 bg-bazar-charcoal rounded-2xl border border-bazar-charcoal-border hover:border-bazar-gold/50 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-xl border border-bazar-charcoal-border shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-bazar-parchment">
                      {product.name}
                    </h4>
                    <p className="text-xs font-bold text-bazar-gold mt-0.5">
                      {formatCurrency(product.promotionalPrice || product.price)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAcceptUpsell(product)}
                  className="mt-3 w-full py-2 bg-bazar-wine hover:bg-bazar-wine-light text-bazar-parchment text-xs font-bold rounded-xl border border-bazar-gold/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-bazar-gold" />
                  <span>Incluir no Meu Envio Agora</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Acompanhamento via WhatsApp & Resumo */}
      <div className="p-6 bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-mystic text-sm font-bold text-bazar-parchment">
            Acompanhe seu pedido no WhatsApp
          </h3>
          <p className="text-xs text-bazar-parchment/70">
            Deseja receber notificações do rastreio diretamente no seu celular?
          </p>
        </div>
        <a
          href={`https://wa.me/5513998039867?text=${encodeURIComponent(`Olá! Acabei de fechar o pedido #${order.code} no Bazar do Bruxo e gostaria de acompanhar as atualizações.`)}`}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Falar com o Guardião</span>
        </a>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/"
          className="text-xs text-bazar-gold hover:text-bazar-gold-light underline tracking-wider uppercase font-semibold"
        >
          ← Voltar à Página Inicial do Bazar
        </Link>
      </div>

    </div>
  );
}
