'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { ContactTable } from './ContactTable';
import { ContactForm } from './ContactForm';
import { ContactView } from './ContactView';
import { useContacts } from '@/hooks/useContacts';
import { BaseContact, ContactType } from '@/types/contact';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface ContactListProps {
  contactType: ContactType;
  title: string;
  description: string;
}

export function ContactList({ contactType, title, description }: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<BaseContact | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const {
    contacts,
    isLoading: loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    realtimeEnabled,
    toggleRealtime
  } = useContacts({
    type: contactType,
    initialFilters: {
      orderBy: 'updated_at',
      orderDirection: 'desc'
    }
  });

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) => {
    // First ensure we only show contacts of the specified type
    if (contact.type !== contactType) return false;
    
    // If no search query, show all contacts of the correct type
    if (!searchQuery) return true;
    
    // Search in all relevant fields
    const firstName = contact.first_name?.toLowerCase() || '';
    const lastName = contact.last_name?.toLowerCase() || '';
    const email = contact.email?.toLowerCase() || '';
    
    // Safely access company - it might be a direct property or in metadata
    let company = '';
    if ('company' in contact && typeof contact.company === 'string') {
      company = contact.company.toLowerCase();
    } else if (contact.metadata && typeof contact.metadata === 'object' && 
               'company' in contact.metadata && typeof contact.metadata.company === 'string') {
      company = contact.metadata.company.toLowerCase();
    }
    
    // Safely access position - it might be a direct property or not exist
    let position = '';
    if ('position' in contact && typeof contact.position === 'string') {
      position = contact.position.toLowerCase();
    }
    // Handle department field which might be in metadata for member contacts
    const department = typeof contact.metadata === 'object' && contact.metadata !== null
      ? (contact.metadata as Record<string, unknown>).department?.toString().toLowerCase() || ''
      : '';
    const query = searchQuery.toLowerCase();
    
    return firstName.includes(query) || 
           lastName.includes(query) || 
           email.includes(query) || 
           company?.includes(query) || 
           position?.includes(query) ||
           department.includes(query);
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const handleView = (contact: BaseContact) => {
    setSelectedContact(contact);
    setIsViewing(true);
    setIsEditing(false);
  };

  const handleEdit = (contact: BaseContact) => {
    setSelectedContact(contact);
    setIsEditing(true);
    setIsViewing(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setSelectedContact(null);
    setIsEditing(false);
    setIsViewing(false);
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setIsEditing(false);
    setSelectedContact(null);
  };

  const handleCloseView = () => {
    setIsViewing(false);
    setSelectedContact(null);
  };

  const handleSubmit = async (contactData: Partial<BaseContact>) => {
    if (isEditing && selectedContact?.id) {
      // For update, extract id and pass the rest as updates
      const { id, ...updates } = contactData as BaseContact;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateContact(selectedContact.id, updates as any);
    } else {
      // For create, pass the whole object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await createContact(contactData as any);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h2>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="flex gap-2">
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
            onClick={handleAdd}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {contactType.charAt(0).toUpperCase() + contactType.slice(1)}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${contactType}s...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 max-w-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading contacts: {typeof error === 'object' && error !== null ? (error as Error).message : error}
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Spinner className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ContactTable 
          contacts={filteredContacts}
          contactType={contactType}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ContactForm
        isOpen={isAdding || isEditing}
        isEditing={isEditing}
        contact={selectedContact}
        contactType={contactType}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      <ContactView
        isOpen={isViewing}
        contact={selectedContact}
        contactType={contactType}
        onClose={handleCloseView}
        onEdit={() => {
          setIsViewing(false);
          setIsEditing(true);
        }}
      />
    </div>
  );
}
