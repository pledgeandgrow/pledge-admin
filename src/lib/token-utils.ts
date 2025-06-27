import { jwtDecode } from 'jwt-decode';
import { supabase } from '@/config/supabase';
import { ERROR_MESSAGES } from '@/config/supabase';

type JwtPayload = {
  /** Expiration time (Unix timestamp) */
  exp: number;
  /** Issued at (Unix timestamp) */
  iat: number;
  /** Subject (user ID) */
  sub: string;
  /** Email */
  email?: string;
  /** Email verification status */
  email_verified?: boolean;
  /** Phone number */
  phone?: string;
  /** App metadata */
  app_metadata?: {
    provider?: string;
    [key: string]: unknown;
  };
  /** User metadata */
  user_metadata?: Record<string, unknown>;
  /** Role */
  role?: string;
  /** Authentication method reference */
  aal?: string;
  /** Authentication method reference levels */
  amr?: Array<{ method: string; timestamp: number }>;
  /** Session ID */
  session_id?: string;
};

/**
 * Checks if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Consider invalid token as expired
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
interface Session {
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

export const refreshSessionIfNeeded = async (): Promise<{
  session: Session | null;
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

    // Refresh session if it's expired or will expire in the next 5 minutes
    const { exp } = jwtDecode<JwtPayload>(session.access_token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    const bufferTime = 5 * 60; // 5 minutes in seconds

    if (exp < currentTime + bufferTime) {
      const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: session.refresh_token,
      });

      if (refreshError) {
        throw refreshError;
      }

      return { session: refreshedSession.session, error: null };
    }

    return { session, error: null };
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

    // Check if token is expired or about to expire
    const { exp } = jwtDecode<JwtPayload>(session.access_token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    const bufferTime = 5 * 60; // 5 minutes in seconds

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
    
    // Check if token is expired
    const currentTime = Date.now() / 1000; // Convert to seconds
    if (payload.exp < currentTime) {
      return { isValid: false, payload: null, error: 'Token expired' };
    }

    // Additional validation can be added here (e.g., verify signature)
    
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
