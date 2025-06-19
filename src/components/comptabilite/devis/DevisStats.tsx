import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  ClipboardCheck,
  Clock,
  FileClock,
  FileText,
  XCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

interface DevisStats {
  total_count: number;
  draft_count: number;
  sent_count: number;
  accepted_count: number;
  refused_count: number;
  expired_count: number;
  total_amount: number;
  accepted_amount: number;
}

interface DevisStatsProps {
  stats: DevisStats;
}

export function DevisStats({ stats }: DevisStatsProps) {
  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    className = "",
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description?: string;
    className?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${className}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Aperçu</TabsTrigger>
        <TabsTrigger value="details">Détails</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total des devis"
            value={stats.total_count}
            icon={ClipboardCheck}
            description={`Montant total: ${formatCurrency(stats.total_amount)}`}
          />
          <StatCard
            title="Devis acceptés"
            value={stats.accepted_count}
            icon={CheckCircle}
            description={`Montant: ${formatCurrency(stats.accepted_amount)}`}
            className="text-green-500"
          />
          <StatCard
            title="Taux d'acceptation"
            value={`${stats.total_count > 0
              ? Math.round((stats.accepted_count / stats.total_count) * 100)
              : 0
            }%`}
            icon={ClipboardCheck}
            description={`${stats.accepted_count} acceptés sur ${stats.total_count} devis`}
          />
          <StatCard
            title="Montant moyen"
            value={formatCurrency(
              stats.total_count > 0
                ? stats.total_amount / stats.total_count
                : 0
            )}
            icon={ClipboardCheck}
          />
        </div>
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Devis en brouillon"
            value={stats.draft_count}
            icon={FileText}
            className="text-blue-500"
          />
          <StatCard
            title="Devis envoyés"
            value={stats.sent_count}
            icon={Clock}
            className="text-yellow-500"
          />
          <StatCard
            title="Devis acceptés"
            value={stats.accepted_count}
            icon={CheckCircle}
            className="text-green-500"
          />
          <StatCard
            title="Devis refusés"
            value={stats.refused_count}
            icon={XCircle}
            className="text-red-500"
          />
          <StatCard
            title="Devis expirés"
            value={stats.expired_count}
            icon={FileClock}
            className="text-gray-500"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
