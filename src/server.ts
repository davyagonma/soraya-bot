import { createApp, initializeBackgroundJobs } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import prisma from './database/prisma';

const app = createApp();

const start = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    initializeBackgroundJobs();

    app.listen(config.PORT, () => {
      logger.info(`SORAYA API running on port ${config.PORT}`);
      logger.info(`Swagger docs: http://localhost:${config.PORT}/api/docs`);
      logger.info(`Demo frontend: http://localhost:${config.PORT}/demo/index.html`);
    });
  } catch (err) {
    logger.error('Failed to start server', { err });
    process.exit(1);
  }
};

start();

export default app;
