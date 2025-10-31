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
import { Separator } from '@/components/ui/separator';


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
  }, [filter, fetchEvents]);
  
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
  
  // We're not supporting drag and drop or resize with our custom calendar implementation
  // These are placeholder functions to maintain the interface
  const handleEventDrop = async (event: CalendarEvent, delta: { days: number; minutes: number }) => {
    // Not implemented in our custom calendar view
    console.log('Event drag and drop not supported in this calendar implementation');
  };
  
  const handleEventResize = async (event: CalendarEvent, delta: { days: number; minutes: number }) => {
    // Not implemented in our custom calendar view
    console.log('Event resize not supported in this calendar implementation');
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
    <div className="p-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Calendrier des Événements
          </span>
        </h1>
        <p className="text-muted-foreground dark:text-gray-400">
          Gérez vos événements et votre planning
        </p>
      </div>
      
      <Separator className="my-6" />
      
      <div className="flex justify-between items-center">
        <div></div>
        <Button 
          onClick={handleCreateEvent} 
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Créer un événement
        </Button>
      </div>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Filtrer les événements</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Personnalisez votre vue du calendrier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="w-full md:w-auto space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type d'événement</label>
              <Select onValueChange={(value) => handleFilterChange('event_type', value ? [value] : undefined)}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="meeting">Réunions</SelectItem>
                  <SelectItem value="deadline">Échéances</SelectItem>
                  <SelectItem value="workshop">Ateliers</SelectItem>
                  <SelectItem value="event">Événements</SelectItem>
                  <SelectItem value="reminder">Rappels</SelectItem>
                  <SelectItem value="task">Tâches</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-auto space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
              <Select onValueChange={(value) => handleFilterChange('status', value ? value : undefined)}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="scheduled">Planifié</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-auto space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de début</label>
              <DatePicker
                date={filter.from}
                onSelect={(date) => handleFilterChange('from', date)}
              />
            </div>
            <div className="w-full md:w-auto space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de fin</label>
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
                Effacer les filtres
              </Button>
              <Button 
                onClick={() => fetchEvents(filter)}
                disabled={isLoading || isSaving}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                    Chargement...
                  </>
                ) : "Appliquer les filtres"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={view} onValueChange={(value) => setView(value as 'calendar' | 'list')} className="w-full">
        <TabsList className="mb-4 bg-muted/50 dark:bg-muted/20 p-1 rounded-md">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">Vue Calendrier</TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">Vue Liste</TabsTrigger>
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
