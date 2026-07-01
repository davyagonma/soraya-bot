/** Gestion JWT et protection des pages */
const SorayaAuth = {
  STORAGE_KEY: 'soraya_auth',

  save(session) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
  },

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || 'null');
    } catch {
      return null;
    }
  },

  getAccessToken() {
    return this.getSession()?.accessToken ?? null;
  },

  getUser() {
    return this.getSession()?.user ?? null;
  },

  isAdmin() {
    return this.getUser()?.role === 'ADMIN';
  },

  isLoggedIn() {
    return Boolean(this.getAccessToken());
  },

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    window.location.href = '/demo/login.html';
  },

  saveFromAuthResponse(data) {
    this.save({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  },

  /** Redirige vers login si non connecté */
  requireAuth(redirectTo = '/demo/login.html') {
    if (!this.isLoggedIn()) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `${redirectTo}?next=${next}`;
      return false;
    }
    return true;
  },

  /** Redirige si déjà connecté (pages auth) */
  redirectIfLoggedIn() {
    if (!this.isLoggedIn()) return;
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next) {
      window.location.href = next;
      return;
    }
    window.location.href = this.isAdmin() ? '/demo/admin.html' : '/demo/dashboard.html';
  },

  /** Redirige si pas admin */
  requireAdmin() {
    if (!this.requireAuth()) return false;
    if (!this.isAdmin()) {
      window.location.href = '/demo/dashboard.html';
      return false;
    }
    return true;
  },
};
