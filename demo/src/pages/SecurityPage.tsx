import { useEffect, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { api } from '../lib/api';
import type { ScamResult } from '../lib/types';

const LEVEL_CLASS: Record<string, string> = {
  LOW: 'text-on-tertiary-container',
  MEDIUM: 'text-secondary',
  HIGH: 'text-error',
  CRITICAL: 'text-error font-bold',
};

export default function SecurityPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ScamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<Array<{ title: string; description: string }>>([]);
  const [scams, setScams] = useState<Array<{ name: string; description: string }>>([]);

  useEffect(() => {
    Promise.all([api.getSecurityTips(), api.getCommonScams()])
      .then(([t, s]) => { setTips(t.data); setScams(s.data); })
      .catch(() => {});
  }, []);

  async function analyze(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await api.analyzeRisk(input);
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell activeNav="security" activeSidebar="security">
      <div className="max-w-[1200px] mx-auto p-gutter md:p-12 space-y-12 flex-1">
        <header>
          <h1 className="font-headline-lg text-primary">Risk Shield</h1>
          <p className="text-on-surface-variant">Analysez les arnaques et consultez les conseils de sécurité SORAYA.</p>
        </header>

        <section className="bg-primary-container rounded-3xl p-8 md:p-12 text-on-primary-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-headline-lg text-white mb-4">Détecteur de Risques</h2>
              <p className="mb-6 opacity-80">Décrivez une opportunité suspecte. L&apos;API analyse les signaux d&apos;alerte.</p>
              <form onSubmit={analyze} className="space-y-4">
                <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4}
                  placeholder="Ex: Investissement garanti 50% par mois sans risque — plateforme VIP"
                  className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 p-4 outline-none focus:ring-2 focus:ring-secondary-container" />
                <button type="submit" disabled={loading}
                  className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-xl font-headline-md hover:opacity-90 flex items-center gap-2 disabled:opacity-60">
                  <span className="material-symbols-outlined">search_check</span>
                  {loading ? 'Analyse…' : 'Analyser'}
                </button>
              </form>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 min-h-[200px] flex items-center justify-center">
              {result ? (
                <div className="w-full text-left text-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-label-md uppercase">Score</span>
                    <span className={`text-3xl font-bold ${LEVEL_CLASS[result.level]}`}>{result.score}/100</span>
                  </div>
                  <p className="mb-2"><strong>Niveau:</strong> <span className={LEVEL_CLASS[result.level]}>{result.level}</span></p>
                  <p className="mb-4 opacity-90">{result.explanation}</p>
                  <ul className="space-y-2 text-sm opacity-80">
                    {result.recommendations.map((r) => <li key={r}>• {r}</li>)}
                  </ul>
                </div>
              ) : (
                <span className="text-white/60">Les résultats s&apos;afficheront ici</span>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
            <h3 className="font-headline-md text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">verified_user</span> Conseils de sécurité
            </h3>
            <div className="space-y-4">
              {tips.slice(0, 5).map((t) => (
                <div key={t.title} className="p-4 bg-surface-container-low rounded-xl">
                  <h4 className="font-bold text-primary text-sm mb-1">{t.title}</h4>
                  <p className="text-sm text-on-surface-variant">{t.description}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
            <h3 className="font-headline-md text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">gpp_maybe</span> Arnaques courantes
            </h3>
            <div className="space-y-4">
              {scams.slice(0, 5).map((s) => (
                <div key={s.name} className="p-4 bg-error-container/30 rounded-xl border border-error/20">
                  <h4 className="font-bold text-error text-sm mb-1">{s.name}</h4>
                  <p className="text-sm text-on-surface-variant">{s.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
