// Data types based on the database schema
export type DataType = 'statistics' | 'information' | 'documentation' | 'news' | 'update' | 'content' | 'post';
export type DataStatus = 'draft' | 'published' | 'archived';
export type VisibilityLevel = 'public' | 'private' | 'restricted';

// Base data interface matching the database schema
export interface Data {
  id?: string;
  title: string;
  slug?: string;
  data_type: DataType;
  
  // Common fields
  content?: string;
  summary?: string;
  
  // Metadata
  author_id?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  status: DataStatus;
  
  // Categorization
  category?: string;
  tags?: string[];
  
  // Media
  featured_image_url?: string;
  media_urls?: string[];
  
  // Type-specific fields
  metadata?: Record<string, any>;
  
  // Access control
  is_public?: boolean;
  visibility_level?: VisibilityLevel;
}

// Data statistics interface
export interface DataStatistics {
  total: number;
  published: number;
  draft: number;
  archived: number;
  byType: Record<DataType, number>;
  byCategory: Record<string, number>;
  publicCount: number;
  privateCount: number;
  restrictedCount: number;
}
