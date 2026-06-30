/**
 * @swagger
 * components:
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: demo@soraya.africa
 *         password:
 *           type: string
 *           example: user123456
 *     RegisterRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: nouveau@soraya.africa
 *         password:
 *           type: string
 *           minLength: 8
 *           example: monmotdepasse
 *         name:
 *           type: string
 *           example: Nouveau Utilisateur
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [USER, ADMIN]
 *             accessToken:
 *               type: string
 *               description: Copier dans le bouton Authorize (Bearer)
 *             refreshToken:
 *               type: string
 *     ChatRequest:
 *       type: object
 *       required: [message]
 *       properties:
 *         message:
 *           type: string
 *           example: Quel est le prix du BTC en XOF ?
 *         conversationId:
 *           type: string
 *           format: uuid
 *           description: Optionnel — utiliser l'ID seed pour continuer une conversation existante
 *           example: "00000000-0000-4000-8000-000000000001"
 *         channel:
 *           type: string
 *           enum: [web, telegram, whatsapp, mobile]
 *           example: web
 *     CreateAlertRequest:
 *       type: object
 *       required: [symbol, targetPrice, condition]
 *       properties:
 *         symbol:
 *           type: string
 *           example: BTC
 *         targetPrice:
 *           type: number
 *           example: 100000
 *         currency:
 *           type: string
 *           example: USD
 *         condition:
 *           type: string
 *           enum: [ABOVE, BELOW]
 *           example: ABOVE
 *     ScamAnalysisRequest:
 *       type: object
 *       required: [description]
 *       properties:
 *         description:
 *           type: string
 *           example: Investissement garanti 50% par mois sans risque — plateforme exclusive VIP
 *     TestData:
 *       type: object
 *       properties:
 *         hint:
 *           type: string
 *         accounts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string }
 *         conversationId:
 *           type: string
 *           format: uuid
 *         alertIds:
 *           type: array
 *           items: { type: string, format: uuid }
 *         steps:
 *           type: array
 *           items: { type: string }
 */

/**
 * @swagger
 * /dev/test-data:
 *   get:
 *     tags: [Dev]
 *     summary: Données de test (seed) — comptes, IDs, étapes
 *     description: |
 *       Retourne les identifiants créés par `npm run prisma:seed`.
 *       **Important pour /api/chat** : connectez-vous avec `demo@soraya.africa` puis utilisez le `conversationId` retourné ici.
 *     responses:
 *       200:
 *         description: Données de démo
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TestData'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Connexion
 *     description: |
 *       Utilisez le compte démo seed : **demo@soraya.africa** / **user123456**
 *
 *       Copiez `data.accessToken` dans le bouton **Authorize** (Bearer) pour tester les routes protégées.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             demo:
 *               summary: Compte démo (recommandé)
 *               value:
 *                 email: demo@soraya.africa
 *                 password: user123456
 *             admin:
 *               summary: Compte admin
 *               value:
 *                 email: admin@soraya.africa
 *                 password: admin123456
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Identifiants invalides
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Inscription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Rafraîchir le token d'accès
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token reçu lors du login
 *     responses:
 *       200:
 *         description: Nouveaux tokens
 */

/**
 * @swagger
 * /chat:
 *   post:
 *     tags: [Chat]
 *     summary: Envoyer un message à SORAYA
 *     description: |
 *       **Prérequis** : Authorize avec le JWT du compte **demo@soraya.africa**.
 *
 *       La conversation seed `00000000-0000-4000-8000-000000000001` appartient uniquement à ce compte.
 *       Sans `conversationId`, une nouvelle conversation est créée automatiquement.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *           examples:
 *             nouvelle:
 *               summary: Nouvelle conversation
 *               value:
 *                 message: Bonjour, explique-moi le Lightning Network
 *                 channel: web
 *             existante:
 *               summary: Continuer la conversation seed
 *               value:
 *                 message: Quel est le prix du BTC en XOF ?
 *                 conversationId: "00000000-0000-4000-8000-000000000001"
 *                 channel: web
 *     responses:
 *       200:
 *         description: Réponse de l'assistant
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Conversation introuvable (mauvais compte ou ID inexistant)
 */

/**
 * @swagger
 * /chat/conversations:
 *   get:
 *     tags: [Chat]
 *     summary: Lister mes conversations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des conversations
 */

/**
 * @swagger
 * /chat/conversations/{id}:
 *   get:
 *     tags: [Chat]
 *     summary: Détail d'une conversation avec messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "00000000-0000-4000-8000-000000000001"
 *     responses:
 *       200:
 *         description: Conversation avec historique
 *       404:
 *         description: Conversation introuvable
 */

/**
 * @swagger
 * /crypto/price:
 *   get:
 *     tags: [Crypto]
 *     summary: Prix d'une cryptomonnaie
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *           example: BTC
 *         description: "Symbole : BTC, ETH, USDT, BNB, SOL, DOGE"
 *       - in: query
 *         name: currencies
 *         required: false
 *         schema:
 *           type: string
 *           example: USD,XOF,EUR
 *         description: Devises séparées par des virgules
 *     responses:
 *       200:
 *         description: Prix actuel
 */

/**
 * @swagger
 * /crypto/top:
 *   get:
 *     tags: [Crypto]
 *     summary: Top cryptomonnaies par capitalisation
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           example: USD
 *     responses:
 *       200:
 *         description: Liste des cryptos
 */

/**
 * @swagger
 * /crypto/history:
 *   get:
 *     tags: [Crypto]
 *     summary: Historique de prix
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *           example: BTC
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           example: 30
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           example: USD
 *     responses:
 *       200:
 *         description: Historique
 */

/**
 * @swagger
 * /crypto/markets:
 *   get:
 *     tags: [Crypto]
 *     summary: Marchés des cryptos supportées
 *     parameters:
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           example: USD
 *     responses:
 *       200:
 *         description: Données de marché
 */

/**
 * @swagger
 * /convert:
 *   get:
 *     tags: [Conversion]
 *     summary: Convertir un montant entre devises
 *     parameters:
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: number
 *           example: 100000
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           example: XOF
 *         description: "Devise source : USD, EUR, XOF, XAF, NGN, GHS, BTC, ETH..."
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           example: BTC
 *     responses:
 *       200:
 *         description: Résultat de conversion
 */

/**
 * @swagger
 * /education/topics:
 *   get:
 *     tags: [Education]
 *     summary: Liste des sujets éducatifs
 *     responses:
 *       200:
 *         description: Topics disponibles
 */

/**
 * @swagger
 * /education/search:
 *   get:
 *     tags: [Education]
 *     summary: Rechercher dans la base de connaissances
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           example: bitcoin
 *     responses:
 *       200:
 *         description: Résultats de recherche
 */

/**
 * @swagger
 * /education/{slug}:
 *   get:
 *     tags: [Education]
 *     summary: Détail d'un sujet
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: bitcoin
 *     responses:
 *       200:
 *         description: Contenu du sujet
 */

/**
 * @swagger
 * /news:
 *   get:
 *     tags: [News]
 *     summary: Dernières actualités crypto
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Articles
 */

/**
 * @swagger
 * /risk-analysis:
 *   post:
 *     tags: [Scam]
 *     summary: Analyser un risque d'arnaque
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScamAnalysisRequest'
 *     responses:
 *       200:
 *         description: Score et recommandations
 */

/**
 * @swagger
 * /security/tips:
 *   get:
 *     tags: [Security]
 *     summary: Conseils de sécurité
 *     responses:
 *       200:
 *         description: Liste de conseils
 */

/**
 * @swagger
 * /security/phishing:
 *   get:
 *     tags: [Security]
 *     summary: Exemples de phishing
 *     responses:
 *       200:
 *         description: Exemples
 */

/**
 * @swagger
 * /security/scams:
 *   get:
 *     tags: [Security]
 *     summary: Arnaques courantes
 *     responses:
 *       200:
 *         description: Liste d'arnaques
 */

/**
 * @swagger
 * /alerts:
 *   post:
 *     tags: [Alerts]
 *     summary: Créer une alerte de prix
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAlertRequest'
 *     responses:
 *       201:
 *         description: Alerte créée
 *   get:
 *     tags: [Alerts]
 *     summary: Lister mes alertes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alertes actives
 */

/**
 * @swagger
 * /alerts/{id}:
 *   delete:
 *     tags: [Alerts]
 *     summary: Supprimer une alerte
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "00000000-0000-4000-8000-000000000010"
 *     responses:
 *       200:
 *         description: Alerte supprimée
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TelegramWebhookUpdate:
 *       type: object
 *       description: Payload envoyé par Telegram (simplifié pour les tests Swagger)
 *       properties:
 *         update_id:
 *           type: integer
 *           example: 123456789
 *         message:
 *           type: object
 *           required: [message_id, chat, text]
 *           properties:
 *             message_id:
 *               type: integer
 *               example: 42
 *             from:
 *               type: object
 *               properties:
 *                 id: { type: integer, example: 987654321 }
 *                 first_name: { type: string, example: Dave }
 *                 username: { type: string, example: dave_user }
 *             chat:
 *               type: object
 *               required: [id]
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Votre chat_id Telegram (obtenez-le via @userinfobot)
 *                   example: 123456789
 *                 type: { type: string, example: private }
 *             text:
 *               type: string
 *               example: Quel est le prix du BTC en XOF ?
 *             date:
 *               type: integer
 *               example: 1719696000
 */

/**
 * @swagger
 * /telegram/webhook:
 *   post:
 *     tags: [Telegram]
 *     summary: Webhook Telegram — reçoit les messages et répond dans le bot
 *     description: |
 *       **Utilisation réelle (Telegram)** :
 *       1. Créez un bot via @BotFather et mettez `TELEGRAM_TOKEN` dans `.env`
 *       2. Exposez l'API en HTTPS (ngrok, production)
 *       3. Enregistrez le webhook :
 *          ```
 *          curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<VOTRE_URL>/api/telegram/webhook"
 *          ```
 *       4. Écrivez directement au bot sur Telegram — la réponse arrive dans le chat
 *
 *       **Test Swagger** : utilisez l'exemple ci-dessous avec votre vrai `chat.id`
 *       (via @userinfobot). Si `TELEGRAM_TOKEN` est configuré, la réponse est aussi
 *       envoyée sur Telegram.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TelegramWebhookUpdate'
 *           examples:
 *             prixBtc:
 *               summary: Demande de prix BTC
 *               value:
 *                 update_id: 123456789
 *                 message:
 *                   message_id: 42
 *                   from:
 *                     id: 987654321
 *                     first_name: Demo
 *                   chat:
 *                     id: 123456789
 *                     type: private
 *                   text: Quel est le prix du BTC en XOF ?
 *                   date: 1719696000
 *             bonjour:
 *               summary: Salutation
 *               value:
 *                 update_id: 123456790
 *                 message:
 *                   message_id: 43
 *                   from:
 *                     id: 987654321
 *                     first_name: Demo
 *                   chat:
 *                     id: 123456789
 *                     type: private
 *                   text: Bonjour SORAYA
 *                   date: 1719696001
 *     responses:
 *       200:
 *         description: Message traité — réponse renvoyée au bot Telegram si token configuré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 reply:
 *                   type: string
 *                   description: Texte de la réponse SORAYA
 *                 conversationId:
 *                   type: string
 *                   format: uuid
 *                 toolsUsed:
 *                   type: array
 *                   items: { type: string }
 *                 deliveredToTelegram:
 *                   type: boolean
 *                   description: true si TELEGRAM_TOKEN est configuré et l'envoi a réussi
 *       500:
 *         description: Erreur de traitement
 */

export {};
