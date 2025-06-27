'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type AuthInitializerProps = {
  children: React.ReactNode;
};

const PUBLIC_ROUTES = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/update-password',
  '/privacy-policy',
  '/terms',
  '/_next',
  '/_vercel',
  '/favicon.ico',
  '/logo',
  '/api'
];

const AUTH_ROUTES = ['/auth/signin', '/auth/signup', '/auth/forgot-password'];

export function AuthInitializer({ children }: AuthInitializerProps) {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    const isAuthRoute = AUTH_ROUTES.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    // Only handle redirects, don't block rendering
    if (session) {
      if (isAuthRoute) {
        router.push('/dashboard');
      }
    } else if (!isPublicRoute) {
      router.push(`/auth/signin?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [session, pathname, router]);

  // Always render children immediately
  return <>{children}</>;
}
