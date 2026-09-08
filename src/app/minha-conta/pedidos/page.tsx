'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  MessageCircle, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { INITIAL_ORDERS, ALL_INITIAL_PRODUCTS } from '@/data/db';
import { Order } from '@/types';
import { formatCurrency } from '@/utils/currency';

export default function MinhasComprasPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedOrders: Order[] = JSON.parse(localStorage.getItem('bazar_orders') || '[]');
      const allOrders = savedOrders.length > 0 ? savedOrders : INITIAL_ORDERS;
      // Filtrar pedidos vinculados ao usuário
      const userOrders = allOrders.filter(
        (o) => o.customer.email.toLowerCase() === user?.email.toLowerCase()
      );
      setOrders(userOrders.length > 0 ? userOrders : allOrders);
      if (userOrders.length > 0 || allOrders.length > 0) {
        setExpandedOrder((userOrders[0] || allOrders[0]).id);
      }
    } catch (e) {
      setOrders(INITIAL_ORDERS);
    }
  }, [user]);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const product = ALL_INITIAL_PRODUCTS.find((p) => p.id === item.productId);
      if (product) {
        addToCart(product, item.quantity);
      }
    });
    alert('Itens adicionados ao seu carrinho com sucesso!');
  };

  const getTimelineSteps = (status: Order['orderStatus']) => {
    const steps = [
      { key: 'recebido', label: 'Recebido pelo Bazar', desc: 'Pagamento confirmado e pedido registrado' },
      { key: 'preparando', label: 'Preparando no Ateliê', desc: 'Seleção, purificação mineral e embalagem rústica' },
      { key: 'despachado', label: 'Despachado com os Correios', desc: 'Em trânsito para o seu endereço' },
      { key: 'entregue', label: 'Entregue ao seu Santuário', desc: 'Pacote entregue com sucesso' },
    ];

    const statusHierarchy: Record<Order['orderStatus'], number> = {
      recebido: 1,
      preparando: 2,
      despachado: 3,
      entregue: 4,
    };

    const currentLevel = statusHierarchy[status] || 1;

    return steps.map((s, idx) => ({
      ...s,
      isCompleted: idx + 1 <= currentLevel,
      isCurrent: idx + 1 === currentLevel,
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="pb-4 border-b border-bazar-charcoal-border">
        <h1 className="font-mystic text-xl sm:text-2xl font-bold text-bazar-parchment">
          Minhas Compras & Rituais Encomendados
        </h1>
        <p className="text-xs text-bazar-parchment/60 mt-0.5">
          Acompanhe o trajeto de cada cristal e consulte detalhes das suas aquisições.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-bazar-charcoal-light/40 rounded-3xl border border-bazar-charcoal-border p-8">
          <Package className="w-12 h-12 text-bazar-parchment/30 mx-auto mb-3" />
          <h2 className="font-mystic text-base font-bold text-bazar-parchment">
            Você ainda não possui pedidos
          </h2>
          <p className="text-xs text-bazar-parchment/60 mt-1 mb-6 max-w-sm mx-auto">
            Quando você consagrar seu primeiro achado no Bazar, o trajeto completo aparecerá nesta página.
          </p>
          <Link
            href="/cristais"
            className="px-6 py-2.5 bg-bazar-wine text-bazar-parchment text-xs font-bold rounded-xl hover:bg-bazar-wine-light transition-colors"
          >
            EXPLORAR CRISTAIS
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const timeline = getTimelineSteps(order.orderStatus);

            return (
              <div
                key={order.id}
                className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border overflow-hidden shadow-mystic transition-all"
              >
                {/* Cabeçalho do Card de Pedido */}
                <div 
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="p-5 sm:p-6 bg-bazar-charcoal-light hover:bg-bazar-charcoal/60 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bazar-charcoal-border/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-base text-bazar-gold">
                        #{order.code}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.orderStatus === 'despachado'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          : order.orderStatus === 'preparando'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          : order.orderStatus === 'entregue'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40'
                          : 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-bazar-parchment/60">
                      Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')} • {order.paymentMethod.toUpperCase()} • {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-bazar-parchment/50 block">Valor Total</span>
                      <span className="text-base font-extrabold text-bazar-gold">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                    <div className="p-1 rounded-full bg-bazar-charcoal text-bazar-parchment/60">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Conteúdo Expandido do Pedido */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 space-y-6 animate-in fade-in duration-300">
                    
                    {/* LINHA DO TEMPO DO RASTREAMENTO */}
                    <div className="p-5 rounded-2xl bg-bazar-charcoal border border-bazar-charcoal-border space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-bazar-gold flex items-center gap-1.5">
                          <Truck className="w-4 h-4" /> Trajeto da Encomenda
                        </span>
                        {order.trackingCode && (
                          <span className="text-xs text-bazar-parchment/70 font-mono">
                            Código: <strong className="text-emerald-400 font-bold">{order.trackingCode}</strong>
                          </span>
                        )}
                      </div>

                      {/* Timeline Visual em Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                        {timeline.map((step, idx) => (
                          <div key={idx} className="relative flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                            <div className="flex items-center">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                                step.isCompleted
                                  ? 'bg-emerald-500 text-bazar-charcoal border-emerald-400 shadow-sm'
                                  : 'bg-bazar-charcoal-light text-bazar-parchment/40 border-bazar-charcoal-border'
                              }`}>
                                {step.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                              </div>
                            </div>
                            <div className="min-w-0">
                              <p className={`text-xs font-bold ${step.isCompleted ? 'text-bazar-parchment' : 'text-bazar-parchment/40'}`}>
                                {step.label}
                              </p>
                              <p className="text-[10px] text-bazar-parchment/50 leading-tight mt-0.5">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lista dos Itens do Pedido */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-bazar-parchment/80">
                        Achados Deste Pedido
                      </h4>
                      <div className="divide-y divide-bazar-charcoal-border border border-bazar-charcoal-border rounded-2xl overflow-hidden bg-bazar-charcoal">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="p-3 sm:p-4 flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-12 h-12 object-cover rounded-xl border border-bazar-charcoal-border shrink-0"
                              />
                              <div className="truncate">
                                <p className="font-bold text-bazar-parchment truncate">{item.productName}</p>
                                <p className="text-bazar-parchment/60 text-[11px] mt-0.5">
                                  Quantidade: {item.quantity} • Unitário: {formatCurrency(item.price)}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-bazar-gold shrink-0">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}

                        {order.orderBumpAccepted && (
                          <div className="p-3 sm:p-4 bg-bazar-purple/20 flex items-center justify-between text-xs text-bazar-gold">
                            <span>Oferta de Checkout: Incenso Botânico Artesanal</span>
                            <span className="font-bold">R$ 14,90</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dados de Entrega e Ações Rápidas */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-bazar-charcoal-border text-xs">
                      <div className="text-bazar-parchment/70 text-center sm:text-left">
                        <span className="block font-semibold">Endereço de Destino:</span>
                        <span>{order.customer.address.street}, {order.customer.address.number} - {order.customer.address.city}/{order.customer.address.state}</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleReorder(order)}
                          className="flex-1 sm:flex-initial px-4 py-2 bg-bazar-charcoal border border-bazar-gold/50 text-bazar-gold hover:bg-bazar-wine hover:text-bazar-parchment rounded-xl font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Pedir Novamente</span>
                        </button>

                        <a
                          href={`https://wa.me/5513998039867?text=${encodeURIComponent(`Olá! Gostaria de uma informação sobre o meu pedido #${order.code}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Ajuda com este Pedido</span>
                        </a>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
