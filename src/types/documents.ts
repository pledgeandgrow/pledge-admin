export interface DocumentType {
    id: string;
    name: string;
    description: string | null;
    category: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface Document {
    id: string;
    title: string;
    description: string | null;
    document_type_id: string;
    custom_type: string | null;
    file_path: string | null;
    file_name: string | null;
    file_size: number | null;
    file_type: string | null;
    version: string | null;
    status: 'Draft' | 'Active' | 'Archived' | 'Deleted';
    project_id: string | null;
    contact_id: string | null;
    created_by: string | null;
    last_modified_by: string | null;
    is_template: boolean;
    metadata: Record<string, string | number | boolean | null | string[] | Record<string, unknown>> | null;
    tags: string[] | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface DocumentDetails {
    id: string;
    title: string;
    description: string | null;
    document_type_id: string;
    document_type_name: string;
    document_type_category: string;
    custom_type: string | null;
    file_name: string | null;
    status: 'Draft' | 'Active' | 'Archived' | 'Deleted';
    created_at: string;
    updated_at: string;
    project_id: string | null;
    project_name: string | null;
    project_type: string | null;
    contact_id: string | null;
    contact_name: string | null;
    contact_type: string | null;
  }
  
  export interface CreateDocumentParams {
    title: string;
    description?: string;
    document_type_id: string;
    custom_type?: string;
    file_path?: string;
    file_name?: string;
    file_size?: number;
    file_type?: string;
    version?: string;
    status?: 'Draft' | 'Active' | 'Archived' | 'Deleted';
    project_id?: string;
    contact_id?: string;
    is_template?: boolean;
    metadata?: Record<string, string | number | boolean | null | string[] | Record<string, unknown>>;
    tags?: string[];
  }
  
  export interface UpdateDocumentParams {
    id: string;
    title?: string;
    description?: string;
    document_type_id?: string;
    custom_type?: string;
    file_path?: string;
    file_name?: string;
    file_size?: number;
    file_type?: string;
    version?: string;
    status?: 'Draft' | 'Active' | 'Archived' | 'Deleted';
    project_id?: string;
    contact_id?: string;
    is_template?: boolean;
    metadata?: Record<string, string | number | boolean | null | string[] | Record<string, unknown>>;
    tags?: string[];
  }
  
  export interface CreateDocumentTypeParams {
    name: string;
    description?: string;
    category: string;
    is_active?: boolean;
  }
  
  export interface UpdateDocumentTypeParams {
    id: string;
    name?: string;
    description?: string;
    category?: string;
    is_active?: boolean;
  }
  