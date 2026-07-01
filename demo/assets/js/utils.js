/** Utilitaires d'affichage */
const SorayaUtils = {
  formatNumber(n, decimals = 0) {
    if (n == null || Number.isNaN(n)) return '—';
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(n);
  },

  formatCurrency(amount, currency = 'XOF') {
    if (amount == null) return '—';
    const c = currency.toUpperCase();
    if (['BTC', 'ETH'].includes(c)) {
      return `${this.formatNumber(amount, 8)} ${c}`;
    }
    if (c === 'USD') {
      return `$${this.formatNumber(amount, 2)}`;
    }
    return `${this.formatNumber(amount, 0)} ${c}`;
  },

  formatPercent(change) {
    if (change == null) return '—';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  },

  percentClass(change) {
    if (change == null) return 'text-on-surface-variant';
    return change >= 0 ? 'text-on-tertiary-container' : 'text-error';
  },

  timeAgo(iso) {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return new Date(iso).toLocaleDateString('fr-FR');
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  showToast(message, type = 'info') {
    const el = document.createElement('div');
    const colors = {
      info: 'bg-primary text-on-primary',
      error: 'bg-error text-on-error',
      success: 'bg-tertiary-container text-tertiary-fixed',
    };
    el.className = `fixed bottom-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-xl font-label-md text-sm ${colors[type] || colors.info} transition-opacity`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, 3500);
  },

  async withLoading(btn, fn) {
    if (!btn) return fn();
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>';
    try {
      return await fn();
    } finally {
      btn.disabled = false;
      btn.innerHTML = orig;
    }
  },
};
