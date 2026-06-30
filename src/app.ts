import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { swaggerSpec } from './docs/swagger';
import { globalErrorHandler, notFoundHandler } from './middlewares/errorHandler';
import { sanitizeInput } from './middlewares/validate';
import { apiRateLimiter } from './middlewares/rateLimiter';
import { ALL_TOOLS } from './ai/tools';
import { toolRegistry } from './ai/registry/ToolRegistry';
import { startCronJobs } from './cron';
import { logger } from './utils/logger';
import { morganStream } from './utils/morganStream';

// Register all AI tools at startup
toolRegistry.registerAll(ALL_TOOLS);
logger.info(`Registered ${toolRegistry.listTools().length} AI tools`);

export const createApp = (): express.Application => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(sanitizeInput);
  app.use(morgan('combined', { stream: morganStream }));
  app.use(apiRateLimiter);
  app.enable('trust proxy');

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
};

export const initializeBackgroundJobs = (): void => {
  if (process.env.NODE_ENV !== 'test') {
    startCronJobs();
  }
};
