import { Request, Response, NextFunction } from "express";

interface CacheEntry {
  data: any;
  etag: string;
  expiresAt: number;
}

const store = new Map<string, CacheEntry>();

/**
 * In-memory response caching middleware.
 * Supports ETags and Cache-Control headers.
 *
 * @param ttlSeconds - Cache duration in seconds (default: 60)
 */
export function cache(ttlSeconds: number = 60) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();

    const key = req.originalUrl;
    const entry = store.get(key);

    if (entry && Date.now() < entry.expiresAt) {
      // Check ETag
      if (req.headers["if-none-match"] === entry.etag) {
        return res.status(304).end();
      }

      res.set("ETag", entry.etag);
      res.set("Cache-Control", `public, max-age=${ttlSeconds}`);
      res.set("X-Cache", "HIT");
      return res.json(entry.data);
    }

    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      const etag = `"${Buffer.from(JSON.stringify(body)).length.toString(36)}-${Date.now().toString(36)}"`;
      store.set(key, {
        data: body,
        etag,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
      res.set("ETag", etag);
      res.set("Cache-Control", `public, max-age=${ttlSeconds}`);
      res.set("X-Cache", "MISS");
      return originalJson(body);
    };

    next();
  };
}

/**
 * Clear the entire cache or a specific key.
 */
export function clearCache(key?: string) {
  if (key) {
    store.delete(key);
  } else {
    store.clear();
  }
}
