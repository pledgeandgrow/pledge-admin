import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Campaign, CampaignStatus, CampaignType, CampaignObjective } from '@/types/data';

const supabase = createClient();

interface CampaignFilters {
  status?: CampaignStatus | CampaignStatus[];
  type?: CampaignType | CampaignType[];
  objective?: CampaignObjective | CampaignObjective[];
  search?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Custom hook for managing campaigns with Supabase integration
 */
export const useCampaigns = (initialFilters: CampaignFilters = {}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<CampaignFilters>(initialFilters);
  const [totalCount, setTotalCount] = useState<number>(0);

  /**
   * Fetch campaigns based on filters
   */
  const fetchCampaigns = useCallback(async (campaignFilters: CampaignFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('campaigns')
        .select('*', { count: 'exact' });

      // Apply status filter
      if (campaignFilters.status) {
        if (Array.isArray(campaignFilters.status)) {
          query = query.in('status', campaignFilters.status);
        } else {
          query = query.eq('status', campaignFilters.status);
        }
      }

      // Apply type filter
      if (campaignFilters.type) {
        if (Array.isArray(campaignFilters.type)) {
          query = query.in('campaign_type', campaignFilters.type);
        } else {
          query = query.eq('campaign_type', campaignFilters.type);
        }
      }

      // Apply objective filter
      if (campaignFilters.objective) {
        if (Array.isArray(campaignFilters.objective)) {
          query = query.in('objective', campaignFilters.objective);
        } else {
          query = query.eq('objective', campaignFilters.objective);
        }
      }

      // Apply search filter
      if (campaignFilters.search) {
        const searchTerm = `%${campaignFilters.search}%`;
        query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`);
      }

      // Apply date filters
      if (campaignFilters.startDateFrom) {
        query = query.gte('start_date', campaignFilters.startDateFrom);
      }
      if (campaignFilters.startDateTo) {
        query = query.lte('start_date', campaignFilters.startDateTo);
      }
      if (campaignFilters.endDateFrom) {
        query = query.gte('end_date', campaignFilters.endDateFrom);
      }
      if (campaignFilters.endDateTo) {
        query = query.lte('end_date', campaignFilters.endDateTo);
      }

      // Apply pagination
      if (campaignFilters.limit) {
        query = query.limit(campaignFilters.limit);
      }
      if (campaignFilters.offset) {
        query = query.range(
          campaignFilters.offset,
          campaignFilters.offset + (campaignFilters.limit || 10) - 1
        );
      }

      // Apply ordering
      if (campaignFilters.orderBy) {
        query = query.order(campaignFilters.orderBy, {
          ascending: campaignFilters.orderDirection !== 'desc',
        });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      setCampaigns(data as Campaign[]);
      if (count !== null) {
        setTotalCount(count);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Get a campaign by ID
   */
  const getCampaignById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as Campaign;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error(`Error fetching campaign with id ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new campaign
   */
  const createCampaign = useCallback(async (campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      // Add timestamps
      const newCampaign = {
        ...campaign,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('campaigns')
        .insert(newCampaign)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setCampaigns(prev => [data as Campaign, ...prev]);
      
      return data as Campaign;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error creating campaign:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing campaign
   */
  const updateCampaign = useCallback(async (id: string, updates: Partial<Campaign>) => {
    setLoading(true);
    setError(null);
    try {
      // Add updated timestamp
      const campaignUpdates = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('campaigns')
        .update(campaignUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setCampaigns(prev =>
        prev.map(campaign => (campaign.id === id ? { ...campaign, ...data } as Campaign : campaign))
      );

      return data as Campaign;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error(`Error updating campaign with id ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a campaign
   */
  const deleteCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error(`Error deleting campaign with id ${id}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update filters and refetch campaigns
   */
  const updateFilters = useCallback((newFilters: CampaignFilters) => {
    setFilters(prev => {
      const updatedFilters = { ...prev, ...newFilters };
      fetchCampaigns(updatedFilters);
      return updatedFilters;
    });
  }, [fetchCampaigns]);

  // Fetch campaigns on component mount or when filters change
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    error,
    totalCount,
    filters,
    updateFilters,
    fetchCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
};

export default useCampaigns;
