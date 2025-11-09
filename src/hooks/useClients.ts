import { useState, useEffect, useCallback } from 'react';
import { createClient as createSupabaseClient } from '@/lib/supabase';

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  type: 'client';
  status: string;
  notes?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  
  // Client-specific fields
  client_since?: string;
  first_contact_date?: string;
  last_purchase_date?: string;
  total_spent?: number;
  service?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

interface ClientFilters {
  status?: string | string[];
  client_since_from?: string;
  client_since_to?: string;
  total_spent_min?: number;
  total_spent_max?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

interface UseClientsOptions {
  initialFilters?: ClientFilters;
  autoFetch?: boolean;
}

export const useClients = (options?: UseClientsOptions) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOperating, setIsOperating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  const fetchClients = useCallback(async (filters?: ClientFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      // Merge options.initialFilters with provided filters
      const mergedFilters: ClientFilters = {
        ...(options?.initialFilters || {}),
        ...(filters || {}),
      };

      console.log('🔵 Fetching clients with filters:', mergedFilters);

      // Start building the query - always filter by type='client'
      let query = supabase
        .from('contacts')
        .select('*')
        .eq('type', 'client');

      // Apply status filter
      if (mergedFilters.status) {
        if (Array.isArray(mergedFilters.status)) {
          query = query.in('status', mergedFilters.status);
        } else {
          query = query.eq('status', mergedFilters.status);
        }
      }

      // Apply client_since date range filters
      if (mergedFilters.client_since_from) {
        query = query.gte('client_since', mergedFilters.client_since_from);
      }
      if (mergedFilters.client_since_to) {
        query = query.lte('client_since', mergedFilters.client_since_to);
      }

      // Apply total_spent range filters
      if (mergedFilters.total_spent_min !== undefined) {
        query = query.gte('total_spent', mergedFilters.total_spent_min);
      }
      if (mergedFilters.total_spent_max !== undefined) {
        query = query.lte('total_spent', mergedFilters.total_spent_max);
      }

      // Apply ordering
      const orderBy = mergedFilters.orderBy || 'updated_at';
      const orderDirection = mergedFilters.orderDirection || 'desc';
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      console.log('✅ Fetched clients:', data?.length || 0);
      setClients(data || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch clients');
      console.error('❌ Error fetching clients:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, options?.initialFilters]);

  const createClient = useCallback(async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsOperating(true);
      setError(null);

      console.log('🔵 Creating client:', client);

      // Ensure type is 'client'
      const clientData = { ...client, type: 'client' as const };

      const { data, error } = await supabase
        .from('contacts')
        .insert(clientData)
        .select()
        .single();

      if (error) {
        console.error('🔴 Supabase insert error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('✅ Client created successfully:', data);
      setClients(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create client');
      console.error('❌ Error creating client:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsOperating(false);
    }
  }, [supabase]);

  const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
    try {
      setIsOperating(true);
      setError(null);

      console.log('🔵 Updating client:', id, updates);

      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .eq('type', 'client')
        .select()
        .single();

      if (error) {
        console.error('🔴 Supabase update error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('✅ Client updated successfully:', data);
      setClients(prev => prev.map(client => client.id === id ? data : client));
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update client');
      console.error('❌ Error updating client:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsOperating(false);
    }
  }, [supabase]);

  const deleteClient = useCallback(async (id: string) => {
    try {
      setIsOperating(true);
      setError(null);

      console.log('🔵 Deleting client:', id);

      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
        .eq('type', 'client');

      if (error) {
        console.error('🔴 Supabase delete error:', error);
        throw error;
      }

      console.log('✅ Client deleted successfully');
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete client');
      console.error('❌ Error deleting client:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsOperating(false);
    }
  }, [supabase]);

  const getClientStatistics = useCallback(() => {
    const stats = {
      total: clients.length,
      byStatus: {} as Record<string, number>,
      totalRevenue: 0,
      averageSpent: 0,
      topClients: [] as Client[],
      recentClients: [] as Client[],
    };

    clients.forEach(client => {
      // Count by status
      stats.byStatus[client.status] = (stats.byStatus[client.status] || 0) + 1;
      
      // Sum total revenue
      if (client.total_spent) {
        stats.totalRevenue += client.total_spent;
      }
    });

    // Calculate average spent
    const clientsWithSpending = clients.filter(c => c.total_spent && c.total_spent > 0);
    if (clientsWithSpending.length > 0) {
      stats.averageSpent = stats.totalRevenue / clientsWithSpending.length;
    }

    // Get top 5 clients by spending
    stats.topClients = [...clients]
      .filter(c => c.total_spent && c.total_spent > 0)
      .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
      .slice(0, 5);

    // Get 5 most recent clients
    stats.recentClients = [...clients]
      .filter(c => c.client_since)
      .sort((a, b) => {
        const dateA = a.client_since ? new Date(a.client_since).getTime() : 0;
        const dateB = b.client_since ? new Date(b.client_since).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);

    return stats;
  }, [clients]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchClients(options?.initialFilters);
    }
  }, []);

  return {
    clients,
    isLoading,
    isOperating,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    getClientStatistics,
  };
};

export default useClients;
