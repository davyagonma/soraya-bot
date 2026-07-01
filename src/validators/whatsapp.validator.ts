import { z } from 'zod';

/**
 * Validation souple du payload webhook Evolution API.
 * Evolution envoie de nombreux types d'events
 * (messages.upsert, connection.update, qrcode.updated, presence.update...),
 * on ne valide donc strictement que l'enveloppe commune.
 * Le contenu détaillé de `data` est typé/extrait dans WhatsAppService.
 */
export const evolutionWebhookSchema = z.object({
  event: z.string(),
  instance: z.string(),
  data: z.record(z.unknown()).optional(),
});

export type EvolutionWebhookInput = z.infer<typeof evolutionWebhookSchema>;