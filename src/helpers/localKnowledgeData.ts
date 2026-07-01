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

  // ─── Fondateur & histoire ───────────────────────────────────────────────
  {
    id: 'bitcoin-founder',
    triggers: ['fondateur', 'fondatrice', 'créateur', 'createur', 'inventeur', 'qui a créé', 'qui a cree', 'qui a inventé', 'qui a invente', "c'est qui", "c est qui", 'satoshi', 'nakamoto', 'white paper', 'whitepaper'],
    requires: ['bitcoin', 'btc', 'satoshi', 'nakamoto', 'fondateur', 'créateur', 'createur'],
    excludes: ['prix', 'combien', 'acheter', 'arnaque'],
    priority: 12,
    answer: `Le **Bitcoin** a été lancé en **janvier 2009** par une personne ou un groupe utilisant le pseudonyme **Satoshi Nakamoto**.

Ce qu'il faut retenir :
• Satoshi a publié le **white paper** « Bitcoin: A Peer-to-Peer Electronic Cash System » en octobre 2008
• Son identité réelle n'a **jamais été confirmée** — et c'est voulu pour un projet décentralisé
• Satoshi a miné les premiers blocs et a cessé d'intervenir publiquement vers 2010-2011
• Les ~1 million de BTC attribués à Satoshi n'ont jamais été dépensés (à ce jour)

Le Bitcoin n'appartient à aucune entreprise : c'est un protocole ouvert maintenu par des milliers de contributeurs dans le monde.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Histoire et philosophie du Bitcoin' },
      { name: 'Bitcoin.org', url: 'https://bitcoin.org/fr/', description: 'Site historique du projet Bitcoin' },
    ],
  },
  {
    id: 'bitcoin-origin-2009',
    triggers: ['2009', '2010', 'genèse', 'genese', 'premier bloc', 'genesis block', 'quand', 'date', 'histoire', 'origine', 'naissance', 'lancement'],
    requires: ['bitcoin', 'btc', '2009', 'genesis', 'genèse', 'genese', 'lancement', 'créé', 'cree'],
    excludes: ['prix', 'xof', 'fcfa', 'combien vaut'],
    priority: 8,
    answer: `Le réseau Bitcoin a été lancé le **3 janvier 2009** avec le bloc Genesis (bloc n°0), miné par Satoshi Nakamoto.

Chronologie clé :
• **Octobre 2008** — publication du white paper
• **3 janvier 2009** — premier bloc miné (message gravé : *The Times 03/Jan/2009 Chancellor on brink of second bailout for banks*)
• **12 janvier 2009** — première transaction Bitcoin (Satoshi → Hal Finney)
• **22 mai 2010** — Bitcoin Pizza Day (10 000 BTC pour 2 pizzas)

En 2009-2010, 1 BTC valait quelques centimes. Le réseau était encore expérimental.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Histoire du Bitcoin en français' },
    ],
  },
  {
    id: 'bitcoin-pizza-day',
    triggers: ['pizza', 'pizza day', '10 000', '10000', 'deux pizzas', 'laszlo'],
    requires: ['bitcoin', 'btc', 'pizza'],
    excludes: ['prix actuel', 'xof', 'fcfa'],
    priority: 9,
    answer: `Le **Bitcoin Pizza Day** est célébré chaque **22 mai**. En 2010, Laszlo Hanyecz a payé **10 000 BTC** pour deux pizzas — la première transaction réelle de biens contre Bitcoin.

Cette anecdote illustre à quel point le Bitcoin a évolué : ces 10 000 BTC représenteraient aujourd'hui une fortune, mais à l'époque c'était un test réussi du système de paiement peer-to-peer.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Anecdotes historiques Bitcoin' },
    ],
  },

  // ─── Prix historiques (pas le cours en temps réel) ──────────────────────
  {
    id: 'btc-high-2015',
    triggers: ['plus haut', 'plus bas', 'record', 'maximum', 'ath', 'pic', 'sommet', '2015'],
    requires: ['bitcoin', 'btc', '2015'],
    excludes: ['xof', 'fcfa', 'ngn', 'ghs', 'actuel', 'actuellement', "aujourd'hui", 'aujourdhui', 'maintenant', 'en ce moment', 'convertir'],
    priority: 15,
    answer: `En **2015**, le Bitcoin a connu une année de consolidation après le bear market de 2014.

**Pic de 2015** : environ **504 USD** (4 novembre 2015, selon les données de marché agrégées).

Contexte :
• Début 2015 : BTC autour de **170-200 USD**
• L'année 2015 a été marquée par la croissance de l'écosystème (plus de wallets, exchanges, couverture médiatique)
• Le halving de 2016 approchait, suscitant de l'intérêt

Pour le **cours actuel** en FCFA ou USD, demandez-moi le prix du BTC — je consulte les données en temps réel.`,
    sources: [
      { name: 'CoinGecko', url: 'https://www.coingecko.com/fr/pieces/bitcoin/historique', description: 'Historique des prix Bitcoin' },
      { name: 'Plan B', url: 'https://planb.network', description: 'Comprendre les cycles de marché' },
    ],
  },
  {
    id: 'btc-high-2017',
    triggers: ['plus haut', 'record', 'maximum', 'ath', 'pic', '2017'],
    requires: ['bitcoin', 'btc', '2017'],
    excludes: ['xof', 'fcfa', 'actuel', "aujourd'hui", 'maintenant'],
    priority: 14,
    answer: `En **2017**, le Bitcoin a connu sa première grande bulle médiatique.

**Pic de 2017** : environ **19 800 USD** (mi-décembre 2017).

L'année est passée de ~1 000 USD en janvier à près de 20 000 USD en décembre, avant une correction brutale en 2018. Cette période a popularisé le terme « crypto » auprès du grand public.`,
    sources: [
      { name: 'CoinGecko', url: 'https://www.coingecko.com/fr/pieces/bitcoin/historique', description: 'Historique des prix' },
    ],
  },
  {
    id: 'btc-high-2021',
    triggers: ['plus haut', 'record', 'maximum', 'ath', 'pic', '2021'],
    requires: ['bitcoin', 'btc', '2021'],
    excludes: ['xof', 'fcfa', 'actuel', "aujourd'hui", 'maintenant'],
    priority: 14,
    answer: `En **2021**, le Bitcoin a atteint son plus haut historique (ATH) de l'époque.

**Pic de 2021** : environ **69 000 USD** (10 novembre 2021).

Cette année a vu l'adoption institutionnelle (ETF, entreprises au bilan), mais aussi une forte volatilité et un bear market qui a suivi en 2022.`,
    sources: [
      { name: 'CoinGecko', url: 'https://www.coingecko.com/fr/pieces/bitcoin/historique', description: 'Historique ATH Bitcoin' },
    ],
  },
  {
    id: 'bitcoin-price-history',
    triggers: ['historique', 'histoire des prix', 'évolution', 'evolution', 'depuis 2009', 'timeline', 'chronologie des prix', 'cycles'],
    requires: ['bitcoin', 'btc', 'prix', 'historique', 'évolution', 'evolution', 'cycle'],
    excludes: ['xof', 'fcfa', 'ngn', 'actuel', "aujourd'hui", 'maintenant', 'convertir', 'combien vaut'],
    priority: 7,
    answer: `Voici une **timeline simplifiée** des grandes phases de prix du Bitcoin :

• **2009-2010** — quasi nul (expérimentation)
• **2011** — premier pic ~32 USD, puis crash
• **2013** — pic ~1 150 USD
• **2015** — pic annuel ~504 USD
• **2017** — pic ~19 800 USD
• **2021** — ATH ~69 000 USD
• **2024** — nouveau ATH au-dessus de 70 000 USD

Le Bitcoin est **très volatil** : des baisses de 50-80 % ont eu lieu plusieurs fois entre les cycles. Pour le cours **actuel**, je peux interroger les données live.`,
    sources: [
      { name: 'CoinGecko', url: 'https://www.coingecko.com/fr/pieces/bitcoin/historique', description: 'Graphique historique complet' },
      { name: 'Plan B', url: 'https://planb.network', description: 'Cycles et psychologie de marché' },
    ],
  },

  // ─── Blockchain & éducation ───────────────────────────────────────────
  {
    id: 'learn-blockchain',
    triggers: ['apprendre', 'formation', 'étudier', 'etudier', 'cours', 'école', 'ecole', 'université', 'universite', 'ressource', 'où', 'ou', 'comment apprendre', 'débuter', 'debuter', 'initiation'],
    requires: ['blockchain', 'block chain', 'chaîne de blocs', 'chaine de blocs'],
    excludes: ['prix', 'combien', 'arnaque', 'acheter'],
    priority: 11,
    answer: `Pour **apprendre la blockchain** de façon structurée :

**Ressources francophones recommandées :**
• **Plan B** — parcours Bitcoin et blockchain en français, adapté aux débutants
• **Bitcoin Benin** — ateliers et communauté en Afrique de l'Ouest
• **Bitcoin Kids** — initiation ludique pour jeunes et nouveaux arrivants

**Parcours conseillé :**
1. Comprendre ce qu'est un registre distribué (blockchain)
2. Voir comment Bitcoin utilise la blockchain
3. Explorer les wallets et la sécurité des clés
4. Découvrir Lightning Network pour les paiements

**En ligne (gratuit) :**
• Cours introductifs sur les sites des communautés Bitcoin francophones
• Documentation open source (bitcoin.org, developer.bitcoin.org)

Progressez à votre rythme et pratiquez avec de **très petits montants** au début.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Formation blockchain & Bitcoin FR' },
      { name: 'Bitcoin Benin', url: 'https://bitcoinbenin.com', description: 'Ateliers blockchain au Bénin' },
      { name: 'Bitcoin Kids', url: 'https://bitcoinkids.africa', description: 'Initiation blockchain pour débutants' },
    ],
  },
  {
    id: 'what-is-blockchain',
    triggers: ['c\'est quoi', "c'est quoi", 'qu\'est-ce', "qu'est-ce", 'définition', 'definition', 'expliquer', 'explication', 'comment ça marche', 'comment ca marche', 'fonctionne'],
    requires: ['blockchain', 'block chain', 'chaîne de blocs', 'chaine de blocs'],
    excludes: ['prix', 'acheter', 'arnaque'],
    priority: 8,
    answer: `Une **blockchain** (chaîne de blocs) est un **registre numérique partagé** où les transactions sont regroupées en blocs, reliés les uns aux autres par cryptographie.

Principes clés :
• **Décentralisé** — pas de serveur unique, des milliers de nœuds vérifient les données
• **Immuable** — très difficile de modifier l'historique passé
• **Transparent** — sur Bitcoin, toutes les transactions sont publiques
• **Sans tiers de confiance** — les participants suivent des règles du protocole

Le Bitcoin fut la **première** application réussie de la blockchain (2009). Depuis, d'autres blockchains existent (Ethereum, etc.) avec des objectifs différents.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Blockchain expliquée simplement' },
      { name: 'Bitcoin Kids', url: 'https://bitcoinkids.africa', description: 'Pédagogie blockchain' },
    ],
  },

  // ─── Ethereum, altcoins, stablecoins ────────────────────────────────────
  {
    id: 'what-is-ethereum',
    triggers: ['c\'est quoi', "c'est quoi", 'qu\'est-ce', "qu'est-ce", 'définition', 'definition', 'expliquer', 'ethereum', 'ether', 'eth', 'vitalik'],
    requires: ['ethereum', 'eth', 'ether'],
    excludes: ['prix', 'combien vaut', 'convertir'],
    priority: 7,
    answer: `**Ethereum (ETH)** est une blockchain programmable lancée en **2015** par Vitalik Buterin et d'autres cofondateurs.

Différences avec Bitcoin :
• Bitcoin = principalement **monnaie** et réserve de valeur
• Ethereum = **plateforme** pour smart contracts et applications décentralisées (DeFi, NFT…)

ETH sert à payer les frais de transaction (« gas ») sur le réseau. Comme tout actif crypto, il est **volatil** et comporte des risques.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Bitcoin vs altcoins' },
    ],
  },
  {
    id: 'stablecoins',
    triggers: ['stablecoin', 'usdt', 'usdc', 'tether', 'dollar numérique', 'dollar numerique', 'stable coin', 'monnaie stable'],
    requires: ['stablecoin', 'usdt', 'usdc', 'tether', 'stable'],
    excludes: [],
    priority: 6,
    answer: `Les **stablecoins** sont des cryptomonnaies indexées sur une valeur stable, souvent le **dollar US** (USDT, USDC).

**Usages en Afrique :**
• Protéger temporairement contre la volatilité du BTC
• Faciliter les échanges sur les plateformes
• Transferts internationaux (attention aux régulations)

**Risques :**
• Dépendance à l'émetteur (réserves, transparence)
• Risque réglementaire
• Ce n'est **pas** un compte bancaire garanti

Pour le cours actuel USDT/USDC en FCFA, je peux le vérifier en temps réel.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Comprendre les stablecoins' },
    ],
  },
  {
    id: 'altcoins-vs-bitcoin',
    triggers: ['altcoin', 'altcoins', 'shitcoin', 'ethereum vs', 'btc vs', 'différence', 'difference', 'comparer', 'meilleur que bitcoin'],
    requires: ['altcoin', 'altcoins', 'ethereum', 'eth', 'comparer', 'différence', 'difference', 'vs'],
    excludes: ['prix'],
    priority: 5,
    answer: `Les **altcoins** sont toutes les cryptomonnaies autres que le Bitcoin.

**Bitcoin (BTC)** :
• Le plus ancien, le plus décentralisé, le plus liquide
• Politique monétaire fixe (21 millions)
• Souvent considéré comme « or numérique »

**Altcoins (ETH, SOL, etc.)** :
• Objectifs variés (smart contracts, vitesse, privacy…)
• Généralement **plus risqués** et plus volatils
• Beaucoup disparaissent après quelques années

Conseil SORAYA : maîtrisez **Bitcoin d'abord**, puis explorez les altcoins avec prudence et seulement ce que vous pouvez perdre.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Bitcoin d\'abord — philosophie' },
    ],
  },

  // ─── Technique : mining, halving, PoW, PoS ────────────────────────────
  {
    id: 'mining-explained',
    triggers: ['minage', 'miner', 'mining', 'mineur', 'mineurs', 'asic', 'hash', 'hashrate'],
    requires: ['minage', 'miner', 'mining', 'mineur', 'mineurs', 'asic'],
    excludes: ['prix'],
    priority: 6,
    answer: `Le **minage Bitcoin** consiste à valider des transactions et à les inscrire dans la blockchain en résolvant des calculs cryptographiques (preuve de travail / **Proof of Work**).

Points clés :
• Les mineurs sont récompensés en **BTC** (bloc + frais de transaction)
• Nécessite du matériel spécialisé (**ASIC**) et beaucoup d'électricité
• Vous **n'avez pas besoin** de miner pour posséder ou utiliser du Bitcoin
• Le minage sécurise le réseau — plus il y a de puissance de calcul, plus le réseau est résistant

En Afrique, le minage industriel est rare ; la plupart des utilisateurs **achètent** du BTC plutôt que de miner.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Minage Bitcoin expliqué' },
    ],
  },
  {
    id: 'halving',
    triggers: ['halving', 'halvening', 'diviser par deux', 'récompense', 'recompense', 'bloc réduit', 'supply'],
    requires: ['halving', 'halvening', 'bitcoin', 'btc'],
    excludes: [],
    priority: 8,
    answer: `Le **halving** Bitcoin réduit de moitié la récompense des mineurs environ **tous les 4 ans** (tous les 210 000 blocs).

Historique :
• 2012 → 25 BTC/bloc
• 2016 → 12,5 BTC/bloc
• 2020 → 6,25 BTC/bloc
• **2024** → 3,125 BTC/bloc

Effet : l'émission de nouveaux BTC ralentit, renforçant la **rareté** programmée (21 millions max). Les halvings sont souvent associés aux cycles de marché, mais **aucune hausse n'est garantie**.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Halving et cycles Bitcoin' },
    ],
  },
  {
    id: 'proof-of-work-stake',
    triggers: ['proof of work', 'proof of stake', 'pow', 'pos', 'preuve de travail', 'preuve d\'enjeu', 'preuve denjeu', 'consensus', 'validateur'],
    requires: ['proof', 'pow', 'pos', 'travail', 'stake', 'enjeu', 'consensus', 'validateur'],
    excludes: ['prix'],
    priority: 5,
    answer: `Deux grands modèles de **consensus** blockchain :

**Proof of Work (PoW)** — utilisé par Bitcoin :
• Les mineurs dépensent de l'énergie pour sécuriser le réseau
• Très robuste et éprouvé depuis 2009

**Proof of Stake (PoS)** — utilisé par Ethereum (depuis 2022) et d'autres :
• Des validateurs bloquent des tokens en garantie
• Moins énergivore, mais modèle différent en termes de décentralisation

Bitcoin reste sur le **PoW** par choix de sécurité et de neutralité.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'PoW vs PoS' },
    ],
  },

  // ─── DeFi, NFT ──────────────────────────────────────────────────────────
  {
    id: 'defi-basics',
    triggers: ['defi', 'de fi', 'finance décentralisée', 'finance decentralisee', 'yield', 'liquidity', 'liquidity pool', 'staking'],
    requires: ['defi', 'finance décentralisée', 'finance decentralisee', 'yield', 'staking', 'liquidity'],
    excludes: ['arnaque'],
    priority: 5,
    answer: `La **DeFi** (finance décentralisée) regroupe des services financiers (prêt, échange, épargne) sur blockchain **sans banque traditionnelle**.

**Risques majeurs :**
• Smart contracts bugués (hacks, pertes totales)
• Rendements « trop beaux » souvent insoutenables
• Régulation évolutive

Pour la majorité des utilisateurs en Afrique, **maîtriser Bitcoin et la sécurité des wallets** avant la DeFi est fortement recommandé.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'DeFi — opportunités et risques' },
    ],
  },
  {
    id: 'nft-basics',
    triggers: ['nft', 'nfts', 'token non fongible', 'jpeg', 'opensea', 'collection'],
    requires: ['nft', 'nfts', 'non fongible'],
    excludes: [],
    priority: 4,
    answer: `Un **NFT** (Non-Fungible Token) est un certificat numérique unique sur une blockchain, souvent utilisé pour l'art, les jeux ou les collectibles.

À savoir :
• La valeur est **spéculative** et très volatile
• Frais de transaction parfois élevés
• Nombreuses arnaques et projets abandonnés

Les NFT ne sont **pas** du Bitcoin. Pour un premier contact avec la crypto, Bitcoin et la sécurité passent avant tout.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'NFT et crypto — décryptage' },
    ],
  },

  // ─── Afrique : régulation, mobile money, envois ───────────────────────
  {
    id: 'crypto-africa-regulation',
    triggers: ['régulation', 'regulation', 'légal', 'legal', 'illégal', 'illegal', 'loi', 'lois', 'gouvernement', 'banque centrale', 'bceao', 'beac', 'autorité'],
    requires: ['afrique', 'bénin', 'benin', 'côte', 'ivoire', 'senegal', 'sénégal', 'nigeria', 'ghana', 'cameroun', 'fcfa', 'xof', 'xaf', 'régulation', 'regulation', 'légal', 'legal'],
    excludes: ['prix'],
    priority: 7,
    answer: `La **régulation crypto en Afrique** varie fortement selon les pays — le cadre évolue rapidement.

**Points généraux :**
• Plusieurs pays francophones (zone UEMOA/CEMAC) ont renforcé la surveillance via les banques centrales
• Le Bitcoin lui-même n'est en général **pas « interdit »** partout, mais les **exchanges** et le marketing crypto peuvent être encadrés
• Restez informé des règles **locales** avant d'investir ou d'opérer commercialement

**Conseil SORAYA :**
• Utilisez des plateformes transparentes
• Conservez vos preuves de transaction
• Consultez un professionnel juridique/fiscal local pour les montants importants

Cette réponse est **informationnelle**, pas un avis juridique.`,
    sources: [
      { name: 'Bitcoin Benin', url: 'https://bitcoinbenin.com', description: 'Actualité réglementaire locale' },
      { name: 'Plan B', url: 'https://planb.network', description: 'Contexte Bitcoin en Afrique' },
    ],
  },
  {
    id: 'remittance-africa',
    triggers: ['envoi', 'envoyer', 'transfert', 'remittance', 'diaspora', 'money transfer', 'western union', 'mobile money', 'mtn', 'orange money', 'wave', 'moov'],
    requires: ['bitcoin', 'btc', 'crypto', 'transfert', 'envoi', 'diaspora', 'mobile money', 'fcfa'],
    excludes: ['prix', 'arnaque'],
    priority: 6,
    answer: `Le Bitcoin et Lightning peuvent servir aux **transferts internationaux**, mais ce n'est pas toujours le canal le plus simple.

**Avantages potentiels :**
• Fonctionne 24h/24, sans fermeture bancaire
• Lightning : frais faibles pour petits montants
• Utile si l'accès bancaire est limité

**Points d'attention :**
• Volatilité du BTC entre l'envoi et la réception
• Conversion FCFA ↔ BTC sur une plateforme fiable
• Réglementation et déclaration selon votre pays

**Mobile Money + crypto** : certaines plateformes (ex. Izichange) permettent de relier paiements locaux et crypto.`,
    sources: [
      { name: 'Izichange', url: 'https://izichange.com', description: 'Échanges crypto / Mobile Money' },
      { name: 'Plan B', url: 'https://planb.network', description: 'Bitcoin pour les transferts' },
    ],
  },
  {
    id: 'mobile-money-crypto',
    triggers: ['mobile money', 'mtn', 'orange money', 'moov money', 'wave', 'mpesa', 'airtel money'],
    requires: ['mobile money', 'mtn', 'orange', 'moov', 'wave', 'mpesa', 'airtel'],
    excludes: ['arnaque'],
    priority: 6,
    answer: `En Afrique, le **Mobile Money** (MTN, Orange, Moov, Wave…) est souvent la porte d'entrée vers la crypto via des plateformes locales.

**Bonnes pratiques :**
• Utilisez des plateformes connues avec support client réactif
• Vérifiez les frais Mobile Money + frais plateforme
• Ne communiquez jamais vos codes OTP ou seed phrase
• Commencez avec de petits montants test

**Izichange** est une option courante pour relier Mobile Money et crypto en Afrique de l'Ouest.`,
    sources: [
      { name: 'Izichange', url: 'https://izichange.com', description: 'Crypto & Mobile Money' },
      { name: 'Bitcoin Benin', url: 'https://bitcoinbenin.com', description: 'Retours d\'expérience terrain' },
    ],
  },

  // ─── Stratégie & marché ─────────────────────────────────────────────────
  {
    id: 'dca-strategy',
    triggers: ['dca', 'dollar cost', 'épargne', 'epargne', 'régulier', 'regulier', 'chaque mois', 'mensuel', 'accumuler', 'stacking', 'stack sats'],
    requires: ['bitcoin', 'btc', 'dca', 'épargne', 'epargne', 'mensuel', 'accumuler', 'stack'],
    excludes: ['prix exact', 'arnaque'],
    priority: 5,
    answer: `Le **DCA** (Dollar Cost Averaging) consiste à acheter du Bitcoin **régulièrement** (ex. chaque mois) pour lisser le prix d'entrée dans le temps.

**Avantages :**
• Réduit le stress du « timing » du marché
• Discipline d'épargne
• Adapté aux salaires mensuels en FCFA

**Règles :**
• N'investissez que ce que vous pouvez perdre
• Gardez vos BTC sur un wallet que **vous** contrôlez à long terme
• Le DCA ne garantit **pas** un profit — le marché reste volatile`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Stratégie d\'accumulation Bitcoin' },
    ],
  },
  {
    id: 'hodl-meaning',
    triggers: ['hodl', 'hold', 'garder', 'conserver', 'long terme', 'long-terme', 'épargner', 'epargner'],
    requires: ['hodl', 'hold', 'bitcoin', 'btc', 'long terme', 'conserver'],
    excludes: ['prix'],
    priority: 4,
    answer: `**HODL** est un mème devenu stratégie : « Hold On for Dear Life » — conserver ses Bitcoin sur le **long terme** malgré la volatilité.

L'idée : le Bitcoin a une offre limitée (21 M) et une adoption croissante ; les détenteurs long terme historiques ont été récompensés, mais **le passé ne garantit pas l'avenir**.

HODL ≠ négliger la sécurité : un hardware wallet et une seed phrase sauvegardée restent essentiels.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Vision long terme Bitcoin' },
    ],
  },
  {
    id: 'bull-bear-market',
    triggers: ['bull', 'bear', 'haussier', 'baissier', 'bear market', 'bull market', 'crise', 'bulle', 'crash', 'correction'],
    requires: ['bull', 'bear', 'haussier', 'baissier', 'bulle', 'crash', 'marché', 'marche'],
    excludes: [],
    priority: 4,
    answer: `**Marché haussier (bull)** : tendance générale à la hausse, euphorie, médias positifs.

**Marché baissier (bear)** : baisse prolongée (souvent -50 % à -80 % depuis le pic), pessimisme, « Bitcoin est mort » dans les titres.

Le Bitcoin a connu **plusieurs cycles** de 3-4 ans. C'est normal et attendu — ne investissez que ce que vous pouvez conserver pendant une longue période sans paniquer.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Cycles de marché Bitcoin' },
    ],
  },

  // ─── Wallets & sécurité (compléments) ───────────────────────────────────
  {
    id: 'hot-vs-cold-wallet',
    triggers: ['hot wallet', 'cold wallet', 'hardware', 'ledger', 'trezor', 'clé usb', 'cle usb', 'froid', 'chaud', 'custodial', 'non-custodial'],
    requires: ['wallet', 'portefeuille', 'hot', 'cold', 'hardware', 'ledger', 'trezor', 'custodial'],
    excludes: ['prix'],
    priority: 6,
    answer: `**Hot wallet** (chaud) : connecté à Internet — apps mobile, desktop. Pratique au quotidien, plus exposé aux hacks.

**Cold wallet** (froid) : clés hors ligne — **hardware wallet** (Ledger, Trezor…). Recommandé pour les montants importants.

**Custodial** : l'exchange garde vos clés (« pas vos clés, pas vos coins »).

**Non-custodial** : vous contrôlez votre seed phrase — modèle recommandé par SORAYA pour la souveraineté financière.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Types de wallets' },
      { name: 'Bitcoin Benin', url: 'https://bitcoinbenin.com', description: 'Ateliers wallets' },
    ],
  },
  {
    id: 'seed-phrase-recovery',
    triggers: ['seed', 'phrase', '24 mots', '12 mots', 'mnémonique', 'mnemonique', 'récupération', 'recuperation', 'perdu', 'perdue', 'oublié', 'oublie'],
    requires: ['seed', 'phrase', 'mnémonique', 'mnemonique', 'mots', 'récupération', 'recuperation', 'perdu', 'oublié'],
    excludes: ['arnaque'],
    priority: 9,
    answer: `Votre **seed phrase** (12 ou 24 mots) est la **clé maîtresse** de vos fonds.

**Règles absolues :**
• Notez-la sur **papier** (ou métal), jamais en screenshot/cloud
• **Ne la partagez jamais** — aucun support légitime ne la demande
• Si vous la perdez : **impossible** de récupérer les fonds (décentralisation = responsabilité personnelle)
• Si quelqu'un l'obtient : vos BTC peuvent être volés instantanément

Testez la restauration sur un petit montant avant de transférer des sommes importantes.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Sauvegarde seed phrase' },
    ],
  },
  {
    id: '2fa-basics',
    triggers: ['2fa', 'double authentification', 'authentification', 'google authenticator', 'authy', 'otp', 'code'],
    requires: ['2fa', 'authentification', 'otp', 'authenticator'],
    excludes: ['seed', 'arnaque'],
    priority: 5,
    answer: `La **double authentification (2FA)** ajoute une couche de sécurité à vos comptes exchange.

**Recommandations :**
• Préférez une app (**Google Authenticator**, **Authy**) plutôt que le SMS (SIM swap)
• Sauvegardez les codes de récupération 2FA en lieu sûr
• La 2FA protège l'**accès au compte**, pas vos clés on-chain — pour cela, sécurisez la seed phrase`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Sécurité des comptes' },
    ],
  },

  // ─── CBDC, impôts, P2P ──────────────────────────────────────────────────
  {
    id: 'cbdc-vs-bitcoin',
    triggers: ['cbdc', 'monnaie numérique banque', 'monnaie digitale', 'eadc', 'digital franc', 'franc numérique', 'bceao digital'],
    requires: ['cbdc', 'monnaie numérique', 'monnaie digitale', 'eadc', 'digital franc', 'bceao'],
    excludes: [],
    priority: 6,
    answer: `Une **CBDC** (monnaie numérique de banque centrale) est émise et contrôlée par l'État — contrairement au Bitcoin.

| | Bitcoin | CBDC |
|---|---------|------|
| Émetteur | Protocole décentralisé | Banque centrale |
| Offre | 21 M max | Décision politique |
| Confidentialité | Pseudonyme public | Souvent traçable |

Le Bitcoin et une CBDC ne sont **pas** la même chose. SORAYA éduque sur Bitcoin ; pour la CBDC, suivez les communications officielles de votre banque centrale.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Bitcoin vs monnaies d\'État' },
    ],
  },
  {
    id: 'crypto-tax-africa',
    triggers: ['impôt', 'impot', 'taxe', 'taxation', 'fiscal', 'déclarer', 'declarer', 'dgi', 'administration fiscale'],
    requires: ['impôt', 'impot', 'taxe', 'fiscal', 'déclarer', 'declarer', 'crypto', 'bitcoin', 'btc'],
    excludes: ['prix'],
    priority: 5,
    answer: `La **fiscalité crypto** dépend de votre pays. En Afrique francophone, les règles évoluent et ne sont pas uniformes.

**Bonnes pratiques générales :**
• Conservez l'historique de vos achats/ventes
• Notez dates, montants FCFA, frais
• Consultez un **expert-comptable local** pour les montants significatifs

SORAYA ne fournit pas de conseil fiscal — cette information est éducative.`,
    sources: [
      { name: 'Bitcoin Benin', url: 'https://bitcoinbenin.com', description: 'Discussions fiscalité locale' },
    ],
  },
  {
    id: 'p2p-trading',
    triggers: ['p2p', 'peer to peer', 'peer-to-peer', 'entre particuliers', 'localbitcoins', 'binance p2p', 'noones'],
    requires: ['p2p', 'peer', 'particuliers', 'personne à personne'],
    excludes: ['arnaque'],
    priority: 5,
    answer: `Le trading **P2P** (peer-to-peer) connecte acheteurs et vendeurs directement, souvent via une plateforme intermédiaire.

**Avantages :** paiements locaux (Mobile Money), flexibilité

**Risques :**
• Arnaques (faux paiements, chargebacks)
• Comptes bloqués si règles non respectées
• Toujours utiliser l'**escrow** de la plateforme

Vérifiez la réputation du vendeur, commencez petit, et ne sortez jamais de la plateforme pour un « meilleur taux ».`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Sécurité P2P' },
    ],
  },

  // ─── Communauté & inclusion ─────────────────────────────────────────────
  {
    id: 'bitcoin-community-africa',
    triggers: ['communauté', 'communaute', 'rencontrer', 'meetup', 'groupe', 'telegram groupe', 'événement', 'evenement', 'conférence', 'conference'],
    requires: ['bitcoin', 'btc', 'communauté', 'communaute', 'meetup', 'afrique', 'bénin', 'benin'],
    excludes: ['prix'],
    priority: 6,
    answer: `Rejoindre une **communauté Bitcoin locale** accélère votre apprentissage et réduit les arnaques.

**En Afrique francophone :**
• **Bitcoin Benin** — meetups, ateliers, entraide au Bénin
• **Plan B** — réseau francophone, formations et événements
• **Bitcoin Kids** — sensibilisation jeunesse et éducation

Conseil : privilégiez les communautés qui enseignent la **sécurité** et la **souveraineté** (vos clés), pas les promesses de gains rapides.`,
    sources: [
      { name: 'Bitcoin Benin', url: 'https://bitcoinbenin.com', description: 'Communauté Bitcoin Bénin' },
      { name: 'Plan B', url: 'https://planb.network', description: 'Réseau Bitcoin francophone' },
      { name: 'Bitcoin Kids', url: 'https://bitcoinkids.africa', description: 'Éducation jeunesse' },
    ],
  },
  {
    id: 'women-in-bitcoin',
    triggers: ['femme', 'femmes', 'fille', 'inclusion', 'genre', 'women', 'woman'],
    requires: ['bitcoin', 'btc', 'crypto', 'femme', 'femmes', 'inclusion', 'women'],
    excludes: ['prix'],
    priority: 4,
    answer: `L'inclusion des **femmes** dans l'écosystème Bitcoin progresse en Afrique grâce à des initiatives dédiées.

**Pourquoi c'est important :**
• Autonomie financière indépendante des banques traditionnelles
• Accès aux transferts et à l'épargne via mobile
• Réduction de l'écart financier

**Ressources :** rejoignez les meetups locaux (Bitcoin Benin, Plan B) qui organisent souvent des sessions ouvertes à tous.`,
    sources: [
      { name: 'Bitcoin Benin', url: 'https://bitcoinbenin.com', description: 'Inclusion financière' },
      { name: 'Bitcoin Kids', url: 'https://bitcoinkids.africa', description: 'Éducation accessible à tous' },
    ],
  },

  // ─── FAQ diverses ───────────────────────────────────────────────────────
  {
    id: 'bitcoin-anonymous',
    triggers: ['anonyme', 'anonymat', 'privé', 'prive', 'confidentiel', 'traçable', 'tracable', 'privacy'],
    requires: ['bitcoin', 'btc', 'anonyme', 'anonymat', 'privé', 'prive', 'traçable', 'tracable'],
    excludes: ['prix'],
    priority: 5,
    answer: `Le Bitcoin est **pseudonyme**, pas anonyme.

• Les adresses ne révèlent pas votre nom directement
• Mais toutes les transactions sont **publiques** sur la blockchain
• Les exchanges régulés font du KYC (identité liée à vos achats)

Pour plus de confidentialité, informez-vous sur les bonnes pratiques (nouvelles adresses, CoinJoin — sujet avancé). En Afrique, respectez aussi les lois locales sur la déclaration.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Confidentialité Bitcoin' },
    ],
  },
  {
    id: 'bitcoin-energy',
    triggers: ['énergie', 'energie', 'environnement', 'écologie', 'ecologie', 'carbone', 'pollution', 'climat', 'électricité', 'electricite'],
    requires: ['bitcoin', 'btc', 'énergie', 'energie', 'environnement', 'écologie', 'ecologie', 'carbone', 'climat'],
    excludes: ['prix'],
    priority: 5,
    answer: `Le minage Bitcoin consomme de l'**électricité** — c'est le coût de la sécurité du réseau (Proof of Work).

**Nuances importantes :**
• Une part croissante utilise des **énergies renouvelables** ou excédentaires
• Le minage peut stabiliser des réseaux électriques (énergie autrement perdue)
• D'autres secteurs (banque traditionnelle, or) ont aussi une empreinte énergétique

C'est un débat actif ; SORAYA encourage une lecture **nuancée** des sources spécialisées.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Bitcoin et énergie' },
    ],
  },
  {
    id: 'lost-bitcoin',
    triggers: ['perdu', 'perdus', 'perdue', 'perdre', 'millions perdus', 'bitcoin perdu', 'cle perdue'],
    requires: ['perdu', 'perdus', 'perdue', 'bitcoin', 'btc', 'clé', 'cle'],
    excludes: ['seed phrase', 'seed'],
    priority: 4,
    answer: `On estime que **plusieurs millions de BTC** sont perdus (clés oubliées, disques jetés, décès sans transmission de la seed).

Cela illustre :
• L'importance de sauvegarder votre **seed phrase**
• La **rareté réelle** du BTC en circulation (renforce la thèse de rareté)
• Pourquoi « pas vos clés, pas vos coins »

Planifiez la transmission à vos proches (héritage numérique) si vous détenez des montants importants.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Sécurité et conservation' },
    ],
  },
  {
    id: 'satoshi-unit',
    triggers: ['satoshi', 'sats', 'sat', 'plus petite unité', 'plus petite unite', 'divisible', 'fraction'],
    requires: ['satoshi', 'sats', 'sat', 'unité', 'unite', 'divisible', 'fraction'],
    excludes: ['nakamoto', 'fondateur', 'créateur', 'createur'],
    priority: 6,
    answer: `Le **satoshi** (sat) est la plus petite unité de Bitcoin : **1 BTC = 100 000 000 satoshis**.

Exemples :
• 50 000 sats ≈ 0,0005 BTC
• Permet d'acheter des **fractions** de BTC même avec un petit budget FCFA

Expression courante : « stack des sats » = accumuler des satoshis régulièrement.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Unités Bitcoin' },
    ],
  },
  {
    id: 'transaction-fees',
    triggers: ['frais', 'fee', 'fees', 'commission', 'coût transaction', 'cout transaction', 'gas', 'réseau congestionné'],
    requires: ['frais', 'fee', 'fees', 'commission', 'transaction', 'bitcoin', 'btc'],
    excludes: ['izichange', 'plateforme', 'exchange'],
    priority: 5,
    answer: `Les **frais de transaction Bitcoin** rémunèrent les mineurs et varient selon la congestion du réseau.

• Période calme : frais très bas (quelques centimes USD)
• Forte activité : frais plus élevés
• **Lightning Network** : frais quasi nuls pour les petits paiements

Sur une plateforme d'achat (Izichange, etc.), des **frais supplémentaires** s'ajoutent — vérifiez toujours le taux final.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Frais réseau Bitcoin' },
    ],
  },
  {
    id: 'confirmations',
    triggers: ['confirmation', 'confirmations', 'bloc', 'combien de confirmations', 'attendre', 'validée', 'validee'],
    requires: ['confirmation', 'confirmations', 'bloc', 'bitcoin', 'btc', 'transaction'],
    excludes: ['prix'],
    priority: 5,
    answer: `Une transaction Bitcoin est **confirmée** quand elle est incluse dans un bloc, puis renforcée par les blocs suivants.

**Règle pratique :**
• **1 confirmation** — souvent suffisant pour petits montants
• **3-6 confirmations** — standard pour montants moyens
• Plus il y a de confirmations, plus la transaction est **irréversible**

Les exchanges attendent souvent 1 à 3 confirmations avant de créditer votre dépôt.`,
    sources: [
      { name: 'Plan B', url: 'https://planb.network', description: 'Confirmations blockchain' },
    ],
  },
];
