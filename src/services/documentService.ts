import { createClient } from '@/lib/supabase';
import { 
  Document, 
  DocumentType, 
  DocumentDetails,
  CreateDocumentParams,
  UpdateDocumentParams,
  CreateDocumentTypeParams,
  UpdateDocumentTypeParams
} from '@/types/documents';

/**
 * Service for handling document operations
 */
export const documentService = {
  /**
   * Get all documents
   * @returns Array of documents
   */
  async getAllDocuments(): Promise<Document[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get document details with related information
   * @returns Array of document details
   */
  async getDocumentDetails(): Promise<DocumentDetails[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('document_details')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching document details:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get a document by ID
   * @param id Document ID
   * @returns Document or null if not found
   */
  async getDocumentById(id: string): Promise<Document | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Document not found
      }
      console.error('Error fetching document:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get document details by ID
   * @param id Document ID
   * @returns DocumentDetails or null if not found
   */
  async getDocumentDetailsById(id: string): Promise<DocumentDetails | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('document_details')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Document not found
      }
      console.error('Error fetching document details:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get documents by project ID
   * @param projectId Project ID
   * @returns Array of documents
   */
  async getDocumentsByProject(projectId: string): Promise<Document[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching project documents:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get documents by contact ID
   * @param contactId Contact ID
   * @returns Array of documents
   */
  async getDocumentsByContact(contactId: string): Promise<Document[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact documents:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get documents by type ID
   * @param typeId Document type ID
   * @returns Array of documents
   */
  async getDocumentsByType(typeId: string): Promise<Document[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('document_type_id', typeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents by type:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get documents by status
   * @param status Document status
   * @returns Array of documents
   */
  async getDocumentsByStatus(status: 'Draft' | 'Active' | 'Archived' | 'Deleted'): Promise<Document[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents by status:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Create a new document
   * @param document Document data
   * @returns Created document
   */
  async createDocument(document: CreateDocumentParams): Promise<Document> {
    const supabase = createClient();
    
    // Get current user ID for created_by and last_modified_by fields
    const { data: { user } } = await supabase.auth.getUser();
    
    const documentData = {
      ...document,
      created_by: user?.id || null,
      last_modified_by: user?.id || null
    };

    const { data, error } = await supabase
      .from('documents')
      .insert([documentData])
      .select()
      .single();

    if (error) {
      console.error('Error creating document:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update a document
   * @param document Document data with ID
   * @returns Updated document
   */
  async updateDocument(document: UpdateDocumentParams): Promise<Document> {
    const supabase = createClient();
    
    // Get current user ID for last_modified_by field
    const { data: { user } } = await supabase.auth.getUser();
    
    const { id, ...updateData } = document;
    
    const documentData = {
      ...updateData,
      last_modified_by: user?.id || null
    };

    const { data, error } = await supabase
      .from('documents')
      .update(documentData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating document:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a document (soft delete by setting status to 'Deleted')
   * @param id Document ID
   * @returns Success status
   */
  async softDeleteDocument(id: string): Promise<boolean> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('documents')
      .update({ status: 'Deleted' })
      .eq('id', id);

    if (error) {
      console.error('Error soft deleting document:', error);
      throw error;
    }

    return true;
  },

  /**
   * Permanently delete a document
   * @param id Document ID
   * @returns Success status
   */
  async deleteDocument(id: string): Promise<boolean> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting document:', error);
      throw error;
    }

    return true;
  },

  /**
   * Search documents by title or description
   * @param query Search query
   * @returns Array of matching documents
   */
  async searchDocuments(query: string): Promise<Document[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching documents:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get all document types
   * @returns Array of document types
   */
  async getAllDocumentTypes(): Promise<DocumentType[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('document_types')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching document types:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get active document types
   * @returns Array of active document types
   */
  async getActiveDocumentTypes(): Promise<DocumentType[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('document_types')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching active document types:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get document types by category
   * @param category Category name
   * @returns Array of document types in the category
   */
  async getDocumentTypesByCategory(category: string): Promise<DocumentType[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('document_types')
      .select('*')
      .eq('category', category)
      .order('name');

    if (error) {
      console.error('Error fetching document types by category:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get a document type by ID
   * @param id Document type ID
   * @returns Document type or null if not found
   */
  async getDocumentTypeById(id: string): Promise<DocumentType | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('document_types')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Document type not found
      }
      console.error('Error fetching document type:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new document type
   * @param documentType Document type data
   * @returns Created document type
   */
  async createDocumentType(documentType: CreateDocumentTypeParams): Promise<DocumentType> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('document_types')
      .insert([documentType])
      .select()
      .single();

    if (error) {
      console.error('Error creating document type:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update a document type
   * @param documentType Document type data with ID
   * @returns Updated document type
   */
  async updateDocumentType(documentType: UpdateDocumentTypeParams): Promise<DocumentType> {
    const supabase = createClient();
    
    const { id, ...updateData } = documentType;
    
    const { data, error } = await supabase
      .from('document_types')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating document type:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a document type
   * @param id Document type ID
   * @returns Success status
   */
  async deleteDocumentType(id: string): Promise<boolean> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('document_types')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting document type:', error);
      throw error;
    }

    return true;
  },

  /**
   * Upload a document file to storage
   * @param file File to upload
   * @param path Storage path
   * @returns File URL and path
   */
  async uploadDocumentFile(file: File, path: string): Promise<{ url: string; path: string }> {
    const supabase = createClient();
    
    // Generate a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading document file:', error);
      throw error;
    }

    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath
    };
  },

  /**
   * Delete a document file from storage
   * @param path File path in storage
   * @returns Success status
   */
  async deleteDocumentFile(path: string): Promise<boolean> {
    const supabase = createClient();
    
    const { error } = await supabase.storage
      .from('documents')
      .remove([path]);

    if (error) {
      console.error('Error deleting document file:', error);
      throw error;
    }

    return true;
  }
};

export default documentService;
