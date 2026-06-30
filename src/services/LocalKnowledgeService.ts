import { ChatSource } from '../types';
import { LOCAL_KNOWLEDGE_ENTRIES, LocalKnowledgeEntry } from '../helpers/localKnowledgeData';

export interface LocalKnowledgeResult {
  entryId: string;
  reply: string;
  sources: ChatSource[];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function formatSourcesBlock(sources: ChatSource[]): string {
  if (!sources.length) return '';
  const lines = sources.map((s) => {
    const link = s.url ? ` — ${s.url}` : '';
    const desc = s.description ? ` (${s.description})` : '';
    return `• ${s.name}${link}${desc}`;
  });
  return `\n\n📚 Sources :\n${lines.join('\n')}`;
}

export function formatLocalReply(answer: string, sources: ChatSource[]): string {
  return `${answer.trim()}${formatSourcesBlock(sources)}`;
}

export function matchLocalKnowledge(query: string): LocalKnowledgeResult | null {
  const q = normalize(query);
  let best: { entry: LocalKnowledgeEntry; score: number } | null = null;

  for (const entry of LOCAL_KNOWLEDGE_ENTRIES) {
    if (entry.excludes?.some((term) => q.includes(normalize(term)))) continue;
    if (entry.requires?.length && !entry.requires.some((term) => q.includes(normalize(term)))) continue;

    const triggerHits = entry.triggers.filter((term) => q.includes(normalize(term))).length;
    if (triggerHits === 0) continue;

    const score = triggerHits + (entry.priority ?? 0);
    if (!best || score > best.score) {
      best = { entry, score };
    }
  }

  if (!best) return null;

  return {
    entryId: best.entry.id,
    reply: formatLocalReply(best.entry.answer, best.entry.sources),
    sources: best.entry.sources,
  };
}

export function listLocalKnowledgeTopics(): { id: string; triggers: string[]; sources: ChatSource[] }[] {
  return LOCAL_KNOWLEDGE_ENTRIES.map(({ id, triggers, sources }) => ({ id, triggers, sources }));
}
