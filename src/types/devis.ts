export interface DevisItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Devis {
  id?: string;
  devis_number: string;
  date: string;
  due_date: string;
  status?: "draft" | "sent" | "accepted" | "refused" | "expired";
  company_details: {
    name: string;
    contact: string;
    address: string;
    country: string;
    business_number: string;
    activity_code: string;
    vat_number: string;
    phone: string;
    email: string;
    website: string;
    bank_account?: string;
  };
  client: {
    name: string;
    address: string;
    country: string;
    business_number: string;
    activity_code: string;
    vat_number: string;
    phone: string;
  };
  project_name?: string;
  items: DevisItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  payment_method: string;
  payment_terms: string;
  notes?: string;
  created_at?: string;
}
