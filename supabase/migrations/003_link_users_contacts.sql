-- =====================================================
-- Migration: Link users and contacts
-- Description: Links users table with contacts (members and board-members)
-- Date: 2025-10-13
-- =====================================================

-- =====================================================
-- ADD USER_ID COLUMN TO CONTACTS
-- =====================================================

-- Add user_id column to contacts table
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts(user_id);

-- Add unique constraint to ensure one contact per user
-- (A user can only be linked to one contact record)
CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_user_id_unique 
ON public.contacts(user_id) 
WHERE user_id IS NOT NULL;

-- =====================================================
-- ADD CONTACT_ID COLUMN TO USERS
-- =====================================================

-- Add contact_id column to users table for reverse lookup
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL;

-- Create index on contact_id
CREATE INDEX IF NOT EXISTS idx_users_contact_id ON public.users(contact_id);

-- =====================================================
-- FUNCTION TO SYNC USER AND CONTACT
-- =====================================================

-- Function to automatically create a contact when a user is created
CREATE OR REPLACE FUNCTION public.sync_user_to_contact()
RETURNS TRIGGER AS $$
DECLARE
  new_contact_id uuid;
  contact_type text;
BEGIN
  -- Determine contact type based on user role
  IF NEW.role = 'admin' THEN
    contact_type := 'board-member';
  ELSE
    contact_type := 'member';
  END IF;

  -- Check if contact already exists for this user
  IF NEW.contact_id IS NULL THEN
    -- Create a new contact
    INSERT INTO public.contacts (
      first_name,
      last_name,
      email,
      phone,
      type,
      status,
      user_id,
      created_at,
      updated_at
    ) VALUES (
      COALESCE(NEW.first_name, ''),
      COALESCE(NEW.last_name, ''),
      NEW.email,
      NEW.phone,
      contact_type,
      'active',
      NEW.id,
      NOW(),
      NOW()
    )
    RETURNING id INTO new_contact_id;

    -- Update user with contact_id
    NEW.contact_id := new_contact_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sync contact updates back to user
CREATE OR REPLACE FUNCTION public.sync_contact_to_user()
RETURNS TRIGGER AS $$
BEGIN
  -- If contact has a user_id, update the user record
  IF NEW.user_id IS NOT NULL THEN
    UPDATE public.users
    SET
      first_name = NEW.first_name,
      last_name = NEW.last_name,
      email = NEW.email,
      phone = NEW.phone,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to create contact when user is created/updated
DROP TRIGGER IF EXISTS sync_user_to_contact_trigger ON public.users;
CREATE TRIGGER sync_user_to_contact_trigger
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_to_contact();

-- Trigger to sync contact updates back to user
DROP TRIGGER IF EXISTS sync_contact_to_user_trigger ON public.contacts;
CREATE TRIGGER sync_contact_to_user_trigger
  AFTER UPDATE ON public.contacts
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION public.sync_contact_to_user();

-- =====================================================
-- SYNC EXISTING USERS TO CONTACTS
-- =====================================================

-- Create contacts for existing users who don't have one
DO $$
DECLARE
  user_record RECORD;
  new_contact_id uuid;
  contact_type text;
BEGIN
  FOR user_record IN 
    SELECT * FROM public.users WHERE contact_id IS NULL
  LOOP
    -- Determine contact type based on user role
    IF user_record.role = 'admin' THEN
      contact_type := 'board-member';
    ELSE
      contact_type := 'member';
    END IF;

    -- Create contact
    INSERT INTO public.contacts (
      first_name,
      last_name,
      email,
      phone,
      type,
      status,
      user_id,
      created_at,
      updated_at
    ) VALUES (
      COALESCE(user_record.first_name, ''),
      COALESCE(user_record.last_name, ''),
      user_record.email,
      user_record.phone,
      contact_type,
      'active',
      user_record.id,
      NOW(),
      NOW()
    )
    RETURNING id INTO new_contact_id;

    -- Update user with contact_id
    UPDATE public.users
    SET contact_id = new_contact_id
    WHERE id = user_record.id;

    RAISE NOTICE 'Created contact % for user %', new_contact_id, user_record.email;
  END LOOP;
END $$;

-- =====================================================
-- UPDATE RLS POLICIES
-- =====================================================

-- Allow users to view their own contact
DROP POLICY IF EXISTS "Users can view own contact" ON public.contacts;
CREATE POLICY "Users can view own contact" ON public.contacts
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.role() = 'authenticated'
  );

-- Allow users to update their own contact
DROP POLICY IF EXISTS "Users can update own contact" ON public.contacts;
CREATE POLICY "Users can update own contact" ON public.contacts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get contact for current user
CREATE OR REPLACE FUNCTION public.get_my_contact()
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  email text,
  phone text,
  type text,
  status text,
  company text,
  "position" text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.first_name,
    c.last_name,
    c.email,
    c.phone,
    c.type,
    c.status,
    c.company,
    c."position"
  FROM public.contacts c
  WHERE c.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to promote user to board member
CREATE OR REPLACE FUNCTION public.promote_to_board_member(target_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Update user role
  UPDATE public.users
  SET role = 'admin'
  WHERE id = target_user_id;

  -- Update contact type
  UPDATE public.contacts
  SET type = 'board-member'
  WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to demote board member to regular member
CREATE OR REPLACE FUNCTION public.demote_to_member(target_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Update user role
  UPDATE public.users
  SET role = 'user'
  WHERE id = target_user_id;

  -- Update contact type
  UPDATE public.contacts
  SET type = 'member'
  WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON COLUMN public.contacts.user_id IS 'Link to auth.users - if contact has a user account';
COMMENT ON COLUMN public.users.contact_id IS 'Link to contacts - every user should have a contact record';
COMMENT ON FUNCTION public.sync_user_to_contact() IS 'Automatically creates/updates contact when user is created/updated';
COMMENT ON FUNCTION public.sync_contact_to_user() IS 'Syncs contact updates back to user record';
COMMENT ON FUNCTION public.get_my_contact() IS 'Returns contact record for current authenticated user';
COMMENT ON FUNCTION public.promote_to_board_member(uuid) IS 'Promotes a user to board member (admin role)';
COMMENT ON FUNCTION public.demote_to_member(uuid) IS 'Demotes a board member to regular member (user role)';
