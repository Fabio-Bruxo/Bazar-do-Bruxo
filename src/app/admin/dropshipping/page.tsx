'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Factory,
  Plus,
  Link2,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Power,
  Phone,
  Mail
} from 'lucide-react';
import { getStoredProducts, Product } from '@/data/db';
import { formatCurrency } from '@/utils/currency';

interface Supplier {
  id: string;
  name: string;
  document: string;
  email: string;
  whatsapp: string;
  contactName?: string;
  shippingTimeDays: number;
  shippingCostBase: number;
  marketplaceFeePercent: number;
  mpConnected: boolean;
  mpUserId?: string;
  status: 'ACTIVE' | 'PAUSED' | 'REVIEW';
  createdAt: string;
}

export default function AdminDropshippingPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form de novo fornecedor
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    email: '',
    whatsapp: '',
    contactName: '',
    shippingTimeDays: 3,
    shippingCostBase: 15.00,
    marketplaceFeePercent: 12.00,
  });

  const loadData = () => {
    setIsLoading(true);
    fetch('/api/admin/suppliers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.suppliers)) {
          setSuppliers(data.suppliers);
        } else {
          setSuppliers([]);
        }
      })
      .catch(() => setSuppliers([]))
      .finally(() => setIsLoading(false));

    setProducts(getStoredProducts().filter((p) => p.type === 'dropshipping'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    try {
      const res = await fetch('/api/admin/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({
          name: '',
          document: '',
          email: '',
          whatsapp: '',
          contactName: '',
          shippingTimeDays: 3,
          shippingCostBase: 15.00,
          marketplaceFeePercent: 12.00,
        });
        loadData();
      } else {
        alert('Erro ao cadastrar fornecedor: ' + data.error);
      }
    } catch (err: any) {
      alert('Falha na requisição: ' + err.message);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await fetch('/api/admin/suppliers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'TOGGLE_STATUS' }),
      });
      loadData();
    } catch {}
  };

  const handleConnectMercadoPago = (supplierId: string) => {
    // Redireciona para o fluxo OAuth oficial
    window.location.href = `/api/suppliers/oauth?supplierId=${encodeURIComponent(supplierId)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Topo do Painel */}
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
              <Truck className="w-3.5 h-3.5" /> Logística & Repasses
            </div>
            <h1 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment">
              CENTRAL DE DROPSHIPPING & FORNECEDORES
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="px-3 py-2 bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-xs text-bazar-parchment rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-bazar-gold text-bazar-black hover:bg-bazar-gold-light text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Cadastrar Fornecedor
          </button>
        </div>
      </div>

      {/* Cards de Métricas Operacionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-bazar-parchment/60">
            Fornecedores Cadastrados
          </span>
          <div className="text-2xl font-bold text-bazar-parchment font-mono">{suppliers.length}</div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {suppliers.filter((s) => s.status === 'ACTIVE').length} ativos no sistema
          </span>
        </div>

        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-bazar-parchment/60">
            Conexão Mercado Pago (OAuth)
          </span>
          <div className="text-2xl font-bold text-bazar-gold font-mono">
            {suppliers.filter((s) => s.mpConnected).length} / {suppliers.length}
          </div>
          <span className="text-[10px] text-bazar-parchment/60">Split nativo habilitado</span>
        </div>

        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-bazar-parchment/60">
            Produtos em Dropshipping
          </span>
          <div className="text-2xl font-bold text-bazar-parchment font-mono">{products.length}</div>
          <span className="text-[10px] text-bazar-parchment/60">Vinculados a parceiros nacionais</span>
        </div>

        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-bazar-parchment/60">
            Trava de Margem Mínima
          </span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">25.0%</div>
          <span className="text-[10px] text-emerald-400/80">Proteção anti-prejuízo ativa</span>
        </div>
      </div>

      {/* Lista de Fornecedores */}
      <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mystic text-lg font-bold text-bazar-parchment uppercase tracking-wide flex items-center gap-2">
            <Factory className="w-5 h-5 text-bazar-gold" /> Parceiros & Fornecedores Homologados
          </h2>
          <span className="text-xs text-bazar-parchment/60">
            {suppliers.length} parceiro(s) registrado(s)
          </span>
        </div>

        {suppliers.length === 0 ? (
          <div className="p-10 text-center rounded-2xl border border-dashed border-bazar-charcoal-border bg-bazar-charcoal/40 space-y-3">
            <Factory className="w-12 h-12 mx-auto text-bazar-parchment/30" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-bazar-parchment">Nenhum fornecedor cadastrado ainda</h3>
              <p className="text-xs text-bazar-parchment/60 max-w-md mx-auto">
                O painel está pronto e limpo. Clique no botão &quot;Cadastrar Fornecedor&quot; para registrar seu primeiro parceiro artesão ou fábrica de dropshipping.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 px-4 py-2 bg-bazar-gold/20 border border-bazar-gold/40 text-bazar-gold text-xs font-bold rounded-xl hover:bg-bazar-gold/30 transition-colors"
            >
              + Adicionar Primeiro Fornecedor
            </button>
          </div>
        ) : (
          <div className="divide-y divide-bazar-charcoal-border">
            {suppliers.map((supp) => (
              <div key={supp.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-bazar-parchment">{supp.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      supp.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {supp.status}
                    </span>
                    {supp.mpConnected ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                        <Link2 className="w-3 h-3" /> Mercado Pago Conectado
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30">
                        Não Conectado
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-bazar-parchment/60">
                    {supp.document && <span>CNPJ/CPF: {supp.document}</span>}
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {supp.email}
                    </span>
                    {supp.whatsapp && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {supp.whatsapp}
                      </span>
                    )}
                    <span>Despacho: ~{supp.shippingTimeDays} dias</span>
                    <span>Comissão Bazar: {supp.marketplaceFeePercent}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!supp.mpConnected ? (
                    <button
                      onClick={() => handleConnectMercadoPago(supp.id)}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow"
                    >
                      <Link2 className="w-3.5 h-3.5" /> Conectar MP (OAuth)
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold px-2 py-1 bg-emerald-950/40 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Split Ativo
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleStatus(supp.id)}
                    className="p-1.5 rounded-lg border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment/80 transition"
                    title={supp.status === 'ACTIVE' ? 'Pausar Fornecedor' : 'Ativar Fornecedor'}
                  >
                    <Power className={`w-4 h-4 ${supp.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bazar-charcoal border border-bazar-gold/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-bazar-charcoal-border pb-4">
              <h3 className="font-mystic text-lg font-bold text-bazar-parchment flex items-center gap-2">
                <Factory className="w-5 h-5 text-bazar-gold" /> Cadastrar Novo Fornecedor
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-bazar-parchment/60 hover:text-bazar-parchment text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs">
              <div>
                <label className="block text-bazar-parchment/80 mb-1 font-semibold">Nome / Razão Social *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fundição Mística Mantiqueira"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-bazar-parchment/80 mb-1 font-semibold">CNPJ ou CPF</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={formData.document}
                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                    className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-bazar-parchment/80 mb-1 font-semibold">WhatsApp Oficial</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-bazar-parchment/80 mb-1 font-semibold">E-mail para Pedidos *</label>
                <input
                  type="email"
                  required
                  placeholder="pedidos@fornecedor.com.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-bazar-parchment/80 mb-1 font-semibold">Despacho (dias)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.shippingTimeDays}
                    onChange={(e) => setFormData({ ...formData, shippingTimeDays: Number(e.target.value) })}
                    className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-bazar-parchment/80 mb-1 font-semibold">Frete Base (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.shippingCostBase}
                    onChange={(e) => setFormData({ ...formData, shippingCostBase: Number(e.target.value) })}
                    className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-bazar-parchment/80 mb-1 font-semibold">Comissão Bazar (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.marketplaceFeePercent}
                    onChange={(e) => setFormData({ ...formData, marketplaceFeePercent: Number(e.target.value) })}
                    className="w-full bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold outline-none font-mono"
                  />
                </div>
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
                  Salvar Fornecedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
