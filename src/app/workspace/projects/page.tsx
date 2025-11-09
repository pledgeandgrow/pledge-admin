'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { ProjectCard } from '@/components/workspace/projects/ProjectCard';
import { ProjectDialog } from '@/components/workspace/projects/ProjectDialog';
import { ViewProjectDialog } from '@/components/workspace/projects/ViewProjectDialog';
import { useProjects } from '@/hooks/useProjects';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { BaseProject } from '@/hooks/useProjects';

export default function ProjectsPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<BaseProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const _router = useRouter();
  
  const { 
    projects, 
    loading, 
    error, 
    createProject,
    updateProject,
    deleteProject,
    fetchProjects
  } = useProjects({ autoFetch: true }); // Enable auto-fetch for projects page

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load projects. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error]);

  const handleCreateProject = async (projectData: Omit<BaseProject, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const _newProject = await createProject(projectData);
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
      // No need to fetch - hook already updates local state
    } catch (err) {
      console.error('Error creating project:', err);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateProject = async (projectData: Omit<BaseProject, 'id' | 'created_at' | 'updated_at'>) => {
    if (!selectedProject?.id) {return;}
    
    try {
      await updateProject(selectedProject.id, projectData);
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
      // No need to fetch - hook already updates local state
    } catch (err) {
      console.error('Error updating project:', err);
      toast({
        title: 'Error',
        description: 'Failed to update project',
        variant: 'destructive',
      });
    }
  };

  const _handleDeleteProject = async () => {
    if (!selectedProject?.id) {return;}
    
    if (!window.confirm('Are you sure you want to delete this project?')) {return;}
    
    try {
      await deleteProject(selectedProject.id);
      setIsEditDialogOpen(false);
      setIsViewDialogOpen(false);
      setSelectedProject(null);
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
      // No need to fetch - hook already updates local state
    } catch (err) {
      console.error('Error deleting project:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const handleViewProject = (project: BaseProject) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  };

  const handleEditProject = (project: BaseProject) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProject(null);
    setIsEditDialogOpen(true);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesType = typeFilter === 'all' || project.project_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Gestion des Projets
          </span>
        </h1>
        <p className="text-muted-foreground dark:text-gray-400">
          Gérez vos projets et suivez leur avancement
        </p>
      </div>
      
      <Separator className="my-6" />
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {error && (
            <Button 
              onClick={() => fetchProjects()} 
              variant="outline" 
              size="sm"
              className="text-orange-600 hover:text-orange-700"
            >
              Réessayer le chargement
            </Button>
          )}
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Rechercher des projets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="Active">Actif</SelectItem>
              <SelectItem value="On Hold">En pause</SelectItem>
              <SelectItem value="Completed">Terminé</SelectItem>
              <SelectItem value="Cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Client">Client</SelectItem>
              <SelectItem value="Internal">Interne</SelectItem>
              <SelectItem value="Partner">Partenaire</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Aucun projet trouvé</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {projects.length === 0 
              ? "Aucun projet n'a été créé. Commencez par créer votre premier projet." 
              : "Aucun projet ne correspond à vos critères de recherche."}
          </p>
          {projects.length === 0 && (
            <Button onClick={handleAddNew} className="mt-4">
              Créer un projet
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            project.id && (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onView={() => handleViewProject(project)}
                onEdit={() => handleEditProject(project)}
              />
            )
          ))}
        </div>
      )}

      <ViewProjectDialog
        open={isViewDialogOpen}
        onOpenChange={(open) => {
          setIsViewDialogOpen(open);
          if (!open) {
            setSelectedProject(null);
          }
        }}
        project={selectedProject}
        onEdit={() => {
          setIsViewDialogOpen(false);
          setIsEditDialogOpen(true);
        }}
      />

      <ProjectDialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedProject(null);
          }
        }}
        project={selectedProject || undefined}
        onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
        isSubmitting={loading}
      />
    </div>
  );
}
