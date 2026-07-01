export function formatNumber(n: number | null | undefined, decimals = 0): string {
  if (n == null || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}

export function formatCurrency(amount: number | null | undefined, currency = 'XOF'): string {
  if (amount == null) return '—';
  const c = currency.toUpperCase();
  if (['BTC', 'ETH'].includes(c)) return `${formatNumber(amount, 8)} ${c}`;
  if (c === 'USD') return `$${formatNumber(amount, 2)}`;
  return `${formatNumber(amount, 0)} ${c}`;
}

export function formatPercent(change: number | null | undefined): string {
  if (change == null) return '—';
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
}

export function percentClass(change: number | null | undefined): string {
  if (change == null) return 'text-on-surface-variant';
  return change >= 0 ? 'text-on-tertiary-container' : 'text-error';
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  return new Date(iso).toLocaleDateString('fr-FR');
}
