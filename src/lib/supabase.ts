import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { type CookieOptions } from '@supabase/ssr';

// Valeurs par défaut pour le développement (ne contiennent pas de données réelles)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Fonction pour vérifier si Supabase est correctement configuré
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

// Fonction pour créer un client Supabase côté serveur (API routes)
export function createSupabaseServerClient() {
  // Si Supabase n'est pas configuré, retourner un client mock
  if (!isSupabaseConfigured()) {
    console.warn('Supabase n\'est pas configuré. Utilisation d\'un client mock.');
    return {
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
          error: new Error('Supabase n\'est pas configuré')
        }),
        update: () => ({
          data: null,
          error: new Error('Supabase n\'est pas configuré')
        }),
        delete: () => ({
          data: null,
          error: new Error('Supabase n\'est pas configuré')
        })
      })
    };
  }

  const cookieStore = cookies();
  
  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Dans Next.js 15.3.1, cookies() n'est plus une promesse
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Gérer les erreurs silencieusement
            console.error('Erreur lors de la définition du cookie:', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // Dans Next.js 15.3.1, cookies() n'est plus une promesse
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Gérer les erreurs silencieusement
            console.error('Erreur lors de la suppression du cookie:', error);
          }
        },
      },
    }
  );
}

// Client Supabase pour le côté client
export const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
