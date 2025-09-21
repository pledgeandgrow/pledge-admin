'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, FileSearch, Bookmark, FolderOpen } from 'lucide-react';
import { Data } from '@/types/data';

interface DocumentationCardProps {
  document: Data;
  getTagColor: (tag: string) => string;
  onView?: (document: Data) => void;
}

export function DocumentationCard({ document, getTagColor, onView }: DocumentationCardProps) {
  const handleView = () => {
    if (onView) {
      onView(document);
    }
  };

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    
    switch (iconName) {
      case 'book':
        return <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'file':
        return <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'search':
        return <FileSearch className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'bookmark':
        return <Bookmark className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'folder':
        return <FolderOpen className="h-5 w-5 text-green-600 dark:text-green-400" />;
      default:
        return <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />;
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{document.title}</CardTitle>
          {document.metadata && typeof document.metadata.icon === 'string' && (
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              {renderIcon(document.metadata.icon)}
            </div>
          )}
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {document.summary || document.content}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {document.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className={getTagColor(tag)}>
              {tag}
            </Badge>
          ))}
        </div>
        {document.metadata && typeof document.metadata.lastUpdated === 'string' && (
          <div className="text-sm text-muted-foreground mt-2">
            Dernière mise à jour: {new Date(document.metadata.lastUpdated).toLocaleDateString('fr-FR')}
          </div>
        )}
        {document.metadata && Array.isArray(document.metadata.sections) && document.metadata.sections.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Sections</h4>
            <ul className="list-disc pl-5 space-y-1">
              {(document.metadata.sections as string[]).slice(0, 3).map((section, index) => (
                <li key={index} className="text-sm text-muted-foreground">{section}</li>
              ))}
              {(document.metadata.sections as string[]).length > 3 && (
                <li className="text-sm text-muted-foreground">+{(document.metadata.sections as string[]).length - 3} autres...</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={handleView}>
          Consulter
        </Button>
      </CardFooter>
    </Card>
  );
}
