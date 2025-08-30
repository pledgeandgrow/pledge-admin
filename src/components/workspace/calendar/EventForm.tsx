'use client';

import React, { useState, useCallback } from 'react';
import { CalendarEventFormData, EventPriority, EventStatus, EventType } from '@/types/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Button } from '@/components/ui/button';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventFormProps {
  initialData?: Partial<CalendarEventFormData>;
  onSubmit: (data: CalendarEventFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EventForm({ initialData, onSubmit, onCancel, isLoading = false }: EventFormProps) {
  // Initialize form data
  const [formData, setFormData] = useState<CalendarEventFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    start_datetime: initialData?.start_datetime ? new Date(initialData.start_datetime) : new Date(),
    end_datetime: initialData?.end_datetime ? new Date(initialData.end_datetime) : new Date(Date.now() + 60 * 60 * 1000),
    is_all_day: Boolean(initialData?.is_all_day) || false,
    event_type: initialData?.event_type || 'meeting',
    status: initialData?.status || 'scheduled',
    priority: initialData?.priority !== undefined ? Number(initialData.priority) as EventPriority : 0 as EventPriority,
    location: initialData?.location || '',
    event_id: initialData?.event_id,
  });

  // Simple input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Select change handler
  const handleSelectChange = (name: string, value: string) => {
    if (name === 'priority') {
      setFormData({ ...formData, [name]: Number(value) as EventPriority });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Toggle all-day event
  const toggleAllDay = () => {
    setFormData({ ...formData, is_all_day: !formData.is_all_day });
  };

  // Date change handler with auto-adjustment of end date
  const handleDateChange = (name: 'start_datetime' | 'end_datetime', date: Date) => {
    // Create a copy of the current form data
    const newData = { ...formData };
    const currentValue = name === 'start_datetime' ? formData.start_datetime : formData.end_datetime;
    
    // Only update if the date has actually changed
    // Compare date strings to avoid reference equality issues
    if (!currentValue || date.toString() !== currentValue.toString()) {
      if (name === 'start_datetime') {
        newData.start_datetime = date;
        
        // If start date is after end date, adjust end date
        if (formData.end_datetime && date > formData.end_datetime) {
          const newEndTime = new Date(date);
          newEndTime.setHours(newEndTime.getHours() + 1);
          newData.end_datetime = newEndTime;
        }
      } else {
        newData.end_datetime = date;
      }
      
      setFormData(newData);
    }
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Event title"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          placeholder="Event description"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location || ''}
          onChange={handleInputChange}
          placeholder="Event location"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <div 
          className={cn(
            "h-5 w-5 rounded border flex items-center justify-center cursor-pointer",
            formData.is_all_day ? "bg-primary border-primary" : "bg-background border-input",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          onClick={isLoading ? undefined : toggleAllDay}
        >
          {formData.is_all_day && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
        <Label 
          className={cn("cursor-pointer", isLoading && "opacity-50 cursor-not-allowed")} 
          onClick={isLoading ? undefined : toggleAllDay}
        >
          All day event
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_datetime">Start</Label>
          <DateTimePicker
            date={formData.start_datetime instanceof Date ? formData.start_datetime : new Date(formData.start_datetime)}
            setDate={(date) => handleDateChange('start_datetime', date)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_datetime">End</Label>
          <DateTimePicker
            date={formData.end_datetime ? 
              (formData.end_datetime instanceof Date ? formData.end_datetime : new Date(formData.end_datetime)) : 
              new Date(Date.now() + 60 * 60 * 1000)}
            setDate={(date) => handleDateChange('end_datetime', date)}
            disabled={isLoading || formData.is_all_day}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_type">Event Type</Label>
          <Select
            value={formData.event_type}
            onValueChange={(value) => handleSelectChange('event_type', value as EventType)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value as EventStatus)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority.toString()}
            onValueChange={(value) => handleSelectChange('priority', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Low</SelectItem>
              <SelectItem value="0">Normal</SelectItem>
              <SelectItem value="1">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Event'
          )}
        </Button>
      </div>
    </form>
  );
}
