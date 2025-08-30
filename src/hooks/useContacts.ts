import { useState, useEffect, useCallback } from 'react';
import { Contact, ContactType } from '@/types/contact';
import * as contactService from '@/services/contactService';
import { ContactFilters } from '@/services/contactService';

interface UseContactsOptions {
  type?: ContactType | ContactType[];
  initialFilters?: ContactFilters;
  autoFetch?: boolean;
}

interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  fetchContacts: (filters?: ContactFilters) => Promise<void>;
  createContact: (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => Promise<Contact>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<Contact>;
  deleteContact: (id: string) => Promise<boolean>;
  filters: ContactFilters;
  setFilters: (filters: ContactFilters) => void;
  refetch: () => Promise<void>;
}

export const useContacts = (options: UseContactsOptions = {}): UseContactsReturn => {
  const { type, initialFilters = {}, autoFetch = true } = options;
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filters, setFilters] = useState<ContactFilters>({
    ...initialFilters,
    type: type || initialFilters.type,
  });

  const fetchContacts = useCallback(async (newFilters?: ContactFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedFilters = newFilters ? { ...filters, ...newFilters } : filters;
      
      // Fetch contacts with the current filters
      const data = await contactService.getContacts(mergedFilters);
      setContacts(data);
      
      // Get total count (without pagination)
      const countFilters = { ...mergedFilters };
      delete countFilters.limit;
      delete countFilters.offset;
      
      // We're not actually fetching all contacts here, just getting the count from the stats
      if (mergedFilters.type) {
        const stats = await contactService.getContactStatsByType();
        const relevantTypes = Array.isArray(mergedFilters.type) 
          ? mergedFilters.type 
          : [mergedFilters.type];
          
        const count = stats
          .filter(stat => relevantTypes.includes(stat.type as ContactType))
          .reduce((acc, stat) => acc + stat.count, 0);
          
        setTotalCount(count);
      } else {
        // If no type filter, just use the length of the returned data
        // This is not ideal but avoids fetching all contacts just for the count
        setTotalCount(data.length);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refetch = useCallback(() => fetchContacts(), [fetchContacts]);

  const createContactHandler = useCallback(async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Validate required fields before sending to service
      if (!contact.first_name || !contact.last_name || !contact.type || !contact.status) {
        const error = new Error('Missing required fields for contact creation');
        console.error('Validation error in useContacts:', error, { contact });
        setError(error);
        throw error;
      }

      // Ensure type is set correctly
      if (!contact.type) {
        console.warn('Contact type not set, this may cause issues');
      }

      console.log('Creating contact in useContacts hook:', JSON.stringify(contact, null, 2));
      const newContact = await contactService.createContact(contact);
      
      if (!newContact || !newContact.id) {
        const error = new Error('Failed to create contact: Invalid response');
        setError(error);
        throw error;
      }
      
      console.log('Contact created successfully:', newContact.id);
      setContacts(prev => [newContact, ...prev]);
      setTotalCount(prev => prev + 1);
      return newContact;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred creating contact');
      setError(error);
      console.error('Error creating contact in useContacts hook:', error);
      throw error;
    }
  }, []);

  const updateContactHandler = useCallback(async (id: string, contact: Partial<Contact>) => {
    try {
      const updatedContact = await contactService.updateContact(id, contact);
      setContacts(prev => 
        prev.map(c => c.id === id ? { ...c, ...updatedContact } as Contact : c)
      );
      return updatedContact;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error updating contact:', err);
      throw err;
    }
  }, []);

  const deleteContactHandler = useCallback(async (id: string) => {
    try {
      await contactService.deleteContact(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      setTotalCount(prev => prev - 1);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error deleting contact:', err);
      throw err;
    }
  }, []);

  const setFiltersHandler = useCallback((newFilters: ContactFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchContacts();
    }
  }, [autoFetch, fetchContacts]);

  return {
    contacts,
    loading,
    error,
    totalCount,
    fetchContacts,
    createContact: createContactHandler,
    updateContact: updateContactHandler,
    deleteContact: deleteContactHandler,
    filters,
    setFilters: setFiltersHandler,
    refetch,
  };
};

export default useContacts;
