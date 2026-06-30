import OpenAI from 'openai';
import { AICompletionResult, ChatMessage, ToolDefinition } from '../../types';

export async function completeChat(
  client: OpenAI,
  model: string,
  messages: ChatMessage[],
  tools?: ToolDefinition[],
): Promise<AICompletionResult> {
  const response = await client.chat.completions.create({
    model,
    messages: messages.map((m) => {
      if (m.role === 'tool') {
        return {
          role: 'tool' as const,
          content: m.content ?? '',
          tool_call_id: m.toolCallId!,
          ...(m.name && { name: m.name }),
        };
      }
      if (m.role === 'assistant' && m.toolCalls?.length) {
        return {
          role: 'assistant' as const,
          content: m.content,
          tool_calls: m.toolCalls.map((tc) => ({
            id: tc.id,
            type: 'function' as const,
            function: { name: tc.name, arguments: JSON.stringify(tc.arguments) },
          })),
        };
      }
      return { role: m.role, content: m.content ?? '' };
    }),
    tools: tools?.length ? tools : undefined,
    tool_choice: tools?.length ? 'auto' : undefined,
  });

  const choice = response.choices[0];
  const toolCalls = (choice.message.tool_calls ?? []).map((tc) => ({
    id: tc.id,
    name: tc.function.name,
    arguments: JSON.parse(tc.function.arguments) as Record<string, unknown>,
  }));

  return {
    content: choice.message.content,
    toolCalls,
    finishReason: choice.finish_reason ?? 'stop',
  };
}
