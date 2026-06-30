import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { chatService } from '../services/ChatService';

export class ChatController {
  listConversations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await chatService.listConversations(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getConversation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await chatService.getConversation(req.user!.userId, req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  chat = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await chatService.chat(
        req.user!.userId,
        req.body.message,
        req.body.conversationId,
        req.body.channel,
      );
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}

export const chatController = new ChatController();
