import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Valeurs par défaut pour le développement (ne contiennent pas de données réelles)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Fonction pour vérifier si Supabase est correctement configuré
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

// Fonction pour créer un client Supabase côté serveur (API routes)
// This is now a mock implementation only - server components should use a separate file
export function createSupabaseServerClient() {
  console.warn('createSupabaseServerClient should not be used in client components. Use a server component or API route instead.');
  // Create a mock client that includes the rpc method
  const mockClient = {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            data: [],
            error: null
          })
        }),
        order: () => ({
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      insert: () => ({
        data: null,
        error: new Error('Server client cannot be used in client components')
      }),
      update: () => ({
        data: null,
        error: new Error('Server client cannot be used in client components')
      }),
      delete: () => ({
        data: null,
        error: new Error('Server client cannot be used in client components')
      })
    }),
    rpc: () => ({
      data: null,
      error: new Error('Server client cannot be used in client components')
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null })
    }
  };
  
  return mockClient;
}

// Client Supabase pour le côté client
export const supabaseClient = createSupabaseClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Function to create a browser client (for client components)
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }
  
  return createBrowserClient(url, key);
}
