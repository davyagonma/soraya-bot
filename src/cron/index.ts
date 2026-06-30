import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import { cryptoService, newsService } from '../services/BusinessServices';
import { priceAlertRepository } from '../repositories/PriceAlertRepository';
import { logger } from '../utils/logger';

export const startCronJobs = (): void => {
  // Every hour: update crypto prices cache
  cron.schedule('0 * * * *', async () => {
    logger.info('Cron: updating crypto prices');
    try {
      await cryptoService.getMarkets('USD');
      logger.info('Cron: crypto prices updated');
    } catch (err) {
      logger.error('Cron: crypto price update failed', { err });
    }
  });

  // Every day at 6am: fetch news
  cron.schedule('0 6 * * *', async () => {
    logger.info('Cron: fetching news');
    try {
      await newsService.getLatest(20);
      logger.info('Cron: news fetched');
    } catch (err) {
      logger.error('Cron: news fetch failed', { err });
    }
  });

  // Every night at 2am: clean old logs + check alerts
  cron.schedule('0 2 * * *', async () => {
    logger.info('Cron: nightly maintenance');
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      ['combined.log', 'error.log'].forEach((file) => {
        const filePath = path.join(logsDir, file);
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 10 * 1024 * 1024) {
          fs.writeFileSync(filePath, '');
          logger.info(`Cron: truncated ${file}`);
        }
      });

      const alerts = await priceAlertRepository.findAllActive();
      for (const alert of alerts) {
        const price = await cryptoService.getPrice(alert.symbol, [alert.currency]);
        const current = price.prices[alert.currency];
        const triggered =
          (alert.condition === 'ABOVE' && current >= alert.targetPrice) ||
          (alert.condition === 'BELOW' && current <= alert.targetPrice);
        if (triggered) {
          await priceAlertRepository.markTriggered(alert.id);
          logger.info(`Cron: alert triggered for ${alert.symbol}`, { alertId: alert.id });
        }
      }
    } catch (err) {
      logger.error('Cron: nightly maintenance failed', { err });
    }
  });

  logger.info('Cron jobs scheduled');
};
