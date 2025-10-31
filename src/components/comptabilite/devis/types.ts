// Re-export types from centralized billing types
export type {
  CompanyDetails,
  BillingClient as ExtendedClient,
  BillingItem as QuoteItem,
  QuoteMetadata,
  QuoteDocument,
  Quote
} from '@/types/billing';
