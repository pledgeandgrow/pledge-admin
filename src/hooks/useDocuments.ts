import { useState, useCallback } from 'react';
import { documentService } from '@/services/documentService';
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
      const data = await documentService.getAllDocuments();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch document details
   */
  const fetchDocumentDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.getDocumentDetails();
      setDocumentDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch document details'));
      console.error('Error fetching document details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all document types
   */
  const fetchDocumentTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.getAllDocumentTypes();
      setDocumentTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch document types'));
      console.error('Error fetching document types:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch active document types
   */
  const fetchActiveDocumentTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.getActiveDocumentTypes();
      setDocumentTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch active document types'));
      console.error('Error fetching active document types:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch documents by project ID
   */
  const fetchDocumentsByProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.getDocumentsByProject(projectId);
      setDocuments(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch project documents'));
      console.error('Error fetching project documents:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch documents by contact ID
   */
  const fetchDocumentsByContact = useCallback(async (contactId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.getDocumentsByContact(contactId);
      setDocuments(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch contact documents'));
      console.error('Error fetching contact documents:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new document
   */
  const createDocument = useCallback(async (document: CreateDocumentParams) => {
    setLoading(true);
    setError(null);
    try {
      const newDocument = await documentService.createDocument(document);
      setDocuments(prev => [newDocument, ...prev]);
      return newDocument;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create document'));
      console.error('Error creating document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing document
   */
  const updateDocument = useCallback(async (document: UpdateDocumentParams) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDocument = await documentService.updateDocument(document);
      setDocuments(prev => 
        prev.map(doc => doc.id === updatedDocument.id ? updatedDocument : doc)
      );
      return updatedDocument;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update document'));
      console.error('Error updating document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Soft delete a document (set status to 'Deleted')
   */
  const softDeleteDocument = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await documentService.softDeleteDocument(id);
      if (success) {
        setDocuments(prev => 
          prev.map(doc => doc.id === id ? { ...doc, status: 'Deleted' } : doc)
        );
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to soft delete document'));
      console.error('Error soft deleting document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Permanently delete a document
   */
  const deleteDocument = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await documentService.deleteDocument(id);
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete document'));
      console.error('Error deleting document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new document type
   */
  const createDocumentType = useCallback(async (documentType: CreateDocumentTypeParams) => {
    setLoading(true);
    setError(null);
    try {
      const newDocumentType = await documentService.createDocumentType(documentType);
      setDocumentTypes(prev => [...prev, newDocumentType]);
      return newDocumentType;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create document type'));
      console.error('Error creating document type:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing document type
   */
  const updateDocumentType = useCallback(async (documentType: UpdateDocumentTypeParams) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDocumentType = await documentService.updateDocumentType(documentType);
      setDocumentTypes(prev => 
        prev.map(type => type.id === updatedDocumentType.id ? updatedDocumentType : type)
      );
      return updatedDocumentType;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update document type'));
      console.error('Error updating document type:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a document type
   */
  const deleteDocumentType = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await documentService.deleteDocumentType(id);
      if (success) {
        setDocumentTypes(prev => prev.filter(type => type.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete document type'));
      console.error('Error deleting document type:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload a document file
   */
  const uploadDocumentFile = useCallback(async (file: File, path: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await documentService.uploadDocumentFile(file, path);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload document file'));
      console.error('Error uploading document file:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search documents by query
   */
  const searchDocuments = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await documentService.searchDocuments(query);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search documents'));
      console.error('Error searching documents:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

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
