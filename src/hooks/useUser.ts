import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

type UserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  role?: string;
};

type UseUserReturn = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
};

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  // Fetch user profile from the database
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Initialize auth state and set up listener
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize session'));
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    // Initial session fetch
    getInitialSession();

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile, supabase.auth]);

  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      const error = err instanceof Error ? err : new Error('Failed to update profile');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [supabase, user]);

  // Refresh user profile
  const refreshProfile = useCallback(async () => {
    if (!user) {
      return;
    }
    return fetchUserProfile(user.id);
  }, [fetchUserProfile, user]);

  return {
    user,
    profile,
    isLoading,
    error,
    refreshProfile,
    updateProfile,
  };
}

// Hook to check if user is authenticated and has required role
export function useRequireAuth(requiredRole?: string) {
  const { user, profile, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Redirect to sign in if not authenticated
    if (!user) {
      router.push(`/auth/signin?redirectTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    // Check role if required
    if (requiredRole && profile?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [user, isLoading, requiredRole, router, profile]);

  return { user, profile, isLoading };
}
