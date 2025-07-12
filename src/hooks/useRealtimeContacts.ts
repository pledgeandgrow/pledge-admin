import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Contact, ContactType } from '@/types/contact';
import useContacts from './useContacts';
import { ContactFilters } from '@/services/contactService';

interface UseRealtimeContactsOptions {
  type?: ContactType | ContactType[];
  initialFilters?: ContactFilters;
  autoFetch?: boolean;
}

export const useRealtimeContacts = (options: UseRealtimeContactsOptions = {}) => {
  const supabase = createClient();
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  
  // Use the base contacts hook for data fetching and CRUD operations
  const contactsHook = useContacts(options);
  
  // Set up Supabase Realtime subscription
  useEffect(() => {
    if (!realtimeEnabled) return;

    // Create a channel for contacts table
    const channel = supabase
      .channel('contacts-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'contacts',
      }, (payload) => {
        console.log('Realtime contact update:', payload);
        
        // Handle different types of changes
        if (payload.eventType === 'INSERT') {
          const newContact = payload.new as Contact;
          
          // Check if the new contact matches our current filters
          const typeFilter = options.type || options.initialFilters?.type;
          if (typeFilter) {
            const types = Array.isArray(typeFilter) ? typeFilter : [typeFilter];
            if (!types.includes(newContact.type as ContactType)) {
              return; // Skip if not matching our type filter
            }
          }
          
          // Add the new contact to our state
          contactsHook.contacts.unshift(newContact);
          contactsHook.refetch();
        } 
        else if (payload.eventType === 'UPDATE') {
          const updatedContact = payload.new as Contact;
          
          // Update the contact in our state if it exists
          const index = contactsHook.contacts.findIndex(c => c.id === updatedContact.id);
          if (index !== -1) {
            contactsHook.refetch();
          }
        } 
        else if (payload.eventType === 'DELETE') {
          const deletedId = payload.old.id;
          
          // Remove the contact from our state if it exists
          const index = contactsHook.contacts.findIndex(c => c.id === deletedId);
          if (index !== -1) {
            contactsHook.refetch();
          }
        }
      })
      .subscribe();

    // Cleanup function to remove the subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, realtimeEnabled, options.type, options.initialFilters?.type, contactsHook]);

  const toggleRealtime = useCallback(() => {
    setRealtimeEnabled(prev => !prev);
  }, []);

  return {
    ...contactsHook,
    realtimeEnabled,
    toggleRealtime,
  };
};

export default useRealtimeContacts;
