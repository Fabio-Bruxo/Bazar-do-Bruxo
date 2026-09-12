'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send, Bot, User, ShieldAlert, Sparkles, RefreshCw, PhoneCall, ArrowLeft, Moon, Compass, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BOT_TEXTS } from '@/services/bot/faq';

interface ChatMessage {
  id: string;
  sender: 'BOT' | 'CUSTOMER' | 'SYSTEM';
  text: string;
  time: string;
  intent?: string;
}

export default function GuardiaoChatPage() {
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'BOT',
      text: BOT_TEXTS.GREETING,
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
          phone: user?.phone?.replace(/\D/g, '') || '5513998039867',
          message: message,
          customerName: user?.name || 'Buscador(a)',
        }),
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.mode === 'HUMAN') {
        setBotMode('HUMAN');
        if (data.ticketCreated) {
          setTicketAlert('Chamado prioritário aberto na mesa da equipe humana. O Guardião permanecerá em silêncio.');
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
            text: '🔇 [O Guardião está em silêncio sagrado pois a conversa foi transferida para um atendente humano. O mago não interferirá no contato direto.]',
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
          text: '⚠️ [Os ventos cósmicos oscilaram. Por favor, tente novamente em instantes.]',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        id: `sys-reset-${Date.now()}`,
        sender: 'SYSTEM',
        text: '✨ [Atendimento humano concluído. O Mago Guardião do Bazar voltou a responder suas buscas e orientações rituais.]',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Renderizador de mensagens com formatação de links e negritos do WhatsApp
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Formatação básica de links https
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = line.split(urlRegex);

      return (
        <p key={idx} className="min-h-[1.2em] leading-relaxed">
          {parts.map((part, pIdx) => {
            if (part.match(urlRegex)) {
              return (
                <a
                  key={pIdx}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bazar-gold underline hover:text-bazar-gold-light break-all font-semibold"
                >
                  {part}
                </a>
              );
            }

            // Negrito com asteriscos *texto*
            const boldParts = part.split(/(\*[^*]+\*)/g);
            return boldParts.map((bPart, bIdx) => {
              if (bPart.startsWith('*') && bPart.endsWith('*')) {
                return (
                  <strong key={bIdx} className="font-bold text-white">
                    {bPart.slice(1, -1)}
                  </strong>
                );
              }
              // Itálico com _texto_
              const italicParts = bPart.split(/(_[^_]+_)/g);
              return italicParts.map((iPart, iIdx) => {
                if (iPart.startsWith('_') && iPart.endsWith('_')) {
                  return (
                    <em key={iIdx} className="italic text-bazar-gold/90 font-serif">
                      {iPart.slice(1, -1)}
                    </em>
                  );
                }
                return iPart;
              });
            });
          })}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-bazar-black text-bazar-parchment flex flex-col items-center justify-center p-3 sm:p-6">
      {/* Container Estilo Smartphone / WhatsApp Místico */}
      <div className="w-full max-w-xl bg-[#0e0914] border-2 border-bazar-gold/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[88vh]">
        {/* Topbar do Guardião */}
        <div className="bg-[#181024] border-b border-bazar-gold/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-bazar-gold hover:text-white transition p-1">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-bazar-wine to-bazar-purple border-2 border-bazar-gold flex items-center justify-center text-bazar-gold shadow-md">
                <Moon className="w-6 h-6 text-bazar-gold" />
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#181024] ${
                  botMode === 'BOT' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
                title={botMode === 'BOT' ? 'Mago Guardião Ativo' : 'Modo Atendente Humano'}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mystic font-bold text-sm tracking-wider text-bazar-parchment">
                  O Guardião do Bazar
                </h2>
              </div>
              <p className="text-[11px] text-bazar-gold/80 font-editorial italic">
                {botMode === 'BOT' ? '✦ Mago Sentinela do Altar' : '🟡 Atendimento Humano Vinculado'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {botMode === 'HUMAN' && (
              <button
                onClick={handleResetBot}
                title="Reativar Mago Guardião"
                className="text-xs bg-bazar-gold/20 hover:bg-bazar-gold/30 text-bazar-gold px-2.5 py-1.5 rounded-xl border border-bazar-gold/40 flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reativar
              </button>
            )}
            <a
              href="https://wa.me/5513998039867"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>

        {/* Alerta de Ticket Ativo */}
        {ticketAlert && (
          <div className="bg-amber-950/80 border-b border-amber-600/40 px-4 py-2.5 text-xs text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{ticketAlert}</span>
            </div>
            <button
              onClick={() => setTicketAlert(null)}
              className="text-amber-400 hover:text-white font-bold ml-2 text-sm"
            >
              ×
            </button>
          </div>
        )}

        {/* Área de Mensagens */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1228] via-[#0d0815] to-[#08050e] text-xs sm:text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'CUSTOMER' ? 'items-end' : m.sender === 'BOT' ? 'items-start' : 'items-center'
              }`}
            >
              {m.sender === 'SYSTEM' ? (
                <div className="bg-[#1b1424] border border-bazar-gold/30 rounded-xl px-4 py-2 text-xs text-bazar-gold text-center my-2 max-w-[90%] shadow-md">
                  {m.text}
                </div>
              ) : (
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-lg ${
                    m.sender === 'CUSTOMER'
                      ? 'bg-gradient-to-r from-bazar-wine to-bazar-wine-light text-white rounded-br-none border border-bazar-gold/30'
                      : 'bg-[#181124] text-gray-200 rounded-bl-none border border-bazar-gold/20 shadow-mystic'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-60 text-[10px] uppercase font-bold tracking-wider">
                    {m.sender === 'CUSTOMER' ? (
                      <>
                        <User className="w-3 h-3" /> Você
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-bazar-gold" /> Mago Guardião
                      </>
                    )}
                    <span className="ml-auto">{m.time}</span>
                  </div>

                  <div className="space-y-1">{renderMessageContent(m.text)}</div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-bazar-gold italic bg-[#181124] p-3 rounded-2xl border border-bazar-gold/30 w-fit shadow-md">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-bazar-gold" />
              O Mago Guardião está consultando as escrituras arcanas...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Pílulas de Perguntas Místicas e Operacionais */}
        <div className="bg-[#120a1c] border-t border-bazar-gold/10 p-2 px-3 flex gap-2 overflow-x-auto text-[11px] text-gray-300 scrollbar-none">
          <button
            onClick={() => handleSend('Como consagrar meu cristal?')}
            className="whitespace-nowrap px-3 py-1.5 bg-bazar-gold/10 hover:bg-bazar-gold/25 border border-bazar-gold/30 text-bazar-gold rounded-full transition flex items-center gap-1"
          >
            🕯️ Como consagrar cristal
          </button>
          <button
            onClick={() => handleSend('Como limpar a energia da minha casa?')}
            className="whitespace-nowrap px-3 py-1.5 bg-bazar-gold/10 hover:bg-bazar-gold/25 border border-bazar-gold/30 text-bazar-gold rounded-full transition flex items-center gap-1"
          >
            🌿 Limpar energia do lar
          </button>
          <button
            onClick={() => handleSend('Para que serve a ametista?')}
            className="whitespace-nowrap px-3 py-1.5 bg-bazar-gold/10 hover:bg-bazar-gold/25 border border-bazar-gold/30 text-bazar-gold rounded-full transition flex items-center gap-1"
          >
            🔮 Ametista & Ansiedade
          </button>
          <button
            onClick={() => handleSend('Como montar um altar?')}
            className="whitespace-nowrap px-3 py-1.5 bg-bazar-gold/10 hover:bg-bazar-gold/25 border border-bazar-gold/30 text-bazar-gold rounded-full transition flex items-center gap-1"
          >
            🏛️ Montar meu altar
          </button>
          <button
            onClick={() => handleSend('Qual o segredo do quartzo rosa no amor?')}
            className="whitespace-nowrap px-3 py-1.5 bg-bazar-gold/10 hover:bg-bazar-gold/25 border border-bazar-gold/30 text-bazar-gold rounded-full transition flex items-center gap-1"
          >
            🌹 Amor & Afrodite
          </button>
          <button
            onClick={() => handleSend('Quais os melhores amuletos de proteção?')}
            className="whitespace-nowrap px-3 py-1.5 bg-bazar-gold/10 hover:bg-bazar-gold/25 border border-bazar-gold/30 text-bazar-gold rounded-full transition flex items-center gap-1"
          >
            🛡️ Amuletos de proteção
          </button>
          <button
            onClick={() => handleSend('Qual a melhor fase da lua para rituais?')}
            className="whitespace-nowrap px-3 py-1.5 bg-bazar-gold/10 hover:bg-bazar-gold/25 border border-bazar-gold/30 text-bazar-gold rounded-full transition flex items-center gap-1"
          >
            🌕 Fases da Lua
          </button>
          <button
            onClick={() => handleSend('Quero falar com um atendente humano')}
            className="whitespace-nowrap px-3 py-1.5 bg-amber-950/50 hover:bg-amber-900/70 border border-amber-600/40 text-amber-200 rounded-full transition flex items-center gap-1"
          >
            👤 Atendimento Humano
          </button>
        </div>

        {/* Input Bar */}
        <div className="bg-[#181024] border-t border-bazar-gold/20 p-3 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              botMode === 'BOT'
                ? 'Pergunte ao Mago sobre rituais, cristais, pedidos ou envie sua dúvida...'
                : 'Digite para enviar mensagem ao atendente humano...'
            }
            className="flex-1 bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-bazar-gold transition placeholder:text-gray-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2.5 bg-bazar-gold hover:bg-bazar-gold-light disabled:opacity-40 text-bazar-black rounded-xl transition flex items-center justify-center font-bold shadow-md"
            title="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
