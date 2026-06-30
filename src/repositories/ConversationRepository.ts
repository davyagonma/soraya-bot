import prisma from '../database/prisma';
import { Conversation, Message, MessageRole, Prisma } from '@prisma/client';

export class ConversationRepository {
  async findById(id: string): Promise<Conversation | null> {
    return prisma.conversation.findUnique({ where: { id } });
  }

  async findByUser(userId: string): Promise<Conversation[]> {
    return prisma.conversation.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
  }

  async findByIdWithMessages(id: string, userId: string): Promise<(Conversation & { messages: Message[] }) | null> {
    return prisma.conversation.findFirst({
      where: { id, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  async create(data: { userId: string; title?: string; channel?: string }): Promise<Conversation> {
    return prisma.conversation.create({ data });
  }

  async updateTitle(id: string, title: string): Promise<Conversation> {
    return prisma.conversation.update({ where: { id }, data: { title } });
  }
}

export class MessageRepository {
  async findRecent(conversationId: string, limit: number): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return messages.reverse();
  }

  async create(data: {
    conversationId: string;
    role: MessageRole;
    content: string;
    toolName?: string;
    toolCallId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<Message> {
    return prisma.message.create({
      data: {
        ...data,
        metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined,
      },
    });
  }
}

export const conversationRepository = new ConversationRepository();
export const messageRepository = new MessageRepository();
