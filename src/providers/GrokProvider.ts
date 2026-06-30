import OpenAI from 'openai';
import { config } from '../config';
import { AIProvider } from '../interfaces';
import { AICompletionResult, ChatMessage, ToolDefinition } from '../types';
import { completeChat } from './ai/completeChat';

const GROK_BASE_URL = 'https://api.x.ai/v1';

export class GrokProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.GROK_API_KEY,
      baseURL: GROK_BASE_URL,
    });
  }

  async complete(messages: ChatMessage[], tools?: ToolDefinition[]): Promise<AICompletionResult> {
    return completeChat(this.client, config.GROK_MODEL, messages, tools);
  }
}
