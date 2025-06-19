'use client';

import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { HardDrive, Code2, Database, Wrench, Server, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TechInfo {
  name: string;
  value: string;
  version?: string;
  description?: string;
}

interface TechStackData {
  category: string;
  status: 'production' | 'development' | 'testing';
  lastUpdate: string;
  frameworks: TechInfo[];
  languages: TechInfo[];
  databases: TechInfo[];
  tools: TechInfo[];
  deployment: TechInfo[];
  infrastructure: TechInfo[];
}

interface TechnicalSheetProps {
  data: TechStackData;
}

const TechCard: FC<{ title: string; items: TechInfo[]; icon: React.ReactNode }> = ({
  items,
  icon,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <div
          key={item.name + index}
          className="group relative p-4 rounded-lg border bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {icon}
                <h4 className="text-sm font-semibold">{item.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{item.value}</p>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {item.description}
                </p>
              )}
            </div>
            {item.version && (
              <Badge variant="secondary" className="h-fit">
                v{item.version}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const TechnicalSheet: FC<TechnicalSheetProps> = ({ data }) => {
  const statusColors = {
    production: 'bg-green-500',
    development: 'bg-yellow-500',
    testing: 'bg-blue-500',
  };

  const tabs = [
    { value: 'frameworks', label: 'Frameworks', icon: <Code2 className="h-4 w-4" />, items: data.frameworks },
    { value: 'languages', label: 'Languages', icon: <Code2 className="h-4 w-4" />, items: data.languages },
    { value: 'databases', label: 'Databases', icon: <Database className="h-4 w-4" />, items: data.databases },
    { value: 'tools', label: 'Tools', icon: <Wrench className="h-4 w-4" />, items: data.tools },
    { value: 'infrastructure', label: 'Infrastructure', icon: <Server className="h-4 w-4" />, items: data.infrastructure },
    { value: 'deployment', label: 'Deployment', icon: <HardDrive className="h-4 w-4" />, items: data.deployment },
  ];

  const totalItems = Object.values(data).filter(Array.isArray).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">{data.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last updated: {data.lastUpdate}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    statusColors[data.status]
                  )}
                />
                <span className="capitalize text-sm">{data.status}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Total Components</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalItems}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <Tabs defaultValue="frameworks" className="space-y-4">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center gap-2"
                  disabled={tab.items.length === 0}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {tab.items.length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <ScrollArea className="h-[600px] rounded-md border p-4">
              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <TechCard
                    title={tab.label}
                    items={tab.items}
                    icon={tab.icon}
                  />
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
