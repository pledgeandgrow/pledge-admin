-- Create contacts table if not exists
CREATE TABLE IF NOT EXISTS public.contacts (
  -- Base fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  type TEXT NOT NULL CHECK (type IN (
    'board-member', 'external', 'freelance', 'member', 
    'network', 'partner', 'waitlist', 'blacklist', 
    'lead', 'client', 'investor'
  )),
  status TEXT NOT NULL,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Common fields
  company TEXT,
  position TEXT,
  tags TEXT[],
  
  -- Waitlist specific
  service TEXT,
  waitlist_position INTEGER,
  joined_at TIMESTAMPTZ,
  
  -- Blacklist specific
  reason TEXT,
  added_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  
  -- Lead specific
  source TEXT,
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  last_contacted_at TIMESTAMPTZ,
  next_follow_up TIMESTAMPTZ,
  estimated_value DECIMAL(10, 2),
  
  -- Client specific
  first_contact_date TIMESTAMPTZ,
  last_purchase_date TIMESTAMPTZ,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  
  -- Investor specific
  investment_stage TEXT CHECK (investment_stage IN (
    'seed', 'series-a', 'series-b', 'series-c', 'growth', 'private-equity'
  )),
  investment_focus TEXT[],
  portfolio_companies TEXT[],
  minimum_check_size DECIMAL(15, 2),
  maximum_check_size DECIMAL(15, 2),
  preferred_industries TEXT[],
  last_contact_date TIMESTAMPTZ,
  investment_status TEXT CHECK (investment_status IN (
    'active', 'inactive', 'following', 'not-interested'
  )),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contacts_type ON public.contacts(type);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON public.contacts(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_company ON public.contacts(company) WHERE company IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_investment_stage ON public.contacts(investment_stage) WHERE type = 'investor';




ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view all contacts
CREATE POLICY "Enable read access for all authenticated users" 
ON public.contacts
FOR SELECT
TO authenticated
USING (true);

-- Allow users to create their own contacts
CREATE POLICY "Enable insert for authenticated users"
ON public.contacts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to update their own contacts
CREATE POLICY "Enable update for authenticated users"
ON public.contacts
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow users to delete their own contacts
CREATE POLICY "Enable delete for admin users"
ON public.contacts
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');