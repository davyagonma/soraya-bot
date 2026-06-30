import { MessageRole } from '@prisma/client';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string | null;
  toolCallId?: string;
  name?: string;
  toolCalls?: ToolCall[];
}

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  /** Requis par Gemini pour les appels multi-tours avec outils */
  thoughtSignature?: string;
}

export interface AICompletionResult {
  content: string | null;
  toolCalls: ToolCall[];
  finishReason: string;
}

export interface CryptoPrice {
  symbol: string;
  name: string;
  prices: Record<string, number>;
  change24h?: number;
  marketCap?: number;
  lastUpdated: string;
}

export interface ConversionResult {
  from: { amount: number; currency: string };
  to: { amount: number; currency: string };
  rate: number;
  timestamp: string;
}

export interface NewsArticle {
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
}

export interface ScamAnalysisResult {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
  recommendations: string[];
}

export interface EducationTopic {
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface SecurityTip {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  channel?: string;
}

export interface ChatSource {
  name: string;
  url?: string;
  description?: string;
}

export interface ChatResponse {
  reply: string;
  conversationId: string;
  toolsUsed?: string[];
  sources?: ChatSource[];
  provider?: 'local' | 'ai';
}

export const messageRoleMap: Record<MessageRole, ChatMessage['role']> = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  TOOL: 'tool',
};

export const SUPPORTED_CRYPTOS = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'DOGE'] as const;
export const SUPPORTED_FIAT = ['USD', 'EUR', 'XOF', 'XAF', 'NGN', 'GHS'] as const;

export type SupportedCrypto = (typeof SUPPORTED_CRYPTOS)[number];
export type SupportedFiat = (typeof SUPPORTED_FIAT)[number];
