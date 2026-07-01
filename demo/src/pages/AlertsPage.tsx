import { useEffect, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { api } from '../lib/api';
import type { PriceAlert } from '../lib/types';
import { formatCurrency, timeAgo } from '../lib/utils';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const res = await api.getAlerts();
      setAlerts(res.data);
    } catch { /* ignore */ }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await api.createAlert({
        symbol: fd.get('symbol') as string,
        targetPrice: Number(fd.get('targetPrice')),
        currency: fd.get('currency') as string,
        condition: fd.get('condition') as string,
      });
      e.currentTarget.reset();
      await load();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell activeSidebar="alerts">
      <div className="max-w-[900px] mx-auto p-gutter md:p-12 space-y-12 flex-1">
        <header>
          <h1 className="font-headline-lg text-primary">Mes alertes de prix</h1>
          <p className="text-on-surface-variant">Créez des alertes via l&apos;API POST /alerts</p>
        </header>

        <form onSubmit={handleCreate} className="bg-primary-container rounded-2xl p-8 text-on-primary-container space-y-4">
          <h3 className="font-headline-md text-white">Nouvelle alerte</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-label-sm uppercase opacity-70 mb-1 block">Symbole</label>
              <select name="symbol" className="w-full rounded-xl py-3 px-4 text-on-surface">
                <option value="BTC">BTC</option><option value="ETH">ETH</option><option value="USDT">USDT</option>
              </select>
            </div>
            <div>
              <label className="font-label-sm uppercase opacity-70 mb-1 block">Prix cible</label>
              <input name="targetPrice" type="number" required placeholder="100000" className="w-full rounded-xl py-3 px-4 text-on-surface" />
            </div>
            <div>
              <label className="font-label-sm uppercase opacity-70 mb-1 block">Devise</label>
              <select name="currency" className="w-full rounded-xl py-3 px-4 text-on-surface">
                <option value="USD">USD</option><option value="XOF">XOF</option><option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className="font-label-sm uppercase opacity-70 mb-1 block">Condition</label>
              <select name="condition" className="w-full rounded-xl py-3 px-4 text-on-surface">
                <option value="ABOVE">Au-dessus de</option><option value="BELOW">En-dessous de</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="bg-secondary-container text-on-secondary-container px-8 py-3 rounded-xl font-label-md disabled:opacity-60">
            Créer l&apos;alerte
          </button>
        </form>

        <div className="space-y-4">
          {alerts.length ? alerts.map((a) => (
            <div key={a.id} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="font-bold text-primary text-lg">
                  {a.symbol} {a.condition === 'ABOVE' ? '>' : '<'} {formatCurrency(a.targetPrice, a.currency)}
                </p>
                <p className="text-sm text-on-surface-variant">{a.isActive ? 'Active' : 'Déclenchée'} · {timeAgo(a.createdAt)}</p>
              </div>
              <button type="button" onClick={async () => { await api.deleteAlert(a.id); load(); }}
                className="text-error hover:underline font-label-md text-sm">Supprimer</button>
            </div>
          )) : (
            <p className="text-on-surface-variant text-center py-8">Aucune alerte. Créez-en une ci-dessus.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
