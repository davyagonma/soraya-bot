import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { chatService } from '../services/ChatService';
import { logger } from '../utils/logger';
import { userRepository } from '../repositories/UserRepository';
import { whatsAppProvider } from '../providers/WhatsAppProvider';

export class WhatsAppController {
  verify = async (req: Request, res: Response): Promise<void> => {
    const mode = String(req.query['hub.mode'] ?? '');
    const token = String(req.query['hub.verify_token'] ?? '');
    const challenge = String(req.query['hub.challenge'] ?? '');

    const verified = whatsAppProvider.verifyWebhook(mode, token, challenge);
    if (verified) {
      res.status(200).send(verified);
      return;
    }

    res.status(403).json({ success: false, message: 'Verification failed' });
  };

  webhook = async (req: Request, res: Response): Promise<void> => {
    const message = whatsAppProvider.parseWebhook(req.body);
    if (!message) {
      res.json({ success: true, skipped: 'no text message' });
      return;
    }

    try {
      let user = await userRepository.findByWhatsAppId(message.from);

      if (!user) {
        user = await userRepository.create({
          email: `whatsapp_${message.from}@soraya.local`,
          password: await bcrypt.hash(message.from, 10),
          name: 'WhatsApp User',
          whatsappId: message.from,
        });
      }

      const result = await chatService.chat(user.id, message.text, undefined, 'whatsapp');
      const delivered = await whatsAppProvider.sendMessage(message.from, result.reply);

      logger.info('WhatsApp reply processed', {
        from: message.from,
        toolsUsed: result.toolsUsed,
        delivered,
      });

      res.json({
        success: true,
        reply: result.reply,
        conversationId: result.conversationId,
        toolsUsed: result.toolsUsed,
        deliveredToWhatsApp: delivered,
      });
    } catch (err) {
      logger.error('WhatsApp webhook error', { err });
      const delivered = await whatsAppProvider.sendMessage(
        message.from,
        'Désolé, une erreur est survenue. Réessayez dans quelques instants.',
      );

      res.status(200).json({ success: true, error: true, deliveredToWhatsApp: delivered });
    }
  };

  sendTestMessage = async (req: Request, res: Response): Promise<void> => {
    const to = String(req.body?.to ?? '').trim();
    const text = String(req.body?.text ?? '').trim();

    if (!to || !text) {
      res.status(400).json({ success: false, message: 'to and text are required' });
      return;
    }

    const delivered = await whatsAppProvider.sendMessage(to, text);
    res.json({ success: true, delivered, to, preview: text.slice(0, 80) });
  };
}

export const whatsAppController = new WhatsAppController();