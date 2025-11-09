-- Create a view for clients to simplify queries
-- This view filters contacts table to show only clients with relevant fields

CREATE OR REPLACE VIEW public.clients AS
SELECT
  c.id,
  c.first_name,
  c.last_name,
  c.email,
  c.phone,
  c.company,
  c.position,
  c.type,
  c.status,
  c.notes,
  c.tags,
  c.metadata,
  c.service,
  c.client_since,
  c.first_contact_date,
  c.last_purchase_date,
  c.total_spent,
  c.created_at,
  c.updated_at
FROM
  contacts c
WHERE
  c.type = 'client'::text;

-- Add comment to the view
COMMENT ON VIEW public.clients IS 'View of contacts filtered to show only clients with relevant fields';

-- Grant permissions (adjust based on your RLS policies)
GRANT SELECT ON public.clients TO authenticated;
