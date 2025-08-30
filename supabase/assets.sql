-- Create assets table for physical and digital assets
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('physical', 'digital')),
  description TEXT,
  acquisition_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending', 'archived')),
  value DECIMAL(12, 2),
  currency VARCHAR(3) DEFAULT 'EUR',
  location VARCHAR(255),
  file_path VARCHAR(1024),
  
  -- Common metadata
  metadata JSONB,
  tags TEXT[],
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create index on common search fields
CREATE INDEX IF NOT EXISTS idx_assets_name ON assets(name);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
CREATE TRIGGER trigger_update_assets_timestamp
BEFORE UPDATE ON assets
FOR EACH ROW
EXECUTE FUNCTION update_assets_updated_at();

-- Add RLS policies
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Policy for viewing assets (all authenticated users can view)
CREATE POLICY assets_select_policy ON assets
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for inserting assets (authenticated users)
CREATE POLICY assets_insert_policy ON assets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating assets (authenticated users)
CREATE POLICY assets_update_policy ON assets
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for deleting assets (authenticated users)
CREATE POLICY assets_delete_policy ON assets
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add comment to the table
COMMENT ON TABLE assets IS 'Stores information about physical and digital assets owned by the organization, including domain names, logos, equipment, and other resources';
