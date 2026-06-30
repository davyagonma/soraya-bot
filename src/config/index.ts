import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  GROK_API_KEY: z.string().optional(),
  GROK_MODEL: z.string().default('grok-2-latest'),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-2.0-flash'),
  /** Ordre de priorité : openai, grok, gemini (séparés par des virgules) */
  AI_PROVIDER_PRIORITY: z.string().default('openai,grok,gemini'),
  COINGECKO_API_KEY: z.string().optional(),
  NEWS_API_KEY: z.string().optional(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  TELEGRAM_TOKEN: z.string().optional(),
  WHATSAPP_TOKEN: z.string().optional(),
  CHAT_MAX_HISTORY: z.coerce.number().default(20),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;

export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';
export const hasOpenAI = Boolean(config.OPENAI_API_KEY);
export const hasGrok = Boolean(config.GROK_API_KEY);
export const hasGemini = Boolean(config.GEMINI_API_KEY);
export const hasCoinGecko = Boolean(config.COINGECKO_API_KEY);
export const hasNewsAPI = Boolean(config.NEWS_API_KEY);
