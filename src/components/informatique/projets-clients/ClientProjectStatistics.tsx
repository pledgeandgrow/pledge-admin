import { Card, CardContent } from "@/components/ui/card";
import { ClientProjectStatisticsType } from "./types";
import { Clock, CheckCircle2, AlertCircle, FolderGit2 } from "lucide-react";

interface ClientProjectStatisticsProps {
  statistics: ClientProjectStatisticsType;
}

export function ClientProjectStatistics({ statistics }: ClientProjectStatisticsProps) {
  const stats = [
    {
      title: "Total des projets",
      value: statistics.total,
      icon: FolderGit2,
      color: "text-blue-500",
    },
    {
      title: "En cours",
      value: statistics.enCours,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Terminés",
      value: statistics.termine,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: "En retard",
      value: statistics.enRetard,
      icon: AlertCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
