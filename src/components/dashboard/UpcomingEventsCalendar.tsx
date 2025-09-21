import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/hooks/useEvents';
import { CalendarEvent, EventStatus } from '@/types/calendar';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface UpcomingEventsCalendarProps {
  limit?: number;
  daysAhead?: number;
  filter?: {
    eventType?: string[];
    status?: EventStatus[];
  };
}

const UpcomingEventsCalendar: React.FC<UpcomingEventsCalendarProps> = ({
  limit = 5,
  daysAhead = 7,
  filter
}) => {
  const { events, isLoading, error, fetchEvents } = useEvents();
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    // Calculate date range for upcoming events
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + daysAhead);
    
    // Fetch events with filter
    fetchEvents({
      event_type: filter?.eventType,
      status: filter?.status,
      from: today,
      to: endDate
    });
  }, [fetchEvents, daysAhead, filter]);

  useEffect(() => {
    if (events.length > 0) {
      // Filter for upcoming events and sort by start date
      const now = new Date();
      const filtered = events
        .filter(event => {
          const eventDate = new Date(event.start_datetime);
          return eventDate >= now;
        })
        .sort((a, b) => {
          return new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime();
        })
        .slice(0, limit);
      
      setUpcomingEvents(filtered);
    }
  }, [events, limit]);

  const formatEventTime = (event: CalendarEvent) => {
    if (event.is_all_day) {
      return 'Toute la journée';
    }
    
    const startDate = new Date(event.start_datetime);
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return startDate.toLocaleTimeString('fr-FR', options);
  };

  const formatEventDate = (date: Date | string) => {
    const eventDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    // Check if the event is today or tomorrow
    if (eventDate.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      return "Demain";
    } else {
      // Otherwise return the formatted date
      return eventDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  };

  const getEventTypeColor = (eventType?: string) => {
    switch (eventType) {
      case 'meeting':
        return 'bg-blue-500';
      case 'deadline':
        return 'bg-red-500';
      case 'workshop':
        return 'bg-yellow-500';
      case 'task':
        return 'bg-green-500';
      case 'reminder':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case -1:
        return 'Basse';
      case 0:
        return 'Normale';
      case 1:
        return 'Haute';
      default:
        return 'Normale';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case -1:
        return 'text-green-600';
      case 0:
        return 'text-blue-600';
      case 1:
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  // Group events by date
  const groupedEvents = upcomingEvents.reduce<Record<string, CalendarEvent[]>>((groups, event) => {
    const date = new Date(event.start_datetime).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Événements à venir</span>
          <Badge variant="outline" className="ml-2">{upcomingEvents.length}</Badge>
        </CardTitle>
        <CardDescription>
          {`Événements des ${daysAhead} prochains jours`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">Erreur lors du chargement des événements</div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Aucun événement à venir dans les {daysAhead} prochains jours
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedEvents).map(([date, dateEvents]) => (
              <div key={date} className="space-y-2">
                <h3 className="font-medium text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatEventDate(new Date(date))}
                </h3>
                <div className="pl-6 space-y-2">
                  {dateEvents.map((event) => (
                    <div key={event.event_id} className="flex items-start p-2 border-l-4 rounded-md hover:bg-gray-50 transition-colors" style={{ borderLeftColor: event.color || '#9AA0A6' }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{event.title}</div>
                          <Badge className={`${getEventTypeColor(event.event_type)} text-white ml-2 shrink-0`}>
                            {event.event_type || 'Événement'}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatEventTime(event)}
                          </span>
                          
                          {event.location && (
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </span>
                          )}
                          
                          <span className={`font-medium ${getPriorityColor(event.priority)}`}>
                            Priorité: {getPriorityLabel(event.priority)}
                          </span>
                        </div>
                        
                        {event.description && (
                          <div className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <a href="/calendar" className="text-sm text-blue-600 hover:underline">
          Voir le calendrier complet
        </a>
      </CardFooter>
    </Card>
  );
};

export default UpcomingEventsCalendar;
