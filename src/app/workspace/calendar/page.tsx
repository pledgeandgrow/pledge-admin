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
import { Plus } from 'lucide-react';


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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Calendar</h2>
          <p className="text-muted-foreground">Manage your events and schedule</p>
        </div>
        <Button 
          onClick={handleCreateEvent} 
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Filter Events</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Customize your calendar view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="w-full md:w-auto space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Type</label>
              <Select onValueChange={(value) => handleFilterChange('event_type', value ? [value] : undefined)}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Select type" />
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
            <div className="w-full md:w-auto space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <Select onValueChange={(value) => handleFilterChange('status', value ? value : undefined)}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-auto space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
              <DatePicker
                date={filter.from}
                onSelect={(date) => handleFilterChange('from', date)}
              />
            </div>
            <div className="w-full md:w-auto space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
              <DatePicker
                date={filter.to}
                onSelect={(date) => handleFilterChange('to', date)}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                onClick={clearFilters} 
                disabled={isLoading || isSaving}
                className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Clear Filters
              </Button>
              <Button 
                onClick={() => fetchEvents(filter)}
                disabled={isLoading || isSaving}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                    Loading...
                  </>
                ) : "Apply Filters"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={view} onValueChange={(value) => setView(value as 'calendar' | 'list')} className="w-full">
        <TabsList className="mb-4 bg-muted/50 dark:bg-muted/20 p-1 rounded-md">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">Calendar View</TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <CalendarView
                  events={events}
                  onEventClick={handleEventClick}
                  onDateSelect={handleDateSelect}
                  onEventDrop={handleEventDrop}
                  onEventResize={handleEventResize}
                  isLoading={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="list">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <EventList
                  events={events}
                  onEventClick={handleEventClick}
                  isLoading={isLoading || isSaving}
                  filter={filter}
                />
              </div>
            </CardContent>
          </Card>
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
