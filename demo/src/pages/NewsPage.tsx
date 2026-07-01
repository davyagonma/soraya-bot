import { useEffect, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { api } from '../lib/api';
import type { NewsArticle } from '../lib/types';
import { timeAgo } from '../lib/utils';

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    api.getNews(15).then((r) => setArticles(r.data)).catch(() => {});
  }, []);

  return (
    <AppShell activeSidebar="news">
      <div className="max-w-[900px] mx-auto p-gutter md:p-12 space-y-12 flex-1">
        <header>
          <h1 className="font-headline-lg text-primary">Actualités Crypto</h1>
          <p className="text-on-surface-variant">Dernières nouvelles via GET /api/news</p>
        </header>
        <div className="space-y-4">
          {articles.length ? articles.map((a, i) => (
            <article key={i} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className="font-headline-md text-primary">{a.title}</h3>
                <span className="text-label-sm text-on-surface-variant shrink-0">{timeAgo(a.publishedAt)}</span>
              </div>
              <p className="text-on-surface-variant text-sm mb-3">{a.summary}</p>
              <div className="flex justify-between items-center">
                <span className="text-label-sm text-secondary font-label-md">{a.source}</span>
                {a.url && <a href={a.url} target="_blank" rel="noreferrer" className="text-primary font-label-md text-sm hover:underline">Lire →</a>}
              </div>
            </article>
          )) : [1, 2, 3].map((i) => <div key={i} className="bg-surface-container-lowest p-6 rounded-xl border animate-pulse h-24" />)}
        </div>
      </div>
    </AppShell>
  );
}
