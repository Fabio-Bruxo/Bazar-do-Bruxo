'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Product, Intention } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';
import { getStoredProducts } from '@/data/db';

interface CatalogViewProps {
  title: string;
  subtitle: string;
  initialProducts: Product[];
  currentCategorySlug?: string;
  fixedIntention?: Intention;
}

export default function CatalogView({
  title,
  subtitle,
  initialProducts,
  currentCategorySlug,
  fixedIntention,
}: CatalogViewProps) {
  const [selectedIntention, setSelectedIntention] = useState<string>(fixedIntention || 'all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<number>(350);
  const [baseProducts, setBaseProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const updateProducts = () => {
      const stored = getStoredProducts();
      if (currentCategorySlug && currentCategorySlug !== 'all') {
        if (currentCategorySlug === 'ofertas') {
          setBaseProducts(stored.filter((p) => p.promotionalPrice && p.promotionalPrice < p.price));
        } else if (currentCategorySlug === 'presentes') {
          setBaseProducts(
            stored.filter(
              (p) => p.categorySlug === 'presentes' || p.category === 'Presentes' || p.name.includes('Pingente') || p.name.includes('Pulseira') || p.categorySlug === 'kits'
            )
          );
        } else {
          const matching = stored.filter(
            (p) => p.categorySlug === currentCategorySlug || p.category.toLowerCase() === currentCategorySlug.toLowerCase()
          );
          setBaseProducts(matching);
        }
      } else {
        setBaseProducts(stored);
      }
    };

    updateProducts();
    window.addEventListener('bazar_catalog_updated', updateProducts);
    return () => window.removeEventListener('bazar_catalog_updated', updateProducts);
  }, [currentCategorySlug]);

  const filteredProducts = useMemo(() => {
    let result = [...baseProducts];

    // Filtro por intenção
    if (selectedIntention !== 'all') {
      result = result.filter((p) => p.intentions.includes(selectedIntention as Intention));
    }

    // Filtro por tipo de produto (Próprio, Dropshipping, Afiliado)
    if (selectedType !== 'all') {
      result = result.filter((p) => p.type === selectedType);
    }

    // Filtro por preço
    result = result.filter((p) => (p.promotionalPrice || p.price) <= priceRange);

    // Ordenação
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.promotionalPrice || a.price) - (b.promotionalPrice || b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.promotionalPrice || b.price) - (a.promotionalPrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [initialProducts, selectedIntention, selectedType, sortBy, priceRange]);

  const intentionOptions = [
    { value: 'all', label: 'Todas as Intenções' },
    { value: 'calma', label: 'Calma & Serenidade' },
    { value: 'protecao', label: 'Proteção & Escudo' },
    { value: 'amor-proprio', label: 'Amor-Próprio' },
    { value: 'coragem', label: 'Coragem & Foco' },
    { value: 'natureza', label: 'Natureza & Cura' },
    { value: 'intuicao', label: 'Intuição Sutil' },
    { value: 'prosperidade', label: 'Prosperidade Solar' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header da Coleção */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-bazar-gold uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Acervo do Bazar
        </span>
        <h1 className="font-mystic text-3xl sm:text-4xl font-extrabold text-bazar-parchment uppercase">
          {title}
        </h1>
        <p className="font-editorial italic text-base sm:text-lg text-bazar-parchment/70 mt-2">
          {subtitle}
        </p>
      </div>

      {/* Barra de Filtros e Ordenação */}
      <div className="bg-bazar-charcoal-light/80 border border-bazar-charcoal-border rounded-2xl p-4 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Filtro por Intenção */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-bazar-gold uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Intenção:
            </span>
            <div className="flex gap-1.5 shrink-0">
              {intentionOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedIntention(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedIntention === opt.value
                      ? 'bg-bazar-wine text-bazar-parchment border border-bazar-gold/60 font-bold shadow-sm'
                      : 'bg-bazar-charcoal text-bazar-parchment/70 border border-bazar-charcoal-border hover:border-bazar-gold/30 hover:text-bazar-parchment'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ordenação e Filtro de Preço */}
          <div className="flex items-center gap-3 justify-end border-t lg:border-t-0 border-bazar-charcoal-border pt-3 lg:pt-0">
            <div className="flex items-center gap-1.5 text-xs text-bazar-parchment/70">
              <ArrowUpDown className="w-3.5 h-3.5 text-bazar-gold" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-2.5 py-1.5 text-xs text-bazar-parchment focus:outline-none focus:border-bazar-gold"
              >
                <option value="featured">Mais Relevantes</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="rating">Melhor Avaliados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Produtos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-bazar-charcoal-light/40 rounded-3xl border border-bazar-charcoal-border">
          <Sparkles className="w-10 h-10 text-bazar-gold/40 mx-auto mb-3" />
          <h3 className="font-mystic text-lg font-bold text-bazar-parchment">
            Nenhum achado com esses filtros
          </h3>
          <p className="text-xs text-bazar-parchment/60 mt-1 max-w-sm mx-auto">
            Experimente selecionar outra intenção ou ajustar o filtro para explorar outros mistérios do Bazar.
          </p>
          <button
            onClick={() => {
              setSelectedIntention('all');
              setSelectedType('all');
            }}
            className="mt-4 px-4 py-2 bg-bazar-charcoal border border-bazar-gold/40 text-bazar-gold hover:bg-bazar-wine text-xs font-bold rounded-xl transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
