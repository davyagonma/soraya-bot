import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SORAYA API',
      version: '1.0.0',
      description: `
**Assistant Bitcoin & Crypto pour l'Afrique**
`.trim(),
      contact: { name: 'SORAYA Team' },
    },
    servers: [{ url: `http://localhost:${config.PORT}/api`, description: 'Development' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu via POST /auth/login — coller uniquement le token, sans "Bearer "',
        },
      },
    },
    tags: [
      { name: 'Dev', description: 'Données de test et aide au développement' },
      { name: 'Auth', description: 'Authentification JWT' },
      { name: 'Chat', description: 'Assistant IA — point d\'entrée principal' },
      { name: 'Crypto', description: 'Prix et marchés crypto' },
      { name: 'Conversion', description: 'Conversion de devises' },
      { name: 'Education', description: 'Base de connaissances' },
      { name: 'News', description: 'Actualités crypto' },
      { name: 'Scam', description: 'Analyse d\'arnaque' },
      { name: 'Security', description: 'Conseils sécurité' },
      { name: 'Alerts', description: 'Alertes de prix' },
      { name: 'Admin', description: 'Administration (rôle ADMIN)' },
      { name: 'Telegram', description: 'Webhook Telegram' },
      { name: 'Health', description: 'Santé du service' },
    ],
  },
  apis: ['./src/docs/*.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
