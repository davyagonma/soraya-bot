import axios, { AxiosInstance } from 'axios';
import {logger} from '../../utils/logger'; // ⚠️ adapter le chemin selon votre logger Winston existant
import {
  SendTextPayload,
  SendTextResponse,
  InstanceStatus,
} from './Types';

/**
 * Provider Evolution API — encapsule tous les appels HTTP vers
 * l'instance Evolution API (WhatsApp multi-device basé sur Baileys).
 *
 * Suit le même pattern que les autres providers du projet
 * (OpenAIProvider, CoinGeckoProvider, NewsProvider...).
 */
export class WhatsAppProvider {
  private readonly client: AxiosInstance;
  private readonly instanceName: string;

  constructor() {
    const baseURL = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    this.instanceName = process.env.EVOLUTION_INSTANCE_NAME ?? 'soraya';

    if (!baseURL || !apiKey) {
      logger.warn(
        '[WhatsAppProvider] EVOLUTION_API_URL ou EVOLUTION_API_KEY absent — provider en mode dégradé'
      );
    }

    this.client = axios.create({
      baseURL,
      timeout: 10_000,
      headers: { apikey: apiKey ?? '' },
    });
  }

  /**
   * Envoie un message texte à un numéro WhatsApp.
   * @param to Numéro au format international sans le "+" (ex: 22790000000)
   * @param text Contenu du message
   */
  async sendText(to: string, text: string): Promise<SendTextResponse> {
    try {
      const payload: SendTextPayload = { number: to, text };
      const { data } = await this.client.post<SendTextResponse>(
        `/message/sendText/${this.instanceName}`,
        payload
      );
      return data;
    } catch (error) {
      logger.error('[WhatsAppProvider] Échec envoi message', {
        to,
        error: this.extractError(error),
      });
      throw new Error("Impossible d'envoyer le message WhatsApp");
    }
  }

  /**
   * Vérifie l'état de connexion de l'instance (open / close / connecting).
   * Utile pour confirmer que le QR code a bien été scanné.
   */
  async getInstanceStatus(): Promise<InstanceStatus> {
    try {
      const { data } = await this.client.get<InstanceStatus>(
        `/instance/connectionState/${this.instanceName}`
      );
      return data;
    } catch (error) {
      logger.error('[WhatsAppProvider] Échec récupération statut instance', {
        error: this.extractError(error),
      });
      throw new Error("Impossible de récupérer le statut de l'instance WhatsApp");
    }
  }

  /**
   * Marque un message comme lu (double coche bleue côté utilisateur).
   * Non bloquant : un échec ici ne doit jamais interrompre le flux de réponse.
   */
  async markAsRead(remoteJid: string, messageId: string): Promise<void> {
    try {
      await this.client.put(`/chat/markMessageAsRead/${this.instanceName}`, {
        readMessages: [{ remoteJid, id: messageId, fromMe: false }],
      });
    } catch (error) {
      logger.warn('[WhatsAppProvider] Échec marquage lu', {
        error: this.extractError(error),
      });
    }
  }

  private extractError(error: unknown): unknown {
    if (axios.isAxiosError(error)) {
      return error.response?.data ?? error.message;
    }
    return error;
  }
}

export const whatsAppProvider = new WhatsAppProvider();