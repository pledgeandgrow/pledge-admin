import { Card, CardContent } from "@/components/ui/card";
import { SpecificationStatisticsType } from "./types";

interface SpecificationStatisticsProps {
  statistics: SpecificationStatisticsType;
}

export function SpecificationStatistics({ statistics }: SpecificationStatisticsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{statistics.total}</div>
          <p className="text-xs text-muted-foreground">Total</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-yellow-500">{statistics.draft}</div>
          <p className="text-xs text-muted-foreground">Brouillons</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-blue-500">{statistics.review}</div>
          <p className="text-xs text-muted-foreground">En revue</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-500">{statistics.approved}</div>
          <p className="text-xs text-muted-foreground">Approuvés</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-gray-500">{statistics.archived}</div>
          <p className="text-xs text-muted-foreground">Archivés</p>
        </CardContent>
      </Card>
    </div>
  );
}
