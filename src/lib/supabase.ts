/**
 * src/lib/supabase.ts
 * Cliente Supabase centralizado para O Bazar do Bruxo.
 * Usa @supabase/server para rotas de back-end (API routes, Server Components).
 * NUNCA importe este arquivo em Client Components.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://llnpckqjphhwlplrgpdu.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_NAtMS6AEwR0nqDyLZ1JXow_8-4MO-MC';
const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'sb_secret_JhnOJrzqPv5buBF_qb1x1Q_HTT-CRqJ';

/**
 * Cliente público — inicializado de forma segura sem quebrar o build do Next.js
 */
export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Cliente admin — inicializado de forma segura sem quebrar o build do Next.js
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Verifica se o Supabase está configurado com credenciais válidas reais
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return (
    !!url &&
    !url.includes('<seu-projeto>') &&
    !url.includes('placeholder') &&
    !!key &&
    !key.includes('COLE_AQUI') &&
    !key.includes('placeholder')
  );
}
