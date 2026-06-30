import Redis from 'ioredis';
import { config } from '../config';
import { CacheProvider } from '../interfaces';
import { logger } from '../utils/logger';

class RedisCache implements CacheProvider {
  private client: Redis | null = null;
  private memoryFallback = new Map<string, { value: string; expiresAt?: number }>();

  constructor() {
    try {
      this.client = new Redis(config.REDIS_URL, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        retryStrategy: (times) => Math.min(times * 100, 3000),
      });
      this.client.on('error', (err) => logger.warn('Redis error, using memory fallback', { err: err.message }));
      this.client.connect().catch(() => {
        logger.warn('Redis unavailable, using in-memory cache');
        this.client = null;
      });
    } catch {
      logger.warn('Redis init failed, using in-memory cache');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.client?.status === 'ready') {
      const val = await this.client.get(key);
      return val ? (JSON.parse(val) as T) : null;
    }
    const entry = this.memoryFallback.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.memoryFallback.delete(key);
      return null;
    }
    return JSON.parse(entry.value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    const serialized = JSON.stringify(value);
    if (this.client?.status === 'ready') {
      await this.client.setex(key, ttlSeconds, serialized);
      return;
    }
    this.memoryFallback.set(key, {
      value: serialized,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    if (this.client?.status === 'ready') await this.client.del(key);
    this.memoryFallback.delete(key);
  }

  async flushPattern(pattern: string): Promise<void> {
    if (this.client?.status === 'ready') {
      const keys = await this.client.keys(pattern);
      if (keys.length) await this.client.del(...keys);
    }
    const prefix = pattern.replace('*', '');
    for (const key of this.memoryFallback.keys()) {
      if (key.startsWith(prefix)) this.memoryFallback.delete(key);
    }
  }
}

export const cache = new RedisCache();
