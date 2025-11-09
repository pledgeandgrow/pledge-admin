import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTasks, TaskWithProject, TaskStatus, TaskPriority } from '@/hooks/useTasks';
import { CheckCircle2, Clock, AlertCircle, XCircle, BarChart2 } from 'lucide-react';

interface TasksOverviewWidgetProps {
  limit?: number;
  filter?: {
    status?: TaskStatus[];
    priority?: TaskPriority[];
    projectId?: string;
  };
}

const TasksOverviewWidget: React.FC<TasksOverviewWidgetProps> = ({
  limit = 5,
  filter
}) => {
  const { tasks, isLoading, error, fetchTasks } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState<TaskWithProject[]>([]);
  const [stats, setStats] = useState({
    todo: 0,
    in_progress: 0,
    in_review: 0,
    blocked: 0,
    done: 0
  });

  useEffect(() => {
    fetchTasks({
      status: filter?.status,
      priority: filter?.priority,
      project_id: filter?.projectId
    });
  }, [fetchTasks, filter]);

  useEffect(() => {
    if (tasks.length > 0) {
      // Calculate stats
      const newStats = {
        todo: tasks.filter(t => t.status === 'todo').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        in_review: tasks.filter(t => t.status === 'in_review').length,
        blocked: tasks.filter(t => t.status === 'blocked').length,
        done: tasks.filter(t => t.status === 'done').length
      };
      setStats(newStats);
      
      // Filter and sort tasks
      const filtered = [...tasks];
      
      // Sort by priority (high to low) and then by due date (soonest first)
      filtered.sort((a, b) => {
        const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        // If same priority, sort by due date
        if (a.due_at && b.due_at) {
          return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
        }
        
        // If one has due date and other doesn't
        if (a.due_at && !b.due_at) {return -1;}
        if (!a.due_at && b.due_at) {return 1;}
        
        return 0;
      });
      
      // Limit the number of tasks
      setFilteredTasks(filtered.slice(0, limit));
    }
  }, [tasks, limit]);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'in_progress':
        return <BarChart2 className="h-4 w-4 text-yellow-500" />;
      case 'in_review':
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      case 'blocked':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return 'À faire';
      case 'in_progress': return 'En cours';
      case 'in_review': return 'En revue';
      case 'blocked': return 'Bloqué';
      case 'done': return 'Terminé';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-blue-500';
      case 'high': return 'bg-orange-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) {return 'Non défini';}
    
    const dateObj = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if the date is today or tomorrow
    if (dateObj.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (dateObj.toDateString() === tomorrow.toDateString()) {
      return "Demain";
    }
    
    // Otherwise return the formatted date
    return dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const isOverdue = (dueDate: Date | string | undefined) => {
    if (!dueDate) {return false;}
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Tâches</span>
          <Badge variant="outline" className="ml-2">{tasks.length}</Badge>
        </CardTitle>
        <CardDescription>Aperçu des tâches en cours</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">Erreur lors du chargement des tâches</div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="bg-blue-100 p-2 rounded-md">
                <div className="text-blue-700 font-semibold">{stats.todo}</div>
                <div className="text-xs">À faire</div>
              </div>
              <div className="bg-yellow-100 p-2 rounded-md">
                <div className="text-yellow-700 font-semibold">{stats.in_progress}</div>
                <div className="text-xs">En cours</div>
              </div>
              <div className="bg-purple-100 p-2 rounded-md">
                <div className="text-purple-700 font-semibold">{stats.in_review}</div>
                <div className="text-xs">En revue</div>
              </div>
              <div className="bg-red-100 p-2 rounded-md">
                <div className="text-red-700 font-semibold">{stats.blocked}</div>
                <div className="text-xs">Bloqué</div>
              </div>
              <div className="bg-green-100 p-2 rounded-md">
                <div className="text-green-700 font-semibold">{stats.done}</div>
                <div className="text-xs">Terminé</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Aucune tâche trouvée
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task.id} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {getStatusIcon(task.status)}
                        <span className="font-medium ml-2">{task.title}</span>
                      </div>
                      <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    {task.description && (
                      <div className="mt-2 text-sm text-gray-500 line-clamp-1">
                        {task.description}
                      </div>
                    )}
                    
                    {task.progress !== undefined && task.progress > 0 && (
                      <div className="mt-2">
                        <Progress value={task.progress} className="h-2" />
                        <div className="text-xs text-right mt-1 text-gray-500">
                          {task.progress}% complété
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="text-gray-500">
                        {getStatusText(task.status)}
                      </span>
                      
                      {task.project_name && (
                        <span className="text-gray-500">
                          <span className="mx-1">•</span>
                          Projet: {task.project_name}
                        </span>
                      )}
                      
                      {task.due_at && (
                        <span className={`${isOverdue(task.due_at) ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                          <span className="mx-1">•</span>
                          Échéance: {formatDate(task.due_at)}
                        </span>
                      )}
                      
                      {task.estimate_hours && (
                        <span className="text-gray-500">
                          <span className="mx-1">•</span>
                          Estimé: {task.estimate_hours}h
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <a href="/tasks" className="text-sm text-blue-600 hover:underline">
          Voir toutes les tâches
        </a>
      </CardFooter>
    </Card>
  );
};

export default TasksOverviewWidget;
