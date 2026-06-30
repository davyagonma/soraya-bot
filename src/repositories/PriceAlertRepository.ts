import prisma from '../database/prisma';
import { AlertCondition, PriceAlert } from '@prisma/client';

export class PriceAlertRepository {
  async findByUser(userId: string): Promise<PriceAlert[]> {
    return prisma.priceAlert.findMany({ where: { userId, isActive: true }, orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string): Promise<PriceAlert | null> {
    return prisma.priceAlert.findUnique({ where: { id } });
  }

  async create(data: {
    userId: string;
    symbol: string;
    targetPrice: number;
    currency?: string;
    condition: AlertCondition;
  }): Promise<PriceAlert> {
    return prisma.priceAlert.create({ data });
  }

  async delete(id: string, userId: string): Promise<PriceAlert> {
    return prisma.priceAlert.delete({ where: { id, userId } });
  }

  async findAllActive(): Promise<PriceAlert[]> {
    return prisma.priceAlert.findMany({ where: { isActive: true } });
  }

  async markTriggered(id: string): Promise<PriceAlert> {
    return prisma.priceAlert.update({
      where: { id },
      data: { triggeredAt: new Date(), isActive: false },
    });
  }
}

export const priceAlertRepository = new PriceAlertRepository();
