import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase';

export type ContactType = 
  'board-member' | 'external' | 'freelance' | 'member' | 
  'network' | 'partner' | 'waitlist' | 'blacklist' | 
  'lead' | 'client' | 'investor';

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  type: ContactType;
  status: string;
  notes?: string;
  metadata?: Record<string, any>;
  company?: string;
  position?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  
  // Type-specific fields
  service?: string;
  waitlist_position?: number;
  joined_at?: string;
  reason?: string;
  added_by?: string;
  expires_at?: string;
  source?: string;
  probability?: number;
  last_contacted_at?: string;
  next_follow_up?: string;
  estimated_value?: number;
  first_contact_date?: string;
  last_purchase_date?: string;
  total_spent?: number;
  investment_stage?: string;
  investment_focus?: string[];
  portfolio_companies?: string[];
  minimum_check_size?: number;
  maximum_check_size?: number;
  preferred_industries?: string[];
  last_contact_date?: string;
  investment_status?: string;
}

export interface ContactActivity {
  id: string;
  contact_id: string;
  contact_name: string;
  activity_type: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ContactFilters {
  type?: ContactType | ContactType[];
  status?: string | string[];
  search?: string;
  tags?: string[];
  updatedAfter?: Date;
  updatedBefore?: Date;
}

interface UseContactsOptions {
  type?: ContactType | ContactType[];
  initialFilters?: {
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    search?: string;
    status?: string | string[];
    tags?: string[];
  };
}

export const useContacts = (options?: UseContactsOptions) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [recentActivities, setRecentActivities] = useState<ContactActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeEnabled, setRealtimeEnabled] = useState<boolean>(false);
  const supabase = createClient();
  const supabaseChannel = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchContacts = useCallback(async (filters?: ContactFilters) => {
    // Merge options.initialFilters with provided filters
    const mergedFilters: ContactFilters = {
      ...(options?.initialFilters || {}),
      ...(filters || {}),
    };
    
    // Always use the type filter from options if provided
    if (options?.type) {
      mergedFilters.type = options.type;
    }
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('contacts')
        .select('*');
      
      // Apply filters if provided
      // Always apply type filter from mergedFilters
      if (mergedFilters.type) {
        const types = Array.isArray(mergedFilters.type) ? mergedFilters.type : [mergedFilters.type];
        query = query.in('type', types);
      }
      
      // Apply other filters if provided
      if (filters) {
        
        if (filters.status) {
          const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
          query = query.in('status', statuses);
        }
        
        if (filters.search) {
          query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
        }
        
        if (filters.tags && filters.tags.length > 0) {
          // For array columns, we need to use the contains operator
          query = query.contains('tags', filters.tags);
        }
        
        if (filters.updatedAfter) {
          query = query.gte('updated_at', filters.updatedAfter.toISOString());
        }
        
        if (filters.updatedBefore) {
          query = query.lte('updated_at', filters.updatedBefore.toISOString());
        }
      }
      
      // Add ordering by updated_at (most recent first)
      query = query.order('updated_at', { ascending: false });
      
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setContacts(data || []);
      
      // Generate mock recent activities based on contacts
      // In a real app, this would come from a separate table or be generated from events
      if (data && data.length > 0) {
        const mockActivities: ContactActivity[] = [];
        
        // Generate activities for the 10 most recently updated contacts
        const recentContacts = [...data].sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        ).slice(0, 10);
        
        recentContacts.forEach(contact => {
          // Create a random activity type
          const activityTypes = ['added', 'updated', 'contacted', 'meeting', 'note'];
          const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
          
          let description = '';
          switch (randomType) {
            case 'added':
              description = `${contact.first_name} ${contact.last_name} a été ajouté comme ${contact.type}`;
              break;
            case 'updated':
              description = `Les informations de ${contact.first_name} ${contact.last_name} ont été mises à jour`;
              break;
            case 'contacted':
              description = `${contact.first_name} ${contact.last_name} a été contacté par email`;
              break;
            case 'meeting':
              description = `Réunion planifiée avec ${contact.first_name} ${contact.last_name}`;
              break;
            case 'note':
              description = `Note ajoutée pour ${contact.first_name} ${contact.last_name}`;
              break;
          }
          
          mockActivities.push({
            id: `activity-${contact.id}`,
            contact_id: contact.id,
            contact_name: `${contact.first_name} ${contact.last_name}`,
            activity_type: randomType,
            description,
            timestamp: contact.updated_at,
            metadata: {
              contact_type: contact.type,
              company: contact.company
            }
          });
        });
        
        setRecentActivities(mockActivities);
      }
    } catch (err: any) {
      console.error('Error fetching contacts:', err);
      setError(err.message || 'Failed to fetch contacts');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const createContact = useCallback(async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('contacts')
        .insert(contact)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setContacts(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating contact:', err);
      setError(err.message || 'Failed to create contact');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const updateContact = useCallback(async (id: string, updates: Partial<Contact>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating contact:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      setContacts(prev => prev.map(contact => contact.id === id ? data : contact));
      return data;
    } catch (err: any) {
      console.error('Error updating contact:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      setError(err.message || 'Failed to update contact');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const deleteContact = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setContacts(prev => prev.filter(contact => contact.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting contact:', err);
      setError(err.message || 'Failed to delete contact');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Get contact statistics
  const getContactStatistics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('type, status');
      
      if (error) {
        throw error;
      }
      
      const stats = {
        total: data.length,
        byType: {
          client: data.filter(c => c.type === 'client').length,
          lead: data.filter(c => c.type === 'lead').length,
          partner: data.filter(c => c.type === 'partner').length,
          member: data.filter(c => c.type === 'member').length,
          freelance: data.filter(c => c.type === 'freelance').length,
          investor: data.filter(c => c.type === 'investor').length,
          other: data.filter(c => !['client', 'lead', 'partner', 'member', 'freelance', 'investor'].includes(c.type)).length
        }
      };
      
      return stats;
    } catch (err: any) {
      console.error('Error getting contact statistics:', err);
      return {
        total: 0,
        byType: { client: 0, lead: 0, partner: 0, member: 0, freelance: 0, investor: 0, other: 0 }
      };
    }
  }, [supabase]);

  // Setup realtime subscription
  const setupRealtimeSubscription = useCallback(() => {
    if (!realtimeEnabled) return;
    
    // Clean up any existing subscription
    if (supabaseChannel.current) {
      supabase.removeChannel(supabaseChannel.current);
    }
    
    // Capture the type filter at subscription time
    const typeFilter = options?.type;
    
    // Create a new subscription
    const channel = supabase
      .channel('contacts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contacts' }, 
        async (payload) => {
          console.log('Realtime change received:', payload);
          
          // Handle the different types of changes
          if (payload.eventType === 'INSERT') {
            const newContact = payload.new as Contact;
            // Only add if it matches our filters (if any)
            if (typeFilter && Array.isArray(typeFilter)) {
              if (!typeFilter.includes(newContact.type as ContactType)) return;
            } else if (typeFilter && newContact.type !== typeFilter) {
              return;
            }
            setContacts(prev => [newContact, ...prev]);
          } 
          else if (payload.eventType === 'UPDATE') {
            const updatedContact = payload.new as Contact;
            
            // Check if the updated contact matches our type filter
            if (typeFilter) {
              const filterArray = Array.isArray(typeFilter) ? typeFilter : [typeFilter];
              
              // If the contact type doesn't match our filter, remove it from the list
              if (!filterArray.includes(updatedContact.type as ContactType)) {
                setContacts(prev => prev.filter(contact => contact.id !== updatedContact.id));
                return;
              }
            }
            
            // Update the contact in our list
            setContacts(prev => 
              prev.map(contact => 
                contact.id === updatedContact.id ? updatedContact : contact
              )
            );
          } 
          else if (payload.eventType === 'DELETE') {
            const deletedContactId = payload.old.id;
            
            // Always remove deleted contacts from our list
            setContacts(prev => 
              prev.filter(contact => contact.id !== deletedContactId)
            );
          }
        }
      )
      .subscribe();
    
    supabaseChannel.current = channel;
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeEnabled, supabase]); // Removed options from dependencies
  
  // Toggle realtime subscription
  const toggleRealtime = useCallback(() => {
    setRealtimeEnabled(prev => !prev);
  }, []);
  
  // Effect for realtime subscription
  useEffect(() => {
    const cleanup = setupRealtimeSubscription();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeEnabled, options?.type]); // Only re-setup when realtime is toggled or type filter changes
  
  // Load contacts on component mount with the type filter
  useEffect(() => {
    // Create a filter with the type from options
    const initialFilter: ContactFilters = {};
    if (options?.type) {
      initialFilter.type = options.type;
    }
    fetchContacts(initialFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.type]); // Only re-fetch when the type filter changes

  return {
    contacts,
    recentActivities,
    isLoading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    getContactStatistics,
    realtimeEnabled,
    toggleRealtime
  };
};

export default useContacts;
