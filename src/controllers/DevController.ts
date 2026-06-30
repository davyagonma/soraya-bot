import { Request, Response } from 'express';
import prisma from '../database/prisma';
import { config, isProduction } from '../config';
import { resolveAIProviderChain } from '../providers/OpenAIProvider';

const SEED_CONVERSATION_ID = '00000000-0000-4000-8000-000000000001';
const SEED_ALERT_IDS = [
  '00000000-0000-4000-8000-000000000010',
  '00000000-0000-4000-8000-000000000011',
];

export class DevController {
  getTestData = async (_req: Request, res: Response): Promise<void> => {
    const demoUser = await prisma.user.findUnique({ where: { email: 'demo@soraya.africa' } });
    const conversation = await prisma.conversation.findUnique({ where: { id: SEED_CONVERSATION_ID } });

    const conversationReady = Boolean(conversation && demoUser && conversation.userId === demoUser.id);

    res.json({
      success: true,
      data: {
        hint: conversationReady
          ? 'Connectez-vous avec demo@soraya.africa, copiez accessToken dans Authorize, puis testez /api/chat.'
          : 'Exécutez npm run prisma:seed pour créer les données de test.',
        accounts: [
          { email: 'demo@soraya.africa', password: 'user123456', role: 'USER' },
          { email: 'admin@soraya.africa', password: 'admin123456', role: 'ADMIN' },
        ],
        demoUserId: demoUser?.id ?? null,
        conversationId: conversationReady ? SEED_CONVERSATION_ID : null,
        alertIds: conversationReady ? SEED_ALERT_IDS : [],
        educationSlugs: ['bitcoin', 'lightning', 'wallet', 'security'],
        ai: {
          priority: config.AI_PROVIDER_PRIORITY,
          activeChain: [...resolveAIProviderChain().active, 'mock'],
          hint: 'Modifiez AI_PROVIDER_PRIORITY dans .env puis redémarrez l\'API',
          localFaq: '/api/education/local-faq',
          localAskExample: '/api/education/ask?q=comment apprendre le bitcoin',
        },
        telegram: {
          configured: Boolean(config.TELEGRAM_TOKEN),
          webhookUrl: '/api/telegram/webhook',
          setWebhookCommand:
            'curl "https://api.telegram.org/bot<TELEGRAM_TOKEN>/setWebhook?url=https://<VOTRE_URL>/api/telegram/webhook"',
          getChatIdHint: 'Envoyez /start à @userinfobot sur Telegram pour obtenir votre chat.id',
        },
        steps: [
          '1. GET /api/dev/test-data — vérifier les IDs',
          '2. POST /api/auth/login avec demo@soraya.africa / user123456',
          '3. Cliquer Authorize → coller accessToken (sans le préfixe Bearer)',
          '4. POST /api/chat avec conversationId ou sans pour une nouvelle conversation',
          '5. Telegram : TELEGRAM_TOKEN dans .env → setWebhook → écrire au bot',
        ],
      },
    });
  };
}

export const devController = new DevController();

export const devRoutesEnabled = (): boolean => !isProduction;
