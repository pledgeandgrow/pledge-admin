import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const cookieMap = new Map<string, string>();
  
  // Get all cookies and store them in a map for quick lookup
  cookieStore.getAll().forEach(({ name, value }) => {
    cookieMap.set(name, value);
  });
  
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieMap.get(name) || '';
        },
        set(name: string, value: string) {
          cookieMap.set(name, value);
          // The actual cookie setting is handled by the response headers
          // in the server component or route handler
          return Promise.resolve();
        },
        remove(name: string) {
          cookieMap.delete(name);
          // The actual cookie removal is handled by the response headers
          // in the server component or route handler
          return Promise.resolve();
        },
      },
    }
  );
}
