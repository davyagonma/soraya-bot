/** Client HTTP pour l'API SORAYA */
const SorayaAPI = {
  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = SorayaAuth?.getAccessToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${SORAYA_CONFIG.API_BASE}${path}`, { ...options, headers });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(body.message || body.error || `Erreur ${res.status}`);
      err.status = res.status;
      err.body = body;
      throw err;
    }
    return body;
  },

  // Auth
  login(email, password) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  register(email, password, name) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) });
  },
  refresh(refreshToken) {
    return this.request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) });
  },

  // Crypto
  getPrice(symbol, currencies = 'USD,XOF') {
    return this.request(`/crypto/price?symbol=${symbol}&currencies=${currencies}`);
  },
  getTop(limit = 10, currency = 'USD') {
    return this.request(`/crypto/top?limit=${limit}&currency=${currency}`);
  },
  getMarkets(currency = 'XOF') {
    return this.request(`/crypto/markets?currency=${currency}`);
  },
  getHistory(symbol, days = 7, currency = 'USD') {
    return this.request(`/crypto/history?symbol=${symbol}&days=${days}&currency=${currency}`);
  },

  // Conversion
  convert(amount, from, to) {
    return this.request(`/convert?amount=${amount}&from=${from}&to=${to}`);
  },

  // Education
  getTopics() {
    return this.request('/education/topics');
  },
  getTopic(slug) {
    return this.request(`/education/${slug}`);
  },
  searchEducation(q) {
    return this.request(`/education/search?q=${encodeURIComponent(q)}`);
  },

  // News
  getNews(limit = 10) {
    return this.request(`/news?limit=${limit}`);
  },

  // Security & Scam
  getSecurityTips() {
    return this.request('/security/tips');
  },
  getPhishingExamples() {
    return this.request('/security/phishing');
  },
  getCommonScams() {
    return this.request('/security/scams');
  },
  analyzeRisk(description) {
    return this.request('/risk-analysis', { method: 'POST', body: JSON.stringify({ description }) });
  },

  // Alerts (auth)
  getAlerts() {
    return this.request('/alerts');
  },
  createAlert(data) {
    return this.request('/alerts', { method: 'POST', body: JSON.stringify(data) });
  },
  deleteAlert(id) {
    return this.request(`/alerts/${id}`, { method: 'DELETE' });
  },

  // Chat (auth)
  sendChat(message, conversationId, channel = 'web') {
    const body = { message, channel };
    if (conversationId) body.conversationId = conversationId;
    return this.request('/chat', { method: 'POST', body: JSON.stringify(body) });
  },
  getConversations() {
    return this.request('/chat/conversations');
  },
  getConversation(id) {
    return this.request(`/chat/conversations/${id}`);
  },

  // Admin (auth ADMIN)
  getAdminStats() {
    return this.request('/admin/stats');
  },

  // Health & Dev
  getHealth() {
    return this.request('/health');
  },
  getTestData() {
    return this.request('/dev/test-data');
  },
};
