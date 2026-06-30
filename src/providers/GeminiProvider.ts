import axios from 'axios';
import { config } from '../config';
import { AIProvider } from '../interfaces';
import { AICompletionResult, ChatMessage, ToolDefinition } from '../types';
import { logger } from '../utils/logger';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

interface GeminiPart {
  text?: string;
  thoughtSignature?: string;
  functionCall?: { id?: string; name: string; args: Record<string, unknown> };
  functionResponse?: { name: string; response: Record<string, unknown> };
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

function toGeminiSchema(schema: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...schema };
  if (typeof out.type === 'string') out.type = out.type.toUpperCase();
  if (out.properties && typeof out.properties === 'object') {
    out.properties = Object.fromEntries(
      Object.entries(out.properties as Record<string, unknown>).map(([k, v]) => [
        k,
        toGeminiSchema(v as Record<string, unknown>),
      ]),
    );
  }
  if (out.items && typeof out.items === 'object') {
    out.items = toGeminiSchema(out.items as Record<string, unknown>);
  }
  return out;
}

export class GeminiProvider implements AIProvider {
  async complete(messages: ChatMessage[], tools?: ToolDefinition[]): Promise<AICompletionResult> {
    const systemInstruction = messages
      .filter((m) => m.role === 'system')
      .map((m) => m.content ?? '')
      .join('\n\n');

    const contents = this.mapMessages(messages);

    const body: Record<string, unknown> = { contents };
    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }
    if (tools?.length) {
      body.tools = [
        {
          functionDeclarations: tools.map((t) => ({
            name: t.function.name,
            description: t.function.description,
            parameters: toGeminiSchema(t.function.parameters),
          })),
        },
      ];
      body.toolConfig = { functionCallingConfig: { mode: 'AUTO' } };
    }

    const url = `${GEMINI_API_BASE}/models/${config.GEMINI_MODEL}:generateContent`;

    try {
      const { data } = await axios.post(url, body, {
        params: { key: config.GEMINI_API_KEY },
        timeout: 90_000,
        headers: { 'Content-Type': 'application/json' },
      });

      if (data.error) {
        throw new Error(data.error.message ?? 'Gemini API error');
      }

      return this.parseResponse(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.error?.message ?? err.message;
        throw new Error(msg);
      }
      throw err;
    }
  }

  private mapMessages(messages: ChatMessage[]): GeminiContent[] {
    const contents: GeminiContent[] = [];

    for (const message of messages) {
      if (message.role === 'system') continue;

      if (message.role === 'user') {
        contents.push({ role: 'user', parts: [{ text: message.content ?? '' }] });
        continue;
      }

      if (message.role === 'assistant') {
        const parts: GeminiPart[] = [];
        if (message.content) parts.push({ text: message.content });
        for (const tc of message.toolCalls ?? []) {
          const part: GeminiPart = {
            functionCall: { name: tc.name, args: tc.arguments, ...(tc.id && { id: tc.id }) },
          };
          if (tc.thoughtSignature) part.thoughtSignature = tc.thoughtSignature;
          parts.push(part);
        }
        if (parts.length) contents.push({ role: 'model', parts });
        continue;
      }

      if (message.role === 'tool') {
        let response: Record<string, unknown> = {};
        try {
          response = JSON.parse(message.content ?? '{}') as Record<string, unknown>;
        } catch {
          response = { result: message.content ?? '' };
        }
        contents.push({
          role: 'user',
          parts: [{ functionResponse: { name: message.name ?? 'tool', response } }],
        });
      }
    }

    return contents;
  }

  private parseResponse(data: {
    candidates?: Array<{
      content?: { parts?: GeminiPart[] };
      finishReason?: string;
    }>;
  }): AICompletionResult {
    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const textParts = parts.filter((p) => p.text).map((p) => p.text).join('');
    const functionParts = parts.filter((p) => p.functionCall);

    const toolCalls = functionParts.map((p, i) => ({
      id: p.functionCall!.id ?? `gemini-${p.functionCall!.name}-${i}`,
      name: p.functionCall!.name,
      arguments: p.functionCall!.args ?? {},
      ...(p.thoughtSignature && { thoughtSignature: p.thoughtSignature }),
    }));

    if (toolCalls.length) {
      logger.debug('GeminiProvider: tool calls', { tools: toolCalls.map((t) => t.name) });
      return {
        content: textParts || null,
        toolCalls,
        finishReason: 'tool_calls',
      };
    }

    return {
      content: textParts || null,
      toolCalls: [],
      finishReason: data.candidates?.[0]?.finishReason?.toLowerCase() ?? 'stop',
    };
  }
}
