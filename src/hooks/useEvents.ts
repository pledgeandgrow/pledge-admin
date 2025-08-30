import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';
import { CalendarEvent, CalendarEventFormData } from '@/types/calendar';

export const useEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events with optional filtering
  const fetchEvents = async (filters?: {
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
      const formattedEvents = data.map((event: any) => ({
        ...event,
        start_datetime: new Date(event.start_datetime),
        end_datetime: event.end_datetime ? new Date(event.end_datetime) : undefined,
        // Add color based on event_type for UI
        color: getEventColor(event.event_type),
      }));

      setEvents(formattedEvents);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

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
      const newEvent = {
        ...data[0],
        start_datetime: new Date(data[0].start_datetime),
        end_datetime: data[0].end_datetime ? new Date(data[0].end_datetime) : undefined,
        color: getEventColor(data[0].event_type),
      };

      setEvents((prevEvents) => [...prevEvents, newEvent]);
      return newEvent;
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event');
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
      const updatedEvent = {
        ...data[0],
        start_datetime: new Date(data[0].start_datetime),
        end_datetime: data[0].end_datetime ? new Date(data[0].end_datetime) : undefined,
        color: getEventColor(data[0].event_type),
      };

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.event_id === eventId ? updatedEvent : event
        )
      );

      return updatedEvent;
    } catch (err: any) {
      console.error('Error updating event:', err);
      setError(err.message || 'Failed to update event');
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
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.event_id !== eventId)
      );

      return true;
    } catch (err: any) {
      console.error('Error deleting event:', err);
      setError(err.message || 'Failed to delete event');
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
  }, []);

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
