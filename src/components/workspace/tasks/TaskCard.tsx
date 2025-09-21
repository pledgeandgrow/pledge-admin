'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MoreVertical, Calendar, Clock, AlertCircle, CheckCircle, Flag, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { TaskWithProject } from '@/hooks/useTasks';

interface TaskCardProps {
  task: TaskWithProject;
  onEdit: (task: TaskWithProject) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: string) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statusIcons = {
    todo: <Clock className="h-4 w-4 text-gray-500" />,
    in_progress: <Clock className="h-4 w-4 text-blue-500" />,
    in_review: <AlertCircle className="h-4 w-4 text-amber-500" />,
    blocked: <AlertCircle className="h-4 w-4 text-red-500" />,
    done: <CheckCircle className="h-4 w-4 text-green-500" />,
    archived: <CheckCircle className="h-4 w-4 text-gray-400" />,
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'PPP', { locale: fr });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(task.id, newStatus);
    setIsMenuOpen(false);
  };

  return (
    <Card className="overflow-hidden border-l-4" style={{ 
      borderLeftColor: task.status === 'done' 
        ? '#10b981' 
        : task.status === 'blocked' 
          ? '#ef4444' 
          : task.status === 'in_progress' 
            ? '#3b82f6' 
            : '#f59e0b' 
    }}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-base">{task.title}</h3>
            {task.project_name && (
              <p className="text-xs text-muted-foreground">
                Projet: {task.project_name}
              </p>
            )}
          </div>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('todo')}>
                Marquer comme À faire
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
                Marquer comme En cours
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('in_review')}>
                Marquer comme En revue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('done')}>
                Marquer comme Terminé
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('blocked')}>
                Marquer comme Bloqué
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600">
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {statusIcons[task.status as keyof typeof statusIcons]}
                <span className="ml-1 text-xs">{
                  task.status === 'todo' ? 'À faire' :
                  task.status === 'in_progress' ? 'En cours' :
                  task.status === 'in_review' ? 'En revue' :
                  task.status === 'blocked' ? 'Bloqué' :
                  task.status === 'done' ? 'Terminé' :
                  task.status === 'archived' ? 'Archivé' :
                  task.status
                }</span>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${priorityColors[task.priority as keyof typeof priorityColors]} border-0`}
            >
              <Flag className="h-3 w-3 mr-1" />
              {task.priority}
            </Badge>
          </div>

          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>Progression</span>
              <span>{task.progress || 0}%</span>
            </div>
            <Progress 
              value={task.progress || 0} 
              className="h-2" 
              indicatorClassName={getProgressColor(task.progress || 0)}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-4">
        <div className="flex items-center gap-1">
          {task.assignees && task.assignees.length > 0 ? (
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 3).map((assignee, index) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={assignee.avatar_url} alt={assignee.name} />
                  <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {task.assignees.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Non assigné</span>
          )}
        </div>

        {task.due_at && (
          <div className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{formatDate(task.due_at)}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
