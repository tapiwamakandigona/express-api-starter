import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const authRouter = Router();

// In-memory store (replace with a database in production)
const users = new Map<string, { id: string; email: string; password: string; name: string }>();

/**
 * Wraps an async route handler so rejected promises are forwarded to
 * Express error-handling middleware (Express 4 does not do this natively).
 */
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

authRouter.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    throw new AppError('Email, password, and name are required', 400);
  }
  
  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400);
  }
  
  if (users.has(email)) {
    throw new AppError('Email already registered', 409);
  }
  
  const hashedPassword = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();
  users.set(email, { id, email, password: hashedPassword, name });
  
  const token = generateToken(id);
  res.status(201).json({ status: 'ok', token, user: { id, email, name } });
}));

authRouter.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }
  
  const user = users.get(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials', 401);
  }
  
  const token = generateToken(user.id);
  res.json({ status: 'ok', token, user: { id: user.id, email: user.email, name: user.name } });
}));
