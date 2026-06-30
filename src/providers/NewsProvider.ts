import axios from 'axios';
import Parser from 'rss-parser';
import { config, isTest, hasNewsAPI } from '../config';
import { NewsProvider } from '../interfaces';
import { NewsArticle } from '../types';
import { cache } from './RedisCache';
import { logger } from '../utils/logger';

const RSS_FEEDS = [
  'https://cointelegraph.com/rss',
  'https://www.coindesk.com/arc/outboundfeeds/rss/',
];

interface NewsAPIArticle {
  title: string;
  description?: string;
  content?: string;
  source?: { name?: string };
  url: string;
  publishedAt: string;
}

export class NewsAPIProvider implements NewsProvider {
  private fallback = new MockNewsProvider();

  async getLatest(limit = 10): Promise<NewsArticle[]> {
    try {
      return await this.fetchFromAPI(limit);
    } catch (err) {
      logger.warn('NewsAPI failed, using mock fallback', { err: (err as Error).message });
      return this.fallback.getLatest(limit);
    }
  }

  private async fetchFromAPI(limit: number): Promise<NewsArticle[]> {
    const cacheKey = `news:api:${limit}`;
    const cached = await cache.get<NewsArticle[]>(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get('https://newsapi.org/v2/everything', {
      params: { q: 'bitcoin OR cryptocurrency', language: 'en', sortBy: 'publishedAt', pageSize: limit, apiKey: config.NEWS_API_KEY },
      timeout: 10000,
    });

    const articles: NewsArticle[] = (data.articles ?? []).map((a: NewsAPIArticle) => ({
      title: a.title,
      summary: this.summarizeInFrench(a.description ?? a.content ?? ''),
      source: a.source?.name ?? 'NewsAPI',
      url: a.url,
      publishedAt: a.publishedAt,
    }));

    await cache.set(cacheKey, articles, 1800);
    return articles;
  }

  private summarizeInFrench(text: string): string {
    if (!text) return 'Résumé non disponible.';
    const cleaned = text.replace(/\[\+?\d+ chars\]/, '').trim();
    return `[Résumé FR] ${cleaned.slice(0, 300)}${cleaned.length > 300 ? '...' : ''}`;
  }
}

export class RSSProvider implements NewsProvider {
  private parser = new Parser();

  async getLatest(limit = 10): Promise<NewsArticle[]> {
    const cacheKey = `news:rss:${limit}`;
    const cached = await cache.get<NewsArticle[]>(cacheKey);
    if (cached) return cached;

    const allArticles: NewsArticle[] = [];

    for (const feedUrl of RSS_FEEDS) {
      try {
        const feed = await this.parser.parseURL(feedUrl);
        feed.items.slice(0, limit).forEach((item) => {
          allArticles.push({
            title: item.title ?? 'Sans titre',
            summary: `[Résumé FR] ${(item.contentSnippet ?? item.content ?? '').slice(0, 300)}`,
            source: feed.title ?? 'RSS',
            url: item.link ?? '',
            publishedAt: item.pubDate ?? new Date().toISOString(),
          });
        });
      } catch (err) {
        logger.warn(`RSS feed failed: ${feedUrl}`, { err });
      }
    }

    const result = allArticles.slice(0, limit);
    if (result.length) await cache.set(cacheKey, result, 1800);
    return result.length ? result : new MockNewsProvider().getLatest(limit);
  }
}

export class MockNewsProvider implements NewsProvider {
  async getLatest(limit = 10): Promise<NewsArticle[]> {
    const mock: NewsArticle[] = [
      { title: 'Bitcoin atteint un nouveau record en 2026', summary: '[Résumé FR] Le Bitcoin continue sa progression sur les marchés africains et mondiaux.', source: 'SORAYA Mock', url: 'https://example.com/1', publishedAt: new Date().toISOString() },
      { title: 'L\'adoption crypto progresse en Afrique de l\'Ouest', summary: '[Résumé FR] De plus en plus d\'utilisateurs adoptent le Bitcoin via mobile money.', source: 'SORAYA Mock', url: 'https://example.com/2', publishedAt: new Date().toISOString() },
      { title: 'Le Lightning Network facilite les micro-paiements', summary: '[Résumé FR] Le réseau Lightning permet des transactions rapides et peu coûteuses.', source: 'SORAYA Mock', url: 'https://example.com/3', publishedAt: new Date().toISOString() },
    ];
    return mock.slice(0, limit);
  }
}

export const createNewsProvider = (): NewsProvider => {
  if (isTest) return new MockNewsProvider();
  if (hasNewsAPI) return new NewsAPIProvider();
  return new RSSProvider();
};
