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
import { useProjects } from '@/hooks/useProjects';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { ProjectType } from '@/types/project';

export default function ProjectsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const router = useRouter();
  
  const { 
    projects, 
    isLoading, 
    error, 
    createProject,
    isCreating
  } = useProjects();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load projects. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error]);

  const handleCreateProject = async (projectData: Partial<ProjectType>) => {
    try {
      const newProject = await createProject(projectData);
      setIsDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
      router.push(`/projects/${newProject.id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    }
  };

  const handleViewProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
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
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Gestion des Projets
        </h1>
        <p className="text-muted-foreground">
          Gérez vos projets et suivez leur avancement
        </p>
      </div>
      
      <Separator className="my-6" />
      
      <div className="flex justify-between items-center">
        <div></div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
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

      {isLoading ? (
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
            <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
              Créer un projet
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => handleViewProject(project.id)} 
            />
          ))}
        </div>
      )}

      <ProjectDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateProject}
        isSubmitting={isCreating}
      />
    </div>
  );
}
