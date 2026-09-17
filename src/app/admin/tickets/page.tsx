'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  ArrowLeft,
  Bot,
  User,
  CheckCircle,
  Clock,
  Phone,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface SupportTicket {
  id: string;
  phone: string;
  reason: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  notes?: string;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export default function AdminTicketsPage() {
  // Inicialização 100% limpa e sincronizada com dados reais da API
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const loadTickets = () => {
    setIsLoading(true);
    fetch('/api/admin/tickets')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        } else {
          setTickets([]);
        }
      })
      .catch(() => setTickets([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleResolveAndResume = async (ticket: SupportTicket) => {
    setLoadingId(ticket.id);
    try {
      const res = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESOLVE_TICKET',
          ticketId: ticket.id,
          phone: ticket.phone,
          notes: 'Resolvido pelo atendente humano via painel.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTickets((prev) =>
          prev.map((t) => (t.id === ticket.id ? { ...t, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : t))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleResumeBotOnly = async (phone: string) => {
    try {
      await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESUME_BOT',
          phone,
        }),
      });
      alert(`O Guardião foi reativado para o número ${phone}!`);
      loadTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const formatTicketDate = (dateStr: string) => {
    if (!dateStr) return 'Agora';
    if (dateStr.includes('Há') || dateStr.includes('minuto')) return dateStr;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const openTicketsCount = tickets.filter((t) => t.status === 'OPEN').length;

  return (
    <div className="min-h-screen bg-[#0d0914] text-bazar-cream p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bazar-gold/20 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-bazar-gold transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-bazar-gold" />
                  FILA DE ATENDIMENTO HUMANO
                </h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  openTicketsCount > 0
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {openTicketsCount} Aguardando
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Atendimentos transbordados pelo Guardião do Bazar (WhatsApp) para operadores humanos em tempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadTickets}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
            </button>
            <Link
              href="/guardiao"
              className="px-3 py-1.5 bg-bazar-gold/10 hover:bg-bazar-gold/20 text-bazar-gold border border-bazar-gold/30 rounded-lg text-xs font-semibold transition flex items-center gap-1"
            >
              <Bot className="w-3.5 h-3.5" /> Abrir Simulador do Guardião
            </Link>
            <Link
              href="/admin/excecoes"
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs transition"
            >
              Central de Exceções
            </Link>
          </div>
        </div>

        {/* Fila de Chamados Sincronizada */}
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="bg-[#181024] border border-emerald-500/30 rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-mystic text-lg sm:text-xl font-bold text-bazar-parchment tracking-wide">
                  NENHUM ATENDIMENTO NA FILA
                </h3>
                <p className="text-xs sm:text-sm text-bazar-parchment/60 max-w-md mx-auto leading-relaxed">
                  Todos os chamados foram atendidos e o Guardião do Bazar está operando normalmente. Quando um cliente solicitar suporte humano no WhatsApp ou no simulador, o atendimento aparecerá aqui em tempo real.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  href="/guardiao"
                  className="px-4 py-2 rounded-xl bg-bazar-gold/20 border border-bazar-gold/40 hover:bg-bazar-gold/30 text-xs text-bazar-gold font-bold transition-colors flex items-center gap-1.5"
                >
                  <Bot className="w-4 h-4" /> Testar no Simulador do Guardião
                </Link>
                <Link
                  href="/admin/excecoes"
                  className="px-4 py-2 rounded-xl bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-xs text-bazar-parchment font-medium transition-colors"
                >
                  Central de Exceções
                </Link>
              </div>
            </div>
          ) : (
            tickets.map((tkt) => (
              <div
                key={tkt.id}
                className={`border rounded-xl p-4 sm:p-5 transition ${
                  tkt.status === 'RESOLVED'
                    ? 'bg-emerald-950/10 border-emerald-500/20 opacity-60'
                    : tkt.priority === 'URGENT'
                    ? 'bg-red-950/20 border-red-500/40'
                    : 'bg-[#150d1e] border-bazar-gold/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-bazar-gold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm sm:text-base">{tkt.phone}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          tkt.priority === 'URGENT'
                            ? 'bg-red-500/30 text-red-300'
                            : tkt.priority === 'HIGH'
                            ? 'bg-amber-500/30 text-amber-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {tkt.priority}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 uppercase font-semibold">
                          {tkt.reason.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{formatTicketDate(tkt.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {tkt.status === 'OPEN' ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`https://wa.me/${tkt.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow"
                      >
                        <Phone className="w-3.5 h-3.5" /> Abrir WhatsApp Web
                      </a>
                      <button
                        onClick={() => handleResolveAndResume(tkt)}
                        disabled={loadingId === tkt.id}
                        className="px-3 py-1.5 bg-bazar-gold/20 hover:bg-bazar-gold/30 text-bazar-gold border border-bazar-gold/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Resolver e Reativar Bot
                      </button>
                      <button
                        onClick={() => handleResumeBotOnly(tkt.phone)}
                        className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-xs transition"
                        title="Devolver atendimento para o robô"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <CheckCircle className="w-4 h-4" />
                      Chamado Resolvido
                    </div>
                  )}
                </div>

                {/* Mensagem do Cliente */}
                {tkt.notes && (
                  <div className="bg-black/30 p-3 rounded-lg border border-white/5 text-xs text-gray-300 mt-2">
                    <strong className="text-gray-400 block mb-1">Última mensagem do cliente:</strong>
                    &quot;{tkt.notes}&quot;
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
