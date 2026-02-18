import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

export const usersRouter = Router();

usersRouter.get('/me', authenticate, (req: AuthRequest, res) => {
  res.json({
    status: 'ok',
    user: { id: req.userId },
  });
});
