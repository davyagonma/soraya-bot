import axios, { AxiosError } from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import {
  parseAxiosError,
  parseRetryAfterSeconds,
  parseTelegramErrorBody,
  sleep,
  type ParsedAxiosError,
} from '../utils/axiosError';

const TELEGRAM_API = 'https://api.telegram.org';
const MAX_MESSAGE_LENGTH = 4096;
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 3;

interface TelegramApiResponse {
  ok: boolean;
  error_code?: number;
  description?: string;
  parameters?: { retry_after?: number };
  result?: unknown;
}

export interface TelegramProvider {
  isConfigured(): boolean;
  sendChatAction(chatId: string | number, action?: 'typing'): Promise<void>;
  sendMessage(chatId: string | number, text: string): Promise<boolean>;
}

function normalizeChatId(chatId: string | number): string {
  return String(chatId);
}

function logTelegramFailure(context: string, parsed: ParsedAxiosError, chatId?: string | number): void {
  logger.error(`Telegram ${context} failed`, {
    chatId: chatId != null ? normalizeChatId(chatId) : undefined,
    message: parsed.message,
    code: parsed.code,
    httpStatus: parsed.status,
    telegramErrorCode: parsed.telegramErrorCode,
    telegramDescription: parsed.telegramDescription,
    responseData: parsed.data,
  });
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

  private isRateLimited(parsed: ParsedAxiosError): boolean {
    return parsed.status === 429 || parsed.telegramErrorCode === 429;
  }

  private retryDelayMs(data: TelegramApiResponse, parsed: ParsedAxiosError): number {
    const seconds =
      data.parameters?.retry_after ??
      parseRetryAfterSeconds(parsed.telegramDescription ?? parsed.message);
    return Math.min(Math.max(seconds, 1), 60) * 1000;
  }

  private async callApi(method: string, body: Record<string, unknown>): Promise<void> {
    let lastError: ParsedAxiosError | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await axios.post<TelegramApiResponse>(`${this.apiUrl}/${method}`, body, {
          timeout: REQUEST_TIMEOUT_MS,
        });

        if (!res.data.ok) {
          const parsed = parseTelegramErrorBody(res.data);
          if (this.isRateLimited(parsed) && attempt < MAX_RETRIES) {
            const delay = this.retryDelayMs(res.data, parsed);
            logger.warn('Telegram rate limited, retrying', { method, attempt: attempt + 1, delayMs: delay });
            await sleep(delay);
            continue;
          }
          throw parsed;
        }

        return;
      } catch (err) {
        const parsed: ParsedAxiosError =
          err && typeof err === 'object' && 'message' in err && !axios.isAxiosError(err)
            ? (err as ParsedAxiosError)
            : parseAxiosError(err);

        if (this.isRateLimited(parsed) && attempt < MAX_RETRIES) {
          const axiosData = axios.isAxiosError(err)
            ? (err as AxiosError<TelegramApiResponse>).response?.data
            : undefined;
          const delay = axiosData
            ? this.retryDelayMs(axiosData, parsed)
            : parseRetryAfterSeconds(parsed.telegramDescription) * 1000;
          logger.warn('Telegram rate limited (HTTP), retrying', { method, attempt: attempt + 1, delayMs: delay });
          await sleep(delay);
          lastError = parsed;
          continue;
        }

        lastError = parsed;
        break;
      }
    }

    throw lastError ?? { message: 'Telegram API call failed' };
  }

  async sendChatAction(chatId: string | number, action = 'typing'): Promise<void> {
    try {
      await this.callApi('sendChatAction', {
        chat_id: normalizeChatId(chatId),
        action,
      });
    } catch (err) {
      const parsed = err && typeof err === 'object' && 'message' in err ? (err as ParsedAxiosError) : parseAxiosError(err);
      logger.warn('Telegram sendChatAction failed (non-blocking)', {
        chatId: normalizeChatId(chatId),
        message: parsed.message,
        code: parsed.code,
        httpStatus: parsed.status,
        telegramErrorCode: parsed.telegramErrorCode,
        telegramDescription: parsed.telegramDescription,
      });
    }
  }

  async sendMessage(chatId: string | number, text: string): Promise<boolean> {
    const normalizedId = normalizeChatId(chatId);
    try {
      const chunks = this.splitMessage(text);
      for (const chunk of chunks) {
        await this.callApi('sendMessage', {
          chat_id: normalizedId,
          text: chunk,
        });
      }
      return true;
    } catch (err) {
      const parsed = err && typeof err === 'object' && 'message' in err ? (err as ParsedAxiosError) : parseAxiosError(err);
      logTelegramFailure('sendMessage', parsed, chatId);
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
