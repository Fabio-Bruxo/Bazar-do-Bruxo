'use client';

import React, { useState } from 'react';
import { MapPin, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MeusEnderecosPage() {
  const { user, updateProfile } = useAuth();

  const [address, setAddress] = useState(
    user?.address || {
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    }
  );

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ address });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      <div className="pb-4 border-b border-bazar-charcoal-border">
        <h1 className="font-mystic text-xl sm:text-2xl font-bold text-bazar-parchment">
          Endereço Principal de Entrega
        </h1>
        <p className="text-xs text-bazar-parchment/60 mt-0.5">
          Este endereço será preenchido automaticamente ao fechar seus próximos rituais no checkout.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Endereço atualizado com sucesso!</span>
        </div>
      )}

      <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border p-6 sm:p-8 shadow-mystic">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-bazar-parchment/70 block mb-1 font-semibold">CEP</label>
              <input
                type="text"
                required
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none font-mono"
              />
            </div>

            <div className="col-span-2">
              <label className="text-bazar-parchment/70 block mb-1 font-semibold">Rua / Avenida</label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-bazar-parchment/70 block mb-1 font-semibold">Número</label>
              <input
                type="text"
                required
                value={address.number}
                onChange={(e) => setAddress({ ...address, number: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-bazar-parchment/70 block mb-1 font-semibold">Complemento</label>
              <input
                type="text"
                placeholder="Apt, bloco..."
                value={address.complement || ''}
                onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-bazar-parchment/70 block mb-1 font-semibold">Bairro</label>
              <input
                type="text"
                required
                value={address.neighborhood}
                onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="text-bazar-parchment/70 block mb-1 font-semibold">Cidade</label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-bazar-parchment/70 block mb-1 font-semibold">Estado (UF)</label>
              <input
                type="text"
                required
                maxLength={2}
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:border-bazar-gold focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-bazar-wine to-bazar-wine-light hover:brightness-110 text-bazar-parchment text-xs font-bold tracking-widest uppercase rounded-xl flex items-center gap-2 border border-bazar-gold/50 shadow-mystic transition-all"
            >
              <Save className="w-4 h-4 text-bazar-gold" />
              <span>SALVAR ENDEREÇO DE ENTREGA</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
