import { ChatSource } from '../types';

export interface LocalKnowledgeEntry {
  id: string;
  /** Au moins un mot-clé requis parmi cette liste */
  triggers: string[];
  /** Doit contenir au moins un de ces termes (ex. bitcoin) */
  requires?: string[];
  /** Ignore cette entrée si un de ces termes est présent (ex. prix temps réel) */
  excludes?: string[];
  answer: string;
  sources: ChatSource[];
  priority?: number;
}

export const LOCAL_KNOWLEDGE_ENTRIES: LocalKnowledgeEntry[] = [
  {
    id: 'learn-bitcoin',
    triggers: ['apprendre', 'formation', 'étudier', 'etudier', 'éducation', 'education', 'cours', 'débutant', 'debutant', 'initiation', 'comprendre', 'découvrir', 'decouvrir', 'enseigner', 'former'],
    requires: ['bitcoin', 'btc', 'crypto', 'cryptomonnaie'],
    excludes: ['prix', 'cours du', 'combien', 'convertir', 'actualit', 'news', 'arnaque', 'scam'],
    priority: 10,
    answer: `Pour apprendre le Bitcoin sereinement, commencez par les fondamentaux : qu'est-ce qu'une blockchain, comment fonctionne un wallet, et pourquoi la sécurité de vos clés est essentielle.

Voici des ressources de confiance recommandées par SORAYA pour l'Afrique francophone :

• **Plan B** — contenus pédagogiques Bitcoin en français
• **Bitcoin Benin** — communauté et accompagnement au Bénin
• **Bitcoin Kids** — initiation Bitcoin adaptée aux jeunes et débutants

Conseil : progressez étape par étape, ne mettez jamais en jeu de l'argent que vous ne pouvez pas perdre, et vérifiez toujours vos sources.`,
    sources: [
      {
        name: 'Plan B',
        url: 'https://planb.network',
        description: 'Ressources éducatives Bitcoin francophones',
      },
      {
        name: 'Bitcoin Benin',
        url: 'https://bitcoinbenin.com',
        description: 'Communauté et éducation Bitcoin au Bénin',
      },
      {
        name: 'Bitcoin Kids',
        url: 'https://bitcoinkids.africa',
        description: 'Éducation Bitcoin pour les jeunes et nouveaux arrivants',
      },
    ],
  },
  {
    id: 'buy-bitcoin',
    triggers: ['acheter', 'achat', 'buy', 'purchase', 'où acheter', 'ou acheter', 'plateforme', 'exchange', 'échanger', 'echanger', 'vendre', 'izichange'],
    requires: ['bitcoin', 'btc', 'crypto', 'cryptomonnaie', 'izichange'],
    excludes: ['prix', 'cours du', 'combien vaut', 'convertir', 'arnaque'],
    priority: 10,
    answer: `Pour acheter du Bitcoin en Afrique de l'Ouest, privilégiez une plateforme fiable, transparente sur les frais, et adaptée aux paiements locaux (Mobile Money, virement, etc.).

**Izichange** est une option couramment utilisée dans la région pour acheter et vendre des cryptomonnaies avec des moyens de paiement locaux.

Avant d'acheter :
1. Vérifiez les frais et le taux affiché
2. Activez la double authentification (2FA)
3. Transférez vos BTC vers votre propre wallet non-custodial si vous conservez longtemps
4. N'investissez que ce que vous pouvez vous permettre de perdre`,
    sources: [
      {
        name: 'Izichange',
        url: 'https://izichange.com',
        description: 'Plateforme d\'achat/vente crypto avec paiements locaux (Afrique)',
      },
    ],
  },
  {
    id: 'what-is-bitcoin',
    triggers: ['c\'est quoi', "c'est quoi", 'qu\'est-ce', "qu'est-ce", 'définition', 'definition', 'expliquer', 'explication', 'bitcoin cest'],
    requires: ['bitcoin', 'btc'],
    excludes: ['prix', 'combien', 'acheter', 'apprendre', 'formation'],
    priority: 5,
    answer: `Le **Bitcoin (BTC)** est une monnaie numérique décentralisée créée en 2009. Elle fonctionne sans banque centrale : les transactions sont vérifiées par un réseau mondial et enregistrées sur une blockchain publique.

Points clés :
• Offre limitée à 21 millions de BTC
• Vous pouvez l'envoyer à anyone, 24h/24
• Vous devez protéger vos clés privées (seed phrase)

Pour aller plus loin, consultez les ressources éducatives ci-dessous.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Comprendre Bitcoin en français' },
      { name: 'Bitcoin Benin', url: 'https://bitcoinbenin.com', description: 'Communauté Bitcoin au Bénin' },
    ],
  },
  {
    id: 'wallet-security',
    triggers: ['wallet', 'portefeuille', 'seed', 'clé privée', 'cle privee', 'sécuriser', 'securiser', 'protéger', 'proteger', 'stockage'],
    requires: ['bitcoin', 'btc', 'crypto', 'wallet', 'portefeuille', 'seed'],
    excludes: ['prix', 'acheter', 'arnaque'],
    priority: 4,
    answer: `La sécurité de vos Bitcoin repose sur **vos clés privées** et votre **seed phrase** (12 ou 24 mots).

Règles essentielles :
• Ne partagez JAMAIS votre seed phrase
• Utilisez un hardware wallet pour les montants importants
• Activez la 2FA sur les plateformes
• Méfiez-vous des messages « support technique » frauduleux

Pour approfondir, voir les ressources ci-dessous.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Guides sécurité Bitcoin' },
      { name: 'Bitcoin Benin', url: 'https://bitcoinbenin.com', description: 'Ateliers sécurité en Afrique' },
    ],
  },
  {
    id: 'lightning-intro',
    triggers: ['lightning', 'éclair', 'eclair', 'layer 2', 'layer2', 'micro-paiement', 'micropaiement'],
    requires: ['bitcoin', 'btc', 'lightning', 'éclair', 'eclair'],
    excludes: ['prix'],
    priority: 4,
    answer: `Le **Lightning Network** est une couche de paiement construite sur Bitcoin. Il permet des transactions quasi-instantanées et à faible coût — idéal pour les micro-paiements et l'usage quotidien en Afrique.

Avantages : rapidité, frais réduits, adapté au mobile money et aux petits montants en FCFA.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Tutoriels Lightning Network' },
      { name: 'Bitcoin Kids', url: 'https://bitcoinkids.africa', description: 'Initiation pédagogique Lightning' },
    ],
  },
  {
    id: 'start-bitcoin',
    triggers: ['commencer', 'débuter', 'debuter', 'premiers pas', 'par où', 'par ou', 'comment débuter', 'comment debuter', 'je débute', 'je debute'],
    requires: ['bitcoin', 'btc', 'crypto'],
    excludes: ['prix', 'combien', 'arnaque'],
    priority: 6,
    answer: `Bienvenue ! Voici un parcours simple pour débuter avec le Bitcoin :

1. **Comprendre** — lisez les bases (blockchain, wallet, sécurité)
2. **Apprendre** — suivez des ressources de confiance (voir sources)
3. **Pratiquer** — commencez avec un petit montant sur une plateforme fiable
4. **Sécuriser** — transférez vers votre propre wallet si vous conservez longtemps

SORAYA est là pour répondre à vos questions à chaque étape.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Parcours débutant Bitcoin' },
      { name: 'Bitcoin Benin', url: 'https://bitcoinbenin.com', description: 'Communauté locale au Bénin' },
      { name: 'Bitcoin Kids', url: 'https://bitcoinkids.africa', description: 'Approche accessible pour débuter' },
    ],
  },
  {
    id: 'scam-basics',
    triggers: ['arnaque', 'scam', 'escroc', 'fiable', 'confiance', 'plateforme suspecte', 'trop beau'],
    requires: ['bitcoin', 'btc', 'crypto', 'invest', 'plateforme', 'arnaque', 'scam', 'fiable'],
    excludes: [],
    priority: 3,
    answer: `Méfiez-vous des signaux d'alerte courants :
• Gains garantis ou rendements irréalistes (ex. 50 %/mois)
• Pression pour investir vite (« dernière chance »)
• Demande de seed phrase ou clés privées
• Parrainage/pyramide

Utilisez l'outil **Analyse arnaque** de SORAYA (POST /api/risk-analysis) pour évaluer une offre suspecte. En cas de doute : n'investissez pas.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Sensibilisation aux arnaques crypto' },
      { name: 'Bitcoin Benin', url: 'https://bitcoinbenin.com', description: 'Retours d\'expérience communauté locale' },
    ],
  },
];
