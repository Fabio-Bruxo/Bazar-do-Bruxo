'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck, 
  Moon,
  User as UserIcon,
  LogOut,
  Package,
  Sliders
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { ALL_INITIAL_PRODUCTS } from '@/data/db';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/currency';

export default function Header() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const results = ALL_INITIAL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.intentions.some((int) => int.includes(q))
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const navLinks = [
    { label: 'INÍCIO', href: '/' },
    { label: 'CRISTAIS', href: '/cristais' },
    { label: 'INCENSOS & AROMAS', href: '/incensos-aromas' },
    { label: 'ERVAS & NATUREZA', href: '/ervas-natureza' },
    { label: 'RITUAIS', href: '/rituais' },
    { label: 'BRUXARIA', href: '/bruxaria' },
    { label: 'ENERGIA', href: '/energia' },
    { label: 'CASA MÍSTICA', href: '/casa-mistica' },
    { label: 'PRESENTES', href: '/presentes' },
    { label: 'KITS', href: '/kits' },
    { label: 'OFERTAS', href: '/ofertas' },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-bazar-wine text-bazar-parchment text-xs font-medium py-1.5 px-4 text-center border-b border-bazar-wine-light flex items-center justify-center gap-2">
        <Moon className="w-3.5 h-3.5 text-bazar-gold" />
        <span>
          Frete Grátis a partir de R$ 199 para todo o Brasil • Use o cupom <span className="font-bold text-bazar-gold">PRIMEIRORITUAL</span> para 10% OFF
        </span>
      </div>

      {/* Header Principal */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-bazar-charcoal/95 backdrop-blur-md shadow-mystic border-b border-bazar-charcoal-border'
            : 'bg-bazar-charcoal border-b border-bazar-charcoal-border/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-bazar-parchment hover:text-bazar-gold transition-colors"
                aria-label="Abrir menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo Centralizada / Marca */}
            <div className="flex flex-col items-center justify-center flex-1 lg:flex-initial lg:items-start">
              <Link href="/" className="group text-center lg:text-left">
                <span className="font-mystic text-xl sm:text-2xl lg:text-2xl font-bold tracking-widest text-bazar-parchment group-hover:text-bazar-gold transition-colors block">
                  O BAZAR DO BRUXO
                </span>
                <span className="font-editorial italic text-xs tracking-wider text-bazar-gold/90 block -mt-0.5">
                  Tudo para o seu ritual.
                </span>
              </Link>
            </div>

            {/* Botão de Destaque Místico Desktop */}
            <div className="hidden lg:flex items-center">
              <Link
                href="/quiz"
                className="relative group overflow-hidden rounded-full bg-gradient-to-r from-bazar-wine to-bazar-purple px-5 py-2.5 text-xs font-semibold tracking-wider text-bazar-parchment border border-bazar-gold/40 shadow-sm hover:border-bazar-gold hover:shadow-mystic-gold transition-all duration-300 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-bazar-gold group-hover:rotate-12 transition-transform duration-300" />
                <span>DESCOBRIR MEU CRISTAL</span>
                <span className="absolute inset-0 bg-bazar-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* Ações Rápidas (Busca, Favoritos, Usuário, Grimório, Carrinho) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-bazar-parchment hover:text-bazar-gold transition-colors rounded-full hover:bg-bazar-charcoal-light"
                title="Buscar no Bazar"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/favoritos"
                className="hidden sm:flex relative p-2 text-bazar-parchment hover:text-bazar-gold transition-colors rounded-full hover:bg-bazar-charcoal-light"
                title="Meus Favoritos"
                aria-label="Favoritos"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-bazar-wine text-bazar-parchment text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-bazar-gold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Botão / Dropdown de Usuário */}
              <div className="relative">
                {isAuthenticated && user ? (
                  <div>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-full hover:bg-bazar-charcoal-light transition-colors border border-bazar-charcoal-border hover:border-bazar-gold/50"
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-bazar-gold" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-bazar-wine text-bazar-gold flex items-center justify-center text-xs font-bold font-mystic">
                          {user.name[0]}
                        </div>
                      )}
                      <span className="hidden md:inline text-xs font-semibold text-bazar-parchment pr-1">
                        {user.name.split(' ')[0]}
                      </span>
                    </button>

                    {/* Dropdown do Usuário */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-bazar-charcoal-light border border-bazar-gold/40 rounded-2xl p-2 shadow-mystic z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                        <div className="px-3 py-2 border-b border-bazar-charcoal-border">
                          <p className="font-bold text-bazar-parchment truncate">{user.name}</p>
                          <p className="text-[10px] text-bazar-parchment/60 truncate">{user.email}</p>
                        </div>
                        <div className="py-1 space-y-0.5">
                          <Link
                            href="/minha-conta"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-bazar-parchment/90 hover:bg-bazar-charcoal hover:text-bazar-gold transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-bazar-gold" />
                            <span>Meu Santuário (Perfil)</span>
                          </Link>
                          <Link
                            href="/minha-conta/pedidos"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-bazar-parchment/90 hover:bg-bazar-charcoal hover:text-bazar-gold transition-colors"
                          >
                            <Package className="w-4 h-4 text-bazar-gold" />
                            <span>Minhas Compras</span>
                          </Link>
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-bazar-parchment/90 hover:bg-bazar-charcoal hover:text-bazar-gold transition-colors"
                          >
                            <Sliders className="w-4 h-4 text-bazar-gold" />
                            <span>Painel Administrativo</span>
                          </Link>
                        </div>
                        <div className="pt-1 border-t border-bazar-charcoal-border">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Encerrar Sessão</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 p-2 rounded-full hover:bg-bazar-charcoal-light text-bazar-parchment/80 hover:text-bazar-gold transition-colors text-xs font-semibold"
                    title="Entrar na minha conta"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="hidden md:inline">Entrar</span>
                  </Link>
                )}
              </div>

              <Link
                href="/grimorio"
                className="hidden md:inline-flex text-xs font-semibold tracking-wider text-bazar-parchment/80 hover:text-bazar-gold px-2.5 py-2 rounded-lg hover:bg-bazar-charcoal-light transition-colors"
              >
                GRIMÓRIO
              </Link>

              {/* Botão do Carrinho */}
              <button
                onClick={openCart}
                className="relative p-2.5 bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold/60 text-bazar-parchment hover:text-bazar-gold transition-all duration-200 rounded-full flex items-center gap-1.5"
                aria-label="Abrir Carrinho"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="bg-bazar-gold text-bazar-charcoal text-[11px] font-extrabold rounded-full px-1.5 py-0.2 min-w-[18px] text-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navegação por Categorias Desktop */}
          <nav className="hidden lg:flex items-center justify-center gap-6 py-2.5 border-t border-bazar-charcoal-border/60 text-[11px] tracking-widest font-medium overflow-x-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 relative ${
                    isActive
                      ? 'text-bazar-gold font-bold'
                      : 'text-bazar-parchment/75 hover:text-bazar-parchment'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-bazar-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Modal de Busca Rápida */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
            <div className="bg-bazar-charcoal-light border border-bazar-gold/40 rounded-2xl max-w-xl w-full p-6 shadow-mystic">
              <div className="flex items-center justify-between border-b border-bazar-charcoal-border pb-3">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-5 h-5 text-bazar-gold" />
                  <input
                    type="text"
                    placeholder="Busque por cristal, intenção, aroma, vela..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="bg-transparent border-none text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none w-full text-base"
                  />
                </div>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-bazar-parchment/60 hover:text-bazar-parchment"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="mt-4 divide-y divide-bazar-charcoal-border">
                  {searchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/produto/${prod.slug}`}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-4 py-3 hover:bg-bazar-charcoal/50 rounded-lg px-2 transition-colors group"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-12 h-12 rounded object-cover border border-bazar-charcoal-border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-bazar-parchment group-hover:text-bazar-gold truncate">
                          {prod.name}
                        </p>
                        <p className="text-xs text-bazar-parchment/60 truncate">
                          {prod.subtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-bazar-gold">
                          {formatCurrency(prod.promotionalPrice || prod.price)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : searchQuery.trim().length > 1 ? (
                <p className="text-center text-sm text-bazar-parchment/60 py-6">
                  Nenhum achado encontrado para &quot;{searchQuery}&quot;.
                </p>
              ) : (
                <div className="mt-4 text-xs text-bazar-parchment/60">
                  <p className="font-semibold text-bazar-parchment/80 mb-2">Sugestões de busca:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Ametista', 'Proteção', 'Quartzo Rosa', 'Incenso Nag Champa', 'Kit Bruxo', 'Selenita'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="bg-bazar-charcoal px-3 py-1.5 rounded-full border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment/80 hover:text-bazar-gold transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Drawer Menu Lateral */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-bazar-charcoal border-r border-bazar-charcoal-border p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-bazar-charcoal-border">
                  <div>
                    <span className="font-mystic text-lg font-bold text-bazar-parchment block">
                      O BAZAR DO BRUXO
                    </span>
                    <span className="font-editorial italic text-xs text-bazar-gold">
                      Tudo para o seu ritual.
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-bazar-parchment"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Perfil no Menu Mobile */}
                <div className="mt-4 p-3 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border">
                  {isAuthenticated && user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-bazar-gold" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-bazar-wine text-bazar-gold flex items-center justify-center font-bold">
                            {user.name[0]}
                          </div>
                        )}
                        <div className="truncate">
                          <p className="text-xs font-bold text-bazar-parchment truncate">{user.name}</p>
                          <p className="text-[10px] text-bazar-parchment/60 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-bazar-charcoal-border text-xs">
                        <Link
                          href="/minha-conta"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-center py-1.5 rounded-lg bg-bazar-charcoal text-bazar-gold font-semibold"
                        >
                          Meu Perfil
                        </Link>
                        <Link
                          href="/minha-conta/pedidos"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-center py-1.5 rounded-lg bg-bazar-charcoal text-bazar-gold font-semibold"
                        >
                          Compras
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-2 px-3 rounded-xl bg-bazar-charcoal border border-bazar-gold/40 text-bazar-gold text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>ENTRAR NA MINHA CONTA</span>
                    </Link>
                  )}
                </div>

                {/* Botão do Quiz Mobile */}
                <div className="mt-3">
                  <Link
                    href="/quiz"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-bazar-wine to-bazar-purple text-bazar-parchment border border-bazar-gold/50 text-xs font-bold tracking-wider shadow-mystic"
                  >
                    <Sparkles className="w-4 h-4 text-bazar-gold" />
                    DESCOBRIR MEU CRISTAL
                  </Link>
                </div>

                {/* Links */}
                <div className="mt-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 px-3 rounded-lg text-xs text-bazar-parchment/90 hover:bg-bazar-charcoal-light hover:text-bazar-gold transition-colors"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-bazar-gold/50" />
                    </Link>
                  ))}
                  <Link
                    href="/grimorio"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-lg text-xs text-bazar-gold hover:bg-bazar-charcoal-light transition-colors font-semibold"
                  >
                    <span>O GRIMÓRIO (BLOG)</span>
                    <ChevronRight className="w-4 h-4 text-bazar-gold" />
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-lg text-xs text-bazar-parchment/50 hover:text-bazar-gold"
                  >
                    <span>Painel Administrativo</span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-bazar-charcoal-border text-xs text-bazar-parchment/60 space-y-2">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-bazar-gold" />
                  Compra segura e cristais autênticos
                </p>
                <p>© 2026 O Bazar do Bruxo.</p>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
