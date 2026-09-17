import { Product, Order, Lead, Article } from '@/types';
export type { Product };
import { INITIAL_PRODUCTS } from './products';
import { INITIAL_KITS } from './kits';
import { INITIAL_ARTICLES } from './grimorio';

// Produtos adicionais limpos
const ADDITIONAL_SPECIAL_PRODUCTS: Product[] = [];

// Catálogo limpo e zerado: nenhum produto pré-carregado ou ilusório. O administrador cadastra livremente.
export const ALL_INITIAL_PRODUCTS: Product[] = [];

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
  topBannerText?: string;
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
  topBannerText: 'Frete Grátis a partir de R$ 199 para todo o Brasil • Use o cupom PRIMEIRORITUAL para 10% OFF',
};

// Pedidos zerados: nenhuma venda ilusória pré-carregada
export const INITIAL_ORDERS: Order[] = [];

// Leads zerados
export const INITIAL_LEADS: Lead[] = [];

// Funções de gerenciamento dinâmico do catálogo em tempo real
export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    // Purga imediata e irrestrita de todos os dados fictícios locais (pedidos, leads, carrinho, contas mock)
    if (!localStorage.getItem('bazar_zeroed_v3_clean')) {
      localStorage.setItem('bazar_zeroed_v3_clean', 'true');
      localStorage.setItem('bazar_catalog_products', JSON.stringify([]));
      localStorage.setItem('bazar_orders', JSON.stringify([]));
      localStorage.setItem('bazar_leads', JSON.stringify([]));
      localStorage.setItem('bazar_cart_items', JSON.stringify([]));
      localStorage.removeItem('bazar_cart');
      localStorage.removeItem('bazar_coupon');
      localStorage.removeItem('bazar_registered_users');
      
      // Manter SOMENTE a conta de administrador se estiver logado
      const currentUser = localStorage.getItem('bazar_auth_user');
      if (currentUser) {
        try {
          const u = JSON.parse(currentUser);
          if (u.email !== 'fabinhojr6336@gmail.com') {
            localStorage.removeItem('bazar_auth_user');
          }
        } catch {
          localStorage.removeItem('bazar_auth_user');
        }
      }
      return [];
    }

    const saved = localStorage.getItem('bazar_catalog_products');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler produtos do localStorage:', e);
  }
  return [];
}

export function saveStoredProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('bazar_catalog_products', JSON.stringify(products));
    window.dispatchEvent(new Event('bazar_catalog_updated'));
  } catch (e) {
    console.error('Falha ao salvar produtos no localStorage (possível estouro de cota):', e);
  }
}

export function getStoreSettings(): StoreSettings {
  if (typeof window === 'undefined') {
    return INITIAL_SETTINGS;
  }
  try {
    const saved = localStorage.getItem('bazar_store_settings');
    if (saved) {
      return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {}
  return INITIAL_SETTINGS;
}

export function saveStoreSettings(settings: Partial<StoreSettings>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoreSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem('bazar_store_settings', JSON.stringify(updated));
    window.dispatchEvent(new Event('bazar_settings_updated'));
  } catch (e) {}
}

