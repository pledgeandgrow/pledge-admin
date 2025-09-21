import { ReactNode } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <MegaMenu />
      <main className="flex-1 ml-72 min-h-screen overflow-auto pl-20 pr-12 pt-4">
        <div className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
