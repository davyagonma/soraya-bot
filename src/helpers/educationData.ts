import { EducationTopic } from '../types';

export const EDUCATION_TOPICS: EducationTopic[] = [
  {
    slug: 'bitcoin',
    title: 'Qu\'est-ce que le Bitcoin ?',
    summary: 'Introduction au Bitcoin et à son fonctionnement.',
    content: `Le Bitcoin (BTC) est la première cryptomonnaie décentralisée, créée en 2009 par Satoshi Nakamoto. Il fonctionne sur une blockchain publique sans autorité centrale. Les transactions sont vérifiées par un réseau de mineurs et enregistrées de manière immuable. Le Bitcoin est souvent comparé à « l'or numérique » en raison de son offre limitée à 21 millions d'unités.`,
    tags: ['bitcoin', 'blockchain', 'débutant'],
  },
  {
    slug: 'wallet',
    title: 'Portefeuille Bitcoin (Wallet)',
    summary: 'Comment stocker et gérer vos Bitcoin en sécurité.',
    content: `Un wallet Bitcoin est un logiciel ou un appareil qui stocke vos clés privées et vous permet d'envoyer/recevoir des BTC. Il existe plusieurs types : hot wallets (connectés à Internet), cold wallets (hors ligne), custodial (exchange) et non-custodial (vous contrôlez vos clés). En Afrique, privilégiez les wallets non-custodial pour garder le contrôle de vos fonds.`,
    tags: ['wallet', 'sécurité', 'stockage'],
  },
  {
    slug: 'lightning',
    title: 'Lightning Network',
    summary: 'Le réseau de paiement instantané du Bitcoin.',
    content: `Le Lightning Network est une couche 2 construite au-dessus du Bitcoin. Il permet des transactions quasi-instantanées et à faible coût, idéales pour les micro-paiements. En Afrique, le Lightning est particulièrement utile pour les paiements quotidiens, les transferts transfrontaliers et l'inclusion financière.`,
    tags: ['lightning', 'paiement', 'layer2'],
  },
  {
    slug: 'mining',
    title: 'Minage Bitcoin',
    summary: 'Comment les Bitcoin sont créés et sécurisés.',
    content: `Le minage consiste à valider les transactions et à les ajouter à la blockchain en résolvant des problèmes cryptographiques. Les mineurs sont récompensés en BTC. Le minage consomme de l'énergie et nécessite du matériel spécialisé (ASIC). Ce n'est pas nécessaire pour simplement utiliser Bitcoin.`,
    tags: ['mining', 'blockchain', 'technique'],
  },
  {
    slug: 'halving',
    title: 'Halving Bitcoin',
    summary: 'La réduction périodique de la récompense des mineurs.',
    content: `Tous les ~4 ans, la récompense de minage est divisée par deux (halving). Ce mécanisme réduit l'émission de nouveaux BTC et renforce la rareté. Les halvings historiques ont souvent précédé des cycles haussiers, mais passé ≠ futur. Investir comporte des risques.`,
    tags: ['halving', 'économie', 'bitcoin'],
  },
  {
    slug: 'seed-phrase',
    title: 'Seed Phrase (Phrase de récupération)',
    summary: 'La clé maîtresse de votre wallet.',
    content: `La seed phrase est une liste de 12 ou 24 mots qui permet de restaurer votre wallet. C'est le secret le plus important : qui la possède possède vos Bitcoin. Ne la partagez jamais, ne la stockez pas en ligne, et conservez-la hors ligne dans un endroit sûr.`,
    tags: ['sécurité', 'wallet', 'seed'],
  },
  {
    slug: 'cold-wallet',
    title: 'Cold Wallet',
    summary: 'Stockage hors ligne pour une sécurité maximale.',
    content: `Un cold wallet stocke vos clés privées hors ligne (papier, hardware wallet). C'est la méthode la plus sûre pour conserver des Bitcoin à long terme. Les hardware wallets (Ledger, Trezor) sont recommandés pour les montants significatifs.`,
    tags: ['sécurité', 'cold-wallet', 'stockage'],
  },
  {
    slug: 'hot-wallet',
    title: 'Hot Wallet',
    summary: 'Portefeuille connecté à Internet.',
    content: `Un hot wallet est connecté à Internet (applications mobiles, extensions navigateur). Pratique pour les transactions quotidiennes mais plus exposé aux piratages. Utilisez-le uniquement pour de petites sommes et gardez le gros de vos fonds en cold storage.`,
    tags: ['wallet', 'sécurité', 'hot-wallet'],
  },
  {
    slug: 'private-key',
    title: 'Clé Privée',
    summary: 'Le secret qui prouve la propriété de vos Bitcoin.',
    content: `La clé privée est un code secret qui permet de signer des transactions et de prouver que vous possédez des Bitcoin. Ne la partagez jamais. Si quelqu'un l'obtient, il peut voler vos fonds. La seed phrase génère vos clés privées.`,
    tags: ['sécurité', 'clés', 'technique'],
  },
  {
    slug: 'public-key',
    title: 'Clé Publique et Adresse',
    summary: 'Ce que vous partagez pour recevoir des Bitcoin.',
    content: `La clé publique est dérivée de la clé privée et sert à générer votre adresse Bitcoin. Vous pouvez partager votre adresse publiquement pour recevoir des paiements. Elle ne permet pas de dépenser vos fonds.`,
    tags: ['clés', 'adresse', 'technique'],
  },
  {
    slug: 'securite',
    title: 'Sécurité Crypto',
    summary: 'Bonnes pratiques pour protéger vos actifs.',
    content: `Règles essentielles : ne partagez jamais votre seed phrase, activez la 2FA, vérifiez les URLs, méfiez-vous des promesses de gains garantis, utilisez des exchanges régulés, diversifiez vos méthodes de stockage, et restez informé sur les arnaques courantes en Afrique.`,
    tags: ['sécurité', 'bonnes-pratiques'],
  },
  {
    slug: 'fiscalite',
    title: 'Fiscalité Crypto en Afrique',
    summary: 'Aspects fiscaux à considérer.',
    content: `La fiscalité crypto varie selon les pays africains. Certains pays (Nigeria, Afrique du Sud) ont des cadres réglementaires, d'autres sont en cours de définition. Consultez un professionnel local. En général, les plus-values peuvent être imposables. Tenez un registre de vos transactions.`,
    tags: ['fiscalité', 'régulation', 'afrique'],
  },
];

export const getTopicBySlug = (slug: string): EducationTopic | undefined =>
  EDUCATION_TOPICS.find((t) => t.slug === slug);

export const searchTopics = (query: string): EducationTopic[] => {
  const q = query.toLowerCase();
  return EDUCATION_TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q)),
  );
};
