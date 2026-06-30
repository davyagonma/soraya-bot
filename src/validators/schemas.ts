import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const chatSchema = z.object({
  message: z.string().min(1).max(4000),
  conversationId: z.string().uuid().optional(),
  channel: z.enum(['web', 'telegram', 'whatsapp', 'mobile']).optional(),
});

export const cryptoPriceSchema = z.object({
  symbol: z.string().min(1).max(10),
  currencies: z.string().optional(),
});

export const cryptoTopSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  currency: z.string().optional(),
});

export const cryptoHistorySchema = z.object({
  symbol: z.string().min(1),
  days: z.coerce.number().min(1).max(365).optional(),
  currency: z.string().optional(),
});

export const convertSchema = z.object({
  amount: z.coerce.number().positive(),
  from: z.string().min(1).max(10),
  to: z.string().min(1).max(10),
});

export const educationSearchSchema = z.object({
  q: z.string().min(1),
});

export const educationSlugSchema = z.object({
  slug: z.string().min(1),
});

export const newsSchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional(),
});

export const scamAnalysisSchema = z.object({
  description: z.string().min(10).max(5000),
});

export const createAlertSchema = z.object({
  symbol: z.string().min(1).max(10),
  targetPrice: z.number().positive(),
  currency: z.string().optional(),
  condition: z.enum(['ABOVE', 'BELOW']),
});

export const alertIdSchema = z.object({
  id: z.string().uuid(),
});

export const conversationIdSchema = z.object({
  id: z.string().uuid(),
});

export const telegramWebhookSchema = z.object({
  message: z
    .object({
      chat: z.object({ id: z.number() }),
      from: z.object({ id: z.number(), first_name: z.string().optional() }).optional(),
      text: z.string().optional(),
    })
    .optional(),
}).passthrough();
