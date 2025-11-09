import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Eye, Edit } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BaseProject } from '@/hooks/useProjects';

interface ProjectCardProps {
  project: BaseProject;
  _onClick?: () => void;
  onView?: () => void;
  onEdit?: () => void;
}

export function ProjectCard({ project, _onClick, onView, onEdit }: ProjectCardProps) {
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

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {return null;}
    try {
      return format(parseISO(dateString), "d MMM yyyy", { locale: fr });
    } catch {
      return null;
    }
  };

  const startDate = formatDate(project.start_date);
  const endDate = formatDate(project.end_date);

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800"
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge 
              variant={getProjectTypeInfo(project.project_type).variant}
              className="text-xs font-medium"
            >
              {getProjectTypeInfo(project.project_type).label}
            </Badge>
            <Badge variant={getStatusVariant(project.status)}>
              {project.status}
            </Badge>
          </div>
          
          <h3 className="text-xl font-semibold line-clamp-1">{project.name}</h3>
          
          {project.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {project.description}
            </p>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progression</span>
              <span className="font-medium">{project.progress ?? 0}%</span>
            </div>
            <Progress 
              value={project.progress ?? 0} 
              className="h-2" 
              indicatorClassName={`${(project.progress ?? 0) > 66 ? 'bg-green-500' : (project.progress ?? 0) > 33 ? 'bg-amber-500' : 'bg-red-500'}`}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {startDate && endDate 
                  ? `${startDate} - ${endDate}`
                  : startDate 
                    ? `Début: ${startDate}`
                    : endDate 
                      ? `Fin: ${endDate}`
                      : 'Dates non définies'}
              </span>
            </div>
            
            {project.metadata?.team_members && Array.isArray(project.metadata.team_members) && project.metadata.team_members.length > 0 && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4 mr-1" />
                <span>{(project.metadata.team_members as string[]).length}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
