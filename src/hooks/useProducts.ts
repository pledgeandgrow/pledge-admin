import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Product, ProductType, ProductStatus } from '@/types/products';
import { toast } from '@/components/ui/use-toast';
import { retryWithBackoff } from '@/lib/supabase';
// Removed unused import: import { v4 as uuidv4 } from 'uuid';

interface ProductFilters {
  type?: ProductType | ProductType[];
  status?: ProductStatus | ProductStatus[];
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: keyof Product;
  sortOrder?: 'asc' | 'desc';
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
}

interface UseProductsOptions {
  type?: ProductType | ProductType[];
  initialFilters?: ProductFilters;
  autoFetch?: boolean;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  createProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  refetch: () => Promise<void>;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
  const { type, initialFilters = {}, autoFetch = true } = options;
  const supabase = createClient();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filters, setFilters] = useState<ProductFilters>({
    ...initialFilters,
    type: type || initialFilters.type,
  });

  const fetchProducts = useCallback(async (newFilters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedFilters = newFilters ? { ...filters, ...newFilters } : filters;
      
      // Fetch products with the current filters
      let data: Product[] = [];
      
      await retryWithBackoff(async () => {
        let query = supabase.from('products').select('*');
        
        if (mergedFilters.type) {
          const productType = Array.isArray(mergedFilters.type) 
            ? mergedFilters.type[0]
            : mergedFilters.type;
          query = query.eq('type', productType);
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data: fetchedData, error: fetchError } = await query;
        if (fetchError) {throw fetchError;}
        data = fetchedData || [];
      }, 3, 1000);
      
      // Apply additional filters client-side
      let filteredData = [...data];
      
      // Status filter
      if (mergedFilters.status) {
        const statusFilters = Array.isArray(mergedFilters.status) 
          ? mergedFilters.status 
          : [mergedFilters.status];
        filteredData = filteredData.filter(product => 
          statusFilters.includes(product.status)
        );
      }
      
      // Tags filter
      if (mergedFilters.tags && mergedFilters.tags.length > 0) {
        filteredData = filteredData.filter(product => 
          product.tags && mergedFilters.tags?.some(tag => product.tags?.includes(tag))
        );
      }
      
      // Price range filter
      if (mergedFilters.minPrice !== undefined) {
        filteredData = filteredData.filter(product => 
          product.price !== undefined && product.price >= (mergedFilters.minPrice || 0)
        );
      }
      
      if (mergedFilters.maxPrice !== undefined) {
        const maxPrice = mergedFilters.maxPrice;
        filteredData = filteredData.filter(product => 
          product.price !== undefined && product.price <= maxPrice
        );
      }
      
      // Search filter
      if (mergedFilters.search) {
        const searchTerm = mergedFilters.search.toLowerCase();
        filteredData = filteredData.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          (product.description && product.description.toLowerCase().includes(searchTerm)) ||
          (product.sku && product.sku.toLowerCase().includes(searchTerm)) ||
          (product.supplier_name && product.supplier_name.toLowerCase().includes(searchTerm)) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
      }
      
      // Sort
      if (mergedFilters.sortBy) {
        const sortField = mergedFilters.sortBy;
        const sortOrder = mergedFilters.sortOrder === 'desc' ? -1 : 1;
        
        filteredData.sort((a, b) => {
          const valueA = a[sortField];
          const valueB = b[sortField];
          
          // Handle undefined values
          if (valueA === undefined && valueB === undefined) {return 0;}
          if (valueA === undefined) {return sortOrder;}
          if (valueB === undefined) {return -sortOrder;}
          
          // Handle string comparison
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return sortOrder * valueA.localeCompare(valueB);
          }
          
          // Handle numeric comparison
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
      
      setProducts(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, supabase]);

  const refetch = useCallback(() => fetchProducts(), [fetchProducts]);

  const createProduct = useCallback(async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    try {
      // Validate required fields
      if (!product.name || !product.type || !product.status) {
        const error = new Error('Missing required fields for product creation');
        console.error('Validation error in useProducts:', error, { product });
        setError(error);
        throw error;
      }

      // Ensure product has proper structure according to schema
      const productToCreate: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
        ...product,
        // Ensure these fields match the schema
        name: product.name,
        type: product.type,
        status: product.status,
        // Set defaults for optional fields if not provided
        description: product.description || '',
        tags: product.tags || [],
        currency: product.currency || 'EUR',
        // Initialize empty metadata if not provided
        metadata: product.metadata || {}
      };

      const { data, error: createError } = await supabase
        .from('products')
        .insert(productToCreate)
        .select()
        .single();
      
      if (createError) {
        throw createError;
      }
      
      if (!data) {
        const error = new Error('Failed to create product: No data returned');
        setError(error);
        throw error;
      }
      
      // Update local state
      setProducts(prev => [data, ...prev]);
      
      toast({
        title: "Produit créé",
        description: `Le produit ${data.name} a été créé avec succès`,
      });
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create product');
      setError(error);
      
      toast({
        title: "Erreur",
        description: `Impossible de créer le produit: ${error.message}`,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [supabase]);

  const updateProduct = useCallback(async (id: string, productUpdate: Partial<Product>): Promise<Product> => {
    try {
      // Ensure we're not sending undefined values
      const cleanedUpdate = {} as Partial<Product>;
      
      // Manually assign values to avoid TypeScript errors
      Object.entries(productUpdate).forEach(([key, value]) => {
        if (value !== undefined) {
          // Using type assertion with Record to ensure type safety
          (cleanedUpdate as Record<string, unknown>)[key] = value;
        }
      });

      const { data, error: updateError } = await supabase
        .from('products')
        .update(cleanedUpdate)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) {
        throw updateError;
      }
      
      if (!data) {
        const error = new Error('Failed to update product: No data returned');
        setError(error);
        throw error;
      }
      
      // Update local state
      setProducts(prev => 
        prev.map(p => p.id === id ? { ...p, ...data } : p)
      );
      
      toast({
        title: "Produit mis à jour",
        description: `Le produit ${data.name} a été mis à jour avec succès`,
      });
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update product');
      setError(error);
      
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le produit: ${error.message}`,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [supabase]);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        throw deleteError;
      }
      // Product deleted successfully
      
      // Update local state
      setProducts(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
      });
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete product');
      setError(error);
      
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le produit: ${error.message}`,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [supabase]);

  // Fetch products on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [autoFetch, fetchProducts]);

  return {
    products,
    loading,
    error,
    totalCount,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    filters,
    setFilters,
    refetch,
  };
};

export default useProducts;
