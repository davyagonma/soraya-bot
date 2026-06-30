import { conversationRepository } from '../repositories/ConversationRepository';
import { conversationMemory } from '../ai/memory/ConversationMemory';
import { aiOrchestrator } from '../ai/orchestrator/AIOrchestrator';
import { ChatResponse } from '../types';
import { NotFoundError } from '../utils/errors';

export class ChatService {
  async listConversations(userId: string) {
    return conversationRepository.findByUser(userId);
  }

  async getConversation(userId: string, conversationId: string) {
    const conversation = await conversationRepository.findByIdWithMessages(conversationId, userId);
    if (!conversation) throw new NotFoundError('Conversation not found');
    return conversation;
  }

  async chat(userId: string, message: string, conversationId?: string, channel = 'web'): Promise<ChatResponse> {
    let conversation;

    if (conversationId) {
      conversation = await conversationRepository.findById(conversationId);
      if (!conversation) {
        throw new NotFoundError('Conversation not found — vérifiez l\'ID ou exécutez npm run prisma:seed');
      }
      if (conversation.userId !== userId) {
        throw new NotFoundError(
          'Conversation not found — cette conversation appartient à un autre utilisateur. Connectez-vous avec demo@soraya.africa',
        );
      }
    } else {
      conversation = await conversationRepository.create({
        userId,
        title: message.slice(0, 80),
        channel,
      });
    }

    await conversationMemory.saveUserMessage(conversation.id, message);

    const history = await conversationMemory.getRecentMessages(conversation.id);
    const { reply, toolsUsed, sources, provider } = await aiOrchestrator.process(history, userId);

    await conversationMemory.saveAssistantMessage(conversation.id, reply);

    return {
      reply,
      conversationId: conversation.id,
      toolsUsed: toolsUsed.length ? toolsUsed : undefined,
      sources: sources?.length ? sources : undefined,
      provider,
    };
  }
}

export const chatService = new ChatService();
