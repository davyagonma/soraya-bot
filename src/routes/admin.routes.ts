import { Router } from 'express';
import { adminController } from '../controllers/AdminController';
import { authMiddleware, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/stats', authMiddleware, requireRole('ADMIN'), adminController.getStats);

export default router;
