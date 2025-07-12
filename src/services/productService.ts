import { createClient } from '@/lib/supabase';
import { Product, ProductType, ProductStatus, ProductStatistics } from '@/types/products';

// Initialize Supabase client
const supabase = createClient();

// Product service functions
export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching all products:', err);
      return [];
    }
  },

  // Get products by type
  getProductsByType: async (type: ProductType) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`Error fetching ${type} products:`, err);
      return [];
    }
  },

  // Get product by ID
  getProductById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      return null;
    }
  },

  // Create a new product
  createProduct: async (product: Product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating product:', err);
      return null;
    }
  },

  // Update an existing product
  updateProduct: async (id: string, product: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating product:', err);
      return null;
    }
  },

  // Delete a product
  deleteProduct: async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      return false;
    }
  },

  // Get product statistics
  getProductStatistics: async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      
      // Initialize counts for each product type
      const typeCount: Record<ProductType, number> = {
        service: 0,
        package: 0,
        membership: 0,
        software: 0,
        tool: 0,
        hardware: 0
      };
      
      // Count products by type
      products.forEach(product => {
        if (product.type in typeCount) {
          typeCount[product.type as ProductType]++;
        }
      });
      
      const statistics: ProductStatistics = {
        total: products.length,
        active: products.filter(product => product.status === 'active').length,
        discontinued: products.filter(product => product.status === 'discontinued').length,
        draft: products.filter(product => product.status === 'draft').length,
        archived: products.filter(product => product.status === 'archived').length,
        totalRevenue: products.reduce((sum, product) => sum + (product.price || 0), 0),
        totalCost: products.reduce((sum, product) => sum + (product.cost || 0), 0),
        profitMargin: 0, // Will calculate below
        byType: typeCount
      };
      
      // Calculate profit margin if there's revenue
      if (statistics.totalRevenue > 0) {
        statistics.profitMargin = ((statistics.totalRevenue - statistics.totalCost) / statistics.totalRevenue) * 100;
      }
      
      return statistics;
    } catch (err) {
      console.error('Error fetching product statistics:', err);
      return {
        total: 0,
        active: 0,
        discontinued: 0,
        draft: 0,
        archived: 0,
        totalRevenue: 0,
        totalCost: 0,
        profitMargin: 0,
        byType: {
          service: 0,
          package: 0,
          membership: 0,
          software: 0,
          tool: 0,
          hardware: 0
        }
      };
    }
  },

  // Search products by query
  searchProducts: async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,supplier_name.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error searching products:', err);
      return [];
    }
  },

  async getPrestations() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('type', 'service');

      if (error) {
        console.error('Error fetching prestations:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error fetching prestations:', error);
      return [];
    }
  },

  async getPackages() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('type', 'package');

      if (error) {
        console.error('Error fetching packages:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      return [];
    }
  }
};

export default productService;
