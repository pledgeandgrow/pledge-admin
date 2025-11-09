'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useDocuments } from '@/hooks/useDocuments';
import { Document } from '@/types/documents';
import { Separator } from '@/components/ui/separator';

// Import our new components
import { DocumentList } from '@/components/workspace/documents/DocumentList';
import { DocumentCard } from '@/components/workspace/documents/DocumentCard';
import { DocumentUpload, DocumentUploadFormData } from '@/components/workspace/documents/DocumentUpload';
import { DocumentFilter, DocumentFilterOptions } from '@/components/workspace/documents/DocumentFilter';
import { DocumentViewer } from '@/components/workspace/documents/DocumentViewer';
import { DocumentActions, ShareFormData } from '@/components/workspace/documents/DocumentActions';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentTypes, setDocumentTypes] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filters, setFilters] = useState<DocumentFilterOptions>({
    search: '',
    type: 'all',
    status: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  // Dialog states
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewerDialogOpen, setIsViewerDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const { 
    fetchDocuments, 
    deleteDocument, 
    updateDocument: _updateDocument, 
    fetchDocumentTypes,
    uploadDocumentFile: _uploadDocumentFile,
    createDocument
  } = useDocuments();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fetchedDocuments, types] = await Promise.all([
          fetchDocuments(),
          fetchDocumentTypes()
        ]);
        
        setDocuments(fetchedDocuments);
        setDocumentTypes(types);
      } catch (error) {
        console.error('Error loading documents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load documents',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchDocuments, fetchDocumentTypes]);

  const handleFilterChange = (newFilters: DocumentFilterOptions) => {
    setFilters(newFilters);
  };

  const handleUpload = async (formData: DocumentUploadFormData, file: File) => {
    try {
      const newDocument = await createDocument({
        title: formData.name,
        description: formData.description,
        document_type_id: formData.document_type,
        status: formData.status as 'Draft' | 'Active' | 'Archived' | 'Deleted',
        version: formData.version,
        project_id: formData.project_id,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
      });
      
      setDocuments(prev => [newDocument, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDownload = (doc: Document) => {
    // Create a temporary anchor element to trigger download
    const link = window.document.createElement('a');
    link.href = doc.file_path || '';
    link.download = doc.file_name || doc.title;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleShare = async (documentId: string, shareData: ShareFormData) => {
    try {
      // TODO: Implement document sharing functionality
      // For now, just show a success message
      toast({
        title: 'Success',
        description: `Document shared with ${shareData.email}`,
      });
    } catch (error) {
      console.error('Error sharing document:', error);
      toast({
        title: 'Error',
        description: 'Failed to share document',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleView = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewerDialogOpen(true);
  };

  const handleEdit = (_document: Document) => {
    // In a real implementation, you would open an edit dialog
    toast({
      title: 'Info',
      description: 'Edit functionality will be implemented in a future update',
    });
  };

  const _openShareDialog = (documentId: string) => {
    const document = documents.find(d => d.id === documentId);
    if (document) {
      setSelectedDocument(document);
      setIsShareDialogOpen(true);
    }
  };

  const openDeleteDialog = (documentId: string) => {
    const document = documents.find(d => d.id === documentId);
    if (document) {
      setSelectedDocument(document);
      setIsDeleteDialogOpen(true);
    }
  };

  // Wrapper functions for DocumentList which expects Document objects for onShare
  const handleShareFromList = (document: Document) => {
    setSelectedDocument(document);
    setIsShareDialogOpen(true);
  };

  const handleDeleteFromList = (documentId: string) => {
    openDeleteDialog(documentId);
  };

  // Wrapper functions for DocumentCard
  const handleShareFromCard = (doc: Document) => {
    setSelectedDocument(doc);
    setIsShareDialogOpen(true);
  };

  const handleDeleteFromCard = (documentId: string) => {
    openDeleteDialog(documentId);
  };

  // Apply filters to documents
  const filteredDocuments = (documents || []).filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                         (doc.description || '').toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.type === 'all' || doc.document_type_id === filters.type;
    const matchesStatus = filters.status === 'all' || doc.status.toLowerCase() === filters.status.toLowerCase();
    
    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    const sortField = filters.sortBy as keyof Document;
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return filters.sortOrder === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    // Default sort for non-string values
    return filters.sortOrder === 'asc' ? -1 : 1;
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Gestion des Documents
          </span>
        </h1>
        <p className="text-muted-foreground dark:text-gray-400">
          Gérez tous vos documents et fichiers
        </p>
      </div>
      
      <Separator className="my-6" />
      
      <div className="flex justify-between items-center">
        <div></div>
        <Button onClick={() => setIsUploadDialogOpen(true)} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Ajouter un document
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Tous les documents</CardTitle>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'grid')}>
              <TabsList>
                <TabsTrigger value="list">Liste</TabsTrigger>
                <TabsTrigger value="grid">Grille</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DocumentFilter 
              documentTypes={documentTypes}
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />

            <Tabs value={viewMode} className="w-full">
              <TabsContent value="list" className="mt-0">
                <DocumentList 
                  documents={filteredDocuments}
                  documentTypes={documentTypes}
                  onDownload={handleDownload}
                  onShare={handleShareFromList}
                  onDelete={handleDeleteFromList}
                  onEdit={handleEdit}
                />
              </TabsContent>
              <TabsContent value="grid" className="mt-0">
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {documents.length === 0 
                      ? "Aucun document n'a été ajouté." 
                      : "Aucun document ne correspond à votre recherche."}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredDocuments.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onDownload={handleDownload}
                        onShare={handleShareFromCard}
                        onDelete={handleDeleteFromCard}
                        onEdit={handleEdit}
                        onView={handleView}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Dialog */}
      <DocumentUpload 
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleUpload}
        documentTypes={documentTypes}
      />

      {/* Document Viewer Dialog */}
      <DocumentViewer 
        document={selectedDocument}
        isOpen={isViewerDialogOpen}
        onClose={() => setIsViewerDialogOpen(false)}
        onDownload={handleDownload}
      />

      {/* Document Actions Dialogs */}
      <DocumentActions 
        isShareDialogOpen={isShareDialogOpen}
        onShareDialogClose={() => setIsShareDialogOpen(false)}
        isDeleteDialogOpen={isDeleteDialogOpen}
        onDeleteDialogClose={() => setIsDeleteDialogOpen(false)}
        selectedDocument={selectedDocument}
        onShare={handleShare}
        onDelete={handleDelete}
      />
    </div>
  );
}
