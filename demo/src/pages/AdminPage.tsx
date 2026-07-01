import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { api } from '../lib/api';
import { getUser } from '../lib/auth';
import type { AdminStats, CryptoPrice } from '../lib/types';
import { formatCurrency, formatNumber, formatPercent, percentClass } from '../lib/utils';

export default function AdminPage() {
  const user = getUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [markets, setMarkets] = useState<CryptoPrice[]>([]);
  const [health, setHealth] = useState('');

  async function load() {
    try {
      const [h, s, m] = await Promise.all([api.getHealth(), api.getAdminStats(), api.getMarkets('USD')]);
      setHealth(`${h.status} · ${new Date(h.timestamp).toLocaleTimeString('fr-FR')}`);
      setStats(s.data);
      setMarkets(m.data);
    } catch { /* ignore */ }
  }

  useEffect(() => { load(); }, []);

  const statLabels = ['Utilisateurs', 'Conversations', 'Alertes', 'Actualités', 'Analyses scam'];
  const statValues = stats ? [stats.userCount, stats.conversationCount, stats.alertCount, stats.newsCount, stats.scamCount] : [];

  return (
    <AppShell activeSidebar="admin">
      <div className="max-w-[1200px] mx-auto p-gutter md:p-12 space-y-12 flex-1">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-fixed text-secondary rounded-full mb-2 font-label-sm">
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> ADMIN
            </div>
            <h1 className="font-headline-lg text-primary">Tableau de bord administrateur</h1>
            <p className="text-on-surface-variant">Connecté en tant que {user?.email}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-primary font-label-md">
            <span className="material-symbols-outlined text-[18px]">monitor_heart</span> API {health || '…'}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statLabels.map((label, i) => (
            <div key={label} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30">
              <p className="text-label-sm text-on-surface-variant uppercase mb-2">{label}</p>
              <p className="font-headline-md text-primary">{stats ? formatNumber(statValues[i], 0) : '—'}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/20">
              <h3 className="font-headline-md text-primary">Utilisateurs récents</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-md">
                    <th className="px-6 py-3">Email</th><th className="px-6 py-3">Rôle</th><th className="px-6 py-3">Inscrit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {stats?.recentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-container-low/50">
                      <td className="px-6 py-3">{u.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${u.role === 'ADMIN' ? 'bg-secondary-fixed text-secondary' : 'bg-primary-fixed text-primary'}`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-3 text-on-surface-variant">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
            <h3 className="font-headline-md text-primary mb-4">Marchés (aperçu)</h3>
            <div className="space-y-3">
              {markets.slice(0, 5).map((m) => (
                <div key={m.symbol} className="flex justify-between items-center p-3 bg-surface-container-low rounded-lg">
                  <span className="font-bold text-primary">{m.symbol}</span>
                  <span>{formatCurrency(m.prices?.USD, 'USD')}</span>
                  <span className={`text-sm ${percentClass(m.change24h)}`}>{formatPercent(m.change24h)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-primary-container rounded-2xl p-6 text-on-primary-container">
          <h3 className="font-headline-md text-white mb-4">Outils</h3>
          <div className="flex flex-wrap gap-4">
            <a href="/api/docs" target="_blank" rel="noreferrer" className="bg-white/10 px-6 py-3 rounded-xl hover:bg-white/20 font-label-md no-underline text-inherit">Swagger API</a>
            <Link to="/assistant" className="bg-white/10 px-6 py-3 rounded-xl hover:bg-white/20 font-label-md no-underline text-inherit">Tester le Chat</Link>
            <button type="button" onClick={load} className="bg-secondary-container text-on-secondary-container px-6 py-3 rounded-xl font-label-md">Rafraîchir</button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
