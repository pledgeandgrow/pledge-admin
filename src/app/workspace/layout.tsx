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
    <div className="flex min-h-screen bg-background text-foreground">
      <MegaMenu />
      <main className="flex-1 ml-64 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
