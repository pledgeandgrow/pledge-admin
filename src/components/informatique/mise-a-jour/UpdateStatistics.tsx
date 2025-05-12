import { UpdateStatistics as UpdateStatisticsType } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Bug, Shield, Zap, FileText, MoreHorizontal, Clock, AlertTriangle } from 'lucide-react';

interface UpdateStatisticsProps {
  statistics: UpdateStatisticsType;
}

export function UpdateStatistics({ statistics }: UpdateStatisticsProps) {
  const typeStats = [
    {
      name: 'Fonctionnalités',
      value: statistics.by_type.feature,
      icon: Star,
      color: 'text-blue-500',
    },
    {
      name: 'Corrections',
      value: statistics.by_type.bugfix,
      icon: Bug,
      color: 'text-yellow-500',
    },
    {
      name: 'Sécurité',
      value: statistics.by_type.security,
      icon: Shield,
      color: 'text-red-500',
    },
    {
      name: 'Performance',
      value: statistics.by_type.performance,
      icon: Zap,
      color: 'text-green-500',
    },
    {
      name: 'Documentation',
      value: statistics.by_type.documentation,
      icon: FileText,
      color: 'text-purple-500',
    },
    {
      name: 'Autre',
      value: statistics.by_type.other,
      icon: MoreHorizontal,
      color: 'text-gray-500',
    },
  ];

  const statusStats = [
    {
      name: 'Planifié',
      value: statistics.by_status.planned,
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      name: 'En cours',
      value: statistics.by_status.in_progress,
      icon: Zap,
      color: 'text-yellow-500',
    },
    {
      name: 'Terminé',
      value: statistics.by_status.completed,
      icon: Star,
      color: 'text-green-500',
    },
    {
      name: 'Annulé',
      value: statistics.by_status.cancelled,
      icon: MoreHorizontal,
      color: 'text-gray-500',
    },
  ];

  const priorityStats = [
    {
      name: 'Critique',
      value: statistics.by_priority.critical,
      icon: AlertTriangle,
      color: 'text-red-500',
    },
    {
      name: 'Haute',
      value: statistics.by_priority.high,
      icon: AlertTriangle,
      color: 'text-orange-500',
    },
    {
      name: 'Moyenne',
      value: statistics.by_priority.medium,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      name: 'Basse',
      value: statistics.by_priority.low,
      icon: Clock,
      color: 'text-gray-500',
    },
  ];

  return (
    <Card>
      <Tabs defaultValue="type" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="type">Par Type</TabsTrigger>
          <TabsTrigger value="status">Par Statut</TabsTrigger>
          <TabsTrigger value="priority">Par Priorité</TabsTrigger>
        </TabsList>
        <CardContent className="pt-6">
          <TabsContent value="type" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          <TabsContent value="priority" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {priorityStats.map((stat) => {
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
