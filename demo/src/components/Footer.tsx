import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-on-background mt-auto py-16 px-gutter">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="font-headline-md text-primary-fixed">SORAYA</span>
          <p className="font-label-sm text-outline-variant max-w-xs text-center md:text-left">
            © 2026 SORAYA. Securely guiding Africa&apos;s Bitcoin journey.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <a href="/api/docs" target="_blank" rel="noreferrer" className="text-label-sm text-outline-variant hover:text-secondary-fixed-dim transition-colors">API Docs</a>
          <Link to="/assistant" className="text-label-sm text-outline-variant hover:text-secondary-fixed-dim transition-colors">Assistant</Link>
          <Link to="/learn" className="text-label-sm text-outline-variant hover:text-secondary-fixed-dim transition-colors">Académie</Link>
        </div>
      </div>
    </footer>
  );
}
