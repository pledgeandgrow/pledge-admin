'use client';

import { MegaMenu } from '@/components/layout/MegaMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no session, redirect to signin
    if (!isLoading && !session) {
      router.push('/auth/signin');
    }
  }, [isLoading, session, router]);

  // Show loading state while checking auth
  if (isLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <MegaMenu />
      <main className="flex-1 ml-64 min-h-screen overflow-auto pl-20 pr-12 pt-4">
        <div className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
