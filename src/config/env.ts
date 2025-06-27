// This file provides type-safe access to environment variables
// and validates required variables at startup

// Define the shape of our environment variables
type Env = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  
  // App
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_APP_URL: string;
  
  // Optional
  NEXT_PUBLIC_SENTRY_DSN?: string;
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
  
  // Server-side only
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SESSION_SECRET?: string;
  ENCRYPTION_KEY?: string;
};

// Get environment variables with type safety
const getEnv = (): Env => {
  // In development, ensure required env vars are set
  if (process.env.NODE_ENV !== 'production') {
    const requiredVars: (keyof Env)[] = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_APP_URL',
    ];

    const missingVars = requiredVars.filter(
      (key) => !process.env[key]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
  }

  // Return typed environment variables
  return {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    
    // App
    NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) || 'development',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    
    // Optional
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    
    // Server-side only
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SESSION_SECRET: process.env.SESSION_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  };
};

// Export validated environment variables
export const env = getEnv();

// Type guard to check if we're in the browser
export const isBrowser = typeof window !== 'undefined';

// Helper to get public URL (handles different environments)
export const getPublicUrl = (path = '') => {
  if (isBrowser) {
    return `${window.location.origin}${path}`;
  }
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
};

// Helper to check if we're in development mode
export const isDev = env.NODE_ENV === 'development';

// Helper to check if we're in production mode
export const isProd = env.NODE_ENV === 'production';

// Validate environment on module load
if (isBrowser) {
  // Client-side validation
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase configuration. Please check your environment variables.');
  }
} else {
  // Server-side validation
  if (isProd && !env.SESSION_SECRET) {
    console.error('Missing SESSION_SECRET environment variable. This is required in production.');
  }
  
  if (isProd && !env.ENCRYPTION_KEY) {
    console.error('Missing ENCRYPTION_KEY environment variable. This is required in production.');
  }
}
