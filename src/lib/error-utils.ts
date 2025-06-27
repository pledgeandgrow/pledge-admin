import { ERROR_MESSAGES } from '@/config/supabase';
import { ApiError } from './api';

type ErrorWithMessage = {
  message: string;
  code?: string | number;
  status?: number;
  details?: unknown;
};

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
  if (isErrorWithMessage(error)) return error;

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
    // Fallback in case there's an error while processing the error
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
  
  // Handle specific error codes
  if (errorWithMessage.code) {
    const code = String(errorWithMessage.code).toUpperCase();
    
    // Map common error codes to user-friendly messages
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
 * Handles API errors consistently
 */
export function handleApiError(
  error: unknown,
  context: string = 'An error occurred'
): never {
  const errorWithMessage = toErrorWithMessage(error);
  
  // Log the error with context
  console.error(`[${context}]`, {
    message: errorWithMessage.message,
    code: errorWithMessage.code,
    status: errorWithMessage.status,
    details: errorWithMessage.details,
  });

  // Throw a consistent error format
  throw new ApiError(
    getErrorMessage(errorWithMessage),
    errorWithMessage.code?.toString(),
    errorWithMessage.status
  );
}

/**
 * Creates a custom error with additional context
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
    
    // Maintain proper stack trace in V8
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
 * Creates a validation error
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Creates an authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', details?: unknown) {
    super(message, 'AUTHENTICATION_ERROR', 401, details);
    this.name = 'AuthenticationError';
  }
}

/**
 * Creates an authorization error
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized', details?: unknown) {
    super(message, 'AUTHORIZATION_ERROR', 403, details);
    this.name = 'AuthorizationError';
  }
}

/**
 * Creates a not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string, details?: unknown) {
    super(`${resource} not found`, 'NOT_FOUND', 404, details);
    this.name = 'NotFoundError';
  }
}

/**
 * Creates a rate limit error
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
