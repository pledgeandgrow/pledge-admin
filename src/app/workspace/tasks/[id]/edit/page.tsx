'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskForm } from '@/components/workspace/tasks/TaskForm';
import useTasks, { TaskWithProject } from '@/hooks/useTasks';
import { useToast } from '@/components/ui/use-toast';

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const { tasks, isLoading, error, fetchTasks, updateTask } = useTasks();
  const [task, setTask] = useState<TaskWithProject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadTask = async () => {
      await fetchTasks();
    };
    
    loadTask();
  }, [fetchTasks]);

  useEffect(() => {
    if (tasks.length > 0) {
      const foundTask = tasks.find(t => t.id === taskId);
      if (foundTask) {
        setTask(foundTask);
      } else {
        // Task not found, redirect to tasks list
        toast({
          title: 'Task not found',
          description: 'The requested task could not be found.',
          variant: 'destructive',
        });
        router.push('/workspace/tasks');
      }
    }
  }, [tasks, taskId, router, toast]);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      // Process dates
      const taskData = {
        ...formData,
        start_at: formData.start_date ? new Date(formData.start_date).toISOString() : undefined,
        due_at: formData.due_date ? new Date(formData.due_date).toISOString() : undefined,
      };
      
      if (task) {
        await updateTask(task.id, taskData);
        
        toast({
          title: 'Task updated successfully',
          description: 'The task has been updated.',
        });
        
        router.push(`/workspace/tasks/${task.id}`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (task) {
      router.push(`/workspace/tasks/${task.id}`);
    } else {
      router.push('/workspace/tasks');
    }
  };

  if (isLoading || !task) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          Error loading task: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={handleCancel} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Task
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Task: {task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            task={task}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
