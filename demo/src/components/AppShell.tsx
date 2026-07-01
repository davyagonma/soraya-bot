import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  activeNav?: string;
  activeSidebar?: string;
  withSidebar?: boolean;
}

export function AppShell({ children, activeNav, activeSidebar, withSidebar = true }: AppShellProps) {
  if (!withSidebar) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopNav active={activeNav} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopNav active={activeNav} showSidebar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active={activeSidebar} />
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-background flex flex-col">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
