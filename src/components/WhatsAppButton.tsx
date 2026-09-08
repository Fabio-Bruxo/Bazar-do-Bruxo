'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { INITIAL_SETTINGS } from '@/data/db';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Ocultar em páginas de checkout para manter taxa de conversão máxima
  if (pathname.startsWith('/checkout')) {
    return null;
  }

  const getContextualMessage = () => {
    if (pathname.startsWith('/produto/')) {
      return 'Olá! Estou no Bazar do Bruxo vendo um produto e gostaria de uma orientação sobre ele.';
    }
    if (pathname.startsWith('/quiz')) {
      return 'Olá! Acabei de fazer o Quiz do Cristal e gostaria de falar com um guardião do Bazar.';
    }
    if (pathname.startsWith('/kits')) {
      return 'Olá! Estou em dúvida sobre qual Kit Ritual combina melhor com meu momento.';
    }
    return 'Olá! Estou visitando O Bazar do Bruxo e gostaria de tirar uma dúvida sobre os achados e rituais.';
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(getContextualMessage());
    const url = `https://wa.me/${INITIAL_SETTINGS.whatsappNumber}?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Tooltip / Balão de Atendimento Humanizado */}
      {isOpen && (
        <div className="mb-3 max-w-xs bg-bazar-charcoal-light border border-bazar-gold/50 rounded-2xl p-4 shadow-mystic text-xs text-bazar-parchment animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 border-b border-bazar-charcoal-border mb-2">
            <div className="flex items-center gap-1.5 text-bazar-gold font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Guardião do Bazar</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-bazar-parchment/60 hover:text-bazar-parchment"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-bazar-parchment/80 mb-3 leading-relaxed">
            Precisa de ajuda para escolher um cristal ou tirar dúvidas sobre o seu pedido? Fale com nosso atendimento humanizado.
          </p>
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Conversar no WhatsApp</span>
          </button>
        </div>
      )}

      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-mystic flex items-center gap-2 transition-all duration-300 hover:scale-105 border border-emerald-400/40"
        aria-label="Atendimento no WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline text-xs font-bold pr-1">Dúvidas no WhatsApp</span>
      </button>
    </div>
  );
}
