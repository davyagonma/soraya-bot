# SORAYA API

> **Votre assistant Bitcoin & Crypto de confiance pour l'Afrique.**

API REST intelligente avec agent IA (OpenAI Function Calling) servant de backend unique pour Telegram, WhatsApp, Web et Mobile.

## Fonctionnalités

- **Agent IA conversationnel** via `POST /api/chat` — l'utilisateur parle en langage naturel
- **Function Calling** — OpenAI choisit automatiquement les outils (prix, conversion, news, scam, éducation, alertes)
- **Modules métier** — Crypto, Conversion, Éducation, News, Scam, Sécurité, Alertes
- **Multi-canal** — Web, Telegram (webhook), WhatsApp (préparé)
- **Auth JWT** avec refresh tokens et rôles (ADMIN/USER)
- **Cache Redis** pour prix, news et conversions
- **Cron jobs** — mise à jour prix, actualités, maintenance

## Stack

Node.js 22+ · Express · TypeScript · Prisma · PostgreSQL · Redis · OpenAI · Zod · Winston · Swagger · Jest

## Installation

```bash
git clone <repo>
cd soraya
npm install
cp .env.example .env
# Éditer .env avec vos clés API
```

## Docker (recommandé)

```bash
docker-compose up -d
```

Démarre PostgreSQL, Redis et l'API sur le port 3000.

## Lancement local

```bash
# Démarrer PostgreSQL et Redis (via Docker ou localement)
docker-compose up -d postgres redis

# Migrations
npm run prisma:migrate

# Seed
npm run prisma:seed

# Dev
npm run dev
```

L'API est disponible sur `http://localhost:3000`  
Documentation Swagger : `http://localhost:3000/api/docs`

## Variables d'environnement


| Variable             | Description                             |
| -------------------- | --------------------------------------- |
| `PORT`               | Port du serveur (défaut: 3000)          |
| `DATABASE_URL`       | URL PostgreSQL                          |
| `JWT_SECRET`         | Secret JWT access token                 |
| `JWT_REFRESH_SECRET` | Secret JWT refresh token                |
| `OPENAI_API_KEY`     | Clé OpenAI (optionnel — mock si absent) |
| `COINGECKO_API_KEY`  | Clé CoinGecko (optionnel)               |
| `NEWS_API_KEY`       | Clé NewsAPI (optionnel — RSS fallback)  |
| `REDIS_URL`          | URL Redis                               |
| `TELEGRAM_TOKEN`     | Token bot Telegram                      |
| `WHATSAPP_TOKEN`     | Token WhatsApp (préparé)                |
| `CHAT_MAX_HISTORY`   | Messages max en mémoire (défaut: 20)    |


## Architecture

```
src/
├── ai/
│   ├── orchestrator/   # AIOrchestrator — boucle Function Calling
│   ├── tools/          # Outils IA (CryptoTool, NewsTool, etc.)
│   ├── registry/       # ToolRegistry — enregistrement dynamique
│   ├── prompts/        # Prompt système SORAYA
│   └── memory/         # Mémoire conversationnelle
├── providers/          # OpenAI, CoinGecko, News, Exchange, Redis
├── services/           # Couche métier
├── repositories/       # Accès données (Prisma)
├── controllers/        # Contrôleurs HTTP
├── routes/             # Routes Express
├── middlewares/        # Auth, validation, rate limit, errors
├── validators/         # Schémas Zod
├── cron/               # Jobs planifiés
└── tests/              # Tests unitaires et intégration
```

### Flux IA

```
Utilisateur → POST /api/chat → ChatService → AIOrchestrator
                                                    │
                                    OpenAI (choisit les tools)
                                                    │
                                              ToolRegistry
                                                    │
                              CryptoTool / NewsTool / ScamTool / ...
```

L'ajout d'un nouvel outil ne nécessite que :

1. Créer une classe Tool dans `src/ai/tools/`
2. L'enregistrer dans `ALL_TOOLS`

## Endpoints principaux


| Méthode | Route                   | Description                          |
| ------- | ----------------------- | ------------------------------------ |
| POST    | `/api/chat`             | **Point d'entrée IA** (auth requise) |
| POST    | `/api/auth/register`    | Inscription                          |
| POST    | `/api/auth/login`       | Connexion                            |
| GET     | `/api/crypto/price`     | Prix crypto                          |
| GET     | `/api/convert`          | Conversion devises                   |
| GET     | `/api/education/topics` | Base de connaissances                |
| GET     | `/api/news`             | Actualités crypto                    |
| POST    | `/api/risk-analysis`    | Analyse arnaque                      |
| GET     | `/api/security/tips`    | Conseils sécurité                    |
| POST    | `/api/alerts`           | Créer alerte prix                    |
| POST    | `/api/telegram/webhook` | Webhook Telegram                     |
| GET     | `/api/health`           | Health check                         |


## Tests

```bash
npm test
```

Couverture minimale cible : 80%.

## Déploiement

```bash
npm run build
npm start
```

Ou via Docker :

```bash
docker-compose up --build
```

## Mode démo

Sans clés API, l'application démarre avec :

- **MockAIProvider** — réponses simulées avec Function Calling
- **MockCryptoProvider** — prix crypto fictifs
- **RSS/Mock News** — actualités de démonstration

Comptes démo : `demo@soraya.africa` / `user123456` et `admin@soraya.africa` / `admin123456`

## Licence

MIT