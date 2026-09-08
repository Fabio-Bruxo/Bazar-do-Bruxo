import React from 'react';
import Link from 'next/link';
import { Sparkles, Users, Award, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Guardiões do Bazar | Programa de Afiliados',
  description: 'Faça parte dos Guardiões do Bazar. Compartilhe rituais, cristais e encantos com sua audiência e receba até 15% de comissão.',
};

export default function AfiliadosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold tracking-widest text-bazar-gold uppercase">
          Comunidade & Parceria
        </span>
        <h1 className="font-mystic text-3xl sm:text-5xl font-extrabold text-bazar-parchment uppercase">
          GUARDIÕES DO BAZAR
        </h1>
        <p className="font-editorial italic text-base sm:text-lg text-bazar-parchment/70 max-w-xl mx-auto">
          Nosso programa exclusivo para criadores de conteúdo, terapeutas, astrólogos, bruxos e entusiastas da espiritualidade prática.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border space-y-2 text-center">
          <div className="p-3 w-fit rounded-xl bg-bazar-wine/60 text-bazar-gold mx-auto mb-2">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="font-mystic text-sm font-bold text-bazar-parchment">15% de Comissão</h3>
          <p className="text-xs text-bazar-parchment/60 leading-relaxed">
            Receba comissões sobre todas as vendas realizadas pelo seu link ou cupom personalizado.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border space-y-2 text-center">
          <div className="p-3 w-fit rounded-xl bg-bazar-purple/60 text-bazar-gold mx-auto mb-2">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-mystic text-sm font-bold text-bazar-parchment">Painel Simplificado</h3>
          <p className="text-xs text-bazar-parchment/60 leading-relaxed">
            Acompanhe cliques, vendas aprovadas e faturamento em tempo real através do painel.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border space-y-2 text-center">
          <div className="p-3 w-fit rounded-xl bg-emerald-950/60 text-emerald-400 mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-mystic text-sm font-bold text-bazar-parchment">Materiais Místicos</h3>
          <p className="text-xs text-bazar-parchment/60 leading-relaxed">
            Acesso a fotos autorais em alta resolução, vídeos de unboxing e cópias poéticas para divulgar.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-bazar-charcoal-light border border-bazar-gold/40 text-center space-y-4 shadow-mystic max-w-xl mx-auto">
        <h2 className="font-mystic text-lg font-bold text-bazar-parchment uppercase">
          Candidate-se ao Círculo de Guardiões
        </h2>
        <p className="text-xs text-bazar-parchment/70 leading-relaxed">
          Preencha sua solicitação para receber seu link único de afiliado e cupom exclusivo para sua comunidade.
        </p>
        <a
          href={`https://wa.me/5513998039867?text=${encodeURIComponent('Olá! Gostaria de me candidatar ao programa Guardiões do Bazar.')}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment text-xs font-bold tracking-widest uppercase border border-bazar-gold/40 shadow-mystic"
        >
          <span>QUERO SER UM GUARDIÃO</span>
          <ArrowRight className="w-4 h-4 text-bazar-gold" />
        </a>
      </div>
    </div>
  );
}
