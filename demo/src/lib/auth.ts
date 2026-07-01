import type { AuthSession } from './types';

const STORAGE_KEY = 'soraya_auth';

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAccessToken(): string | null {
  return getSession()?.accessToken ?? null;
}

export function getUser() {
  return getSession()?.user ?? null;
}

export function isLoggedIn(): boolean {
  return Boolean(getAccessToken());
}

export function isAdmin(): boolean {
  return getUser()?.role === 'ADMIN';
}
