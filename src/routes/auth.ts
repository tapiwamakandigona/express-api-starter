import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const authRouter = Router();

// In-memory store (replace with Prisma in production)
const users = new Map<string, { id: string; email: string; password: string; name: string }>();

authRouter.post('/register', async (req, res) => {
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
});

authRouter.post('/login', async (req, res) => {
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
});
