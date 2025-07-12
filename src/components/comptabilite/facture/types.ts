// Database types that match the Supabase schema
export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  type: string;
  status: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  vat_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  project_type: string;
  status: string;
  primary_contact_id?: string;
  team_contacts?: { id: string; name?: string; role?: string }[];
  contact_roles?: Record<string, { role: string; permissions?: string[] }>;
  created_at: string;
  updated_at: string;
}

export interface DocumentType {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_active: boolean;
}

// Invoice specific types
export interface InvoiceDocument {
  id: string;
  title: string;
  description?: string;
  document_type_id: string; // Will be the ID of 'facture' document type
  file_path?: string;
  file_name?: string;
  status: "Draft" | "Active" | "Archived" | "Deleted";
  project_id?: string;
  contact_id?: string;
  created_by?: string;
  last_modified_by?: string;
  metadata: InvoiceMetadata;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface InvoiceMetadata {
  invoice_number: string;
  date: string;
  due_date: string;
  invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  payment_terms?: string;
  payment_method?: string;
  paid_at?: string;
  currency: string;
  language: "fr" | "en";
  company_details: CompanyDetails;
}

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
}

// For backwards compatibility with existing components
export interface Invoice extends Omit<InvoiceDocument, 'metadata' | 'contact_id' | 'status'> {
  invoice_number: string;
  date: string;
  due_date: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
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
  items: InvoiceItem[];
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
  language: "fr" | "en";
  company_details: CompanyDetails;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total: number;
}

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
