'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send, Bot, User, ShieldAlert, Sparkles, RefreshCw, PhoneCall, ArrowLeft, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'BOT' | 'CUSTOMER' | 'SYSTEM';
  text: string;
  time: string;
  intent?: string;
}

export default function GuardiaoChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'BOT',
      text: `🌙 *Saudações a O Bazar do Bruxo!*
Eu sou *O Guardião do Bazar*, seu assistente ritualístico e operacional.

Como posso iluminar seus passos hoje? Digite o *número* da opção desejada:

1️⃣ Conhecer produtos sagrados
2️⃣ Rastrear meu pedido
3️⃣ Falar com atendente humano
4️⃣ Formas de pagamento
5️⃣ Prazos de entrega e frete
6️⃣ Política de trocas e devoluções
7️⃣ Ver menu novamente`,
      time: 'Agora',
      intent: 'SAUDACAO',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botMode, setBotMode] = useState<'BOT' | 'HUMAN'>('BOT');
  const [ticketAlert, setTicketAlert] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message) return;

    setInputText('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'CUSTOMER',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/webhooks/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '5511999887766',
          message: message,
          customerName: 'Helena Ravena',
        }),
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.mode === 'HUMAN') {
        setBotMode('HUMAN');
        if (data.ticketCreated) {
          setTicketAlert('Chamado #HUMAN-TICKET aberto no painel administrativo. O Guardião entrou em silêncio absoluto.');
        }
      }

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'BOT',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            intent: data.intent,
          },
        ]);
      } else if (data.silenced) {
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            sender: 'SYSTEM',
            text: '🔇 [O Guardião está silenciado pois a conversa foi transferida para um atendente humano. O robô não enviará respostas automáticas.]',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'SYSTEM',
          text: 'Falha ao conectar com o serviço do Guardião. Verifique a conexão.',
          time: 'Erro',
        },
      ]);
    }
  };

  const handleResetBot = () => {
    setBotMode('BOT');
    setTicketAlert(null);
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'SYSTEM',
        text: '✨ [Atendimento humano finalizado. O Guardião do Bazar voltou a responder automaticamente.]',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-bazar-primary text-bazar-cream flex flex-col items-center justify-center p-4">
      {/* Container Estilo Smartphone / WhatsApp */}
      <div className="w-full max-w-lg bg-[#0e0914] border border-bazar-gold/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Topbar */}
        <div className="bg-[#1a1224] border-b border-bazar-gold/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-bazar-gold hover:text-white transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-bazar-gold/20 border border-bazar-gold/40 flex items-center justify-center text-bazar-gold">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1a1224] ${botMode === 'BOT' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-sm tracking-wide text-white">O Guardião do Bazar</h2>
              </div>
              <p className="text-[11px] text-gray-400">
                {botMode === 'BOT' ? '🟢 Operação Automatizada Ativa' : '🟡 Modo Atendente Humano (Silenciado)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {botMode === 'HUMAN' && (
              <button
                onClick={handleResetBot}
                title="Reativar Bot Guardião"
                className="text-xs bg-bazar-gold/20 hover:bg-bazar-gold/30 text-bazar-gold px-2.5 py-1 rounded-md border border-bazar-gold/30 flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" /> Reativar
              </button>
            )}
            <Link
              href="/admin/tickets"
              className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-2 py-1 rounded-md border border-white/10 transition flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" /> Fila
            </Link>
          </div>
        </div>

        {/* Alerta de Ticket Aberto */}
        {ticketAlert && (
          <div className="bg-amber-950/70 border-b border-amber-600/40 p-2.5 text-xs text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{ticketAlert}</span>
            </span>
            <a
              href="https://wa.me/5513998039867"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shrink-0 flex items-center gap-1 transition"
            >
              <PhoneCall className="w-3 h-3" /> Falar no WhatsApp (13) 99803-9867
            </a>
          </div>
        )}

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0610]/90">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'CUSTOMER'
                  ? 'items-end'
                  : m.sender === 'SYSTEM'
                  ? 'items-center text-center'
                  : 'items-start'
              }`}
            >
              {m.sender === 'SYSTEM' ? (
                <div className="max-w-[85%] text-[11px] bg-white/5 text-amber-300/80 px-3 py-1.5 rounded-lg border border-amber-400/10 my-1 font-mono">
                  {m.text}
                </div>
              ) : (
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
                    m.sender === 'CUSTOMER'
                      ? 'bg-emerald-900/40 border border-emerald-500/30 text-emerald-100 rounded-tr-none'
                      : 'bg-[#181122] border border-bazar-gold/20 text-gray-200 rounded-tl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-gray-400">
                    {m.intent && (
                      <span className="text-[9px] uppercase px-1 py-0.2 bg-white/5 rounded text-bazar-gold/70 mr-1">
                        {m.intent}
                      </span>
                    )}
                    <span>{m.time}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-bazar-gold/80 italic bg-[#181122] p-2.5 rounded-xl border border-bazar-gold/20 w-fit">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              O Guardião está consultando os oráculos...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Atalhos Rápidos de Teste */}
        <div className="bg-[#120c1a] border-t border-white/5 p-2 px-3 flex gap-2 overflow-x-auto text-[11px] text-gray-300 scrollbar-none">
          <button
            onClick={() => handleSend('1')}
            className="whitespace-nowrap px-2.5 py-1 bg-white/5 hover:bg-bazar-gold/20 border border-white/10 hover:border-bazar-gold/30 rounded-full transition"
          >
            1️⃣ Catálogo
          </button>
          <button
            onClick={() => handleSend('OBZ-8899')}
            className="whitespace-nowrap px-2.5 py-1 bg-white/5 hover:bg-bazar-gold/20 border border-white/10 hover:border-bazar-gold/30 rounded-full transition"
          >
            📦 Rastrear OBZ-8899
          </button>
          <button
            onClick={() => handleSend('falar com atendente')}
            className="whitespace-nowrap px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/30 text-amber-200 rounded-full transition"
          >
            👤 Suporte Humano
          </button>
          <button
            onClick={() => handleSend('4')}
            className="whitespace-nowrap px-2.5 py-1 bg-white/5 hover:bg-bazar-gold/20 border border-white/10 hover:border-bazar-gold/30 rounded-full transition"
          >
            💳 Pagamentos
          </button>
          <button
            onClick={() => handleSend('presente até 50')}
            className="whitespace-nowrap px-2.5 py-1 bg-white/5 hover:bg-bazar-gold/20 border border-white/10 hover:border-bazar-gold/30 rounded-full transition"
          >
            💰 Até R$ 50
          </button>
        </div>

        {/* Input Bar */}
        <div className="bg-[#1a1224] border-t border-bazar-gold/20 p-3 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={botMode === 'BOT' ? 'Digite uma opção (1 a 7) ou sua dúvida...' : 'Digite para enviar mensagem ao atendente...'}
            className="flex-1 bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-bazar-gold transition placeholder:text-gray-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2.5 bg-bazar-gold hover:bg-bazar-gold-light disabled:opacity-40 text-bazar-primary rounded-xl transition flex items-center justify-center font-bold"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
