'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useDocuments from '@/hooks/useDocuments';
import { Document } from '@/types/documents';
import { InvoiceMetadata } from './types';
import { InvoiceCard } from './InvoiceCard';
import { InvoiceDetails } from './InvoiceDetails';
import { InvoiceForm } from './InvoiceForm';
import { InvoiceStats } from './InvoiceStats';
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
import { contactService } from '@/services/contactService';
import { projectService } from '@/services/projectService';
import { ClientContact } from '@/types/contact';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface InvoiceListProps {
  clientId?: string;
  projectId?: string;
}

export function InvoiceList({ 
  clientId, 
  projectId 
}: InvoiceListProps): React.ReactElement {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Modal and detail view state
  const [selectedInvoice, setSelectedInvoice] = useState<Document | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  // Get documents from useDocuments hook
  const { documents, loading, error, fetchDocuments, createDocument, updateDocument, deleteDocument } = useDocuments();
  const { toast } = useToast();

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  // Fetch clients and projects directly from their data sources
  useEffect(() => {
    // Fetch clients (contacts of type 'client')
    const fetchClients = async () => {
      try {
        const clientContacts = await contactService.getContactsByType('client');
        // Filter to ensure we only process ClientContact type
        const onlyClientContacts = clientContacts.filter(contact => contact.type === 'client') as ClientContact[];
        
        const formattedClients = onlyClientContacts.map(client => ({
          id: client.id,
          name: client.metadata?.is_company ? client.company || '' : `${client.first_name} ${client.last_name}`,
          email: client.email || '',
          address: client.metadata?.address as string || '',
          postal_code: client.metadata?.postal_code as string || '',
          city: client.metadata?.city as string || '',
          country: client.metadata?.country as string || '',
          vat_number: client.metadata?.vat_number as string || undefined,
        }));
        setClients(formattedClients);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les clients",
          variant: "destructive"
        });
      }
    };

    // Fetch projects
    const fetchProjects = async () => {
      try {
        const projectData = await projectService.getAllProjects();
        const formattedProjects = projectData.map(project => ({
          id: project.id || '',
          name: project.name
        }));
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les projets",
          variant: "destructive"
        });
      }
    };

    fetchClients();
    fetchProjects();
  }, [toast]); // Only depends on toast, will run once on component mount

  // Filter and sort documents
  const filteredAndSortedDocuments = useCallback(() => {
    return documents
      .filter((doc: Document) => {
        // First convert to unknown, then to InvoiceMetadata to avoid type errors
        const metadata = doc.metadata as unknown as Partial<InvoiceMetadata>;
        
        // Skip documents that don't have proper invoice metadata or aren't invoices
        if (!metadata || !metadata.invoice_number || doc.document_type_id !== 'invoice') {
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
        if (statusFilter !== 'all' && metadata.invoice_status !== statusFilter) {
          return false;
        }
        
        // Apply search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesInvoiceNumber = metadata.invoice_number?.toLowerCase().includes(query);
          const matchesClientName = metadata.client?.name?.toLowerCase().includes(query);
          const matchesTotal = metadata.total?.toString().includes(query);
          
          return matchesInvoiceNumber || matchesClientName || matchesTotal;
        }
        
        return true;
      })
      .sort((a, b) => {
        const metadataA = a.metadata as unknown as Partial<InvoiceMetadata>;
        const metadataB = b.metadata as unknown as Partial<InvoiceMetadata>;
        
        if (sortBy === 'date') {
          const dateA = metadataA.date ? new Date(metadataA.date).getTime() : 0;
          const dateB = metadataB.date ? new Date(metadataB.date).getTime() : 0;
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        if (sortBy === 'amount') {
          const amountA = metadataA.total || 0;
          const amountB = metadataB.total || 0;
          return sortDirection === 'asc' ? amountA - amountB : amountB - amountA;
        }
        
        if (sortBy === 'client') {
          const clientA = metadataA.client?.name || '';
          const clientB = metadataB.client?.name || '';
          return sortDirection === 'asc' 
            ? clientA.localeCompare(clientB) 
            : clientB.localeCompare(clientA);
        }
        
        if (sortBy === 'status') {
          const statusA = metadataA.invoice_status || '';
          const statusB = metadataB.invoice_status || '';
          return sortDirection === 'asc' 
            ? statusA.localeCompare(statusB) 
            : statusB.localeCompare(statusA);
        }
        
        return 0;
      });
  }, [documents, clientId, projectId, statusFilter, searchQuery, sortBy, sortDirection]);
      

  const handleCreateInvoice = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedInvoice(null);
  };
  
  const handleDeleteInvoice = async () => {
    if (!selectedInvoice) return;
    
    try {
      await deleteDocument(selectedInvoice.id);
      toast({
        title: "Facture supprimée",
        description: "La facture a été supprimée avec succès.",
      });
      setSelectedInvoice(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la facture.",
        variant: "destructive",
      });
    }
  };

  // Calculate invoice statistics
  const invoiceStats = {
    total_count: documents.filter(doc => doc.document_type_id === 'invoice').length,
    draft_count: documents.filter(doc => {
      if (doc.document_type_id !== 'invoice') return false;
      const metadata = doc.metadata as unknown as Partial<InvoiceMetadata>;
      return metadata?.invoice_status === "draft";
    }).length,
    sent_count: documents.filter(doc => {
      if (doc.document_type_id !== 'invoice') return false;
      const metadata = doc.metadata as unknown as Partial<InvoiceMetadata>;
      return metadata?.invoice_status === "sent";
    }).length,
    paid_count: documents.filter(doc => {
      if (doc.document_type_id !== 'invoice') return false;
      const metadata = doc.metadata as unknown as Partial<InvoiceMetadata>;
      return metadata?.invoice_status === "paid";
    }).length,
    overdue_count: documents.filter(doc => {
      if (doc.document_type_id !== 'invoice') return false;
      const metadata = doc.metadata as unknown as Partial<InvoiceMetadata>;
      return metadata?.invoice_status === "overdue";
    }).length,
    total_amount: documents.filter(doc => doc.document_type_id === 'invoice').reduce((sum, doc) => {
      const metadata = doc.metadata as unknown as Partial<InvoiceMetadata>;
      return sum + (metadata?.total || 0);
    }, 0),
    paid_amount: documents.filter(doc => {
      if (doc.document_type_id !== 'invoice') return false;
      const metadata = doc.metadata as unknown as Partial<InvoiceMetadata>;
      return metadata?.invoice_status === "paid";
    }).reduce((sum, doc) => {
      const metadata = doc.metadata as unknown as Partial<InvoiceMetadata>;
      return sum + (metadata?.total || 0);
    }, 0),
    overdue_amount: documents.filter(doc => {
      if (doc.document_type_id !== 'invoice') return false;
      const metadata = doc.metadata as unknown as Partial<InvoiceMetadata>;
      return metadata?.invoice_status === "overdue";
    }).reduce((sum, doc) => {
      const metadata = doc.metadata as unknown as Partial<InvoiceMetadata>;
      return sum + (metadata?.total || 0);
    }, 0),
    currency: "EUR"
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Une erreur est survenue lors du chargement des factures.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      {selectedInvoice ? (
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
            <h1 className="text-3xl font-bold">Détails de la facture</h1>
          </div>
          <InvoiceDetails 
            document={selectedInvoice} 
            onDelete={() => setIsDeleteDialogOpen(true)} 
            onEdit={() => setIsCreateModalOpen(true)}
          />
        </div>
      ) : (
        <>
          <InvoiceStats stats={invoiceStats} />
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une facture..."
                    className="pl-8 max-w-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="sent">Envoyée</SelectItem>
                    <SelectItem value="paid">Payée</SelectItem>
                    <SelectItem value="overdue">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="h-4 w-4 mr-2" />
                      Trier
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('date')}>
                      Date
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('amount')}>
                      Montant
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('client')}>
                      Client
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('status')}>
                      Statut
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                >
                  {sortDirection === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>

                <Button 
                  onClick={handleCreateInvoice}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle facture
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                Une erreur est survenue lors du chargement des factures.
              </div>
            ) : filteredAndSortedDocuments().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune facture trouvée.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedDocuments().map((document) => (
                  <InvoiceCard
                    key={document.id}
                    document={document}
                    onClick={() => setSelectedInvoice(document)}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Create/Edit Invoice Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedInvoice ? "Modifier la facture" : "Créer une facture"}
            </DialogTitle>
          </DialogHeader>
          <InvoiceForm
            initialDocument={selectedInvoice || undefined}
            clients={clients}
            projects={projects}
            onCancel={() => setIsCreateModalOpen(false)}
            onSubmit={async (data: Partial<InvoiceMetadata>) => {
              try {
                let document: Document;
                
                if (selectedInvoice) {
                  // Update existing document
                  document = await updateDocument({
                    id: selectedInvoice.id,
                    title: `Facture ${data.invoice_number || ''}`,
                    metadata: data as unknown as Record<string, string | number | boolean | string[] | Record<string, unknown>>
                  });
                } else {
                  // Create new document
                  document = await createDocument({
                    title: `Facture ${data.invoice_number || ''}`,
                    document_type_id: 'invoice',
                    metadata: data as unknown as Record<string, string | number | boolean | string[] | Record<string, unknown>>
                  });
                }
                
                setIsCreateModalOpen(false);
                setSelectedInvoice(document);
                toast({
                  title: selectedInvoice ? "Facture mise à jour" : "Facture créée",
                  description: selectedInvoice 
                    ? "La facture a été mise à jour avec succès." 
                    : "La facture a été créée avec succès.",
                });
              } catch (error) {
                console.error('Error saving invoice:', error);
                toast({
                  title: "Erreur",
                  description: "Une erreur est survenue lors de l'enregistrement de la facture.",
                  variant: "destructive",
                });
              }
            }}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p className="text-muted-foreground">Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.</p>
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteInvoice}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
