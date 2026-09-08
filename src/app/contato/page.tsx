'use client';

import React, { useState } from 'react';
import { Mail, MessageCircle, Clock, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { INITIAL_SETTINGS } from '@/data/db';

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold tracking-widest text-bazar-gold uppercase">
          Atendimento Humanizado
        </span>
        <h1 className="font-mystic text-3xl sm:text-4xl font-extrabold text-bazar-parchment uppercase">
          FALE COM UM GUARDIÃO
        </h1>
        <p className="font-editorial italic text-base sm:text-lg text-bazar-parchment/70 max-w-xl mx-auto">
          Dúvidas sobre o envio, sobre qual cristal escolher ou sobre o seu ritual pessoal? Estamos aqui para ouvir você.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card WhatsApp */}
        <div className="p-6 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border space-y-3">
          <div className="p-3 w-fit rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="font-mystic text-sm font-bold text-bazar-parchment">WhatsApp Direto</h3>
          <p className="text-xs text-bazar-parchment/70 leading-relaxed">
            Atendimento em tempo real para dúvidas sobre pedidos e escolha de peças.
          </p>
          <a
            href={`https://wa.me/${INITIAL_SETTINGS.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de falar com um guardião do Bazar do Bruxo.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-1"
          >
            Iniciar conversa →
          </a>
        </div>

        {/* Card E-mail */}
        <div className="p-6 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border space-y-3">
          <div className="p-3 w-fit rounded-xl bg-bazar-purple/60 border border-bazar-gold/30 text-bazar-gold">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-mystic text-sm font-bold text-bazar-parchment">E-mail Oficial</h3>
          <p className="text-xs text-bazar-parchment/70 leading-relaxed">
            Para parcerias, solicitações de trocas e assuntos corporativos.
          </p>
          <a
            href={`mailto:${INITIAL_SETTINGS.supportEmail}`}
            className="inline-block text-xs font-bold text-bazar-gold hover:text-bazar-gold-light pt-1"
          >
            {INITIAL_SETTINGS.supportEmail}
          </a>
        </div>

        {/* Card Horários */}
        <div className="p-6 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border space-y-3">
          <div className="p-3 w-fit rounded-xl bg-bazar-wine/60 border border-bazar-gold/30 text-bazar-gold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-mystic text-sm font-bold text-bazar-parchment">Horário do Ateliê</h3>
          <p className="text-xs text-bazar-parchment/70 leading-relaxed">
            Segunda a Sexta das 09h às 18h.<br />
            Sábados das 10h às 14h.
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold block pt-1">
            Respostas em até 4 horas úteis
          </span>
        </div>

      </div>

      {/* Formulário de Mensagem */}
      <div className="p-8 rounded-3xl bg-bazar-charcoal-light border border-bazar-charcoal-border max-w-2xl mx-auto shadow-mystic">
        <h2 className="font-mystic text-lg font-bold text-bazar-parchment uppercase mb-4 text-center">
          Envie sua Mensagem
        </h2>

        {submitted ? (
          <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-300">Mensagem Entregue ao Bazar!</h3>
            <p className="text-xs text-bazar-parchment/70">
              Nossa equipe entrará em contato pelo seu e-mail ou WhatsApp em breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-bazar-parchment/70 block mb-1">Seu Nome</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:outline-none focus:border-bazar-gold"
                />
              </div>
              <div>
                <label className="text-bazar-parchment/70 block mb-1">Seu E-mail</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:outline-none focus:border-bazar-gold"
                />
              </div>
            </div>

            <div>
              <label className="text-bazar-parchment/70 block mb-1">Assunto</label>
              <input
                type="text"
                required
                placeholder="Ex: Dúvida sobre meu pedido ou escolha de cristal"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:outline-none focus:border-bazar-gold"
              />
            </div>

            <div>
              <label className="text-bazar-parchment/70 block mb-1">Mensagem</label>
              <textarea
                rows={4}
                required
                placeholder="Escreva como podemos ajudar..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:outline-none focus:border-bazar-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 border border-bazar-gold/50 shadow-mystic"
            >
              <Send className="w-3.5 h-3.5 text-bazar-gold" />
              <span>ENVIAR AO BAZAR</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
