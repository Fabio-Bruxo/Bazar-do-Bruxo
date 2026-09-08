'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import { Product, CommercialStatus } from '@/types';
import { formatCurrency } from '@/utils/currency';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(ALL_INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleStatusChange = (productId: string, newStatus: CommercialStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, commercialStatus: newStatus } : p))
    );
  };

  const filteredProducts = products.filter((p) => {
    const matchesStatus = filterStatus === 'all' || p.commercialStatus === filterStatus;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
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
              Catálogo, Precificação & Compliance
            </h1>
            <p className="text-xs text-bazar-parchment/60">
              Controle de custos, margem mínima e moderação regulatória de comercialização
            </p>
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-bazar-gold absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nome, SKU..."
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
            <option value="ativo">Ativo</option>
            <option value="revisao">Revisão Regulatória</option>
            <option value="restrito">Restrito</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border overflow-hidden shadow-mystic">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-bazar-parchment divide-y divide-bazar-charcoal-border">
            <thead className="bg-bazar-charcoal text-bazar-parchment/60 uppercase font-bold tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Achado / SKU</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Custo</th>
                <th className="py-3 px-4">Preço Venda</th>
                <th className="py-3 px-4">Margem Bruta</th>
                <th className="py-3 px-4">Preço Mínimo</th>
                <th className="py-3 px-4">Status Comercial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bazar-charcoal-border">
              {filteredProducts.map((p) => {
                const currentPrice = p.promotionalPrice || p.price;
                const marginPercent = p.costPrice > 0 
                  ? Math.round(((currentPrice - p.costPrice) / currentPrice) * 100) 
                  : 100;
                const isBelowMin = currentPrice < p.minAllowedPrice;

                return (
                  <tr key={p.id} className="hover:bg-bazar-charcoal/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg border border-bazar-charcoal-border shrink-0"
                        />
                        <div className="min-w-0">
                          <Link href={`/produto/${p.slug}`} className="font-bold text-bazar-parchment hover:text-bazar-gold truncate block">
                            {p.name}
                          </Link>
                          <span className="text-[10px] text-bazar-parchment/50 font-mono">
                            {p.sku} • {p.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.type === 'dropshipping'
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                          : p.type === 'afiliado'
                          ? 'bg-purple-950/70 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {p.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-bazar-parchment/70">
                      {p.costPrice > 0 ? formatCurrency(p.costPrice) : 'N/A'}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-bazar-gold">
                      {formatCurrency(currentPrice)}
                      {p.promotionalPrice && (
                        <span className="block text-[10px] text-rose-400">Promoção</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${marginPercent < 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {marginPercent}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-bazar-parchment/60">
                        {formatCurrency(p.minAllowedPrice)}
                      </span>
                      {isBelowMin && (
                        <span className="flex items-center gap-1 text-[10px] text-rose-400 font-bold mt-0.5">
                          <AlertTriangle className="w-3 h-3" /> Abaixo da margem
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={p.commercialStatus}
                        onChange={(e) => handleStatusChange(p.id, e.target.value as CommercialStatus)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase border focus:outline-none ${
                          p.commercialStatus === 'ativo'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                            : p.commercialStatus === 'revisao'
                            ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                            : p.commercialStatus === 'restrito'
                            ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-600'
                        }`}
                      >
                        <option value="ativo">Ativo</option>
                        <option value="revisao">Revisão</option>
                        <option value="restrito">Restrito</option>
                        <option value="inativo">Inativo</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
