import { TestStatistics as TestStatisticsType } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Beaker,
  GitMerge,
  MonitorPlay,
  Zap,
  Shield,
  Accessibility,
  MoreHorizontal,
  FileText,
  PlayCircle,
  CheckCircle2,
  XCircle,
  PauseCircle,
  AlertCircle,
  Monitor,
} from 'lucide-react';

interface TestStatisticsProps {
  statistics: TestStatisticsType;
}

export function TestStatistics({ statistics }: TestStatisticsProps) {
  const typeStats = [
    {
      name: 'Tests unitaires',
      value: statistics.by_type.unit,
      icon: Beaker,
      color: 'text-blue-500',
    },
    {
      name: 'Tests d\'intégration',
      value: statistics.by_type.integration,
      icon: GitMerge,
      color: 'text-purple-500',
    },
    {
      name: 'Tests E2E',
      value: statistics.by_type.e2e,
      icon: MonitorPlay,
      color: 'text-green-500',
    },
    {
      name: 'Tests de performance',
      value: statistics.by_type.performance,
      icon: Zap,
      color: 'text-yellow-500',
    },
    {
      name: 'Tests de sécurité',
      value: statistics.by_type.security,
      icon: Shield,
      color: 'text-red-500',
    },
    {
      name: 'Tests d\'accessibilité',
      value: statistics.by_type.accessibility,
      icon: Accessibility,
      color: 'text-pink-500',
    },
    {
      name: 'Autres',
      value: statistics.by_type.other,
      icon: MoreHorizontal,
      color: 'text-gray-500',
    },
  ];

  const statusStats = [
    {
      name: 'Brouillon',
      value: statistics.by_status.draft,
      icon: FileText,
      color: 'text-gray-500',
    },
    {
      name: 'En cours',
      value: statistics.by_status.in_progress,
      icon: PlayCircle,
      color: 'text-yellow-500',
    },
    {
      name: 'Réussi',
      value: statistics.by_status.passed,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      name: 'Échoué',
      value: statistics.by_status.failed,
      icon: XCircle,
      color: 'text-red-500',
    },
    {
      name: 'Bloqué',
      value: statistics.by_status.blocked,
      icon: PauseCircle,
      color: 'text-orange-500',
    },
    {
      name: 'Ignoré',
      value: statistics.by_status.skipped,
      icon: AlertCircle,
      color: 'text-blue-500',
    },
  ];

  const environmentStats = [
    {
      name: 'Développement',
      value: statistics.by_environment.development,
      icon: Monitor,
      color: 'text-blue-500',
    },
    {
      name: 'Pré-production',
      value: statistics.by_environment.staging,
      icon: Monitor,
      color: 'text-yellow-500',
    },
    {
      name: 'Production',
      value: statistics.by_environment.production,
      icon: Monitor,
      color: 'text-green-500',
    },
  ];

  return (
    <Card>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="type">Par Type</TabsTrigger>
          <TabsTrigger value="status">Par Statut</TabsTrigger>
          <TabsTrigger value="environment">Par Environnement</TabsTrigger>
        </TabsList>
        <CardContent className="pt-6">
          <TabsContent value="overview" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Taux de réussite</div>
                <div className="flex items-center gap-2">
                  <Progress value={statistics.success_rate} className="flex-1" />
                  <span className="text-sm font-medium">{statistics.success_rate}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Temps d'exécution moyen</div>
                <div className="text-2xl font-bold">
                  {statistics.average_execution_time}s
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Tests totaux</div>
                <div className="text-2xl font-bold">{statistics.total}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Tests réussis</div>
                <div className="text-2xl font-bold text-green-500">
                  {statistics.by_status.passed}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="type" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {typeStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.name}
                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-card"
                  >
                    <Icon className={`h-8 w-8 ${stat.color} mb-2`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground text-center">
                      {stat.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="status" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {statusStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.name}
                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-card"
                  >
                    <Icon className={`h-8 w-8 ${stat.color} mb-2`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground text-center">
                      {stat.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="environment" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {environmentStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.name}
                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-card"
                  >
                    <Icon className={`h-8 w-8 ${stat.color} mb-2`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground text-center">
                      {stat.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
