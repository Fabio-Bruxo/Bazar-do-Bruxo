import { NextRequest, NextResponse } from 'next/server';
import { signBazarJWT } from '@/lib/jwt';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { memoryStore } from '@/lib/db';

const ADMIN_EMAIL          = 'fabinhojr6336@gmail.com';

// Troca o code pelo token e busca o perfil do usuário no Google
async function exchangeCodeForProfile(code: string, redirectUri: string) {
  const googleClientId     = process.env.GOOGLE_CLIENT_ID || '';
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id:     googleClientId,
      client_secret: googleClientSecret,
      redirect_uri:  redirectUri,
      grant_type:    'authorization_code',
    }),
  });
  if (!tokenRes.ok) throw new Error('Falha na troca do código OAuth com o Google.');
  const tokens = await tokenRes.json();

  // Busca perfil com o access_token (nunca exposto ao browser)
  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!profileRes.ok) throw new Error('Falha ao buscar perfil do Google.');
  return await profileRes.json() as {
    id: string; email: string; name: string;
    picture: string; verified_email: boolean;
  };
}

// Busca ou cria o usuário no Supabase (ou memoryStore em dev)
async function upsertUser(profile: {
  id: string; email: string; name: string; picture: string; verified_email: boolean;
}) {
  const email = profile.email.toLowerCase();

  if (isSupabaseConfigured()) {
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, avatar')
      .eq('email', email)
      .single();

    if (existing) {
      return {
        id: existing.id as string,
        name: existing.name as string,
        email: existing.email as string,
        role: (existing.role || 'customer') as 'customer' | 'admin',
        avatar: existing.avatar as string,
      };
    }

    const newUser = {
      id:         `usr-google-${profile.id}`,
      name:       profile.name,
      email,
      role:       'customer',
      avatar:     profile.picture,
      phone:      '',
      document:   '',
      provider:   'google',
      google_id:  profile.id,
      created_at: new Date().toISOString(),
    };
    await supabaseAdmin.from('users').insert(newUser);
    return { id: newUser.id, name: newUser.name, email: newUser.email, role: 'customer' as const, avatar: newUser.avatar };
  }

  // Fallback: memoryStore (dev sem Supabase)
  const store = memoryStore as any;
  if (!store.googleUsers) store.googleUsers = new Map<string, object>();
  const existing = store.googleUsers.get(email);
  if (existing) return existing as { id: string; name: string; email: string; role: 'customer'; avatar: string };

  const newUser = { id: `usr-google-${profile.id}`, name: profile.name, email, role: 'customer' as const, avatar: profile.picture };
  store.googleUsers.set(email, newUser);
  return newUser;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code            = searchParams.get('code');
  const stateFromGoogle = searchParams.get('state');
  const errorParam      = searchParams.get('error');
  const APP_URL         = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  const redirectUri     = `${APP_URL}/api/auth/google/callback`;

  if (errorParam) return NextResponse.redirect(`${APP_URL}/login?erro=google_cancelado`);

  const stateCookie = req.cookies.get('bazar_oauth_state')?.value;
  if (!stateFromGoogle || !stateCookie || stateFromGoogle !== stateCookie)
    return NextResponse.redirect(`${APP_URL}/login?erro=state_invalido`);

  if (!code) return NextResponse.redirect(`${APP_URL}/login?erro=sem_codigo`);

  try {
    const profile = await exchangeCodeForProfile(code, redirectUri);

    // Admin não pode entrar via Google — usa senha exclusiva
    if (profile.email.toLowerCase() === ADMIN_EMAIL)
      return NextResponse.redirect(`${APP_URL}/login?erro=admin_nao_permitido_google`);

    if (!profile.verified_email)
      return NextResponse.redirect(`${APP_URL}/login?erro=email_nao_verificado`);

    const user = await upsertUser(profile);

    const bazarToken = signBazarJWT({
      sub:    user.id,
      email:  user.email,
      name:   user.name,
      role:   user.role,
      avatar: user.avatar,
    });

    const returnTo = req.cookies.get('bazar_oauth_return')?.value || '/minha-conta';
    const response = NextResponse.redirect(`${APP_URL}${returnTo}?login=google`);

    response.cookies.set('bazar_session', bazarToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7,
      path:     '/',
    });
    response.cookies.delete('bazar_oauth_state');
    response.cookies.delete('bazar_oauth_return');

    return response;
  } catch (err) {
    console.error('[OAuth Callback Error]', err);
    return NextResponse.redirect(`${APP_URL}/login?erro=falha_oauth`);
  }
}
