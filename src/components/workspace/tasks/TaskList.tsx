'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { TaskCard } from './TaskCard';
import { TaskFilter, TaskFilters } from './TaskFilter';
import { TaskModal } from './TaskModal';
import useTasks, { TaskWithProject, TaskStatus } from '@/hooks/useTasks';

interface TaskListProps {
  projectId?: string;
}

export function TaskList({ projectId }: TaskListProps) {
  const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithProject | undefined>(undefined);
  const [filters, setFilters] = useState<TaskFilters>({
    project_id: projectId,
  });
  const [view, setView] = useState<'board' | 'list'>('board');
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
  const { toast } = useToast();

  // Fetch tasks when component mounts or filters change
  useEffect(() => {
    fetchTasks(filters);
  }, [fetchTasks, filters]);

  // Mock function to fetch projects - replace with actual API call
  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchProjects = async () => {
      try {
        // Example data - replace with actual API call
        setProjects([
          { id: '1', name: 'Project A' },
          { id: '2', name: 'Project B' },
        ]);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  // Mock function to fetch users - replace with actual API call
  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchUsers = async () => {
      try {
        // Example data - replace with actual API call
        setUsers([
          { id: '1', name: 'User A' },
          { id: '2', name: 'User B' },
        ]);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: TaskWithProject) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast({
        title: 'Task deleted',
        description: 'The task has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTask(taskId, { status: status as TaskStatus });
      toast({
        title: 'Status updated',
        description: 'The task status has been updated.',
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitTask = async (taskData: Partial<TaskWithProject>) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData as any);
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving task:', error);
      return Promise.reject(error);
    }
  };

  // Group tasks by status for board view
  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    in_review: tasks.filter(task => task.status === 'in_review'),
    blocked: tasks.filter(task => task.status === 'blocked'),
    done: tasks.filter(task => task.status === 'done'),
    archived: tasks.filter(task => task.status === 'archived'),
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        Error loading tasks: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">
            Manage your tasks and track your progress
          </p>
        </div>
        <Button onClick={handleCreateTask}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <TaskFilter 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        projects={projects}
        users={users}
      />

      <Tabs defaultValue="board" value={view} onValueChange={(v) => setView(v as 'board' | 'list')}>
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="board" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-20" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map(j => (
                        <Skeleton key={j} className="h-24 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="bg-slate-50 dark:bg-slate-800">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                    To Do ({tasksByStatus.todo.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                  {tasksByStatus.todo.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
                  ) : (
                    tasksByStatus.todo.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-slate-50 dark:bg-slate-800">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                    In Progress ({tasksByStatus.in_progress.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                  {tasksByStatus.in_progress.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
                  ) : (
                    tasksByStatus.in_progress.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-slate-50 dark:bg-slate-800">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Done ({tasksByStatus.done.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                  {tasksByStatus.done.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
                  ) : (
                    tasksByStatus.done.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : tasks.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">No tasks found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {tasks.map(task => (
                    <div key={task.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <TaskCard
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        onSubmit={handleSubmitTask}
        projects={projects}
        users={users}
        parentTasks={tasks.map(task => ({ id: task.id, title: task.title }))}
      />
    </div>
  );
}
