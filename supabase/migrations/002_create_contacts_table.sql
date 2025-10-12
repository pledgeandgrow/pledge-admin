-- =====================================================
-- Migration: Create contacts table
-- Description: Creates the public.contacts table for managing all types of contacts
-- Date: 2025-10-13
-- =====================================================

-- =====================================================
-- CREATE CONTACTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.contacts (
  -- Primary key
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- Basic information
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone text,
  company text,
  position text,
  
  -- Contact type and status
  type text NOT NULL CHECK (type IN (
    'board-member',
    'member',
    'freelance',
    'partner',
    'investor',
    'externe',
    'network',
    'lead',
    'client',
    'waitlist',
    'blacklist'
  )),
  status text NOT NULL DEFAULT 'active'::text CHECK (status IN (
    'active',
    'inactive',
    'pending',
    'archived'
  )),
  
  -- Additional fields
  notes text,
  tags text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Specific fields for different types
  -- For board members
  board_role text,
  board_start_date timestamp with time zone,
  board_end_date timestamp with time zone,
  
  -- For freelancers
  hourly_rate numeric,
  availability text,
  skills text[],
  
  -- For partners
  partnership_type text,
  partnership_start_date timestamp with time zone,
  contract_end_date timestamp with time zone,
  
  -- For investors
  investment_stage text CHECK (investment_stage IN (
    'seed',
    'series-a',
    'series-b',
    'series-c',
    'growth',
    'private-equity'
  )),
  investment_focus text[],
  portfolio_companies text[],
  minimum_check_size numeric,
  maximum_check_size numeric,
  investment_status text CHECK (investment_status IN (
    'active',
    'inactive',
    'following',
    'not-interested'
  )),
  
  -- For leads
  lead_source text,
  lead_score integer CHECK (lead_score >= 0 AND lead_score <= 100),
  probability integer CHECK (probability >= 0 AND probability <= 100),
  estimated_value numeric,
  next_follow_up timestamp with time zone,
  
  -- For clients
  first_contact_date timestamp with time zone,
  last_purchase_date timestamp with time zone,
  total_spent numeric DEFAULT 0,
  client_since timestamp with time zone,
  
  -- For waitlist
  waitlist_position integer,
  service text,
  joined_at timestamp with time zone,
  expires_at timestamp with time zone,
  
  -- For blacklist
  reason text,
  blacklisted_at timestamp with time zone,
  
  -- Tracking
  added_by uuid REFERENCES auth.users(id),
  last_contacted_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT contacts_pkey PRIMARY KEY (id)
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================

-- Index on type for filtering
CREATE INDEX IF NOT EXISTS idx_contacts_type ON public.contacts(type);

-- Index on status
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);

-- Index on email for lookups
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);

-- Index on company
CREATE INDEX IF NOT EXISTS idx_contacts_company ON public.contacts(company);

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);

-- Index on tags using GIN for array operations
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON public.contacts USING GIN(tags);

-- Full text search index
CREATE INDEX IF NOT EXISTS idx_contacts_search ON public.contacts USING GIN(
  to_tsvector('english', 
    COALESCE(first_name, '') || ' ' || 
    COALESCE(last_name, '') || ' ' || 
    COALESCE(email, '') || ' ' || 
    COALESCE(company, '')
  )
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Policy: Authenticated users can view all contacts
CREATE POLICY "Authenticated users can view contacts" ON public.contacts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert contacts
CREATE POLICY "Authenticated users can insert contacts" ON public.contacts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update contacts
CREATE POLICY "Authenticated users can update contacts" ON public.contacts
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only admins can delete contacts
CREATE POLICY "Admins can delete contacts" ON public.contacts
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Update updated_at on contacts table
DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_contacts_updated_at();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.contacts IS 'All types of contacts including board members, members, freelancers, partners, investors, etc.';
COMMENT ON COLUMN public.contacts.type IS 'Type of contact: board-member, member, freelance, partner, investor, externe, network, lead, client, waitlist, blacklist';
COMMENT ON COLUMN public.contacts.status IS 'Status: active, inactive, pending, archived';
COMMENT ON COLUMN public.contacts.metadata IS 'Additional flexible data storage (JSON)';
COMMENT ON COLUMN public.contacts.tags IS 'Array of tags for categorization';
