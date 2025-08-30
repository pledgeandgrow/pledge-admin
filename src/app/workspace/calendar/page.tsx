'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/workspace/calendar/CalendarView';
import { EventModal } from '@/components/workspace/calendar/EventModal';
import { EventList } from '@/components/workspace/calendar/EventList';
import { CalendarEvent, CalendarEventFormData, EventStatus } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useEvents } from '@/hooks/useEvents';
import { toast } from '@/components/ui/use-toast';


export default function CalendarPage() {
  const { events, isLoading, error, fetchEvents, createEvent, updateEvent, deleteEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventFormData | undefined>(undefined);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [filter, setFilter] = useState<{
    event_type?: string[];
    status?: EventStatus[];
    from?: Date;
    to?: Date;
  }>({});
  
  // Track if we're currently saving an event
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Apply filters when they change
  useEffect(() => {
    fetchEvents(filter);
  }, [filter]);
  
  // Show error toast if there's an error fetching events
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent({
      ...event,
      // Ensure dates are properly formatted for the form
      start_datetime: event.start_datetime,
      end_datetime: event.end_datetime,
    });
    setIsModalOpen(true);
  };
  
  // Handle event drag and drop
  const handleEventDrop = async (event: CalendarEvent, delta: { days: number; minutes: number }) => {
    try {
      setIsSaving(true);
      
      // Calculate new start and end dates
      const startDate = new Date(event.start_datetime);
      startDate.setDate(startDate.getDate() + delta.days);
      startDate.setMinutes(startDate.getMinutes() + delta.minutes);
      
      let endDate = event.end_datetime ? new Date(event.end_datetime) : null;
      if (endDate) {
        endDate.setDate(endDate.getDate() + delta.days);
        endDate.setMinutes(endDate.getMinutes() + delta.minutes);
      }
      
      // Prepare updated event data
      const updatedEvent: CalendarEventFormData = {
        ...event,
        start_datetime: startDate,
        end_datetime: endDate || undefined,
      };
      
      // Update the event
      await updateEvent(event.event_id, updatedEvent);
      
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      
      // Refresh events with current filters
      await fetchEvents(filter);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
      // Refresh to revert the UI change
      await fetchEvents(filter);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle event resize
  const handleEventResize = async (event: CalendarEvent, delta: { days: number; minutes: number }) => {
    try {
      setIsSaving(true);
      
      // Calculate new end date
      let endDate = event.end_datetime ? new Date(event.end_datetime) : new Date(event.start_datetime);
      endDate.setDate(endDate.getDate() + delta.days);
      endDate.setMinutes(endDate.getMinutes() + delta.minutes);
      
      // Prepare updated event data
      const updatedEvent: CalendarEventFormData = {
        ...event,
        end_datetime: endDate,
      };
      
      // Update the event
      await updateEvent(event.event_id, updatedEvent);
      
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      
      // Refresh events with current filters
      await fetchEvents(filter);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
      // Refresh to revert the UI change
      await fetchEvents(filter);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDateSelect = (start: Date, end: Date, allDay: boolean) => {
    setSelectedEvent({
      title: '',
      description: '',
      start_datetime: start,
      end_datetime: end,
      is_all_day: allDay,
      status: 'scheduled',
      event_type: 'meeting',
      priority: 0, // Normal priority
      location: '',
    });
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData: CalendarEventFormData) => {
    try {
      setIsSaving(true);
      
      if (eventData.event_id) {
        // Update existing event
        await updateEvent(eventData.event_id, eventData);
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        // Create new event
        await createEvent(eventData);
        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }
      
      // Refresh events with current filters
      await fetchEvents(filter);
      
      setIsModalOpen(false);
      setSelectedEvent(undefined);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateEvent = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    setSelectedEvent({
      title: '',
      description: '',
      start_datetime: now,
      end_datetime: oneHourLater,
      is_all_day: false,
      status: 'scheduled',
      event_type: 'meeting',
      priority: 0, // Normal priority
      location: '',
    });
    setIsModalOpen(true);
  };

  const handleFilterChange = (key: string, value: any) => {
    if (key === 'status') {
      // Ensure status is properly typed as EventStatus
      setFilter(prev => ({ ...prev, [key]: value && value !== 'all' ? [value as EventStatus] : undefined }));
    } else if (key === 'event_type') {
      setFilter(prev => ({ ...prev, [key]: value && value !== 'all' ? [value] : undefined }));
    } else {
      setFilter(prev => ({ ...prev, [key]: value }));
    }
  };
  
  const clearFilters = () => {
    setFilter({});
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <Button onClick={handleCreateEvent}>Create Event</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Events</CardTitle>
          <CardDescription>Customize your calendar view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="w-full md:w-auto">
              <Select onValueChange={(value) => handleFilterChange('event_type', value ? [value] : undefined)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="meeting">Meetings</SelectItem>
                  <SelectItem value="deadline">Deadlines</SelectItem>
                  <SelectItem value="workshop">Workshops</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                  <SelectItem value="reminder">Reminders</SelectItem>
                  <SelectItem value="task">Tasks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-auto">
              <Select onValueChange={(value) => handleFilterChange('status', value ? value : undefined)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-auto">
              <DatePicker
                date={filter.from}
                onSelect={(date) => handleFilterChange('from', date)}
                placeholder="From Date"
              />
            </div>
            <div className="w-full md:w-auto">
              <DatePicker
                date={filter.to}
                onSelect={(date) => handleFilterChange('to', date)}
                placeholder="To Date"
              />
            </div>
            <div className="w-full md:w-auto ml-auto">
              <Button 
                variant="outline" 
                onClick={clearFilters} 
                disabled={isLoading || isSaving}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                    Loading...
                  </>
                ) : "Clear Filters"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={view} onValueChange={(value) => setView(value as 'calendar' | 'list')}>
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
            <CalendarView
              events={events}
              onEventClick={handleEventClick}
              onDateSelect={handleDateSelect}
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              isLoading={isLoading}
            />
        </TabsContent>
        <TabsContent value="list">
            <EventList
              events={events}
              onEventClick={handleEventClick}
              isLoading={isLoading || isSaving}
              filter={filter}
            />
        </TabsContent>
      </Tabs>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(undefined);
        }}
        event={selectedEvent}
        onSave={handleSaveEvent}
        isLoading={isSaving}
      />
    </div>
  );
}
