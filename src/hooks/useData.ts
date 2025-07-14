import { useState, useCallback, useEffect } from 'react';
import { dataService } from '@/services/dataService';
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
      let result;
      if (type) {
        result = await dataService.getDataByType(type);
      } else {
        result = await dataService.getAllData();
      }
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  /**
   * Create a new data entry
   */
  const createData = useCallback(async (newData: Data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.createData(newData);
      if (result) {
        setData(prevData => [...prevData, result]);
      }
      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error creating data:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing data entry
   */
  const updateData = useCallback(async (id: string, updatedData: Partial<Data>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.updateData(id, updatedData);
      if (result) {
        setData(prevData => 
          prevData.map(item => item.id === id ? { ...item, ...result } : item)
        );
      }
      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error updating data:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a data entry
   */
  const deleteData = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.deleteData(id);
      if (result) {
        setData(prevData => prevData.filter(item => item.id !== id));
      }
      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error deleting data:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
