'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventModalProps } from '@/types/calendar';
import { EventForm } from './EventForm';

export function EventModal({ isOpen, onClose, event, onSave, isLoading = false }: EventModalProps) {
  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{event?.event_id ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>
        <EventForm 
          initialData={event} 
          onSubmit={onSave} 
          onCancel={handleCancel} 
          isLoading={isLoading} 
        />
      </DialogContent>
    </Dialog>
  );
}
