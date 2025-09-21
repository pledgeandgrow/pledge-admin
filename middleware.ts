import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/update-password',
    '/auth/verify-email',
    '/auth/account-locked',
    '/auth/email-change',
    '/auth/callback',
    '/privacy-policy',
    '/terms',
  ];
  
  // Get the current pathname
  const { pathname } = request.nextUrl;
  
  // If the user is not signed in and the current path is not public, redirect to the signin page
  if (!session && !publicRoutes.some(route => pathname.startsWith(route))) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // If the user is signed in and the current path is a signin or signup page, redirect to the dashboard
  // But don't redirect for other public routes like verify-email or update-password
  if (session && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
