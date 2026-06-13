import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 16) return secret;

  // Never fall back to a hardcoded, guessable secret. In production we refuse
  // to start; in dev we generate a random per-process secret (tokens won't
  // survive a restart, which is fine for local development).
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET env var is required (>= 16 chars) in production');
  }
  // eslint-disable-next-line no-console
  console.warn('[auth] JWT_SECRET not set — using a random ephemeral dev secret');
  return require('crypto').randomBytes(32).toString('hex');
}

const JWT_SECRET = resolveJwtSecret();

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Missing or invalid authorization header', 401);
  }
  
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}
