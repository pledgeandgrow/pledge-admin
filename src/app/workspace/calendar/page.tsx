'use client';

import { useState, useEffect, useMemo } from 'react';
import { CalendarView } from '@/components/workspace/calendar/CalendarView';
import { EventModal } from '@/components/workspace/calendar/EventModal';
import { EventList } from '@/components/workspace/calendar/EventList';
import { CalendarEvent, CalendarEventFormData, EventStatus } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useEvents } from '@/hooks/useEvents';
import { toast } from '@/components/ui/use-toast';
import { Plus, Search, CalendarDays, Clock8, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';


export default function CalendarPage() {
  const { events, isLoading, error, fetchEvents, createEvent, updateEvent, deleteEvent: _deleteEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventFormData | undefined>(undefined);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [filter, setFilter] = useState<{
    event_type?: string[];
    status?: EventStatus[];
    from?: Date;
    to?: Date;
  }>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Track if we're currently saving an event
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const disableActions = isLoading || isSaving;

  const quickTypeFilters = [
    { label: "Réunions", value: 'meeting' },
    { label: "Échéances", value: 'deadline' },
    { label: "Ateliers", value: 'workshop' },
    { label: "Événements", value: 'event' },
    { label: "Rappels", value: 'reminder' },
    { label: "Tâches", value: 'task' },
  ];

  const normalizeDate = (value?: Date | string) => {
    if (!value) { return undefined; }
    return value instanceof Date ? value : new Date(value);
  };

  const summaryStats = useMemo(() => {
    const total = events.length;
    const now = new Date();
    const upcoming = events
      .filter((event) => {
        const startDate = normalizeDate(event.start_datetime);
        return startDate ? startDate >= now : false;
      })
      .sort((a, b) => {
        const aDate = normalizeDate(a.start_datetime)?.getTime() ?? 0;
        const bDate = normalizeDate(b.start_datetime)?.getTime() ?? 0;
        return aDate - bDate;
      });

    const nextEvent = upcoming[0];
    const completedCount = events.filter((event) => event.status === 'completed').length;
    const cancelledCount = events.filter((event) => event.status === 'cancelled').length;
    const completionRate = total ? Math.round((completedCount / total) * 100) : 0;

    return [
      {
        label: 'Événements actifs',
        value: total,
        helper: `${upcoming.length} à venir`,
        icon: CalendarDays,
      },
      {
        label: 'Prochain événement',
        value: nextEvent ? nextEvent.title : 'Aucun',
        helper: nextEvent && normalizeDate(nextEvent.start_datetime)
          ? format(normalizeDate(nextEvent.start_datetime) as Date, "dd MMM • HH:mm")
          : 'Planifiez votre prochain rendez-vous',
        icon: Clock8,
      },
      {
        label: 'Terminés',
        value: completedCount,
        helper: total ? `${completionRate}% du total` : 'Aucun événement terminé',
        icon: CheckCircle2,
      },
      {
        label: 'Annulés',
        value: cancelledCount,
        helper: cancelledCount ? 'À surveiller' : 'Tout est sous contrôle',
        icon: AlertCircle,
      },
    ];
  }, [events]);

  const handleQuickTypeFilter = (value: string) => {
    setFilter((prev) => {
      const isActive = prev.event_type?.[0] === value;
      return { ...prev, event_type: isActive ? undefined : [value] };
    });
  };

  const hasActiveFilters = Boolean(
    (filter.event_type && filter.event_type.length) ||
    (filter.status && filter.status.length) ||
    filter.from ||
    filter.to
  );

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
  const handleEventDrop = async (_event: CalendarEvent, _delta: { days: number; milliseconds: number }) => {
    // Not implemented in our custom calendar view
    console.log('Event drag and drop not supported in this calendar implementation');
  };

  const handleEventResize = async (_event: CalendarEvent, _delta: { days: number; milliseconds: number }) => {
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
    } catch (_err) {
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

  const handleFilterChange = (key: string, value: string | Date | undefined) => {
    if (key === 'status') {
      // Ensure status is properly typed as EventStatus and is a string
      setFilter(prev => ({ ...prev, [key]: value && value !== 'all' && typeof value === 'string' ? [value as EventStatus] : undefined }));
    } else if (key === 'event_type') {
      // event_type should only be string[], not Date
      setFilter(prev => ({ ...prev, [key]: value && value !== 'all' && typeof value === 'string' ? [value] : undefined }));
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
        <div className="inline-flex items-center gap-2 text-sm text-primary font-medium">
          <Sparkles className="h-4 w-4" />
          Optimisez votre planning
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Calendrier des Événements
          </span>
        </h1>
        <p className="text-muted-foreground dark:text-gray-400">
          Gérez vos événements et votre planning
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card
            key={stat.label}
            className="border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white via-white to-blue-50/60 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{stat.label}</span>
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.helper}</p>
            </CardContent>
          </Card>
        ))}
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
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {quickTypeFilters.map((item) => {
              const isActive = filter.event_type?.[0] === item.value;
              return (
                <Button
                  key={item.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`rounded-full border-dashed ${isActive ? 'bg-primary/10 border-primary text-primary' : 'text-muted-foreground dark:border-gray-700'}`}
                  onClick={() => handleQuickTypeFilter(item.value)}
                  disabled={disableActions}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="w-full md:w-auto space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type d'événement</label>
              <Select onValueChange={(value) => handleFilterChange('event_type', value)}>
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
                disabled={!hasActiveFilters || disableActions}
                className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Effacer les filtres
              </Button>
              <Button 
                onClick={() => fetchEvents(filter)}
                disabled={disableActions}
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
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md flex items-center gap-2">
            Vue Calendrier
            <Badge variant="secondary" className="text-xs">{events.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md flex items-center gap-2">
            Vue Liste
            <Badge variant="secondary" className="text-xs">{events.length}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <CalendarView
                  events={events}
                  onEventClick={handleEventClick}
                  onDateSelect={handleDateSelect}
                  _onEventDrop={handleEventDrop}
                  _onEventResize={handleEventResize}
                  isLoading={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="list">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <CardHeader className="space-y-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <CardTitle className="text-lg">Vue Liste</CardTitle>
                <CardDescription>Suivez vos événements avec une liste chronologique détaillée.</CardDescription>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par titre, lieu, type..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
                <Button onClick={handleCreateEvent} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel événement
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                <EventList
                  events={events}
                  onEventClick={handleEventClick}
                  isLoading={isLoading || isSaving}
                  filter={filter}
                  searchQuery={searchQuery}
                  onCreateEvent={handleCreateEvent}
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
