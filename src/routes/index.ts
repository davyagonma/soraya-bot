import { Router } from 'express';
import authRoutes from './auth.routes';
import chatRoutes from './chat.routes';
import businessRoutes from './business.routes';
import telegramRoutes from './telegram.routes';
import whatsappRoutes from './whatsapp.routes';
import adminRoutes from './admin.routes';
import devRoutes from './dev.routes';
import { devRoutesEnabled } from '../controllers/DevController';

const router = Router();

if (devRoutesEnabled()) {
  router.use('/dev', devRoutes);
}

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/', businessRoutes);
router.use('/telegram', telegramRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/admin', adminRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', (_req, res) => {
  res.json({ success: true, service: 'SORAYA API', status: 'healthy', timestamp: new Date().toISOString() });
});

export default router;
