import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { BarChart3, Layers, Tag, Users, Briefcase, Calendar, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ProjectType } from '@/types/project';

interface ProjectDetailsProps {
  project: ProjectType;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  // Helper function to get status badge variant
  const getStatusVariant = (status: string): "default" | "outline" | "secondary" | "destructive" => {
    switch (status) {
      case "Active":
        return "default";
      case "Completed":
        return "secondary";
      case "On Hold":
        return "outline";
      case "Cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  // Helper function to get priority badge variant
  const getPriorityVariant = (priority: string): "default" | "outline" | "secondary" | "destructive" => {
    switch (priority) {
      case "High":
      case "Urgent":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "default";
    }
  };
  
  // Helper function to get project type badge variant and label
  const getProjectTypeInfo = (type: string): { variant: "default" | "outline" | "secondary" | "destructive"; label: string } => {
    switch (type) {
      case "Client":
        return { variant: "default", label: "Client" };
      case "Internal":
        return { variant: "secondary", label: "Interne" };
      case "Partner":
        return { variant: "destructive", label: "Partenaire" };
      case "Lead":
        return { variant: "outline", label: "Lead" };
      default:
        return { variant: "outline", label: type };
    }
  };

  // Format dates for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {return "Non définie";}
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: fr });
    } catch {
      return "Format de date invalide";
    }
  };

  return (
    <Card className="w-full shadow-md border border-gray-200 dark:border-gray-800">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant={getProjectTypeInfo(project.project_type).variant}
                  className="text-xs font-medium"
                >
                  {getProjectTypeInfo(project.project_type).label}
                </Badge>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h2>
              </div>
              {project.metadata?.client_name && (
                <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {project.metadata.client_name as string}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
            {project.priority && (
              <Badge variant={getPriorityVariant(project.priority)}>{project.priority}</Badge>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                <Tag className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                Description
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-200 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                {project.description || "Aucune description disponible."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Détails du projet</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Statut</p>
                    <Badge variant={getStatusVariant(project.status)} className="mt-1">
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Priorité</p>
                    <Badge variant={getPriorityVariant(project.priority || '')} className="mt-1">
                      {project.priority}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Date de début</p>
                    <p className="mt-1 text-gray-900 dark:text-white flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(project.start_date)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Date de fin</p>
                    <p className="mt-1 text-gray-900 dark:text-white flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(project.end_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Contact & Budget</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Contact principal</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {project.metadata?.primary_contact_name || 'Non défini'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Budget</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {project.budget ? `${project.budget.toLocaleString()} ${project.metadata?.budget_unit || '€'}` : 'Non défini'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {project.metadata?.team_members && Array.isArray(project.metadata.team_members) && project.metadata.team_members.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    <span className="font-medium text-gray-900 dark:text-white">Équipe:</span>
                    <span className="text-gray-700 dark:text-gray-200">{(project.metadata.team_members as string[]).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                <Layers className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                Budget
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Budget total</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {typeof project.budget === 'number'
                      ? `${project.budget.toLocaleString()} ${project.metadata?.budget_unit || '€'}`
                      : 'Non défini'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Budget dépensé</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {(project.metadata?.budget_spent as number) 
                      ? `${(project.metadata?.budget_spent as number).toLocaleString()} ${project.metadata?.budget_unit || '€'}`
                      : '0 €'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                Progression
              </h3>
              <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Avancement</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.progress ?? 0}%</span>
                </div>
                <Progress 
                  value={project.progress ?? 0} 
                  className="h-3" 
                  indicatorClassName={`${(project.progress ?? 0) > 66 ? 'bg-green-500' : (project.progress ?? 0) > 33 ? 'bg-amber-500' : 'bg-red-500'}`}
                />
              </div>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Tag className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  Technologies / Tags
                </h3>
                <div className="flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {project.metadata && Object.keys(project.metadata).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  Informations supplémentaires
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700 space-y-3">
                  {project.metadata && typeof project.metadata === 'object' && 'notes' in project.metadata && 
                   typeof project.metadata.notes === 'string' && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Notes</p>
                      <p className="font-medium text-gray-900 dark:text-white">{project.metadata.notes}</p>
                    </div>
                  )}
                  {project.metadata && typeof project.metadata === 'object' && 'github_repo' in project.metadata && 
                   typeof project.metadata.github_repo === 'string' && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">GitHub</p>
                      <p className="font-medium text-gray-900 dark:text-white">{project.metadata.github_repo}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
