import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  type: 'lead';
  status: string;
  notes?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  
  // Lead-specific fields
  lead_source?: string;
  lead_score?: number;
  source?: string;
  probability?: number;
  estimated_value?: number;
  last_contacted_at?: string;
  next_follow_up?: string;
  added_by?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

interface LeadFilters {
  status?: string | string[];
  lead_source?: string;
  probability_min?: number;
  probability_max?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

interface UseLeadsOptions {
  initialFilters?: LeadFilters;
  autoFetch?: boolean;
}

export const useLeads = (options?: UseLeadsOptions) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOperating, setIsOperating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchLeads = useCallback(async (filters?: LeadFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      // Merge options.initialFilters with provided filters
      const mergedFilters: LeadFilters = {
        ...(options?.initialFilters || {}),
        ...(filters || {}),
      };

      console.log('🔵 Fetching leads with filters:', mergedFilters);

      // Start building the query - always filter by type='lead'
      let query = supabase
        .from('contacts')
        .select('*')
        .eq('type', 'lead');

      // Apply status filter
      if (mergedFilters.status) {
        if (Array.isArray(mergedFilters.status)) {
          query = query.in('status', mergedFilters.status);
        } else {
          query = query.eq('status', mergedFilters.status);
        }
      }

      // Apply lead_source filter
      if (mergedFilters.lead_source) {
        query = query.eq('lead_source', mergedFilters.lead_source);
      }

      // Apply probability range filters
      if (mergedFilters.probability_min !== undefined) {
        query = query.gte('probability', mergedFilters.probability_min);
      }
      if (mergedFilters.probability_max !== undefined) {
        query = query.lte('probability', mergedFilters.probability_max);
      }

      // Apply ordering
      const orderBy = mergedFilters.orderBy || 'updated_at';
      const orderDirection = mergedFilters.orderDirection || 'desc';
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      console.log('✅ Fetched leads:', data?.length || 0);
      setLeads(data || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch leads');
      console.error('❌ Error fetching leads:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, options?.initialFilters]);

  const createLead = useCallback(async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsOperating(true);
      setError(null);

      console.log('🔵 Creating lead:', lead);

      // Ensure type is 'lead'
      const leadData = { ...lead, type: 'lead' as const };

      const { data, error } = await supabase
        .from('contacts')
        .insert(leadData)
        .select()
        .single();

      if (error) {
        console.error('🔴 Supabase insert error:', error);
        throw error;
      }

      console.log('✅ Lead created successfully:', data);
      setLeads(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create lead');
      console.error('❌ Error creating lead:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsOperating(false);
    }
  }, [supabase]);

  const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
    try {
      setIsOperating(true);
      setError(null);

      console.log('🔵 Updating lead:', id, updates);

      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .eq('type', 'lead')
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

      console.log('✅ Lead updated successfully:', data);
      setLeads(prev => prev.map(lead => lead.id === id ? data : lead));
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update lead');
      console.error('❌ Error updating lead:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsOperating(false);
    }
  }, [supabase]);

  const deleteLead = useCallback(async (id: string) => {
    try {
      setIsOperating(true);
      setError(null);

      console.log('🔵 Deleting lead:', id);

      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
        .eq('type', 'lead');

      if (error) {
        console.error('🔴 Supabase delete error:', error);
        throw error;
      }

      console.log('✅ Lead deleted successfully');
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete lead');
      console.error('❌ Error deleting lead:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsOperating(false);
    }
  }, [supabase]);

  const getLeadStatistics = useCallback(() => {
    const stats = {
      total: leads.length,
      byStatus: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      averageProbability: 0,
      totalEstimatedValue: 0,
      highProbability: leads.filter(l => (l.probability || 0) >= 70).length,
    };

    leads.forEach(lead => {
      // Count by status
      stats.byStatus[lead.status] = (stats.byStatus[lead.status] || 0) + 1;
      
      // Count by source
      if (lead.lead_source) {
        stats.bySource[lead.lead_source] = (stats.bySource[lead.lead_source] || 0) + 1;
      }
      
      // Sum estimated values
      if (lead.estimated_value) {
        stats.totalEstimatedValue += lead.estimated_value;
      }
    });

    // Calculate average probability
    const leadsWithProbability = leads.filter(l => l.probability !== undefined && l.probability !== null);
    if (leadsWithProbability.length > 0) {
      stats.averageProbability = leadsWithProbability.reduce((sum, l) => sum + (l.probability || 0), 0) / leadsWithProbability.length;
    }

    return stats;
  }, [leads]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchLeads(options?.initialFilters);
    }
  }, []);

  return {
    leads,
    isLoading,
    isOperating,
    error,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    getLeadStatistics,
  };
};

export default useLeads;
