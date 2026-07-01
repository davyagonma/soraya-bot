import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { saveSession, isLoggedIn } from '../lib/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) navigate('/dashboard', { replace: true });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.register(email, password, name || undefined);
      saveSession(res.data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inscription échouée');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="p-gutter">
        <Link to="/" className="font-headline-lg text-primary font-bold">SORAYA</Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-gutter py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-headline-lg text-primary mb-2">Rejoindre SORAYA</h1>
            <p className="text-on-surface-variant">Créez votre compte pour accéder à l&apos;assistant.</p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl border border-outline-variant/30 space-y-6">
            {error && <div className="p-4 rounded-xl bg-error-container text-on-error-container text-sm">{error}</div>}
            <div>
              <label className="font-label-sm uppercase tracking-wider mb-2 block text-on-surface-variant">Nom</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-outline-variant/50 py-3 px-4 outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="font-label-sm uppercase tracking-wider mb-2 block text-on-surface-variant">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-outline-variant/50 py-3 px-4 outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="font-label-sm uppercase tracking-wider mb-2 block text-on-surface-variant">Mot de passe (min. 8)</label>
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-outline-variant/50 py-3 px-4 outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-secondary-container text-on-secondary-container py-4 rounded-xl font-headline-md hover:opacity-90 disabled:opacity-60">
              Créer mon compte
            </button>
            <p className="text-center text-sm text-on-surface-variant">
              Déjà inscrit ? <Link to="/login" className="text-primary font-bold hover:underline">Se connecter</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
