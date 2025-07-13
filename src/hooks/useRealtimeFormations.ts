import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Data } from '@/types/data';

/**
 * Custom hook for subscribing to real-time formation updates
 * 
 * @returns {Object} formations and loading state
 */
export function useRealtimeFormations() {
  const [formations, setFormations] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Using useEffect to fetch data and set up real-time subscription
  useEffect(() => {
    // Initial fetch of formations
    const fetchFormations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('data')
          .select('*')
          .eq('data_type', 'formation')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setFormations(data || []);
      } catch (err) {
        console.error('Error fetching formations:', err);
        setError('Failed to load formations');
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('formation-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'data',
        filter: 'data_type=eq.formation'
      }, (payload) => {
        console.log('Received real-time update:', payload);
        
        // Handle different types of changes
        if (payload.eventType === 'INSERT') {
          setFormations(prev => [payload.new as Data, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setFormations(prev => 
            prev.map(formation => 
              formation.id === payload.new.id ? (payload.new as Data) : formation
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setFormations(prev => 
            prev.filter(formation => formation.id !== payload.old.id)
          );
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to formation changes');
        }
      });

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]); // Added supabase as a dependency

  return { formations, loading, error };
}

export default useRealtimeFormations;
