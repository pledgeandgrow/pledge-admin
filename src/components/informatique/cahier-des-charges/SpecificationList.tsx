"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
// import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2, Search, PlusCircle, LayoutList, LayoutGrid, Loader2 } from 'lucide-react';
// Select components removed as they were unused
import { useToast } from '@/components/ui/use-toast';
import { Document, CreateDocumentParams, UpdateDocumentParams } from '@/types/documents';
import { useDocuments } from '@/hooks/useDocuments';
import { SpecificationMetadata } from './types';
import { SpecificationCard } from './SpecificationCard';
import { SpecificationForm } from './SpecificationForm';
import { SpecificationDocument } from './SpecificationDocument';
import { SpecificationStatistics } from './SpecificationStatistics';

// Props type for the component
type SpecificationListProps = Record<string, never>;

type SpecificationDisplayMode = 'table' | 'grid';

export function SpecificationList({}: SpecificationListProps) {
  // Toast notifications
  const { toast } = useToast();

  // State for documents and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [displayMode, setDisplayMode] = useState<SpecificationDisplayMode>("table");
  const [documentTypeId, setDocumentTypeId] = useState<string>("");

  // State for dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
  // State for document operations
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<string>("");

  // Use the documents hook
  const {
    documents,
    documentTypes,
    createDocument,
    updateDocument,
    deleteDocument,
    loading: isLoading,
    fetchDocuments,
    fetchDocumentTypes
  } = useDocuments();

  // Initialize document type and fetch documents
  useEffect(() => {
    const initializeDocumentType = async () => {
      await fetchDocumentTypes();
    };
    initializeDocumentType();
  }, [fetchDocumentTypes]);

  // Set document type ID when document types are loaded
  useEffect(() => {
    if (documentTypes && documentTypes.length > 0) {
      // Find the document type for specifications
      const specType = documentTypes.find(type => 
        type.name.toLowerCase().includes('specification') || 
        type.name.toLowerCase().includes('cahier des charges'));
      
      if (specType) {
        setDocumentTypeId(specType.id);
        fetchDocuments();
      }
    }
  }, [documentTypes, fetchDocuments]);

  // Filter documents by search query and status
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Filter by document type first
      if (doc.document_type_id !== documentTypeId) return false;
      
      // Filter by status if not 'all'
      if (statusFilter !== 'all') {
        const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
        if (!metadata || metadata.status?.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const title = doc.title?.toLowerCase() || '';
        const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
        const content = metadata?.content?.toLowerCase() || '';
        const clientName = metadata?.client_name?.toLowerCase() || '';
        const projectName = metadata?.project_name?.toLowerCase() || '';
        const version = metadata?.version?.toLowerCase() || '';
        
        return (
          title.includes(query) ||
          content.includes(query) ||
          clientName.includes(query) ||
          projectName.includes(query) ||
          version.includes(query)
        );
      }
      
      return true;
    });
  }, [documents, documentTypeId, statusFilter, searchQuery]);

  // Handle opening view dialog
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };

  // Handle opening edit dialog
  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setEditDialogOpen(true);
  };

  // Handle opening delete dialog
  const handleConfirmDelete = (id: string) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle creating a document
  const handleCreateDocument = async (data: CreateDocumentParams) => {
    try {
      await createDocument(data);
      setCreateDialogOpen(false);
      await fetchDocuments();
      toast({
        title: "Cahier des charges créé",
        description: "Le cahier des charges a été créé avec succès."
      });
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le cahier des charges.",
        variant: "destructive"
      });
    }
  };

  // Handle updating a document
  const handleUpdateDocument = async (data: UpdateDocumentParams) => {
    try {
      await updateDocument(data);
      setEditDialogOpen(false);
      setSelectedDocument(null);
      await fetchDocuments();
      toast({
        title: "Cahier des charges mis à jour",
        description: "Le cahier des charges a été mis à jour avec succès."
      });
    } catch (error) {
      console.error("Error updating document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le cahier des charges.",
        variant: "destructive"
      });
    }
  };

  // Handle deleting a document
  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      await deleteDocument(documentToDelete);
      setDeleteDialogOpen(false);
      setDocumentToDelete("");
      await fetchDocuments();
      toast({
        title: "Cahier des charges supprimé",
        description: "Le cahier des charges a été supprimé avec succès."
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cahier des charges.",
        variant: "destructive"
      });
    }
  };

  // Status change functionality removed as it was unused

  // Format date to local string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get badge variant based on status
  const getBadgeVariant = (status: string | undefined) => {
    if (!status) return "secondary" as const;
    
    switch (status.toLowerCase()) {
      case 'draft':
        return 'secondary' as const;
      case 'review':
        return 'default' as const; // Changed from 'warning' to match Badge variants
      case 'approved':
        return 'default' as const; // Changed from 'success' to match Badge variants
      case 'archived':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un cahier des charges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 max-w-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={displayMode === "table" ? "bg-muted hover:bg-muted/90" : ""}
            onClick={() => setDisplayMode("table")}
            title="Vue tableau"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className={displayMode === "grid" ? "bg-muted hover:bg-muted/90" : ""}
            onClick={() => setDisplayMode("grid")}
            title="Vue grille"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau cahier
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <SpecificationStatistics 
        documents={filteredDocuments} 
        isLoading={isLoading} 
      />

      {/* Tabs and content */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger 
            value="all" 
            onClick={() => setStatusFilter('all')}
          >
            Tous
          </TabsTrigger>
          <TabsTrigger 
            value="draft" 
            onClick={() => setStatusFilter('draft')}
          >
            Brouillons
          </TabsTrigger>
          <TabsTrigger 
            value="review" 
            onClick={() => setStatusFilter('review')}
          >
            En révision
          </TabsTrigger>
          <TabsTrigger 
            value="approved" 
            onClick={() => setStatusFilter('approved')}
          >
            Approuvés
          </TabsTrigger>
          <TabsTrigger 
            value="archived" 
            onClick={() => setStatusFilter('archived')}
          >
            Archivés
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filteredDocuments.length === 0 && (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' 
                  ? "Aucun cahier des charges ne correspond à votre recherche."
                  : "Aucun cahier des charges disponible. Créez-en un nouveau !"}
              </p>
            </div>
          )}

          {/* Table view */}
          {displayMode === "table" && !isLoading && (
            <div className="rounded-md border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">Titre</TableHead>
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold">Projet</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold">Date de création</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        Aucun cahier des charges trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => {
                      const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
                      return (
                        <TableRow key={doc.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{doc.title}</TableCell>
                          <TableCell>{metadata?.client_name || "N/A"}</TableCell>
                          <TableCell>{metadata?.project_name || "N/A"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={getBadgeVariant(metadata?.status)}
                              className="font-medium"
                            >
                              {metadata?.status || "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(doc.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleViewDocument(doc)}
                                className="hover:bg-muted h-8 w-8"
                                title="Voir"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEditDocument(doc)}
                                className="hover:bg-muted h-8 w-8"
                                title="Modifier"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleConfirmDelete(doc.id)}
                                className="hover:bg-destructive/20 h-8 w-8"
                                title="Supprimer"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Grid view */}
          {displayMode === "grid" && !isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.length === 0 ? (
                <div className="col-span-full text-center py-10 text-muted-foreground bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  Aucun cahier des charges trouvé
                </div>
              ) : (
                filteredDocuments.map((doc) => (
                  <SpecificationCard
                    key={doc.id}
                    document={doc}
                    onClick={() => handleViewDocument(doc)}
                  />
                ))
              )}
            </div>
          )}
        </TabsContent>

        {/* Other tab contents (they all show the same content but with different filters) */}
        <TabsContent value="draft" className="mt-6">
          {/* Same content as 'all' tab but filtered by status */}
          {/* The filtering is handled by the statusFilter state */}
        </TabsContent>
        <TabsContent value="review" className="mt-6">
          {/* Same content as 'all' tab but filtered by status */}
        </TabsContent>
        <TabsContent value="approved" className="mt-6">
          {/* Same content as 'all' tab but filtered by status */}
        </TabsContent>
        <TabsContent value="archived" className="mt-6">
          {/* Same content as 'all' tab but filtered by status */}
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le cahier des charges sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteDialogOpen(false);
              setDocumentToDelete("");
            }}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau cahier des charges</DialogTitle>
          </DialogHeader>
          <SpecificationForm
            documentTypeId={documentTypeId}
            onSubmit={(data) => {
              // Type assertion to ensure we're passing CreateDocumentParams
              handleCreateDocument(data as CreateDocumentParams);
            }}
            onCancel={() => setCreateDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du cahier des charges</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <SpecificationDocument
              document={selectedDocument}
              onEdit={() => {
                setViewDialogOpen(false);
                handleEditDocument(selectedDocument);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le cahier des charges</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <SpecificationForm
              document={selectedDocument}
              documentTypeId={documentTypeId}
              onSubmit={(data) => {
                // Type assertion to ensure we're passing UpdateDocumentParams
                // We know this is an update because we have a selected document
                handleUpdateDocument(data as UpdateDocumentParams);
              }}
              onCancel={() => {
                setEditDialogOpen(false);
                setSelectedDocument(null);
              }}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
