export const API_BASE = `${window.location.origin}/api`;

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface CryptoPrice {
  symbol: string;
  name: string;
  prices: Record<string, number>;
  change24h?: number;
  lastUpdated: string;
}

export interface EducationTopic {
  slug: string;
  title: string;
  summary: string;
  content?: string;
  tags: string[];
}

export interface NewsArticle {
  title: string;
  summary: string;
  source: string;
  url?: string;
  publishedAt: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  currency: string;
  condition: 'ABOVE' | 'BELOW';
  isActive: boolean;
  createdAt: string;
}

export interface ScamResult {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
  recommendations: string[];
}

export interface Conversation {
  id: string;
  title?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: string;
  content: string;
}

export interface AdminStats {
  userCount: number;
  conversationCount: number;
  alertCount: number;
  newsCount: number;
  scamCount: number;
  recentUsers: Array<{ id: string; email: string; name?: string; role: string; createdAt: string }>;
}
