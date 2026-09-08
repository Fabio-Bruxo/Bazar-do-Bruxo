import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, Package, CheckCircle2, Clock, Factory } from 'lucide-react';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';

export default function AdminDropshippingPage() {
  const dropProducts = ALL_INITIAL_PRODUCTS.filter((p) => p.type === 'dropshipping');

  const pipelineSteps = [
    { step: '1', title: 'Cliente compra no Bazar', desc: 'Pedido registrado na plataforma' },
    { step: '2', title: 'Pagamento aprovado', desc: 'PIX ou Cartão validado com sucesso' },
    { step: '3', title: 'Fornecedor identificado', desc: 'Envio automático dos dados de entrega ao parceiro' },
    { step: '4', title: 'Fornecedor despacha', desc: 'Embalagem e despacho com prazo de 2 a 7 dias' },
    { step: '5', title: 'Tracking recebido', desc: 'Código de rastreio inserido no sistema' },
    { step: '6', title: 'Cliente notificado', desc: 'Envio automático por WhatsApp e E-mail' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Topo */}
      <div className="flex items-center gap-3 pb-4 border-b border-bazar-charcoal-border">
        <Link href="/admin" className="p-2 rounded-xl bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-mystic text-2xl font-bold text-bazar-parchment">
            Estrutura de Dropshipping & Fornecedores
          </h1>
          <p className="text-xs text-bazar-parchment/60">
            Fluxo operacional com fornecedores nacionais homologados
          </p>
        </div>
      </div>

      {/* Fluxo Visual de Dropshipping */}
      <div className="bg-bazar-charcoal-light p-6 rounded-3xl border border-bazar-charcoal-border space-y-4">
        <h2 className="font-mystic text-sm font-bold text-bazar-gold uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4" /> Fluxo Automatizado de Pedidos Dropshipping
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipelineSteps.map((s) => (
            <div key={s.step} className="p-3.5 bg-bazar-charcoal rounded-2xl border border-bazar-charcoal-border flex flex-col justify-between">
              <span className="w-6 h-6 rounded-full bg-bazar-wine text-bazar-parchment font-bold text-xs flex items-center justify-center border border-bazar-gold/40 mb-2">
                {s.step}
              </span>
              <div>
                <h3 className="text-xs font-bold text-bazar-parchment">{s.title}</h3>
                <p className="text-[11px] text-bazar-parchment/60 mt-1 leading-tight">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fornecedores Homologados & Produtos Vinculados */}
      <div className="bg-bazar-charcoal-light p-6 rounded-3xl border border-bazar-charcoal-border space-y-4">
        <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase tracking-wider flex items-center gap-2">
          <Factory className="w-4 h-4 text-bazar-gold" /> Produtos Operados em Dropshipping
        </h2>
        
        <div className="divide-y divide-bazar-charcoal-border">
          {dropProducts.map((p) => (
            <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-bazar-charcoal-border" />
                <div>
                  <h3 className="font-bold text-bazar-parchment">{p.name}</h3>
                  <p className="text-bazar-parchment/60 text-[11px]">
                    SKU: {p.sku} • Custo do Produto: R$ {p.costPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-right sm:text-right">
                <span className="font-semibold text-bazar-gold block">
                  {p.supplier?.name || 'Fornecedor Certificado'}
                </span>
                <span className="text-bazar-parchment/60 text-[11px] block">
                  Prazo de despacho médio: {p.supplier?.leadTimeDays || 3} dias
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
