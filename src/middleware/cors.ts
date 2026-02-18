import { Request, Response, NextFunction } from 'express';

interface CorsOptions {
  origins?: string[];
  methods?: string[];
  headers?: string[];
  credentials?: boolean;
  maxAge?: number;
}

/**
 * Custom CORS middleware with fine-grained control.
 */
export function customCors(options: CorsOptions = {}) {
  const {
    origins = ['*'],
    methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    headers = ['Content-Type', 'Authorization'],
    credentials = true,
    maxAge = 86400,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin || '';
    
    if (origins.includes('*') || origins.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origins.includes('*') ? '*' : origin);
    }
    
    res.set('Access-Control-Allow-Methods', methods.join(', '));
    res.set('Access-Control-Allow-Headers', headers.join(', '));
    res.set('Access-Control-Max-Age', String(maxAge));
    
    if (credentials) {
      res.set('Access-Control-Allow-Credentials', 'true');
    }
    
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    
    next();
  };
}
