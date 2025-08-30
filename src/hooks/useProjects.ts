import { useState, useEffect, useCallback } from 'react';
import { projectService } from '@/services/projectService';
import { BaseProject, ProjectType, ProjectStatus, ProjectPriority } from '@/services/projectService';
import { toast } from '@/components/ui/use-toast';
// Removed unused import: import { v4 as uuidv4 } from 'uuid';

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
  
  const [projects, setProjects] = useState<BaseProject[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filters, setFilters] = useState<ProjectFilters>({
    ...initialFilters,
    type: type || initialFilters.type,
  });

  const fetchProjects = useCallback(async (newFilters?: ProjectFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedFilters = newFilters ? { ...filters, ...newFilters } : filters;
      
      // Fetch projects with the current filters
      let data: BaseProject[] = [];
      
      if (mergedFilters.type) {
        // If type filter is specified, use getProjectsByType
        const projectType = Array.isArray(mergedFilters.type) 
          ? mergedFilters.type[0] // Use first type if multiple are specified
          : mergedFilters.type;
        // getProjectsByType returns array directly
        data = await projectService.getProjectsByType(projectType);
      } else {
        // Otherwise get all projects
        // getAllProjects returns array directly
        data = await projectService.getAllProjects();
      }
      
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
          if (valueA === undefined && valueB === undefined) return 0;
          if (valueA === undefined) return sortOrder;
          if (valueB === undefined) return -sortOrder;
          
          // Handle string comparison
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return sortOrder * valueA.localeCompare(valueB);
          }
          
          // Handle numeric comparison
          if (valueA < valueB) return -1 * sortOrder;
          if (valueA > valueB) return 1 * sortOrder;
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
  }, [filters]);

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

      console.log('Calling projectService.createProject with:', projectToCreate);
      const response = await projectService.createProject(projectToCreate);
      console.log('projectService.createProject response:', response);
      
      if (!response || !response.success || !response.data) {
        const error = new Error('Failed to create project: Invalid response');
        console.error('Invalid response from projectService.createProject:', response);
        setError(error);
        throw error;
      }
      
      // Extract the actual project data from the response
      const result = response.data as BaseProject;
      
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
  }, []);

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

      const response = await projectService.updateProject(id, cleanedUpdate);
      
      if (!response || !response.success || !response.data) {
        const error = new Error('Failed to update project: Invalid response');
        setError(error);
        throw error;
      }
      
      // Extract the actual project data from the response
      const result = response.data as BaseProject;
      
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
  }, []);

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await projectService.deleteProject(id);
      
      if (!response || !response.success) {
        const error = new Error('Failed to delete project');
        setError(error);
        throw error;
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
  }, []);

  // Fetch projects on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchProjects();
    }
  }, [autoFetch, fetchProjects]);

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
