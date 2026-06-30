/**
 * WhatsApp Provider — prepared for future integration.
 * To activate:
 * 1. Set WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID in .env
 * 2. Implement sendMessage() and parseWebhook()
 * 3. Uncomment routes in whatsapp.routes.ts
 */
export interface WhatsAppMessage {
  from: string;
  text: string;
  messageId: string;
}

export interface WhatsAppProvider {
  sendMessage(to: string, text: string): Promise<void>;
  parseWebhook(body: unknown): WhatsAppMessage | null;
  verifyWebhook(mode: string, token: string, challenge: string): string | null;
}

export class WhatsAppProviderStub implements WhatsAppProvider {
  async sendMessage(_to: string, _text: string): Promise<void> {
    throw new Error('WhatsApp integration not enabled');
  }

  parseWebhook(_body: unknown): WhatsAppMessage | null {
    return null;
  }

  verifyWebhook(_mode: string, _token: string, _challenge: string): string | null {
    return null;
  }
}

export const whatsAppProvider = new WhatsAppProviderStub();
