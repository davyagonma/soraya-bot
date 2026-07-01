import { Link } from 'react-router-dom';
import { isAdmin } from '../lib/auth';

const ITEMS = [
  { to: '/dashboard', icon: 'home', label: 'Home', key: 'home' },
  { to: '/dashboard#rates', icon: 'show_chart', label: 'Markets', key: 'markets' },
  { to: '/learn', icon: 'school', label: 'Academy', key: 'learn' },
  { to: '/security', icon: 'verified_user', label: 'Risk Shield', key: 'security' },
  { to: '/alerts', icon: 'notifications', label: 'Alertes', key: 'alerts' },
  { to: '/assistant', icon: 'smart_toy', label: 'Assistant', key: 'assistant' },
  { to: '/news', icon: 'newspaper', label: 'Actualités', key: 'news' },
];

export function Sidebar({ active = 'home' }: { active?: string }) {
  const items = isAdmin() ? [...ITEMS, { to: '/admin', icon: 'admin_panel_settings', label: 'Admin', key: 'admin' }] : ITEMS;

  return (
    <aside className="hidden lg:flex flex-col h-full w-64 bg-surface-container-low p-6 border-r border-outline-variant/20 shrink-0">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
          <span className="material-symbols-outlined">smart_toy</span>
        </div>
        <div>
          <p className="font-label-md text-primary font-bold">SORAYA</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Wise Crypto Guide</p>
        </div>
      </div>
      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <Link
            key={item.key}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              active === item.key
                ? 'bg-primary-container text-on-primary-container font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-label-md">{item.label}</span>
          </Link>
        ))}
      </nav>
      <Link to="/assistant" className="mt-auto bg-secondary-container text-on-secondary-container p-4 rounded-xl font-bold flex items-center justify-between group">
        <span className="font-label-md">Parler à Soraya</span>
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </Link>
    </aside>
  );
}
