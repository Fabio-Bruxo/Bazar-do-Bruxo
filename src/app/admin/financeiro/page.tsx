'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ArrowLeft, 
  TrendingUp, 
  CreditCard, 
  Truck, 
  Users, 
  RotateCcw, 
  ShieldAlert, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { FinancialSummary, LedgerEntry, ReconciliationReport } from '@/services/financialLedgerService';

export default function CentralFinanceiraPage() {
  const [summary, setSummary] = useState<FinancialSummary>({
    grossRevenue: 0,
    gatewayFees: 0,
    supplierShares: 0,
    affiliateCommissions: 0,
    refunds: 0,
    chargebacks: 0,
    netMarketplaceRevenue: 0,
    pendingSettlements: 0,
    totalEntriesCount: 0,
  });
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [reconciliation, setReconciliation] = useState<ReconciliationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/financial');
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setEntries(data.entries || []);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados financeiros:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunReconciliation = async () => {
    try {
      setReconciling(true);
      const res = await fetch('/api/admin/financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reconcile' }),
      });
      const data = await res.json();
      if (data.success) {
        setReconciliation(data.report);
      }
    } catch (err) {
      console.warn('Erro na reconciliação:', err);
    } finally {
      setReconciling(false);
    }
  };

  const filteredEntries = entries.filter((e) => {
    if (statusFilter === 'ALL') return true;
    return e.entryType === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Topo / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-bazar-charcoal-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-bazar-gold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5" /> Livro-Razão & Conciliação
            </div>
            <h1 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment">
              CENTRAL FINANCEIRA DO BAZAR
            </h1>
            <p className="text-xs text-bazar-parchment/60">
              Integridade contábil, split de fornecedores, taxas de gateway e margem líquida real
            </p>
          </div>
        </div>

        <button
          onClick={handleRunReconciliation}
          disabled={reconciling}
          className="px-4 py-2.5 bg-bazar-gold hover:bg-bazar-gold-light text-bazar-black font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-mystic-gold disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${reconciling ? 'animate-spin' : ''}`} />
          <span>{reconciling ? 'Reconciliando...' : 'Executar Reconciliação'}</span>
        </button>
      </div>

      {/* Relatório de Reconciliação (Se executado) */}
      {reconciliation && (
        <div className={`p-5 rounded-2xl border ${
          reconciliation.status === 'RECONCILED'
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
        } shadow-lg space-y-3 animate-in fade-in`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              {reconciliation.status === 'RECONCILED' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Auditoria Concluída: 100% Reconciliado Sem Divergências</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Atenção: Divergência Detectada ({reconciliation.discrepanciesFound} pedidos em MANUAL_REVIEW)</span>
                </>
              )}
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              {new Date(reconciliation.timestamp).toLocaleTimeString('pt-BR')}
            </span>
          </div>
          <p className="text-xs opacity-80">
            {reconciliation.totalOrdersChecked} pedidos verificados contra os registros imutáveis do Livro-Razão Financeiro.
          </p>
          {reconciliation.details.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
              {reconciliation.details.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between bg-black/30 p-2 rounded-lg font-mono text-[11px]">
                  <span>Pedido #{d.orderCode}: Pedido R$ {d.orderTotal.toFixed(2)} vs Ledger R$ {d.ledgerTotal.toFixed(2)}</span>
                  <span className="text-rose-400 font-bold">Diferença: R$ {d.difference.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid de 6 Métricas Principais (Seção 39) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        
        {/* Receita Bruta */}
        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-2 shadow-mystic">
          <div className="flex items-center justify-between text-bazar-gold">
            <span className="text-xs font-bold tracking-wider uppercase">Receita Bruta</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mystic text-bazar-parchment">
            {formatCurrency(summary.grossRevenue)}
          </div>
          <p className="text-[11px] text-bazar-parchment/60">Total pago pelos clientes no checkout</p>
        </div>

        {/* Lucro Líquido do Bazar */}
        <div className="bg-gradient-to-br from-bazar-wine/60 to-bazar-charcoal-light p-5 rounded-2xl border border-bazar-gold/50 space-y-2 shadow-mystic">
          <div className="flex items-center justify-between text-bazar-gold">
            <span className="text-xs font-bold tracking-wider uppercase">Receita do Bazar</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mystic text-emerald-300">
            {formatCurrency(summary.netMarketplaceRevenue)}
          </div>
          <p className="text-[11px] text-bazar-parchment/60">Margem líquida após taxas e repasses</p>
        </div>

        {/* Taxas Mercado Pago */}
        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-2 shadow-mystic">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold tracking-wider uppercase">Taxas Mercado Pago</span>
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mystic text-bazar-parchment">
            {formatCurrency(summary.gatewayFees)}
          </div>
          <p className="text-[11px] text-bazar-parchment/60">Intermediação e processamento PIX/Cartão</p>
        </div>

        {/* Repasses de Fornecedores */}
        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-2 shadow-mystic">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold tracking-wider uppercase">Split Fornecedores</span>
            <Truck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mystic text-bazar-parchment">
            {formatCurrency(summary.supplierShares)}
          </div>
          <p className="text-[11px] text-bazar-parchment/60">Custo de mercadoria de dropshipping</p>
        </div>

        {/* Comissões de Afiliados */}
        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-2 shadow-mystic">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-bold tracking-wider uppercase">Comissão Afiliados</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mystic text-bazar-parchment">
            {formatCurrency(summary.affiliateCommissions)}
          </div>
          <p className="text-[11px] text-bazar-parchment/60">Guardiões parceiros que geraram vendas</p>
        </div>

        {/* Reembolsos & Estornos */}
        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-2 shadow-mystic">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-bold tracking-wider uppercase">Reembolsos</span>
            <RotateCcw className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mystic text-rose-300">
            {formatCurrency(summary.refunds)}
          </div>
          <p className="text-[11px] text-bazar-parchment/60">Devoluções aprovadas oficialmente</p>
        </div>

        {/* Chargebacks / Disputas */}
        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-2 shadow-mystic">
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-xs font-bold tracking-wider uppercase">Chargebacks</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mystic text-rose-400">
            {formatCurrency(summary.chargebacks)}
          </div>
          <p className="text-[11px] text-bazar-parchment/60">Contestações em revisão manual</p>
        </div>

        {/* Total de Lançamentos */}
        <div className="bg-bazar-charcoal-light p-5 rounded-2xl border border-bazar-charcoal-border space-y-2 shadow-mystic">
          <div className="flex items-center justify-between text-bazar-gold">
            <span className="text-xs font-bold tracking-wider uppercase">Lançamentos</span>
            <Receipt className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mystic text-bazar-parchment">
            {summary.totalEntriesCount}
          </div>
          <p className="text-[11px] text-bazar-parchment/60">Partidas registradas no livro-razão</p>
        </div>

      </div>

      {/* Tabela do Livro-Razão Financeiro (Financial Ledger) */}
      <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border overflow-hidden shadow-mystic space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-bazar-charcoal-border">
          <div>
            <h2 className="font-mystic text-lg font-bold text-bazar-parchment">
              LIVRO-RAZÃO CONTÁBIL (FINANCIAL LEDGER)
            </h2>
            <p className="text-xs text-bazar-parchment/60">
              Registros imutáveis de cada movimentação financeira de pedidos, splits e comissões
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-bazar-parchment/60">Filtrar por Tipo:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-1.5 text-xs text-bazar-parchment focus:outline-none focus:border-bazar-gold"
            >
              <option value="ALL">Todos os Tipos</option>
              <option value="CUSTOMER_PAYMENT">Pagamento Cliente</option>
              <option value="MARKETPLACE_REVENUE">Receita Bazar</option>
              <option value="PAYMENT_FEE">Taxa Mercado Pago</option>
              <option value="SUPPLIER_SHARE">Split Fornecedor</option>
              <option value="AFFILIATE_COMMISSION">Comissão Afiliado</option>
              <option value="REFUND">Reembolso</option>
              <option value="CHARGEBACK">Chargeback</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-bazar-parchment divide-y divide-bazar-charcoal-border">
            <thead className="bg-bazar-charcoal text-bazar-parchment/60 uppercase font-bold tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Tipo de Lançamento</th>
                <th className="py-3 px-4">Direção</th>
                <th className="py-3 px-4">Referência / Pedido</th>
                <th className="py-3 px-4">Entidade</th>
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bazar-charcoal-border">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((e) => {
                  const isCredit = e.direction === 'CREDIT';
                  return (
                    <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-gray-400">
                        {new Date(e.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-white/5 border border-white/10 uppercase">
                          {e.entryType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                          isCredit ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                        }`}>
                          {e.direction}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-bazar-gold">
                        #{e.referenceCode || e.orderId?.slice(0, 8) || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-[11px]">
                        {e.entityId}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {e.description}
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${
                        isCredit ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {isCredit ? '+' : '-'} {formatCurrency(e.amount)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-bazar-parchment/50 font-editorial italic text-xs">
                    ✦ Nenhum lançamento financeiro registrado até o momento. As transações aprovadas do checkout e webhooks serão lançadas aqui automaticamente. ✦
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
