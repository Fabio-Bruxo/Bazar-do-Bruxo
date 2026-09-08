import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileNav from '@/components/MobileNav';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Analytics } from '@vercel/analytics/next';


export const metadata: Metadata = {
  title: 'O Bazar do Bruxo | Tudo para o seu ritual.',
  description: 'Um antigo bazar mágico, reinventado para a vida moderna. Cristais autênticos, incensos artesanais, velas botânicas, ervas e kits rituais.',
  keywords: ['cristais', 'ametista', 'incenso', 'bruxaria natural', 'altares', 'selenita', 'quartzo rosa', 'rituais', 'bem-estar místico'],
  openGraph: {
    title: 'O Bazar do Bruxo | Tudo para o seu ritual.',
    description: 'Algumas coisas simplesmente encontram você. Cristais e rituais para transformar momentos comuns em pequenos encantos.',
    url: 'https://obazardobruxo.com.br',
    siteName: 'O Bazar do Bruxo',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen flex flex-col bg-bazar-charcoal text-bazar-parchment antialiased selection:bg-bazar-wine selection:text-bazar-gold">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <CartDrawer />
              <main className="flex-1">
                {children}
              </main>
              <WhatsAppButton />
              <MobileNav />
              <Footer />
              <Analytics />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
