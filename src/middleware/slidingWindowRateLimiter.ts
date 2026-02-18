import { Request, Response, NextFunction } from "express";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

/**
 * Sliding window rate limiter.
 * More accurate than fixed window - prevents burst attacks at window boundaries.
 */
export function slidingWindowRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, message = "Too many requests" } = config;
  const requests = new Map<string, number[]>();
  
  // Cleanup old entries every minute
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of requests) {
      const valid = timestamps.filter(t => now - t < windowMs);
      if (valid.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, valid);
      }
    }
  }, 60000);
  
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    
    const timestamps = requests.get(key) || [];
    const valid = timestamps.filter(t => now - t < windowMs);
    
    if (valid.length >= maxRequests) {
      const oldestValid = valid[0];
      const retryAfter = Math.ceil((oldestValid + windowMs - now) / 1000);
      
      res.set("Retry-After", String(retryAfter));
      res.set("X-RateLimit-Limit", String(maxRequests));
      res.set("X-RateLimit-Remaining", "0");
      res.set("X-RateLimit-Reset", String(Math.ceil((oldestValid + windowMs) / 1000)));
      
      return res.status(429).json({
        status: "error",
        message,
        retryAfter,
      });
    }
    
    valid.push(now);
    requests.set(key, valid);
    
    res.set("X-RateLimit-Limit", String(maxRequests));
    res.set("X-RateLimit-Remaining", String(maxRequests - valid.length));
    
    next();
  };
}
