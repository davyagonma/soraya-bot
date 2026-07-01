import { getAccessToken } from './auth';
import { API_BASE } from './types';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = (body as { message?: string }).message || `Erreur ${res.status}`;
    throw new ApiError(msg, res.status, body);
  }

  return body as T;
}

type ApiResponse<T> = { success: boolean; data: T };

export const api = {
  login: (email: string, password: string) =>
    request<ApiResponse<import('./types').AuthSession>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name?: string) =>
    request<ApiResponse<import('./types').AuthSession>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  getPrice: (symbol: string, currencies = 'USD,XOF') =>
    request<ApiResponse<import('./types').CryptoPrice>>(`/crypto/price?symbol=${symbol}&currencies=${currencies}`),

  getMarkets: (currency = 'XOF') =>
    request<ApiResponse<import('./types').CryptoPrice[]>>(`/crypto/markets?currency=${currency}`),

  convert: (amount: number, from: string, to: string) =>
    request<ApiResponse<{ from: { amount: number; currency: string }; to: { amount: number; currency: string }; rate: number }>>(
      `/convert?amount=${amount}&from=${from}&to=${to}`,
    ),

  getTopics: () => request<ApiResponse<import('./types').EducationTopic[]>>('/education/topics'),

  getTopic: (slug: string) => request<ApiResponse<import('./types').EducationTopic>>(`/education/${slug}`),

  getNews: (limit = 10) => request<ApiResponse<import('./types').NewsArticle[]>>(`/news?limit=${limit}`),

  getSecurityTips: () => request<ApiResponse<Array<{ title: string; description: string }>>>('/security/tips'),

  getCommonScams: () => request<ApiResponse<Array<{ name: string; description: string }>>>('/security/scams'),

  analyzeRisk: (description: string) =>
    request<ApiResponse<import('./types').ScamResult>>('/risk-analysis', {
      method: 'POST',
      body: JSON.stringify({ description }),
    }),

  getAlerts: () => request<ApiResponse<import('./types').PriceAlert[]>>('/alerts'),

  createAlert: (data: { symbol: string; targetPrice: number; currency: string; condition: string }) =>
    request<ApiResponse<import('./types').PriceAlert>>('/alerts', { method: 'POST', body: JSON.stringify(data) }),

  deleteAlert: (id: string) => request<{ success: boolean }>(`/alerts/${id}`, { method: 'DELETE' }),

  getConversations: () => request<ApiResponse<import('./types').Conversation[]>>('/chat/conversations'),

  getConversation: (id: string) =>
    request<ApiResponse<{ id: string; messages: import('./types').Message[] }>>(`/chat/conversations/${id}`),

  sendChat: (message: string, conversationId?: string) =>
    request<ApiResponse<{ reply: string; conversationId: string }>>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, channel: 'web', ...(conversationId ? { conversationId } : {}) }),
    }),

  getAdminStats: () => request<ApiResponse<import('./types').AdminStats>>('/admin/stats'),

  getHealth: () => request<{ success: boolean; status: string; timestamp: string }>('/health'),

  getTestData: () => request<ApiResponse<unknown>>('/dev/test-data'),
};
