'use client';

import { useState, useEffect, useCallback } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import { InternalProjectCard } from '@/components/informatique/projets-interne/InternalProjectCard';
import { InternalProjectForm } from '@/components/informatique/projets-interne/InternalProjectForm';
import { InternalProjectStatistics } from '@/components/informatique/projets-interne/InternalProjectStatistics';
import { InternalProjectStatisticsType, InternalProjectType } from '@/components/informatique/projets-interne/types';
import { useToast } from '@/components/ui/use-toast';
import { projectService, BaseProject, ProjectStatus } from '@/services/projectService';

const ProjetsInternesPage = () => {
  const [projects, setProjects] = useState<InternalProjectType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<InternalProjectType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<InternalProjectType | null>(null);
  const [statistics, setStatistics] = useState<InternalProjectStatisticsType>({
    total: 0,
    enCours: 0,
    termine: 0,
    enRetard: 0
  });
  
  const { toast } = useToast();
  
  // Fetch projects using projectService
  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const internalProjects = await projectService.getInternalProjects();
      setProjects(internalProjects as InternalProjectType[]);
      setFilteredProjects(internalProjects as InternalProjectType[]);
      
      // Fetch statistics
      const stats = await projectService.getInternalProjectStatistics();
      // Convert the stats to match InternalProjectStatisticsType
      setStatistics({
        total: stats.total || 0,
        enCours: stats.active || 0,
        termine: stats.completed || 0,
        enRetard: stats.onHold || 0
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les projets internes',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Filter projects based on search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredProjects(projects);
      return;
    }
    
    const filtered = projects.filter(project => 
      project.name.toLowerCase().includes(term) ||
      project.description?.toLowerCase().includes(term) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(term)))
    );
    
    setFilteredProjects(filtered);
  };
  
  // Handle creating a new project
  const handleCreateProject = async (projectData: Partial<InternalProjectType>) => {
    try {
      // Ensure project_type is set to 'internal'
      const newProject = {
        ...projectData,
        project_type: 'Internal' as const,
        created_at: new Date().toISOString()
      };
      
      const createdProject = await projectService.createProject(newProject as BaseProject);
      
      if (createdProject) {
        // Refresh projects list
        fetchProjects();
        
        toast({
          title: 'Projet créé',
          description: 'Le projet a été créé avec succès.'
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le projet',
        variant: 'destructive'
      });
    }
  };
  
  // Handle updating an existing project
  const handleUpdateProject = async (projectData: Partial<InternalProjectType>) => {
    if (!selectedProject?.id) return;
    
    try {
      const updatedProject = {
        ...projectData,
        updated_at: new Date().toISOString()
      };
      
      await projectService.updateProject(selectedProject.id, updatedProject);
      
      // Refresh projects list
      fetchProjects();
      
      toast({
        title: 'Projet mis à jour',
        description: 'Le projet a été mis à jour avec succès.'
      });
      
      setIsDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le projet',
        variant: 'destructive'
      });
    }
  };
  
  // Handle deleting a project
  const handleDeleteProject = async (projectId: string) => {
    try {
      await projectService.deleteProject(projectId);
      
      // Refresh projects list
      fetchProjects();
      
      toast({
        title: 'Projet supprimé',
        description: 'Le projet a été supprimé avec succès.'
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le projet',
        variant: 'destructive'
      });
    }
  };
  
  // Open dialog for editing a project
  const handleEditProject = (project: InternalProjectType) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };
  
  // Handle dialog submission
  const handleDialogSubmit = (projectData: Partial<InternalProjectType>) => {
    if (selectedProject) {
      handleUpdateProject(projectData);
    } else {
      handleCreateProject(projectData);
    }
  };
  
  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  return (
    <div className="container mx-auto py-6">
      <MegaMenu />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projets Internes</h1>
        <Button onClick={() => {
          setSelectedProject(null);
          setIsDialogOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau Projet
        </Button>
      </div>
      
      {/* Statistics Section */}
      <div className="mb-8">
        <InternalProjectStatistics statistics={statistics} />
      </div>
      
      {/* Search and Filter */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Rechercher un projet..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>
      
      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Chargement des projets...</span>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <InternalProjectCard
              key={project.id}
              project={project}
              onClick={() => handleEditProject(project)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">
            {searchTerm ? 'Aucun projet ne correspond à votre recherche.' : 'Aucun projet interne n\'a été créé.'}
          </p>
          {searchTerm && (
            <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
              Effacer la recherche
            </Button>
          )}
        </div>
      )}
      
      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <InternalProjectForm
            project={selectedProject || undefined}
            onSubmit={handleDialogSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjetsInternesPage;
