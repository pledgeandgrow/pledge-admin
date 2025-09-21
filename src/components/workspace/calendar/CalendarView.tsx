'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarViewProps, CalendarEvent } from '@/types/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isWithinInterval } from 'date-fns';

export function CalendarView({
  events,
  onEventClick,
  onDateSelect,
  onEventDrop,
  onEventResize,
  isLoading = false,
}: CalendarViewProps) {
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
    // Adjust to start from the beginning of the week
    startDate.setDate(startDate.getDate() - startDate.getDay());
    // Adjust to end at the end of the week
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  // Navigate to previous month
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  // Navigate to next month
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Navigate to today
  const goToToday = () => setCurrentMonth(new Date());

  // Handle date click
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    if (onDateSelect) {
      const endDate = new Date(day);
      endDate.setHours(day.getHours() + 1);
      onDateSelect(day, endDate, false);
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const startDate = typeof event.start_datetime === 'string' 
        ? parseISO(event.start_datetime) 
        : event.start_datetime;
      
      const endDate = event.end_datetime 
        ? (typeof event.end_datetime === 'string' ? parseISO(event.end_datetime) : event.end_datetime) 
        : startDate;
      
      // Check if the day falls within the event's time range
      return isWithinInterval(day, { start: startDate, end: endDate }) || 
             isSameDay(day, startDate) || 
             isSameDay(day, endDate);
    });
  };

  // Helper function to get colors based on event type
  const getEventColor = (type?: string): string => {
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
  };

  if (!mounted) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="h-[600px] p-4">
            <Skeleton className="w-full h-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="h-[600px] p-4">
            <Skeleton className="w-full h-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-medium py-2 text-sm text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              
              return (
                <div
                  key={day.toString()}
                  className={`min-h-[100px] p-1 border ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'} ${isToday ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'} ${isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>
                  
                  {/* Events for this day */}
                  <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.event_id}
                        className="text-xs p-1 rounded truncate cursor-pointer"
                        style={{ backgroundColor: event.color || getEventColor(event.event_type) }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEventClick) onEventClick(event);
                        }}
                      >
                        <span className="text-white font-medium">{event.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 pl-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
