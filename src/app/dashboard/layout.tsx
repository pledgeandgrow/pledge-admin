'use client';

import { MegaMenu } from '@/components/layout/MegaMenu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <MegaMenu />
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}
