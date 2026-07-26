# Architecture

## Overview

Express + TypeScript REST API with layered architecture and in-memory data storage.

## Layers

```
Client → Express Router → Middleware Stack → Route Handlers → Data Store
```

### Middleware

| File | Purpose |
|------|---------|
| `auth.ts` | JWT token verification and generation |
| `cache.ts` | In-memory response caching with ETag support |
| `cors.ts` | Custom CORS middleware (alternative to `cors` package) |
| `errorHandler.ts` | Centralized error handling with `AppError` class |
| `paginate.ts` | Pagination query parsing and response helpers |
| `rateLimiter.ts` | Fixed-window rate limiting (100 req/min per IP) |
| `requestLogger.ts` | Request/response logging with timing |
| `slidingWindowRateLimiter.ts` | Sliding-window rate limiter (more accurate) |
| `validate.ts` | Request body validation (type, length, format checks) |

### Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/health` | GET | Health check with uptime and version |
| `/api/auth/register` | POST | User registration with bcrypt password hashing |
| `/api/auth/login` | POST | Login with JWT token generation |
| `/api/users/me` | GET | Protected endpoint returning current user |

### Utilities

- `retry.ts` — Retry with exponential backoff and circuit breaker pattern
- `websocket.ts` — WebSocket server with rooms, broadcast, and direct messaging

## Security

- **Helmet** for HTTP security headers
- **CORS** configuration (package + custom middleware option)
- **Password hashing** with bcrypt (12 rounds)
- **JWT** with 7-day expiry
- **Rate limiting** per IP address (fixed-window and sliding-window options)

## Data Storage

The starter uses **in-memory `Map` storage** by default. For production, replace with your preferred database and ORM (e.g., Prisma, TypeORM, Mongoose).
