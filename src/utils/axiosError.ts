import axios from 'axios';

export interface ParsedAxiosError {
  message: string;
  code?: string;
  status?: number;
  data?: unknown;
  telegramDescription?: string;
  telegramErrorCode?: number;
}

interface TelegramErrorBody {
  ok?: boolean;
  error_code?: number;
  description?: string;
  parameters?: { retry_after?: number };
}

export function parseAxiosError(err: unknown): ParsedAxiosError {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as TelegramErrorBody | undefined;
    return {
      message: data?.description ?? err.message ?? 'Unknown axios error',
      code: err.code,
      status: err.response?.status,
      data: err.response?.data,
      telegramDescription: data?.description,
      telegramErrorCode: data?.error_code,
    };
  }
  if (err instanceof Error) {
    return { message: err.message || err.name };
  }
  return { message: String(err) };
}

export function parseTelegramErrorBody(data: TelegramErrorBody): ParsedAxiosError {
  return {
    message: data.description ?? 'Telegram API returned ok:false',
    status: 200,
    data,
    telegramDescription: data.description,
    telegramErrorCode: data.error_code,
  };
}

/** Extrait "retry after N" depuis la description Telegram */
export function parseRetryAfterSeconds(description?: string, fallback = 2): number {
  if (!description) return fallback;
  const match = description.match(/retry after (\d+)/i);
  return match ? Number(match[1]) : fallback;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
