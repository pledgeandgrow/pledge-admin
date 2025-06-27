// src/components/commercial/client/ClientList.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Loader2 } from 'lucide-react';
import { ClientTable } from './ClientTable';
import { ClientForm } from './ClientForm';
import { ClientModal } from './ClientModal';
import { Client } from '@/types/commercial';
import { useClientStore } from '@/stores/commercial/clientStore';
import { toast } from '@/components/ui/use-toast';

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

export function ClientList() {
  console.log('Rendering ClientList');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Get state and actions from the store
  const { 
    clients, 
    loading, 
    error,
    fetchClients, 
    deleteClient 
  } = useClientStore();

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle edit client
  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };

  // Handle view client
  const handleView = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // Handle delete client
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await deleteClient(id);
        toast({
          title: 'Succès',
          description: 'Client supprimé avec succès',
        });
      } catch (error) {
        console.error('Error deleting client:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la suppression du client',
          variant: 'destructive',
        });
      }
    }
  };

  // Handle form success
  const handleSuccess = async () => {
    console.log('Form submission successful, refreshing client list...');
    try {
      await fetchClients();
      setIsFormOpen(false);
      setSelectedClient(null);
      toast({
        title: 'Succès',
        description: 'Opération effectuée avec succès',
      });
    } catch (error) {
      console.error('Error refreshing client list:', error);
      toast({
        title: 'Erreur',
        description: 'Client enregistré mais erreur lors de la mise à jour de la liste',
        variant: 'destructive',
      });
    }
  };

  // Form and modal open/close is handled directly in the components

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const search = searchTerm.toLowerCase();
    return clients.filter(client => (
      client.name?.toLowerCase().includes(search) ||
      client.email?.toLowerCase().includes(search) ||
      client.phone?.includes(search) ||
      client.company_name?.toLowerCase().includes(search) ||
      client.vat_number?.includes(search)
    ));
  }, [clients, searchTerm]);

  // Log state changes
  useEffect(() => {
    console.log('Clients in store:', clients);
  }, [clients]);

  // Initial data fetch
  useEffect(() => {
    console.log('Initializing ClientList - fetching clients');
    const loadClients = async () => {
      try {
        console.log('Fetching clients...');
        await fetchClients();
      } catch (error) {
        console.error('Error loading clients:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger la liste des clients: ' + 
            (error instanceof Error ? error.message : 'Unknown error'),
          variant: 'destructive',
        });
      }
    };

    loadClients();
  }, [fetchClients]);

  // Loading state
  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 text-red-500">
        Erreur: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un client..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button 
          className="w-full sm:w-auto" 
          onClick={() => {
            setSelectedClient(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau client
        </Button>
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">
            {searchTerm ? 
              'Aucun client ne correspond à votre recherche' : 
              'Aucun client trouvé. Commencez par ajouter un client.'}
          </p>
          {!searchTerm && (
            <Button 
              className="mt-4" 
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un client
            </Button>
          )}
        </div>
      ) : (
        <ClientTable 
          clients={filteredClients} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          getStatusColor={getStatusColor}
        />
      )}

      <ClientForm 
        open={isFormOpen} 
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedClient(null);
        }}
        client={selectedClient}
        onSuccess={handleSuccess}
      />

      <ClientModal
        client={selectedClient}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onEdit={() => {
          setIsModalOpen(false);
          setIsFormOpen(true);
        }}
        onDelete={async (id) => {
          try {
            await deleteClient(id);
            toast({
              title: 'Succès',
              description: 'Le client a été supprimé avec succès',
            });
          } catch (error) {
            console.error('Error deleting client:', error);
            toast({
              title: 'Erreur',
              description: 'Une erreur est survenue lors de la suppression du client',
              variant: 'destructive',
            });
          }
        }}
      />
    </div>
  );
}