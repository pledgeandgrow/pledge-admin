-- Create products table for services, packages, special offers, memberships, software, and tools
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  price DECIMAL(12, 2),
  cost DECIMAL(12, 2),
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'discontinued', 'draft', 'archived')),
  
  -- Supplier information
  supplier_id UUID,
  supplier_name VARCHAR(255),
  
  -- Basic inventory information
  sku VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  
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
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_supplier_name ON products(supplier_name);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
CREATE TRIGGER trigger_update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_products_updated_at();

-- Add RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy for viewing products (all authenticated users can view)
CREATE POLICY products_select_policy ON products
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for inserting products (authenticated users)
CREATE POLICY products_insert_policy ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating products (authenticated users)
CREATE POLICY products_update_policy ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for deleting products (authenticated users)
CREATE POLICY products_delete_policy ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add comment to the table
COMMENT ON TABLE products IS 'Stores information about products including services, packages, special offers, memberships, software, and tools';
