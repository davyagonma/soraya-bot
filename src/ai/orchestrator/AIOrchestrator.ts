import { createAIProvider } from '../../providers/OpenAIProvider';
import { ChatMessage, ChatSource } from '../../types';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt';
import { toolRegistry } from '../registry/ToolRegistry';
import { matchLocalKnowledge } from '../../services/LocalKnowledgeService';
import { logger } from '../../utils/logger';

const MAX_TOOL_ITERATIONS = 5;

export class AIOrchestrator {
  private aiProvider = createAIProvider();

  async process(
    messages: ChatMessage[],
    userId?: string,
  ): Promise<{ reply: string; toolsUsed: string[]; sources?: ChatSource[]; provider?: 'local' | 'ai' }> {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser?.content) {
      const local = matchLocalKnowledge(lastUser.content);
      if (local) {
        logger.info('Local knowledge match', { entryId: local.entryId });
        return {
          reply: local.reply,
          toolsUsed: ['localKnowledge'],
          sources: local.sources,
          provider: 'local',
        };
      }
    }

    const toolsUsed: string[] = [];
    const conversationMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ];

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const result = await this.aiProvider.complete(conversationMessages, toolRegistry.getDefinitions());

      if (result.toolCalls.length === 0) {
        return {
          reply: result.content ?? 'Je n\'ai pas pu générer de réponse.',
          toolsUsed,
          provider: 'ai',
        };
      }

      conversationMessages.push({
        role: 'assistant',
        content: result.content,
        toolCalls: result.toolCalls,
      });

      for (const toolCall of result.toolCalls) {
        toolsUsed.push(toolCall.name);

        const args = { ...toolCall.arguments };
        if (userId && ['createPriceAlert', 'listPriceAlerts', 'deletePriceAlert'].includes(toolCall.name)) {
          args.userId = userId;
        }

        let toolResult: unknown;
        try {
          toolResult = await toolRegistry.execute(toolCall.name, args);
        } catch (err) {
          toolResult = { error: (err as Error).message };
          logger.error(`Tool execution failed: ${toolCall.name}`, { err });
        }

        conversationMessages.push({
          role: 'tool',
          content: JSON.stringify(toolResult),
          toolCallId: toolCall.id,
          name: toolCall.name,
        });
      }
    }

    const finalResult = await this.aiProvider.complete(conversationMessages);
    return {
      reply: finalResult.content ?? 'Limite d\'itérations atteinte.',
      toolsUsed,
      provider: 'ai',
    };
  }
}

export const aiOrchestrator = new AIOrchestrator();
