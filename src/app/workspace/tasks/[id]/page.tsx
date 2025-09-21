'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskDetail } from '@/components/workspace/tasks/TaskDetail';
import { TaskModal } from '@/components/workspace/tasks/TaskModal';
import useTasks, { TaskWithProject } from '@/hooks/useTasks';
import { useToast } from '@/components/ui/use-toast';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const { tasks, isLoading, error, fetchTasks, updateTask, deleteTask } = useTasks();
  const [task, setTask] = useState<TaskWithProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      toast({
        title: 'Task deleted',
        description: 'The task has been successfully deleted.',
      });
      router.push('/workspace/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (taskData: Partial<TaskWithProject>) => {
    try {
      if (task) {
        await updateTask(task.id, taskData);
        // Refresh task data
        await fetchTasks();
        setIsModalOpen(false);
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating task:', error);
      return Promise.reject(error);
    }
  };

  const handleBack = () => {
    router.push('/workspace/tasks');
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
    <div className="container mx-auto py-6">
      <TaskDetail 
        task={task as any} // Type cast to satisfy the extended interface
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBack}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
