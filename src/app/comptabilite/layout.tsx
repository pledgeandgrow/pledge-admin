'use client';

import { MegaMenu } from '@/components/layout/MegaMenu';

export default function ComptabiliteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <MegaMenu />
      <main className="flex-1 ml-64 min-h-screen overflow-auto">
        <div className="max-w-7xl mx-auto py-4">
          {children}
        </div>
      </main>
    </div>
  );
}
