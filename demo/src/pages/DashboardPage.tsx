import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { api } from '../lib/api';
import type { CryptoPrice } from '../lib/types';
import { formatCurrency, formatNumber, formatPercent, percentClass, timeAgo } from '../lib/utils';

const CRYPTO_META: Record<string, { color: string; icon: string }> = {
  BTC: { color: '#F7931A', icon: 'currency_bitcoin' },
  ETH: { color: '#627EEA', icon: 'atm' },
  USDT: { color: '#26A17B', icon: 'currency_exchange' },
};

function Sparkline({ change }: { change?: number }) {
  const up = (change ?? 0) >= 0;
  const color = up ? 'bg-tertiary-fixed-dim' : 'bg-error';
  const heights = up ? ['h-1/3', 'h-1/2', 'h-2/3', 'h-3/4', 'h-1/2', 'h-full', 'h-4/5'] : ['h-full', 'h-4/5', 'h-2/3', 'h-3/4', 'h-1/2', 'h-1/3', 'h-1/4'];
  return (
    <div className="mt-4 h-12 w-full flex items-end gap-1">
      {heights.map((h, i) => (
        <div key={i} className={`flex-1 ${color} opacity-${20 + i * 10} ${h} rounded-t-sm`} style={{ opacity: (20 + i * 10) / 100 }} />
      ))}
    </div>
  );
}

function CryptoCard({ crypto, currency }: { crypto: CryptoPrice; currency: string }) {
  const meta = CRYPTO_META[crypto.symbol] ?? { color: '#455f88', icon: 'token' };
  const localPrice = crypto.prices[currency] ?? crypto.prices.XOF;
  const change = crypto.change24h ?? 0;

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 crypto-card-hover">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${meta.color}1a` }}>
            <span className="material-symbols-outlined" style={{ color: meta.color }}>{meta.icon}</span>
          </div>
          <div>
            <p className="font-label-sm text-on-surface-variant">{crypto.name}</p>
            <p className="font-bold text-primary">{crypto.symbol}</p>
          </div>
        </div>
        <span className={`${percentClass(change)} font-label-sm flex items-center gap-0.5`}>
          <span className="material-symbols-outlined text-[16px]">{change >= 0 ? 'trending_up' : 'trending_down'}</span>
          {formatPercent(change)}
        </span>
      </div>
      <div className="space-y-1">
        <p className="font-headline-md text-primary">{formatCurrency(localPrice, currency)}</p>
        <p className="text-label-sm text-on-surface-variant">{formatCurrency(crypto.prices.USD, 'USD')}</p>
      </div>
      <Sparkline change={change} />
    </div>
  );
}

export default function DashboardPage() {
  const [currency, setCurrency] = useState('XOF');
  const [cards, setCards] = useState<CryptoPrice[]>([]);
  const [markets, setMarkets] = useState<CryptoPrice[]>([]);
  const [lastUpdate, setLastUpdate] = useState('');
  const [error, setError] = useState(false);
  const [amount, setAmount] = useState('50000');
  const [convertFrom, setConvertFrom] = useState('XOF');
  const [convertTo, setConvertTo] = useState('BTC');
  const [convertResult, setConvertResult] = useState('');
  const [convertRate, setConvertRate] = useState('—');

  const load = useCallback(async () => {
    try {
      const [btc, eth, usdt, mkt] = await Promise.all([
        api.getPrice('BTC', `USD,${currency}`),
        api.getPrice('ETH', `USD,${currency}`),
        api.getPrice('USDT', `USD,${currency}`),
        api.getMarkets(currency),
      ]);
      setCards([btc.data, eth.data, usdt.data]);
      setMarkets(mkt.data);
      setLastUpdate(timeAgo(btc.data.lastUpdated));
      setError(false);
    } catch {
      setError(true);
    }
  }, [currency]);

  const updateConverter = useCallback(async () => {
    const val = parseFloat(amount) || 0;
    try {
      const res = await api.convert(val, convertFrom, convertTo);
      setConvertResult(res.data.to.amount.toFixed(convertTo === 'BTC' ? 8 : 2));
      setConvertRate(`1 ${convertFrom} = ${res.data.rate.toFixed(convertTo === 'BTC' ? 10 : 4)} ${convertTo}`);
    } catch {
      setConvertResult('—');
    }
  }, [amount, convertFrom, convertTo]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { updateConverter(); }, [updateConverter]);

  return (
    <AppShell activeNav="dashboard" activeSidebar="home">
      <div className="max-w-[1200px] mx-auto p-gutter md:p-12 space-y-12 flex-1">
        {error && <div className="p-4 bg-error-container text-on-error-container rounded-xl">Impossible de charger les données. Vérifiez que l&apos;API est démarrée.</div>}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-primary">Tableau de bord</h1>
            <p className="text-on-surface-variant">Surveillez les marchés et convertissez vos actifs instantanément.</p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full text-primary font-label-md">
            <span className="material-symbols-outlined text-[18px]">update</span>
            Dernière mise à jour: {lastUpdate || '…'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cards.length ? cards.map((c) => <CryptoCard key={c.symbol} crypto={c} currency={currency} />) :
                [1, 2, 3].map((i) => <div key={i} className="bg-surface-container-lowest p-6 rounded-xl border animate-pulse h-48" />)}
            </div>

            <div id="rates" className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden">
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center flex-wrap gap-4">
                <h3 className="font-headline-md text-primary">Tarifs Régionaux ({currency})</h3>
                <div className="flex gap-2">
                  {['XOF', 'XAF', 'NGN'].map((c) => (
                    <button key={c} type="button" onClick={() => setCurrency(c)}
                      className={`px-4 py-1 rounded-full text-label-sm ${c === currency ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container-high text-on-surface-variant'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-label-md">
                      <th className="px-6 py-4">Paire</th>
                      <th className="px-6 py-4">Prix Achat</th>
                      <th className="px-6 py-4">Prix Vente</th>
                      <th className="px-6 py-4">Variation 24h</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {markets.slice(0, 6).map((m, i) => {
                      const price = m.prices[currency] ?? 0;
                      const change = m.change24h ?? 0;
                      return (
                        <tr key={m.symbol} className="hover:bg-surface-container-low/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-primary">{m.symbol} / {currency}</span>
                              {i === 0 && <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] rounded uppercase font-bold">Best Rate</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-label-md">{formatNumber(price * 1.012, 0)}</td>
                          <td className="px-6 py-4 font-label-md">{formatNumber(price * 0.988, 0)}</td>
                          <td className={`px-6 py-4 ${percentClass(change)}`}>{formatPercent(change)}</td>
                          <td className="px-6 py-4 text-right"><Link to="/assistant" className="text-primary hover:underline font-label-md">Détails</Link></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-primary-container text-on-primary-container rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div>
                  <h3 className="font-headline-md text-white mb-2">Convertisseur Instantané</h3>
                  <p className="text-on-primary-container/80">Estimation en temps réel via l&apos;API.</p>
                </div>
                <div>
                  <label className="font-label-sm uppercase opacity-70 mb-2 block">Vous envoyez</label>
                  <div className="flex gap-2">
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl py-4 px-4 text-white text-xl font-bold outline-none focus:ring-2 focus:ring-secondary-container" />
                    <select value={convertFrom} onChange={(e) => setConvertFrom(e.target.value)}
                      className="bg-white/20 rounded-xl px-3 text-white font-bold border border-white/10">
                      <option value="XOF">FCFA</option><option value="USD">USD</option><option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-label-sm uppercase opacity-70 mb-2 block">Vous recevez</label>
                  <div className="flex gap-2">
                    <input readOnly value={convertResult} className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white/90 text-xl font-bold" />
                    <select value={convertTo} onChange={(e) => setConvertTo(e.target.value)}
                      className="bg-[#F7931A]/30 rounded-xl px-3 text-white font-bold border border-[#F7931A]/50">
                      <option value="BTC">BTC</option><option value="ETH">ETH</option><option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between text-label-sm">
                  <span className="opacity-70">Taux</span>
                  <span className="font-bold">{convertRate}</span>
                </div>
                <Link to="/assistant" className="w-full bg-secondary-container text-on-secondary-container font-headline-md py-5 rounded-xl hover:opacity-90 flex items-center justify-center gap-3 no-underline">
                  <span className="material-symbols-outlined">bolt</span> Demander à Soraya
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
