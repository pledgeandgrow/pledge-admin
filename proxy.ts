import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/update-password',
  '/auth/verify-email',
  '/auth/callback',
  '/auth/account-locked',
  '/auth/email-change',
  '/privacy-policy',
  '/terms',
  '/_next',
  '/_vercel',
  '/favicon.ico',
  '/logo',
  '/api'
];

// Auth routes that should redirect to dashboard if user is already authenticated
const authRoutes = ['/auth/signin', '/auth/signup', '/auth/forgot-password'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (pathname.includes('.') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Create a response object that we'll modify in the middleware
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client configured to use cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
            path: '/',
          });
          return Promise.resolve();
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            path: '/',
            maxAge: 0,
          });
          return Promise.resolve();
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();
  const hasSession = !!session;

  console.log(`[Middleware] Path: ${pathname}, Authenticated: ${hasSession}`);
  
  // Handle public routes
  if (isPublicRoute) {
    // If user is on an auth page but already authenticated, redirect to dashboard
    if (authRoutes.some(route => pathname.startsWith(route)) && hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    return response;
  }
  
  // Handle protected routes
  if (!hasSession) {
    // Redirect to signin if not authenticated
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    url.searchParams.set('redirectedFrom', pathname);
    
    // Clear any existing auth cookies
    response = NextResponse.redirect(url);
    response.cookies.set({
      name: 'sb-access-token',
      value: '',
      path: '/',
      maxAge: 0,
    });
    response.cookies.set({
      name: 'sb-refresh-token',
      value: '',
      path: '/',
      maxAge: 0,
    });
    
    return response;
  }

  // User is authenticated and trying to access a protected route
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo (logo files)
     * - api (API routes are handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo|api).*)',
  ],
};
