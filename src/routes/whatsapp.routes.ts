import { Router } from 'express';
import { z } from 'zod';
import { whatsAppController } from '../controllers/WhatsAppController';
import { validate } from '../middlewares/validate';

/**
 * WhatsApp routes — webhook + endpoint de test d'envoi.
 */
const router = Router();

const whatsappSendSchema = z.object({
	to: z.string().min(3),
	text: z.string().min(1).max(4000),
});

router.get('/webhook', whatsAppController.verify);
router.post('/webhook', whatsAppController.webhook);
router.post('/send', validate(whatsappSendSchema), whatsAppController.sendTestMessage);

export default router;