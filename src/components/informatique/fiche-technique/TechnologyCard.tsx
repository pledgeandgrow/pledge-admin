import { Technology } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Book, Calendar } from 'lucide-react';

interface TechnologyCardProps {
  technology: Technology;
  onClick: () => void;
}

export function TechnologyCard({ technology, onClick }: TechnologyCardProps) {
  const getTypeColor = (type: string) => {
    const colors = {
      framework: 'bg-blue-500',
      language: 'bg-green-500',
      library: 'bg-purple-500',
      tool: 'bg-orange-500',
      database: 'bg-red-500',
      platform: 'bg-cyan-500',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{technology.name}</CardTitle>
            {technology.version && (
              <div className="text-sm text-muted-foreground">
                Version {technology.version}
              </div>
            )}
          </div>
          <Badge className={`${getTypeColor(technology.type)} text-white`}>
            {technology.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-sm">
          {technology.description}
        </CardDescription>

        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {technology.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <a
                href={technology.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-primary"
              >
                Site web
              </a>
            </div>
          )}
          {technology.documentation && (
            <div className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              <a
                href={technology.documentation}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-primary"
              >
                Documentation
              </a>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Mis à jour le {formatDate(technology.updated_at)}</span>
          </div>
        </div>

        {/* Type-specific content */}
        <div className="pt-2 space-y-2">
          {technology.type === 'framework' && (
            <>
              <div className="text-sm">
                <span className="font-medium">Écosystème:</span> {technology.ecosystem}
              </div>
              {technology.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {technology.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              )}
            </>
          )}

          {technology.type === 'language' && (
            <>
              <div className="text-sm">
                <span className="font-medium">Type:</span> {technology.compilation_type}
              </div>
              {technology.paradigms.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {technology.paradigms.map((paradigm, index) => (
                    <Badge key={index} variant="secondary">{paradigm}</Badge>
                  ))}
                </div>
              )}
            </>
          )}

          {technology.type === 'library' && (
            <>
              <div className="text-sm">
                <span className="font-medium">Installation:</span> {technology.installation}
              </div>
              {technology.dependencies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {technology.dependencies.map((dep, index) => (
                    <Badge key={index} variant="secondary">{dep}</Badge>
                  ))}
                </div>
              )}
            </>
          )}

          {technology.type === 'database' && (
            <>
              <div className="text-sm">
                <span className="font-medium">Type:</span> {technology.database_type}
              </div>
              {technology.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {technology.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              )}
            </>
          )}

          {technology.type === 'platform' && (
            <>
              <div className="text-sm">
                <span className="font-medium">Type d'hébergement:</span> {technology.hosting_type}
              </div>
              {technology.services.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {technology.services.map((service, index) => (
                    <Badge key={index} variant="secondary">{service}</Badge>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
