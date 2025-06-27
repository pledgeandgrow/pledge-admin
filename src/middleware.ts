import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/client';

// Initialize the Supabase client
const supabase = createClient();

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/update-password',
  '/auth/verify-email',
  '/privacy-policy',
  '/terms',
  '/api/auth/callback',
  '/_next',
  '/_vercel',
  '/favicon.ico',
  '/logo',
  '/api/auth/'
];

// Auth routes that should redirect to dashboard if user is already authenticated
const authRoutes = ['/auth/signin', '/auth/signup', '/auth/forgot-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (pathname.includes('.') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Get the session
  const { data: { session } } = await supabase.auth.getSession();
  const hasSession = !!session;
  
  console.log(`[Middleware] Path: ${pathname}, Authenticated: ${hasSession}`);
  
  // Handle public routes
  if (isPublicRoute) {
    // Redirect authenticated users away from auth pages to dashboard
    if (hasSession && authRoutes.some(route => pathname.startsWith(route))) {
      console.log('[Middleware] Redirecting authenticated user to /dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }
  
  // Handle protected routes - redirect to signin if not authenticated
  if (!hasSession) {
    console.log('[Middleware] No session found, redirecting to signin');
    const redirectUrl = new URL('/auth/signin', request.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    
    // Create response that will redirect to signin
    const response = NextResponse.redirect(redirectUrl);
    
    // Clear any existing auth cookies
    response.cookies.set({
      name: 'sb-access-token',
      value: '',
      path: '/',
      expires: new Date(0),
    });
    response.cookies.set({
      name: 'sb-refresh-token',
      value: '',
      path: '/',
      expires: new Date(0),
    });

    return response;
  }

  // User is authenticated and trying to access a protected route
  return NextResponse.next();
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
