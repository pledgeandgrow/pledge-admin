// This file contains the Supabase client configuration
// Make sure to set the following environment variables in your .env.local file:
// NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Realtime subscriptions configuration
export const REALTIME_CONFIG = {
  // Channel name for realtime updates
  CHANNEL_NAME: 'realtime',
  
  // Event types
  EVENTS: {
    INSERT: 'INSERT',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    ALL: '*',
  },
  
  // Tables to subscribe to
  TABLES: {
    MESSAGES: 'messages',
    CONVERSATIONS: 'conversations',
    USERS: 'users',
    PROFILES: 'profiles',
  },
};

// Storage buckets
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  UPLOADS: 'uploads',
  PUBLIC: 'public',
};

// Database functions
export const DB_FUNCTIONS = {
  SEARCH: 'search',
  GET_USER_PROFILE: 'get_user_profile',
  GET_CONVERSATION_MESSAGES: 'get_conversation_messages',
};

// Error messages
export const ERROR_MESSAGES = {
  NOT_AUTHENTICATED: 'You must be logged in to perform this action',
  NOT_AUTHORIZED: 'You do not have permission to perform this action',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_IN_USE: 'Email already in use',
  WEAK_PASSWORD: 'Password must be at least 8 characters long',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  DEFAULT: 'An error occurred. Please try again later.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  SIGN_IN: 'Successfully signed in',
  SIGN_UP: 'Account created successfully. Please check your email to verify your account.',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent. Please check your inbox.',
  PASSWORD_UPDATED: 'Password updated successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
};

// Validation rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: false,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    ALLOWED_CHARS: /^[a-zA-Z0-9_.-]+$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};
