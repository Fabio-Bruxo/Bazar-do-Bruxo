export type CommercialStatus = 'ativo' | 'inativo' | 'revisao' | 'restrito';
export type ProductType = 'proprio' | 'dropshipping' | 'afiliado';

export type Intention = 
  | 'calma' 
  | 'protecao' 
  | 'amor-proprio' 
  | 'coragem' 
  | 'natureza' 
  | 'intuicao'
  | 'prosperidade';

export interface UserAddress {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  avatar?: string;
  role?: 'customer' | 'admin';
  address: UserAddress;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string; // Frase de impacto
  price: number;
  promotionalPrice?: number;
  costPrice: number;
  minAllowedPrice: number;
  pixDiscountPercent: number; // Ex: 5%
  maxInstallments: number; // Ex: 6x sem juros
  images: string[];
  category: string;
  categorySlug: string;
  intentions: Intention[];
  stock: number;
  isAvailable: boolean;
  type: ProductType;
  commercialStatus: CommercialStatus;
  
  // Padrão de Copy
  description: {
    whatIs: string; // O QUE É?
    whyItCalledYou: string; // POR QUE ELE CHAMOU SUA ATENÇÃO?
    symbolism: string; // SOBRE O SIMBOLISMO (Conformidade estrita)
    howToUse: string; // COMO USAR (Seguro e prático)
  };
  
  // Detalhes Técnicos
  details: {
    origin: string;
    material: string;
    dimensions: string;
    weight: string;
    care: string;
    notes?: string;
  };

  // Logística & Fornecedor
  sku: string;
  supplier?: {
    name: string;
    leadTimeDays: number;
    shippingCost: number;
  };
  affiliateUrl?: string;
  partnerName?: string;

  // Recomendações
  relatedProductIds: string[];
  upsellProductIds: string[];
  crossSellProductIds: string[];
  
  // SEO
  seoTitle: string;
  seoDescription: string;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  code: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
    address: UserAddress;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: 'pix' | 'credit_card';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'recebido' | 'preparando' | 'despachado' | 'entregue';
  pixCode?: string;
  trackingCode?: string;
  appliedCoupon?: string;
  orderBumpAccepted?: boolean;
  postPurchaseUpsellAccepted?: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  preference: string;
  source: 'newsletter' | 'quiz' | 'checkout';
  quizResult?: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: {
    text: string;
    archetype: string;
    intention: Intention;
    description: string;
  }[];
}

export interface QuizResultArch {
  archetype: string;
  title: string;
  crystalName: string;
  crystalSlug: string;
  tagline: string;
  description: string;
  recommendationReason: string;
  suggestedProductSlug: string;
  secondaryProductSlug: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  categorySlug: string;
  coverImage: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
  };
  content: string[];
  faqs: { question: string; answer: string }[];
  relatedProductSlugs: string[];
  seoTitle: string;
  seoDescription: string;
}
