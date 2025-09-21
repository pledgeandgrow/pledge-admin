// src/components/commercial/client/ClientList.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Loader2, RefreshCw } from 'lucide-react';
import { ClientTable } from './ClientTable';
import { ClientForm } from './ClientForm';
import { ClientModal } from './ClientModal';
import { Contact, ClientContact } from '@/types/contact';
import { useContacts } from '@/hooks/useContacts';
import { contactService } from '@/services/contactService';
import { toast } from '@/components/ui/use-toast';

// Define Client interface for UI representation
interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  address?: string;
  website?: string;
  industry?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  is_company: boolean;
  company_name?: string;
  contact_person?: string;
  vat_number?: string;
  registration_number?: string;
  country?: string;
}

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
  const [selectedClient, setSelectedClient] = useState<ClientContact | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Use the contacts hook to get clients
  const { contacts: contactsData, isLoading: loading, error, realtimeEnabled, toggleRealtime } = useContacts({ type: 'client' });
  
  // Convert contacts to clients
  const clients = useMemo(() => {
    return contactsData.map((contact) => {
      // Extract metadata fields from contact
      const metadata = contact.metadata as Record<string, string | number | boolean | null | Record<string, unknown>> || {};
      
      // Create a client object from the contact data
      return {
        id: contact.id,
        name: contact.first_name && contact.last_name ? `${contact.first_name} ${contact.last_name}` : contact.first_name || contact.last_name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        status: contact.status || 'active',
        address: metadata.address as string || '',
        website: metadata.website as string || '',
        industry: metadata.industry as string || '',
        notes: metadata.notes as string || '',
        created_at: contact.created_at,
        updated_at: contact.updated_at,
        is_company: metadata.is_company as boolean || false,
        company_name: metadata.company_name as string || '',
        contact_person: metadata.contact_person as string || '',
        vat_number: metadata.vat_number as string || '',
        registration_number: metadata.registration_number as string || '',
        country: metadata.country as string || ''
      } as Client;
    });
  }, [contactsData]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Convert UI Client object to ClientContact format for the form
  const convertToClientContact = (client: Client): ClientContact => {
    return {
      id: client.id,
      first_name: client.name.split(' ')[0] || '',
      last_name: client.name.split(' ').slice(1).join(' ') || '',
      email: client.email || '',
      phone: client.phone || '',
      status: client.status || 'Active',
      type: 'client',
      created_at: client.created_at || new Date().toISOString(),
      updated_at: client.updated_at || new Date().toISOString(),
      metadata: {
        is_company: client.is_company,
        company_name: client.company_name || '',
        contact_person: client.contact_person || '',
        vat_number: client.vat_number || '',
        registration_number: client.registration_number || '',
        address: client.address || '',
        website: client.website || '',
        country: client.country || '',
        industry: client.industry || '',
        notes: client.notes || ''
      }
    };
  };

  // Handle edit client
  const handleEdit = (client: Client) => {
    const clientContact = convertToClientContact(client);
    setSelectedClient(clientContact);
    setIsFormOpen(true);
  };

  // Handle view client
  const handleView = (client: Client) => {
    const clientContact = convertToClientContact(client);
    setSelectedClient(clientContact);
    setIsModalOpen(true);
  };

  // Handle delete client
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setIsDeleting(id);
      try {
        await contactService.deleteContact(id);
        toast({
          title: 'Client deleted',
          description: 'Client has been deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting client:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete client',
          variant: 'destructive',
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Handle form success
  const handleSuccess = () => {
    console.log('Form submission successful');
    // No need to refresh clients as useRealtimeContacts will handle it
    setIsFormOpen(false);
    setSelectedClient(null);
    toast({
      title: 'Succès',
      description: 'Opération effectuée avec succès',
    });
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
      client.vat_number?.includes(search) ||
      client.address?.toLowerCase().includes(search) ||
      client.country?.toLowerCase().includes(search)
    ));
  }, [clients, searchTerm]);

  // Log state changes
  useEffect(() => {
    console.log('Clients data updated:', clients.length);
  }, [clients]);

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
        Erreur: {typeof error === 'object' && error !== null ? (error as Error).message : error || 'Une erreur est survenue'}
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
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            onClick={toggleRealtime}
            variant="outline"
            className={realtimeEnabled ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50" : ""}
            title="Toggle realtime updates"
          >
            {realtimeEnabled ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Realtime: ON
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Realtime: OFF
              </>
            )}
          </Button>
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
            await contactService.deleteContact(id);
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