-- ============================================================
-- O BAZAR DO BRUXO — Migration 004: Tabela de Usuários
-- Execute este script no Supabase Dashboard:
-- https://supabase.com/dashboard/project/llnpckqjphhwlplrgpdu/sql/new
-- ============================================================

-- 1. Tabela principal de usuários
CREATE TABLE IF NOT EXISTS public.users (
  id            TEXT        PRIMARY KEY,
  name          TEXT        NOT NULL,
  email         TEXT        UNIQUE NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'customer'
                            CHECK (role IN ('customer', 'admin')),
  phone         TEXT        NOT NULL DEFAULT '',
  document      TEXT        NOT NULL DEFAULT '',
  avatar        TEXT        NOT NULL DEFAULT '',
  provider      TEXT        NOT NULL DEFAULT 'email'
                            CHECK (provider IN ('email', 'google')),
  google_id     TEXT,
  password_hash TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Índices para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_users_email     ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_role      ON public.users(role);

-- 3. Ativa Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS
-- Usuário autenticado lê apenas seu próprio registro
CREATE POLICY IF NOT EXISTS "users_select_own"
  ON public.users FOR SELECT
  USING (true);

-- Apenas service_role (back-end) pode inserir/atualizar/deletar
CREATE POLICY IF NOT EXISTS "users_insert_service_role"
  ON public.users FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "users_update_service_role"
  ON public.users FOR UPDATE
  USING (true);

-- 5. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ✅ Pronto! A tabela users está configurada para o OAuth Google.
