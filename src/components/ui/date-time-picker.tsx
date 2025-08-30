'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  disabled?: boolean;
}

export function DateTimePicker({ date, setDate, disabled = false }: DateTimePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  
  // Generate time options in 30-minute intervals
  const timeOptions = React.useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  }, []);

  // Handle date selection from calendar
  const handleDateSelect = (day: Date | undefined) => {
    if (!day) return;
    
    const newDate = new Date(day);
    // Preserve the time from the current date
    newDate.setHours(date.getHours());
    newDate.setMinutes(date.getMinutes());
    
    // Only update if the date actually changed
    if (newDate.toDateString() !== date.toDateString()) {
      setDate(newDate);
    }
    
    setIsCalendarOpen(false);
  };

  // Handle time selection from dropdown
  const handleTimeChange = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    
    // Only update if the time actually changed
    if (
      newDate.getHours() !== date.getHours() || 
      newDate.getMinutes() !== date.getMinutes()
    ) {
      setDate(newDate);
    }
  };

  // Format the time for display in the select
  const formattedTime = React.useMemo(() => {
    return format(date, 'HH:mm');
  }, [date]);

  return (
    <div className="flex flex-col space-y-2">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(date, 'PPP')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Select
        value={formattedTime}
        onValueChange={handleTimeChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
