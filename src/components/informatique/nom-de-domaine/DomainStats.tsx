import type { DomainStats as DomainStatsType } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Globe2,
  Shield,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface DomainStatsProps {
  stats: DomainStatsType;
}

export function DomainStats({ stats }: DomainStatsProps) {
  const statItems = [
    {
      label: "Total des domaines",
      value: stats.total,
      icon: Globe2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Domaines actifs",
      value: stats.active,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Expiration proche",
      value: stats.expiring_soon,
      icon: AlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Domaines expirés",
      value: stats.expired,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Avec SSL",
      value: stats.with_ssl,
      icon: Shield,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Avec Email",
      value: stats.with_email,
      icon: Mail,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div
                className={`${item.bgColor} ${item.color} p-2 rounded-lg`}
              >
                <item.icon className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
