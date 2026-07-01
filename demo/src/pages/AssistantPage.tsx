import { useEffect, useState, useRef } from 'react';
import { AppShell } from '../components/AppShell';
import { api } from '../lib/api';
import type { Conversation, Message } from '../lib/types';

interface ChatLine {
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatLine[]>([
    { role: 'assistant', content: "Bonjour ! Je suis Soraya, votre guide Bitcoin. Comment puis-je vous aider aujourd'hui ?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    api.getConversations().then((r) => setConversations(r.data)).catch(() => {});
  }, []);

  async function loadConversation(id: string) {
    try {
      const res = await api.getConversation(id);
      setConversationId(id);
      setMessages(
        res.data.messages.map((m: Message) => ({
          role: m.role === 'USER' || m.role === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content,
        })),
      );
    } catch { /* ignore */ }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await api.sendChat(text, conversationId);
      setConversationId(res.data.conversationId);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
      const convRes = await api.getConversations();
      setConversations(convRes.data);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: err instanceof Error ? err.message : 'Erreur API' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell activeNav="dashboard" activeSidebar="assistant">
      <div className="flex flex-1 overflow-hidden min-h-0">
        <aside className="hidden md:flex flex-col w-64 bg-surface-container-low border-r border-outline-variant/20 p-4 shrink-0">
          <button type="button" onClick={() => { setConversationId(undefined); setMessages([{ role: 'assistant', content: 'Nouvelle conversation — posez votre question.' }]); }}
            className="mb-4 bg-primary text-on-primary py-2 rounded-lg font-label-md text-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span> Nouvelle conversation
          </button>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 text-sm">
            {conversations.map((c) => (
              <button key={c.id} type="button" onClick={() => loadConversation(c.id)}
                className={`w-full text-left p-3 rounded-lg truncate ${c.id === conversationId ? 'bg-primary-container/20 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                {c.title || 'Conversation'}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-outline-variant/20 flex items-center gap-3 bg-surface">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">S</div>
            <div>
              <h2 className="font-headline-md text-[16px] text-primary">SORAYA Assistant</h2>
              <span className="text-[12px] text-on-tertiary-container font-medium">en ligne · API /chat</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 flex flex-col">
            {messages.map((m, i) => (
              <div key={i} className={`p-4 text-sm max-w-[85%] whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'chat-bubble-user self-end bg-primary text-on-primary ml-auto'
                  : 'chat-bubble-ai self-start bg-surface-container-low text-on-surface border border-surface-variant/50'
              }`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble-ai self-start bg-surface-container-low p-4 text-sm opacity-60 animate-pulse border">
                Soraya réfléchit…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-surface border-t border-outline-variant/20 flex gap-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Écrire un message…" autoComplete="off"
              className="flex-1 rounded-2xl border border-outline-variant/50 bg-surface-container-low py-3 px-4 outline-none focus:ring-2 focus:ring-primary" />
            <button type="submit" disabled={loading} className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 disabled:opacity-60">
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
