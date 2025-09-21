import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Document } from "@/types/documents";
import { SpecificationMetadata } from "./types";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SpecificationCardProps {
  document: Document;
  onClick: () => void;
}

export function SpecificationCard({ document, onClick }: SpecificationCardProps) {
  // Extract metadata from document
  const metadata = document.metadata as unknown as SpecificationMetadata | undefined;
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch (error) {
      return "Date inconnue";
    }
  };
  
  // Extract client and project info
  const clientName = metadata?.client_name || "Non spécifié";
  const projectName = metadata?.project_name || "Non spécifié";
  
  // Check if there's a target completion date
  const hasTargetDate = !!metadata?.target_completion_date;
  const targetDate = hasTargetDate ? formatDate(metadata?.target_completion_date as string) : null;
  
  // Get status label
  const getStatusLabel = (status: string | undefined): string => {
    if (!status) return 'Brouillon';
    
    switch (status.toLowerCase()) {
      case 'draft':
        return 'Brouillon';
      case 'review':
        return 'En révision';
      case 'approved':
        return 'Approuvé';
      case 'archived':
        return 'Archivé';
      default:
        return status;
    }
  };

  // Get badge variant based on status
  const getBadgeVariant = (status: string | undefined) => {
    if (!status) return "secondary" as const;
    
    switch (status.toLowerCase()) {
      case 'draft':
        return 'secondary' as const;
      case 'review':
        return 'default' as const;
      case 'approved':
        return 'default' as const;
      case 'archived':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <Card 
      className="hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-2">{document.title}</CardTitle>
          <Badge variant={getBadgeVariant(metadata?.status)}>
            {getStatusLabel(metadata?.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Content preview */}
        <div 
          className="text-sm text-muted-foreground line-clamp-3"
          dangerouslySetInnerHTML={{ __html: metadata?.content || '' }}
        />
        
        {/* Client and project info */}
        {(clientName !== "Non spécifié" || projectName !== "Non spécifié") && (
          <div className="flex items-center text-xs text-muted-foreground gap-x-4">
            {clientName !== "Non spécifié" && (
              <div className="flex items-center gap-x-1">
                <Users className="h-3 w-3" />
                <span>{clientName}</span>
              </div>
            )}
            {projectName !== "Non spécifié" && (
              <div>{projectName}</div>
            )}
          </div>
        )}
        
        {/* Target date if available */}
        {hasTargetDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>Échéance: {targetDate}</span>
          </div>
        )}
        
        {/* Last updated */}
        <div className="text-xs text-muted-foreground">
          Dernière mise à jour: {formatDate(document.updated_at)}
        </div>
      </CardContent>
    </Card>
  );
}
