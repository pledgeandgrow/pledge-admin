'use client';

import { create } from 'zustand';
import { Client } from '@/types/commercial';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

interface ClientStore {
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  getClient: (id: string) => Promise<Client | null>;
  addClient: (client: Omit<Client, 'id' | 'created_at'>) => Promise<Client | null>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<Client | null>;
  deleteClient: (id: string) => Promise<boolean>;
  checkTableStructure: () => Promise<void>;
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  loading: false,
  error: null,

  fetchClients: async () => {
    console.log('Fetching clients...');
    set({ loading: true, error: null });
    try {
      const { data, error, count } = await supabase
        .from('client')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('Fetched clients:', { data, error, count });

      if (error) {
        console.error('Error in fetchClients:', error);
        throw error;
      }
      
      set({ clients: data || [] });
      console.log('Updated clients in store:', data?.length || 0);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch clients';
      console.error('Error in fetchClients:', error);
      set({ error: errorMessage });
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      set({ loading: false });
    }
  },

  getClient: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('client')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      return null;
    }
  },

  addClient: async (client) => {
    console.log('1. Starting addClient with:', JSON.stringify(client, null, 2));
    
    try {
      // Prepare the client data
      const clientData = {
        ...client,
        is_company: Boolean(client.is_company),
        name: client.is_company ? String(client.company_name || '') : String(client.name || ''),
        status: 'Active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('2. Prepared client data:', JSON.stringify(clientData, null, 2));
      
      // Log the Supabase configuration being used
      console.log('3. Supabase config:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
             `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...` : 'Not found'
      });
      
      // Test connection by fetching client count
      console.log('4. Testing Supabase connection...');
      const { count, error: countError } = await supabase
        .from('client')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Supabase connection test failed:', countError);
        throw new Error(`Database connection error: ${countError.message}`);
      }
      console.log(`5. Supabase connection successful. Current client count: ${count}`);
      
      // Prepare the insert query
      const insertQuery = supabase
        .from('client')
        .insert([clientData])
        .select()
        .single();
      
      console.log('6. Executing insert query...');
      const { data, error } = await insertQuery;
      
      console.log('7. Insert response:', { data, error });
      
      if (error) {
        console.error('Supabase insert error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Try a raw SQL insert as a fallback
        console.log('8. Attempting raw SQL insert as fallback...');
        const { data: sqlData, error: sqlError } = await supabase.rpc('insert_client', {
          client_data: clientData
        });
        
        if (sqlError) {
          console.error('Raw SQL insert failed:', sqlError);
          throw new Error(`Failed to add client (SQL fallback): ${sqlError.message}`);
        }
        
        console.log('9. Raw SQL insert successful:', sqlData);
        await get().fetchClients();
        return sqlData;
      }
      
      if (!data) {
        throw new Error('No data returned from insert operation');
      }
      
      console.log('10. Client added successfully, refreshing list...');
      await get().fetchClients();
      
      console.log('11. Fetch clients completed');
      
      toast({
        title: 'Succès',
        description: 'Client ajouté avec succès',
      });
      
      return data;
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'ajout du client',
        variant: 'destructive',
      });
      return null;
    }
  },

  updateClient: async (id, updates) => {
    try {
      console.log('Updating client:', id, updates);
      const { data, error } = await supabase
        .from('client')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await get().fetchClients(); // Refresh the list
      return data;
    } catch (error) {
      console.error(`Error updating client ${id}:`, error);
      return null;
    }
  },

  deleteClient: async (id) => {
    try {
      const { error } = await supabase
        .from('client')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchClients(); // Refresh the list
      return true;
    } catch (error) {
      console.error(`Error deleting client ${id}:`, error);
      return false;
    }
  },

  checkTableStructure: async () => {
    try {
      console.log('Checking table structure...');
      
      // Check if table exists
      const { data: tableInfo, error: tableError } = await supabase
        .rpc('get_table_info', { table_name: 'client' })
        .single();
      
      if (tableError) {
        console.error('Table check error:', tableError);
        // Table might not exist, let's create it
        console.log('Attempting to create client table...');
        const { error: createError } = await supabase.rpc('create_client_table');
        
        if (createError) {
          console.error('Failed to create table:', createError);
          throw new Error('Failed to initialize client table');
        }
        console.log('Client table created successfully');
        return;
      }
      
      console.log('Table structure:', tableInfo);
    } catch (error) {
      console.error('Error checking table structure:', error);
      throw error;
    }
  },
}));