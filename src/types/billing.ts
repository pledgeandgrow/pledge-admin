// Centralized billing types for invoices and quotes

export interface CompanyDetails {
  name: string;
  address: string;
  postal_code: string;
  city: string;
  country: string;
  vat_number?: string;
  registration_number?: string;
  phone?: string;
  email?: string;
  website?: string;
  bank_account?: string;
  logo_url?: string;
}

export interface BillingClient {
  id: string;
  name: string;
  email: string;
  address: string;
  postal_code: string;
  city: string;
  country: string;
  phone?: string;
  vat_number?: string;
  company_details?: {
    is_company: boolean;
    vat_number?: string;
    registration_number?: string;
  };
}

export interface BillingItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  amount: number;
  total?: number;
}

// Quote-specific types
export interface QuoteMetadata {
  quote_number: string;
  date: string;
  due_date: string;
  quote_status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  client: BillingClient;
  project_id?: string;
  project_name?: string;
  items: BillingItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string;
  payment_terms: string;
  payment_method: string;
  currency: string;
  language: 'fr' | 'en';
  company_details: CompanyDetails;
}

export interface QuoteDocument {
  id: string;
  title: string;
  description: string;
  document_type_id: string;
  custom_type?: string;
  file_path?: string;
  file_name?: string;
  status: string;
  project_id?: string;
  contact_id?: string;
  created_by: string;
  last_modified_by: string;
  metadata: QuoteMetadata;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

// Legacy Quote interface for backward compatibility
export interface Quote {
  id?: string;
  title?: string;
  description?: string;
  quote_number: string;
  date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  client: {
    id: string;
    name: string;
    email: string;
    address: string;
    postal_code: string;
    city: string;
    country: string;
    vat_number?: string;
  };
  items: BillingItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string;
  payment_terms: string;
  validity_period: number;
  project_id?: string;
  project_name?: string;
  currency: string;
  language: 'fr' | 'en';
  company_details: CompanyDetails;
  created_at?: string;
  updated_at?: string;
}

// Invoice-specific types
export interface InvoiceMetadata {
  invoice_number: string;
  date: string;
  due_date: string;
  invoice_status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: BillingItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  payment_terms?: string;
  payment_method?: string;
  paid_at?: string;
  currency: string;
  language: 'fr' | 'en';
  company_details: CompanyDetails;
  client: BillingClient;
  project_id?: string;
  project_name?: string;
}

export interface InvoiceDocument {
  id: string;
  title: string;
  description?: string;
  document_type_id: string;
  file_path?: string;
  file_name?: string;
  status: 'Draft' | 'Active' | 'Archived' | 'Deleted';
  project_id?: string;
  contact_id?: string;
  created_by?: string;
  last_modified_by?: string;
  metadata: InvoiceMetadata;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

// Legacy Invoice interface for backward compatibility
export interface Invoice extends Omit<InvoiceDocument, 'metadata' | 'contact_id' | 'status'> {
  invoice_number: string;
  date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  client: BillingClient;
  items: BillingItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  payment_terms?: string;
  payment_method?: string;
  project_id?: string;
  project_name?: string;
  currency: string;
  language: 'fr' | 'en';
  company_details: CompanyDetails;
}

// Statistics
export interface InvoiceStats {
  total_count: number;
  draft_count: number;
  sent_count: number;
  paid_count: number;
  overdue_count: number;
  total_amount: number;
  paid_amount: number;
  overdue_amount: number;
  currency: string;
}

// Re-export for backward compatibility
export type QuoteItem = BillingItem;
export type InvoiceItem = BillingItem;
export type ExtendedClient = BillingClient;
