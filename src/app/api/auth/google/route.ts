import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'openid',
].join(' ');

export async function GET(req: NextRequest) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!googleClientId) {
    return NextResponse.redirect(new URL('/login?erro=config_google_ausente', req.url));
  }

  // Gera um state aleatório para proteção CSRF
  const state = crypto.randomBytes(32).toString('hex');

  const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  oauthUrl.searchParams.set('client_id', googleClientId);
  oauthUrl.searchParams.set('redirect_uri', redirectUri);
  oauthUrl.searchParams.set('response_type', 'code');
  oauthUrl.searchParams.set('scope', SCOPES);
  oauthUrl.searchParams.set('access_type', 'offline');
  oauthUrl.searchParams.set('prompt', 'select_account');
  oauthUrl.searchParams.set('state', state);

  // Verifica de onde o usuário veio (checkout, etc.)
  const returnTo = req.nextUrl.searchParams.get('returnTo') || '/minha-conta';

  const response = NextResponse.redirect(oauthUrl.toString());

  // Cookie CSRF state (httpOnly, SameSite=Lax, 10 minutos)
  response.cookies.set('bazar_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 min
    path: '/',
  });

  // Cookie para saber para onde redirecionar após login
  response.cookies.set('bazar_oauth_return', returnTo, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  });

  return response;
}
