import { createClient } from '@/lib/supabase';
import { Task, TaskStatus, TaskPriority } from '@/types/task';

const supabase = createClient();

export interface TaskFilters {
  project_id?: string;
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  assignee_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export const getTasks = async (filters: TaskFilters = {}) => {
  try {
    let query = supabase
      .from('tasks')
      .select('*');

    // Apply filters
    if (filters.project_id) {
      query = query.eq('project_id', filters.project_id);
    }

    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query = query.in('status', filters.status);
      } else {
        query = query.eq('status', filters.status);
      }
    }

    if (filters.priority) {
      if (Array.isArray(filters.priority)) {
        query = query.in('priority', filters.priority);
      } else {
        query = query.eq('priority', filters.priority);
      }
    }

    if (filters.assignee_id) {
      query = query.contains('assignee_ids', [filters.assignee_id]);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, (filters.offset || 0) + (filters.limit || 10) - 1);
    }

    // Apply ordering
    if (filters.orderBy) {
      query = query.order(filters.orderBy, { 
        ascending: filters.orderDirection !== 'desc',
        nullsLast: true 
      });
    } else {
      query = query.order('order_index', { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Task[];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const getTaskById = async (id: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Task;
};

export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
