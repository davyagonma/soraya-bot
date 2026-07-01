import { Request, Response } from 'express';
import { WhatsAppService } from '../services/Whatsapp.service';
import { WhatsAppProvider } from '../providers/whatsapp/WhatsAppProvider';
import { evolutionWebhookSchema } from '../validators/whatsapp.validator';
import {logger} from '../utils/logger'; // ⚠️ adapter le chemin selon votre logger Winston existant

/**
 * Webhook entrant Evolution API.
 * Evolution envoie tous les events de l'instance ici (messages, statuts, connexion...).
 * On répond 200 immédiatement pour éviter les retries d'Evolution,
 * puis on traite l'event de façon asynchrone.
 */
export async function whatsappWebhook(req: Request, res: Response): Promise<void> {
  const parsed = evolutionWebhookSchema.safeParse(req.body);

  if (!parsed.success) {
    logger.warn('[WhatsApp Controller] Payload webhook invalide', {
      errors: parsed.error.flatten(),
    });
    res.sendStatus(200); // Evolution attend un 200 même pour un event ignoré
    return;
  }

  res.sendStatus(200);

  try {
    await WhatsAppService.handleWebhookEvent(req.body);
  } catch (error) {
    logger.error('[WhatsApp Controller] Erreur traitement webhook', { error });
  }
}

/**   
 * Endpoint de diagnostic — état de connexion de l'instance WhatsApp.
 * Pratique pour vérifier rapidement si le QR code a été scanné.
 * À protéger avec le middleware d'auth existant (rôle ADMIN) si exposé publiquement.
 */
export async function whatsappStatus(_req: Request, res: Response): Promise<void> {
  try {
    const status = await WhatsAppProvider.getInstanceStatus();
    res.status(200).json(status);
  } catch (error) {
    res.status(502).json({ error: 'Impossible de joindre Evolution API' });
  }
}
