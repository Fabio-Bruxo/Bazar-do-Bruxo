'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Package, 
  Truck, 
  ArrowUpRight, 
  CheckCircle2,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { INITIAL_ORDERS, INITIAL_LEADS, ALL_INITIAL_PRODUCTS } from '@/data/db';
import { Order, Lead, Product } from '@/types';
import { formatCurrency } from '@/utils/currency';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('bazar_orders') || '[]');
      setOrders(savedOrders.length > 0 ? savedOrders : INITIAL_ORDERS);

      const savedLeads = JSON.parse(localStorage.getItem('bazar_leads') || '[]');
      setLeads(savedLeads.length > 0 ? savedLeads : INITIAL_LEADS);
    } catch (e) {
      setOrders(INITIAL_ORDERS);
      setLeads(INITIAL_LEADS);
    }
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const averageTicket = orders.length > 0 ? totalRevenue / orders.length : 0;
  const upsellAcceptedCount = orders.filter((o) => o.orderBumpAccepted || o.postPurchaseUpsellAccepted).length;
  const upsellRate = orders.length > 0 ? Math.round((upsellAcceptedCount / orders.length) * 100) : 0;

  const pendingReviewProducts = ALL_INITIAL_PRODUCTS.filter((p) => p.commercialStatus === 'revisao' || p.commercialStatus === 'restrito');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-bazar-charcoal-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-bazar-gold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Altar de Gestão Comercial
          </div>
          <h1 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment">
            PAINEL ADMINISTRATIVO DO BAZAR
          </h1>
        </div>

        {/* Links Rápidos */}
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/admin/pedidos"
            className="px-3.5 py-2 bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment rounded-xl transition-colors font-medium"
          >
            Gestão de Pedidos
          </Link>
          <Link
            href="/admin/produtos"
            className="px-3.5 py-2 bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment rounded-xl transition-colors font-medium"
          >
            Catálogo & Custos
          </Link>
          <Link
            href="/admin/dropshipping"
            className="px-3.5 py-2 bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment rounded-xl transition-colors font-medium"
          >
            Dropshipping & Fornecedores
          </Link>
          <Link
            href="/admin/leads"
            className="px-3.5 py-2 bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment rounded-xl transition-colors font-medium"
          >
            Leads do Círculo
          </Link>
          <Link
            href="/admin/excecoes"
            className="px-3.5 py-2 bg-red-950/40 border border-red-500/40 hover:border-red-400 text-red-200 rounded-xl transition-colors font-medium flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            Precisa de Atenção
          </Link>
          <Link
            href="/admin/tickets"
            className="px-3.5 py-2 bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 text-amber-200 rounded-xl transition-colors font-medium"
          >
            Fila Humana
          </Link>
          <Link
            href="/guardiao"
            className="px-3.5 py-2 bg-bazar-gold/10 border border-bazar-gold/30 hover:border-bazar-gold text-bazar-gold rounded-xl transition-colors font-medium"
          >
            Bot Guardião
          </Link>
        </div>
      </div>

      {/* Alerta de Produtos em Revisão Regulatória */}
      {pendingReviewProducts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              Existem <strong>{pendingReviewProducts.length}</strong> produtos classificados como <em>Revisão / Restrito</em> aguardando validação técnica.
            </span>
          </div>
          <Link
            href="/admin/produtos"
            className="px-3 py-1.5 bg-amber-900/60 border border-amber-500/60 text-amber-200 rounded-lg hover:bg-amber-800 transition-colors font-semibold"
          >
            Revisar Itens
          </Link>
        </div>
      )}

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Faturamento Bruto */}
        <div className="p-5 bg-bazar-charcoal-light rounded-2xl border border-bazar-charcoal-border space-y-2">
          <div className="flex items-center justify-between text-xs text-bazar-parchment/60 font-semibold uppercase tracking-wider">
            <span>Faturamento Bruto</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-bazar-parchment font-mystic">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs semana anterior
          </p>
        </div>

        {/* Total de Pedidos */}
        <div className="p-5 bg-bazar-charcoal-light rounded-2xl border border-bazar-charcoal-border space-y-2">
          <div className="flex items-center justify-between text-xs text-bazar-parchment/60 font-semibold uppercase tracking-wider">
            <span>Total de Pedidos</span>
            <ShoppingBag className="w-4 h-4 text-bazar-gold" />
          </div>
          <p className="text-2xl font-extrabold text-bazar-parchment font-mystic">
            {orders.length}
          </p>
          <p className="text-[11px] text-bazar-parchment/60">
            {orders.filter((o) => o.orderStatus === 'preparando' || o.orderStatus === 'recebido').length} aguardando envio
          </p>
        </div>

        {/* Ticket Médio */}
        <div className="p-5 bg-bazar-charcoal-light rounded-2xl border border-bazar-charcoal-border space-y-2">
          <div className="flex items-center justify-between text-xs text-bazar-parchment/60 font-semibold uppercase tracking-wider">
            <span>Ticket Médio</span>
            <Sparkles className="w-4 h-4 text-bazar-wine" />
          </div>
          <p className="text-2xl font-extrabold text-bazar-parchment font-mystic">
            {formatCurrency(averageTicket)}
          </p>
          <p className="text-[11px] text-bazar-parchment/60">
            Meta desejada: R$ 150,00
          </p>
        </div>

        {/* Taxa de Upsell & Order Bump */}
        <div className="p-5 bg-bazar-charcoal-light rounded-2xl border border-bazar-charcoal-border space-y-2">
          <div className="flex items-center justify-between text-xs text-bazar-parchment/60 font-semibold uppercase tracking-wider">
            <span>Taxa de Upsell / Bump</span>
            <Package className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-bazar-gold font-mystic">
            {upsellRate}%
          </p>
          <p className="text-[11px] text-emerald-400 font-semibold">
            {upsellAcceptedCount} pedidos aceitaram complementares
          </p>
        </div>

      </div>

      {/* Grid Secundário: Últimos Pedidos + Leads Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Últimos Pedidos (8 colunas) */}
        <div className="lg:col-span-8 bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-bazar-charcoal-border">
            <h2 className="font-mystic text-base font-bold text-bazar-parchment uppercase tracking-wider">
              Últimos Pedidos do Bazar
            </h2>
            <Link href="/admin/pedidos" className="text-xs text-bazar-gold hover:underline flex items-center gap-1">
              <span>Ver todos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-bazar-charcoal-border">
            {orders.slice(0, 5).map((ord) => (
              <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-bazar-gold">{ord.code}</span>
                    <span className="text-bazar-parchment font-semibold">{ord.customer.name}</span>
                  </div>
                  <p className="text-bazar-parchment/60 text-[11px] mt-0.5">
                    {ord.items.length} {ord.items.length === 1 ? 'item' : 'itens'} • {ord.paymentMethod.toUpperCase()} • {ord.customer.address.city}/{ord.customer.address.state}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="font-bold text-bazar-parchment">
                    {formatCurrency(ord.total)}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    ord.orderStatus === 'despachado'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : ord.orderStatus === 'preparando'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      : 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40'
                  }`}>
                    {ord.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads Recentes do Quiz & Newsletter (4 colunas) */}
        <div className="lg:col-span-4 bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-bazar-charcoal-border">
            <h2 className="font-mystic text-base font-bold text-bazar-parchment uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-bazar-gold" />
              <span>Leads do Círculo</span>
            </h2>
            <Link href="/admin/leads" className="text-xs text-bazar-gold hover:underline">
              Ver lista ({leads.length})
            </Link>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="p-3 bg-bazar-charcoal rounded-xl border border-bazar-charcoal-border text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-bazar-parchment">{lead.name}</span>
                  <span className="text-[10px] bg-bazar-wine/60 text-bazar-gold px-1.5 py-0.2 rounded">
                    {lead.source}
                  </span>
                </div>
                <p className="text-bazar-parchment/60 text-[11px] truncate">{lead.email}</p>
                {lead.quizResult && (
                  <p className="text-[10px] text-emerald-400 font-medium">
                    Resultado: Cristal de {lead.quizResult}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
