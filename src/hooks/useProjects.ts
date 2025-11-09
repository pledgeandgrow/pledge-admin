import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { retryWithBackoff } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Project types
export type ProjectType = 'Client' | 'Internal' | 'External' | 'Partner' | 'Lead';
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

interface ProjectFilters {
  type?: ProjectType | ProjectType[];
  status?: ProjectStatus | ProjectStatus[];
  priority?: ProjectPriority | ProjectPriority[];
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: keyof BaseProject;
  sortOrder?: 'asc' | 'desc';
}

interface UseProjectsOptions {
  type?: ProjectType | ProjectType[];
  initialFilters?: ProjectFilters;
  autoFetch?: boolean;
}

interface UseProjectsReturn {
  projects: BaseProject[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  fetchProjects: (filters?: ProjectFilters) => Promise<void>;
  createProject: (project: Omit<BaseProject, 'id' | 'created_at' | 'updated_at'>) => Promise<BaseProject>;
  updateProject: (id: string, project: Partial<BaseProject>) => Promise<BaseProject>;
  deleteProject: (id: string) => Promise<boolean>;
  filters: ProjectFilters;
  setFilters: (filters: ProjectFilters) => void;
  refetch: () => Promise<void>;
}

export const useProjects = (options: UseProjectsOptions = {}): UseProjectsReturn => {
  const { type, initialFilters = {}, autoFetch = true } = options;
  const supabase = createClient();
  
  const [projects, setProjects] = useState<BaseProject[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filters, setFilters] = useState<ProjectFilters>({
    ...initialFilters,
    type: type || initialFilters.type,
  });
  
  // Request deduplication: track in-flight requests
  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const filtersRef = useRef(filters);
  
  // Keep filtersRef in sync with filters state
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchProjects = useCallback(async (newFilters?: ProjectFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use ref to get the latest filters without causing re-renders
      const currentFilters = newFilters || filtersRef.current;
      const mergedFilters = newFilters ? { ...filtersRef.current, ...newFilters } : currentFilters;
      
      // Cancel previous request if still in flight
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
      }
      
      // Create new abort controller for this request
      fetchAbortControllerRef.current = new AbortController();
      
      // Fetch projects with retry logic
      let data: BaseProject[] = [];
      
      await retryWithBackoff(async () => {
        let query = supabase.from('projects').select('*');
        
        // Apply type filter if specified
        if (mergedFilters.type) {
          const projectType = Array.isArray(mergedFilters.type) 
            ? mergedFilters.type[0]
            : mergedFilters.type;
          query = query.eq('project_type', projectType);
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data: fetchedData, error: fetchError } = await query;
        if (fetchError) {throw fetchError;}
        data = fetchedData || [];
      }, 3, 1000);
      
      // Apply additional filters client-side
      let filteredData = [...data];
      
      // Status filter
      if (mergedFilters.status) {
        const statusFilters = Array.isArray(mergedFilters.status) 
          ? mergedFilters.status 
          : [mergedFilters.status];
        filteredData = filteredData.filter(project => 
          statusFilters.includes(project.status)
        );
      }
      
      // Priority filter
      if (mergedFilters.priority) {
        const priorityFilters = Array.isArray(mergedFilters.priority) 
          ? mergedFilters.priority 
          : [mergedFilters.priority];
        filteredData = filteredData.filter(project => 
          project.priority && priorityFilters.includes(project.priority)
        );
      }
      
      // Search filter
      if (mergedFilters.search) {
        const searchTerm = mergedFilters.search.toLowerCase();
        filteredData = filteredData.filter(project => 
          project.name.toLowerCase().includes(searchTerm) ||
          (project.description && project.description.toLowerCase().includes(searchTerm))
        );
      }
      
      // Sort
      if (mergedFilters.sortBy) {
        const sortField = mergedFilters.sortBy;
        const sortOrder = mergedFilters.sortOrder === 'desc' ? -1 : 1;
        
        filteredData.sort((a, b) => {
          const valueA = a[sortField];
          const valueB = b[sortField];
          
          // Handle undefined values
          if (valueA === undefined && valueB === undefined) {return 0;}
          if (valueA === undefined) {return sortOrder;}
          if (valueB === undefined) {return -sortOrder;}
          
          // Handle string comparison
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return sortOrder * valueA.localeCompare(valueB);
          }
          
          // Handle numeric comparison
          if (valueA < valueB) {return -1 * sortOrder;}
          if (valueA > valueB) {return 1 * sortOrder;}
          return 0;
        });
      }
      
      // Pagination
      const totalItems = filteredData.length;
      setTotalCount(totalItems);
      
      if (mergedFilters.limit) {
        const offset = mergedFilters.offset || 0;
        filteredData = filteredData.slice(offset, offset + mergedFilters.limit);
      }
      
      setProjects(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const refetch = useCallback(() => fetchProjects(), [fetchProjects]);

  const createProject = useCallback(async (project: Omit<BaseProject, 'id' | 'created_at' | 'updated_at'>): Promise<BaseProject> => {
    try {
      console.log('useProjects.createProject called with:', project);
      
      // Validate required fields
      if (!project.name || !project.project_type || !project.status) {
        const error = new Error('Missing required fields for project creation');
        console.error('Validation error in useProjects:', error, { project });
        setError(error);
        throw error;
      }
      
      console.log('Project validation passed');

      // Ensure project has proper structure according to SQL schema
      const projectToCreate: Omit<BaseProject, 'id' | 'created_at' | 'updated_at'> = {
        ...project,
        // Ensure these fields match the SQL schema
        name: project.name,
        project_type: project.project_type,
        status: project.status,
        // Set defaults for optional fields if not provided
        description: project.description || '',
        tags: project.tags || [],
        priority: project.priority || 'Medium',
        progress: project.progress !== undefined ? project.progress : 0,
        // Initialize empty metadata if not provided
        metadata: project.metadata || {}
      };

      console.log('Creating project with:', projectToCreate);
      
      const { data, error: createError } = await supabase
        .from('projects')
        .insert(projectToCreate)
        .select()
        .single();
      
      if (createError) {
        throw createError;
      }
      
      if (!data) {
        const error = new Error('Failed to create project: No data returned');
        console.error('No data returned from project creation');
        setError(error);
        throw error;
      }
      
      const result = data as BaseProject;
      
      // Update local state
      setProjects(prev => [result, ...prev]);
      
      toast({
        title: "Projet créé",
        description: `Le projet ${result.name} a été créé avec succès`,
      });
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create project');
      setError(error);
      
      toast({
        title: "Erreur",
        description: `Impossible de créer le projet: ${error.message}`,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [supabase]);

  const updateProject = useCallback(async (id: string, projectUpdate: Partial<BaseProject>): Promise<BaseProject> => {
    try {
      // Ensure we're not sending undefined values
      const cleanedUpdate = {} as Partial<BaseProject>;
      
      // Manually assign values to avoid TypeScript errors
      Object.entries(projectUpdate).forEach(([key, value]) => {
        if (value !== undefined) {
          // Using type assertion with a safer approach than 'any'
          (cleanedUpdate as Record<string, unknown>)[key] = value;
        }
      });

      const { data, error: updateError } = await supabase
        .from('projects')
        .update(cleanedUpdate)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) {
        throw updateError;
      }
      
      if (!data) {
        const error = new Error('Failed to update project: No data returned');
        setError(error);
        throw error;
      }
      
      const result = data as BaseProject;
      
      // Update local state
      setProjects(prev => 
        prev.map(p => p.id === id ? { ...p, ...result } : p)
      );
      
      toast({
        title: "Projet mis à jour",
        description: `Le projet ${result.name} a été mis à jour avec succès`,
      });
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update project');
      setError(error);
      
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le projet: ${error.message}`,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [supabase]);

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Update local state
      setProjects(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Projet supprimé",
        description: "Le projet a été supprimé avec succès",
      });
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete project');
      setError(error);
      
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le projet: ${error.message}`,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [supabase]);

  // Fetch projects on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchProjects();
    }
    
    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
      }
    };
  }, [fetchProjects]); // Include fetchProjects to use latest version

  return {
    projects,
    loading,
    error,
    totalCount,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    filters,
    setFilters,
    refetch,
  };
};

export default useProjects;
