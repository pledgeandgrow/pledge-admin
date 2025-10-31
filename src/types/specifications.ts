// Specification (Cahier des charges) types
import { Document, CreateDocumentParams, UpdateDocumentParams } from '@/types/documents';

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
  client_name?: string;
  project_name?: string;
  estimated_hours?: number;
  estimated_cost?: number;
  target_completion_date?: string;
}

// Convert Document to SpecificationType for backward compatibility
export function documentToSpecification(doc: Document): SpecificationType {
  const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
  
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
    status: status,
    client_name: metadata?.client_name || '',
    project_name: metadata?.project_name || '',
    estimated_hours: metadata?.estimated_hours,
    estimated_cost: metadata?.estimated_cost,
    target_completion_date: metadata?.target_completion_date
  };
}

// Convert SpecificationType to Document for creating
export function specificationToCreateDocument(spec: SpecificationType, documentTypeId: string): CreateDocumentParams {
  return {
    title: spec.title,
    document_type_id: documentTypeId,
    metadata: {
      content: spec.content,
      status: spec.status.charAt(0).toUpperCase() + spec.status.slice(1) as 'Draft' | 'Review' | 'Approved' | 'Archived',
      client_name: spec.client_name || null,
      project_name: spec.project_name || null,
      estimated_hours: spec.estimated_hours !== undefined ? spec.estimated_hours : null,
      estimated_cost: spec.estimated_cost !== undefined ? spec.estimated_cost : null,
      target_completion_date: spec.target_completion_date || null
    }
  };
}

// Convert SpecificationType to Document for updating
export function specificationToUpdateDocument(spec: SpecificationType): UpdateDocumentParams {
  return {
    id: spec.id,
    title: spec.title,
    metadata: {
      content: spec.content,
      status: spec.status.charAt(0).toUpperCase() + spec.status.slice(1) as 'Draft' | 'Review' | 'Approved' | 'Archived',
      client_name: spec.client_name || null,
      project_name: spec.project_name || null,
      estimated_hours: spec.estimated_hours !== undefined ? spec.estimated_hours : null,
      estimated_cost: spec.estimated_cost !== undefined ? spec.estimated_cost : null,
      target_completion_date: spec.target_completion_date || null
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
