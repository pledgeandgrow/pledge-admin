import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type ApiResponse<T> = {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
};

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

// Rate limiting implementation
const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS: 60, // 60 requests per minute
};

const requestQueue: number[] = [];

const checkRateLimit = (): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  
  // Remove old requests outside the current window
  while (requestQueue.length > 0 && requestQueue[0] <= now - RATE_LIMIT.WINDOW_MS) {
    requestQueue.shift();
  }

  // Check if we've hit the rate limit
  if (requestQueue.length >= RATE_LIMIT.MAX_REQUESTS) {
    const retryAfter = Math.ceil((requestQueue[0] + RATE_LIMIT.WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Add current request to the queue
  requestQueue.push(now);
  return { allowed: true };
};

// CSRF token management
const getCsrfToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('sb:'));
    
  return cookie ? cookie.split('=')[1] : null;
};

// Enhanced fetch with CSRF protection and rate limiting
export const apiFetch = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  // Check rate limit
  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    throw new ApiError(
      `Too many requests. Please try again in ${rateLimit.retryAfter} seconds.`,
      'RATE_LIMIT_EXCEEDED',
      429
    );
  }

  const supabase = createClientComponentClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Prepare headers with proper typing
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  // Add CSRF token if available
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  // Add auth token if user is logged in
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: Object.fromEntries(headers.entries()),
      credentials: 'include',
    });

    // Handle non-2xx responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        errorData.message || 'An error occurred',
        errorData.code,
        response.status
      );
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as ApiResponse<T>;
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'An unknown error occurred',
      'UNKNOWN_ERROR',
      500
    );
  }
};

// Type for request body
type RequestBody = Record<string, unknown> | unknown[];

// Helper methods for common HTTP methods
export const api = {
  get: <T = unknown>(endpoint: string, options: RequestInit = {}) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = unknown, B extends RequestBody = RequestBody>(
    endpoint: string, 
    body: B, 
    options: RequestInit = {}
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }),
  
  put: <T = unknown, B extends RequestBody = RequestBody>(
    endpoint: string, 
    body: B, 
    options: RequestInit = {}
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }),
  
  delete: <T = unknown>(endpoint: string, options: RequestInit = {}) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
  
  patch: <T = unknown, B extends RequestBody = RequestBody>(
    endpoint: string, 
    body: B, 
    options: RequestInit = {}
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }),
};
