import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

const WHATSAPP_API_VERSION = 'v21.0';
const WHATSAPP_API_BASE = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;
const MAX_MESSAGE_LENGTH = 4096;

export interface WhatsAppMessage {
  from: string;
  text: string;
  messageId: string;
}

export interface WhatsAppProvider {
  isConfigured(): boolean;
  sendMessage(to: string, text: string): Promise<boolean>;
  parseWebhook(body: unknown): WhatsAppMessage | null;
  verifyWebhook(mode: string, token: string, challenge: string): string | null;
}

export class WhatsAppCloudProvider implements WhatsAppProvider {
  constructor(
    private readonly token: string,
    private readonly phoneNumberId: string,
    private readonly verifyToken?: string,
  ) {}

  isConfigured(): boolean {
    return Boolean(this.token && this.phoneNumberId);
  }

  private get apiUrl(): string {
    return `${WHATSAPP_API_BASE}/${this.phoneNumberId}`;
  }

  async sendMessage(to: string, text: string): Promise<boolean> {
    if (!this.isConfigured()) {
      logger.warn('WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set — message not sent', {
        preview: text.slice(0, 80),
        to,
      });
      return false;
    }

    try {
      const chunks = this.splitMessage(text);
      for (const chunk of chunks) {
        await axios.post(
          `${this.apiUrl}/messages`,
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to,
            type: 'text',
            text: { preview_url: false, body: chunk },
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              'Content-Type': 'application/json',
            },
          },
        );
      }

      return true;
    } catch (err) {
      logger.error('WhatsApp sendMessage failed', { err: (err as Error).message, to });
      return false;
    }
  }

  parseWebhook(body: unknown): WhatsAppMessage | null {
    const payload = body as {
      entry?: Array<{
        changes?: Array<{
          value?: {
            messages?: Array<{ from?: string; id?: string; text?: { body?: string } }>;
          };
        }>;
      }>;
    };

    const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message?.from || !message?.id || !message?.text?.body) {
      return null;
    }

    return {
      from: message.from,
      text: message.text.body,
      messageId: message.id,
    };
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (!this.verifyToken) return null;
    if (mode === 'subscribe' && token === this.verifyToken) {
      return challenge;
    }
    return null;
  }

  private splitMessage(text: string): string[] {
    if (text.length <= MAX_MESSAGE_LENGTH) return [text];

    const chunks: string[] = [];
    let remaining = text;

    while (remaining.length > 0) {
      if (remaining.length <= MAX_MESSAGE_LENGTH) {
        chunks.push(remaining);
        break;
      }

      let splitAt = remaining.lastIndexOf('\n', MAX_MESSAGE_LENGTH);
      if (splitAt < MAX_MESSAGE_LENGTH / 2) splitAt = MAX_MESSAGE_LENGTH;

      chunks.push(remaining.slice(0, splitAt));
      remaining = remaining.slice(splitAt).trimStart();
    }

    return chunks;
  }
}

export class WhatsAppProviderStub implements WhatsAppProvider {
  isConfigured(): boolean {
    return false;
  }

  async sendMessage(_to: string, text: string): Promise<boolean> {
    logger.warn('WHATSAPP_TOKEN not set — message not sent', { preview: text.slice(0, 80) });
    return false;
  }

  parseWebhook(_body: unknown): WhatsAppMessage | null {
    return null;
  }

  verifyWebhook(_mode: string, _token: string, _challenge: string): string | null {
    return null;
  }
}

export const createWhatsAppProvider = (): WhatsAppProvider => {
  if (config.WHATSAPP_TOKEN && config.WHATSAPP_PHONE_NUMBER_ID) {
    return new WhatsAppCloudProvider(
      config.WHATSAPP_TOKEN,
      config.WHATSAPP_PHONE_NUMBER_ID,
      config.WHATSAPP_VERIFY_TOKEN,
    );
  }

  logger.warn('WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set — WhatsApp replies will not be delivered');
  return new WhatsAppProviderStub();
};

export const whatsAppProvider = createWhatsAppProvider();
