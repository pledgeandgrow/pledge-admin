import { Document } from '@/types/documents';

// Specification metadata structure that will be stored in Document.metadata
export interface SpecificationMetadata {
  content: string;
  status: 'Draft' | 'Review' | 'Approved' | 'Archived';
  version?: string;
  client_id?: string;
  client_name?: string;
  project_id?: string;
  project_name?: string;
  estimated_hours?: number;
  estimated_cost?: number;
  target_completion_date?: string;
  sections?: SpecificationSection[];
}

export interface SpecificationSection {
  title: string;
  content: string;
  order: number;
}

// Legacy type for backward compatibility
export interface SpecificationType {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
}

// Convert Document to SpecificationType for backward compatibility
export function documentToSpecification(doc: Document): SpecificationType {
  // First cast to unknown, then to our expected type to avoid TypeScript errors
  const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
  
  // Default status mapping
  let status: 'draft' | 'review' | 'approved' | 'archived' = 'draft';
  if (metadata?.status) {
    const lowerStatus = metadata.status.toLowerCase();
    if (['draft', 'review', 'approved', 'archived'].includes(lowerStatus)) {
      status = lowerStatus as 'draft' | 'review' | 'approved' | 'archived';
    }
  }
  
  return {
    id: doc.id,
    title: doc.title,
    content: metadata?.content || '',
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
    status: status
  };
}

// Convert SpecificationType to Document for creating/updating
export function specificationToDocument(spec: SpecificationType, documentTypeId: string): {
  title: string;
  document_type_id: string;
  metadata: SpecificationMetadata;
} {
  return {
    title: spec.title,
    document_type_id: documentTypeId,
    metadata: {
      content: spec.content,
      status: spec.status.charAt(0).toUpperCase() + spec.status.slice(1) as 'Draft' | 'Review' | 'Approved' | 'Archived'
    }
  };
}

export interface SpecificationStatisticsType {
  total: number;
  draft: number;
  review: number;
  approved: number;
  archived: number;
}
