'use client';

import { MegaMenu } from '@/components/layout/MegaMenu';

export default function InformatiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <MegaMenu />
      <main className="flex-1 ml-64 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
