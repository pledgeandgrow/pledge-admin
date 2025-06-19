'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ClientProjectCard } from '@/components/informatique/projets-clients/ClientProjectCard';
import { ClientProjectForm } from '@/components/informatique/projets-clients/ClientProjectForm';
import { ClientProjectStatistics } from '@/components/informatique/projets-clients/ClientProjectStatistics';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Types temporaires en attendant l'implémentation des composants
interface ClientProjectType {
  id: string;
  name: string;
  client: string;
  status: string;
  deadline: string;
  description: string;
}

interface ClientProjectStatisticsType {
  total: number;
  active: number;
  completed: number;
  delayed: number;
}

export default function ProjetsClientsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ClientProjectType[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ClientProjectType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState<ClientProjectStatisticsType>({
    total: 0,
    active: 0,
    completed: 0,
    delayed: 0
  });

  // Define fetchProjectsData with useCallback to avoid React Hook warnings
  const fetchProjectsData = useCallback(async () => {
    try {
      const response = await fetch('/api/client-projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects);
      setStatistics(data.statistics);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in client project operation:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les projets clients',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  }, [toast, setProjects, setStatistics, setIsLoading]);
  
  // Using useEffect with proper dependency array
  useEffect(() => {
    fetchProjectsData();
  }, [fetchProjectsData]);

  // Removed unused fetchProjects function

  const handleCreateProject = async (project: Omit<ClientProjectType, 'id'>) => {
    try {
      const response = await fetch('/api/client-projects', {
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
      console.error('Error in client project operation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = async (project: ClientProjectType) => {
    try {
      const response = await fetch('/api/client-projects', {
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
      console.error('Error in client project operation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le projet.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/client-projects?id=${projectId}`, {
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
      console.error('Error in client project operation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le projet.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1 min-h-screen overflow-auto">
        <div className="max-w-7xl mx-auto py-4">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Projets Clients
                </h1>
                <p className="text-muted-foreground">
                  Gérez vos projets clients et suivez leur progression
                </p>
              </div>
              <Button onClick={() => setIsCreating(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouveau Projet
              </Button>
            </div>

            {/* Statistics */}
            <div className="rounded-lg border bg-card">
              <ClientProjectStatistics statistics={statistics} />
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  Chargement des projets...
                </div>
              ) : projects.length > 0 ? (
                projects.map(project => (
                  <ClientProjectCard
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
          <ClientProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <ClientProjectForm
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
