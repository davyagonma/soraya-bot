import prisma from '../database/prisma';
import { Role, User } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { telegramId } });
  }

  async findByWhatsAppId(whatsappId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { whatsappId } });
  }

  async create(data: {
    email: string;
    password: string;
    name?: string;
    role?: Role;
    telegramId?: string;
    whatsappId?: string;
  }): Promise<User> {
    return prisma.user.create({ data });
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<User> {
    return prisma.user.update({ where: { id }, data: { refreshToken } });
  }
}

export const userRepository = new UserRepository();
