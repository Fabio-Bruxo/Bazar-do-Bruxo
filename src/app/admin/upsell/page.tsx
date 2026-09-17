'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Plus,
  RefreshCw,
  Power,
  Trash2,
  Tag,
  ShoppingBag,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { UpsellRule } from '@/app/api/admin/upsells/route';
import { formatCurrency } from '@/utils/currency';

export default function AdminUpsellPage() {
  const [rules, setRules] = useState<UpsellRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'ORDER_BUMP' as 'ORDER_BUMP' | 'POST_PURCHASE' | 'CROSS_SELL',
    triggerCategory: 'all',
    offerProductName: '',
    offerPrice: 29.90,
    originalPrice: 49.90,
    discountPercent: 40,
    headline: 'Quer completar seu ritual com esta oferta sagrada?',
    description: 'Aproveite esta condição especial exclusiva para o seu pedido.',
  });

  const loadRules = () => {
    setIsLoading(true);
    fetch('/api/admin/upsells')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.rules)) {
          setRules(data.rules);
        } else {
          setRules([]);
        }
      })
      .catch(() => setRules([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.offerProductName || !formData.offerPrice) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    try {
      const res = await fetch('/api/admin/upsells', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({
          name: '',
          type: 'ORDER_BUMP',
          triggerCategory: 'all',
          offerProductName: '',
          offerPrice: 29.90,
          originalPrice: 49.90,
          discountPercent: 40,
          headline: 'Quer completar seu ritual com esta oferta sagrada?',
          description: 'Aproveite esta condição especial exclusiva para o seu pedido.',
        });
        loadRules();
      } else {
        alert('Erro ao criar regra de upsell: ' + data.error);
      }
    } catch (err: any) {
      alert('Falha na requisição: ' + err.message);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await fetch('/api/admin/upsells', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'TOGGLE_ACTIVE' }),
      });
      loadRules();
    } catch {}
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta regra de upsell?')) return;
    try {
      await fetch(`/api/admin/upsells?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      loadRules();
    } catch {}
  };

  const totalImpressions = rules.reduce((acc, r) => acc + (r.impressions || 0), 0);
  const totalConversions = rules.reduce((acc, r) => acc + (r.conversions || 0), 0);
  const conversionRate = totalImpressions > 0 ? ((totalConversions / totalImpressions) * 100).toFixed(1) : '0.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-bazar-charcoal-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-bazar-gold uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" /> Aumento de Ticket Médio
            </div>
            <h1 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment">
              CENTRAL UPSELLER & OFERTAS COMPLEMENTARES
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadRules}
            className="px-3 py-2 bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-xs text-bazar-parchment rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-bazar-gold text-bazar-black hover:bg-bazar-gold-light text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Criar Oferta de Upsell
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-bazar-parchment/60">
            Regras de Upsell
          </span>
          <div className="text-2xl font-bold text-bazar-parchment font-mono">{rules.length}</div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {rules.filter((r) => r.active).length} ativas no momento
          </span>
        </div>

        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-bazar-parchment/60">
            Impressões de Oferta
          </span>
          <div className="text-2xl font-bold text-bazar-parchment font-mono">{totalImpressions}</div>
          <span className="text-[10px] text-bazar-parchment/60">Exibições no checkout e pós-venda</span>
        </div>

        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-bazar-parchment/60">
            Conversões de Upsell
          </span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{totalConversions}</div>
          <span className="text-[10px] text-emerald-400/80">Itens extras adicionados</span>
        </div>

        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-bazar-parchment/60">
            Taxa de Aceitação (Take Rate)
          </span>
          <div className="text-2xl font-bold text-bazar-gold font-mono">{conversionRate}%</div>
          <span className="text-[10px] text-bazar-parchment/60">Eficácia das recomendações</span>
        </div>
      </div>

      {/* Lista de Regras de Upsell */}
      <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mystic text-lg font-bold text-bazar-parchment uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-bazar-gold" /> Regras de Ofertas Configuradas
          </h2>
          <span className="text-xs text-bazar-parchment/60">
            {rules.length} oferta(s) registrada(s)
          </span>
        </div>

        {rules.length === 0 ? (
          <div className="p-10 text-center rounded-2xl border border-dashed border-bazar-charcoal-border bg-bazar-charcoal/40 space-y-3">
            <Sparkles className="w-12 h-12 mx-auto text-bazar-parchment/30" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-bazar-parchment">Nenhuma oferta de upsell cadastrada</h3>
              <p className="text-xs text-bazar-parchment/60 max-w-md mx-auto">
                O módulo está pronto e limpo. Crie sua primeira oferta para exibir Order Bumps no checkout (&quot;Quer completar seu ritual?&quot;) ou ofertas pós-compra de produtos de fornecedores.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 px-4 py-2 bg-bazar-gold/20 border border-bazar-gold/40 text-bazar-gold text-xs font-bold rounded-xl hover:bg-bazar-gold/30 transition-colors"
            >
              + Criar Primeira Oferta de Upsell
            </button>
          </div>
        ) : (
          <div className="divide-y divide-bazar-charcoal-border">
            {rules.map((r) => (
              <div key={r.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-bazar-parchment">{r.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      r.type === 'ORDER_BUMP'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : r.type === 'POST_PURCHASE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {r.type.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      r.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {r.active ? 'Ativa' : 'Pausada'}
                    </span>
                  </div>

                  <p className="text-xs text-bazar-parchment/80 font-medium">
                    Produto Ofertado: <span className="text-bazar-gold font-bold">{r.offerProductName}</span> por{' '}
                    <span className="text-emerald-400 font-bold font-mono">R$ {r.offerPrice.toFixed(2)}</span>{' '}
                    <span className="line-through text-bazar-parchment/40 font-mono text-[11px]">
                      R$ {r.originalPrice.toFixed(2)}
                    </span>{' '}
                    ({r.discountPercent}% OFF)
                  </p>

                  <p className="text-[11px] text-bazar-parchment/60 italic font-editorial">
                    &ldquo;{r.headline}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(r.id)}
                    className={`p-2 rounded-lg border transition ${
                      r.active
                        ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40'
                        : 'border-bazar-charcoal-border text-bazar-parchment/40 hover:bg-bazar-charcoal'
                    }`}
                    title={r.active ? 'Pausar Oferta' : 'Ativar Oferta'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(r.id)}
                    className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-950/40 transition"
                    title="Excluir Oferta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criação de Upsell */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bazar-charcoal border border-bazar-gold/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-bazar-charcoal-border pb-4">
              <h3 className="font-mystic text-lg font-bold text-bazar-parchment flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-bazar-gold" /> Configurar Nova Oferta Upsell
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-bazar-parchment/60 hover:text-bazar-parchment text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div>
                <label className="block text-bazar-parchment/80 mb-1 font-semibold">Identificação da Regra *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Order Bump Incenso Sagrado no Checkout"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-bazar-parchment/80 mb-1 font-semibold">Momento da Oferta</label>
                  <select
                    value={formData.type}
                    onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none"
                  >
                    <option value="ORDER_BUMP">Order Bump (Checkout)</option>
                    <option value="POST_PURCHASE">Upsell Pós-Compra (Sucesso)</option>
                    <option value="CROSS_SELL">Cross-sell (Página Produto)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-bazar-parchment/80 mb-1 font-semibold">Categoria Gatilho</label>
                  <select
                    value={formData.triggerCategory}
                    onChange={(e) => setFormData({ ...formData, triggerCategory: e.target.value })}
                    className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none"
                  >
                    <option value="all">Todas as Compras</option>
                    <option value="cristais">Cristais</option>
                    <option value="incensos-aromas">Incensos</option>
                    <option value="bruxaria">Bruxaria & Rituais</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-bazar-parchment/80 mb-1 font-semibold">Nome do Produto Ofertado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bastão de Selenita Branca Purificadora"
                  value={formData.offerProductName}
                  onChange={(e) => setFormData({ ...formData, offerProductName: e.target.value })}
                  className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-bazar-parchment/80 mb-1 font-semibold">Preço Oferta (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.offerPrice}
                    onChange={(e) => setFormData({ ...formData, offerPrice: Number(e.target.value) })}
                    className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-bazar-parchment/80 mb-1 font-semibold">Preço Original (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-bazar-parchment/80 mb-1 font-semibold">Desconto (%)</label>
                  <input
                    type="number"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                    className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-bazar-parchment/80 mb-1 font-semibold">Frase de Destaque (Headline)</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-bazar-charcoal-light border border-bazar-charcoal-border text-bazar-parchment/80 hover:text-bazar-parchment text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-bazar-gold text-bazar-black font-bold uppercase tracking-wider text-xs hover:bg-bazar-gold-light transition shadow-md"
                >
                  Criar Oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
