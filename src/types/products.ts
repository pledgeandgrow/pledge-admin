// Product types based on the database schema
export type ProductType = 'service' | 'package' | 'membership' | 'software' | 'tool' | 'hardware';
export type ProductStatus = 'active' | 'discontinued' | 'draft' | 'archived';

// Base product interface matching the database schema
export interface Product {
  id?: string;
  name: string;
  type: ProductType;
  description?: string;
  price?: number;
  cost?: number;
  currency?: string;
  status: ProductStatus;
  
  // Supplier information
  supplier_id?: string;
  supplier_name?: string;
  
  // Basic inventory information
  sku?: string;
  stock_quantity?: number;
  
  // Common metadata
  metadata?: Record<string, any>;
  tags?: string[];
  
  // Audit fields
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

// Product statistics interface
export interface ProductStatistics {
  total: number;
  active: number;
  discontinued: number;
  draft: number;
  archived: number;
  totalRevenue: number;
  totalCost: number;
  profitMargin: number;
  byType: Record<ProductType, number>;
}
