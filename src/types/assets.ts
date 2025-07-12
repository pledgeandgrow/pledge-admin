// Asset types based on the database schema
export type AssetType = 'physical' | 'digital';
export type AssetStatus = 'active' | 'expired' | 'pending' | 'archived';

// Base asset interface matching the database schema
export interface Asset {
  id?: string;
  name: string;
  type: AssetType;
  description?: string;
  acquisition_date?: string;
  expiration_date?: string;
  status: AssetStatus;
  value?: number;
  currency?: string;
  location?: string;
  file_path?: string;
  
  // Common metadata
  metadata?: Record<string, any>;
  tags?: string[];
  
  // Audit fields
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

// Asset statistics interface
export interface AssetStatistics {
  total: number;
  active: number;
  expired: number;
  pending: number;
  archived: number;
  totalValue: number;
  byType: {
    physical: number;
    digital: number;
  };
}
