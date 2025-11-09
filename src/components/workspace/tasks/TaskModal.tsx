'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Task, TaskWithProject } from '@/hooks/useTasks';
import { TaskForm } from './TaskForm';
import { useToast } from '@/components/ui/use-toast';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskWithProject;
  onSubmit: (task: Partial<Task>) => Promise<void>;
  projects?: Array<{ id: string; name: string }>;
  users?: Array<{ id: string; name: string }>;
  parentTasks?: Array<{ id: string; title: string }>;
}

export function TaskModal({ 
  isOpen, 
  onClose, 
  task, 
  onSubmit,
  projects = [],
  users = [],
  parentTasks = []
}: TaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Filter out the current task from parent tasks to prevent circular references
  const filteredParentTasks = parentTasks.filter(
    parentTask => !task || parentTask.id !== task.id
  );

  const handleSubmit = async (formData: Partial<Task>) => {
    try {
      setIsSubmitting(true);
      
      // Process dates
      const taskData = {
        ...formData,
        start_at: formData.start_at ? new Date(formData.start_at).toISOString() : undefined,
        due_at: formData.due_at ? new Date(formData.due_at).toISOString() : undefined,
      };
      
      await onSubmit(taskData);
      
      toast({
        title: `Task ${task ? 'updated' : 'created'} successfully`,
        description: `The task has been ${task ? 'updated' : 'created'}.`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
      toast({
        title: 'Error',
        description: `Failed to ${task ? 'update' : 'create'} task. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription>
            {task 
              ? 'Update the details of this task.' 
              : 'Fill in the details to create a new task.'}
          </DialogDescription>
        </DialogHeader>
        
        <TaskForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={onClose}
          projects={projects}
          users={users}
          parentTasks={filteredParentTasks}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
