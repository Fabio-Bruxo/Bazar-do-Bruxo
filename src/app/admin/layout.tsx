'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Lock, ArrowLeft, LogIn, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isMasterAdmin =
    user !== null &&
    user.role === 'admin' &&
    user.email.toLowerCase() === 'fabinhojr6336@gmail.com';

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  // Enquanto carrega a sessão local
  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-bazar-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mystic text-bazar-gold text-base tracking-widest">
          VERIFICANDO PRIVILÉGIOS ADMINISTRATIVOS...
        </p>
      </div>
    );
  }

  // Se não for o administrador exclusivo
  if (!isMasterAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-bazar-black">
        <div className="max-w-md w-full bg-bazar-charcoal border-2 border-red-500/40 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-950/50 border border-red-500/50 flex items-center justify-center text-red-400 shadow-inner">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center justify-center gap-1.5 bg-red-950/60 py-1 px-3 rounded-full border border-red-500/30 w-fit mx-auto">
              <ShieldAlert className="w-4 h-4" /> Acesso Estritamente Restrito
            </span>
            <h2 className="font-mystic text-2xl font-bold text-bazar-parchment">
              Área Restrita ao Administrador
            </h2>
            <p className="text-sm text-bazar-parchment/70 leading-relaxed">
              O Painel Administrativo de <strong>O Bazar do Bruxo</strong> é blindado. Apenas a conta de administrador mestre cadastrada (<span className="text-bazar-gold font-semibold">fabinhojr6336@gmail.com</span>) tem autorização para gerenciar estoque, produtos, vendas e configurações.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-bazar-gold text-bazar-black font-semibold hover:bg-bazar-gold-light transition-all shadow-md text-sm tracking-wider uppercase"
            >
              <LogIn className="w-4 h-4" /> Entrar com Conta Administradora
            </Link>
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-bazar-charcoal-light border border-bazar-charcoal-border text-bazar-parchment/80 hover:text-bazar-gold hover:border-bazar-gold/30 transition-all text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para a Loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Administrador autenticado com sucesso
  return (
    <div className="min-h-screen bg-bazar-black">
      {/* Barra de Segurança Administrativa Superior */}
      <div className="bg-gradient-to-r from-bazar-charcoal via-bazar-charcoal-light to-bazar-charcoal border-b border-bazar-gold/30 px-4 py-2 text-xs text-bazar-parchment/80 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-bazar-gold font-bold uppercase tracking-wider text-[11px]">Sessão de Administrador Ativa:</span>
            <span className="text-bazar-parchment font-medium hidden sm:inline">{user.email}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/admin/produtos"
              className="text-bazar-parchment/70 hover:text-bazar-gold transition-colors font-semibold"
            >
              Produtos & Estoque
            </Link>
            <Link
              href="/admin/pedidos"
              className="text-bazar-parchment/70 hover:text-bazar-gold transition-colors font-semibold"
            >
              Pedidos
            </Link>
            <Link
              href="/"
              className="text-bazar-gold hover:underline flex items-center gap-1"
              target="_blank"
            >
              Ver Loja ↗
            </Link>
          </div>
        </div>
      </div>

      <div className="pb-16">{children}</div>
    </div>
  );
}
