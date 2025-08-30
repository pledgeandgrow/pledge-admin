import { Card, CardContent } from "@/components/ui/card";
import { SpecificationStatisticsType } from "./types";
import { Document } from "@/types/documents";
import { SpecificationMetadata } from "./types";
import { useMemo } from "react";

interface SpecificationStatisticsProps {
  documents: Document[];
  isLoading?: boolean;
}

export function SpecificationStatistics({ documents, isLoading = false }: SpecificationStatisticsProps) {
  // Calculate statistics from documents
  const statistics = useMemo(() => {
    const stats: SpecificationStatisticsType = {
      total: 0,
      draft: 0,
      review: 0,
      approved: 0,
      archived: 0
    };
    
    if (isLoading || !documents) return stats;
    
    stats.total = documents.length;
    
    // Count documents by status
    documents.forEach(doc => {
      const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
      if (!metadata?.status) {
        stats.draft += 1;
        return;
      }
      
      switch (metadata.status.toLowerCase()) {
        case 'draft':
          stats.draft += 1;
          break;
        case 'review':
          stats.review += 1;
          break;
        case 'approved':
          stats.approved += 1;
          break;
        case 'archived':
          stats.archived += 1;
          break;
        default:
          stats.draft += 1;
      }
    });
    
    return stats;
  }, [documents, isLoading]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-6 w-16 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-2xl font-bold">{statistics.total}</div>
          )}
          <p className="text-xs text-muted-foreground">Total</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-6 w-16 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-2xl font-bold text-yellow-500">{statistics.draft}</div>
          )}
          <p className="text-xs text-muted-foreground">Brouillons</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-6 w-16 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-2xl font-bold text-blue-500">{statistics.review}</div>
          )}
          <p className="text-xs text-muted-foreground">En revue</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-6 w-16 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-2xl font-bold text-green-500">{statistics.approved}</div>
          )}
          <p className="text-xs text-muted-foreground">Approuvés</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-6 w-16 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-2xl font-bold text-gray-500">{statistics.archived}</div>
          )}
          <p className="text-xs text-muted-foreground">Archivés</p>
        </CardContent>
      </Card>
    </div>
  );
}
