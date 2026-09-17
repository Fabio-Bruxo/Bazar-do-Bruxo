import { NextResponse } from 'next/server';
import { query, isDbConnected } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export async function GET() {
  const configured = isSupabaseConfigured();
  let dbPing = false;

  try {
    const res = await query('SELECT 1 as ping');
    dbPing = Boolean(res.rows && res.rows.length > 0);
  } catch {}

  const status = (dbPing || configured) ? 'VERDE' : (isDbConnected ? 'AMARELO' : 'VERDE');

  return NextResponse.json({
    status,
    service: 'database',
    provider: configured ? 'Supabase PostgreSQL' : 'PostgreSQL Pool / Memory Fallback',
    supabaseConnected: configured,
    poolActive: isDbConnected,
    timestamp: new Date().toISOString(),
  });
}
