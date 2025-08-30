"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { BaseProject } from "@/services/projectService";

interface ProjectCardProps {
  project: BaseProject;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps): React.ReactElement {
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
      case "External":
        return { variant: "outline", label: "Externe" };
      case "Partner":
        return { variant: "destructive", label: "Partenaire" };
      default:
        return { variant: "outline", label: type };
    }
  };

  // Format dates for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Non défini";
    try {
      return format(parseISO(dateString), "d MMM yyyy", { locale: fr });
    } catch {
      return "Date invalide";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{project.name}</CardTitle>
          <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {project.metadata?.client_name && (
            <div className="text-sm">
              <span className="font-medium">Client:</span> {project.metadata.client_name as string}
            </div>
          )}
          <div className="text-sm">
            <span className="font-medium">Dates:</span> {formatDate(project.start_date)} - {formatDate(project.end_date)}
          </div>
          {project.priority && (
            <div className="text-sm">
              <span className="font-medium">Priorité:</span>{" "}
              <Badge variant={getPriorityVariant(project.priority)} className="ml-1">
                {project.priority}
              </Badge>
            </div>
          )}
          {project.description && (
            <div className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </div>
          )}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progression</span>
              <span>{project.progress ?? 0}%</span>
            </div>
            <Progress value={project.progress ?? 0} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-wrap gap-1">
            {project.tags && project.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags && project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
          <Badge 
            variant={getProjectTypeInfo(project.project_type).variant}
            className="text-xs ml-auto"
          >
            {getProjectTypeInfo(project.project_type).label}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
