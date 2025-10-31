// Re-export types from centralized locations
export type { Contact } from '@/hooks/useContacts';
export type { ProjectType as Project } from '@/types/project';
export type { DocumentType } from '@/types/documents';

// Re-export billing types
export type {
  CompanyDetails,
  BillingItem as InvoiceItem,
  InvoiceMetadata,
  InvoiceDocument,
  Invoice,
  InvoiceStats
} from '@/types/billing';
