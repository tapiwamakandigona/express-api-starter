import { Request, Response, NextFunction } from 'express';

const requests = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 100;

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  
  const entry = requests.get(key);
  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }
  
  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
    return res.status(429).json({ status: 'error', message: 'Too many requests' });
  }
  
  next();
}
