import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Moon, 
  Compass, 
  Heart, 
  Feather, 
  Flame, 
  Sun,
  Star,
  BookOpen
} from 'lucide-react';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import { INITIAL_KITS } from '@/data/kits';
import { INITIAL_ARTICLES } from '@/data/grimorio';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  // BLOCO 3: 8 produtos favoritos especificados
  const bestSellersSlugs = [
    'ametista-drusa-natural',
    'quartzo-rosa-bruto',
    'turmalina-negra-rocha-bruta',
    'bastao-de-selenita-branca',
    'olho-de-tigre-rolado-especial',
    'incenso-tradicional-nag-champa',
    'incensario-cascata-ceramica-noite-estrelada',
    'japamala-sandalo-pedras-vulcanicas',
  ];

  const bestSellers = ALL_INITIAL_PRODUCTS.filter((p) =>
    bestSellersSlugs.includes(p.slug)
  );

  // Categorias por intenção
  const intentions = [
    {
      id: 'calma',
      name: 'CALMA',
      description: 'Silêncio interior, descanso e desaceleração mental',
      icon: Moon,
      color: 'from-indigo-950/80 to-purple-950/80 border-indigo-500/40',
      href: '/cristais?intencao=calma',
    },
    {
      id: 'protecao',
      name: 'PROTEÇÃO',
      description: 'Ancoramento firme, limites e escudo para o lar',
      icon: ShieldCheck,
      color: 'from-zinc-950/80 to-stone-900/80 border-stone-600/40',
      href: '/cristais?intencao=protecao',
    },
    {
      id: 'amor-proprio',
      name: 'AMOR-PRÓPRIO',
      description: 'Acolhimento pessoal, ternura e reconciliação',
      icon: Heart,
      color: 'from-rose-950/80 to-pink-950/80 border-rose-500/40',
      href: '/cristais?intencao=amor-proprio',
    },
    {
      id: 'coragem',
      name: 'CORAGEM',
      description: 'Foco resoluto, iniciativa e determinação ativa',
      icon: Flame,
      color: 'from-amber-950/80 to-orange-950/80 border-amber-600/40',
      href: '/cristais?intencao=coragem',
    },
    {
      id: 'natureza',
      name: 'NATUREZA',
      description: 'Raízes vivas, botânica e elementos da floresta',
      icon: Feather,
      color: 'from-emerald-950/80 to-teal-950/80 border-emerald-600/40',
      href: '/cristais?intencao=natureza',
    },
    {
      id: 'intuicao',
      name: 'INTUIÇÃO',
      description: 'Sabedoria sutil, escuta interior e mistério',
      icon: Compass,
      color: 'from-purple-950/80 to-fuchsia-950/80 border-purple-500/40',
      href: '/cristais?intencao=intuicao',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* BLOCO 1 — HERO */}
      <section className="relative overflow-hidden bg-hero-mystic py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-bazar-charcoal-border/70">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bazar-wine/40 border border-bazar-gold/30 text-bazar-gold text-xs font-semibold tracking-widest uppercase mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Um antigo bazar mágico para a vida moderna</span>
          </div>

          <h1 className="font-mystic text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-widest text-bazar-parchment uppercase drop-shadow-md">
            O BAZAR DO BRUXO
          </h1>

          <p className="font-editorial italic text-lg sm:text-2xl text-bazar-gold font-medium mt-3 mb-6">
            Tudo para o seu ritual.
          </p>

          <p className="text-sm sm:text-base text-bazar-parchment/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Cristais, aromas, ervas, pequenos mistérios e achados especiais para transformar momentos comuns em pequenos rituais.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#achados"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment text-xs font-bold tracking-widest uppercase shadow-mystic border border-bazar-gold/50 flex items-center justify-center gap-2 transition-all group"
            >
              <span>ENTRAR NO BAZAR</span>
              <ArrowRight className="w-4 h-4 text-bazar-gold group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              href="/quiz"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-bazar-charcoal-light hover:bg-bazar-charcoal border border-bazar-gold/50 text-bazar-gold hover:text-bazar-parchment text-xs font-bold tracking-widest uppercase shadow-sm flex items-center justify-center gap-2 transition-all group"
            >
              <Sparkles className="w-4 h-4 text-bazar-gold" />
              <span>DESCOBRIR MEU CRISTAL</span>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-bazar-charcoal-border/40">
            <p className="font-editorial italic text-base sm:text-lg text-bazar-parchment/60">
              &ldquo;Algumas coisas simplesmente encontram você.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* BLOCO 2 — CATEGORIAS POR INTENÇÃO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-bazar-gold uppercase block mb-1">
            Navegue pelo que seu espírito pede
          </span>
          <h2 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment uppercase">
            CATEGORIAS POR INTENÇÃO
          </h2>
          <p className="text-xs text-bazar-parchment/60 mt-1 max-w-md mx-auto font-editorial italic text-sm">
            Escolha o sentimento guia para encontrar os minerais e rituais que respondem ao seu momento.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {intentions.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group p-5 rounded-2xl bg-gradient-to-b ${item.color} border hover:scale-[1.03] transition-all duration-300 flex flex-col items-center text-center shadow-mystic`}
              >
                <div className="p-3 rounded-full bg-bazar-charcoal/60 border border-bazar-gold/30 mb-3 text-bazar-gold group-hover:scale-110 transition-transform">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-mystic text-xs sm:text-sm font-bold tracking-wider text-bazar-parchment group-hover:text-bazar-gold transition-colors">
                  {item.name}
                </h3>
                <p className="text-[10px] text-bazar-parchment/60 mt-1 line-clamp-2 leading-tight">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* BLOCO 3 — MAIS VENDIDOS: OS ACHADOS DO BAZAR */}
      <section id="achados" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-bazar-charcoal-border">
          <div>
            <span className="text-xs font-bold tracking-widest text-bazar-gold uppercase block mb-1">
              Seleção dos Guardiões
            </span>
            <h2 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment uppercase">
              OS ACHADOS DO BAZAR
            </h2>
            <p className="text-xs text-bazar-parchment/70 mt-1 font-editorial text-sm">
              Os favoritos de quem já passou por aqui.
            </p>
          </div>
          <Link
            href="/cristais"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-bazar-gold hover:text-bazar-gold-light tracking-wider"
          >
            <span>VER TODO O CATÁLOGO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* BLOCO 4 — QUIZ: NÃO SABE POR ONDE COMEÇAR? */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-bazar-wine-deep via-bazar-charcoal-light to-bazar-purple p-8 sm:p-12 lg:p-14 border border-bazar-gold/50 shadow-mystic">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-bazar-gold/10 blur-2xl pointer-events-none" />
          
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-bazar-gold uppercase mb-3">
              <Sparkles className="w-4 h-4" /> Bússola Intuitiva
            </span>
            <h2 className="font-mystic text-2xl sm:text-4xl font-extrabold text-bazar-parchment mb-4 uppercase">
              NÃO SABE POR ONDE COMEÇAR?
            </h2>
            <p className="text-sm sm:text-base text-bazar-parchment/80 leading-relaxed mb-8">
              Você não precisa conhecer todos os cristais do mundo. A gente ajuda você a começar. Responda 6 perguntas simples e encontre o mineral que ressoa com o seu ritmo hoje.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-bazar-gold hover:bg-bazar-gold-light text-bazar-charcoal text-xs font-extrabold tracking-widest uppercase shadow-mystic-gold transition-all duration-300 group hover:scale-105"
            >
              <span>DESCOBRIR MEU CRISTAL</span>
              <Sparkles className="w-4 h-4 text-bazar-charcoal group-hover:rotate-45 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* BLOCO 5 — KITS: RITUAIS PRONTOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-bazar-charcoal-border">
          <div>
            <span className="text-xs font-bold tracking-widest text-bazar-gold uppercase block mb-1">
              Combinações Harmoniosas
            </span>
            <h2 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment uppercase">
              RITUAIS PRONTOS
            </h2>
            <p className="text-xs text-bazar-parchment/70 mt-1 font-editorial text-sm">
              Conjuntos completos com minerais, ervas e aromas prontos para o seu altar.
            </p>
          </div>
          <Link
            href="/kits"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-bazar-gold hover:text-bazar-gold-light tracking-wider"
          >
            <span>VER TODOS OS KITS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_KITS.map((kit) => (
            <ProductCard key={kit.id} product={kit} />
          ))}
        </div>
      </section>

      {/* BLOCO 6 — GRIMÓRIO: ARTIGOS RECENTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-bazar-charcoal-border">
          <div>
            <span className="text-xs font-bold tracking-widest text-bazar-gold uppercase block mb-1">
              Sabedoria e Curadoria
            </span>
            <h2 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment uppercase">
              O GRIMÓRIO
            </h2>
            <p className="text-xs text-bazar-parchment/70 mt-1 font-editorial text-sm">
              Guias sinceros, histórias botânicas e ensinamentos para o seu cotidiano místico.
            </p>
          </div>
          <Link
            href="/grimorio"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-bazar-gold hover:text-bazar-gold-light tracking-wider"
          >
            <span>LER O GRIMÓRIO COMPLETO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="group bg-bazar-charcoal-light/60 rounded-2xl border border-bazar-charcoal-border overflow-hidden hover:border-bazar-gold/50 transition-all duration-300 flex flex-col justify-between hover:shadow-mystic"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-bazar-charcoal">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-bazar-charcoal/90 text-bazar-gold border border-bazar-gold/30">
                    {article.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="text-[10px] text-bazar-parchment/50 mb-1">
                    {article.readTime}
                  </div>
                  <h3 className="font-mystic text-base font-bold text-bazar-parchment group-hover:text-bazar-gold transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-bazar-parchment/70 mt-2 line-clamp-3 leading-relaxed font-editorial text-sm">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/grimorio/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-bazar-gold group-hover:text-bazar-gold-light tracking-wider"
                >
                  <span>LER GUIA COMPLETO</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BLOCO 7 — PROVA SOCIAL: QUEM JÁ ENCONTROU O BAZAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-bazar-gold uppercase block mb-1">
            Experiências Reais
          </span>
          <h2 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment uppercase">
            QUEM JÁ ENCONTROU O BAZAR
          </h2>
          <p className="text-xs text-bazar-parchment/60 mt-1 max-w-md mx-auto font-editorial text-sm">
            Depoimentos espontâneos de quem recebeu nossos achados em casa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-bazar-charcoal-light/60 border border-bazar-charcoal-border hover:border-bazar-gold/30 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex text-bazar-gold mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-bazar-parchment/80 italic font-editorial text-sm leading-relaxed mb-4">
                &ldquo;A caixa do Kit Bruxo Iniciante chegou com um cheirinho de ervas e lavanda que perfumou a sala inteira. A ametista é muito mais bonita do que na foto, com uma energia de paz surreal.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-bazar-charcoal-border/50 flex items-center justify-between text-xs">
              <span className="font-bold text-bazar-parchment">Mariana S.</span>
              <span className="text-[10px] text-bazar-gold/70">Curitiba, PR</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-bazar-charcoal-light/60 border border-bazar-charcoal-border hover:border-bazar-gold/30 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex text-bazar-gold mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-bazar-parchment/80 italic font-editorial text-sm leading-relaxed mb-4">
                &ldquo;Fiz o quiz despretensiosamente e saiu a Turmalina Negra. Comprei e virou minha companheira de mesa no home office. O cuidado na embalagem e o bilhete feito à mão me conquistaram.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-bazar-charcoal-border/50 flex items-center justify-between text-xs">
              <span className="font-bold text-bazar-parchment">Rodrigo T.</span>
              <span className="text-[10px] text-bazar-gold/70">São Paulo, SP</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-bazar-charcoal-light/60 border border-bazar-charcoal-border hover:border-bazar-gold/30 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex text-bazar-gold mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-bazar-parchment/80 italic font-editorial text-sm leading-relaxed mb-4">
                &ldquo;Não sou de rituais complicados, mas a vela de canela e a selenita transformaram a hora de dormir da casa. É uma loja diferente de tudo, com alma verdadeira.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-bazar-charcoal-border/50 flex items-center justify-between text-xs">
              <span className="font-bold text-bazar-parchment">Larissa V.</span>
              <span className="text-[10px] text-bazar-gold/70">Belo Horizonte, MG</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
