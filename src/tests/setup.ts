process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://soraya:soraya123@localhost:5432/soraya_test?schema=public';
process.env.JWT_SECRET = 'test-jwt-secret-min-32-characters-long';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-min-32-chars-long';
process.env.REDIS_URL = 'redis://localhost:6379';
delete process.env.OPENAI_API_KEY;
delete process.env.GROK_API_KEY;
delete process.env.GEMINI_API_KEY;
delete process.env.COINGECKO_API_KEY;
delete process.env.NEWS_API_KEY;

jest.mock('../providers/RedisCache', () => ({
  cache: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    del: jest.fn().mockResolvedValue(undefined),
    flushPattern: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../database/prisma', () => ({
  __esModule: true,
  default: {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    conversation: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    message: { findMany: jest.fn(), create: jest.fn() },
    priceAlert: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), delete: jest.fn(), update: jest.fn() },
    news: { upsert: jest.fn(), findMany: jest.fn() },
    scamAnalysis: { create: jest.fn() },
    auditLog: { create: jest.fn() },
  },
}));
