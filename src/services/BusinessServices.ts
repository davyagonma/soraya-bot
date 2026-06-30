import { createCryptoProvider } from '../providers/CoinGeckoProvider';
import { createExchangeProvider } from '../providers/ExchangeRateProvider';
import { createNewsProvider } from '../providers/NewsProvider';
import { SUPPORTED_CRYPTOS, SUPPORTED_FIAT } from '../types';
import { NotFoundError } from '../utils/errors';
import { EDUCATION_TOPICS, getTopicBySlug, searchTopics } from '../helpers/educationData';
import { SECURITY_TIPS, PHISHING_EXAMPLES, COMMON_SCAMS } from '../helpers/securityData';
import { priceAlertRepository } from '../repositories/PriceAlertRepository';
import { newsRepository, scamAnalysisRepository } from '../repositories/NewsRepository';
import { ScamAnalyzer } from '../interfaces';
import { ScamAnalysisResult } from '../types';
import { AlertCondition, ScamLevel } from '@prisma/client';

const cryptoProvider = createCryptoProvider();
const exchangeProvider = createExchangeProvider();
const newsProvider = createNewsProvider();

export class CryptoService {
  async getPrice(symbol: string, currencies: string[] = ['USD', 'XOF']) {
    return cryptoProvider.getPrice(symbol, currencies);
  }

  async getTop(limit = 10, currency = 'USD') {
    return cryptoProvider.getTop(limit, currency);
  }

  async getHistory(symbol: string, days = 30, currency = 'USD') {
    return cryptoProvider.getHistory(symbol, days, currency);
  }

  async getMarkets(currency = 'USD') {
    return cryptoProvider.getMarkets(currency);
  }
}

export class ConversionService {
  async convert(amount: number, from: string, to: string) {
    return exchangeProvider.convert(amount, from, to);
  }
}

export class EducationService {
  getTopics() {
    return EDUCATION_TOPICS.map(({ slug, title, summary, tags }) => ({ slug, title, summary, tags }));
  }

  search(query: string) {
    return searchTopics(query);
  }

  getBySlug(slug: string) {
    const topic = getTopicBySlug(slug);
    if (!topic) throw new NotFoundError(`Topic "${slug}" not found`);
    return topic;
  }
}

export class NewsService {
  async getLatest(limit = 10) {
    const articles = await newsProvider.getLatest(limit);
    await newsRepository.upsertMany(
      articles.map((a) => ({
        title: a.title,
        summary: a.summary,
        source: a.source,
        url: a.url,
        publishedAt: new Date(a.publishedAt),
      })),
    );
    return articles;
  }
}

export class ScamService implements ScamAnalyzer {
  async analyze(input: string): Promise<ScamAnalysisResult> {
    const lower = input.toLowerCase();
    let score = 0;
    const flags: string[] = [];

    const redFlags = [
      { pattern: /garanti|guaranteed|assuré/i, weight: 25, msg: 'Promesse de gains garantis' },
      { pattern: /20\s*%|100\s*%|rendement/i, weight: 20, msg: 'Rendements irréalistes' },
      { pattern: /urgent|dernière chance|limited/i, weight: 15, msg: 'Pression temporelle' },
      { pattern: /parrainage|referral|mlm|pyramide/i, weight: 20, msg: 'Schéma de parrainage suspect' },
      { pattern: /sans risque|risk.?free|zero risk/i, weight: 25, msg: 'Affirmation « sans risque »' },
      { pattern: /secret|exclusif|vip/i, weight: 10, msg: 'Marketing exclusif/secret' },
      { pattern: /double|envoyez.*recevez/i, weight: 30, msg: 'Arnaque au doublement' },
      { pattern: /seed|phrase|clé privée|private key/i, weight: 35, msg: 'Demande de clés privées' },
    ];

    redFlags.forEach(({ pattern, weight, msg }) => {
      if (pattern.test(lower)) {
        score += weight;
        flags.push(msg);
      }
    });

    score = Math.min(score, 100);
    const level: ScamAnalysisResult['level'] =
      score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'LOW';

    const recommendations = [
      'Ne investissez jamais plus que ce que vous pouvez vous permettre de perdre.',
      'Vérifiez la régulation et la réputation de la plateforme.',
      'Consultez des sources indépendantes avant d\'investir.',
      ...(score >= 50 ? ['Évitez cette opportunité — les signaux d\'alerte sont nombreux.'] : []),
      ...(flags.some((f) => f.includes('clés')) ? ['Ne partagez JAMAIS vos clés privées ou seed phrase.'] : []),
    ];

    const result: ScamAnalysisResult = {
      score,
      level,
      explanation: flags.length
        ? `Analyse : ${flags.length} signal(aux) d'alerte détecté(s) : ${flags.join(', ')}.`
        : 'Peu de signaux d\'alerte détectés, mais restez prudent.',
      recommendations,
    };

    await scamAnalysisRepository.create({
      input,
      score,
      level: level as ScamLevel,
      explanation: result.explanation,
      recommendations,
    });

    return result;
  }
}

export class SecurityService {
  getTips() {
    return SECURITY_TIPS;
  }

  getPhishingExamples() {
    return PHISHING_EXAMPLES;
  }

  getCommonScams() {
    return COMMON_SCAMS;
  }
}

export class AlertService {
  async create(userId: string, data: { symbol: string; targetPrice: number; currency?: string; condition: AlertCondition }) {
    return priceAlertRepository.create({ userId, ...data });
  }

  async list(userId: string) {
    return priceAlertRepository.findByUser(userId);
  }

  async delete(userId: string, id: string) {
    const alert = await priceAlertRepository.findById(id);
    if (!alert || alert.userId !== userId) throw new NotFoundError('Alert not found');
    return priceAlertRepository.delete(id, userId);
  }
}

export const cryptoService = new CryptoService();
export const conversionService = new ConversionService();
export const educationService = new EducationService();
export const newsService = new NewsService();
export const scamService = new ScamService();
export const securityService = new SecurityService();
export const alertService = new AlertService();

export { SUPPORTED_CRYPTOS, SUPPORTED_FIAT };
