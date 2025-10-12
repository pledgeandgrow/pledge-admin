import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { CookieOptions } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/auth/signin?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    );
  }

  if (!code) {
    // If there's no code, redirect to sign in
    console.warn('No code provided in callback');
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  try {
    // Create a Supabase client for the Route Handler
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set(name, value, options as any);
            } catch (err) {
              console.error('Error setting cookie:', err);
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set(name, '', { ...options as any, maxAge: 0 });
            } catch (err) {
              console.error('Error removing cookie:', err);
            }
          },
        },
      }
    );

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error.message);
      return NextResponse.redirect(
        new URL(`/auth/signin?error=${encodeURIComponent(error.message)}`, request.url)
      );
    }

    // If we have a session, check if we need to create or update the user profile
    if (data.session?.user) {
      const user = data.session.user;
      
      // Check if the user has a profile in the users table
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" error, which is expected if user doesn't exist
        console.error('Error fetching user profile:', fetchError);
      }

      // If the user doesn't exist in the users table, create a profile
      if (!existingUser) {
        console.log('Creating user profile for:', user.id);
        
        // Generate avatar URL from user metadata or email
        const firstName = user.user_metadata?.first_name || '';
        const lastName = user.user_metadata?.last_name || '';
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        const initials = firstInitial + lastInitial || user.email?.charAt(0).toUpperCase() || 'U';
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
        
        // Create user profile
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email?.toLowerCase(),
            first_name: firstName || null,
            last_name: lastName || null,
            avatar_url: avatarUrl,
            email_verified: !!user.email_confirmed_at,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }
      } else {
        // Update the existing user's email_verified status and last_login
        const { error: updateError } = await supabase
          .from('users')
          .update({
            email_verified: !!user.email_confirmed_at,
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating user profile:', updateError);
        }
      }
    }

    // Redirect to the dashboard or specified next URL
    return NextResponse.redirect(new URL(next, request.url));
  } catch (err) {
    console.error('Unexpected error in auth callback:', err);
    return NextResponse.redirect(
      new URL('/auth/signin?error=An unexpected error occurred', request.url)
    );
  }
}
