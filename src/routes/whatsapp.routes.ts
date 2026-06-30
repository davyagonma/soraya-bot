import { Router } from 'express';
// import { whatsAppController } from '../controllers/TelegramController';

/**
 * WhatsApp routes — architecture prepared, NOT activated.
 * To enable:
 * 1. Set WHATSAPP_TOKEN in .env
 * 2. Implement WhatsAppProvider in providers/
 * 3. Uncomment routes below
 */
const router = Router();

// router.post('/webhook', whatsAppController.webhook);
// router.get('/webhook', whatsAppController.verify);

export default router;
