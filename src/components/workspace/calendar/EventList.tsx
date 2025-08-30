'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarEvent, EventListProps, EventStatus } from '@/types/calendar';
import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import { Calendar, Clock, MapPin, Users, Tag, AlertCircle } from 'lucide-react';

// Helper function to get colors based on event type
function getEventColor(type: string): string {
  switch (type) {
    case 'meeting':
      return '#4285F4'; // Blue
    case 'deadline':
      return '#DB4437'; // Red
    case 'workshop':
      return '#F4B400'; // Yellow
    case 'event':
      return '#0F9D58'; // Green
    case 'reminder':
      return '#9C27B0'; // Purple
    case 'task':
      return '#34A853'; // Green
    default:
      return '#9AA0A6'; // Grey
  }
}

export function EventList({
  events,
  onEventClick,
  isLoading = false,
  filter,
}: EventListProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    
    return events.filter(event => {
      // Filter by type
      if (filter?.event_type?.length && event.event_type && !filter.event_type.includes(event.event_type)) {
        return false;
      }
      
      // Filter by status
      if (filter?.status?.length && !filter.status.includes(event.status)) {
        return false;
      }
      
      // Filter by date range
      const startDate = typeof event.start_datetime === 'string' ? parseISO(event.start_datetime) : event.start_datetime || new Date();
      const endDate = typeof event.end_datetime === 'string' ? parseISO(event.end_datetime) : event.end_datetime || new Date();
      
      if (filter?.from) {
        if (isAfter(filter.from, endDate)) {
          return false;
        }
      }
      
      if (filter?.to) {
        if (isBefore(filter.to, startDate)) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      const dateA = typeof a.start_datetime === 'string' ? parseISO(a.start_datetime) : a.start_datetime || new Date();
      const dateB = typeof b.start_datetime === 'string' ? parseISO(b.start_datetime) : b.start_datetime || new Date();
      return dateA.getTime() - dateB.getTime();
    });
  }, [events, filter]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: CalendarEvent[] } = {};
    
    filteredEvents.forEach(event => {
      const startDate = typeof event.start_datetime === 'string' ? parseISO(event.start_datetime) : event.start_datetime || new Date();
      const dateKey = format(startDate, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(event);
    });
    
    return groups;
  }, [filteredEvents]);

  if (!mounted) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <Calendar className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No events found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
            There are no events matching your current filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
            <div key={dateKey} className="space-y-3">
              <h3 className="font-medium text-lg border-b pb-2">
                {format(parseISO(dateKey), 'EEEE, MMMM d, yyyy')}
              </h3>
              <div className="space-y-3">
                {dateEvents.map((event) => (
                  <EventCard 
                    key={event.event_id} 
                    event={event} 
                    onClick={() => onEventClick && onEventClick(event)} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EventCard({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const startDate = typeof event.start_datetime === 'string' ? parseISO(event.start_datetime) : event.start_datetime || new Date();
  const endDate = typeof event.end_datetime === 'string' ? parseISO(event.end_datetime) : event.end_datetime || new Date();
  
  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'deadline':
        return <Clock className="h-4 w-4" />;
      case 'workshop':
        return <Users className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'reminder':
        return <AlertCircle className="h-4 w-4" />;
      case 'task':
        return <Tag className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div 
      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      onClick={onClick}
      style={{ borderLeftColor: event.color || getEventColor(event.event_type || ''), borderLeftWidth: '4px' }}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-base">{event.title}</h4>
        <Badge className={getStatusColor(event.status)}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </Badge>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          {event.is_all_day ? (
            <span>All day</span>
          ) : (
            <span>
              {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
            </span>
          )}
        </div>
        
        {event.location && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
        )}
        
        <div className="flex items-center">
          <div className="mr-2">{getTypeIcon(event.event_type)}</div>
          <span>{event.event_type ? event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1) : 'Event'}</span>
        </div>
      </div>
      
      {event.description && (
        <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">
          {event.description}
        </p>
      )}
    </div>
  );
}
