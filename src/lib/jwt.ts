import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bazar_jwt_fallback_dev_secret_2026_MUST_CHANGE';
const JWT_EXPIRES_IN = '7d';

export interface BazarJWTPayload {
  sub: string;        // user id
  email: string;
  name: string;
  role: 'customer' | 'admin';
  avatar?: string;
  iat?: number;
  exp?: number;
}

export function signBazarJWT(payload: Omit<BazarJWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyBazarJWT(token: string): BazarJWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as BazarJWTPayload;
  } catch {
    return null;
  }
}
