'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Heart, 
  MapPin, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { INITIAL_ORDERS } from '@/data/db';
import { Order } from '@/types';
import { formatCurrency } from '@/utils/currency';

export default function MinhaContaPage() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const savedOrders: Order[] = JSON.parse(localStorage.getItem('bazar_orders') || '[]');
      const allOrders = savedOrders.length > 0 ? savedOrders : INITIAL_ORDERS;
      // Filtrar pedidos deste usuário (por e-mail ou se for a Helena)
      const userOrders = allOrders.filter(
        (o) => o.customer.email.toLowerCase() === user?.email.toLowerCase()
      );
      setOrders(userOrders.length > 0 ? userOrders : allOrders.slice(0, 2));
    } catch (e) {
      setOrders(INITIAL_ORDERS);
    }
  }, [user]);

  const latestOrder = orders[0];

  return (
    <div className="space-y-6">
      
      {/* Boas-Vindas */}
      <div className="bg-gradient-to-r from-bazar-wine-deep via-bazar-charcoal-light to-bazar-purple p-6 sm:p-8 rounded-3xl border border-bazar-gold/50 shadow-mystic">
        <span className="text-xs font-bold uppercase tracking-widest text-bazar-gold block mb-1">
          Seu Espaço Sagrado
        </span>
        <h1 className="font-mystic text-xl sm:text-2xl font-bold text-bazar-parchment">
          Seja bem-vindo(a), {user?.name.split(' ')[0]}!
        </h1>
        <p className="text-xs sm:text-sm text-bazar-parchment/75 mt-1 font-editorial text-base leading-relaxed">
          Aqui você pode acompanhar a jornada de envio de cada cristal, consultar seus recibos e atualizar o endereço do seu santuário.
        </p>
      </div>

      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/minha-conta/pedidos"
          className="p-5 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold/50 transition-colors group flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-bold text-bazar-parchment/60 uppercase tracking-wider block">
              Minhas Compras
            </span>
            <span className="text-2xl font-bold text-bazar-parchment font-mystic mt-1 block">
              {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-bazar-charcoal text-bazar-gold group-hover:scale-110 transition-transform">
            <Package className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/favoritos"
          className="p-5 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold/50 transition-colors group flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-bold text-bazar-parchment/60 uppercase tracking-wider block">
              Achados Salvos
            </span>
            <span className="text-2xl font-bold text-bazar-parchment font-mystic mt-1 block">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-bazar-charcoal text-bazar-gold group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/minha-conta/enderecos"
          className="p-5 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold/50 transition-colors group flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-bold text-bazar-parchment/60 uppercase tracking-wider block">
              Endereço Padrão
            </span>
            <span className="text-xs font-semibold text-bazar-parchment mt-1 block truncate max-w-[130px]">
              {user?.address.city} - {user?.address.state}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-bazar-charcoal text-bazar-gold group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* Última Encomenda em Andamento */}
      {latestOrder && (
        <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border p-6 space-y-4 shadow-mystic">
          <div className="flex items-center justify-between pb-3 border-b border-bazar-charcoal-border">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-bazar-gold" />
              <h2 className="font-mystic text-sm font-bold text-bazar-parchment uppercase tracking-wider">
                Última Encomenda do Bazar
              </h2>
            </div>
            <Link
              href="/minha-conta/pedidos"
              className="text-xs text-bazar-gold hover:underline font-semibold"
            >
              Ver Todas as Compras →
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-bazar-gold">
                  #{latestOrder.code}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  latestOrder.orderStatus === 'despachado'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : latestOrder.orderStatus === 'preparando'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                    : 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40'
                }`}>
                  {latestOrder.orderStatus}
                </span>
              </div>
              <p className="text-xs text-bazar-parchment/60 mt-1">
                Realizado em {new Date(latestOrder.createdAt).toLocaleDateString('pt-BR')} • Total: {formatCurrency(latestOrder.total)}
              </p>
              {latestOrder.trackingCode && (
                <p className="text-[11px] text-emerald-400 font-mono mt-1">
                  Código de Rastreio: <strong>{latestOrder.trackingCode}</strong>
                </p>
              )}
            </div>

            <Link
              href="/minha-conta/pedidos"
              className="px-4 py-2 bg-bazar-charcoal border border-bazar-gold/50 text-bazar-gold hover:bg-bazar-gold hover:text-bazar-charcoal text-xs font-bold rounded-xl transition-colors self-start sm:self-auto text-center"
            >
              Acompanhar Linha do Tempo
            </Link>
          </div>

          {/* Miniatura dos itens */}
          <div className="pt-2 flex gap-2 overflow-x-auto">
            {latestOrder.items.map((it, idx) => (
              <img
                key={idx}
                src={it.image}
                alt={it.productName}
                title={it.productName}
                className="w-12 h-12 object-cover rounded-xl border border-bazar-charcoal-border shrink-0"
              />
            ))}
          </div>
        </div>
      )}

      {/* Convite para o Quiz ou Catálogo */}
      <div className="p-6 rounded-3xl bg-bazar-charcoal border border-bazar-charcoal-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-bazar-gold uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
            <Sparkles className="w-3.5 h-3.5" /> Bússola Arcana
          </span>
          <h3 className="font-mystic text-sm font-bold text-bazar-parchment">
            Seu momento mudou? Encontre um novo cristal guardião
          </h3>
          <p className="text-xs text-bazar-parchment/60">
            Refaça o Quiz do Cristal com novas intenções para receber recomendações atualizadas.
          </p>
        </div>
        <Link
          href="/quiz"
          className="px-5 py-2.5 rounded-xl bg-bazar-wine hover:bg-bazar-wine-light text-bazar-parchment text-xs font-bold tracking-wider transition-colors shrink-0"
        >
          REFAZER O QUIZ
        </Link>
      </div>

    </div>
  );
}
