import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';

// Create supabase client once outside the hook to avoid recreating on every render
const supabase = createClient();

// Task status values from schema
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'blocked' | 'done' | 'archived';
// Task priority values from schema (lowercase)
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  project_id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_by?: string;
  assignee_ids?: string[];
  start_at?: Date | string;
  due_at?: Date | string;
  completed_at?: Date | string;
  progress?: number;
  estimate_hours?: number;
  actual_hours?: number;
  parent_task_id?: string;
  order_index?: number;
  comments?: Record<string, unknown>[];
  info?: Record<string, unknown>;
  tags?: string[];
  created_at: Date | string;
  updated_at: Date | string;
}

export interface TaskWithProject extends Task {
  project_name?: string;
  assignees?: { id: string; name: string }[];
}

interface TaskFilters {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  project_id?: string;
  assignee_id?: string;
  due_before?: Date;
  due_after?: Date;
  search?: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<TaskWithProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      // Start with a query that joins tasks with projects to get project names
      let query = supabase
        .from('tasks')
        .select(`
          *,
          projects:project_id (
            name
          )
        `);
      
      // Apply filters if provided
      if (filters) {
        if (filters.status) {
          const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
          query = query.in('status', statuses);
        }
        
        if (filters.priority) {
          const priorities = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
          query = query.in('priority', priorities);
        }
        
        if (filters.project_id) {
          query = query.eq('project_id', filters.project_id);
        }
        
        if (filters.assignee_id) {
          // For array columns, we need to use the contains operator
          query = query.contains('assignee_ids', [filters.assignee_id]);
        }
        
        if (filters.due_before) {
          query = query.lte('due_at', filters.due_before.toISOString());
        }
        
        if (filters.due_after) {
          query = query.gte('due_at', filters.due_after.toISOString());
        }
        
        if (filters.search) {
          query = query.ilike('title', `%${filters.search}%`);
        }
      }
      
      // Add ordering by priority (high to low) and due date (soonest first)
      query = query.order('priority', { ascending: false })
                   .order('due_at', { ascending: true, nullsLast: true });
      
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Transform the data to include project name
      const transformedData: TaskWithProject[] = data.map((task: Task & { projects?: { name: string } }) => ({
        ...task,
        project_name: task.projects?.name,
        // Convert date strings to Date objects for easier handling in UI
        start_at: task.start_at ? new Date(task.start_at) : undefined,
        due_at: task.due_at ? new Date(task.due_at) : undefined,
        completed_at: task.completed_at ? new Date(task.completed_at) : undefined,
        created_at: new Date(task.created_at),
        updated_at: new Date(task.updated_at)
      }));

      console.log('✅ Fetched', transformedData.length, 'tasks');
      setTasks(transformedData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch tasks');
      console.error('❌ Error fetching tasks:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps - function is stable

  const createTask = useCallback(async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Format dates to ISO strings for Supabase
      const formattedTask = {
        ...task,
        start_at: task.start_at instanceof Date ? task.start_at.toISOString() : task.start_at,
        due_at: task.due_at instanceof Date ? task.due_at.toISOString() : task.due_at,
        completed_at: task.completed_at instanceof Date ? task.completed_at.toISOString() : task.completed_at
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(formattedTask)
        .select(`
          *,
          projects:project_id (
            name
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      // Transform the new task
      const newTask: TaskWithProject = {
        ...data,
        project_name: data.projects?.name,
        start_at: data.start_at ? new Date(data.start_at) : undefined,
        due_at: data.due_at ? new Date(data.due_at) : undefined,
        completed_at: data.completed_at ? new Date(data.completed_at) : undefined,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      console.log('✅ Task created:', newTask.title);
      // Add the new task to the state
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create task');
      console.error('Error creating task:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps - function is stable

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Format dates to ISO strings for Supabase
      const formattedUpdates = {
        ...updates,
        start_at: updates.start_at instanceof Date ? updates.start_at.toISOString() : updates.start_at,
        due_at: updates.due_at instanceof Date ? updates.due_at.toISOString() : updates.due_at,
        completed_at: updates.completed_at instanceof Date ? updates.completed_at.toISOString() : updates.completed_at
      };

      const { data, error } = await supabase
        .from('tasks')
        .update(formattedUpdates)
        .eq('id', id)
        .select(`
          *,
          projects:project_id (
            name
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      // Transform the updated task
      const updatedTask: TaskWithProject = {
        ...data,
        project_name: data.projects?.name,
        start_at: data.start_at ? new Date(data.start_at) : undefined,
        due_at: data.due_at ? new Date(data.due_at) : undefined,
        completed_at: data.completed_at ? new Date(data.completed_at) : undefined,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      console.log('✅ Task updated:', updatedTask.title);
      // Update the task in the state
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update task');
      console.error('Error updating task:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps - function is stable

  const deleteTask = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      console.log('✅ Task deleted:', id);
      // Remove the task from the state
      setTasks(prev => prev.filter(task => task.id !== id));
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete task');
      console.error('Error deleting task:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps - function is stable

  // Get task statistics
  const getTaskStatistics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('status, priority');
      
      if (error) {
        throw error;
      }
      
      const stats = {
        total: data.length,
        byStatus: {
          todo: data.filter((t: Task) => t.status === 'todo').length,
          in_progress: data.filter((t: Task) => t.status === 'in_progress').length,
          in_review: data.filter((t: Task) => t.status === 'in_review').length,
          blocked: data.filter((t: Task) => t.status === 'blocked').length,
          done: data.filter((t: Task) => t.status === 'done').length,
          archived: data.filter((t: Task) => t.status === 'archived').length
        },
        byPriority: {
          low: data.filter((t: Task) => t.priority === 'low').length,
          medium: data.filter((t: Task) => t.priority === 'medium').length,
          high: data.filter((t: Task) => t.priority === 'high').length,
          urgent: data.filter((t: Task) => t.priority === 'urgent').length
        }
      };
      
      return stats;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get task statistics');
      console.error('Error getting task statistics:', error);
      return {
        total: 0,
        byStatus: { todo: 0, in_progress: 0, in_review: 0, blocked: 0, done: 0, archived: 0 },
        byPriority: { low: 0, medium: 0, high: 0, urgent: 0 }
      };
    }
  }, []); // Empty deps - function is stable

  // Load tasks on component mount
  useEffect(() => {
    console.log('🚀 useTasks: Initial fetch on mount');
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskStatistics
  };
};

export default useTasks;
