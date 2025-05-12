export interface Invoice {
  id: string;
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
  created_at: string;
  updated_at: string;
  paid_at?: string;
  project_id?: string;
  project_name?: string;
  currency: string;
  language: "fr" | "en";
  company_details: {
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
  };
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
