import rateLimit from 'express-rate-limit';
import type { Request } from 'express';
import { config } from '../config';

/** Webhooks Telegram/WhatsApp : ne pas compter dans la limite globale (retries + multi-appareils) */
const isInboundWebhook = (req: Request): boolean =>
  /\/(telegram|whatsapp)\/webhook$/.test(req.path);

export const apiRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: isInboundWebhook,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts.' },
});

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many chat requests.' },
});
