import { NextRequest, NextResponse } from 'next/server';
import { verifyBazarJWT } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('bazar_session')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = verifyBazarJWT(token);

  if (!payload) {
    const res = NextResponse.json({ authenticated: false }, { status: 401 });
    res.cookies.delete('bazar_session');
    return res;
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id:     payload.sub,
      name:   payload.name,
      email:  payload.email,
      role:   payload.role,
      avatar: payload.avatar,
    },
  });
}
