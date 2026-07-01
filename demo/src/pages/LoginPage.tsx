import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { saveSession, isLoggedIn, isAdmin } from '../lib/auth';
import { useEffect } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('demo@soraya.africa');
  const [password, setPassword] = useState('user123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate(isAdmin() ? '/admin' : '/dashboard', { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      saveSession(res.data);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      navigate(from || (res.data.user.role === 'ADMIN' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion échouée');
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
            <h1 className="font-headline-lg text-primary mb-2">Bon retour</h1>
            <p className="text-on-surface-variant">Connectez-vous pour accéder à votre tableau de bord.</p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl border border-outline-variant/30 space-y-6">
            {error && <div className="p-4 rounded-xl bg-error-container text-on-error-container text-sm">{error}</div>}
            <div>
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/50 py-3 px-4 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-2 block">Mot de passe</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/50 py-3 px-4 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-headline-md hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined">login</span>}
              Se connecter
            </button>
            <p className="text-center text-sm text-on-surface-variant">
              Pas encore de compte ? <Link to="/register" className="text-primary font-bold hover:underline">S&apos;inscrire</Link>
            </p>
          </form>
          <div className="mt-6 p-4 rounded-xl bg-surface-container-low border text-sm text-on-surface-variant">
            <p className="font-label-md text-primary mb-2">Comptes démo</p>
            <p><strong>User:</strong> demo@soraya.africa / user123456</p>
            <p><strong>Admin:</strong> admin@soraya.africa / admin123456</p>
          </div>
        </div>
      </main>
    </div>
  );
}
