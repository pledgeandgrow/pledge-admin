'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, FileCode, GitBranch, Terminal } from 'lucide-react';
import { Data } from '@/types/data';

interface AutomationCardProps {
  automation: Data;
  getTagColor: (tag: string) => string;
  onView?: (automation: Data) => void;
}

export function AutomationCard({ automation, getTagColor, onView }: AutomationCardProps) {
  const handleView = () => {
    if (onView) {
      onView(automation);
    }
  };

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    
    switch (iconName) {
      case 'code':
        return <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'terminal':
        return <Terminal className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'git':
        return <GitBranch className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'file':
        return <FileCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{automation.title}</CardTitle>
          {automation.metadata && typeof automation.metadata.icon === 'string' && (
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              {renderIcon(automation.metadata.icon)}
            </div>
          )}
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {automation.summary || automation.content}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {automation.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className={getTagColor(tag)}>
              {tag}
            </Badge>
          ))}
        </div>
        {automation.metadata && Array.isArray(automation.metadata.features) && automation.metadata.features.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Fonctionnalités</h4>
            <ul className="list-disc pl-5 space-y-1">
              {(automation.metadata.features as string[]).slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground">{feature}</li>
              ))}
              {(automation.metadata.features as string[]).length > 3 && (
                <li className="text-sm text-muted-foreground">+{(automation.metadata.features as string[]).length - 3} autres...</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={handleView}>
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  );
}
