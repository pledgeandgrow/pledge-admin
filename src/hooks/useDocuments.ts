import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';

// Create supabase client once outside the hook to avoid recreating on every render
const supabase = createClient();
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
 * Custom hook for managing documents
 */
export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentDetails, setDocumentDetails] = useState<DocumentDetails[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all documents
   */
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (err) {throw err;}
      console.log('✅ Fetched', (data || []).length, 'documents');
      setDocuments(data || []);
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
      console.error('Error fetching documents:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Fetch document details
   */
  const fetchDocumentDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.rpc('get_document_details');
      if (err) {throw err;}
      setDocumentDetails(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch document details'));
      console.error('Error fetching document details:', err);
    } finally {
      setLoading(false);
    }
  }, []); // supabase is singleton - no need as dependency

  /**
   * Fetch all document types
   */
  const fetchDocumentTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('document_types').select('*');
      if (err) {throw err;}
      setDocumentTypes(data || []);
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch document types'));
      console.error('Error fetching document types:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Fetch active document types
   */
  const fetchActiveDocumentTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('document_types').select('*').eq('is_active', true);
      if (err) {throw err;}
      setDocumentTypes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch active document types'));
      console.error('Error fetching active document types:', err);
    } finally {
      setLoading(false);
    }
  }, []); // supabase is singleton - no need as dependency

  /**
   * Fetch documents by project ID
   */
  const fetchDocumentsByProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('documents').select('*').eq('project_id', projectId);
      if (err) {throw err;}
      setDocuments(data || []);
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch project documents'));
      console.error('Error fetching project documents:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Fetch documents by contact ID
   */
  const fetchDocumentsByContact = useCallback(async (contactId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('documents').select('*').eq('contact_id', contactId);
      if (err) {throw err;}
      setDocuments(data || []);
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch contact documents'));
      console.error('Error fetching contact documents:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Create a new document
   */
  const createDocument = useCallback(async (document: CreateDocumentParams) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('documents').insert(document).select().single();
      if (err) {throw err;}
      console.log('✅ Document created:', data.title);
      setDocuments(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create document'));
      console.error('Error creating document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Update an existing document
   */
  const updateDocument = useCallback(async (document: UpdateDocumentParams) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('documents').update(document).eq('id', document.id).select().single();
      if (err) {throw err;}
      console.log('✅ Document updated:', data.title);
      setDocuments(prev => prev.map(doc => doc.id === data.id ? data : doc));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update document'));
      console.error('Error updating document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Soft delete a document (set status to 'Deleted')
   */
  const softDeleteDocument = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.from('documents').update({ status: 'Deleted' }).eq('id', id);
      if (err) {throw err;}
      setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, status: 'Deleted' } : doc));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to soft delete document'));
      console.error('Error soft deleting document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Permanently delete a document
   */
  const deleteDocument = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.from('documents').delete().eq('id', id);
      if (err) {throw err;}
      console.log('✅ Document deleted:', id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete document'));
      console.error('Error deleting document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Create a new document type
   */
  const createDocumentType = useCallback(async (documentType: CreateDocumentTypeParams) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('document_types').insert(documentType).select().single();
      if (err) {throw err;}
      setDocumentTypes(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create document type'));
      console.error('Error creating document type:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Update an existing document type
   */
  const updateDocumentType = useCallback(async (documentType: UpdateDocumentTypeParams) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('document_types').update(documentType).eq('id', documentType.id).select().single();
      if (err) {throw err;}
      setDocumentTypes(prev => prev.map(type => type.id === data.id ? data : type));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update document type'));
      console.error('Error updating document type:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Delete a document type
   */
  const deleteDocumentType = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.from('document_types').delete().eq('id', id);
      if (err) {throw err;}
      setDocumentTypes(prev => prev.filter(type => type.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete document type'));
      console.error('Error deleting document type:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Upload a document file
   */
  const uploadDocumentFile = useCallback(async (file: File, path: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.storage.from('documents').upload(path, file);
      if (err) {throw err;}
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload document file'));
      console.error('Error uploading document file:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Search documents by query
   */
  const searchDocuments = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('documents').select('*').or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      if (err) {throw err;}
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search documents'));
      console.error('Error searching documents:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  return {
    documents,
    documentDetails,
    documentTypes,
    loading,
    error,
    fetchDocuments,
    fetchDocumentDetails,
    fetchDocumentTypes,
    fetchActiveDocumentTypes,
    fetchDocumentsByProject,
    fetchDocumentsByContact,
    createDocument,
    updateDocument,
    softDeleteDocument,
    deleteDocument,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
    uploadDocumentFile,
    searchDocuments
  };
};

export default useDocuments;
