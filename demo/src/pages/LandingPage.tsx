import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { api } from '../lib/api';
import type { CryptoPrice } from '../lib/types';
import { formatCurrency, formatPercent, percentClass } from '../lib/utils';

export default function LandingPage() {
  const [btc, setBtc] = useState<CryptoPrice | null>(null);
  const [eth, setEth] = useState<CryptoPrice | null>(null);

  useEffect(() => {
    Promise.all([api.getPrice('BTC', 'XOF,USD'), api.getPrice('ETH', 'XOF')])
      .then(([b, e]) => { setBtc(b.data); setEth(e.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="fixed top-0 z-50 w-full bg-surface/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center w-full px-gutter md:px-12 max-w-container-max mx-auto h-20">
          <span className="font-headline-lg text-primary font-bold">SORAYA</span>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="font-body-md text-on-surface-variant hover:text-primary">Dashboard</Link>
            <Link to="/learn" className="font-body-md text-on-surface-variant hover:text-primary">Learn</Link>
            <Link to="/security" className="font-body-md text-on-surface-variant hover:text-primary">Security</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/assistant" className="hidden md:block bg-primary text-on-primary px-6 py-2 rounded-full font-medium hover:opacity-90">Launch Assistant</Link>
            <Link to="/login" className="material-symbols-outlined text-primary text-3xl">account_circle</Link>
          </div>
        </div>
      </header>

      <main className="pt-20 flex-1">
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-fixed/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary-fixed/20 blur-[100px] rounded-full" />
          </div>
          <div className="max-w-container-max mx-auto px-gutter md:px-12 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary font-label-md">
                <span className="w-2 h-2 rounded-full bg-secondary-container" />
                Disponible sur Telegram &amp; WhatsApp
              </div>
              <h1 className="font-headline-xl text-on-background leading-tight">
                Votre assistant Bitcoin &amp; Crypto de confiance pour <span className="text-primary italic">l&apos;Afrique.</span>
              </h1>
              <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto lg:mx-0">
                Démocratiser l&apos;accès à l&apos;information crypto fiable, simple et sécurisée.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/assistant" className="w-full sm:w-auto bg-primary text-on-primary px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/20 no-underline">
                  <span className="material-symbols-outlined">send</span> Lancer l&apos;Assistant
                </Link>
                <Link to="/dashboard" className="w-full sm:w-auto bg-white border-2 border-outline-variant text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-surface-container-low no-underline">
                  Voir les tarifs
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md relative">
              <div className="relative bg-white rounded-[2.5rem] p-4 shadow-2xl border-8 border-on-background">
                <div className="flex items-center justify-between pb-4 border-b border-surface-variant px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">S</div>
                    <div>
                      <h4 className="font-headline-md text-[16px]">SORAYA Assistant</h4>
                      <span className="text-[12px] text-on-tertiary-container font-medium">en ligne</span>
                    </div>
                  </div>
                </div>
                <div className="py-6 space-y-4 px-2">
                  <div className="chat-bubble-ai bg-surface-container-low p-4 text-sm max-w-[85%] border border-surface-variant/50">
                    Bonjour ! Je suis Soraya. Comment puis-je vous aider ?
                  </div>
                  <div className="chat-bubble-user ml-auto bg-primary text-on-primary p-4 text-sm max-w-[85%] w-fit">
                    Quel est le prix du BTC en FCFA ?
                  </div>
                  <div className="chat-bubble-ai bg-surface-container-low p-4 text-sm max-w-[85%] border border-surface-variant/50 shadow-sm">
                    <p className="font-bold mb-2">Cours du Bitcoin (BTC)</p>
                    <p className="font-headline-md text-primary mb-1">{btc ? formatCurrency(btc.prices.XOF, 'XOF') : '…'}</p>
                    {btc && (
                      <div className={`flex items-center gap-1 text-[12px] ${percentClass(btc.change24h)}`}>
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        {formatPercent(btc.change24h)} ces dernières 24h
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white" id="dashboard">
          <div className="max-w-container-max mx-auto px-gutter md:px-12">
            <h2 className="font-headline-lg text-center mb-16">Tout ce dont vous avez besoin, <span className="text-secondary">au bout des doigts.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
              <div className="md:col-span-8 glass-panel rounded-[2rem] p-8 flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-4xl text-primary mb-4 block">currency_exchange</span>
                  <h3 className="font-headline-md mb-2">Convertisseur Instantané</h3>
                  <p className="text-on-surface-variant max-w-sm">FCFA, NGN, GHS et plus de 15 devises locales africaines.</p>
                </div>
              </div>
              <Link to="/security" className="md:col-span-4 bg-tertiary-container rounded-[2rem] p-8 flex flex-col justify-between text-on-tertiary hover:scale-[1.02] transition-transform no-underline">
                <div>
                  <span className="material-symbols-outlined text-4xl text-tertiary-fixed mb-4 block">gpp_maybe</span>
                  <h3 className="font-headline-md mb-2">Scam Detector</h3>
                  <p className="text-tertiary-fixed-dim">Vérifiez la fiabilité d&apos;une plateforme avant d&apos;investir.</p>
                </div>
              </Link>
              <Link to="/learn" className="md:col-span-4 bg-primary-container rounded-[2rem] p-8 flex flex-col justify-between text-on-primary-container no-underline">
                <div>
                  <span className="material-symbols-outlined text-4xl text-primary-fixed mb-4 block">school</span>
                  <h3 className="font-headline-md mb-2 text-white">Academy</h3>
                  <p className="opacity-80">Guides simples sur Bitcoin et blockchain.</p>
                </div>
              </Link>
              <div id="rates" className="md:col-span-8 bg-surface-container rounded-[2rem] p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <span className="material-symbols-outlined text-4xl text-primary mb-4 block">show_chart</span>
                  <h3 className="font-headline-md mb-2">Suivi des Marchés</h3>
                  <p className="text-on-surface-variant">Données en temps réel via l&apos;API SORAYA.</p>
                </div>
                <div className="flex-1 flex flex-col gap-3 justify-center">
                  {[btc, eth].filter(Boolean).map((c) => c && (
                    <div key={c.symbol} className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/30 flex justify-between items-center">
                      <span className="font-bold">{c.symbol}</span>
                      <span className={`font-bold ${percentClass(c.change24h)}`}>{formatPercent(c.change24h)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-primary/90" />
          <div className="relative z-10 max-w-container-max mx-auto px-gutter text-center">
            <h2 className="font-headline-xl text-white mb-8">Prêt à dompter la Crypto ?</h2>
            <Link to="/register" className="inline-flex bg-secondary-container text-on-secondary-container px-10 py-5 rounded-2xl font-bold text-xl shadow-lg items-center gap-3 no-underline">
              Démarrer l&apos;aventure <span className="material-symbols-outlined">rocket_launch</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
