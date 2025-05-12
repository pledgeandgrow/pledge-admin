import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpecificationType } from "./types";

interface SpecificationCardProps {
  specification: SpecificationType;
  onClick: () => void;
}

export function SpecificationCard({ specification, onClick }: SpecificationCardProps) {
  return (
    <Card 
      className="hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="line-clamp-2">{specification.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="text-sm text-muted-foreground line-clamp-3"
          dangerouslySetInnerHTML={{ __html: specification.content || '' }}
        />
        <div className="text-xs text-muted-foreground mt-4">
          Dernière mise à jour: {new Date(specification.updatedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
