'use client';

import React, { useState } from 'react';
import { User, Lock, CheckCircle2, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MeusDadosPage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [document, setDocument] = useState(user?.document || '');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      document,
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      <div className="pb-4 border-b border-bazar-charcoal-border">
        <h1 className="font-mystic text-xl sm:text-2xl font-bold text-bazar-parchment">
          Meus Dados Pessoais
        </h1>
        <p className="text-xs text-bazar-parchment/60 mt-0.5">
          Atualize suas informações de contato e segurança de acesso ao Bazar.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Dados atualizados com sucesso no seu santuário!</span>
        </div>
      )}

      <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border p-6 sm:p-8 shadow-mystic">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-bazar-parchment/70 block mb-1 font-semibold">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-bazar-parchment/70 block mb-1 font-semibold">E-mail Cadastrado</label>
              <input
                type="email"
                disabled
                value={user?.email}
                className="w-full bg-bazar-charcoal/50 border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment/50 cursor-not-allowed"
              />
              <span className="text-[10px] text-bazar-parchment/40 mt-1 block">Para alterar seu e-mail, contate o suporte.</span>
            </div>

            <div>
              <label className="text-bazar-parchment/70 block mb-1 font-semibold">WhatsApp / Telefone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-bazar-parchment/70 block mb-1 font-semibold">CPF</label>
              <input
                type="text"
                required
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Alterar Senha */}
          <div className="pt-4 border-t border-bazar-charcoal-border space-y-3">
            <h3 className="font-mystic text-xs font-bold text-bazar-gold uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Segurança da Conta
            </h3>
            <div className="max-w-md">
              <label className="text-bazar-parchment/70 block mb-1 font-semibold">Nova Senha (opcional)</label>
              <input
                type="password"
                placeholder="Deixe em branco para manter a atual"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment text-xs font-bold tracking-widest uppercase rounded-xl flex items-center gap-2 border border-bazar-gold/50 shadow-mystic transition-all"
            >
              <Save className="w-4 h-4 text-bazar-gold" />
              <span>SALVAR ALTERAÇÕES</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
