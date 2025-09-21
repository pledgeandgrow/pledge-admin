'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskForm } from '@/components/workspace/tasks/TaskForm';
import useTasks from '@/hooks/useTasks';
import { useToast } from '@/components/ui/use-toast';

export default function NewTaskPage() {
  const router = useRouter();
  const { createTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      // Process dates
      const taskData = {
        ...formData,
        start_at: formData.start_date ? new Date(formData.start_date).toISOString() : undefined,
        due_at: formData.due_date ? new Date(formData.due_date).toISOString() : undefined,
      };
      
      await createTask(taskData);
      
      toast({
        title: 'Task created successfully',
        description: 'The new task has been created.',
      });
      
      router.push('/workspace/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/workspace/tasks');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={handleCancel} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
