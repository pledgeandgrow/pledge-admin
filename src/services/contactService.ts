/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase';
import { BaseContact, Contact, ContactType } from '@/types/contact';

const supabase = createClient();

// Interface for contacts with joined_at field (board members and waitlist contacts)
export interface ContactWithJoinedAt extends BaseContact {
  joined_at: string;
}

export interface ContactFilters {
  type?: ContactType | ContactType[];
  status?: string | string[];
  search?: string;
  company?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  tags?: string[];
}

export const getContacts = async (filters: ContactFilters = {}) => {
  try {
    let query = supabase
      .from('contacts')
      .select('*');

    // Apply type filter
    if (filters.type) {
      if (Array.isArray(filters.type)) {
        query = query.in('type', filters.type);
      } else {
        query = query.eq('type', filters.type);
      }
    }

    // Apply status filter
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query = query.in('status', filters.status);
      } else {
        query = query.eq('status', filters.status);
      }
    }

    // Apply company filter
    if (filters.company) {
      query = query.eq('company', filters.company);
    }

    // Apply search filter - use more efficient Supabase text search
    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      query = query.or(
        `first_name.ilike.${searchTerm},` +
        `last_name.ilike.${searchTerm},` +
        `email.ilike.${searchTerm},` +
        `company.ilike.${searchTerm},` +
        `position.ilike.${searchTerm}`
      );
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    // Apply ordering
    if (filters.orderBy) {
      query = query.order(filters.orderBy, { ascending: filters.orderDirection !== 'desc' });
    } else {
      query = query.order('updated_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }

    return data as Contact[];
  } catch (error) {
    console.error('Error in getContacts:', error);
    throw error;
  }
};

export const getContactById = async (id: string) => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching contact with id ${id}:`, error);
    throw error;
  }

  return data as Contact;
};

export const createContact = async (contact: Omit<BaseContact, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Validate required fields
    if (!contact.first_name || !contact.last_name || !contact.type || !contact.status) {
      console.error('Missing required fields for contact creation:', { 
        first_name: contact.first_name, 
        last_name: contact.last_name, 
        type: contact.type, 
        status: contact.status 
      });
      throw new Error('Missing required fields for contact creation');
    }

    // Prepare contact data for insertion
    const contactData = { ...contact };
    
    type ContactWithJoinedAt = BaseContact & { joined_at?: string };

    // For member contacts, ensure metadata structure matches the MemberContact interface
    if (contactData.type === 'member') {
      // Ensure metadata exists
      if (!contactData.metadata) contactData.metadata = {};
      
      // Remove any joined_at property for member contacts (not in the schema for members)
      if ((contactData as ContactWithJoinedAt).joined_at) {
        // If join_date is not set in metadata but joined_at exists, copy it
        if (!contactData.metadata.join_date) {
          contactData.metadata.join_date = (contactData as ContactWithJoinedAt).joined_at || null;
        }
        // Remove the joined_at property as it's not in the MemberContact interface
        delete (contactData as ContactWithJoinedAt).joined_at;
      }
    }
    
    console.log('Creating contact with data:', JSON.stringify(contactData, null, 2));
    
    const { data, error } = await supabase
      .from('contacts')
      .insert(contactData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating contact:', error);
      throw error;
    }

    if (!data) {
      console.error('No data returned from contact creation');
      throw new Error('Failed to create contact: No data returned');
    }

    console.log('Contact created successfully:', data.id);
    return data as Contact;
  } catch (error) {
    console.error('Error in createContact function:', error);
    throw error;
  }
};

export const updateContact = async (id: string, contact: Partial<BaseContact>) => {
  try {
    if (!id) {
      console.error('updateContact called with invalid id:', id);
      throw new Error('Invalid contact ID provided for update');
    }
    
    console.log('Updating contact:', id, 'with data:', JSON.stringify(contact, null, 2));
    
    // First get the existing contact to know its type if not provided
    let existingContact: Contact | null = null;
    
    try {
      // Always fetch the existing contact to ensure we have the type
      const { data: existingData, error: fetchError } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        console.error(`Error fetching existing contact with id ${id}:`, fetchError);
        throw fetchError;
      }
      
      existingContact = existingData as Contact;
      if (!existingContact) {
        throw new Error(`Contact with id ${id} not found`);
      }
    } catch (fetchErr) {
      console.error('Failed to fetch existing contact:', fetchErr);
      throw new Error(`Failed to fetch contact with id ${id}: ${fetchErr instanceof Error ? fetchErr.message : 'Unknown error'}`);
    }
    
    // Prepare contact data for update
    const contactData = { ...contact, updated_at: new Date().toISOString() };
    
    // Always use the existing contact type to ensure it's defined
    // This prevents the "Cannot read properties of undefined (reading 'type')" error
    if (!contactData.type && existingContact.type) {
      contactData.type = existingContact.type;
      console.log('Using existing contact type:', existingContact.type);
    }
    
    // For member contacts, ensure joined_at and metadata.join_date are consistent
    if (existingContact.type === 'member') {
      // If we have a joined_at property (from the form), ensure it's also in metadata.join_date
      if ((contactData as any).joined_at) {
        if (!contactData.metadata) contactData.metadata = {};
        contactData.metadata = { ...contactData.metadata, join_date: (contactData as any).joined_at };
      } 
      // If we have metadata.join_date but no joined_at, set joined_at for consistency
      else if (contactData.metadata?.join_date) {
        (contactData as any).joined_at = contactData.metadata.join_date;
      }
    }
    
    // For investor contacts, ensure array fields are properly initialized
    if (existingContact.type === 'investor') {
      // Initialize investor-specific arrays if they don't exist
      // Use type assertion to handle investor-specific fields
      const investorData = contactData as any;
      const existingInvestor = existingContact as any;
      
      if (!('investment_focus' in investorData)) {
        investorData.investment_focus = existingInvestor.investment_focus || [];
      }
      if (!('portfolio_companies' in investorData)) {
        investorData.portfolio_companies = existingInvestor.portfolio_companies || [];
      }
      if (!('preferred_industries' in investorData)) {
        investorData.preferred_industries = existingInvestor.preferred_industries || [];
      }
    }
  
    // Ensure we're not sending any undefined values that could cause issues
    Object.keys(contactData).forEach(key => {
      const typedData = contactData as Record<string, any>;
      if (typedData[key] === undefined) {
        delete typedData[key];
      }
    });
    
    console.log('Updating contact with data:', JSON.stringify(contactData, null, 2));
    
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(contactData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating contact with id ${id}:`, error);
        throw error;
      }

      if (!data) {
        console.error('No data returned from contact update');
        throw new Error('Failed to update contact: No data returned');
      }

      console.log('Contact updated successfully:', data.id);
      return data as Contact;
    } catch (updateErr) {
      console.error('Error during Supabase update operation:', updateErr);
      throw new Error(`Failed to update contact: ${updateErr instanceof Error ? updateErr.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error in updateContact function:', error);
    throw error;
  }
};

export const deleteContact = async (id: string) => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting contact with id ${id}:`, error);
    throw error;
  }

  return true;
};

export const getContactsByType = async (type: ContactType, filters: Omit<ContactFilters, 'type'> = {}) => {
  return getContacts({ ...filters, type });
};

export const getContactStatsByType = async () => {
  try {
    // Use a simpler approach with multiple queries instead of group by
    const types: ContactType[] = ['member', 'board-member', 'external', 'freelance', 'network', 'partner', 'waitlist', 'blacklist', 'lead', 'client', 'investor'];
    
    const statsPromises = types.map(async (type) => {
      const { count, error } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('type', type);
        
      if (error) {
        console.error(`Error fetching count for ${type}:`, error);
        return { type, count: 0 };
      }
      
      return { type, count: count || 0 };
    });
    
    const stats = await Promise.all(statsPromises);
    return stats as Array<{ type: ContactType; count: number }>;
  } catch (err) {
    console.error('Error in getContactStatsByType:', err);
    return [] as Array<{ type: ContactType; count: number }>;
  }
};

export const getContactStatsByStatus = async (type?: ContactType) => {
  try {
    // Use raw SQL query with Supabase to get grouped stats
    // This avoids TypeScript errors with the .group() method
    const query = supabase
      .rpc('get_contact_status_stats', { 
        type_filter: type || null 
      });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching contact status stats:', error);
      throw error;
    }

    return data as Array<{ status: string; count: number }>;
  } catch (err) {
    console.error('Error in getContactStatsByStatus:', err);
    return [] as Array<{ status: string; count: number }>;
  }
};

// Export all functions as a single service object
export const contactService = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getContactsByType,
  getContactStatsByType,
  getContactStatsByStatus,
  addContact: createContact, // Alias for createContact for better semantics
};
