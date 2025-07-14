"use client";

import { useState, useEffect } from "react";
import { PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Import document types and hooks
import { Document, CreateDocumentParams } from "@/types/documents";
import { useDocuments } from "@/hooks/useDocuments";
import { SpecificationDocument } from "@/components/informatique/cahier-des-charges/SpecificationDocument";
import { SpecificationEditor } from "@/components/informatique/cahier-des-charges/SpecificationEditor";
import { SpecificationList } from "@/components/informatique/cahier-des-charges/SpecificationList";
import { SpecificationMetadata } from "@/components/informatique/cahier-des-charges/types";

// Stats interface for tracking document counts by status
interface SpecificationStatisticsType {
  total: number;
  draft: number;
  review: number;
  approved: number;
  archived: number;
}

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get status label
const getStatusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'draft':
      return 'Brouillon';
    case 'review':
      return 'En révision';
    case 'approved':
      return 'Approuvé';
    case 'archived':
      return 'Archivé';
    default:
      return status;
  }
};

export default function CahierDesChargesPage() {
  // Use the documents hook for Supabase integration
  const { 
    documents, 
    loading: documentsLoading, 
    error: documentsError,
    fetchDocuments,
    fetchDocumentTypes,
    createDocument,
    updateDocument,
    softDeleteDocument
  } = useDocuments();
  
  // Local state
  const [documentTypeId, setDocumentTypeId] = useState<string>(""); // Store the document type ID for specifications
  const [stats, setStats] = useState<SpecificationStatisticsType>({ 
    total: 0, 
    draft: 0, 
    review: 0, 
    approved: 0, 
    archived: 0 
  });
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string>("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newStatus, setNewStatus] = useState<"Draft" | "Review" | "Approved" | "Archived">("Draft");
  
  const { toast } = useToast();

  // Load documents and document types on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch document types first to get the specification document type ID
        await fetchDocumentTypes();
        await fetchDocuments();
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive"
        });
      }
    };
    
    loadData();
  }, [fetchDocuments, fetchDocumentTypes, toast]);
  
  // Update statistics when documents change
  useEffect(() => {
    // Filter only specification documents
    const specificationDocs = documents.filter(doc => {
      const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
      return metadata?.status !== undefined; // Simple check to identify specification documents
    });
    
    const newStats = {
      total: specificationDocs.length,
      draft: specificationDocs.filter(doc => {
        const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
        return metadata?.status?.toLowerCase() === 'draft';
      }).length,
      review: specificationDocs.filter(doc => {
        const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
        return metadata?.status?.toLowerCase() === 'review';
      }).length,
      approved: specificationDocs.filter(doc => {
        const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
        return metadata?.status?.toLowerCase() === 'approved';
      }).length,
      archived: specificationDocs.filter(doc => {
        const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
        return metadata?.status?.toLowerCase() === 'archived';
      }).length,
    };
    
    setStats(newStats);
  }, [documents]);
  
  // Handle view document
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsViewDialogOpen(true);
  };
  
  // Handle edit document
  const handleEditDocument = (document: Document) => {
    const metadata = document.metadata as unknown as SpecificationMetadata | undefined;
    
    setSelectedDocument(document);
    setNewTitle(document.title);
    setNewContent(metadata?.content || "");
    setNewStatus(metadata?.status || "Draft");
    setIsEditDialogOpen(true);
  };
  
  // Handle create document
  const handleCreateDocument = async () => {
    if (!documentTypeId) {
      toast({
        title: "Erreur",
        description: "Type de document non disponible",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const newDoc: CreateDocumentParams = {
        title: newTitle,
        document_type_id: documentTypeId,
        metadata: {
          content: newContent,
          status: newStatus
        }
      };
      
      await createDocument(newDoc);
      
      toast({
        title: "Succès",
        description: "Cahier des charges créé avec succès",
      });
      
      // Reset form and close dialog
      setNewTitle("");
      setNewContent("");
      setNewStatus("Draft");
      setIsCreateDialogOpen(false);
      
      // Refresh documents list
      await fetchDocuments();
    } catch (error) {
      console.error('Error creating specification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le cahier des charges",
        variant: "destructive"
      });
    }
  };
  
  // Handle update document
  const handleUpdateDocument = async () => {
    if (!selectedDocument) return;
    
    try {
      await updateDocument({
        id: selectedDocument.id,
        title: newTitle,
        metadata: {
          ...selectedDocument.metadata,
          content: newContent,
          status: newStatus
        }
        spec.id === id 
          ? { ...spec, ...updates, updatedAt: new Date().toISOString() }
          : spec
      );
      
      setSpecs(updatedSpecs);
      localStorage.setItem('cahierSpecs', JSON.stringify(updatedSpecs));
      updateStats(updatedSpecs);
      
      setIsEditing(false);
      setSelectedSpec(null);
      toast({
        title: "Succès",
        description: "Cahier mis à jour"
      });
    } catch (error) {
      console.error('Error updating specification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le cahier",
        variant: "destructive"
      });
    }
  }, [specs, toast, updateStats]);

  // Handle deleting a specification
  const handleDelete = useCallback((id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce cahier ?")) return;
    
    try {
      const updatedSpecs = specs.filter(spec => spec.id !== id);
      setSpecs(updatedSpecs);
      localStorage.setItem('cahierSpecs', JSON.stringify(updatedSpecs));
      updateStats(updatedSpecs);
      
      if (selectedSpec?.id === id) {
        setSelectedSpec(null);
      }
      
      toast({
        title: "Succès",
        description: "Cahier supprimé avec succès"
      });
    } catch (error) {
      console.error('Error deleting specification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cahier",
        variant: "destructive"
      });
    }
  }, [specs, toast, selectedSpec, updateStats]);

  // Handle status change
  const handleStatusChange = useCallback((id: string, status: 'draft' | 'in_review' | 'approved' | 'archived') => {
    try {
      const updatedSpecs = specs.map(spec => 
        spec.id === id 
          ? { ...spec, status, updatedAt: new Date().toISOString() } 
          : spec
      );
      
      setSpecs(updatedSpecs);
      localStorage.setItem('cahierSpecs', JSON.stringify(updatedSpecs));
      updateStats(updatedSpecs);
      
      // Show success message
      toast({
        title: "Statut mis à jour",
        description: `Le statut a été mis à jour en "${getStatusLabel(status)}".`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  }, [specs, toast, updateStats]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cahier des charges</h1>
            <p className="text-gray-600 dark:text-gray-400">Gérez vos spécifications techniques</p>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau cahier
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-blue-500">Brouillons</p>
            <p className="text-2xl font-bold">{stats.draft}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-yellow-500">En revue</p>
            <p className="text-2xl font-bold">{stats.review}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-green-500">Approuvés</p>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un cahier..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="in_review">En revue</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Specifications List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {filteredSpecs.length} {filteredSpecs.length === 1 ? 'cahier' : 'cahiers'} trouvés
          </h2>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-500">Chargement...</p>
              </div>
            ) : filteredSpecs.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-500">Aucun cahier trouvé</p>
                <Button className="mt-4" onClick={() => setIsCreating(true)}>
                  Créer un nouveau cahier
                </Button>
              </div>
            ) : (
              filteredSpecs.map((spec) => (
                <div key={spec.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {spec.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Mis à jour le {fmtDate(spec.updatedAt)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSpec(spec);
                          setIsEditing(true);
                        }}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDelete(spec.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {spec.content}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        spec.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400' :
                        spec.status === 'in_review' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400' :
                        spec.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {spec.status === 'draft' ? 'Brouillon' :
                         spec.status === 'in_review' ? 'En revue' :
                         spec.status === 'approved' ? 'Approuvé' : 'Archivé'}
                      </span>
                      <div className="flex space-x-2">
                        {spec.status !== 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(spec.id, 'draft')}
                            className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          >
                            Brouillon
                          </Button>
                        )}
                        {spec.status !== 'in_review' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(spec.id, 'in_review')}
                            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            En revue
                          </Button>
                        )}
                        {spec.status !== 'approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(spec.id, 'approved')}
                            className="hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            Approuver
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false);
          setIsEditing(false);
          setSelectedSpec(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {isCreating ? 'Nouveau cahier des charges' : 'Modifier le cahier'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre
                </label>
                <Input
                  placeholder="Titre du cahier des charges"
                  value={selectedSpec?.title || ''}
                  onChange={(e) => 
                    setSelectedSpec(prev => 
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contenu
                </label>
                <textarea
                  className="w-full min-h-[200px] p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  placeholder="Détails du cahier des charges..."
                  value={selectedSpec?.content || ''}
                  onChange={(e) => 
                    setSelectedSpec(prev => 
                      prev ? { ...prev, content: e.target.value } : null
                    )
                  }
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Statut
                </label>
                <Select
                  value={selectedSpec?.status || 'draft'}
                  onValueChange={(value: 'draft' | 'in_review' | 'approved' | 'archived') =>
                    setSelectedSpec(prev =>
                      prev ? { ...prev, status: value } : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="in_review">En revue</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                  setSelectedSpec(null);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  if (isCreating && selectedSpec) {
                    handleCreate(selectedSpec);
                  } else if (isEditing && selectedSpec) {
                    handleUpdate(selectedSpec.id, selectedSpec);
                  }
                }}
                disabled={!selectedSpec?.title || !selectedSpec?.content}
              >
                {isCreating ? 'Créer' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
