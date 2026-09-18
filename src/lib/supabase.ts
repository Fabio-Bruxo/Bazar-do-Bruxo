/**
 * src/lib/supabase.ts
 * Cliente Supabase centralizado para O Bazar do Bruxo.
 * Usa @supabase/server para rotas de back-end (API routes, Server Components).
 * NUNCA importe este arquivo em Client Components.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';
const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

if (!SUPABASE_URL || SUPABASE_URL.includes('<seu-projeto>')) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[Supabase] SUPABASE_URL não configurada em produção!');
  }
}

/**
 * Cliente público — usa a anon/publishable key.
 * Resposta às regras de Row Level Security (RLS) do Supabase.
 * Use para operações de leitura pública e auth do lado do cliente.
 */
export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Cliente admin — usa a secret/service_role key.
 * BYPASS de RLS. Use APENAS em API Routes do back-end.
 * NUNCA exponha no front-end.
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Verifica se o Supabase está configurado (útil para fallback dev)
 */
export function isSupabaseConfigured(): boolean {
  return (
    !!SUPABASE_URL &&
    !SUPABASE_URL.includes('<seu-projeto>') &&
    !!SUPABASE_SECRET_KEY &&
    !SUPABASE_SECRET_KEY.includes('COLE_AQUI')
  );
}
