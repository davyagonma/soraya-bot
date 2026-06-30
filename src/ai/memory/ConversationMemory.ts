import { config } from '../../config';
import { messageRepository } from '../../repositories/ConversationRepository';
import { ChatMessage, messageRoleMap } from '../../types';

export class ConversationMemory {
  private maxMessages: number;

  constructor(maxMessages = config.CHAT_MAX_HISTORY) {
    this.maxMessages = maxMessages;
  }

  async getRecentMessages(conversationId: string): Promise<ChatMessage[]> {
    const messages = await messageRepository.findRecent(conversationId, this.maxMessages);
    return messages.map((m) => ({
      role: messageRoleMap[m.role],
      content: m.content,
      ...(m.toolCallId && { toolCallId: m.toolCallId }),
      ...(m.toolName && { name: m.toolName }),
    }));
  }

  async saveUserMessage(conversationId: string, content: string): Promise<void> {
    await messageRepository.create({ conversationId, role: 'USER', content });
  }

  async saveAssistantMessage(conversationId: string, content: string): Promise<void> {
    await messageRepository.create({ conversationId, role: 'ASSISTANT', content });
  }

  async saveToolResult(conversationId: string, toolCallId: string, toolName: string, result: unknown): Promise<void> {
    await messageRepository.create({
      conversationId,
      role: 'TOOL',
      content: JSON.stringify(result),
      toolCallId,
      toolName,
    });
  }
}

export const conversationMemory = new ConversationMemory();
