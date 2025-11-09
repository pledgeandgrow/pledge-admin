import { supabase } from '@/config/supabase';
import { ERROR_MESSAGES, VALIDATION_RULES } from '@/config/supabase';
import { isProd } from '@/config/env';
import type { User, Session } from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';
import { SerializeOptions } from 'cookie';
import { parse, serialize } from 'cookie';

// ============================================================================
// TYPES
// ============================================================================

type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type JwtPayload = {
  exp: number;
  iat: number;
  sub: string;
  email?: string;
  email_verified?: boolean;
  phone?: string;
  app_metadata?: {
    provider?: string;
    [key: string]: unknown;
  };
  user_metadata?: Record<string, unknown>;
  role?: string;
  aal?: string;
  amr?: Array<{ method: string; timestamp: number }>;
  session_id?: string;
};

interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
    app_metadata?: Record<string, unknown>;
    user_metadata?: Record<string, unknown>;
  };
}

type ErrorWithMessage = {
  message: string;
  code?: string | number;
  status?: number;
  details?: unknown;
};

// ============================================================================
// AUTH VALIDATION
// ============================================================================

/**
 * Validates an email address
 */
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

/**
 * Validates a password against the defined rules
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return { 
      isValid: false, 
      message: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters long` 
    };
  }

  if (VALIDATION_RULES.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one uppercase letter' 
    };
  }

  if (VALIDATION_RULES.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one lowercase letter' 
    };
  }

  if (VALIDATION_RULES.PASSWORD.REQUIRE_NUMBER && !/\d/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one number' 
    };
  }

  if (VALIDATION_RULES.PASSWORD.REQUIRE_SPECIAL_CHAR && !/[^A-Za-z0-9]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one special character' 
    };
  }

  return { isValid: true };
};

// ============================================================================
// AUTH OPERATIONS
// ============================================================================

/**
 * Handles user sign in with email and password
 */
export const signInWithEmail = async ({ email, password }: SignInCredentials): Promise<{
  data: { user: User | null; session: Session | null } | null;
  error: Error | null;
}> => {
  try {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.message);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { 
      data: null, 
      error: error instanceof Error 
        ? error 
        : new Error(ERROR_MESSAGES.DEFAULT) 
    };
  }
};

/**
 * Handles user sign up with email and password
 */
export const signUpWithEmail = async ({ 
  email, 
  password, 
  firstName, 
  lastName 
}: SignUpData): Promise<{
  data: { user: User | null } | null;
  error: Error | null;
}> => {
  try {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.message);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    if (!firstName.trim() || !lastName.trim()) {
      throw new Error('First name and last name are required');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { 
      data: null, 
      error: error instanceof Error 
        ? error 
        : new Error(ERROR_MESSAGES.DEFAULT) 
    };
  }
};

/**
 * Handles user sign out
 */
export const signOut = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Sign out error:', error);
    return { 
      error: error instanceof Error 
        ? error 
        : new Error('Failed to sign out') 
    };
  }
};

/**
 * Sends a password reset email
 */
export const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/update-password`,
    });
    return { error };
  } catch (error) {
    console.error('Password reset error:', error);
    return { 
      error: error instanceof Error 
        ? error 
        : new Error('Failed to send password reset email') 
    };
  }
};

/**
 * Updates the user's password
 */
export const updatePassword = async (newPassword: string): Promise<{ error: Error | null }> => {
  try {
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { error };
  } catch (error) {
    console.error('Update password error:', error);
    return { 
      error: error instanceof Error 
        ? error 
        : new Error('Failed to update password') 
    };
  }
};

/**
 * Gets the current authenticated user
 */
export const getCurrentUser = async (): Promise<{
  user: User | null;
  session: Session | null;
  error: Error | null;
}> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }

    return { user: session?.user || null, session, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { 
      user: null, 
      session: null,
      error: error instanceof Error 
        ? error 
        : new Error('Failed to get current user') 
    };
  }
};

/**
 * Refreshes the current session
 */
export const refreshSession = async (): Promise<{
  session: Session | null;
  error: Error | null;
}> => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      throw error;
    }

    return { session, error: null };
  } catch (error) {
    console.error('Refresh session error:', error);
    return { 
      session: null,
      error: error instanceof Error 
        ? error 
        : new Error('Failed to refresh session') 
    };
  }
};

// ============================================================================
// TOKEN UTILITIES
// ============================================================================

/**
 * Checks if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

/**
 * Decodes a JWT token and returns its payload
 */
export const decodeToken = <T = JwtPayload>(token: string): T | null => {
  try {
    return jwtDecode<T>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Refreshes the current session if the token is expired or about to expire
 */
export const refreshSessionIfNeeded = async (): Promise<{
  session: AuthSession | null;
  error: Error | null;
}> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }

    if (!session) {
      return { session: null, error: new Error('No active session') };
    }

    const { exp } = jwtDecode<JwtPayload>(session.access_token);
    const currentTime = Date.now() / 1000;
    const bufferTime = 5 * 60;

    if (exp < currentTime + bufferTime) {
      const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: session.refresh_token,
      });

      if (refreshError) {
        throw refreshError;
      }

      return { session: refreshedSession.session as AuthSession, error: null };
    }

    return { session: session as AuthSession, error: null };
  } catch (error) {
    console.error('Error refreshing session:', error);
    return { 
      session: null, 
      error: error instanceof Error 
        ? error 
        : new Error(ERROR_MESSAGES.DEFAULT) 
    };
  }
};

/**
 * Gets the current access token, refreshing it if necessary
 */
export const getAccessToken = async (): Promise<{
  accessToken: string | null;
  error: Error | null;
}> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      throw error || new Error('No active session');
    }

    const { exp } = jwtDecode<JwtPayload>(session.access_token);
    const currentTime = Date.now() / 1000;
    const bufferTime = 5 * 60;

    if (exp < currentTime + bufferTime) {
      const { session: refreshedSession, error: refreshError } = await refreshSessionIfNeeded();
      
      if (refreshError || !refreshedSession) {
        throw refreshError || new Error('Failed to refresh session');
      }

      return { accessToken: refreshedSession.access_token, error: null };
    }

    return { accessToken: session.access_token, error: null };
  } catch (error) {
    console.error('Error getting access token:', error);
    return { 
      accessToken: null, 
      error: error instanceof Error 
        ? error 
        : new Error(ERROR_MESSAGES.DEFAULT) 
    };
  }
};

/**
 * Gets the current user ID from the session
 */
export const getUserId = async (): Promise<{
  userId: string | null;
  error: Error | null;
}> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      throw error || new Error('User not authenticated');
    }

    return { userId: user.id, error: null };
  } catch (error) {
    console.error('Error getting user ID:', error);
    return { 
      userId: null, 
      error: error instanceof Error 
        ? error 
        : new Error(ERROR_MESSAGES.DEFAULT) 
    };
  }
};

/**
 * Validates a JWT token and returns its payload if valid
 */
export const validateToken = async (token: string): Promise<{
  isValid: boolean;
  payload: JwtPayload | null;
  error: string | null;
}> => {
  try {
    if (!token) {
      return { isValid: false, payload: null, error: 'No token provided' };
    }

    const payload = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      return { isValid: false, payload: null, error: 'Token expired' };
    }

    return { isValid: true, payload, error: null };
  } catch (error) {
    console.error('Error validating token:', error);
    return { 
      isValid: false, 
      payload: null, 
      error: error instanceof Error ? error.message : 'Invalid token' 
    };
  }
};

// ============================================================================
// COOKIE UTILITIES
// ============================================================================

const COOKIE_CONFIG: {
  [key: string]: SerializeOptions;
} = {
  session: {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  },
  auth: {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  },
  csrf: {
    httpOnly: false,
    secure: isProd,
    sameSite: 'strict',
    path: '/',
  },
} as const;

/**
 * Parses cookies from a request
 */
export const parseCookies = (cookieHeader: string): Record<string, string | undefined> => {
  return parse(cookieHeader || '');
};

/**
 * Gets a cookie by name
 */
export const getCookie = (
  cookieHeader: string,
  name: string
): string | undefined => {
  const cookies = parseCookies(cookieHeader);
  return cookies[name];
};

/**
 * Sets a cookie
 */
export const setCookie = (
  name: string,
  value: string,
  options: SerializeOptions = {}
): string => {
  const cookieOptions: SerializeOptions = {
    ...COOKIE_CONFIG.auth,
    ...options,
  };

  if (cookieOptions.secure && !isProd) {
    cookieOptions.secure = false;
  }

  return serialize(name, value, cookieOptions);
};

/**
 * Removes a cookie
 */
export const removeCookie = (
  name: string,
  options: SerializeOptions = {}
): string => {
  const cookieOptions: SerializeOptions = {
    ...options,
    maxAge: -1,
    expires: new Date(0),
  };

  return setCookie(name, '', cookieOptions);
};

/**
 * Sets the authentication cookies
 */
export const setAuthCookies = (
  {
    accessToken,
    refreshToken,
    expiresIn,
  }: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
): string[] => {
  return [
    setCookie('sb-access-token', accessToken, {
      ...COOKIE_CONFIG.auth,
      maxAge: expiresIn,
    }),
    setCookie('sb-refresh-token', refreshToken, {
      ...COOKIE_CONFIG.auth,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    }),
    setCookie('sb-logged-in', 'true', {
      ...COOKIE_CONFIG.auth,
      httpOnly: false,
      maxAge: expiresIn,
    }),
  ];
};

/**
 * Clears all authentication cookies
 */
export const clearAuthCookies = (): string[] => {
  return [
    removeCookie('sb-access-token'),
    removeCookie('sb-refresh-token'),
    removeCookie('sb-logged-in'),
  ];
};

/**
 * Generates a CSRF token and sets it as a cookie
 */
export const setCsrfToken = (): { token: string; cookie: string } => {
  const token = Math.random().toString(36).substring(2);
  const cookie = setCookie('sb-csrf-token', token, COOKIE_CONFIG.csrf);
  return { token, cookie };
};

/**
 * Validates a CSRF token
 */
export const validateCsrfToken = (
  cookieHeader: string,
  token?: string
): boolean => {
  const csrfToken = token;
  
  if (!csrfToken) {
    return false;
  }

  const cookieToken = getCookie(cookieHeader, 'sb-csrf-token');
  return cookieToken === csrfToken;
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Checks if an error is an instance of ErrorWithMessage
 */
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ErrorWithMessage).message === 'string'
  );
}

/**
 * Converts an unknown error to a consistent error format
 */
export function toErrorWithMessage(error: unknown): ErrorWithMessage {
  if (isErrorWithMessage(error)) {return error;}

  try {
    return {
      message: error instanceof Error 
        ? error.message 
        : ERROR_MESSAGES.DEFAULT,
      code: (error as { code?: string | number })?.code,
      status: (error as { status?: number })?.status,
      details: error,
    };
  } catch {
    return {
      message: ERROR_MESSAGES.DEFAULT,
      details: error,
    };
  }
}

/**
 * Gets a user-friendly error message from an error
 */
export function getErrorMessage(error: unknown): string {
  const errorWithMessage = toErrorWithMessage(error);
  
  if (errorWithMessage.code) {
    const code = String(errorWithMessage.code).toUpperCase();
    
    const errorMap: Record<string, string> = {
      'EMAIL_NOT_CONFIRMED': 'Please confirm your email before signing in.',
      'INVALID_CREDENTIALS': 'Invalid email or password.',
      'EMAIL_ALREADY_IN_USE': 'This email is already in use.',
      'WEAK_PASSWORD': 'Please choose a stronger password.',
      'USER_NOT_FOUND': 'No account found with this email.',
      'TOKEN_EXPIRED': 'Your session has expired. Please sign in again.',
      'UNAUTHORIZED': 'You are not authorized to perform this action.',
      'RATE_LIMIT_EXCEEDED': 'Too many attempts. Please try again later.',
      'NETWORK_ERROR': 'Unable to connect to the server. Please check your connection.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
    };

    return errorMap[code] || errorWithMessage.message;
  }

  return errorWithMessage.message;
}

/**
 * Custom error class for app errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode: number = 400,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      status: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', details?: unknown) {
    super(message, 'AUTHENTICATION_ERROR', 401, details);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized', details?: unknown) {
    super(message, 'AUTHORIZATION_ERROR', 403, details);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string, details?: unknown) {
    super(`${resource} not found`, 'NOT_FOUND', 404, details);
    this.name = 'NotFoundError';
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  constructor(
    message: string = 'Too many requests',
    retryAfter?: number,
    details?: unknown
  ) {
    const errorDetails = typeof details === 'object' && details !== null 
      ? { ...(details as Record<string, unknown>), retryAfter }
      : { retryAfter };
    super(message, 'RATE_LIMIT_EXCEEDED', 429, errorDetails);
    this.name = 'RateLimitError';
  }
}
