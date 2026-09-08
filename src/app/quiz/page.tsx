'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  ShoppingBag, 
  Tag, 
  Send,
  Compass,
  Flame,
  ShieldCheck,
  Moon
} from 'lucide-react';
import { QUIZ_QUESTIONS, QUIZ_RESULTS } from '@/data/quiz';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import { useCart } from '@/context/CartContext';
import { trackEvent } from '@/utils/analytics';
import { formatCurrency } from '@/utils/currency';

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0 a length-1
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSaved, setLeadSaved] = useState(false);
  const [resultKey, setResultKey] = useState<string>('ametista');

  const { addToCart } = useCart();

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (archetype: string) => {
    const updated = { ...selectedAnswers, [currentQuestion.id]: archetype };
    setSelectedAnswers(updated);

    if (currentStep === 0) {
      trackEvent('quiz_start');
    }

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calcular arquétipo mais frequente
      const counts: Record<string, number> = {};
      Object.values(updated).forEach((arch) => {
        counts[arch] = (counts[arch] || 0) + 1;
      });

      let winner = 'ametista';
      let maxCount = 0;
      Object.entries(counts).forEach(([arch, count]) => {
        if (count > maxCount) {
          maxCount = count;
          winner = arch;
        }
      });

      setResultKey(winner);
      setIsCompleted(true);
      trackEvent('quiz_complete', { archetype: winner });
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    setLeadSaved(false);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('bazar_leads') || '[]');
      existing.push({
        name: leadName.trim() || 'Iniciado no Quiz',
        email: leadEmail.trim(),
        preference: 'Quiz do Cristal',
        source: 'quiz',
        quizResult: resultKey,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('bazar_leads', JSON.stringify(existing));
    } catch (e) {}

    trackEvent('lead', { email: leadEmail, name: leadName, result: resultKey, source: 'quiz_funnel' });
    setLeadSaved(true);
  };

  const resultData = QUIZ_RESULTS[resultKey] || QUIZ_RESULTS['ametista'];
  const suggestedProduct = ALL_INITIAL_PRODUCTS.find((p) => p.slug === resultData.suggestedProductSlug);
  const secondaryProduct = ALL_INITIAL_PRODUCTS.find((p) => p.slug === resultData.secondaryProductSlug);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {!isCompleted ? (
        <div className="space-y-8">
          
          {/* Header do Quiz */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-bazar-gold uppercase mb-2">
              <Compass className="w-4 h-4 text-bazar-gold" /> Oráculo dos Cristais
            </span>
            <h1 className="font-mystic text-3xl sm:text-4xl font-extrabold text-bazar-parchment uppercase">
              QUAL É O SEU CRISTAL?
            </h1>
            <p className="font-editorial italic text-base sm:text-lg text-bazar-parchment/70 mt-2">
              Você não precisa conhecer todos os minerais do mundo. Apenas ouça o que seu ritmo pede hoje.
            </p>

            {/* Barra de Progresso */}
            <div className="mt-8 flex items-center justify-between text-xs text-bazar-parchment/60 mb-2 font-mono">
              <span>Etapa {currentStep + 1} de {totalQuestions}</span>
              <span>{Math.round(((currentStep + 1) / totalQuestions) * 100)}%</span>
            </div>
            <div className="w-full bg-bazar-charcoal rounded-full h-2 overflow-hidden border border-bazar-charcoal-border">
              <div
                className="bg-gradient-to-r from-bazar-wine to-bazar-gold h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Card da Pergunta Atual */}
          <div className="bg-bazar-charcoal-light/70 border border-bazar-gold/40 rounded-3xl p-6 sm:p-10 shadow-mystic animate-in fade-in zoom-in-95 duration-300">
            <div className="mb-6 text-center">
              <h2 className="font-mystic text-xl sm:text-2xl font-bold text-bazar-parchment">
                {currentQuestion.question}
              </h2>
              <p className="font-editorial italic text-sm text-bazar-gold/80 mt-1">
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Opções de Resposta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option.archetype)}
                  className="p-5 rounded-2xl bg-bazar-charcoal border border-bazar-charcoal-border hover:border-bazar-gold hover:bg-bazar-charcoal/90 text-left transition-all duration-200 group flex flex-col justify-between hover:shadow-mystic-gold hover:scale-[1.01]"
                >
                  <p className="text-sm font-semibold text-bazar-parchment group-hover:text-bazar-gold transition-colors leading-relaxed">
                    {option.text}
                  </p>
                  <span className="text-[11px] text-bazar-parchment/50 font-editorial italic mt-3 block">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>

            {/* Botão de Voltar se não for a primeira */}
            {currentStep > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs text-bazar-parchment/50 hover:text-bazar-gold underline"
                >
                  ← Voltar à pergunta anterior
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TELA DE RESULTADO DO QUIZ */
        <div className="space-y-10 animate-in fade-in duration-500">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-bazar-gold uppercase mb-2">
              <Sparkles className="w-4 h-4 text-bazar-gold" /> Seu Encontro Arcano Revelado
            </span>
            <h1 className="font-mystic text-3xl sm:text-4xl font-extrabold text-bazar-parchment uppercase">
              {resultData.crystalName}
            </h1>
            <p className="font-editorial italic text-lg sm:text-xl text-bazar-gold mt-1 font-semibold">
              &ldquo;{resultData.tagline}&rdquo;
            </p>
          </div>

          {/* Card Central com Diagnóstico */}
          <div className="bg-gradient-to-b from-bazar-wine-deep/40 to-bazar-charcoal-light border border-bazar-gold/50 rounded-3xl p-6 sm:p-10 shadow-mystic space-y-6">
            <div>
              <h3 className="font-mystic text-sm uppercase tracking-wider text-bazar-gold font-bold mb-2">
                O que este encontro revela sobre o seu momento:
              </h3>
              <p className="text-sm sm:text-base text-bazar-parchment/90 leading-relaxed font-editorial">
                {resultData.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-bazar-charcoal border border-bazar-charcoal-border">
              <h4 className="font-mystic text-xs uppercase tracking-wider text-bazar-gold font-bold mb-1">
                Por que este é o seu amuleto ideal:
              </h4>
              <p className="text-xs sm:text-sm text-bazar-parchment/80 leading-relaxed">
                {resultData.recommendationReason}
              </p>
            </div>

            {/* Captura de Lead com Cupom */}
            <div className="border-t border-bazar-charcoal-border/70 pt-6">
              {!leadSaved ? (
                <div className="bg-bazar-charcoal/80 border border-bazar-gold/30 rounded-2xl p-5 text-center max-w-xl mx-auto">
                  <span className="text-xs font-bold text-bazar-gold tracking-wider uppercase block mb-1">
                    Presente de Boas-Vindas ao Bazar
                  </span>
                  <p className="text-xs text-bazar-parchment/80 mb-4">
                    Insira seu e-mail para receber este relatório completo e liberar o cupom de <strong>10% OFF</strong> para seu primeiro achado.
                  </p>
                  <form onSubmit={handleSaveLead} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2 text-xs text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none focus:border-bazar-gold"
                    />
                    <input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="flex-1 bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-xl px-3 py-2 text-xs text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none focus:border-bazar-gold"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-bazar-gold hover:bg-bazar-gold-light text-bazar-charcoal text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>DESBLOQUEAR CUPOM</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center max-w-md mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-emerald-300">
                    Cupom Desbloqueado com Sucesso!
                  </p>
                  <p className="text-xs text-bazar-parchment/80 mt-1">
                    Use o código <strong className="text-bazar-gold font-bold text-sm">PRIMEIRORITUAL</strong> no seu carrinho para ganhar 10% de desconto.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* O Produto Sugerido para Compra Direta */}
          {suggestedProduct && (
            <div className="bg-bazar-charcoal-light border border-bazar-charcoal-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-mystic">
              <img
                src={suggestedProduct.images[0]}
                alt={suggestedProduct.name}
                className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-2xl border border-bazar-charcoal-border shrink-0"
              />
              <div className="flex-1 text-center md:text-left space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-bazar-gold">
                  Seu Achado Recomendado
                </span>
                <h3 className="font-mystic text-xl font-bold text-bazar-parchment">
                  {suggestedProduct.name}
                </h3>
                <p className="text-xs text-bazar-parchment/70 line-clamp-2 font-editorial text-sm">
                  {suggestedProduct.description.whatIs}
                </p>
                <div className="pt-2 flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-xl font-extrabold text-bazar-gold">
                    {formatCurrency(suggestedProduct.promotionalPrice || suggestedProduct.price)}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">
                    (ou com 5% de desconto no PIX)
                  </span>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => addToCart(suggestedProduct, 1)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-mystic border border-bazar-gold/40"
                  >
                    <ShoppingBag className="w-4 h-4 text-bazar-gold" />
                    <span>ADICIONAR AO RITUAL</span>
                  </button>
                  <Link
                    href={`/produto/${suggestedProduct.slug}`}
                    className="px-5 py-3 rounded-xl bg-bazar-charcoal border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment text-xs font-semibold flex items-center justify-center"
                  >
                    Ver Detalhes do Produto
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Produto Complementar / Cross-sell */}
          {secondaryProduct && (
            <div className="p-4 sm:p-6 bg-bazar-charcoal rounded-2xl border border-bazar-charcoal-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={secondaryProduct.images[0]}
                  alt={secondaryProduct.name}
                  className="w-16 h-16 object-cover rounded-xl border border-bazar-charcoal-border shrink-0"
                />
                <div>
                  <span className="text-[10px] text-bazar-gold font-bold uppercase tracking-wider">
                    Harmonização Complementar
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-bazar-parchment">
                    {secondaryProduct.name}
                  </h4>
                  <p className="text-xs text-bazar-gold font-semibold">
                    {formatCurrency(secondaryProduct.promotionalPrice || secondaryProduct.price)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => addToCart(secondaryProduct, 1)}
                className="w-full sm:w-auto px-4 py-2 bg-bazar-charcoal-light border border-bazar-gold/50 text-bazar-gold hover:bg-bazar-gold hover:text-bazar-charcoal text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                + Adicionar Junto
              </button>
            </div>
          )}

          {/* Botão de Refazer */}
          <div className="text-center pt-6">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 text-xs text-bazar-parchment/60 hover:text-bazar-gold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refazer o Quiz com outras intenções</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
