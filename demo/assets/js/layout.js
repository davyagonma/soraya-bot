/** Composants de navigation partagés */
const SorayaLayout = {
  tailwindConfig: {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'inverse-primary': '#adc7f7',
          'primary-fixed-dim': '#adc7f7',
          'on-tertiary-fixed': '#002114',
          'surface-container-high': '#dce9ff',
          'on-tertiary': '#ffffff',
          'on-tertiary-container': '#39b282',
          'on-primary-container': '#86a0cd',
          'inverse-on-surface': '#eaf1ff',
          'tertiary-fixed-dim': '#68dba9',
          tertiary: '#002618',
          'on-surface-variant': '#43474e',
          'on-error-container': '#93000a',
          surface: '#f8f9ff',
          'tertiary-fixed': '#85f8c4',
          'on-primary-fixed-variant': '#2d476f',
          'error-container': '#ffdad6',
          'on-secondary-container': '#663800',
          'surface-dim': '#cbdbf5',
          'on-background': '#0b1c30',
          'surface-container-low': '#eff4ff',
          background: '#f8f9ff',
          outline: '#74777f',
          'secondary-container': '#fe9821',
          'on-error': '#ffffff',
          'on-tertiary-fixed-variant': '#005137',
          'primary-fixed': '#d6e3ff',
          'on-primary-fixed': '#001b3c',
          'surface-container': '#e5eeff',
          'tertiary-container': '#003e29',
          secondary: '#8c4f00',
          'secondary-fixed': '#ffdcbf',
          'on-surface': '#0b1c30',
          'inverse-surface': '#213145',
          'on-primary': '#ffffff',
          'on-secondary-fixed': '#2d1600',
          'surface-bright': '#f8f9ff',
          'outline-variant': '#c4c6cf',
          'surface-tint': '#455f88',
          'on-secondary': '#ffffff',
          'secondary-fixed-dim': '#ffb874',
          'surface-variant': '#d3e4fe',
          'primary-container': '#1a365d',
          'on-secondary-fixed-variant': '#6b3b00',
          'surface-container-highest': '#d3e4fe',
          'surface-container-lowest': '#ffffff',
          error: '#ba1a1a',
          primary: '#002045',
        },
        borderRadius: { DEFAULT: '0.25rem', lg: '0.5rem', xl: '0.75rem', full: '9999px' },
        spacing: {
          xs: '4px', gutter: '20px', lg: '48px', 'container-max': '1200px',
          md: '24px', xl: '80px', sm: '12px', base: '8px',
        },
        fontFamily: {
          'headline-md': ['Plus Jakarta Sans'],
          'label-md': ['JetBrains Mono'],
          'label-sm': ['JetBrains Mono'],
          'body-md': ['Inter'],
          'body-lg': ['Inter'],
          'headline-lg-mobile': ['Plus Jakarta Sans'],
          'headline-xl': ['Plus Jakarta Sans'],
          'headline-lg': ['Plus Jakarta Sans'],
        },
        fontSize: {
          'headline-md': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
          'label-md': ['14px', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '500' }],
          'label-sm': ['12px', { lineHeight: '1', fontWeight: '500' }],
          'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
          'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
          'headline-lg-mobile': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
          'headline-xl': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
          'headline-lg': ['32px', { lineHeight: '1.25', fontWeight: '700' }],
        },
      },
    },
  },

  headExtras() {
    return `
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@500&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      <style>
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d3e4fe; border-radius: 10px; }
        .chat-bubble-ai { border-radius: 1.25rem 1.25rem 1.25rem 0.25rem; }
        .chat-bubble-user { border-radius: 1.25rem 1.25rem 0.25rem 1.25rem; }
        .glass-panel { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); border: 1px solid rgba(226,232,240,0.8); }
        .crypto-card-hover { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .crypto-card-hover:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(26,54,93,0.08); }
      </style>
    `;
  },

  initTailwind() {
    if (window.tailwind) {
      window.tailwind.config = this.tailwindConfig;
    }
  },

  navLinks: [
    { href: '/demo/dashboard.html', label: 'Dashboard', key: 'dashboard' },
    { href: '/demo/dashboard.html#rates', label: 'Rates', key: 'rates' },
    { href: '/demo/learn.html', label: 'Learn', key: 'learn' },
    { href: '/demo/security.html', label: 'Security', key: 'security' },
  ],

  renderTopNav(activeKey = '', { showSidebar = false } = {}) {
    const user = SorayaAuth.getUser();
    const links = this.navLinks.map((l) => {
      const active = l.key === activeKey ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors';
      return `<a class="font-body-md ${active}" href="${l.href}">${l.label}</a>`;
    }).join('');

    const adminLink = SorayaAuth.isAdmin()
      ? `<a class="font-body-md text-secondary hover:opacity-80 transition-colors" href="/demo/admin.html">Admin</a>`
      : '';

    const userMenu = user
      ? `<div class="relative group">
          <button class="flex items-center gap-2 text-primary">
            <span class="material-symbols-outlined text-[32px]">account_circle</span>
            <span class="hidden md:inline font-label-sm text-sm">${SorayaUtils.escapeHtml(user.name || user.email)}</span>
          </button>
          <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-outline-variant/30 py-2 hidden group-hover:block z-50">
            <a href="/demo/assistant.html" class="block px-4 py-2 hover:bg-surface-container-low text-sm">Assistant IA</a>
            <a href="/demo/alerts.html" class="block px-4 py-2 hover:bg-surface-container-low text-sm">Mes alertes</a>
            ${SorayaAuth.isAdmin() ? '<a href="/demo/admin.html" class="block px-4 py-2 hover:bg-surface-container-low text-sm">Administration</a>' : ''}
            <button onclick="SorayaAuth.logout()" class="w-full text-left px-4 py-2 hover:bg-error-container text-error text-sm">Déconnexion</button>
          </div>
        </div>`
      : `<a href="/demo/login.html" class="material-symbols-outlined text-primary text-[32px]">account_circle</a>`;

    return `
      <header class="bg-surface shadow-sm sticky top-0 z-50">
        <div class="flex justify-between items-center w-full px-gutter md:px-lg max-w-container-max mx-auto h-16">
          <div class="flex items-center gap-8">
            <a href="/demo/index.html" class="font-headline-lg text-headline-lg font-bold text-primary">SORAYA</a>
            ${showSidebar ? '' : `<nav class="hidden md:flex items-center gap-6">${links}${adminLink}</nav>`}
          </div>
          <div class="flex items-center gap-4">
            <a href="/demo/assistant.html" class="hidden md:block bg-primary text-on-primary px-6 py-2 rounded-full font-label-md hover:opacity-90 active:scale-95 transition-all">Launch Assistant</a>
            ${userMenu}
          </div>
        </div>
      </header>
    `;
  },

  renderSidebar(activeKey = 'home') {
    const items = [
      { href: '/demo/dashboard.html', icon: 'home', label: 'Home', key: 'home' },
      { href: '/demo/dashboard.html#rates', icon: 'show_chart', label: 'Markets', key: 'markets' },
      { href: '/demo/learn.html', icon: 'school', label: 'Academy', key: 'learn' },
      { href: '/demo/security.html', icon: 'verified_user', label: 'Risk Shield', key: 'security' },
      { href: '/demo/alerts.html', icon: 'notifications', label: 'Alertes', key: 'alerts' },
      { href: '/demo/assistant.html', icon: 'smart_toy', label: 'Assistant', key: 'assistant' },
      { href: '/demo/news.html', icon: 'newspaper', label: 'Actualités', key: 'news' },
    ];

    if (SorayaAuth.isAdmin()) {
      items.push({ href: '/demo/admin.html', icon: 'admin_panel_settings', label: 'Admin', key: 'admin' });
    }

    const links = items.map((item) => {
      const active = item.key === activeKey;
      const cls = active
        ? 'flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container font-bold rounded-lg'
        : 'flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all';
      return `<a class="${cls}" href="${item.href}"><span class="material-symbols-outlined">${item.icon}</span><span class="font-label-md text-label-md">${item.label}</span></a>`;
    }).join('');

    return `
      <aside class="hidden lg:flex flex-col h-full w-64 bg-surface-container-low p-md border-r border-outline-variant/20 shrink-0">
        <div class="flex items-center gap-3 mb-8 px-2">
          <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
            <span class="material-symbols-outlined">smart_toy</span>
          </div>
          <div>
            <p class="font-label-md text-label-md text-primary font-bold">SORAYA</p>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-widest">Wise Crypto Guide</p>
          </div>
        </div>
        <nav class="flex-1 space-y-2">${links}</nav>
        <a href="/demo/assistant.html" class="mt-auto bg-secondary-container text-on-secondary-container p-4 rounded-xl font-bold flex items-center justify-between group">
          <span class="font-label-md">Parler à Soraya</span>
          <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </a>
      </aside>
    `;
  },

  renderFooter() {
    return `
      <footer class="bg-on-background mt-auto py-xl px-gutter">
        <div class="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div class="flex flex-col items-center md:items-start gap-4">
            <span class="font-headline-md text-headline-md text-primary-fixed">SORAYA</span>
            <p class="font-label-sm text-outline-variant max-w-xs text-center md:text-left">© 2024 SORAYA. Securely guiding Africa's Bitcoin journey.</p>
          </div>
          <div class="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a class="text-label-sm text-outline-variant hover:text-secondary-fixed-dim transition-colors" href="#">Privacy Policy</a>
            <a class="text-label-sm text-outline-variant hover:text-secondary-fixed-dim transition-colors" href="#">Terms of Service</a>
            <a class="text-label-sm text-outline-variant hover:text-secondary-fixed-dim transition-colors" href="/demo/assistant.html">Assistant</a>
            <a class="text-label-sm text-outline-variant hover:text-secondary-fixed-dim transition-colors" href="/api/docs" target="_blank">API Docs</a>
          </div>
        </div>
      </footer>
    `;
  },

  mountAppShell({ activeNav, activeSidebar, content }) {
    document.body.innerHTML = `
      ${this.renderTopNav(activeNav, { showSidebar: true })}
      <div class="flex flex-1 overflow-hidden min-h-0">
        ${this.renderSidebar(activeSidebar)}
        <main class="flex-1 overflow-y-auto custom-scrollbar bg-background flex flex-col">${content}</main>
      </div>
    `;
  },
};
