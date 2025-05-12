'use client';

import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { InternalProjectStatisticsType } from './types';
import { Activity, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface InternalProjectStatisticsProps {
  statistics: InternalProjectStatisticsType;
}

export const InternalProjectStatistics: FC<InternalProjectStatisticsProps> = ({ statistics }) => {
  const stats = [
    {
      label: 'Total Projets',
      value: statistics.total,
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'En Cours',
      value: statistics.enCours,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Terminés',
      value: statistics.termine,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'En Retard',
      value: statistics.enRetard,
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-4">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold">
                  {stat.value}
                </h3>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
