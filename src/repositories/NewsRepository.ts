import prisma from '../database/prisma';
import { Prisma, ScamLevel } from '@prisma/client';

export class NewsRepository {
  async upsertMany(articles: { title: string; summary: string; source: string; url: string; publishedAt: Date }[]) {
    for (const article of articles) {
      await prisma.news.upsert({
        where: { url: article.url },
        update: { summary: article.summary, updatedAt: new Date() },
        create: article,
      });
    }
  }

  async findLatest(limit: number) {
    return prisma.news.findMany({ orderBy: { publishedAt: 'desc' }, take: limit });
  }
}

export class ScamAnalysisRepository {
  async create(data: {
    input: string;
    score: number;
    level: ScamLevel;
    explanation: string;
    recommendations: string[];
  }) {
    return prisma.scamAnalysis.create({
      data: { ...data, recommendations: data.recommendations as Prisma.InputJsonValue },
    });
  }
}

export class AuditLogRepository {
  async create(data: {
    userId?: string;
    action: string;
    resource: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    return prisma.auditLog.create({
      data: {
        ...data,
        details: data.details ? (data.details as Prisma.InputJsonValue) : undefined,
      },
    });
  }
}

export const newsRepository = new NewsRepository();
export const scamAnalysisRepository = new ScamAnalysisRepository();
export const auditLogRepository = new AuditLogRepository();
