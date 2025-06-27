'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

/**
 * AuthInitializer component that handles authentication state changes
 * and redirects users based on their authentication status.
 */
export default function AuthInitializer() {
  const { supabase, setSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Get the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);

        // Handle specific auth events
        switch (event) {
          case 'SIGNED_IN':
            // Handle successful sign in
            router.refresh();
            break;
          case 'SIGNED_OUT':
            // Handle sign out
            router.push('/');
            break;
          case 'PASSWORD_RECOVERY':
            // Handle password recovery
            router.push('/auth/update-password');
            break;
          default:
            break;
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, setSession, router]);

  // This is a renderless component
  return null;
}

/**
 * Higher-Order Component to wrap pages that require authentication
 */
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function WithAuth(props: T) {
    const { session, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !session) {
        router.push('/auth/signin');
      }
    }, [session, isLoading, router]);

    if (isLoading || !session) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}
