'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Truck,
  DollarSign,
  MapPin,
  RefreshCw,
  Power
} from 'lucide-react';

interface ExceptionItem {
  id: string;
  orderCode: string;
  type: 'MARGIN_VIOLATION' | 'INCOMPLETE_ADDRESS' | 'PAYMENT_MISMATCH' | 'SUPPLIER_OFFLINE';
  severity: 'URGENT' | 'HIGH' | 'MEDIUM';
  description: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  date: string;
  status: 'PENDING' | 'RESOLVED' | 'CANCELLED';
}

export default function AdminExceptionsPage() {
  const [exceptions, setExceptions] = useState<ExceptionItem[]>([
    {
      id: 'exc-01',
      orderCode: 'OBZ-9912-SOL',
      type: 'INCOMPLETE_ADDRESS',
      severity: 'URGENT',
      description: 'Endereço sem número e sem bairro no cadastro de entrega. Despacho dropshipping bloqueado automaticamente.',
      customerName: 'Aline Mendonça',
      customerPhone: '11988223344',
      amount: 149.90,
      date: 'Há 25 minutos',
      status: 'PENDING',
    },
    {
      id: 'exc-02',
      orderCode: 'OBZ-8843-LUA',
      type: 'MARGIN_VIOLATION',
      severity: 'HIGH',
      description: 'Custo do fornecedor aumentou em R$ 18,00 para Caldeirão 500ml. Margem caiu abaixo do piso de 20%.',
      customerName: 'Carlos Silveira',
      customerPhone: '21977665544',
      amount: 129.90,
      date: 'Há 1 hora',
      status: 'PENDING',
    },
    {
      id: 'exc-03',
      orderCode: 'OBZ-7711-EST',
      type: 'PAYMENT_MISMATCH',
      severity: 'MEDIUM',
      description: 'Pagamento PIX recebido com valor divergente de R$ 0,50 por erro de centavos do banco emissor.',
      customerName: 'Renata Froes',
      customerPhone: '31999881122',
      amount: 89.40,
      date: 'Há 3 horas',
      status: 'PENDING',
    },
  ]);

  const [emergencyStates, setEmergencyStates] = useState({
    BOT_ENABLED: true,
    AUTOMATIC_SALES_ENABLED: true,
    DROPSHIPPING_DISPATCH_ENABLED: true,
  });

  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/emergency')
      .then((res) => res.json())
      .then((data) => setEmergencyStates(data))
      .catch((err) => console.error(err));
  }, []);

  const toggleEmergency = async (key: 'BOT_ENABLED' | 'AUTOMATIC_SALES_ENABLED' | 'DROPSHIPPING_DISPATCH_ENABLED') => {
    setLoadingKey(key);
    const newValue = !emergencyStates[key];
    try {
      const res = await fetch('/api/admin/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: newValue, adminId: 'admin-master' }),
      });
      const data = await res.json();
      if (data.success) {
        setEmergencyStates((prev) => ({ ...prev, [key]: newValue }));
      }
    } finally {
      setLoadingKey(null);
    }
  };

  const handleResolve = (id: string) => {
    setExceptions((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'RESOLVED' } : e))
    );
  };

  const handleCancel = (id: string) => {
    setExceptions((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'CANCELLED' } : e))
    );
  };

  return (
    <div className="min-h-screen bg-[#0d0914] text-bazar-cream p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header & Back */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bazar-gold/20 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-bazar-gold transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-red-400" />
                  PRECISA DA SUA ATENÇÃO
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  {exceptions.filter((e) => e.status === 'PENDING').length} Críticas
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Central de intervenção manual para travas de segurança comercial, margem e entregas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/tickets"
              className="px-3 py-1.5 bg-bazar-gold/10 hover:bg-bazar-gold/20 text-bazar-gold border border-bazar-gold/30 rounded-lg text-xs font-semibold transition"
            >
              Fila de Atendimento Humano
            </Link>
            <Link
              href="/guardiao"
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs transition"
            >
              Testar Guardião
            </Link>
          </div>
        </div>

        {/* 3 BOTÕES DE EMERGÊNCIA GLOBAIS */}
        <div className="bg-[#181024] border border-bazar-gold/30 rounded-xl p-4 sm:p-5 shadow-lg">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-bazar-gold flex items-center gap-2 mb-3">
            <Power className="w-4 h-4" /> Botões de Emergência Operacional
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Botão 1: Pausar Bot */}
            <button
              onClick={() => toggleEmergency('BOT_ENABLED')}
              disabled={loadingKey === 'BOT_ENABLED'}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition ${
                emergencyStates.BOT_ENABLED
                  ? 'bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-900/40 text-emerald-200'
                  : 'bg-red-950/60 border-red-500/60 hover:bg-red-900/60 text-red-200'
              }`}
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider">
                  {emergencyStates.BOT_ENABLED ? 'Bot Guardião Ativo' : 'BOT PAUSADO'}
                </div>
                <div className="text-[11px] opacity-75">
                  {emergencyStates.BOT_ENABLED ? 'Respondendo WhatsApp' : 'Respostas desativadas'}
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full ${emergencyStates.BOT_ENABLED ? 'bg-emerald-400' : 'bg-red-500 animate-ping'}`} />
            </button>

            {/* Botão 2: Pausar Vendas Automáticas */}
            <button
              onClick={() => toggleEmergency('AUTOMATIC_SALES_ENABLED')}
              disabled={loadingKey === 'AUTOMATIC_SALES_ENABLED'}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition ${
                emergencyStates.AUTOMATIC_SALES_ENABLED
                  ? 'bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-900/40 text-emerald-200'
                  : 'bg-red-950/60 border-red-500/60 hover:bg-red-900/60 text-red-200'
              }`}
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider">
                  {emergencyStates.AUTOMATIC_SALES_ENABLED ? 'Vendas Automáticas Ativas' : 'VENDAS PAUSADAS'}
                </div>
                <div className="text-[11px] opacity-75">
                  {emergencyStates.AUTOMATIC_SALES_ENABLED ? 'Checkout liberado' : 'Checkout em manutenção'}
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full ${emergencyStates.AUTOMATIC_SALES_ENABLED ? 'bg-emerald-400' : 'bg-red-500 animate-ping'}`} />
            </button>

            {/* Botão 3: Pausar Envio a Fornecedores */}
            <button
              onClick={() => toggleEmergency('DROPSHIPPING_DISPATCH_ENABLED')}
              disabled={loadingKey === 'DROPSHIPPING_DISPATCH_ENABLED'}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition ${
                emergencyStates.DROPSHIPPING_DISPATCH_ENABLED
                  ? 'bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-900/40 text-emerald-200'
                  : 'bg-red-950/60 border-red-500/60 hover:bg-red-900/60 text-red-200'
              }`}
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider">
                  {emergencyStates.DROPSHIPPING_DISPATCH_ENABLED ? 'Envio Fornecedores Ativo' : 'DROPSHIPPING PAUSADO'}
                </div>
                <div className="text-[11px] opacity-75">
                  {emergencyStates.DROPSHIPPING_DISPATCH_ENABLED ? 'Despacho automático' : 'Todos vão para MANUAL_REVIEW'}
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full ${emergencyStates.DROPSHIPPING_DISPATCH_ENABLED ? 'bg-emerald-400' : 'bg-red-500 animate-ping'}`} />
            </button>
          </div>
        </div>

        {/* Lista de Exceções */}
        <div className="space-y-4">
          {exceptions.map((exc) => (
            <div
              key={exc.id}
              className={`border rounded-xl p-4 sm:p-5 transition ${
                exc.status === 'RESOLVED'
                  ? 'bg-emerald-950/10 border-emerald-500/20 opacity-60'
                  : exc.status === 'CANCELLED'
                  ? 'bg-gray-900/30 border-gray-700/30 opacity-40'
                  : exc.severity === 'URGENT'
                  ? 'bg-red-950/20 border-red-500/40 shadow-lg'
                  : 'bg-[#150d1e] border-amber-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${exc.severity === 'URGENT' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {exc.type === 'INCOMPLETE_ADDRESS' && <MapPin className="w-5 h-5" />}
                    {exc.type === 'MARGIN_VIOLATION' && <DollarSign className="w-5 h-5" />}
                    {exc.type === 'PAYMENT_MISMATCH' && <AlertTriangle className="w-5 h-5" />}
                    {exc.type === 'SUPPLIER_OFFLINE' && <Truck className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-base">{exc.orderCode}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider bg-white/10 text-gray-300">
                        {exc.type.replace('_', ' ')}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded uppercase font-semibold ${
                        exc.severity === 'URGENT' ? 'bg-red-500/30 text-red-300' : 'bg-amber-500/30 text-amber-300'
                      }`}>
                        {exc.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Cliente: <strong className="text-gray-200">{exc.customerName}</strong> ({exc.customerPhone}) • R$ {exc.amount.toFixed(2)} • {exc.date}
                    </p>
                  </div>
                </div>

                {exc.status === 'PENDING' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolve(exc.id)}
                      className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Liberar Pedido
                    </button>
                    <button
                      onClick={() => handleCancel(exc.id)}
                      className="px-3 py-1.5 bg-red-900/60 hover:bg-red-900 text-red-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancelar / Estornar
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-400">
                    {exc.status === 'RESOLVED' ? 'Resolvido Manualmente' : 'Cancelado'}
                  </span>
                )}
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-white/5 text-xs text-gray-300">
                {exc.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
