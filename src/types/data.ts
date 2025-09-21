// Data types based on the database schema
export type DataType = 'statistics' | 'information' | 'documentation' | 'news' | 'update' | 'content' | 'post' | 'formation' | 'depense' | 'campagne' | 'test';
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
  metadata?: Record<string, unknown>;
  
  // Access control
  is_public?: boolean;
  visibility_level?: VisibilityLevel;
}

// Campaign specific types
export type CampaignStatus = 'draft' | 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
export type CampaignObjective = 'awareness' | 'consideration' | 'conversion' | 'acquisition' | 'loyalty' | 'advocacy';
export type CampaignType = 'ambassador' | 'referral' | 'influencer' | 'social' | 'email' | 'content' | 'event' | 'other';

// Campaign interface for Supabase integration
export interface Campaign {
  id?: string;
  name: string;
  description?: string;
  campaign_type: CampaignType;
  status: CampaignStatus;
  objective: CampaignObjective;
  start_date: string;
  end_date?: string;
  budget?: number;
  spent?: number;
  target_audience?: string;
  kpis?: {
    impressions?: number;
    engagement?: number;
    conversions?: number;
    reach?: number;
    clicks?: number;
    leads?: number;
    cost?: number;
    roi?: number;
    ctr?: number;
  };
  ambassadeurs?: string[]; // Array of ambassador contact IDs
  rewards?: {
    type: string;
    description: string;
    value?: number;
  }[];
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  metadata?: Record<string, unknown>;
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
