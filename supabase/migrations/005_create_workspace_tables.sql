-- =====================================================
-- Migration: Create workspace tables
-- Description: Creates tables for workspace module (projects, tasks, calendar, documents)
-- Date: 2025-10-13
-- =====================================================

-- =====================================================
-- PROJECTS TABLE (already exists, but verify/update)
-- =====================================================

-- Projects table should already exist from schema
-- Add any missing columns if needed
DO $$ 
BEGIN
  -- Add project_type if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'project_type') THEN
    ALTER TABLE public.projects ADD COLUMN project_type text CHECK (project_type IN ('Client', 'Internal', 'Partner', 'Lead'));
  END IF;
  
  -- Add budget if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'budget') THEN
    ALTER TABLE public.projects ADD COLUMN budget numeric;
  END IF;
  
  -- Add progress if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'progress') THEN
    ALTER TABLE public.projects ADD COLUMN progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);
  END IF;
END $$;

-- =====================================================
-- TASKS TABLE (already exists, but verify/update)
-- =====================================================

-- Tasks table should already exist from schema
-- Add any missing columns if needed
DO $$ 
BEGIN
  -- Add estimate_hours if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'estimate_hours') THEN
    ALTER TABLE public.tasks ADD COLUMN estimate_hours numeric;
  END IF;
  
  -- Add actual_hours if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'actual_hours') THEN
    ALTER TABLE public.tasks ADD COLUMN actual_hours numeric;
  END IF;
  
  -- Add parent_task_id if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'parent_task_id') THEN
    ALTER TABLE public.tasks ADD COLUMN parent_task_id uuid REFERENCES public.tasks(id);
  END IF;
END $$;

-- =====================================================
-- EVENTS/CALENDAR TABLE (already exists, but verify/update)
-- =====================================================

-- Events table should already exist from schema
-- Add any missing columns if needed
DO $$ 
BEGIN
  -- Add is_all_day if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_all_day') THEN
    ALTER TABLE public.events ADD COLUMN is_all_day boolean DEFAULT false;
  END IF;
  
  -- Add attendees if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'attendees') THEN
    ALTER TABLE public.events ADD COLUMN attendees jsonb DEFAULT '[]'::jsonb;
  END IF;
  
  -- Add recurrence if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'recurrence') THEN
    ALTER TABLE public.events ADD COLUMN recurrence jsonb;
  END IF;
END $$;

-- =====================================================
-- DOCUMENTS TABLE (already exists, but verify/update)
-- =====================================================

-- Documents table should already exist from schema
-- Add any missing columns if needed
DO $$ 
BEGIN
  -- Add version if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'version') THEN
    ALTER TABLE public.documents ADD COLUMN version text DEFAULT '1.0';
  END IF;
  
  -- Add is_template if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'is_template') THEN
    ALTER TABLE public.documents ADD COLUMN is_template boolean DEFAULT false;
  END IF;
END $$;

-- =====================================================
-- TIME TRACKING TABLE (new)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.time_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- Relations
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Time tracking
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  duration_minutes integer, -- Calculated field
  
  -- Details
  description text,
  billable boolean DEFAULT true,
  hourly_rate numeric,
  
  -- Status
  status text DEFAULT 'running'::text CHECK (status IN (
    'running',
    'paused',
    'completed',
    'cancelled'
  )),
  
  -- Metadata
  tags text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Tracking
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT time_entries_pkey PRIMARY KEY (id),
  CONSTRAINT time_entries_end_after_start CHECK (end_time IS NULL OR end_time > start_time)
);

-- =====================================================
-- COMMENTS TABLE (new)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- Relations (polymorphic - can comment on tasks, projects, documents)
  entity_type text NOT NULL CHECK (entity_type IN ('task', 'project', 'document', 'event')),
  entity_id uuid NOT NULL,
  
  -- Comment details
  content text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Threading
  parent_comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  
  -- Reactions
  reactions jsonb DEFAULT '{}'::jsonb, -- {emoji: [user_ids]}
  
  -- Status
  is_edited boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  
  -- Tracking
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT comments_pkey PRIMARY KEY (id)
);

-- =====================================================
-- ATTACHMENTS TABLE (new)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- Relations (polymorphic)
  entity_type text NOT NULL CHECK (entity_type IN ('task', 'project', 'document', 'event', 'comment')),
  entity_id uuid NOT NULL,
  
  -- File details
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  file_type text,
  mime_type text,
  
  -- Upload details
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Tracking
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT attachments_pkey PRIMARY KEY (id)
);

-- =====================================================
-- ACTIVITY LOG TABLE (new)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- Relations
  entity_type text NOT NULL CHECK (entity_type IN ('task', 'project', 'document', 'event', 'contact')),
  entity_id uuid NOT NULL,
  
  -- Activity details
  action text NOT NULL CHECK (action IN (
    'created',
    'updated',
    'deleted',
    'commented',
    'assigned',
    'completed',
    'archived',
    'restored'
  )),
  description text,
  changes jsonb, -- Before/after values
  
  -- Actor
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Tracking
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT activity_log_pkey PRIMARY KEY (id)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Time entries indexes
CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON public.time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON public.time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON public.time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_start_time ON public.time_entries(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_time_entries_status ON public.time_entries(status);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_entity ON public.comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- Attachments indexes
CREATE INDEX IF NOT EXISTS idx_attachments_entity ON public.attachments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_attachments_uploaded_by ON public.attachments(uploaded_by);

-- Activity log indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON public.activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON public.activity_log(action);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Time entries policies
CREATE POLICY "Authenticated users can view time entries" ON public.time_entries
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own time entries" ON public.time_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own time entries" ON public.time_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own time entries" ON public.time_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Authenticated users can view comments" ON public.comments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert comments" ON public.comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = author_id);

-- Attachments policies
CREATE POLICY "Authenticated users can view attachments" ON public.attachments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert attachments" ON public.attachments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete own attachments" ON public.attachments
  FOR DELETE USING (auth.uid() = uploaded_by);

-- Activity log policies (read-only for most users)
CREATE POLICY "Authenticated users can view activity log" ON public.activity_log
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert activity log" ON public.activity_log
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at for time_entries
CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON public.time_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update updated_at for comments
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Calculate duration for time entries
CREATE OR REPLACE FUNCTION public.calculate_time_entry_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_time IS NOT NULL THEN
    NEW.duration_minutes := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_duration_trigger
  BEFORE INSERT OR UPDATE ON public.time_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_time_entry_duration();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to log activity
CREATE OR REPLACE FUNCTION public.log_activity(
  p_entity_type text,
  p_entity_id uuid,
  p_action text,
  p_description text DEFAULT NULL,
  p_changes jsonb DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  activity_id uuid;
BEGIN
  INSERT INTO public.activity_log (
    entity_type,
    entity_id,
    action,
    description,
    changes,
    user_id
  ) VALUES (
    p_entity_type,
    p_entity_id,
    p_action,
    p_description,
    p_changes,
    auth.uid()
  )
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.time_entries IS 'Time tracking entries for tasks and projects';
COMMENT ON TABLE public.comments IS 'Comments on tasks, projects, documents, and events';
COMMENT ON TABLE public.attachments IS 'File attachments for various entities';
COMMENT ON TABLE public.activity_log IS 'Activity log for tracking changes';
COMMENT ON FUNCTION public.log_activity IS 'Helper function to log activities';
