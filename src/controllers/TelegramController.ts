import { Request, Response } from 'express';
import { chatService } from '../services/ChatService';
import { userRepository } from '../repositories/UserRepository';
import { telegramProvider } from '../providers/TelegramProvider';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';

export class TelegramController {
  webhook = async (req: Request, res: Response): Promise<void> => {
    const message = req.body?.message;
    if (!message?.text) {
      res.json({ ok: true, skipped: 'no text message' });
      return;
    }

    const chatId = message.chat.id;

    try {
      const telegramId = String(chatId);
      let user = await userRepository.findByTelegramId(telegramId);

      if (!user) {
        user = await userRepository.create({
          email: `telegram_${telegramId}@soraya.local`,
          password: await bcrypt.hash(telegramId, 10),
          name: message.from?.first_name ?? 'Telegram User',
          telegramId,
        });
      }

      if (!user) {
        res.json({ ok: true, skipped: 'user creation failed' });
        return;
      }

      if (telegramProvider.isConfigured()) {
        await telegramProvider.sendChatAction(chatId);
      }

      const result = await chatService.chat(user.id, message.text, undefined, 'telegram');
      const delivered = await telegramProvider.sendMessage(chatId, result.reply);

      logger.info('Telegram reply processed', {
        chatId: telegramId,
        toolsUsed: result.toolsUsed,
        delivered,
      });

      res.json({
        ok: true,
        reply: result.reply,
        conversationId: result.conversationId,
        toolsUsed: result.toolsUsed,
        deliveredToTelegram: delivered,
      });
    } catch (err) {
      logger.error('Telegram webhook error', { err });

      const delivered = await telegramProvider.sendMessage(
        chatId,
        'Désolé, une erreur est survenue. Réessayez dans quelques instants.',
      );

      // Telegram exige HTTP 200 — sinon il réessaie indéfiniment
      res.json({ ok: true, error: true, deliveredToTelegram: delivered });
    }
  };
}

export const telegramController = new TelegramController();

export class WhatsAppController {
  webhook = async (_req: Request, res: Response): Promise<void> => {
    res.status(501).json({ success: false, message: 'WhatsApp integration not yet enabled' });
  };
}

export const whatsAppController = new WhatsAppController();
