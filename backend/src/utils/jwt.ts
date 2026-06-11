import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export interface JwtPayload {
  sub: string; // user id
  email: string;
}

const JWT_EXPIRES_IN = '30d';

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'mayieat-backend',
  });
}

export function verifyJwt(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET, {
    algorithms: ['HS256'],
    issuer: 'mayieat-backend',
  });
  if (typeof decoded === 'string' || !decoded.sub || !decoded.email) {
    throw new Error('Invalid token payload');
  }
  return { sub: String(decoded.sub), email: String(decoded.email) };
}
