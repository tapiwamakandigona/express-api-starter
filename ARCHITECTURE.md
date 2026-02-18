# Architecture

## Overview

Express + TypeScript REST API with layered architecture.

## Layers

```
Routes -> Middleware -> Controllers -> Services -> Database
```

### Middleware
- `auth.ts` - JWT token verification
- `errorHandler.ts` - Centralized error handling with AppError class
- `rateLimiter.ts` - In-memory rate limiting (100 req/min)
- `requestLogger.ts` - Request/response logging with timing

### Routes
- `/api/health` - Health check endpoint
- `/api/auth/register` - User registration with bcrypt
- `/api/auth/login` - Login with JWT generation
- `/api/users/me` - Protected user endpoint

## Security
- Helmet for HTTP headers
- CORS configuration
- Password hashing with bcrypt (12 rounds)
- JWT with 7-day expiry
- Rate limiting per IP
