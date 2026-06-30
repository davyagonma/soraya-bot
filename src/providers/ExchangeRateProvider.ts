import axios from 'axios';
import { ExchangeProvider } from '../interfaces';
import { ConversionResult } from '../types';
import { cache } from './RedisCache';
import { createCryptoProvider } from './CoinGeckoProvider';
import { logger } from '../utils/logger';

const FIAT_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, XOF: 600, XAF: 600, NGN: 1500, GHS: 12.5,
};

const CRYPTO_SYMBOLS = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'DOGE'];

export class ExchangeRateProvider implements ExchangeProvider {
  private cryptoProvider = createCryptoProvider();

  async getRate(from: string, to: string): Promise<number> {
    const cacheKey = `exchange:rate:${from}:${to}`;
    const cached = await cache.get<number>(cacheKey);
    if (cached) return cached;

    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();

    let rate: number;

    if (CRYPTO_SYMBOLS.includes(fromUpper) && CRYPTO_SYMBOLS.includes(toUpper)) {
      const fromPrice = (await this.cryptoProvider.getPrice(fromUpper, ['USD'])).prices.USD;
      const toPrice = (await this.cryptoProvider.getPrice(toUpper, ['USD'])).prices.USD;
      rate = fromPrice / toPrice;
    } else if (CRYPTO_SYMBOLS.includes(fromUpper)) {
      const cryptoUsd = (await this.cryptoProvider.getPrice(fromUpper, ['USD'])).prices.USD;
      const fiatRate = FIAT_RATES[toUpper] ?? 1;
      rate = cryptoUsd * fiatRate;
    } else if (CRYPTO_SYMBOLS.includes(toUpper)) {
      const cryptoUsd = (await this.cryptoProvider.getPrice(toUpper, ['USD'])).prices.USD;
      const fiatRate = FIAT_RATES[fromUpper] ?? 1;
      rate = fiatRate / cryptoUsd;
    } else {
      const fromRate = FIAT_RATES[fromUpper] ?? 1;
      const toRate = FIAT_RATES[toUpper] ?? 1;
      rate = fromRate / toRate;
    }

    await cache.set(cacheKey, rate, 300);
    return rate;
  }

  async convert(amount: number, from: string, to: string): Promise<ConversionResult> {
    const cacheKey = `convert:${amount}:${from}:${to}`;
    const cached = await cache.get<ConversionResult>(cacheKey);
    if (cached) return cached;

    const rate = await this.getRate(from, to);
    const result: ConversionResult = {
      from: { amount, currency: from.toUpperCase() },
      to: { amount: amount * rate, currency: to.toUpperCase() },
      rate,
      timestamp: new Date().toISOString(),
    };

    await cache.set(cacheKey, result, 300);
    return result;
  }
}

export class MockExchangeProvider implements ExchangeProvider {
  async getRate(from: string, to: string): Promise<number> {
    return new ExchangeRateProvider().getRate(from, to);
  }

  async convert(amount: number, from: string, to: string): Promise<ConversionResult> {
    return new ExchangeRateProvider().convert(amount, from, to);
  }
}

export const createExchangeProvider = (): ExchangeProvider => {
  try {
    return new ExchangeRateProvider();
  } catch (err) {
    logger.warn('Exchange provider fallback', { err });
    return new MockExchangeProvider();
  }
};
