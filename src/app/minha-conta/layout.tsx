'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  Home,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MinhaContaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=' + pathname);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <Sparkles className="w-8 h-8 text-bazar-gold animate-spin mx-auto" />
          <p className="text-xs text-bazar-parchment/70">Abrindo seu santuário...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { label: 'Visão Geral', href: '/minha-conta', icon: Home },
    { label: 'Minhas Compras', href: '/minha-conta/pedidos', icon: Package },
    { label: 'Meus Dados', href: '/minha-conta/dados', icon: User },
    { label: 'Endereço de Entrega', href: '/minha-conta/enderecos', icon: MapPin },
    { label: 'Meus Favoritos', href: '/favoritos', icon: Heart },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-bazar-parchment/60 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-bazar-gold">Início</Link>
        <span>/</span>
        <span className="text-bazar-gold font-semibold">Meu Santuário</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar do Cliente (4 colunas) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border p-6 shadow-mystic text-center relative overflow-hidden">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-bazar-gold shadow-mystic-gold mb-3 relative bg-bazar-charcoal">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mystic text-2xl text-bazar-gold">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-bazar-gold bg-bazar-wine/40 px-2.5 py-0.5 rounded-full border border-bazar-gold/30 mb-2">
              <Sparkles className="w-3 h-3" /> Membro do Círculo
            </span>

            <h2 className="font-mystic text-lg font-bold text-bazar-parchment">
              {user.name}
            </h2>
            <p className="text-xs text-bazar-parchment/60 truncate font-mono">
              {user.email}
            </p>

            {/* Menu Lateral de Navegação */}
            <div className="mt-6 pt-6 border-t border-bazar-charcoal-border space-y-1 text-left">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-bazar-wine text-bazar-parchment border border-bazar-gold/50 shadow-sm'
                        : 'text-bazar-parchment/70 hover:bg-bazar-charcoal hover:text-bazar-parchment'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-bazar-gold' : 'text-bazar-parchment/50'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors pt-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Encerrar Sessão</span>
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo da Tab (8 colunas) */}
        <div className="lg:col-span-8">
          {children}
        </div>

      </div>

    </div>
  );
}
