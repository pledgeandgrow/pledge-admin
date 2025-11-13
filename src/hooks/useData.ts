import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

// Create supabase client once outside the hook to avoid recreating on every render
const supabase = createClient();
import { Data, DataType } from '@/types/data';

/**
 * Custom hook for managing data entries
 */
export const useData = (type?: DataType) => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all data entries or data entries by type
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('data').select('*');
      if (type) {
        query = query.eq('data_type', type);
      }
      const { data: result, error: err } = await query;
      if (err) {throw err;}
      console.log('✅ Fetched', (result || []).length, 'data entries', type ? `(type: ${type})` : '');
      setData(result || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('❌ Error fetching data:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // type accessed from closure - stable for hook lifetime

  /**
   * Create a new data entry
   */
  const createData = useCallback(async (newData: Data) => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: err } = await supabase.from('data').insert(newData).select().single();
      if (err) {throw err;}
      if (result) {
        console.log('✅ Data entry created:', result.id);
        setData(prevData => [...prevData, result]);
      }
      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('❌ Error creating data:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Update an existing data entry
   */
  const updateData = useCallback(async (id: string, updatedData: Partial<Data>) => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: err } = await supabase.from('data').update(updatedData).eq('id', id).select().single();
      if (err) {throw err;}
      if (result) {
        console.log('✅ Data entry updated:', id);
        setData(prevData => 
          prevData.map(item => item.id === id ? { ...item, ...result } : item)
        );
      }
      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('❌ Error updating data:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  /**
   * Delete a data entry
   */
  const deleteData = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.from('data').delete().eq('id', id);
      if (err) {throw err;}
      console.log('✅ Data entry deleted:', id);
      setData(prevData => prevData.filter(item => item.id !== id));
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('❌ Error deleting data:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - function is stable

  // Fetch data on component mount
  useEffect(() => {
    console.log('🚀 useData: Initial fetch on mount', type ? `(type: ${type})` : '');
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]); // Re-fetch when type changes

  return {
    data,
    loading,
    error,
    fetchData,
    createData,
    updateData,
    deleteData
  };
};

export default useData;
