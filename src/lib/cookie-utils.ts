import { CookieSerializeOptions } from 'cookie';
import { Request, Response, NextFunction } from 'express';
import { parse, serialize } from 'cookie';
import { env } from '@/config/env';

// Cookie configuration
const COOKIE_CONFIG: {
  [key: string]: CookieSerializeOptions;
} = {
  session: {
    httpOnly: true,
    secure: env.isProd, // Only send over HTTPS in production
    sameSite: 'lax', // CSRF protection
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
  auth: {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  csrf: {
    httpOnly: false, // Needs to be accessible from JavaScript
    secure: env.isProd,
    sameSite: 'strict',
    path: '/',
  },
} as const;

/**
 * Parses cookies from a request
 */
export const parseCookies = (req: Request): Record<string, string> => {
  // For API Routes we don't need to parse the cookies
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
};

/**
 * Gets a cookie by name
 */
export const getCookie = (
  req: Request,
  name: string
): string | undefined => {
  const cookies = parseCookies(req);
  return cookies[name];
};

/**
 * Sets a cookie
 */
export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieSerializeOptions = {}
): void => {
  const cookieOptions: CookieSerializeOptions = {
    ...COOKIE_CONFIG.auth, // Default to auth config
    ...options, // Allow overriding defaults
  };

  // Handle secure cookies in production
  if (cookieOptions.secure && !env.isProd) {
    cookieOptions.secure = false; // Disable secure in development
  }

  // Set the cookie
  const cookieValue = serialize(name, value, cookieOptions);
  res.setHeader('Set-Cookie', cookieValue);
};

/**
 * Removes a cookie
 */
export const removeCookie = (
  res: Response,
  name: string,
  options: CookieSerializeOptions = {}
): void => {
  // Set maxAge to a past date to expire the cookie
  const cookieOptions: CookieSerializeOptions = {
    ...options,
    maxAge: -1,
    expires: new Date(0),
  };

  setCookie(res, name, '', cookieOptions);
};

/**
 * Sets the authentication cookies
 */
export const setAuthCookies = (
  res: Response,
  {
    accessToken,
    refreshToken,
    expiresIn,
  }: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
): void => {
  // Set access token cookie
  setCookie(res, 'sb-access-token', accessToken, {
    ...COOKIE_CONFIG.auth,
    maxAge: expiresIn,
  });

  // Set refresh token cookie (more secure with httpOnly)
  setCookie(res, 'sb-refresh-token', refreshToken, {
    ...COOKIE_CONFIG.auth,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // Set a logged-in flag (for client-side checks)
  setCookie(res, 'sb-logged-in', 'true', {
    ...COOKIE_CONFIG.auth,
    httpOnly: false, // Allow client-side checks
    maxAge: expiresIn,
  });
};

/**
 * Clears all authentication cookies
 */
export const clearAuthCookies = (res: Response): void => {
  removeCookie(res, 'sb-access-token');
  removeCookie(res, 'sb-refresh-token');
  removeCookie(res, 'sb-logged-in');
};

/**
 * Generates a CSRF token and sets it as a cookie
 */
export const setCsrfToken = (res: Response): string => {
  const token = Math.random().toString(36).substring(2);
  setCookie(res, 'sb-csrf-token', token, COOKIE_CONFIG.csrf);
  return token;
};

/**
 * Validates a CSRF token
 */
export const validateCsrfToken = (
  req: Request,
  token?: string
): boolean => {
  // Get token from header or body
  const csrfToken = token || req.headers['x-csrf-token'] || req.body?._csrf;
  
  if (!csrfToken) {
    return false;
  }

  // Get the cookie
  const cookieToken = getCookie(req, 'sb-csrf-token');
  
  // Compare tokens
  return cookieToken === csrfToken;
};

/**
 * Middleware to check if user is authenticated
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = getCookie(req, 'sb-access-token');
  
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  // Here you would validate the token
  // For now, we'll just check if it exists
  next();
};

/**
 * Middleware to check for CSRF protection
 */
export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Skip CSRF for GET, HEAD, and OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }

  // Validate CSRF token
  if (!validateCsrfToken(req)) {
    res.status(403).json({ error: 'Invalid CSRF token' });
    return;
  }

  next();
};
