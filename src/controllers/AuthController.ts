import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { authService } from '../services/AuthService';

export class AuthController {
  register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.register(req.body.email, req.body.password, req.body.name);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  refresh = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.refresh(req.body.refreshToken);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();
