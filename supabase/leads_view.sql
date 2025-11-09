-- Create a view for leads to simplify queries
-- This view filters contacts table to show only leads with relevant fields

CREATE OR REPLACE VIEW public.leads AS
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
  c.lead_source,
  c.lead_score,
  c.source,
  c.probability,
  c.estimated_value,
  c.next_follow_up,
  c.last_contacted_at,
  c.added_by,
  c.created_at,
  c.updated_at
FROM
  contacts c
WHERE
  c.type = 'lead'::text;

-- Add comment to the view
COMMENT ON VIEW public.leads IS 'View of contacts filtered to show only leads with relevant fields';

-- Grant permissions (adjust based on your RLS policies)
GRANT SELECT ON public.leads TO authenticated;
