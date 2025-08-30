CREATE TABLE data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  data_type VARCHAR(50) NOT NULL, -- 'statistics', 'information', 'documentation', 'news', 'update', 'content', 'post', etc.
  
  -- Common fields
  content TEXT,
  summary TEXT,
  
  -- Metadata
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  
  -- Categorization
  category VARCHAR(100),
  tags TEXT[],
  
  -- Media
  featured_image_url TEXT,
  media_urls TEXT[],
  
  -- Type-specific fields (stored as JSONB for flexibility)
  metadata JSONB,
  
  -- Access control
  is_public BOOLEAN DEFAULT true,
  visibility_level VARCHAR(50) DEFAULT 'public', -- 'public', 'private', 'restricted'
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'C')
  ) STORED
);

-- Create indexes for better performance
CREATE INDEX data_data_type_idx ON data(data_type);
CREATE INDEX data_category_idx ON data(category);
CREATE INDEX data_status_idx ON data(status);
CREATE INDEX data_search_idx ON data USING GIN(search_vector);
CREATE INDEX data_metadata_idx ON data USING GIN(metadata);