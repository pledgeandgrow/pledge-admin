import { Update } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Tag, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UpdateCardProps {
  update: Update;
  onClick: () => void;
}

export function UpdateCard({ update, onClick }: UpdateCardProps) {
  const getTypeColor = (type: string) => {
    const colors = {
      feature: 'bg-blue-500',
      bugfix: 'bg-yellow-500',
      security: 'bg-red-500',
      performance: 'bg-green-500',
      documentation: 'bg-purple-500',
      other: 'bg-gray-500',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planned: 'bg-blue-500',
      in_progress: 'bg-yellow-500',
      completed: 'bg-green-500',
      cancelled: 'bg-gray-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP', { locale: fr });
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      feature: 'Fonctionnalité',
      bugfix: 'Correction',
      security: 'Sécurité',
      performance: 'Performance',
      documentation: 'Documentation',
      other: 'Autre',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      planned: 'Planifié',
      in_progress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute',
      critical: 'Critique',
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{update.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Version {update.version}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={`${getTypeColor(update.type)} text-white`}>
              {getTypeLabel(update.type)}
            </Badge>
            <Badge className={`${getPriorityColor(update.priority)} text-white`}>
              {getPriorityLabel(update.priority)}
            </Badge>
            <Badge className={`${getStatusColor(update.status)} text-white`}>
              {getStatusLabel(update.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-sm">
          {update.description}
        </CardDescription>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          {update.planned_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Prévu: {formatDate(update.planned_date)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Mis à jour: {formatDate(update.updated_at)}</span>
          </div>
        </div>

        {update.assigned_to && update.assigned_to.length > 0 && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {update.assigned_to.map((person, index) => (
                <Badge key={index} variant="outline">{person}</Badge>
              ))}
            </div>
          </div>
        )}

        {update.tags && update.tags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {update.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
