'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Lock, Mail, ArrowRight, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/minha-conta';

  const { login, loginDemo, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (res.role === 'admin') {
        router.push('/admin');
      } else {
        router.push(redirectUrl);
      }
    } else {
      setErrorMsg(res.message || 'Falha ao autenticar.');
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    router.push(redirectUrl);
  };

  const handleAdminDemoLogin = async () => {
    const res = await login('admin@obazardobruxo.com.br', 'admin123');
    if (res.success) {
      router.push('/admin');
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-bazar-charcoal-light/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-bazar-gold/40 shadow-mystic">
      {/* Cabeçalho */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-bazar-gold uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Portal do Viajante
        </span>
        <h1 className="font-mystic text-2xl sm:text-3xl font-extrabold text-bazar-parchment uppercase">
          ENTRAR NO BAZAR
        </h1>
        <p className="font-editorial italic text-sm text-bazar-parchment/70 leading-relaxed">
          &ldquo;Que bom que seus passos trouxeram você de volta ao seu santuário.&rdquo;
        </p>
      </div>

      {/* Botão de Demonstração com 1 Clique */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-bazar-wine/60 to-bazar-purple/60 border border-bazar-gold/50 text-center space-y-2.5">
        <span className="text-[11px] font-bold text-bazar-gold uppercase tracking-wider block">
          Acesso Rápido para Avaliação
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="py-2.5 px-3 rounded-xl bg-bazar-gold hover:bg-bazar-gold-light text-bazar-charcoal font-bold text-[11px] tracking-wider flex items-center justify-center gap-1.5 shadow-mystic-gold transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            <span>HELENA (CLIENTE)</span>
          </button>
          <button
            type="button"
            onClick={handleAdminDemoLogin}
            className="py-2.5 px-3 rounded-xl bg-[#1e1428] hover:bg-[#2b1c3b] border border-bazar-gold/60 text-bazar-gold hover:text-white font-bold text-[11px] tracking-wider flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>ADMIN (REGENTE)</span>
          </button>
        </div>
        <p className="text-[10px] text-bazar-parchment/60">
          Entrada instantânea como cliente ou administrador com todos os acessos liberados.
        </p>
      </div>

      {/* Separador */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-bazar-charcoal-border"></div>
        <span className="flex-shrink mx-4 text-xs text-bazar-parchment/40 uppercase tracking-widest font-mono">
          ou acesse com seu e-mail
        </span>
        <div className="flex-grow border-t border-bazar-charcoal-border"></div>
      </div>

      {/* Formulário de Login */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="text-bazar-parchment/70 block mb-1 font-semibold">Seu E-mail</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-bazar-gold absolute left-3 top-3" />
            <input
              type="email"
              required
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl pl-9 pr-3 py-2.5 text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none focus:border-bazar-gold"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-bazar-parchment/70 font-semibold">Sua Senha</label>
            <button
              type="button"
              onClick={() => alert('Em ambiente de teste, use a conta demo de 1 clique ou cadastre uma nova conta.')}
              className="text-[10px] text-bazar-gold/70 hover:text-bazar-gold underline"
            >
              Esqueceu a senha?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-bazar-gold absolute left-3 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl pl-9 pr-10 py-2.5 text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none focus:border-bazar-gold"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-bazar-parchment/40 hover:text-bazar-parchment"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 border border-bazar-gold/50 shadow-mystic transition-all hover:scale-[1.01] disabled:opacity-50"
        >
          <span>ENTRAR NO SANTUÁRIO</span>
          <ArrowRight className="w-4 h-4 text-bazar-gold" />
        </button>
      </form>

      {/* Rodapé do Card */}
      <div className="pt-4 border-t border-bazar-charcoal-border text-center text-xs space-y-2">
        <p className="text-bazar-parchment/60">
          Ainda não faz parte do Círculo do Bazar?
        </p>
        <Link
          href={`/registro${redirectUrl !== '/minha-conta' ? `?redirect=${redirectUrl}` : ''}`}
          className="inline-block font-bold text-bazar-gold hover:text-bazar-gold-light tracking-wider uppercase underline"
        >
          Criar Minha Conta Gratuita →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-parchment-glow">
      <Suspense fallback={<div className="text-xs text-bazar-gold animate-pulse">Carregando portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
