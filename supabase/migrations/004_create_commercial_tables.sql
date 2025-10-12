-- =====================================================
-- Migration: Create commercial tables
-- Description: Creates tables for commercial module (leads, clients, services, packages, etc.)
-- Date: 2025-10-13
-- =====================================================

-- =====================================================
-- UPDATE CONTACTS TABLE (add missing columns if needed)
-- =====================================================

-- Add lead-specific columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'lead_source') THEN
    ALTER TABLE public.contacts ADD COLUMN lead_source text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'lead_score') THEN
    ALTER TABLE public.contacts ADD COLUMN lead_score integer CHECK (lead_score >= 0 AND lead_score <= 100);
  END IF;
END $$;

-- =====================================================
-- LEADS TABLE (view on contacts)
-- =====================================================

-- Create a view for leads
CREATE OR REPLACE VIEW public.leads AS
SELECT 
  c.id,
  c.first_name,
  c.last_name,
  c.email,
  c.phone,
  c.company,
  c."position",
  c.type,
  c.status,
  c.notes,
  c.tags,
  c.metadata,
  c.lead_source,
  c.lead_score,
  c.probability,
  c.estimated_value,
  c.next_follow_up,
  c.last_contacted_at,
  c.added_by,
  c.created_at,
  c.updated_at
FROM public.contacts c
WHERE c.type = 'lead';

-- =====================================================
-- CLIENTS TABLE (view on contacts)
-- =====================================================

-- Add client-specific columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'client_since') THEN
    ALTER TABLE public.contacts ADD COLUMN client_since timestamp with time zone;
  END IF;
END $$;

-- Create a view for clients
CREATE OR REPLACE VIEW public.clients AS
SELECT 
  c.id,
  c.first_name,
  c.last_name,
  c.email,
  c.phone,
  c.company,
  c."position",
  c.type,
  c.status,
  c.notes,
  c.tags,
  c.metadata,
  c.first_contact_date,
  c.last_purchase_date,
  c.total_spent,
  c.client_since,
  c.last_contacted_at,
  c.added_by,
  c.created_at,
  c.updated_at
FROM public.contacts c
WHERE c.type = 'client';

-- =====================================================
-- SERVICES/PRESTATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- Basic information
  name text NOT NULL,
  description text,
  category text CHECK (category IN (
    'consulting',
    'development',
    'design',
    'marketing',
    'training',
    'support',
    'other'
  )),
  
  -- Pricing
  price numeric NOT NULL,
  currency text DEFAULT 'EUR'::text,
  billing_type text DEFAULT 'one-time'::text CHECK (billing_type IN (
    'one-time',
    'hourly',
    'daily',
    'monthly',
    'yearly'
  )),
  
  -- Details
  duration_hours numeric,
  deliverables text[],
  requirements text[],
  
  -- Status
  status text DEFAULT 'active'::text CHECK (status IN (
    'active',
    'inactive',
    'draft',
    'archived'
  )),
  
  -- Metadata
  tags text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Tracking
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT services_pkey PRIMARY KEY (id)
);

-- =====================================================
-- PACKAGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.packages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- Basic information
  name text NOT NULL,
  description text,
  
  -- Pricing
  price numeric NOT NULL,
  currency text DEFAULT 'EUR'::text,
  discount_percentage numeric DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  
  -- Package details
  services jsonb DEFAULT '[]'::jsonb, -- Array of {service_id, quantity}
  duration_months integer,
  
  -- Features
  features text[],
  benefits text[],
  
  -- Status
  status text DEFAULT 'active'::text CHECK (status IN (
    'active',
    'inactive',
    'draft',
    'archived'
  )),
  is_popular boolean DEFAULT false,
  
  -- Metadata
  tags text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Tracking
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT packages_pkey PRIMARY KEY (id)
);

-- =====================================================
-- FORMATIONS/TRAINING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.formations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- Basic information
  title text NOT NULL,
  description text,
  category text,
  level text CHECK (level IN (
    'beginner',
    'intermediate',
    'advanced',
    'expert'
  )),
  
  -- Pricing
  price numeric NOT NULL,
  currency text DEFAULT 'EUR'::text,
  
  -- Training details
  duration_hours numeric NOT NULL,
  max_participants integer,
  format text CHECK (format IN (
    'online',
    'in-person',
    'hybrid'
  )),
  language text DEFAULT 'fr'::text,
  
  -- Schedule
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  schedule text, -- e.g., "Lundi-Vendredi 9h-17h"
  
  -- Content
  objectives text[],
  prerequisites text[],
  program jsonb DEFAULT '[]'::jsonb, -- Array of modules
  materials text[], -- Required materials
  
  -- Instructor
  instructor_id uuid REFERENCES public.contacts(id),
  instructor_name text,
  
  -- Status
  status text DEFAULT 'draft'::text CHECK (status IN (
    'draft',
    'published',
    'ongoing',
    'completed',
    'cancelled',
    'archived'
  )),
  
  -- Enrollment
  current_participants integer DEFAULT 0,
  
  -- Metadata
  tags text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Tracking
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT formations_pkey PRIMARY KEY (id)
);

-- =====================================================
-- OTHER OFFERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.offers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- Basic information
  title text NOT NULL,
  description text,
  type text CHECK (type IN (
    'product',
    'service',
    'subscription',
    'bundle',
    'other'
  )),
  
  -- Pricing
  price numeric NOT NULL,
  currency text DEFAULT 'EUR'::text,
  original_price numeric, -- For showing discounts
  
  -- Offer details
  features text[],
  limitations text[],
  
  -- Validity
  valid_from timestamp with time zone,
  valid_until timestamp with time zone,
  is_limited_time boolean DEFAULT false,
  
  -- Status
  status text DEFAULT 'active'::text CHECK (status IN (
    'active',
    'inactive',
    'draft',
    'expired',
    'archived'
  )),
  
  -- Metadata
  tags text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Tracking
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT offers_pkey PRIMARY KEY (id)
);

-- =====================================================
-- WAITLIST TABLE (already in contacts, but add specific view)
-- =====================================================

-- Create a view for waitlist
CREATE OR REPLACE VIEW public.waitlist AS
SELECT 
  c.id,
  c.first_name,
  c.last_name,
  c.email,
  c.phone,
  c.company,
  c."position",
  c.type,
  c.status,
  c.notes,
  c.tags,
  c.metadata,
  c.waitlist_position,
  c.service,
  c.joined_at,
  c.expires_at,
  c.added_by,
  c.created_at,
  c.updated_at
FROM public.contacts c
WHERE c.type = 'waitlist'
ORDER BY c.waitlist_position ASC NULLS LAST;

-- =====================================================
-- INDEXES
-- =====================================================

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON public.services(created_at DESC);

-- Packages indexes
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_is_popular ON public.packages(is_popular);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON public.packages(created_at DESC);

-- Formations indexes
CREATE INDEX IF NOT EXISTS idx_formations_status ON public.formations(status);
CREATE INDEX IF NOT EXISTS idx_formations_level ON public.formations(level);
CREATE INDEX IF NOT EXISTS idx_formations_start_date ON public.formations(start_date);
CREATE INDEX IF NOT EXISTS idx_formations_instructor_id ON public.formations(instructor_id);

-- Offers indexes
CREATE INDEX IF NOT EXISTS idx_offers_status ON public.offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_type ON public.offers(type);
CREATE INDEX IF NOT EXISTS idx_offers_valid_until ON public.offers(valid_until);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Services policies
CREATE POLICY "Authenticated users can view services" ON public.services
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert services" ON public.services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update services" ON public.services
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete services" ON public.services
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Packages policies
CREATE POLICY "Authenticated users can view packages" ON public.packages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert packages" ON public.packages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update packages" ON public.packages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete packages" ON public.packages
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Formations policies
CREATE POLICY "Authenticated users can view formations" ON public.formations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert formations" ON public.formations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update formations" ON public.formations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete formations" ON public.formations
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Offers policies
CREATE POLICY "Authenticated users can view offers" ON public.offers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert offers" ON public.offers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update offers" ON public.offers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete offers" ON public.offers
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at for services
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update updated_at for packages
CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update updated_at for formations
CREATE TRIGGER update_formations_updated_at
  BEFORE UPDATE ON public.formations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update updated_at for offers
CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.services IS 'Services/Prestations offered by the company';
COMMENT ON TABLE public.packages IS 'Service packages with bundled offerings';
COMMENT ON TABLE public.formations IS 'Training programs and courses';
COMMENT ON TABLE public.offers IS 'Other commercial offers and promotions';
COMMENT ON VIEW public.leads IS 'View of contacts with type=lead';
COMMENT ON VIEW public.clients IS 'View of contacts with type=client';
COMMENT ON VIEW public.waitlist IS 'View of contacts with type=waitlist';
