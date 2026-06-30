import { Router } from 'express';
import { chatController } from '../controllers/ChatController';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { chatRateLimiter } from '../middlewares/rateLimiter';
import { chatSchema, conversationIdSchema } from '../validators/schemas';

const router = Router();

router.get('/conversations', authMiddleware, chatController.listConversations);
router.get('/conversations/:id', authMiddleware, validate(conversationIdSchema, 'params'), chatController.getConversation);
router.post('/', authMiddleware, chatRateLimiter, validate(chatSchema), chatController.chat);

export default router;
