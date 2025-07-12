-- Create projects table with proper references to contacts
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    project_type TEXT NOT NULL CHECK (project_type IN ('Client', 'Internal', 'Partner', 'Lead')),
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'On Hold', 'Cancelled')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget DECIMAL(12, 2),
    -- Primary contact for the project
    primary_contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    -- Array of contact IDs involved in the project: [{"id": "uuid", "role": "manager"}, ...]
    team_contacts JSONB DEFAULT '[]'::jsonb,
    -- Map of contact roles with contact_id as key: {"contact_uuid": {"role": "manager", "permissions": [...], "notes": "text"}, ...}
    contact_roles JSONB DEFAULT '{}'::jsonb,
    tags TEXT[],
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Add foreign key for primary contact
    CONSTRAINT fk_primary_contact FOREIGN KEY (primary_contact_id) REFERENCES public.contacts(id) ON DELETE SET NULL
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON public.projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_primary_contact_id ON public.projects(primary_contact_id);
-- GIN index for efficient JSONB querying
CREATE INDEX IF NOT EXISTS idx_projects_team_contacts_gin ON public.projects USING GIN (team_contacts);

-- Create function to update updated_at column if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects table
CREATE POLICY "Enable read access for all authenticated users" 
ON public.projects 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON public.projects
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
ON public.projects
FOR DELETE
TO authenticated
USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating the updated_at column
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
