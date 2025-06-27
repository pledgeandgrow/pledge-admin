'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
};

export const ProtectedRoute = ({
  children,
  requiredRole,
  redirectTo = '/auth/signin',
}: ProtectedRouteProps) => {
  const { isLoading, session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // If we have a session and no required role, or if the role matches
      if (session) {
        if (requiredRole) {
          const userRole = session.user?.user_metadata?.role;
          if (userRole !== requiredRole) {
            router.push('/unauthorized');
            return;
          }
        }
      } else if (pathname !== '/auth/signin') {
        // Only redirect if we're not already on the signin page
        router.push(`${redirectTo}?redirectTo=${encodeURIComponent(pathname)}`);
      }
      setIsCheckingAuth(false);
    }
  }, [isLoading, session, router, pathname, requiredRole, redirectTo]);

  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
