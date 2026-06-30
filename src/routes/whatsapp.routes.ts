import { Router } from 'express';
import { whatsappWebhook, whatsappStatus } from '../controllers/WhatsAppController';
const router = Router();

// Webhook public appelé par Evolution API — pas d'auth JWT (déjà sécurisé par l'apikey côté Evolution)
router.post('/webhook', whatsappWebhook);

// Diagnostic — protéger avec le middleware auth existant (ADMIN) si exposé publiquement
router.get('/status', whatsappStatus);

export default router;