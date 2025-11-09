export interface ProjectType {
  id: string;
  name: string;
  description?: string;
  project_type: string;
  status: string;
  priority: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  progress?: number;
  primary_contact_id?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  metadata?: {
    client_name?: string;
    primary_contact_name?: string;
    team_members?: string[];
    budget_unit?: string;
    budget_spent?: number;
    phases?: {
      name: string;
      start_date: string;
      end_date: string;
      status: string;
      progress: number;
    }[];
    notes?: string;
    [key: string]: unknown;
  };
}

export interface ProjectTaskType {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  progress: number;
  start_at?: string;
  due_at?: string;
  completed_at?: string;
  assignee_id?: string;
  assignee_name?: string;
  project_id: string;
  parent_task_id?: string;
  tags?: string[];
  comments?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectResourceType {
  id: string;
  project_id: string;
  user_id: string;
  user_name?: string;
  role: string;
  allocation_percentage: number;
  start_date?: string;
  end_date?: string;
  hourly_rate?: number;
  status: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    notes?: string;
    skills?: string[];
    [key: string]: unknown;
  };
}

export interface ProjectDocumentType {
  id: string;
  project_id: string;
  name: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  description?: string;
  version?: string;
  status?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}
