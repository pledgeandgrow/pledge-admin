"use client";

import React, { useState, useEffect } from "react";
import { useProjects } from "@/hooks/useProjects";
import { ProjectForm } from "./ProjectForm";
import { ProjectCard } from "./ProjectCard";
import { BaseProject, ProjectType } from "@/services/projectService";
// import { contactService } from "@/services/contactService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface ProjectListProps {
  projectType: ProjectType;
}

export function ProjectList({ projectType }: ProjectListProps): React.ReactElement {
  // State for filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [dateRange] = useState<{ from?: Date; to?: Date }>({});
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // State for projects and UI
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProject, setSelectedProject] = useState<BaseProject | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { toast } = useToast();
  
  // Use the custom hook for project operations
  const {
    projects,
    loading: isLoading,
    // error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    refetch
  } = useProjects({
    type: projectType,
    autoFetch: true
  });
  
  // Calculate statistics from projects
  const statistics = React.useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'Active').length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    const onHold = projects.filter(p => p.status === 'On Hold').length;
    const cancelled = projects.filter(p => p.status === 'Cancelled').length;
    
    return { total, active, completed, onHold, cancelled };
  }, [projects]);

  // Filter projects based on search, status, priority, and date range
  const filteredProjects = projects.filter((project) => {
    // Search filter
    const searchMatch = search === "" || 
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      (project.description ? project.description.toLowerCase().includes(search.toLowerCase()) : false) ||
      (project.metadata?.client_name && 
        (project.metadata.client_name as string).toLowerCase().includes(search.toLowerCase()));

    // Status filter
    const statusMatch = status === "all" || 
      (status === "active" && project.status === "Active") ||
      (status === "completed" && project.status === "Completed") ||
      (status === "onHold" && project.status === "On Hold");

    // Priority filter
    const priorityMatch = priority === "all" || 
      (priority === "high" && (project.priority === "High" || project.priority === "Urgent")) ||
      (priority === "medium" && project.priority === "Medium") ||
      (priority === "low" && project.priority === "Low");

    // Date range filter
    let dateMatch = true;
    if (dateRange.from && project.start_date) {
      const startDate = new Date(project.start_date);
      dateMatch = dateMatch && startDate >= dateRange.from;
    }
    if (dateRange.to && project.end_date) {
      const endDate = new Date(project.end_date);
      dateMatch = dateMatch && endDate <= dateRange.to;
    }

    return searchMatch && statusMatch && priorityMatch && dateMatch;
  });

  // Sort filtered projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let valueA: string | number | Date | undefined;
    let valueB: string | number | Date | undefined;

    // Determine which field to sort by
    switch (sortBy) {
      case "name":
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case "status":
        valueA = a.status;
        valueB = b.status;
        break;
      case "priority":
        valueA = a.priority;
        valueB = b.priority;
        break;
      case "progress":
        valueA = a.progress;
        valueB = b.progress;
        break;
      case "start_date":
        valueA = a.start_date ? new Date(a.start_date).getTime() : 0;
        valueB = b.start_date ? new Date(b.start_date).getTime() : 0;
        break;
      case "end_date":
        valueA = a.end_date ? new Date(a.end_date).getTime() : 0;
        valueB = b.end_date ? new Date(b.end_date).getTime() : 0;
        break;
      default:
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
    }

    // Apply sort order
    if (valueA === undefined || valueB === undefined) return 0;
    
    if (sortOrder === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  // Handle project click to show details
  const handleProjectClick = (project: BaseProject) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };

  // Handle create project
  const handleCreateProject = async (project: Omit<BaseProject, "id">) => {
    try {
      console.log("Creating project with data:", project);
      
      // Make sure project has the correct project_type
      const projectWithType = {
        ...project,
        project_type: projectType
      };
      
      console.log("Project with type:", projectWithType);
      
      const result = await createProject(projectWithType);
      console.log("Create project result:", result);
      
      setIsCreating(false);
      toast({
        title: "Projet créé",
        description: "Le projet a été créé avec succès.",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet.",
        variant: "destructive",
      });
    }
  };

  // Handle update project
  const handleUpdateProject = async (project: BaseProject) => {
    try {
      console.log("Updating project with data:", project);
      
      if (project.id) {
        // Create a clean update object without undefined values
        const cleanProject = Object.entries(project).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, string | number | boolean | object | null>);
        
        console.log("Clean project data for update:", cleanProject);
        
        await updateProject(project.id, cleanProject);
        setSelectedProject(null);
        setIsCreating(false);
        setIsDetailsOpen(false);
        
        // Refetch projects to ensure the UI is updated
        await refetch();
        
        toast({
          title: "Projet mis à jour",
          description: "Les modifications ont été enregistrées.",
        });
      } else {
        throw new Error("Project ID is missing");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le projet.",
        variant: "destructive",
      });
    }
  };

  // Handle delete project
  const handleDeleteProject = async () => {
    if (!selectedProject || !selectedProject.id) return;
    
    try {
      await deleteProject(selectedProject.id);
      setSelectedProject(null);
      setIsDetailsOpen(false);
      toast({
        title: "Projet supprimé",
        description: "Le projet a été supprimé avec succès.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le projet.",
        variant: "destructive",
      });
    }
  };

  // Fetch projects on component mount or when project type changes
  useEffect(() => {
    fetchProjects({ type: projectType });
  }, [fetchProjects, projectType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="completed">Terminé</option>
              <option value="onHold">En pause</option>
            </select>
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Toutes les priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="project_type">Type</option>
              <option value="name">Nom</option>
              <option value="status">Statut</option>
              <option value="priority">Priorité</option>
              <option value="progress">Progression</option>
              <option value="start_date">Date de début</option>
              <option value="end_date">Date de fin</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 border rounded-md"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
        <Button onClick={() => setIsCreating(true)} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</div>
          <div className="text-2xl font-bold">{statistics.total}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-green-600 dark:text-green-400">Actifs</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{statistics.active}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Terminés</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statistics.completed}</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-amber-600 dark:text-amber-400">En pause</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{statistics.onHold}</div>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grille</TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="space-y-4">
          {sortedProjects.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {isLoading ? "Chargement des projets..." : "Aucun projet trouvé"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="list" className="space-y-4">
          {sortedProjects.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {isLoading ? "Chargement des projets..." : "Aucun projet trouvé"}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.metadata?.client_name && `Client: ${project.metadata.client_name} | `}
                      Statut: {project.status} | Priorité: {project.priority}
                    </p>
                  </div>
                  <div className="text-sm">
                    Progression: {project.progress}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create project dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <ProjectForm
            projectType={projectType}
            onSubmit={handleCreateProject}
            onCancel={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Project details sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Détails du projet</SheetTitle>
          </SheetHeader>
          {selectedProject && (
            <div className="space-y-6 pt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDetailsOpen(false);
                      setIsCreating(true);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteProject}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                  <p className="mt-1">{selectedProject.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priorité</h3>
                  <p className="mt-1">{selectedProject.priority}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Progression</h3>
                  <p className="mt-1">{selectedProject.progress}%</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type de projet</h3>
                  <p className="mt-1">{selectedProject.project_type}</p>
                </div>
                {selectedProject.start_date && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date de début</h3>
                    <p className="mt-1">{new Date(selectedProject.start_date).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedProject.end_date && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date de fin</h3>
                    <p className="mt-1">{new Date(selectedProject.end_date).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedProject.metadata?.client_name && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Client</h3>
                    <p className="mt-1">{selectedProject.metadata.client_name as string}</p>
                  </div>
                )}
                {selectedProject.metadata?.budget && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                    <p className="mt-1">{selectedProject.metadata.budget as string} €</p>
                  </div>
                )}
              </div>
              
              {selectedProject.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 whitespace-pre-wrap">{selectedProject.description}</p>
                </div>
              )}
              
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProject.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedProject.metadata?.team_members && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Membres de l&apos;équipe</h3>
                  <div className="mt-1">
                    {(selectedProject.metadata.team_members as string[]).map((member, index) => (
                      <div key={index} className="py-1">{member}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit project dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedProject ? (
            <ProjectForm
              project={selectedProject}
              projectType={projectType}
              onSubmit={handleUpdateProject}
              onCancel={() => setIsCreating(false)}
              onDelete={handleDeleteProject}
            />
          ) : (
            <ProjectForm
              projectType={projectType}
              onSubmit={handleCreateProject}
              onCancel={() => setIsCreating(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
