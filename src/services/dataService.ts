import { createClient } from '@/lib/supabase';
import { Data, DataType, DataStatistics } from '@/types/data';

// Initialize Supabase client
const supabase = createClient();

// Data service functions
export const dataService = {
  // Get all data entries
  getAllData: async () => {
    try {
      const { data, error } = await supabase
        .from('data')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching all data:', err);
      return [];
    }
  },

  // Get data by type
  getDataByType: async (type: DataType) => {
    try {
      const { data, error } = await supabase
        .from('data')
        .select('*')
        .eq('data_type', type)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`Error fetching ${type} data:`, err);
      return [];
    }
  },

  // Get data by category
  getDataByCategory: async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('data')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`Error fetching data for category ${category}:`, err);
      return [];
    }
  },

  // Get published data
  getPublishedData: async () => {
    try {
      const { data, error } = await supabase
        .from('data')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching published data:', err);
      return [];
    }
  },

  // Get data by ID
  getDataById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('data')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching data by ID:', err);
      return null;
    }
  },

  // Get data by slug
  getDataBySlug: async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('data')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching data by slug:', err);
      return null;
    }
  },

  // Create a new data entry
  createData: async (dataEntry: Data) => {
    try {
      // Generate slug if not provided
      if (!dataEntry.slug && dataEntry.title) {
        dataEntry.slug = dataEntry.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }

      const { data, error } = await supabase
        .from('data')
        .insert(dataEntry)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating data entry:', err);
      return null;
    }
  },

  // Update an existing data entry
  updateData: async (id: string, dataEntry: Partial<Data>) => {
    try {
      // Update slug if title changed and slug not explicitly provided
      if (dataEntry.title && !dataEntry.slug) {
        dataEntry.slug = dataEntry.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }

      const { data, error } = await supabase
        .from('data')
        .update(dataEntry)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating data entry:', err);
      return null;
    }
  },

  // Publish a data entry
  publishData: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('data')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error publishing data entry:', err);
      return null;
    }
  },

  // Archive a data entry
  archiveData: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('data')
        .update({
          status: 'archived'
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error archiving data entry:', err);
      return null;
    }
  },

  // Delete a data entry
  deleteData: async (id: string) => {
    try {
      const { error } = await supabase
        .from('data')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting data entry:', err);
      return false;
    }
  },

  // Search data entries
  searchData: async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('data')
        .select('*')
        .textSearch('search_vector', query)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error searching data:', err);
      
      // Fallback to basic search if full-text search fails
      try {
        const { data, error } = await supabase
          .from('data')
          .select('*')
          .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (fallbackErr) {
        console.error('Error in fallback search:', fallbackErr);
        return [];
      }
    }
  },

  // Get data statistics
  getDataStatistics: async () => {
    try {
      const { data: entries, error } = await supabase
        .from('data')
        .select('*');
      
      if (error) throw error;
      
      // Initialize type and category counts
      const typeCount: Record<string, number> = {};
      const categoryCount: Record<string, number> = {};
      
      // Count entries by type and category
      entries.forEach(entry => {
        // Count by type
        if (entry.data_type) {
          typeCount[entry.data_type] = (typeCount[entry.data_type] || 0) + 1;
        }
        
        // Count by category
        if (entry.category) {
          categoryCount[entry.category] = (categoryCount[entry.category] || 0) + 1;
        }
      });
      
      const statistics: DataStatistics = {
        total: entries.length,
        published: entries.filter(entry => entry.status === 'published').length,
        draft: entries.filter(entry => entry.status === 'draft').length,
        archived: entries.filter(entry => entry.status === 'archived').length,
        byType: typeCount,
        byCategory: categoryCount,
        publicCount: entries.filter(entry => entry.is_public === true).length,
        privateCount: entries.filter(entry => entry.visibility_level === 'private').length,
        restrictedCount: entries.filter(entry => entry.visibility_level === 'restricted').length
      };
      
      return statistics;
    } catch (err) {
      console.error('Error fetching data statistics:', err);
      return {
        total: 0,
        published: 0,
        draft: 0,
        archived: 0,
        byType: {},
        byCategory: {},
        publicCount: 0,
        privateCount: 0,
        restrictedCount: 0
      };
    }
  }
};

export default dataService;
