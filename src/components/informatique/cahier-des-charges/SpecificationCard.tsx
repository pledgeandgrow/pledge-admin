import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Document } from "@/types/documents";
import { SpecificationMetadata } from "./types";
import { Badge } from "@/components/ui/badge";

interface SpecificationCardProps {
  document: Document;
  onClick: () => void;
}

export function SpecificationCard({ document, onClick }: SpecificationCardProps) {
  // Extract metadata from document
  const metadata = document.metadata as unknown as SpecificationMetadata | undefined;
  
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
      <CardContent>
        <div 
          className="text-sm text-muted-foreground line-clamp-3"
          dangerouslySetInnerHTML={{ __html: metadata?.content || '' }}
        />
        <div className="text-xs text-muted-foreground mt-4">
          Dernière mise à jour: {new Date(document.updated_at).toLocaleDateString('fr-FR')}
        </div>
      </CardContent>
    </Card>
  );
}
