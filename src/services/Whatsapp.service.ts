import { WhatsAppProvider } from '../providers/whatsapp/WhatsAppProvider';
import { EvolutionWebhookEvent, IncomingWhatsAppMessage } from '../providers/whatsapp/Types';
import { ChatService } from './ChatService'; // ⚠️ adapter le chemin/nom exact à votre ChatService existant
import {logger} from '../utils/logger'; // ⚠️ adapter le chemin selon votre logger Winston existant

const HANDLED_EVENTS = new Set(['messages.upsert']);

export class WhatsAppService {
  /**
   * Point d'entrée appelé par le contrôleur webhook.
   * Filtre les events non pertinents, extrait le message,
   * délègue au ChatService/AIOrchestrator partagé avec Telegram/Web
   * (même flux que décrit dans le README : POST /api/chat → ChatService → AIOrchestrator),
   * puis renvoie la réponse via Evolution API.
   */
  async handleWebhookEvent(event: EvolutionWebhookEvent): Promise<void> {
    if (!HANDLED_EVENTS.has(event.event)) {
      return;
    }

    // Ignore les messages envoyés par le bot lui-même (écho)
    if (event.data?.key?.fromMe) {
      return;
    }

    const incoming = this.extractMessage(event);
    if (!incoming) {
      return; // message non textuel non géré pour l'instant (audio, image sans légende...)
    }

    logger.info('[WhatsAppService] Message reçu', {
      from: incoming.from,
      messageId: incoming.messageId,
    });

    await WhatsAppProvider.markAsRead(event.data.key.remoteJid, incoming.messageId);

    // ⚠️ Adapter cet appel à la signature réelle de votre ChatService.
    const reply = await ChatService.handleMessage({
      userId: incoming.from,
      channel: 'whatsapp',
      text: incoming.text,
    });

    await WhatsAppProvider.sendText(incoming.from, reply);
  }

  private extractMessage(event: EvolutionWebhookEvent): IncomingWhatsAppMessage | null {
    const data = event.data;
    const text =
      data.message?.conversation ??
      data.message?.extendedTextMessage?.text ??
      data.message?.imageMessage?.caption;

    if (!text) {
      return null;
    }

    const from = data.key.remoteJid?.split('@')[0];
    if (!from) {
      return null;
    }

    return {
      from,
      text,
      pushName: data.pushName,
      messageId: data.key.id,
      timestamp: data.messageTimestamp ?? Date.now(),
    };
  }
}

export const whatsAppService = new WhatsAppService();