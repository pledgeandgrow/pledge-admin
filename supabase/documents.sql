-- Create document_types table for flexible document categorization
CREATE TABLE IF NOT EXISTS public.document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default document types
INSERT INTO public.document_types (name, description, category) VALUES
('cahier_des_charges', 'Specifications document', 'project_documentation'),
('facture', 'Invoice document', 'financial'),
('devis', 'Quote document', 'financial'),
('contrat', 'Contract document', 'legal'),
('rapport', 'Report document', 'project_documentation'),
('presentation', 'Presentation document', 'marketing'),
('specification', 'Technical specification', 'technical'),
('documentation', 'General documentation', 'project_documentation'),
('autre', 'Other document types', 'miscellaneous')
ON CONFLICT (name) DO NOTHING;

-- Create documents table with reference to document_types
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    document_type_id UUID NOT NULL,
    custom_type TEXT,
    file_path TEXT,
    file_name TEXT,
    file_size INTEGER,
    file_type TEXT,
    version TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Draft', 'Active', 'Archived', 'Deleted')),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    last_modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_template BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Add foreign keys if related tables exist
    CONSTRAINT fk_document_type FOREIGN KEY (document_type_id) REFERENCES public.document_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL,
    CONSTRAINT fk_contact FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE SET NULL
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_documents_document_type_id ON public.documents(document_type_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON public.documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_contact_id ON public.documents(contact_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_document_types_category ON public.document_types(category);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents table
CREATE POLICY "Enable read access for all authenticated users" 
ON public.documents 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON public.documents
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
ON public.documents
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
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for document_types table
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;

-- Create policies for document_types table
CREATE POLICY "Enable read access for all authenticated users" 
ON public.document_types 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON public.document_types
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON public.document_types
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
ON public.document_types
FOR DELETE
TO authenticated
USING (true);

-- Create trigger for updating the updated_at column on document_types
CREATE TRIGGER update_document_types_updated_at
BEFORE UPDATE ON public.document_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a view to easily access documents with their related project and contact information
CREATE OR REPLACE VIEW document_details AS
SELECT 
    d.id,
    d.title,
    d.description,
    dt.id AS document_type_id,
    dt.name AS document_type_name,
    dt.category AS document_type_category,
    d.custom_type,
    d.file_name,
    d.status,
    d.created_at,
    d.updated_at,
    p.id AS project_id,
    p.name AS project_name,
    p.project_type AS project_type,
    c.id AS contact_id,
    c.first_name || ' ' || c.last_name AS contact_name,
    c.type AS contact_type
FROM 
    public.documents d
JOIN
    public.document_types dt ON d.document_type_id = dt.id
LEFT JOIN 
    public.projects p ON d.project_id = p.id
LEFT JOIN 
    public.contacts c ON d.contact_id = c.id;
