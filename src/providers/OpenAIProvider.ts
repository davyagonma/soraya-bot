import OpenAI from 'openai';
import { config } from '../config';
import { AIProvider } from '../interfaces';
import { AICompletionResult, ChatMessage, ToolDefinition } from '../types';
import { logger } from '../utils/logger';
import { completeChat } from './ai/completeChat';
import { GrokProvider } from './GrokProvider';
import { GeminiProvider } from './GeminiProvider';

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const axiosErr = err as { response?: { data?: { error?: { message?: string }; message?: string } }; message?: string };
    return (
      axiosErr.response?.data?.error?.message ??
      axiosErr.response?.data?.message ??
      (err as Error).message ??
      'Unknown error'
    );
  }
  return String(err);
}

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: config.OPENAI_API_KEY });
  }

  async complete(messages: ChatMessage[], tools?: ToolDefinition[]): Promise<AICompletionResult> {
    return completeChat(this.client, config.OPENAI_MODEL, messages, tools);
  }
}

export class MockAIProvider implements AIProvider {
  async complete(messages: ChatMessage[], tools?: ToolDefinition[]): Promise<AICompletionResult> {
    const hasToolResults = messages.some((m) => m.role === 'tool');
    if (hasToolResults) {
      const lastTool = [...messages].reverse().find((m) => m.role === 'tool');
      return {
        content: `Voici les informations demandées : ${lastTool?.content?.slice(0, 500) ?? ''}. N'oubliez pas que les cryptomonnaies comportent des risques.`,
        toolCalls: [],
        finishReason: 'stop',
      };
    }

    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const content = (lastUser?.content ?? '').toLowerCase();

    if (tools?.length) {
      if (content.includes('prix') || content.includes('btc') || content.includes('bitcoin')) {
        return {
          content: null,
          toolCalls: [{ id: 'mock-1', name: 'getCryptoPrice', arguments: { symbol: 'BTC', currencies: ['USD', 'XOF'] } }],
          finishReason: 'tool_calls',
        };
      }
      if (content.includes('convert') || content.includes('xof')) {
        return {
          content: null,
          toolCalls: [{ id: 'mock-2', name: 'convertCurrency', arguments: { amount: 50000, from: 'XOF', to: 'BTC' } }],
          finishReason: 'tool_calls',
        };
      }
      if (content.includes('news') || content.includes('actualit')) {
        return {
          content: null,
          toolCalls: [{ id: 'mock-3', name: 'getLatestNews', arguments: { limit: 5 } }],
          finishReason: 'tool_calls',
        };
      }
      if (content.includes('scam') || content.includes('arnaque') || content.includes('fiable')) {
        return {
          content: null,
          toolCalls: [{ id: 'mock-4', name: 'analyzeScam', arguments: { description: lastUser?.content ?? '' } }],
          finishReason: 'tool_calls',
        };
      }
      if (content.includes('lightning') || content.includes('wallet') || content.includes('explique')) {
        return {
          content: null,
          toolCalls: [{ id: 'mock-5', name: 'searchKnowledge', arguments: { query: lastUser?.content ?? 'bitcoin' } }],
          finishReason: 'tool_calls',
        };
      }
      if (content.includes('alerte') || content.includes('alert')) {
        return {
          content: null,
          toolCalls: [{ id: 'mock-6', name: 'createPriceAlert', arguments: { symbol: 'BTC', targetPrice: 100000, currency: 'USD', condition: 'ABOVE' } }],
          finishReason: 'tool_calls',
        };
      }
    }

    logger.debug('MockAIProvider: direct response');
    return {
      content: `Bonjour ! Je suis SORAYA, votre assistante Bitcoin pour l'Afrique..`,
      toolCalls: [],
      finishReason: 'stop',
    };
  }
}

export class ChainedAIProvider implements AIProvider {
  constructor(
    private readonly providers: AIProvider[],
    private readonly finalFallback: AIProvider,
  ) {}

  async complete(messages: ChatMessage[], tools?: ToolDefinition[]): Promise<AICompletionResult> {
    for (const provider of this.providers) {
      try {
        return await provider.complete(messages, tools);
      } catch (err) {
        logger.warn(`${provider.constructor.name} failed, trying next provider`, {
          err: extractErrorMessage(err),
        });
      }
    }
    return this.finalFallback.complete(messages, tools);
  }
}

/** @deprecated use ChainedAIProvider */
export class ResilientAIProvider extends ChainedAIProvider {
  constructor(primary: AIProvider, fallback: AIProvider) {
    super([primary], fallback);
  }
}

type AIProviderName = 'openai' | 'grok' | 'gemini';

const AI_PROVIDER_NAMES: AIProviderName[] = ['openai', 'grok', 'gemini'];

function parseProviderPriority(priority: string): AIProviderName[] {
  return priority
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter((name): name is AIProviderName => AI_PROVIDER_NAMES.includes(name as AIProviderName));
}

function createProviderByName(name: AIProviderName): AIProvider | null {
  switch (name) {
    case 'openai':
      return config.OPENAI_API_KEY ? new OpenAIProvider() : null;
    case 'grok':
      return config.GROK_API_KEY ? new GrokProvider() : null;
    case 'gemini':
      return config.GEMINI_API_KEY ? new GeminiProvider() : null;
    default:
      return null;
  }
}

export function resolveAIProviderChain(): { priority: AIProviderName[]; active: string[] } {
  const priority = parseProviderPriority(config.AI_PROVIDER_PRIORITY);
  const active = priority
    .map((name) => ({ name, provider: createProviderByName(name) }))
    .filter((entry) => entry.provider !== null)
    .map((entry) => entry.name);

  return { priority, active };
}

export const createAIProvider = (): AIProvider => {
  const mock = new MockAIProvider();
  const { priority, active } = resolveAIProviderChain();
  const providers = priority
    .map((name) => createProviderByName(name))
    .filter((provider): provider is AIProvider => provider !== null);

  if (providers.length === 0) {
    logger.warn(
      `No AI API key for priority [${config.AI_PROVIDER_PRIORITY}] — using MockAIProvider`,
    );
    return mock;
  }

  const skipped = priority.filter((name) => !active.includes(name));
  if (skipped.length) {
    logger.warn(`AI providers skipped (no API key): ${skipped.join(', ')}`);
  }

  logger.info(
    `AI provider chain [${config.AI_PROVIDER_PRIORITY}]: ${providers.map((p) => p.constructor.name).join(' → ')} → MockAIProvider`,
  );
  return new ChainedAIProvider(providers, mock);
};
