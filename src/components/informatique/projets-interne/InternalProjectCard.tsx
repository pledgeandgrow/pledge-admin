'use client';

import { FC } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, GitBranch, GitPullRequest, GitCommit } from 'lucide-react';
import { InternalProjectType } from './types';
import { cn } from '@/lib/utils';

interface InternalProjectCardProps {
  project: InternalProjectType;
  onClick: () => void;
}

export const InternalProjectCard: FC<InternalProjectCardProps> = ({ project, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en cours':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'terminé':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'en pause':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'haute':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'moyenne':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'basse':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isOverdue = () => {
    const endDate = new Date(project.dateFin.split('/').reverse().join('-'));
    return endDate < new Date() && project.statut !== 'Terminé';
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-lg cursor-pointer",
        isOverdue() ? "border-red-500/50" : "hover:border-blue-500/50"
      )}
      onClick={onClick}
    >
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-1">{project.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          </div>
          <Badge variant="outline" className={cn(getStatusColor(project.statut))}>
            {project.statut}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">{project.progression}%</span>
          </div>
          <Progress 
            value={project.progression} 
            className={cn("h-2", getProgressColor(project.progression))}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{project.dateDebut}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{project.dateFin}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{project.equipe.length} membres</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(getPriorityColor(project.priorite))}>
              {project.priorite}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1" title="Pull Requests">
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
            <span>{project.pullRequests}</span>
          </div>
          <div className="flex items-center gap-1" title="Commits">
            <GitCommit className="h-4 w-4 text-muted-foreground" />
            <span>{project.commits}</span>
          </div>
          <div className="flex items-center gap-1" title="Branches">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <span>{project.branches.length}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
