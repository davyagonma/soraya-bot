/**
 * Types pour l'intégration Evolution API (WhatsApp)
 * Documentation officielle : https://doc.evolution-api.com
 */

export interface EvolutionWebhookEvent {
  event: string;
  instance: string;
  data: EvolutionMessageData;
  destination?: string;
  date_time?: string;
  sender?: string;
  server_url?: string;
  apikey?: string;
}

export interface EvolutionMessageData {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  pushName?: string;
  message?: {
    conversation?: string;
    extendedTextMessage?: {
      text: string;
    };
    imageMessage?: {
      caption?: string;
      mimetype?: string;
      url?: string;
    };
    audioMessage?: {
      mimetype?: string;
      url?: string;
    };
  };
  messageType?: string;
  messageTimestamp?: number;
  status?: string;
}

export interface SendTextPayload {
  number: string;
  text: string;
  delay?: number;
  quoted?: {
    key: { id: string };
    message: { conversation: string };
  };
}

export interface SendTextResponse {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: Record<string, unknown>;
  messageTimestamp: string;
  status: string;
}

export interface InstanceStatus {
  instance: {
    instanceName: string;
    state: 'open' | 'close' | 'connecting';
  };
}

export interface IncomingWhatsAppMessage {
  from: string;
  text: string;
  pushName?: string;
  messageId: string;
  timestamp: number;
}