import { Product, Order, Lead, Article } from '@/types';
import { INITIAL_PRODUCTS } from './products';
import { INITIAL_KITS } from './kits';
import { INITIAL_ARTICLES } from './grimorio';

// Produtos adicionais para demonstrar expressamente Dropshipping e Afiliados no MVP
const ADDITIONAL_SPECIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-afiliado-01',
    slug: 'tarot-de-marelha-classico-grimorio-parceiro',
    name: 'Tarô de Marselha Tradicional de Luxo (Edição de Colecionador)',
    subtitle: 'O oráculo clássico em cartas douradas com livreto de interpretação',
    price: 189.00,
    costPrice: 0,
    minAllowedPrice: 189.00,
    pixDiscountPercent: 0,
    maxInstallments: 6,
    images: [
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop',
    ],
    category: 'Bruxaria',
    categorySlug: 'bruxaria',
    intentions: ['intuicao'],
    stock: 999,
    isAvailable: true,
    type: 'afiliado',
    commercialStatus: 'ativo',
    affiliateUrl: 'https://amzn.to/exemplo-bazar-bruxo-tarot',
    partnerName: 'Editora Arcanos & Livraria Parceira',
    description: {
      whatIs: 'Deck com as 78 lâminas do Tarô de Marselha tradicional, impresso em cartão 350g com acabamento fosco e bordas douradas reluzentes.',
      whyItCalledYou: 'Para quem busca uma ferramenta clássica de estudo oracular e autoconhecimento visual.',
      symbolism: 'Os 22 arcanos maiores e 56 menores representam os arquétipos perenes da jornada humana.',
      howToUse: 'Embaralhe com intenção calma e faça tiragens de três cartas para reflexão diária.',
    },
    details: {
      origin: 'Itália (Distribuição Brasil)',
      material: 'Cartão especial plastificado de alta durabilidade',
      dimensions: 'Cartas de 12cm x 7cm',
      weight: '350g',
      care: 'Guardar em bolsa de veludo ou estojo de madeira.',
      notes: 'PRODUTO DE PARCEIRO CERTIFICADO: A compra e envio são operados diretamente pela livraria parceira oficial do Bazar.',
    },
    sku: 'AFIL-TAR-021',
    relatedProductIds: ['prod-01', 'prod-19'],
    upsellProductIds: ['prod-19'],
    crossSellProductIds: ['prod-18'],
    seoTitle: 'Tarô de Marselha Clássico de Colecionador | O Bazar do Bruxo',
    seoDescription: 'Deck de luxo do Tarô de Marselha em parceria exclusiva. Compre com segurança na nossa loja parceira.',
    rating: 4.9,
    reviewCount: 65,
  },
  {
    id: 'prod-drop-02',
    slug: 'caldeirao-de-ferro-fundido-artesanal',
    name: 'Caldeirão Místico de Ferro Fundido 500ml',
    subtitle: 'Peça rústica pesada para queima segura de resinas e ervas secas',
    price: 145.00,
    costPrice: 58.00,
    minAllowedPrice: 110.00,
    pixDiscountPercent: 5,
    maxInstallments: 6,
    images: [
      'https://images.unsplash.com/photo-1567696911980-2eed69a46042?q=80&w=1000&auto=format&fit=crop',
    ],
    category: 'Bruxaria',
    categorySlug: 'bruxaria',
    intentions: ['protecao', 'calma'],
    stock: 15,
    isAvailable: true,
    type: 'dropshipping',
    commercialStatus: 'ativo',
    supplier: {
      name: 'Fundição Artesanal Mantiqueira (Dropshipping Nacional)',
      leadTimeDays: 7,
      shippingCost: 22.00,
    },
    description: {
      whatIs: 'Caldeirão tradicional fundido em ferro maciço com três apoios estáveis e alça de metal para queima segura de defumações aromáticas e ervas secas.',
      whyItCalledYou: 'Para ter uma base térmica ultra-segura e duradoura para o fogo sagrado das suas misturas de ervas aromáticas.',
      symbolism: 'Símbolo ancestral da fertilidade, transformação e abrigo dos mistérios alquímicos.',
      howToUse: 'Coloque uma camada de areia no fundo antes de acender carvão vegetal ou tochas de ervas.',
    },
    details: {
      origin: 'Minas Gerais - Brasil',
      material: '100% Ferro fundido maciço com cura atóxica',
      dimensions: '10cm de altura x 11cm de diâmetro (Capacidade 500ml)',
      weight: '1.4kg',
      care: 'Secar imediatamente após lavar para não oxidar.',
      notes: 'ENVIO DIRETO DA FUNDIÇÃO: Produzido e despachado sob demanda diretamente da forja artesanal com rastreio prioritário.',
    },
    sku: 'DROP-CAL-022',
    relatedProductIds: ['prod-16', 'prod-18'],
    upsellProductIds: ['prod-16'],
    crossSellProductIds: ['prod-18'],
    seoTitle: 'Caldeirão de Ferro Fundido Artesanal | O Bazar do Bruxo',
    seoDescription: 'Caldeirão de ferro fundido rústico com três pés para queima de ervas aromáticas e rituais.',
    rating: 5.0,
    reviewCount: 28,
  },
];

export const ALL_INITIAL_PRODUCTS: Product[] = [
  ...INITIAL_PRODUCTS,
  ...INITIAL_KITS,
  ...ADDITIONAL_SPECIAL_PRODUCTS,
];

// Dados de configuração de loja (Settings)
export interface StoreSettings {
  storeName: string;
  slogan: string;
  freeShippingThreshold: number; // Ex: R$ 199,00
  defaultPixDiscount: number; // 5%
  minStoreMargin: number; // 35%
  activeCoupons: { code: string; discountPercent: number; minSubtotal: number }[];
  whatsappNumber: string; // WhatsApp comercial
  supportEmail: string;
}

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'O Bazar do Bruxo',
  slogan: 'Tudo para o seu ritual.',
  freeShippingThreshold: 199.00,
  defaultPixDiscount: 5,
  minStoreMargin: 35,
  activeCoupons: [
    { code: 'PRIMEIRORITUAL', discountPercent: 10, minSubtotal: 80 },
    { code: 'BAZAR15', discountPercent: 15, minSubtotal: 180 },
    { code: 'CRISTALMAGICO', discountPercent: 10, minSubtotal: 50 },
  ],
  whatsappNumber: '5513998039867',
  supportEmail: 'contato@obazardobruxo.com.br',
};

// Pedidos simulados para o Admin Dashboard já iniciar com métricas reais
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    code: 'BZR-8921',
    customer: {
      name: 'Helena Ravena',
      email: 'helena.ravena@exemplo.com',
      phone: '(11) 98765-4321',
      document: '123.456.789-00',
      address: {
        zipCode: '01310-100',
        street: 'Avenida Paulista',
        number: '1500',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
      },
    },
    items: [
      {
        productId: 'prod-20',
        productName: 'Kit Bruxo Iniciante (Caixa de Madeira Pirografada)',
        price: 169.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop',
      },
      {
        productId: 'prod-15',
        productName: 'Incenso Tradicional Indiano Nag Champa Masala',
        price: 19.90,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=600&auto=format&fit=crop',
      },
    ],
    subtotal: 188.90,
    shipping: 0,
    discount: 18.89,
    total: 170.01,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    orderStatus: 'despachado',
    trackingCode: 'BR987654321XP',
    appliedCoupon: 'PRIMEIRORITUAL',
    orderBumpAccepted: true,
    postPurchaseUpsellAccepted: false,
    createdAt: '2026-09-07T18:32:00Z',
  },
  {
    id: 'ord-1002',
    code: 'BZR-8922',
    customer: {
      name: 'Gabriel Silveira',
      email: 'gabriel.silveira@exemplo.com',
      phone: '(21) 97654-3210',
      document: '987.654.321-99',
      address: {
        zipCode: '22041-001',
        street: 'Rua Barata Ribeiro',
        number: '200',
        complement: 'Apt 402',
        neighborhood: 'Copacabana',
        city: 'Rio de Janeiro',
        state: 'RJ',
      },
    },
    items: [
      {
        productId: 'prod-01',
        productName: 'Drusa de Ametista Natural',
        price: 79.90,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=600&auto=format&fit=crop',
      },
      {
        productId: 'prod-17',
        productName: 'Incensário Cascata Cerâmica Artesanal Noite Estrelada',
        price: 79.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=600&auto=format&fit=crop',
      },
    ],
    subtotal: 158.90,
    shipping: 19.90,
    discount: 0,
    total: 178.80,
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    orderStatus: 'preparando',
    orderBumpAccepted: false,
    postPurchaseUpsellAccepted: true,
    createdAt: '2026-09-08T10:15:00Z',
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-01',
    name: 'Carolina Mendes',
    email: 'carolina.mendes@exemplo.com',
    preference: 'Cristais',
    source: 'quiz',
    quizResult: 'ametista',
    createdAt: '2026-09-08T09:22:00Z',
  },
  {
    id: 'lead-02',
    name: 'Thiago Alencar',
    email: 'thiago.alencar@exemplo.com',
    preference: 'Rituais',
    source: 'newsletter',
    createdAt: '2026-09-08T11:45:00Z',
  },
  {
    id: 'lead-03',
    name: 'Beatriz Fontes',
    email: 'beatriz.fontes@exemplo.com',
    preference: 'Aromas',
    source: 'quiz',
    quizResult: 'selenita',
    createdAt: '2026-09-08T13:10:00Z',
  },
];
