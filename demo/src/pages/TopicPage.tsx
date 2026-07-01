import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { api } from '../lib/api';
import type { EducationTopic } from '../lib/types';

export default function TopicPage() {
  const { slug = 'bitcoin' } = useParams();
  const [topic, setTopic] = useState<EducationTopic | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.getTopic(slug).then((r) => setTopic(r.data)).catch(() => setError(true));
  }, [slug]);

  return (
    <AppShell activeNav="learn" withSidebar={false}>
      <div className="max-w-3xl mx-auto px-gutter py-16 flex-1">
        <Link to="/learn" className="text-primary font-label-md flex items-center gap-1 mb-8 hover:underline no-underline">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Retour à l&apos;Académie
        </Link>
        <article className="bg-white rounded-2xl p-8 md:p-12 border border-outline-variant/30 shadow-sm">
          {error && <p className="text-error">Article introuvable.</p>}
          {!topic && !error && <div className="animate-pulse space-y-4"><div className="h-8 bg-surface-container rounded w-3/4" /><div className="h-4 bg-surface-container rounded" /></div>}
          {topic && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {topic.tags?.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-label-sm">{tag}</span>
                ))}
              </div>
              <h1 className="font-headline-lg text-primary mb-4">{topic.title}</h1>
              <p className="text-on-surface-variant font-body-lg mb-8">{topic.summary}</p>
              <div className="leading-relaxed whitespace-pre-line text-on-surface">{topic.content}</div>
              <div className="mt-12 p-6 bg-surface-container-low rounded-xl flex items-center justify-between flex-wrap gap-4">
                <p className="text-on-surface-variant">Une question sur ce sujet ?</p>
                <Link to="/assistant" className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md no-underline">Demander à Soraya</Link>
              </div>
            </>
          )}
        </article>
      </div>
    </AppShell>
  );
}
