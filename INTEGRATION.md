# Intégration WhatsApp via Evolution API — guide de branchement

Ces fichiers suivent l'architecture déjà en place (`providers/` → `services/` →
`controllers/` → `routes/`), exactement comme le flux Telegram décrit dans le README.

## 1. Copier les fichiers dans le repo

```
src/providers/whatsapp/types.ts
src/providers/whatsapp/WhatsAppProvider.ts
src/services/whatsapp.service.ts
src/controllers/whatsapp.controller.ts
src/routes/whatsapp.routes.ts
src/validators/whatsapp.validator.ts
```

## 2. Installer la dépendance manquante (si absente)

```bash
npm install axios
```

## 3. Adapter deux imports

Dans `src/services/whatsapp.service.ts` :
- `import { chatService } from './chat.service';` → remplacer par le nom/chemin réel
  de votre service de chat existant, et adapter `chatService.handleMessage(...)`
  à sa signature réelle.

Dans `WhatsAppProvider.ts` et `whatsapp.controller.ts` :
- `import logger from '../../utils/logger';` → adapter au chemin réel de votre
  logger Winston.

## 4. Enregistrer les routes (dans votre fichier app.ts / index.ts)

```typescript
import whatsappRoutes from './routes/whatsapp.routes';
// ...
app.use('/api/whatsapp', whatsappRoutes);
```

## 5. Variables d'environnement (.env)

```
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=votre_cle_globale_evolution
EVOLUTION_INSTANCE_NAME=soraya
```

## 6. Ajouter Evolution API au docker-compose.yml

```yaml
evolution-api:
  image: atendai/evolution-api:latest
  ports:
    - "8080:8080"
  environment:
    - AUTHENTICATION_API_KEY=${EVOLUTION_API_KEY}
    - DATABASE_ENABLED=true
    - DATABASE_CONNECTION_URI=${DATABASE_URL}
    - WEBHOOK_GLOBAL_URL=http://api:3000/api/whatsapp/webhook
    - WEBHOOK_GLOBAL_ENABLED=true
    - WEBHOOK_EVENTS_MESSAGES_UPSERT=true
  depends_on:
    - postgres
```

## 7. Créer l'instance Evolution et scanner le QR code

```bash
docker-compose up -d evolution-api

curl -X POST http://localhost:8080/instance/create \
  -H "apikey: $EVOLUTION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "soraya",
    "qrcode": true,
    "webhook": "http://api:3000/api/whatsapp/webhook",
    "webhookByEvents": false
  }'
```

La réponse contient un QR code (base64) à scanner depuis WhatsApp
(Paramètres → Appareils liés). Vérifier ensuite la connexion :

```bash
curl http://localhost:3000/api/whatsapp/status
```

## 8. Tester de bout en bout

Envoyer un message WhatsApp au numéro lié à l'instance → le webhook
`/api/whatsapp/webhook` reçoit l'event `messages.upsert` → `WhatsAppService`
extrait le texte → délègue au `ChatService`/`AIOrchestrator` partagé →
la réponse repart via `WhatsAppProvider.sendText`.

## Limites volontairement non couvertes dans cette première version

- Pas de gestion des médias entrants (images, audio, documents) au-delà
  des légendes texte — à ajouter dans `extractMessage()` si besoin.
- Pas de gestion multi-instance (plusieurs numéros WhatsApp) — le code
  suppose une seule instance nommée via `EVOLUTION_INSTANCE_NAME`.
- Pas de retry/queue si `sendText` échoue — à envisager avec une file
  Redis si le volume augmente.
