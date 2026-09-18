'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  Filter,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { Order } from '@/types';
import { formatCurrency } from '@/utils/currency';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bazar_orders') || '[]');
      setOrders(Array.isArray(saved) ? saved : []);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: Order['orderStatus']) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, orderStatus: newStatus } : o
    );
    setOrders(updated);
    try {
      localStorage.setItem('bazar_orders', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleUpdateTracking = (orderId: string, trackingCode: string) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, trackingCode } : o
    );
    setOrders(updated);
    try {
      localStorage.setItem('bazar_orders', JSON.stringify(updated));
    } catch (e) {}
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.orderStatus === filterStatus;
    const matchesSearch =
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-bazar-charcoal-border">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-mystic text-2xl font-bold text-bazar-parchment">
              Gestão de Pedidos
            </h1>
            <p className="text-xs text-bazar-parchment/60">
              Controle de status, despacho e código de rastreamento
            </p>
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-bazar-gold absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por código ou cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl pl-9 pr-3 py-2 text-xs text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none focus:border-bazar-gold"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2 text-xs text-bazar-parchment focus:outline-none focus:border-bazar-gold"
          >
            <option value="all">Todos os Status</option>
            <option value="recebido">Recebido</option>
            <option value="preparando">Preparando</option>
            <option value="despachado">Despachado</option>
            <option value="entregue">Entregue</option>
          </select>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {!loading && orders.length === 0 ? (
        <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border p-16 text-center space-y-4 shadow-mystic">
          <div className="flex justify-center">
            <div className="p-5 rounded-full bg-bazar-charcoal border border-bazar-charcoal-border">
              <ShoppingBag className="w-8 h-8 text-bazar-gold/50" />
            </div>
          </div>
          <div>
            <h3 className="font-mystic text-lg font-bold text-bazar-parchment/80 mb-1">
              Nenhum pedido registrado ainda
            </h3>
            <p className="text-xs text-bazar-parchment/50 max-w-sm mx-auto font-editorial italic">
              ✦ Os pedidos realizados pelos clientes no checkout aparecerão aqui assim que forem confirmados. ✦
            </p>
          </div>
        </div>
      ) : (
      <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border divide-y divide-bazar-charcoal-border overflow-hidden">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-base text-bazar-gold">
                      #{order.code}
                    </span>
                    <span className="text-sm font-bold text-bazar-parchment">
                      {order.customer.name}
                    </span>
                    <span className="text-xs text-bazar-parchment/60">
                      ({order.customer.email} • {order.customer.phone})
                    </span>
                  </div>
                  <p className="text-xs text-bazar-parchment/60 mt-1">
                    Entrega: {order.customer.address.street}, {order.customer.address.number} - {order.customer.address.city}/{order.customer.address.state} (CEP: {order.customer.address.zipCode})
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-bazar-parchment/60 block">Total</span>
                    <strong className="text-sm text-bazar-gold font-bold">
                      {formatCurrency(order.total)}
                    </strong>
                  </div>

                  {/* Seletor de Status */}
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['orderStatus'])}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase border focus:outline-none ${
                      order.orderStatus === 'despachado'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : order.orderStatus === 'preparando'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                        : order.orderStatus === 'entregue'
                        ? 'bg-blue-950/80 text-blue-300 border-blue-500/50'
                        : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50'
                    }`}
                  >
                    <option value="recebido">Recebido</option>
                    <option value="preparando">Preparando</option>
                    <option value="despachado">Despachado</option>
                    <option value="entregue">Entregue</option>
                  </select>
                </div>
              </div>

              {/* Detalhes dos Itens + Rastreio */}
              <div className="p-4 bg-bazar-charcoal rounded-2xl border border-bazar-charcoal-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-bazar-parchment/80 block">Itens da Encomenda:</span>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((it, idx) => (
                      <span key={idx} className="bg-bazar-charcoal-light border border-bazar-charcoal-border px-2.5 py-1 rounded-lg text-bazar-parchment/90">
                        {it.quantity}x {it.productName} ({formatCurrency(it.price)})
                      </span>
                    ))}
                    {order.orderBumpAccepted && (
                      <span className="bg-bazar-purple/50 border border-bazar-gold/30 text-bazar-gold px-2.5 py-1 rounded-lg">
                        + Order Bump Incenso
                      </span>
                    )}
                  </div>
                </div>

                {/* Código de Rastreamento */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Truck className="w-4 h-4 text-bazar-gold shrink-0" />
                  <input
                    type="text"
                    placeholder="Inserir código de rastreio"
                    defaultValue={order.trackingCode || ''}
                    onBlur={(e) => handleUpdateTracking(order.id, e.target.value)}
                    className="bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-lg px-2.5 py-1 text-xs text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none focus:border-bazar-gold w-full md:w-44 font-mono"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-xs text-bazar-parchment/60">Nenhum pedido encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
      )}

    </div>
  );
}
