import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const userPassword = await bcrypt.hash('user123456', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@soraya.africa' },
    update: {},
    create: {
      email: 'admin@soraya.africa',
      password: adminPassword,
      name: 'Admin SORAYA',
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@soraya.africa' },
    update: {},
    create: {
      email: 'demo@soraya.africa',
      password: userPassword,
      name: 'Demo User',
      role: 'USER',
    },
  });

  const conversation = await prisma.conversation.upsert({
    where: { id: '00000000-0000-4000-8000-000000000001' },
    update: {
      userId: demoUser.id,
      title: 'Prix du Bitcoin en FCFA',
      channel: 'web',
    },
    create: {
      id: '00000000-0000-4000-8000-000000000001',
      userId: demoUser.id,
      title: 'Prix du Bitcoin en FCFA',
      channel: 'web',
    },
  });

  const existingMessages = await prisma.message.count({ where: { conversationId: conversation.id } });
  if (existingMessages === 0) {
    await prisma.message.createMany({
      data: [
        {
          conversationId: conversation.id,
          role: 'USER',
          content: 'Bonjour SORAYA, quel est le prix du Bitcoin en FCFA ?',
        },
        {
          conversationId: conversation.id,
          role: 'ASSISTANT',
          content:
            'Bonjour ! Le Bitcoin (BTC) se négocie actuellement autour de 95 000 USD, soit environ 57 000 000 FCFA. Les prix varient en temps réel — utilisez /api/crypto/price?symbol=BTC&currencies=USD,XOF pour les données à jour.',
        },
        {
          conversationId: conversation.id,
          role: 'USER',
          content: 'Comment convertir 100 000 FCFA en BTC ?',
        },
        {
          conversationId: conversation.id,
          role: 'ASSISTANT',
          content:
            'Avec 100 000 FCFA, vous obtiendriez environ 0.00000175 BTC au taux actuel. Utilisez GET /api/convert?amount=100000&from=XOF&to=BTC pour un calcul précis.',
        },
      ],
    });
  }

  await prisma.priceAlert.upsert({
    where: { id: '00000000-0000-4000-8000-000000000010' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000010',
      userId: demoUser.id,
      symbol: 'BTC',
      targetPrice: 100000,
      currency: 'USD',
      condition: 'ABOVE',
      isActive: true,
    },
  });

  await prisma.priceAlert.upsert({
    where: { id: '00000000-0000-4000-8000-000000000011' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000011',
      userId: demoUser.id,
      symbol: 'ETH',
      targetPrice: 3000,
      currency: 'USD',
      condition: 'BELOW',
      isActive: true,
    },
  });

  await prisma.favorite.upsert({
    where: { userId_symbol: { userId: demoUser.id, symbol: 'BTC' } },
    update: {},
    create: { userId: demoUser.id, symbol: 'BTC', name: 'Bitcoin' },
  });

  await prisma.favorite.upsert({
    where: { userId_symbol: { userId: demoUser.id, symbol: 'ETH' } },
    update: {},
    create: { userId: demoUser.id, symbol: 'ETH', name: 'Ethereum' },
  });

  const newsArticles = [
    {
      title: 'Bitcoin atteint un nouveau record en 2026',
      summary: '[Résumé FR] Le Bitcoin continue sa progression sur les marchés africains et mondiaux.',
      source: 'SORAYA Seed',
      url: 'https://example.com/soraya/news/btc-record-2026',
      publishedAt: new Date('2026-06-28T10:00:00Z'),
    },
    {
      title: "L'adoption crypto progresse en Afrique de l'Ouest",
      summary: "[Résumé FR] De plus en plus d'utilisateurs adoptent le Bitcoin via mobile money.",
      source: 'SORAYA Seed',
      url: 'https://example.com/soraya/news/adoption-west-africa',
      publishedAt: new Date('2026-06-27T14:30:00Z'),
    },
    {
      title: 'Le Lightning Network facilite les micro-paiements',
      summary: '[Résumé FR] Le réseau Lightning permet des transactions rapides et peu coûteuses.',
      source: 'SORAYA Seed',
      url: 'https://example.com/soraya/news/lightning-payments',
      publishedAt: new Date('2026-06-26T09:15:00Z'),
    },
  ];

  for (const article of newsArticles) {
    await prisma.news.upsert({
      where: { url: article.url },
      update: { summary: article.summary },
      create: article,
    });
  }

  const scamExists = await prisma.scamAnalysis.findFirst({
    where: { input: 'Investissement garanti 50% par mois sans risque — plateforme exclusive VIP' },
  });
  if (!scamExists) {
    await prisma.scamAnalysis.create({
      data: {
        input: 'Investissement garanti 50% par mois sans risque — plateforme exclusive VIP',
        score: 70,
        level: 'HIGH',
        explanation:
          "Analyse : 3 signal(aux) d'alerte détecté(s) : Promesse de gains garantis, Affirmation « sans risque », Marketing exclusif/secret.",
        recommendations: [
          "Ne investissez jamais plus que ce que vous pouvez vous permettre de perdre.",
          'Vérifiez la régulation et la réputation de la plateforme.',
          "Évitez cette opportunité — les signaux d'alerte sont nombreux.",
        ],
      },
    });
  }

  console.log('Seed completed successfully!\n');
  console.log('--- Comptes ---');
  console.log('Admin : admin@soraya.africa / admin123456');
  console.log('Demo  : demo@soraya.africa / user123456');
  console.log('\n--- Données de test ---');
  console.log(`Conversation ID : ${conversation.id}`);
  console.log(`Demo user ID    : ${demoUser.id}`);
  console.log(`Admin user ID   : ${admin.id}`);
  console.log('\n--- Tester le chat ---');
  console.log('1. POST /api/auth/login { "email": "demo@soraya.africa", "password": "user123456" }');
  console.log('2. POST /api/chat { "message": "Quel est le prix du BTC ?", "conversationId": "' + conversation.id + '" }');
  console.log('3. GET  /api/chat/conversations');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
