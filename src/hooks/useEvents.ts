import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { CalendarEvent, CalendarEventFormData, EventStatus, EventPriority } from '@/types/calendar';

// Define a type for the raw database event that matches events.sql schema
type DbEvent = {
  event_id: number;
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime?: string;
  event_type?: string;
  location?: string;
  is_all_day: boolean;
  priority: number; // -1=low, 0=normal, 1=high
  status: string;
  created_at: string;
  updated_at: string;
};

export const useEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch events with optional filtering
  const fetchEvents = useCallback(async (filters?: {
    event_type?: string[];
    status?: string[];
    from?: Date;
    to?: Date;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('events')
        .select('*');
      
      // Apply filters if provided
      if (filters) {
        if (filters.event_type && filters.event_type.length > 0 && filters.event_type[0] !== '') {
          query = query.in('event_type', filters.event_type);
        }
        
        if (filters.status && filters.status.length > 0 && filters.status[0] !== '') {
          query = query.in('status', filters.status);
        }
        
        if (filters.from) {
          query = query.gte('start_datetime', filters.from.toISOString());
        }
        
        if (filters.to) {
          query = query.lte('start_datetime', filters.to.toISOString());
        }
      }
      
      // Add ordering
      query = query.order('start_datetime', { ascending: true });
      
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Transform dates from strings to Date objects for UI components
      const formattedEvents = data.map((event: DbEvent) => ({
        ...event,
        start_datetime: new Date(event.start_datetime),
        end_datetime: event.end_datetime ? new Date(event.end_datetime) : undefined,
        created_at: event.created_at ? new Date(event.created_at) : undefined,
        updated_at: event.updated_at ? new Date(event.updated_at) : undefined,
        // Add color based on event_type for UI
        color: getEventColor(event.event_type),
        // Ensure required properties exist
        is_all_day: event.is_all_day || false,
        priority: (event.priority as EventPriority) ?? 0,
        status: event.status as EventStatus
      }));

      setEvents(formattedEvents);
    } catch (err: Error | unknown) {
      console.error('Error fetching events:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new event
  const createEvent = async (eventData: CalendarEventFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Format dates to ISO strings for Supabase
      const formattedData = {
        ...eventData,
        start_datetime: eventData.start_datetime instanceof Date 
          ? eventData.start_datetime.toISOString() 
          : eventData.start_datetime,
        end_datetime: eventData.end_datetime instanceof Date 
          ? eventData.end_datetime.toISOString() 
          : eventData.end_datetime
      };

      const { data, error } = await supabase
        .from('events')
        .insert([formattedData])
        .select();

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from insert operation');
      }

      // Add the new event to the state with formatted dates
      const dbEvent = data[0] as DbEvent;
      const newEvent: CalendarEvent = {
        ...dbEvent,
        start_datetime: new Date(dbEvent.start_datetime),
        end_datetime: dbEvent.end_datetime ? new Date(dbEvent.end_datetime) : undefined,
        created_at: dbEvent.created_at ? new Date(dbEvent.created_at) : undefined,
        updated_at: dbEvent.updated_at ? new Date(dbEvent.updated_at) : undefined,
        color: getEventColor(dbEvent.event_type),
        is_all_day: dbEvent.is_all_day || false,
        priority: (dbEvent.priority as EventPriority) ?? 0,
        status: dbEvent.status as EventStatus
      };

      setEvents((prevEvents: CalendarEvent[]) => [...prevEvents, newEvent]);
      return newEvent;
    } catch (err: Error | unknown) {
      console.error('Error creating event:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage || 'Failed to create event');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing event
  const updateEvent = async (eventId: number, eventData: CalendarEventFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Format dates to ISO strings for Supabase
      const formattedData = {
        ...eventData,
        start_datetime: eventData.start_datetime instanceof Date 
          ? eventData.start_datetime.toISOString() 
          : eventData.start_datetime,
        end_datetime: eventData.end_datetime instanceof Date 
          ? eventData.end_datetime.toISOString() 
          : eventData.end_datetime
      };

      const { data, error } = await supabase
        .from('events')
        .update(formattedData)
        .eq('event_id', eventId)
        .select();

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from update operation');
      }

      // Update the event in the state with formatted dates
      const dbEvent = data[0] as DbEvent;
      const updatedEvent: CalendarEvent = {
        ...dbEvent,
        start_datetime: new Date(dbEvent.start_datetime),
        end_datetime: dbEvent.end_datetime ? new Date(dbEvent.end_datetime) : undefined,
        created_at: dbEvent.created_at ? new Date(dbEvent.created_at) : undefined,
        updated_at: dbEvent.updated_at ? new Date(dbEvent.updated_at) : undefined,
        color: getEventColor(dbEvent.event_type),
        is_all_day: dbEvent.is_all_day || false,
        priority: (dbEvent.priority as EventPriority) ?? 0,
        status: dbEvent.status as EventStatus
      };

      setEvents((prevEvents: CalendarEvent[]) =>
        prevEvents.map((event: CalendarEvent) =>
          event.event_id === eventId ? updatedEvent : event
        )
      );

      return updatedEvent;
    } catch (err: Error | unknown) {
      console.error('Error updating event:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage || 'Failed to update event');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an event
  const deleteEvent = async (eventId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('event_id', eventId);

      if (error) {
        throw error;
      }

      // Remove the event from the state
      setEvents((prevEvents: CalendarEvent[]) =>
        prevEvents.filter((event: CalendarEvent) => event.event_id !== eventId)
      );

      return true;
    } catch (err: Error | unknown) {
      console.error('Error deleting event:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage || 'Failed to delete event');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get color based on event type
  const getEventColor = (eventType?: string): string => {
    switch (eventType) {
      case 'meeting':
        return '#4285F4'; // Blue
      case 'deadline':
        return '#EA4335'; // Red
      case 'workshop':
        return '#FBBC05'; // Yellow
      case 'task':
        return '#34A853'; // Green
      case 'reminder':
        return '#9C27B0'; // Purple
      default:
        return '#9AA0A6'; // Grey
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
