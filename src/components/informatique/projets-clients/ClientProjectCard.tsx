import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClientProjectType } from "./types";
import { CalendarDays, Users, Building } from "lucide-react";

interface ClientProjectCardProps {
  project: ClientProjectType;
  onClick: () => void;
}

export function ClientProjectCard({ project, onClick }: ClientProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-blue-500';
      case 'Terminé':
        return 'bg-green-500';
      case 'En retard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
            <CardDescription className="text-sm">{project.description}</CardDescription>
          </div>
          <Badge className={getStatusColor(project.statut)}>{project.statut}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{project.client}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{project.equipe.join(', ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{project.dateDebut} - {project.dateFin}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.technologies.map((tech, index) => (
              <Badge key={index} variant="outline">{tech}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
