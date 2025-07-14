'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useDocuments from '@/hooks/useDocuments';
import { Document } from '@/types/documents';
import { QuoteMetadata } from './types';
import { DevisCard } from './DevisCard';
import { DevisDetails } from './DevisDetails';
import { DevisForm } from './DevisForm';
import { DevisStats } from './DevisStats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface DevisListProps {
  clientId?: string;
  projectId?: string;
}

export function DevisList({ 
  clientId,
  projectId
}: DevisListProps): React.ReactElement {
  // Document state and hooks
  const { 
    documents, 
    loading, 
    error, 
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument
  } = useDocuments();

  // UI state
  const [selectedDevis, setSelectedDevis] = useState<Document | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'due_date' | 'total'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Client and project state for forms
  const [clients, setClients] = useState<Array<{
    id: string;
    name: string;
    email: string;
    address: string;
    postal_code: string;
    city: string;
    country: string;
    vat_number?: string;
  }>>([]);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch documents on component mount
  useEffect(() => {
    // Call fetchDocuments without parameters
    fetchDocuments();
  }, [fetchDocuments]);

  // Extract unique clients and projects from documents
  useEffect(() => {
    const uniqueClients: Record<string, {
      id: string;
      name: string;
      email: string;
      address: string;
      postal_code: string;
      city: string;
      country: string;
      vat_number?: string;
    }> = {};
    
    const uniqueProjects: Record<string, { id: string; name: string }> = {};
    
    documents.forEach(doc => {
      // Skip documents that aren't quotes
      if (doc.document_type_id !== 'quote') return;
      
      // Cast to unknown first, then to Partial<QuoteMetadata> to safely access properties
      const metadata = doc.metadata as unknown as Partial<QuoteMetadata>;
      
      if (metadata?.client?.id && metadata?.client?.name) {
        uniqueClients[metadata.client.id] = {
          id: metadata.client.id,
          name: metadata.client.name,
          email: metadata.client.email || '',
          address: metadata.client.address || '',
          postal_code: metadata.client.postal_code || '',
          city: metadata.client.city || '',
          country: metadata.client.country || '',
          vat_number: metadata.client.vat_number,
        };
      }
      
      if (metadata?.project_id && metadata?.project_name) {
        uniqueProjects[metadata.project_id] = {
          id: metadata.project_id,
          name: metadata.project_name,
        };
      }
    });
    
    setClients(Object.values(uniqueClients));
    setProjects(Object.values(uniqueProjects));
  }, [documents]);

  // Filter and sort documents using useCallback for memoization
  const filteredAndSortedDocuments = useCallback((): Document[] => {
    return documents
      .filter((doc: Document) => {
        // First convert to unknown, then to QuoteMetadata to avoid type errors
        const metadata = doc.metadata as unknown as Partial<QuoteMetadata>;
        
        // Skip documents that don't have proper quote metadata or aren't quotes
        if (!metadata || !metadata.quote_number || doc.document_type_id !== 'quote') {
          return false;
        }
        
        // Apply client filter if specified
        if (clientId && metadata.client?.id !== clientId) {
          return false;
        }
        
        // Apply project filter if specified
        if (projectId && metadata.project_id !== projectId) {
          return false;
        }
        
        // Apply status filter
        if (statusFilter !== 'all' && metadata.quote_status !== statusFilter) {
          return false;
        }
        
        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            doc.title?.toLowerCase().includes(query) ||
            (metadata.quote_number ? metadata.quote_number.toLowerCase().includes(query) : false) ||
            (metadata.client?.name ? metadata.client.name.toLowerCase().includes(query) : false) ||
            (metadata.project_name ? metadata.project_name.toLowerCase().includes(query) : false)
          );
        }
        
        return true;
      })
      .sort((a: Document, b: Document) => {
        // First convert to unknown, then to QuoteMetadata to avoid type errors
        const metadataA = a.metadata as unknown as Partial<QuoteMetadata>;
        const metadataB = b.metadata as unknown as Partial<QuoteMetadata>;
        
        let valueA: number = 0;
        let valueB: number = 0;
        
        if (sortBy === 'date') {
          valueA = metadataA?.date ? new Date(metadataA.date).getTime() : 0;
          valueB = metadataB?.date ? new Date(metadataB.date).getTime() : 0;
        } else if (sortBy === 'due_date') {
          valueA = metadataA?.due_date ? new Date(metadataA.due_date).getTime() : 0;
          valueB = metadataB?.due_date ? new Date(metadataB.due_date).getTime() : 0;
        } else if (sortBy === 'total') {
          valueA = typeof metadataA?.total === 'number' ? metadataA.total : 0;
          valueB = typeof metadataB?.total === 'number' ? metadataB.total : 0;
        }
        
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      });
  }, [documents, clientId, projectId, statusFilter, searchQuery, sortBy, sortDirection]);

  const handleToggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Calculate quote statistics
  const quoteStats = {
    total_count: documents.filter(doc => doc.document_type_id === 'quote').length,
    draft_count: documents.filter(doc => {
      if (doc.document_type_id !== 'quote') return false;
      const metadata = doc.metadata as unknown as Partial<QuoteMetadata>;
      return metadata?.quote_status === "draft";
    }).length,
    sent_count: documents.filter(doc => {
      if (doc.document_type_id !== 'quote') return false;
      const metadata = doc.metadata as unknown as Partial<QuoteMetadata>;
      return metadata?.quote_status === "sent";
    }).length,
    accepted_count: documents.filter(doc => {
      if (doc.document_type_id !== 'quote') return false;
      const metadata = doc.metadata as unknown as Partial<QuoteMetadata>;
      return metadata?.quote_status === "accepted";
    }).length,
    refused_count: documents.filter(doc => {
      if (doc.document_type_id !== 'quote') return false;
      const metadata = doc.metadata as unknown as Partial<QuoteMetadata>;
      return metadata?.quote_status === "rejected";
    }).length,
    expired_count: documents.filter(doc => {
      if (doc.document_type_id !== 'quote') return false;
      const metadata = doc.metadata as unknown as Partial<QuoteMetadata>;
      return metadata?.quote_status === "expired";
    }).length,
    total_amount: documents.filter(doc => doc.document_type_id === 'quote').reduce((sum, doc) => {
      const metadata = doc.metadata as unknown as Partial<QuoteMetadata>;
      return sum + (metadata?.total || 0);
    }, 0),
    accepted_amount: documents.filter(doc => {
      if (doc.document_type_id !== 'quote') return false;
      const metadata = doc.metadata as unknown as Partial<QuoteMetadata>;
      return metadata?.quote_status === "accepted";
    }).reduce((sum, doc) => {
      const metadata = doc.metadata as unknown as Partial<QuoteMetadata>;
      return sum + (metadata?.total || 0);
    }, 0),
  };

  // Event handlers
  const handleCreateDevis = () => {
    setSelectedDevis(null);
    setIsCreateModalOpen(true);
  };

  const handleSelectDevis = (document: Document) => {
    setSelectedDevis(document);
  };

  const handleCloseDetails = () => {
    setSelectedDevis(null);
  };

  const handleDeleteDevis = async () => {
    if (!selectedDevis) return;
    
    try {
      await deleteDocument(selectedDevis.id);
      toast({
        title: "Devis supprimé",
        description: "Le devis a été supprimé avec succès.",
      });
      setSelectedDevis(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting devis:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le devis.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Une erreur est survenue lors du chargement des devis.
      </div>
    );
  }

  // Get filtered and sorted documents
  const filteredSortedDocs = filteredAndSortedDocuments();

  return (
    <div className="container mx-auto py-10 space-y-8">
      {selectedDevis ? (
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={handleCloseDetails}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold">Détails du devis</h1>
          </div>
          <DevisDetails 
            document={selectedDevis} 
            onDelete={() => setIsDeleteDialogOpen(true)}
            onEdit={() => setIsCreateModalOpen(true)}
            onClose={handleCloseDetails}
          />
        </div>
      ) : (
        <>
          <DevisStats stats={quoteStats} />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Devis</h2>
              <Button onClick={handleCreateDevis}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau devis
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un devis..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="sent">Envoyé</SelectItem>
                    <SelectItem value="accepted">Accepté</SelectItem>
                    <SelectItem value="rejected">Refusé</SelectItem>
                    <SelectItem value="expired">Expiré</SelectItem>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Trier
                      {sortDirection === 'asc' ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('date')}>
                      Date de création
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('due_date')}>
                      Date d&apos;échéance
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('total')}>
                      Montant
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleSortDirection}>
                      {sortDirection === 'asc' ? 'Croissant' : 'Décroissant'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredSortedDocs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery || statusFilter !== 'all' ? 
                  'Aucun devis ne correspond à vos critères de recherche.' : 
                  'Aucun devis disponible.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSortedDocs.map((document: Document) => (
                  <DevisCard
                    key={document.id}
                    document={document}
                    onClick={() => handleSelectDevis(document)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Create/Edit Devis Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDevis ? "Modifier le devis" : "Nouveau devis"}
            </DialogTitle>
          </DialogHeader>
          <DevisForm
            onSubmit={async (data: Partial<QuoteMetadata>) => {
              try {
                let document: Document;
                
                if (selectedDevis) {
                  // Update existing document
                  document = await updateDocument({
                    id: selectedDevis.id,
                    title: `Devis ${data.quote_number || ''}`,
                    metadata: data as unknown as Record<string, string | number | boolean | string[] | Record<string, unknown>>
                  });
                } else {
                  // Create new document
                  document = await createDocument({
                    title: `Devis ${data.quote_number || ''}`,
                    document_type_id: 'quote',
                    metadata: data as unknown as Record<string, string | number | boolean | string[] | Record<string, unknown>>
                  });
                }
                
                setIsCreateModalOpen(false);
                setSelectedDevis(document);
                toast({
                  title: selectedDevis ? "Devis mis à jour" : "Devis créé",
                  description: selectedDevis 
                    ? "Le devis a été mis à jour avec succès." 
                    : "Le devis a été créé avec succès.",
                });
              } catch (error) {
                console.error('Error saving devis:', error);
                toast({
                  title: "Erreur",
                  description: "Une erreur est survenue lors de l'enregistrement du devis.",
                  variant: "destructive",
                });
              }
            }}
            onCancel={() => setIsCreateModalOpen(false)}
            clients={clients}
            projects={projects}
            initialDocument={selectedDevis || undefined}
            companyDetails={{
              name: "",
              address: "",
              postal_code: "",
              city: "",
              country: "",
              vat_number: "",
              registration_number: "",
              phone: "",
              email: "",
              website: "",
              bank_account: ""
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteDevis}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DevisList;
