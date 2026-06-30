import axios from 'axios';
import { config, isTest, hasCoinGecko } from '../config';
import { CryptoProvider } from '../interfaces';
import { CryptoPrice } from '../types';
import { cache } from './RedisCache';
import { logger } from '../utils/logger';

const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  BNB: 'binancecoin',
  SOL: 'solana',
  DOGE: 'dogecoin',
};

const FIAT_MAP: Record<string, string> = {
  USD: 'usd', EUR: 'eur', XOF: 'xof', XAF: 'xaf', NGN: 'ngn', GHS: 'ghs',
};

export class CoinGeckoProvider implements CryptoProvider {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private headers: Record<string, string> = {};
  private fallback = new MockCryptoProvider();

  constructor() {
    if (config.COINGECKO_API_KEY) {
      this.headers['x-cg-demo-api-key'] = config.COINGECKO_API_KEY;
    }
  }

  private async withFallback<T>(method: keyof CryptoProvider, ...args: unknown[]): Promise<T> {
    try {
      switch (method) {
        case 'getPrice':
          return (await this.fetchPrice(...(args as [string, string[]]))) as T;
        case 'getTop':
          return (await this.fetchTop(...(args as [number, string]))) as T;
        case 'getHistory':
          return (await this.fetchHistory(...(args as [string, number, string]))) as T;
        case 'getMarkets':
          return (await this.fetchMarkets(...(args as [string]))) as T;
        default:
          throw new Error(`Unknown method: ${method}`);
      }
    } catch (err) {
      logger.warn(`CoinGecko ${method} failed, using mock fallback`, { err: (err as Error).message });
      return (this.fallback[method] as (...a: unknown[]) => Promise<T>).apply(this.fallback, args);
    }
  }

  async getPrice(symbol: string, currencies: string[]): Promise<CryptoPrice> {
    return this.withFallback('getPrice', symbol, currencies);
  }

  async getTop(limit: number, currency: string): Promise<CryptoPrice[]> {
    return this.withFallback('getTop', limit, currency);
  }

  async getHistory(symbol: string, days: number, currency: string): Promise<{ date: string; price: number }[]> {
    return this.withFallback('getHistory', symbol, days, currency);
  }

  async getMarkets(currency: string): Promise<CryptoPrice[]> {
    return this.withFallback('getMarkets', currency);
  }

  private async fetchPrice(symbol: string, currencies: string[]): Promise<CryptoPrice> {
    const cacheKey = `crypto:price:${symbol}:${currencies.join(',')}`;
    const cached = await cache.get<CryptoPrice>(cacheKey);
    if (cached) return cached;

    const coinId = this.getCoinId(symbol);
    const vs = currencies.map((c) => FIAT_MAP[c.toUpperCase()] ?? c.toLowerCase()).join(',');

    const { data } = await axios.get(`${this.baseUrl}/coins/markets`, {
      params: { vs_currency: 'usd', ids: coinId, sparkline: false },
      headers: this.headers,
      timeout: 10000,
    });

    const detail = await axios.get(`${this.baseUrl}/simple/price`, {
      params: { ids: coinId, vs_currencies: vs, include_24hr_change: true, include_market_cap: true },
      headers: this.headers,
      timeout: 10000,
    });

    const prices: Record<string, number> = {};
    const priceData = detail.data[coinId] ?? {};
    currencies.forEach((c) => {
      const key = FIAT_MAP[c.toUpperCase()] ?? c.toLowerCase();
      prices[c.toUpperCase()] = priceData[key] ?? 0;
    });

    const result: CryptoPrice = {
      symbol: symbol.toUpperCase(),
      name: data[0]?.name ?? symbol,
      prices,
      change24h: data[0]?.price_change_percentage_24h,
      marketCap: data[0]?.market_cap,
      lastUpdated: new Date().toISOString(),
    };

    await cache.set(cacheKey, result, 300);
    return result;
  }

  private getCoinId(symbol: string): string {
    const id = COINGECKO_IDS[symbol.toUpperCase()];
    if (!id) throw new Error(`Unsupported crypto: ${symbol}`);
    return id;
  }

  private async fetchTop(limit: number, currency: string): Promise<CryptoPrice[]> {
    const cacheKey = `crypto:top:${limit}:${currency}`;
    const cached = await cache.get<CryptoPrice[]>(cacheKey);
    if (cached) return cached;

    const vs = FIAT_MAP[currency.toUpperCase()] ?? currency.toLowerCase();
    const { data } = await axios.get(`${this.baseUrl}/coins/markets`, {
      params: { vs_currency: vs, order: 'market_cap_desc', per_page: limit, page: 1, sparkline: false },
      headers: this.headers,
      timeout: 10000,
    });

    const result = data.map((coin: Record<string, unknown>) => ({
      symbol: (coin.symbol as string).toUpperCase(),
      name: coin.name as string,
      prices: { [currency.toUpperCase()]: coin.current_price as number },
      change24h: coin.price_change_percentage_24h as number,
      marketCap: coin.market_cap as number,
      lastUpdated: new Date().toISOString(),
    }));

    await cache.set(cacheKey, result, 300);
    return result;
  }

  private async fetchHistory(symbol: string, days: number, currency: string): Promise<{ date: string; price: number }[]> {
    const cacheKey = `crypto:history:${symbol}:${days}:${currency}`;
    const cached = await cache.get<{ date: string; price: number }[]>(cacheKey);
    if (cached) return cached;

    const coinId = this.getCoinId(symbol);
    const vs = FIAT_MAP[currency.toUpperCase()] ?? currency.toLowerCase();

    const { data } = await axios.get(`${this.baseUrl}/coins/${coinId}/market_chart`, {
      params: { vs_currency: vs, days },
      headers: this.headers,
      timeout: 10000,
    });

    const result = (data.prices as [number, number][]).map(([ts, price]) => ({
      date: new Date(ts).toISOString(),
      price,
    }));

    await cache.set(cacheKey, result, 600);
    return result;
  }

  private async fetchMarkets(currency: string): Promise<CryptoPrice[]> {
    const symbols = Object.keys(COINGECKO_IDS);
    return Promise.all(symbols.map((s) => this.getPrice(s, [currency, 'USD', 'EUR', 'XOF'])));
  }
}

export class MockCryptoProvider implements CryptoProvider {
  private mockPrices: Record<string, Record<string, number>> = {
    BTC: { USD: 95000, EUR: 88000, XOF: 57000000, XAF: 57000000, NGN: 145000000, GHS: 1200000 },
    ETH: { USD: 3500, EUR: 3200, XOF: 2100000, XAF: 2100000, NGN: 5300000, GHS: 44000 },
    USDT: { USD: 1, EUR: 0.92, XOF: 600, XAF: 600, NGN: 1500, GHS: 12.5 },
    BNB: { USD: 600, EUR: 550, XOF: 360000, XAF: 360000, NGN: 900000, GHS: 7500 },
    SOL: { USD: 180, EUR: 165, XOF: 108000, XAF: 108000, NGN: 270000, GHS: 2250 },
    DOGE: { USD: 0.35, EUR: 0.32, XOF: 210, XAF: 210, NGN: 525, GHS: 4.4 },
  };

  async getPrice(symbol: string, currencies: string[]): Promise<CryptoPrice> {
    const sym = symbol.toUpperCase();
    const base = this.mockPrices[sym] ?? this.mockPrices.BTC;
    const prices: Record<string, number> = {};
    currencies.forEach((c) => { prices[c.toUpperCase()] = base[c.toUpperCase()] ?? base.USD; });
    return { symbol: sym, name: sym, prices, change24h: 2.5, marketCap: 1e12, lastUpdated: new Date().toISOString() };
  }

  async getTop(limit: number, currency: string): Promise<CryptoPrice[]> {
    const symbols = Object.keys(this.mockPrices).slice(0, limit);
    return Promise.all(symbols.map((s) => this.getPrice(s, [currency])));
  }

  async getHistory(symbol: string, days: number, currency: string): Promise<{ date: string; price: number }[]> {
    const price = (await this.getPrice(symbol, [currency])).prices[currency.toUpperCase()];
    return Array.from({ length: Math.min(days, 30) }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toISOString(),
      price: price * (1 + (Math.random() - 0.5) * 0.05),
    }));
  }

  async getMarkets(currency: string): Promise<CryptoPrice[]> {
    return Promise.all(Object.keys(this.mockPrices).map((s) => this.getPrice(s, [currency, 'USD', 'XOF'])));
  }
}

export const createCryptoProvider = (): CryptoProvider => {
  if (isTest || !hasCoinGecko) {
    if (!isTest) logger.warn('COINGECKO_API_KEY not set — using MockCryptoProvider');
    return new MockCryptoProvider();
  }
  return new CoinGeckoProvider();
};
