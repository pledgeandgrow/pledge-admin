'use client';

import { useState, useEffect } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PlusCircle, Search } from 'lucide-react';
import { InternalProjectCard } from '@/components/informatique/projets-interne/InternalProjectCard';
import { InternalProjectForm } from '@/components/informatique/projets-interne/InternalProjectForm';
import { InternalProjectStatistics } from '@/components/informatique/projets-interne/InternalProjectStatistics';
import { InternalProjectType, InternalProjectStatisticsType } from '@/components/informatique/projets-interne/types';
import { useToast } from '@/components/ui/use-toast';

export default function ProjetsInternesPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<InternalProjectType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<InternalProjectType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProject, setSelectedProject] = useState<InternalProjectType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState<InternalProjectStatisticsType>({
    total: 0,
    enCours: 0,
    termine: 0,
    enRetard: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Filter projects based on search query
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(tech => 
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/internal-projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
      updateStatistics(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatistics = (projectList: InternalProjectType[]) => {
    const now = new Date();
    const stats: InternalProjectStatisticsType = {
      total: projectList.length,
      enCours: projectList.filter(p => p.statut === 'En cours').length,
      termine: projectList.filter(p => p.statut === 'Terminé').length,
      enRetard: projectList.filter(p => {
        const endDate = new Date(p.dateFin.split('/').reverse().join('-'));
        return endDate < now && p.statut !== 'Terminé';
      }).length
    };
    setStatistics(stats);
  };

  const handleCreateProject = async (project: Omit<InternalProjectType, 'id'>) => {
    try {
      const response = await fetch('/api/internal-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (!response.ok) throw new Error('Failed to create project');
      const newProject = await response.json();
      
      setProjects(prev => [...prev, newProject]);
      setIsCreating(false);
      toast({
        title: "Projet créé",
        description: "Le projet a été créé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = async (project: InternalProjectType) => {
    try {
      const response = await fetch('/api/internal-projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (!response.ok) throw new Error('Failed to update project');
      const updatedProject = await response.json();
      
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      setSelectedProject(null);
      toast({
        title: "Projet mis à jour",
        description: "Les modifications ont été enregistrées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le projet.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/internal-projects?id=${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setSelectedProject(null);
      toast({
        title: "Projet supprimé",
        description: "Le projet a été supprimé avec succès.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le projet.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <MegaMenu />
      <main className="flex-1 ml-64 min-h-screen overflow-auto">
        <div className="max-w-7xl mx-auto py-4">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Projets Internes
                </h1>
                <p className="text-muted-foreground">
                  Gérez et suivez les projets internes de l&apos;entreprise
                </p>
              </div>
              <Button onClick={() => setIsCreating(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouveau Projet
              </Button>
            </div>

            {/* Statistics */}
            <div className="rounded-lg border bg-card">
              <InternalProjectStatistics statistics={statistics} />
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un projet..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  Chargement des projets...
                </div>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <InternalProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  Aucun projet trouvé
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create Project Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <InternalProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <InternalProjectForm
              project={selectedProject}
              onSubmit={handleUpdateProject}
              onCancel={() => setSelectedProject(null)}
              onDelete={() => handleDeleteProject(selectedProject.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
