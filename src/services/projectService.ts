import { createClient } from '@/lib/supabase';

// Initialize Supabase client
const supabase = createClient();

// Project types
export type ProjectType = 'Client' | 'Internal' | 'Partner' | 'Lead';
export type ProjectStatus = 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

// Base project interface matching the database schema
export interface BaseProject {
  id?: string;
  name: string;
  description?: string;
  project_type: ProjectType;
  status: ProjectStatus;
  start_date?: string;
  end_date?: string;
  budget?: number;
  primary_contact_id?: string;
  team_contacts?: Array<{ id: string; role: string }>;
  contact_roles?: Record<string, { role: string; permissions?: string[]; notes?: string }>;
  tags?: string[];
  priority?: ProjectPriority;
  progress?: number;
  metadata?: Record<string, string | number | boolean | null | string[] | Record<string, unknown>>;
  created_at?: string;
  updated_at?: string;
}

// Project service functions
export const projectService = {
  // Get all projects
  getAllProjects: async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching all projects:', err);
      return [];
    }
  },

  // Get projects by type
  getProjectsByType: async (projectType: ProjectType) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('project_type', projectType)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`Error fetching ${projectType} projects:`, err);
      return [];
    }
  },

  // Get client projects
  getClientProjects: async () => {
    return await projectService.getProjectsByType('Client');
  },

  // Get internal projects
  getInternalProjects: async () => {
    return await projectService.getProjectsByType('Internal');
  },

  // Get project by ID
  getProjectById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching project by ID:', err);
      return null;
    }
  },

  // Create a new project
  createProject: async (project: BaseProject) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error('Error creating project:', err);
      return { success: false, error: err };
    }
  },

  // Update an existing project
  updateProject: async (id: string, project: Partial<BaseProject>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error('Error updating project:', err);
      return { success: false, error: err };
    }
  },

  // Delete a project
  deleteProject: async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error deleting project:', err);
      return { success: false, error: err };
    }
  },

  // Get project statistics
  getProjectStatistics: async (projectType: ProjectType) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('status')
        .eq('project_type', projectType);
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        active: data.filter(p => p.status === 'Active').length,
        completed: data.filter(p => p.status === 'Completed').length,
        onHold: data.filter(p => p.status === 'On Hold').length,
        cancelled: data.filter(p => p.status === 'Cancelled').length
      };
      
      return stats;
    } catch (err) {
      console.error('Error getting project statistics:', err);
      return {
        total: 0,
        active: 0,
        completed: 0,
        onHold: 0,
        cancelled: 0
      };
    }
  },

  // Get client project statistics
  getClientProjectStatistics: async () => {
    return await projectService.getProjectStatistics('Client');
  },

  // Get internal project statistics
  getInternalProjectStatistics: async () => {
    return await projectService.getProjectStatistics('Internal');
  }
};
