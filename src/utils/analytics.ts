// Disparador unificado de eventos de rastreio (Meta Pixel, Google Analytics 4, dataLayer)

export type AnalyticsEvent = 
  | 'page_view'
  | 'view_content'
  | 'search'
  | 'add_to_cart'
  | 'initiate_checkout'
  | 'purchase'
  | 'lead'
  | 'quiz_start'
  | 'quiz_complete'
  | 'affiliate_click'
  | 'upsell_view'
  | 'upsell_accept';

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Log para depuração de e-commerce e conferência de marketing
  console.log(`[Bazar Analytics] Event: "${event}"`, payload || {});

  // Google Analytics 4 / GTM dataLayer
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event,
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  // Meta Pixel (fbq)
  if ((window as any).fbq) {
    switch (event) {
      case 'page_view':
        (window as any).fbq('track', 'PageView');
        break;
      case 'view_content':
        (window as any).fbq('track', 'ViewContent', payload);
        break;
      case 'add_to_cart':
        (window as any).fbq('track', 'AddToCart', payload);
        break;
      case 'initiate_checkout':
        (window as any).fbq('track', 'InitiateCheckout', payload);
        break;
      case 'purchase':
        (window as any).fbq('track', 'Purchase', payload);
        break;
      case 'lead':
        (window as any).fbq('track', 'Lead', payload);
        break;
      default:
        (window as any).fbq('trackCustom', event, payload);
    }
  }
}
