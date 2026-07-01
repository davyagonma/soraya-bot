import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { api } from '../lib/api';
import type { EducationTopic } from '../lib/types';

const IMAGES: Record<string, string> = {
  bitcoin: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=400&fit=crop',
  lightning: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
  wallet: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&h=400&fit=crop',
  security: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop',
};

export default function LearnPage() {
  const [topics, setTopics] = useState<EducationTopic[]>([]);
  const [filtered, setFiltered] = useState<EducationTopic[] | null>(null);

  useEffect(() => {
    api.getTopics().then((r) => setTopics(r.data)).catch(() => {});
  }, []);

  const display = filtered ?? topics;

  return (
    <AppShell activeNav="learn" activeSidebar="learn" withSidebar={false}>
      <div className="max-w-container-max mx-auto px-gutter md:px-12 py-16 flex-1">
        <header className="mb-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high text-primary rounded-full mb-4">
            <span className="material-symbols-outlined text-[20px]">school</span>
            <span className="font-label-sm">ACADEMY SORAYA</span>
          </div>
          <h1 className="font-headline-xl text-primary mb-4">Votre guide sage dans l&apos;univers du Bitcoin.</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl">Ressources simplifiées et protection contre les risques du marché.</p>
        </header>

        <section className="mb-16">
          <h2 className="font-headline-lg text-primary mb-8">Articles Vedettes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {display.length ? display.slice(0, 6).map((t) => (
              <div key={t.slug} className="glass-card rounded-xl overflow-hidden flex flex-col hover:-translate-y-1 transition-transform">
                <div className="h-48 overflow-hidden bg-surface-container">
                  <img src={IMAGES[t.slug] || IMAGES.bitcoin} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="font-label-sm text-secondary mb-2 uppercase">{t.tags?.[0] || 'Crypto'}</span>
                  <h3 className="font-headline-md text-primary mb-3">{t.title}</h3>
                  <p className="text-on-surface-variant mb-6 flex-1">{t.summary}</p>
                  <Link to={`/topic/${t.slug}`} className="flex items-center gap-2 text-primary font-label-md no-underline">
                    Lire l&apos;article <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </Link>
                </div>
              </div>
            )) : [1, 2, 3].map((i) => <div key={i} className="glass-card rounded-xl h-80 animate-pulse" />)}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="font-headline-lg text-primary mb-8 text-center">Explorez par sujet</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[...new Set(topics.flatMap((t) => t.tags || []))].map((tag) => (
              <button key={tag} type="button" onClick={() => setFiltered(topics.filter((t) => t.tags?.includes(tag)))}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-outline-variant rounded-full hover:bg-surface-container-high hover:border-primary transition-all">
                <span className="material-symbols-outlined text-primary">tag</span> {tag}
              </button>
            ))}
            {filtered && (
              <button type="button" onClick={() => setFiltered(null)} className="px-6 py-3 text-primary font-label-md underline">
                Tout afficher
              </button>
            )}
          </div>
        </section>

        <section className="text-center bg-surface-container-low rounded-3xl p-12 border border-surface-container-high">
          <h2 className="font-headline-lg text-primary mb-4">Besoin d&apos;un conseil personnalisé ?</h2>
          <Link to="/assistant" className="inline-flex bg-primary text-on-primary px-8 py-4 rounded-xl font-headline-md items-center gap-2 no-underline">
            <span className="material-symbols-outlined">smart_toy</span> Parler à l&apos;Assistant
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
