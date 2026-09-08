'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  RefreshCw, 
  Lock,
  Instagram,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';
import { trackEvent } from '@/utils/analytics';

export default function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preference, setPreference] = useState('Cristais');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Salvar no localStorage de leads
    try {
      const existing = JSON.parse(localStorage.getItem('bazar_leads') || '[]');
      existing.push({
        name: name.trim() || 'Viajante do Bazar',
        email: email.trim(),
        preference,
        source: 'newsletter',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('bazar_leads', JSON.stringify(existing));
    } catch (e) {}

    trackEvent('lead', { name, email, preference, source: 'footer_newsletter' });
    setIsSubmitted(true);
  };

  return (
    <footer className="bg-bazar-charcoal-light border-t border-bazar-charcoal-border relative overflow-hidden pb-16 lg:pb-0">
      
      {/* BLOCO 8 — CAPTAÇÃO: ENTRE PARA O CÍRCULO DO BAZAR */}
      <div className="border-b border-bazar-charcoal-border/70 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-bazar-charcoal to-bazar-charcoal-light">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-bazar-gold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" /> O Círculo do Bazar
          </span>
          <h3 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment mb-3">
            ENTRE PARA O CÍRCULO DO BAZAR
          </h3>
          <p className="text-sm text-bazar-parchment/70 max-w-xl mx-auto mb-8 font-editorial text-base">
            Receba novidades, achados especiais, histórias ancestrais e pequenas surpresas preparadas pelos nossos artesãos.
          </p>

          {isSubmitted ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl max-w-md mx-auto text-center flex items-center justify-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold">Bem-vindo(a) ao Círculo! Seus primeiros achados chegarão em breve.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="max-w-2xl mx-auto space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-4 py-2.5 text-xs text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none focus:border-bazar-gold"
                  required
                />
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-4 py-2.5 text-xs text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none focus:border-bazar-gold"
                  required
                />
                <select
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                  className="bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-4 py-2.5 text-xs text-bazar-parchment focus:outline-none focus:border-bazar-gold"
                >
                  <option value="Cristais">Interesse: Cristais</option>
                  <option value="Rituais">Interesse: Rituais</option>
                  <option value="Ervas">Interesse: Ervas</option>
                  <option value="Aromas">Interesse: Aromas</option>
                  <option value="Bruxaria">Interesse: Bruxaria</option>
                  <option value="Presentes">Interesse: Presentes</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment text-xs font-bold tracking-widest uppercase shadow-mystic border border-bazar-gold/40 flex items-center justify-center gap-2 mx-auto transition-all"
              >
                <span>RECEBER ENCONTROS MÁGICOS</span>
                <Send className="w-3.5 h-3.5 text-bazar-gold" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* SELOS DE CONFIANÇA & BENEFÍCIOS */}
      <div className="border-b border-bazar-charcoal-border/50 py-8 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-bazar-gold mb-2" />
            <h4 className="text-xs font-bold text-bazar-parchment uppercase tracking-wider">Cristais 100% Naturais</h4>
            <p className="text-[11px] text-bazar-parchment/60 mt-0.5">Garimpo ético e procedência certificada</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="w-6 h-6 text-bazar-gold mb-2" />
            <h4 className="text-xs font-bold text-bazar-parchment uppercase tracking-wider">Envio Seguro</h4>
            <p className="text-[11px] text-bazar-parchment/60 mt-0.5">Embalagens rústicas e protegidas para todo o país</p>
          </div>
          <div className="flex flex-col items-center">
            <RefreshCw className="w-6 h-6 text-bazar-gold mb-2" />
            <h4 className="text-xs font-bold text-bazar-parchment uppercase tracking-wider">Troca Descomplicada</h4>
            <p className="text-[11px] text-bazar-parchment/60 mt-0.5">7 dias para trocas ou devoluções sem atritos</p>
          </div>
          <div className="flex flex-col items-center">
            <Lock className="w-6 h-6 text-bazar-gold mb-2" />
            <h4 className="text-xs font-bold text-bazar-parchment uppercase tracking-wider">Pagamento Criptografado</h4>
            <p className="text-[11px] text-bazar-parchment/60 mt-0.5">PIX dinâmico e cartões em ambiente blindado</p>
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO INSTITUCIONAL */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Marca e Conceito */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-block">
              <span className="font-mystic text-xl font-bold tracking-wider text-bazar-parchment">
                O BAZAR DO BRUXO
              </span>
            </Link>
            <p className="font-editorial italic text-sm text-bazar-gold">
              &ldquo;Algumas coisas simplesmente encontram você.&rdquo;
            </p>
            <p className="text-xs text-bazar-parchment/70 leading-relaxed max-w-sm">
              Um antigo bazar místico, reinventado para a vida moderna. Cristais autênticos, incensos botânicos, cerâmicas e instrumentos rituais para transformar a rotina em momentos de serenidade e presença.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-bazar-charcoal rounded-full border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment/80 hover:text-bazar-gold transition-colors"
                aria-label="Instagram do Bazar"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/5513998039867"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-bazar-charcoal rounded-full border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment/80 hover:text-bazar-gold transition-colors"
                aria-label="WhatsApp do Bazar"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navegação no Bazar */}
          <div>
            <h4 className="font-mystic text-xs font-bold text-bazar-gold uppercase tracking-wider mb-3">
              Explorar o Bazar
            </h4>
            <ul className="space-y-2 text-xs text-bazar-parchment/70">
              <li><Link href="/cristais" className="hover:text-bazar-gold transition-colors">Cristais e Minerais</Link></li>
              <li><Link href="/incensos-aromas" className="hover:text-bazar-gold transition-colors">Incensos de Massala</Link></li>
              <li><Link href="/kits" className="hover:text-bazar-gold transition-colors">Kits Rituais Prontos</Link></li>
              <li><Link href="/casa-mistica" className="hover:text-bazar-gold transition-colors">Casa Mística e Decoração</Link></li>
              <li><Link href="/quiz" className="hover:text-bazar-gold transition-colors text-bazar-gold font-semibold">Quiz: Descobrir Meu Cristal</Link></li>
              <li><Link href="/grimorio" className="hover:text-bazar-gold transition-colors">O Grimório (Artigos)</Link></li>
            </ul>
          </div>

          {/* Institucional & Ajuda */}
          <div>
            <h4 className="font-mystic text-xs font-bold text-bazar-gold uppercase tracking-wider mb-3">
              Atendimento & Suporte
            </h4>
            <ul className="space-y-2 text-xs text-bazar-parchment/70">
              <li><Link href="/sobre" className="hover:text-bazar-gold transition-colors">Sobre o Bazar</Link></li>
              <li><Link href="/contato" className="hover:text-bazar-gold transition-colors">Fale Conosco</Link></li>
              <li><Link href="/afiliados" className="hover:text-bazar-gold transition-colors">Guardiões do Bazar (Afiliados)</Link></li>
              <li><Link href="/politica-envio" className="hover:text-bazar-gold transition-colors">Política de Envio e Prazos</Link></li>
              <li><Link href="/trocas-devolucoes" className="hover:text-bazar-gold transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/admin" className="hover:text-bazar-gold text-bazar-gold/60 transition-colors">Acesso Administrativo</Link></li>
            </ul>
          </div>

          {/* Políticas & Legal */}
          <div>
            <h4 className="font-mystic text-xs font-bold text-bazar-gold uppercase tracking-wider mb-3">
              Políticas Legais
            </h4>
            <ul className="space-y-2 text-xs text-bazar-parchment/70">
              <li><Link href="/termos" className="hover:text-bazar-gold transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-bazar-gold transition-colors">Privacidade e LGPD</Link></li>
              <li>
                <span className="block text-[11px] text-bazar-parchment/50 mt-2 leading-relaxed">
                  Os minerais e rituais são objetos de contemplação simbólica e bem-estar. Não realizamos promessas de cura médica ou terapêutica.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé Final */}
        <div className="mt-12 pt-6 border-t border-bazar-charcoal-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-bazar-parchment/50">
          <p>© 2026 O Bazar do Bruxo. Todos os direitos reservados. CNPJ: 00.000.000/0001-00.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><CreditCard className="w-4 h-4 text-bazar-gold" /> PIX • Cartões de Crédito • Boleto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
