import { TechnologyStatistics as TechnologyStatisticsType } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Code2, Box, Library, Wrench, Database, Cloud } from 'lucide-react';

interface TechnologyStatisticsProps {
  statistics: TechnologyStatisticsType;
}

export function TechnologyStatistics({ statistics }: TechnologyStatisticsProps) {
  const stats = [
    {
      name: 'Frameworks',
      value: statistics.frameworks,
      icon: Box,
      color: 'text-blue-500',
    },
    {
      name: 'Langages',
      value: statistics.languages,
      icon: Code2,
      color: 'text-green-500',
    },
    {
      name: 'Bibliothèques',
      value: statistics.libraries,
      icon: Library,
      color: 'text-purple-500',
    },
    {
      name: 'Outils',
      value: statistics.tools,
      icon: Wrench,
      color: 'text-orange-500',
    },
    {
      name: 'Bases de données',
      value: statistics.databases,
      icon: Database,
      color: 'text-red-500',
    },
    {
      name: 'Plateformes',
      value: statistics.platforms,
      icon: Cloud,
      color: 'text-cyan-500',
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat) => {
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
      </CardContent>
    </Card>
  );
}
