import {
  AICompletionResult,
  ChatMessage,
  ConversionResult,
  CryptoPrice,
  NewsArticle,
  ScamAnalysisResult,
  ToolDefinition,
} from '../types';

export interface AIProvider {
  complete(
    messages: ChatMessage[],
    tools?: ToolDefinition[],
  ): Promise<AICompletionResult>;
}

export interface CryptoProvider {
  getPrice(symbol: string, currencies: string[]): Promise<CryptoPrice>;
  getTop(limit: number, currency: string): Promise<CryptoPrice[]>;
  getHistory(symbol: string, days: number, currency: string): Promise<{ date: string; price: number }[]>;
  getMarkets(currency: string): Promise<CryptoPrice[]>;
}

export interface NewsProvider {
  getLatest(limit?: number): Promise<NewsArticle[]>;
}

export interface ExchangeProvider {
  convert(amount: number, from: string, to: string): Promise<ConversionResult>;
  getRate(from: string, to: string): Promise<number>;
}

export interface CacheProvider {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  flushPattern(pattern: string): Promise<void>;
}

export interface ScamAnalyzer {
  analyze(input: string): Promise<ScamAnalysisResult>;
}

export interface ITool {
  readonly name: string;
  readonly description: string;
  readonly parameters: Record<string, unknown>;
  execute(args: Record<string, unknown>): Promise<unknown>;
  getDefinition(): ToolDefinition;
}
