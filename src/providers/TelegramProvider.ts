import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

const TELEGRAM_API = 'https://api.telegram.org';
const MAX_MESSAGE_LENGTH = 4096;

export interface TelegramProvider {
  isConfigured(): boolean;
  sendChatAction(chatId: string | number, action?: 'typing'): Promise<void>;
  sendMessage(chatId: string | number, text: string): Promise<boolean>;
}

export class TelegramBotProvider implements TelegramProvider {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  isConfigured(): boolean {
    return Boolean(this.token);
  }

  private get apiUrl(): string {
    return `${TELEGRAM_API}/bot${this.token}`;
  }

  async sendChatAction(chatId: string | number, action = 'typing'): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/sendChatAction`, {
        chat_id: chatId,
        action,
      });
    } catch (err) {
      logger.warn('Telegram sendChatAction failed (non-blocking)', { err: (err as Error).message });
    }
  }

  async sendMessage(chatId: string | number, text: string): Promise<boolean> {
    try {
      const chunks = this.splitMessage(text);
      for (const chunk of chunks) {
        await axios.post(`${this.apiUrl}/sendMessage`, {
          chat_id: chatId,
          text: chunk,
        });
      }
      return true;
    } catch (err) {
      logger.error('Telegram sendMessage failed', { err: (err as Error).message, chatId });
      return false;
    }
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

export class TelegramProviderStub implements TelegramProvider {
  isConfigured(): boolean {
    return false;
  }

  async sendChatAction(_chatId: string | number): Promise<void> {
    logger.warn('TELEGRAM_TOKEN not set — sendChatAction skipped');
  }

  async sendMessage(_chatId: string | number, text: string): Promise<boolean> {
    logger.warn('TELEGRAM_TOKEN not set — reply not sent to Telegram', { preview: text.slice(0, 80) });
    return false;
  }
}

export const createTelegramProvider = (): TelegramProvider => {
  if (config.TELEGRAM_TOKEN) {
    return new TelegramBotProvider(config.TELEGRAM_TOKEN);
  }
  logger.warn('TELEGRAM_TOKEN not set — Telegram replies will not be delivered');
  return new TelegramProviderStub();
};

export const telegramProvider = createTelegramProvider();
