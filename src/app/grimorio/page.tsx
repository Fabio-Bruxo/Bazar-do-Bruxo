import React from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { INITIAL_ARTICLES } from '@/data/grimorio';

export const metadata = {
  title: 'O Grimório: Guias & Sabedoria Mística | O Bazar do Bruxo',
  description: 'Artigos ancestrais, guias práticos sobre cristais, altares, incensos botânicos e rituais cotidianos.',
};

export default function GrimorioPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header do Grimório */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-bazar-gold uppercase mb-2">
          <BookOpen className="w-4 h-4 text-bazar-gold" /> Conhecimento & Curadoria
        </span>
        <h1 className="font-mystic text-3xl sm:text-5xl font-extrabold text-bazar-parchment uppercase">
          O GRIMÓRIO
        </h1>
        <p className="font-editorial italic text-base sm:text-lg text-bazar-parchment/70 mt-2">
          Páginas de sabedoria prática para transformar momentos comuns em pequenos rituais de presença e serenidade.
        </p>
      </div>

      {/* Grid de Artigos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {INITIAL_ARTICLES.map((article) => (
          <article
            key={article.id}
            className="group bg-bazar-charcoal-light/60 border border-bazar-charcoal-border rounded-3xl overflow-hidden hover:border-bazar-gold/50 transition-all duration-300 flex flex-col justify-between hover:shadow-mystic"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-bazar-charcoal">
                <Link href={`/grimorio/${article.slug}`}>
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-bazar-charcoal/90 text-bazar-gold border border-bazar-gold/30">
                  {article.category}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-bazar-parchment/50 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime}</span>
                  <span>•</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</span>
                </div>

                <Link href={`/grimorio/${article.slug}`}>
                  <h2 className="font-mystic text-lg font-bold text-bazar-parchment group-hover:text-bazar-gold transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                </Link>

                <p className="text-xs text-bazar-parchment/70 mt-2 line-clamp-3 leading-relaxed font-editorial text-sm">
                  {article.summary}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                href={`/grimorio/${article.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-bazar-gold hover:text-bazar-gold-light tracking-wider uppercase"
              >
                <span>LER ARTIGO COMPLETO</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
