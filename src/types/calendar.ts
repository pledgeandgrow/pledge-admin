export type EventStatus = 'scheduled' | 'cancelled' | 'completed';
export type EventType = 'meeting' | 'deadline' | 'workshop' | 'event' | 'reminder' | 'task';
export type EventPriority = -1 | 0 | 1; // -1=low, 0=normal, 1=high

export interface CalendarEvent {
  event_id: number;
  title: string;
  description?: string;
  event_type?: string;
  location?: string;
  start_datetime: Date | string;
  end_datetime?: Date | string;
  is_all_day: boolean;
  priority: EventPriority;
  status: EventStatus;
  created_at?: Date | string;
  updated_at?: Date | string;
  
  // UI-specific properties (not in database)
  color?: string;
}

export interface CalendarEventFormData extends Omit<CalendarEvent, 'event_id' | 'created_at' | 'updated_at'> {
  event_id?: number;
}

export interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (start: Date, end: Date, allDay: boolean) => void;
  _onEventDrop?: (event: CalendarEvent, delta: { days: number; milliseconds: number }) => void;
  _onEventResize?: (event: CalendarEvent, delta: { days: number; milliseconds: number }) => void;
  isLoading?: boolean;
}

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEventFormData;
  onSave: (event: CalendarEventFormData) => void;
  isLoading?: boolean;
}

export interface EventListProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  isLoading?: boolean;
  filter?: {
    event_type?: string[];
    status?: EventStatus[];
    from?: Date;
    to?: Date;
  };
}
