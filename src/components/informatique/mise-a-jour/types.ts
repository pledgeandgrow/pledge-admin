export type UpdateType = 'feature' | 'bugfix' | 'security' | 'performance' | 'documentation' | 'other';
export type UpdateStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type UpdatePriority = 'low' | 'medium' | 'high' | 'critical';

export interface Update {
  id: string;
  title: string;
  description: string;
  type: UpdateType;
  status: UpdateStatus;
  priority: UpdatePriority;
  version: string;
  release_date?: string;
  planned_date?: string;
  affected_components: string[];
  changelog: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to?: string[];
  dependencies?: string[];
  tags: string[];
}

export interface UpdateStatistics {
  total: number;
  by_type: {
    feature: number;
    bugfix: number;
    security: number;
    performance: number;
    documentation: number;
    other: number;
  };
  by_status: {
    planned: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  by_priority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}
