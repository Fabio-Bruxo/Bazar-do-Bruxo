-- O BAZAR DO BRUXO — Tabela de Usuários (cole TUDO no SQL Editor)
-- https://supabase.com/dashboard/project/llnpckqjphhwlplrgpdu/sql/new

CREATE TABLE IF NOT EXISTS public.users (
  id            TEXT        PRIMARY KEY,
  name          TEXT        NOT NULL,
  email         TEXT        UNIQUE NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  phone         TEXT        NOT NULL DEFAULT '',
  document      TEXT        NOT NULL DEFAULT '',
  avatar        TEXT        NOT NULL DEFAULT '',
  provider      TEXT        NOT NULL DEFAULT 'email' CHECK (provider IN ('email', 'google')),
  google_id     TEXT,
  password_hash TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email     ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_role      ON public.users(role);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own"        ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_service"    ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update_service"    ON public.users FOR UPDATE USING (true);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON public.users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
