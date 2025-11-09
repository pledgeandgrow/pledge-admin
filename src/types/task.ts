export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'blocked' | 'done' | 'archived';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  created_by: string | null;
  assignee_ids: string[] | null;
  start_at: string | null;
  due_at: string | null;
  completed_at: string | null;
  progress: number;
  estimate_hours: number | null;
  actual_hours: number | null;
  parent_task_id: string | null;
  order_index: number;
  comments: Record<string, unknown>[]; // Array of comment objects
  info: Record<string, unknown>; // Additional metadata
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface TaskWithDetails extends Task {
  // Add any additional fields from joined tables
  project_name?: string;
  assignees?: Array<{
    id: string;
    name: string;
    avatar_url?: string;
  }>;
  created_by_user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface TaskFormData extends Omit<Task, 'id' | 'created_at' | 'updated_at' | 'comments' | 'info'> {
  // Form-specific fields can be added here
}

export interface TaskFilters {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  assignee_id?: string;
  project_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}
