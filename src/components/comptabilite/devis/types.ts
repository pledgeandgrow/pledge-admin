export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id?: string;
  number: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  logo?: string;
}
