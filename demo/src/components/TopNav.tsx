import { Link } from 'react-router-dom';
import { getUser, isAdmin, clearSession } from '../lib/auth';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', key: 'dashboard' },
  { to: '/dashboard#rates', label: 'Rates', key: 'rates' },
  { to: '/learn', label: 'Learn', key: 'learn' },
  { to: '/security', label: 'Security', key: 'security' },
];

interface TopNavProps {
  active?: string;
  showSidebar?: boolean;
}

export function TopNav({ active, showSidebar }: TopNavProps) {
  const user = getUser();

  return (
    <header className="bg-surface shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-gutter md:px-12 max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-headline-lg text-primary font-bold">SORAYA</Link>
          {!showSidebar && (
            <nav className="hidden md:flex items-center gap-6">
              {NAV.map((l) => (
                <Link
                  key={l.key}
                  to={l.to}
                  className={`font-body-md ${active === l.key ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
                >
                  {l.label}
                </Link>
              ))}
              {isAdmin() && (
                <Link to="/admin" className="font-body-md text-secondary hover:opacity-80">Admin</Link>
              )}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link to="/assistant" className="hidden md:block bg-primary text-on-primary px-6 py-2 rounded-full font-label-md hover:opacity-90 transition-all">
            Launch Assistant
          </Link>
          {user ? (
            <div className="relative group">
              <button type="button" className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[32px]">account_circle</span>
                <span className="hidden md:inline font-label-sm text-sm">{user.name || user.email}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-outline-variant/30 py-2 hidden group-hover:block z-50">
                <Link to="/assistant" className="block px-4 py-2 hover:bg-surface-container-low text-sm">Assistant IA</Link>
                <Link to="/alerts" className="block px-4 py-2 hover:bg-surface-container-low text-sm">Mes alertes</Link>
                {isAdmin() && <Link to="/admin" className="block px-4 py-2 hover:bg-surface-container-low text-sm">Administration</Link>}
                <button type="button" onClick={() => { clearSession(); window.location.assign('/demo/login'); }} className="w-full text-left px-4 py-2 hover:bg-error-container text-error text-sm">
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="material-symbols-outlined text-primary text-[32px]">account_circle</Link>
          )}
        </div>
      </div>
    </header>
  );
}
