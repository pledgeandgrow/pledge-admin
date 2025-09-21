import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProjects } from '@/hooks/useProjects';
import { BaseProject, ProjectStatus } from '@/services/projectService';
import { CalendarIcon, ClockIcon, UsersIcon } from 'lucide-react';

interface ProjectSummaryCardProps {
  projectType?: 'Client' | 'Internal' | 'All';
  limit?: number;
}

const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({ 
  projectType = 'All',
  limit = 5
}) => {
  const { projects, loading, error, fetchProjects } = useProjects({
    type: projectType !== 'All' ? projectType : undefined,
    autoFetch: true,
    initialFilters: {
      limit: limit,
      sortBy: 'updated_at',
      sortOrder: 'desc'
    }
  });

  const [stats, setStats] = useState({
    active: 0,
    completed: 0,
    onHold: 0,
    cancelled: 0,
    total: 0
  });

  useEffect(() => {
    if (projects.length > 0) {
      const newStats = {
        active: projects.filter(p => p.status === 'Active').length,
        completed: projects.filter(p => p.status === 'Completed').length,
        onHold: projects.filter(p => p.status === 'On Hold').length,
        cancelled: projects.filter(p => p.status === 'Cancelled').length,
        total: projects.length
      };
      setStats(newStats);
    }
  }, [projects]);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Completed': return 'bg-blue-500';
      case 'On Hold': return 'bg-yellow-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{projectType === 'All' ? 'Tous les Projets' : `Projets ${projectType}`}</span>
          <Badge variant="outline" className="ml-2">{stats.total}</Badge>
        </CardTitle>
        <CardDescription>Résumé des projets récents</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">Erreur lors du chargement des projets</div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-green-100 p-2 rounded-md">
                <div className="text-green-700 font-semibold">{stats.active}</div>
                <div className="text-xs">Actifs</div>
              </div>
              <div className="bg-blue-100 p-2 rounded-md">
                <div className="text-blue-700 font-semibold">{stats.completed}</div>
                <div className="text-xs">Terminés</div>
              </div>
              <div className="bg-yellow-100 p-2 rounded-md">
                <div className="text-yellow-700 font-semibold">{stats.onHold}</div>
                <div className="text-xs">En pause</div>
              </div>
              <div className="bg-red-100 p-2 rounded-md">
                <div className="text-red-700 font-semibold">{stats.cancelled}</div>
                <div className="text-xs">Annulés</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {projects.slice(0, limit).map((project: BaseProject) => (
                <div key={project.id} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{project.name}</div>
                    <Badge className={`${getStatusColor(project.status)} text-white`}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500 line-clamp-1">
                    {project.description || 'Aucune description'}
                  </div>
                  
                  <div className="mt-2">
                    <Progress value={project.progress || 0} className="h-2" />
                    <div className="text-xs text-right mt-1 text-gray-500">
                      {project.progress || 0}% complété
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                    {project.start_date && (
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>Début: {formatDate(project.start_date)}</span>
                      </div>
                    )}
                    
                    {project.end_date && (
                      <div className="flex items-center ml-2">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        <span>Fin: {formatDate(project.end_date)}</span>
                      </div>
                    )}
                    
                    {project.team_contacts && project.team_contacts.length > 0 && (
                      <div className="flex items-center ml-2">
                        <UsersIcon className="h-3 w-3 mr-1" />
                        <span>{project.team_contacts.length} membres</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <a href="/projects" className="text-sm text-blue-600 hover:underline">
          Voir tous les projets
        </a>
      </CardFooter>
    </Card>
  );
};

export default ProjectSummaryCard;
