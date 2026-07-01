import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../database/prisma';

export class AdminController {
  getStats = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [userCount, conversationCount, alertCount, newsCount, scamCount, recentUsers] =
        await Promise.all([
          prisma.user.count(),
          prisma.conversation.count(),
          prisma.priceAlert.count(),
          prisma.news.count(),
          prisma.scamAnalysis.count(),
          prisma.user.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: { id: true, email: true, name: true, role: true, createdAt: true },
          }),
        ]);

      res.json({
        success: true,
        data: { userCount, conversationCount, alertCount, newsCount, scamCount, recentUsers },
      });
    } catch (err) {
      next(err);
    }
  };
}

export const adminController = new AdminController();
