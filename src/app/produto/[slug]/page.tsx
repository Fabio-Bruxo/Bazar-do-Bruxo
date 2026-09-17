import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import { memoryStore } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: { slug: string };
}

function findProductBySlug(slug: string) {
  const fromMemory = Array.from(memoryStore.products.values()).find((p: any) => p.slug === slug);
  if (fromMemory) return fromMemory;
  return ALL_INITIAL_PRODUCTS.find((p) => p.slug === slug);
}

export async function generateStaticParams() {
  return ALL_INITIAL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = findProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Achado Não Encontrado | O Bazar do Bruxo',
    };
  }

  return {
    title: `${product.name} | O Bazar do Bruxo`,
    description: product.seoDescription || product.subtitle,
    openGraph: {
      title: `${product.name} | O Bazar do Bruxo`,
      description: product.seoDescription || product.subtitle,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = findProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Produtos relacionados e upsell
  const allProds = memoryStore.products.size > 0 
    ? Array.from(memoryStore.products.values()) 
    : ALL_INITIAL_PRODUCTS;

  const relatedProducts = allProds.filter((p: any) =>
    product.relatedProductIds?.includes(p.id)
  );

  const upsellProducts = allProds.filter((p: any) =>
    product.upsellProductIds?.includes(p.id)
  );

  // Schema.org JSON-LD para SEO avançado
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description.whatIs,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: product.promotionalPrice || product.price,
      availability: product.isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'O Bazar do Bruxo',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        upsellProducts={upsellProducts}
      />
    </>
  );
}
