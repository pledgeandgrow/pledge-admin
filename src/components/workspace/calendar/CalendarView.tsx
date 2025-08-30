'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarViewProps, CalendarEvent } from '@/types/calendar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Skeleton } from '@/components/ui/skeleton';

export function CalendarView({
  events,
  onEventClick,
  onDateSelect,
  onEventDrop,
  onEventResize,
  isLoading = false,
}: CalendarViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const formattedEvents = events.map((event) => ({
    id: String(event.event_id),
    title: event.title,
    start: event.start_datetime,
    end: event.end_datetime,
    allDay: event.is_all_day || false,
    extendedProps: { ...event },
    backgroundColor: event.color || getEventColor(event.event_type),
    borderColor: event.color || getEventColor(event.event_type),
    textColor: '#ffffff',
    classNames: ['cursor-pointer', 'hover:opacity-80', 'font-medium', 'event-card'],
  }));

  return (
    <Card>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-[600px] p-4">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <div className="p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              events={formattedEvents}
              eventContent={(eventInfo) => {
                return (
                  <div className="flex flex-col p-1 w-full h-full rounded-md overflow-hidden">
                    <div className="font-semibold truncate">{eventInfo.event.title}</div>
                    {!eventInfo.event.allDay && eventInfo.timeText && (
                      <div className="text-xs opacity-90">{eventInfo.timeText}</div>
                    )}
                    {eventInfo.event.extendedProps.location && (
                      <div className="text-xs truncate">{eventInfo.event.extendedProps.location}</div>
                    )}
                  </div>
                );
              }}
              eventClick={(info: any) => {
                info.jsEvent.preventDefault(); // Prevent default browser action
                if (onEventClick) {
                  onEventClick(info.event.extendedProps as CalendarEvent);
                }
              }}
              selectable={true}
              select={(info: any) => {
                if (onDateSelect) {
                  onDateSelect(info.start, info.end, info.allDay);
                }
              }}
              editable={true}
              eventDrop={(info: any) => {
                if (onEventDrop) {
                  onEventDrop(
                    info.event.extendedProps as CalendarEvent,
                    {
                      days: info.delta.days,
                      minutes: info.delta.milliseconds / 60000,
                    }
                  );
                }
              }}
              eventResize={(info: any) => {
                if (onEventResize) {
                  onEventResize(
                    info.event.extendedProps as CalendarEvent,
                    {
                      days: info.endDelta.days,
                      minutes: info.endDelta.milliseconds / 60000,
                    }
                  );
                }
              }}
              height="600px"
              nowIndicator={true}
              dayMaxEvents={true}
              weekends={true}
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
                startTime: '09:00',
                endTime: '18:00',
              }}
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              allDaySlot={true}
              slotDuration="00:30:00"
              slotLabelInterval="01:00"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to get colors based on event type
function getEventColor(type?: string): string {
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
