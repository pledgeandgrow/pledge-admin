import { supabase } from '@/config/supabase';
import { ERROR_MESSAGES, VALIDATION_RULES } from '@/config/supabase';
import type { User, Session } from '@supabase/supabase-js';

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

/**
 * Handles user sign in with email and password
 */
export const signInWithEmail = async ({ email, password }: SignInCredentials): Promise<{
  data: { user: User | null; session: Session | null } | null;
  error: Error | null;
}> => {
  try {
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.message);
    }

    // Validate password
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
        : new Error(error?.message || ERROR_MESSAGES.DEFAULT) 
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
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.message);
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    // Validate first and last name
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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
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
        : new Error(error?.message || ERROR_MESSAGES.DEFAULT) 
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
      redirectTo: `${window.location.origin}/auth/update-password`,
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
    const { data: { user, session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }

    return { user, session, error: null };
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
