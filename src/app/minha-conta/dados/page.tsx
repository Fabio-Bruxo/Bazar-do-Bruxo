'use client';

import React, { useState, useRef } from 'react';
import { User, Lock, CheckCircle2, Save, Camera, Trash2, Upload, ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MeusDadosPage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [document, setDocument] = useState(user?.document || '');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Avatar states
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida (JPG, PNG, WEBP, etc).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setAvatarPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleAvatarFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleAvatarFile(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      document,
      ...(avatarPreview !== undefined ? { avatar: avatarPreview || undefined } : {}),
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3500);
  };

  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="space-y-6">

      <div className="pb-4 border-b border-bazar-charcoal-border">
        <h1 className="font-mystic text-xl sm:text-2xl font-bold text-bazar-parchment">
          Meus Dados Pessoais
        </h1>
        <p className="text-xs text-bazar-parchment/60 mt-0.5">
          Atualize suas informações de contato, foto de perfil e segurança de acesso ao Bazar.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Dados atualizados com sucesso no seu santuário! ✨</span>
        </div>
      )}

      {/* Foto de Perfil */}
      <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border p-6 sm:p-8 shadow-mystic">
        <h2 className="font-mystic text-sm font-bold text-bazar-gold uppercase tracking-wider flex items-center gap-1.5 mb-5">
          <Camera className="w-4 h-4" /> Foto de Perfil
        </h2>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Preview */}
          <div className="relative shrink-0">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={name || 'Foto de perfil'}
                className="w-28 h-28 rounded-full object-cover border-4 border-bazar-gold shadow-mystic"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-bazar-wine to-bazar-purple border-4 border-bazar-gold/50 flex items-center justify-center shadow-mystic">
                <span className="font-mystic text-3xl font-bold text-bazar-gold">{initials}</span>
              </div>
            )}
            {/* Botão câmera sobreposto */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-bazar-gold text-bazar-black flex items-center justify-center hover:brightness-110 transition-all shadow-lg border-2 border-bazar-black"
              title="Trocar foto"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Drop Zone */}
          <div className="flex-1 w-full">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-bazar-gold bg-bazar-gold/10 scale-[1.01]'
                  : 'border-bazar-charcoal-border hover:border-bazar-gold/60 hover:bg-bazar-gold/5'
              }`}
            >
              <ImageIcon className="w-8 h-8 mx-auto text-bazar-parchment/30 mb-2" />
              <p className="text-xs text-bazar-parchment/60">
                <span className="text-bazar-gold font-semibold">Clique para escolher</span> ou arraste uma imagem aqui
              </p>
              <p className="text-[10px] text-bazar-parchment/40 mt-1">JPG, PNG, WEBP ou GIF — máximo 5MB</p>
            </div>

            {/* Ações */}
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-bazar-charcoal border border-bazar-charcoal-border text-bazar-parchment/80 hover:text-bazar-gold hover:border-bazar-gold/40 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" /> Selecionar Arquivo
              </button>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-red-950/50 border border-red-500/30 text-red-400 hover:bg-red-950 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remover Foto
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>

      {/* Dados Pessoais */}
      <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border p-6 sm:p-8 shadow-mystic">
        <form onSubmit={handleSave} className="space-y-6 text-xs">

          <h2 className="font-mystic text-sm font-bold text-bazar-gold uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4" /> Informações Pessoais
          </h2>

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
