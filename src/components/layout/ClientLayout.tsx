'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { useAuth } from '@/contexts/AuthContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  
  // Hide MegaMenu on homepage, auth pages, and when user is not logged in
  const showMegaMenu = 
    user && // Only show if user is logged in
    !isLoading && // Don't show while loading auth state
    !(
      pathname === '/' || 
      pathname === '/app/page' || 
      pathname.startsWith('/auth')
    );
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {showMegaMenu && <MegaMenu />}
      <main className={`flex-1 ${showMegaMenu ? 'ml-96' : ''} min-h-screen overflow-auto ${showMegaMenu ? 'pl-40 pr-24' : 'px-4'} pt-4`}>
        <div className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
