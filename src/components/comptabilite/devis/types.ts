// Types for quote documents

export interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface CompanyDetails {
  name: string;
  address: string;
  postal_code: string;
  city: string;
  country: string;
  vat_number?: string;
  registration_number?: string;
  logo_url?: string;
}

export interface QuoteMetadata {
  quote_number: string;
  date: string;
  due_date: string;
  quote_status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  items: QuoteItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string;
  payment_terms: string;
  validity_period: number; // in days
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

// Legacy interface for backward compatibility
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
  items: QuoteItem[];
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
