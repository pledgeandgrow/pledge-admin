import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// CLASS NAME UTILITIES
// ============================================================================

/**
 * Merges Tailwind CSS classes with proper precedence handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// FORMAT UTILITIES
// ============================================================================

/**
 * Format a number as currency with the specified currency code
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., 'EUR', 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string to a localized date string
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(typeof date === 'string' ? new Date(date) : date);
};

/**
 * Format a number with thousands separators
 * @param number - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

/**
 * Format a percentage
 * @param number - The number to format as percentage
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (number: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number / 100);
};
