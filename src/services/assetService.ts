import { createClient } from '@/lib/supabase';
import { Asset, AssetType, AssetStatus, AssetStatistics } from '@/types/assets';

// Initialize Supabase client
const supabase = createClient();

// Asset service functions
export const assetService = {
  // Get all assets
  getAllAssets: async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching all assets:', err);
      return [];
    }
  },

  // Get assets by type
  getAssetsByType: async (type: AssetType) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`Error fetching ${type} assets:`, err);
      return [];
    }
  },

  // Get physical assets
  getPhysicalAssets: async () => {
    return assetService.getAssetsByType('physical');
  },

  // Get digital assets
  getDigitalAssets: async () => {
    return assetService.getAssetsByType('digital');
  },

  // Get asset by ID
  getAssetById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching asset by ID:', err);
      return null;
    }
  },

  // Create a new asset
  createAsset: async (asset: Asset) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert(asset)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating asset:', err);
      return null;
    }
  },

  // Update an existing asset
  updateAsset: async (id: string, asset: Partial<Asset>) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .update(asset)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating asset:', err);
      return null;
    }
  },

  // Delete an asset
  deleteAsset: async (id: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting asset:', err);
      return false;
    }
  },

  // Get asset statistics
  getAssetStatistics: async () => {
    try {
      const { data: assets, error } = await supabase
        .from('assets')
        .select('*');
      
      if (error) throw error;
      
      const statistics: AssetStatistics = {
        total: assets.length,
        active: assets.filter(asset => asset.status === 'active').length,
        expired: assets.filter(asset => asset.status === 'expired').length,
        pending: assets.filter(asset => asset.status === 'pending').length,
        archived: assets.filter(asset => asset.status === 'archived').length,
        totalValue: assets.reduce((sum, asset) => sum + (asset.value || 0), 0),
        byType: {
          physical: assets.filter(asset => asset.type === 'physical').length,
          digital: assets.filter(asset => asset.type === 'digital').length
        }
      };
      
      return statistics;
    } catch (err) {
      console.error('Error fetching asset statistics:', err);
      return {
        total: 0,
        active: 0,
        expired: 0,
        pending: 0,
        archived: 0,
        totalValue: 0,
        byType: {
          physical: 0,
          digital: 0
        }
      };
    }
  },

  // Search assets by query
  searchAssets: async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error searching assets:', err);
      return [];
    }
  }
};

export default assetService;
