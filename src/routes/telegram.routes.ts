import { Router } from 'express';
import { telegramController } from '../controllers/TelegramController';
import { validate } from '../middlewares/validate';
import { telegramWebhookSchema } from '../validators/schemas';

const router = Router();

router.post('/webhook', validate(telegramWebhookSchema), telegramController.webhook);

export default router;
