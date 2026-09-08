import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, BookOpen, ArrowLeft, HelpCircle, Sparkles } from 'lucide-react';
import { INITIAL_ARTICLES } from '@/data/grimorio';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import ProductCard from '@/components/ProductCard';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return INITIAL_ARTICLES.map((art) => ({
    slug: art.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = INITIAL_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) return { title: 'Artigo Não Encontrado | O Grimório' };

  return {
    title: `${article.title} | O Grimório`,
    description: article.seoDescription || article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [{ url: article.coverImage, width: 1200, height: 630 }],
    },
  };
}

export default function ArticlePage({ params }: Props) {
  const article = INITIAL_ARTICLES.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  // Produtos mencionados no artigo
  const relatedProducts = ALL_INITIAL_PRODUCTS.filter((p) =>
    article.relatedProductSlugs.includes(p.slug)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Botão de Retorno */}
      <Link
        href="/grimorio"
        className="inline-flex items-center gap-2 text-xs font-semibold text-bazar-gold hover:text-bazar-gold-light mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao Grimório</span>
      </Link>

      {/* Header do Post */}
      <header className="space-y-4 mb-8">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-bazar-wine/60 text-bazar-gold border border-bazar-gold/30">
          {article.category}
        </span>
        <h1 className="font-mystic text-2xl sm:text-4xl font-extrabold text-bazar-parchment leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-bazar-parchment/60 pt-2 border-t border-bazar-charcoal-border">
          <span>Por <strong>{article.author.name}</strong> ({article.author.role})</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
          <span>•</span>
          <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</span>
        </div>
      </header>

      {/* Imagem de Capa */}
      <div className="rounded-3xl overflow-hidden border border-bazar-charcoal-border shadow-mystic mb-10 aspect-[16/9] bg-bazar-charcoal">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Corpo do Artigo */}
      <div className="prose prose-invert max-w-none space-y-6 text-sm sm:text-base text-bazar-parchment/85 leading-relaxed font-editorial">
        {article.content.map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h2 key={idx} className="font-mystic text-xl sm:text-2xl font-bold text-bazar-gold pt-4">
                {paragraph.replace('### ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('- ')) {
            return (
              <li key={idx} className="ml-4 list-disc text-bazar-parchment/80">
                {paragraph.replace('- ', '')}
              </li>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* FAQs do Artigo */}
      {article.faqs && article.faqs.length > 0 && (
        <section className="mt-12 p-6 sm:p-8 rounded-3xl bg-bazar-charcoal-light border border-bazar-charcoal-border space-y-4">
          <h3 className="font-mystic text-lg font-bold text-bazar-gold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-bazar-gold" />
            Perguntas Frequentes sobre este Ritual
          </h3>
          <div className="space-y-4 pt-2">
            {article.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-bazar-charcoal rounded-xl border border-bazar-charcoal-border">
                <p className="text-xs sm:text-sm font-bold text-bazar-parchment mb-1.5">
                  {faq.question}
                </p>
                <p className="text-xs text-bazar-parchment/70 leading-relaxed font-editorial text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PRODUTOS MENCIONADOS NESTE GUIA (Conversão Direta) */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-bazar-charcoal-border">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-bazar-gold uppercase block mb-1">
              Coloque em Prática
            </span>
            <h3 className="font-mystic text-2xl font-bold text-bazar-parchment uppercase">
              ACHADOS MENCIONADOS NESTE ARTIGO
            </h3>
            <p className="text-xs text-bazar-parchment/60 mt-1 font-editorial text-sm">
              Os mesmos instrumentos e cristais recomendados no texto para o seu ritual.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
