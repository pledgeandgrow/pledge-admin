'use client';

import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Code2, Package2, Blocks } from 'lucide-react';

interface TechnicalSheetListProps {
  systems: Array<{
    category: string;
    status: string;
    frameworks: { name: string; value: string }[];
  }>;
  selectedSystem?: {
    category: string;
    status: string;
  };
  onSelect: (system: { category: string; status: string; frameworks?: { name: string; value: string }[] }) => void;
}

export const TechnicalSheetList: FC<TechnicalSheetListProps> = ({
  systems,
  selectedSystem,
  onSelect,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production':
        return 'bg-green-500 dark:bg-green-600';
      case 'development':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'testing':
        return 'bg-yellow-500 dark:bg-yellow-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <Code2 className="h-4 w-4" />;
      case 'backend':
        return <Package2 className="h-4 w-4" />;
      default:
        return <Blocks className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-0 overflow-hidden border-none shadow-none bg-transparent">
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-2 pr-4">
          {systems.map((system, index) => (
            <Card
              key={index}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedSystem?.category === system.category 
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => onSelect(system)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${
                    selectedSystem?.category === system.category 
                      ? 'bg-primary/10'
                      : 'bg-muted'
                  }`}>
                    {getCategoryIcon(system.category)}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{system.category}</h3>
                    <p className="text-xs text-muted-foreground">
                      {system.frameworks.length} components
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="secondary"
                  className={`${getStatusColor(system.status)} text-white`}
                >
                  {system.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
