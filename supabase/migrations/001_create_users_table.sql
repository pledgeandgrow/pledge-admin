-- =====================================================
-- Migration: Create users table
-- Description: Creates the public.users table for storing user profiles
-- Date: 2025-10-12
-- =====================================================

-- =====================================================
-- CREATE USERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.users (
  -- Primary key linked to auth.users
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic user information
  email text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  avatar_url text,
  phone text,
  
  -- Role and permissions
  role text DEFAULT 'user'::text CHECK (role IN ('user', 'admin', 'manager', 'viewer')),
  
  -- Account status
  email_verified boolean DEFAULT false,
  status text DEFAULT 'active'::text CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  
  -- Activity tracking
  last_login timestamp with time zone,
  last_sign_in_at timestamp with time zone,
  
  -- Flexible data storage
  metadata jsonb DEFAULT '{}'::jsonb,
  preferences jsonb DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================

-- Index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Index on role for filtering by role
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Index on status for filtering active users
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can insert new users
CREATE POLICY "Admins can insert users" ON public.users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can delete users
CREATE POLICY "Admins can delete users" ON public.users
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

-- Function: Automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    first_name,
    last_name,
    email_verified, 
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NULL),
    NEW.email_confirmed_at IS NOT NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth operation
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Create user profile automatically on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Update updated_at on users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.users IS 'User profiles and metadata';
COMMENT ON COLUMN public.users.id IS 'User ID (references auth.users)';
COMMENT ON COLUMN public.users.email IS 'User email address';
COMMENT ON COLUMN public.users.role IS 'User role: user, admin, manager, viewer';
COMMENT ON COLUMN public.users.status IS 'Account status: active, inactive, suspended, pending';
COMMENT ON COLUMN public.users.metadata IS 'Additional user metadata (JSON)';
COMMENT ON COLUMN public.users.preferences IS 'User preferences (JSON)';
