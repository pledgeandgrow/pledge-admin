/**
 * Performance metrics interface for ambassador marketing campaigns
 * Used to track and display performance data from both contact metadata and campaigns
 */

// Performance metrics interface derived from contact metadata and campaigns
export interface PerformanceMetrics {
  period: string; // e.g., '2025-07', '2025-Q2'
  conversions: number;
  engagement_rate: number;
  reach: number;
  clicks?: number;
  impressions?: number;
  ctr?: number; // Click-through rate
  cost: number; // Campaign cost if available
  roi?: number; // Return on investment
  leads: number; // Number of leads generated
  source: 'contact' | 'campaign';
  campaign_ids?: string[]; // Associated campaign IDs if from campaign source
  date_range?: {
    start: string;
    end: string;
  }; // Actual date range for the period
}

// Helper functions for performance metrics

/**
 * Format a metric value for display
 * @param value The metric value
 * @param type The type of metric (percentage, currency, number)
 * @returns Formatted string
 */
export const formatMetricValue = (
  value: number | undefined, 
  type: 'percentage' | 'currency' | 'number' = 'number'
): string => {
  if (value === undefined) return '-';
  
  switch (type) {
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'currency':
      return `${value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`;
    case 'number':
    default:
      return value.toLocaleString('fr-FR');
  }
};

/**
 * Calculate the trend between two metric values
 * @param current Current value
 * @param previous Previous value
 * @returns Trend percentage (positive for increase, negative for decrease)
 */
export const calculateTrend = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Format a trend value for display
 * @param trend The trend value (percentage)
 * @returns Formatted string with + or - prefix
 */
export const formatTrend = (trend: number): string => {
  if (trend === 0) return '0%';
  return `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`;
};
