'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function RegistroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/minha-conta';

  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    password: '',
    confirmPassword: '',
    address: {
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  });

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

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      document: formData.document,
      password: formData.password,
      address: formData.address,
    });
    setIsSubmitting(false);

    if (res.success) {
      router.push(redirectUrl);
    } else {
      setErrorMsg(res.message || 'Erro ao realizar cadastro.');
    }
  };

  const handleCepLookup = (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, zipCode: cep },
    }));

    if (cleanCep.length === 8) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          street: prev.address.street || 'Rua das Alamedas Floridas',
          neighborhood: prev.address.neighborhood || 'Jardim Místico',
          city: prev.address.city || 'São Paulo',
          state: prev.address.state || 'SP',
        },
      }));
    }
  };

  return (
    <div className="max-w-2xl w-full space-y-8 bg-bazar-charcoal-light/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-bazar-gold/40 shadow-mystic">
      {/* Cabeçalho */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-bazar-gold uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Iniciação no Círculo
        </span>
        <h1 className="font-mystic text-2xl sm:text-3xl font-extrabold text-bazar-parchment uppercase">
          CRIE SUA CONTA NO BAZAR
        </h1>
        <p className="font-editorial italic text-sm text-bazar-parchment/70 max-w-md mx-auto">
          Guarde seus rituais, acompanhe o envio de cada achado e receba pequenas surpresas preparadas pelos nossos artesãos.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-950/70 border border-rose-500/50 rounded-xl text-rose-300 text-xs text-center font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Seção 1: Dados Pessoais */}
        <div className="space-y-3">
          <h2 className="font-mystic text-xs font-bold text-bazar-gold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-bazar-charcoal-border">
            <User className="w-3.5 h-3.5" /> 1. Dados Pessoais
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-bazar-parchment/70 block mb-1">Nome Completo</label>
              <input
                type="text"
                required
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-bazar-parchment/70 block mb-1">E-mail</label>
              <input
                type="email"
                required
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-bazar-parchment/70 block mb-1">WhatsApp / Telefone com DDD</label>
              <input
                type="text"
                required
                placeholder="(11) 99999-8888"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-bazar-parchment/70 block mb-1">CPF (para emissão de nota fiscal)</label>
              <input
                type="text"
                required
                placeholder="000.000.000-00"
                value={formData.document}
                onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Seção 2: Endereço */}
        <div className="space-y-3">
          <h2 className="font-mystic text-xs font-bold text-bazar-gold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-bazar-charcoal-border">
            <MapPin className="w-3.5 h-3.5" /> 2. Endereço do seu Santuário
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-bazar-parchment/70 block mb-1">CEP</label>
              <input
                type="text"
                required
                placeholder="00000-000"
                value={formData.address.zipCode}
                onChange={(e) => handleCepLookup(e.target.value)}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none font-mono"
              />
            </div>
            <div className="col-span-2">
              <label className="text-bazar-parchment/70 block mb-1">Rua / Avenida</label>
              <input
                type="text"
                required
                placeholder="Nome da sua rua"
                value={formData.address.street}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-bazar-parchment/70 block mb-1">Número</label>
              <input
                type="text"
                required
                placeholder="123"
                value={formData.address.number}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, number: e.target.value } })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-bazar-parchment/70 block mb-1">Complemento</label>
              <input
                type="text"
                placeholder="Apt, bloco..."
                value={formData.address.complement}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, complement: e.target.value } })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-bazar-parchment/70 block mb-1">Bairro</label>
              <input
                type="text"
                required
                placeholder="Bairro"
                value={formData.address.neighborhood}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, neighborhood: e.target.value } })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="text-bazar-parchment/70 block mb-1">Cidade</label>
              <input
                type="text"
                required
                placeholder="Cidade"
                value={formData.address.city}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-bazar-parchment/70 block mb-1">UF (Estado)</label>
              <input
                type="text"
                required
                placeholder="SP"
                maxLength={2}
                value={formData.address.state}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value.toUpperCase() } })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Seção 3: Senha */}
        <div className="space-y-3">
          <h2 className="font-mystic text-xs font-bold text-bazar-gold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-bazar-charcoal-border">
            <Lock className="w-3.5 h-3.5" /> 3. Chave de Acesso
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-bazar-parchment/70 block mb-1">Senha (mínimo 6 caracteres)</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-bazar-parchment/70 block mb-1">Confirmar Senha</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:border-bazar-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 border border-bazar-gold/50 shadow-mystic transition-all disabled:opacity-50"
        >
          <span>{isSubmitting ? 'CRIANDO SEU SANTUÁRIO...' : 'CRIAR MEU SANTUÁRIO PESSOAL'}</span>
          <ArrowRight className="w-4 h-4 text-bazar-gold" />
        </button>
      </form>

      <div className="pt-4 border-t border-bazar-charcoal-border text-center text-xs space-y-1">
        <p className="text-bazar-parchment/60">Já possui uma conta no Bazar?</p>
        <Link
          href={`/login${redirectUrl !== '/minha-conta' ? `?redirect=${redirectUrl}` : ''}`}
          className="font-bold text-bazar-gold hover:text-bazar-gold-light tracking-wider uppercase underline"
        >
          Entrar com meu e-mail existente →
        </Link>
      </div>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-parchment-glow flex items-center justify-center">
      <Suspense fallback={<div className="text-xs text-bazar-gold animate-pulse">Carregando formulário...</div>}>
        <RegistroForm />
      </Suspense>
    </div>
  );
}
