-- Create the client table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.client (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_company BOOLEAN NOT NULL DEFAULT FALSE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    country TEXT,
    company_name TEXT,
    contact_person TEXT,
    vat_number TEXT,
    registration_number TEXT,
    website TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.client ENABLE ROW LEVEL SECURITY;

-- Create policies for client table
CREATE POLICY "Enable read access for all authenticated users" 
ON public.client 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON public.client
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON public.client
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
ON public.client
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
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_client_updated_at
BEFORE UPDATE ON public.client
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
