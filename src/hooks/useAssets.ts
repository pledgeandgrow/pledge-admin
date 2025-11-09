import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Asset, AssetType, AssetStatus } from '@/types/assets';
import { toast } from '@/components/ui/use-toast';

interface AssetFilters {
  type?: AssetType | AssetType[];
  status?: AssetStatus | AssetStatus[];
  search?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minValue?: number;
  maxValue?: number;
  fromDate?: string;
  toDate?: string;
}

interface UseAssetsOptions {
  type?: AssetType;
  initialFilters?: AssetFilters;
  autoFetch?: boolean;
}

interface UseAssetsReturn {
  assets: Asset[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  fetchAssets: (filters?: AssetFilters) => Promise<void>;
  createAsset: (asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) => Promise<Asset | null>;
  updateAsset: (id: string, asset: Partial<Asset>) => Promise<Asset | null>;
  deleteAsset: (id: string) => Promise<boolean>;
  filters: AssetFilters;
  setFilters: (filters: AssetFilters) => void;
  refetch: () => Promise<void>;
}

export const useAssets = (options: UseAssetsOptions = {}): UseAssetsReturn => {
  const { type, initialFilters = {}, autoFetch = true } = options;
  const supabase = createClient();
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filters, setFilters] = useState<AssetFilters>({
    ...initialFilters,
    type: type || initialFilters.type,
  });

  const fetchAssets = useCallback(async (newFilters?: AssetFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedFilters = newFilters ? { ...filters, ...newFilters } : filters;
      
      // Fetch assets with the current filters
      let data: Asset[] = [];
      
      let query = supabase.from('assets').select('*');
      
      if (mergedFilters.type) {
        const assetType = Array.isArray(mergedFilters.type) 
          ? mergedFilters.type[0]
          : mergedFilters.type;
        query = query.eq('type', assetType);
      }
      
      const { data: fetchedData, error: fetchError } = await query.order('created_at', { ascending: false });
      if (fetchError) {throw fetchError;}
      data = fetchedData || [];
      
      // Apply additional filters client-side
      let filteredData = [...data];
      
      // Status filter
      if (mergedFilters.status) {
        const statusFilters = Array.isArray(mergedFilters.status) 
          ? mergedFilters.status 
          : [mergedFilters.status];
        filteredData = filteredData.filter(asset => 
          statusFilters.includes(asset.status)
        );
      }
      
      // Search filter
      if (mergedFilters.search) {
        const searchTerm = mergedFilters.search.toLowerCase();
        filteredData = filteredData.filter(asset => 
          asset.name.toLowerCase().includes(searchTerm) ||
          (asset.description && asset.description.toLowerCase().includes(searchTerm)) ||
          (asset.location && asset.location.toLowerCase().includes(searchTerm))
        );
      }
      
      // Tags filter
      if (mergedFilters.tags && mergedFilters.tags.length > 0) {
        filteredData = filteredData.filter(asset => 
          asset.tags && mergedFilters.tags?.some(tag => asset.tags?.includes(tag))
        );
      }
      
      // Value range filter
      if (mergedFilters.minValue !== undefined || mergedFilters.maxValue !== undefined) {
        filteredData = filteredData.filter(asset => {
          if (!asset.value) {return false;}
          
          const value = Number(asset.value);
          if (isNaN(value)) {return false;}
          
          if (mergedFilters.minValue !== undefined && value < mergedFilters.minValue) {return false;}
          if (mergedFilters.maxValue !== undefined && value > mergedFilters.maxValue) {return false;}
          
          return true;
        });
      }
      
      // Date range filter
      if (mergedFilters.fromDate || mergedFilters.toDate) {
        filteredData = filteredData.filter(asset => {
          if (!asset.acquisition_date) {return false;}
          
          const acquisitionDate = new Date(asset.acquisition_date);
          
          if (mergedFilters.fromDate) {
            const fromDate = new Date(mergedFilters.fromDate);
            if (acquisitionDate < fromDate) {return false;}
          }
          
          if (mergedFilters.toDate) {
            const toDate = new Date(mergedFilters.toDate);
            if (acquisitionDate > toDate) {return false;}
          }
          
          return true;
        });
      }
      
      // Sort
      if (mergedFilters.sortBy) {
        const sortField = mergedFilters.sortBy as keyof Asset;
        const sortOrder = mergedFilters.sortOrder === 'desc' ? -1 : 1;
        
        filteredData.sort((a, b) => {
          const valueA = a[sortField];
          const valueB = b[sortField];
          
          if (valueA === undefined && valueB === undefined) {return 0;}
          if (valueA === undefined) {return 1 * sortOrder;}
          if (valueB === undefined) {return -1 * sortOrder;}
          
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return sortOrder * valueA.localeCompare(valueB);
          }
          
          if (valueA < valueB) {return -1 * sortOrder;}
          if (valueA > valueB) {return 1 * sortOrder;}
          return 0;
        });
      }
      
      // Pagination
      const totalItems = filteredData.length;
      setTotalCount(totalItems);
      
      if (mergedFilters.limit) {
        const offset = mergedFilters.offset || 0;
        filteredData = filteredData.slice(offset, offset + mergedFilters.limit);
      }
      
      setAssets(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refetch = useCallback(() => fetchAssets(), [fetchAssets]);

  const createAsset = useCallback(async (asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Validate required fields
      if (!asset.name || !asset.type || !asset.status) {
        const error = new Error('Missing required fields for asset creation');
        console.error('Validation error in useAssets:', error, { asset });
        setError(error);
        throw error;
      }

      const { data, error: err } = await supabase.from('assets').insert(asset).select().single();
      if (err) {throw err;}
      
      if (!data) {
        const error = new Error('Failed to create asset: Invalid response');
        setError(error);
        throw error;
      }
      
      // Update local state
      setAssets(prev => [data, ...prev]);
      
      toast({
        title: "Asset créé",
        description: `L'asset ${data.name} a été créé avec succès`,
      });
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create asset');
      setError(error);
      
      toast({
        title: "Erreur",
        description: `Impossible de créer l'asset: ${error.message}`,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [supabase]);

  const updateAsset = useCallback(async (id: string, assetUpdate: Partial<Asset>) => {
    try {
      const { data, error: err } = await supabase.from('assets').update(assetUpdate).eq('id', id).select().single();
      if (err) {throw err;}
      
      if (!data) {
        const error = new Error('Failed to update asset: Invalid response');
        setError(error);
        throw error;
      }
      
      // Update local state
      setAssets(prev => 
        prev.map(a => a.id === id ? { ...a, ...data } : a)
      );
      
      toast({
        title: "Asset mis à jour",
        description: `L'asset ${data.name} a été mis à jour avec succès`,
      });
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update asset');
      setError(error);
      
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour l'asset: ${error.message}`,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [supabase]);

  const deleteAsset = useCallback(async (id: string) => {
    try {
      const { error: err } = await supabase.from('assets').delete().eq('id', id);
      if (err) {throw err;}
      const success = true;
      
      if (!success) {
        const error = new Error('Failed to delete asset');
        setError(error);
        throw error;
      }
      
      // Update local state
      setAssets(prev => prev.filter(a => a.id !== id));
      
      toast({
        title: "Asset supprimé",
        description: "L'asset a été supprimé avec succès",
      });
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete asset');
      setError(error);
      
      toast({
        title: "Erreur",
        description: `Impossible de supprimer l'asset: ${error.message}`,
        variant: "destructive",
      });
      
      throw error;
    }
  }, []);

  // Fetch assets on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchAssets();
    }
  }, [autoFetch, fetchAssets]);

  return {
    assets,
    loading,
    error,
    totalCount,
    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    filters,
    setFilters,
    refetch,
  };
};

export default useAssets;
