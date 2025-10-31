'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BaseProject } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { format, parseISO, differenceInDays, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimelineItem {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: string;
  type: 'milestone' | 'task' | 'phase';
  progress: number;
}

interface ProjectTimelineProps {
  project: BaseProject;
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tasks, isLoading: tasksLoading, error: tasksError, fetchTasks } = useTasks();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    const loadTimelineData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch tasks for this project
        if (project.id) {
          await fetchTasks({ project_id: project.id });
        }
        
        // Create timeline items from tasks
        const taskItems = tasks
          .filter(task => task.project_id === project.id)
          .map((task: any) => ({
            id: task.id,
            title: task.title,
            startDate: task.start_at ? new Date(task.start_at) : new Date(),
            endDate: task.due_at ? new Date(task.due_at) : addDays(new Date(), 1),
            status: task.status,
            type: 'task' as const,
            progress: task.progress || 0
          }));
        
        // Create phases based on project metadata if available
        const phaseItems: TimelineItem[] = [];
        if (project.metadata?.phases && Array.isArray(project.metadata.phases)) {
          (project.metadata.phases as any[]).forEach((phase: any) => {
            if (phase.name && phase.start_date && phase.end_date) {
              phaseItems.push({
                id: `phase-${phase.name}`,
                title: phase.name,
                startDate: new Date(phase.start_date),
                endDate: new Date(phase.end_date),
                status: phase.status || 'planned',
                type: 'phase',
                progress: phase.progress || 0
              });
            }
          });
        }
        
        // Combine all timeline items (tasks and phases, milestones from metadata)
        const allItems = [...taskItems, ...phaseItems];
        
        // Calculate project timeline boundaries
        if (allItems.length > 0) {
          const sortedByStart = [...allItems].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
          const sortedByEnd = [...allItems].sort((a, b) => b.endDate.getTime() - a.endDate.getTime());
          
          const earliestDate = sortedByStart[0].startDate;
          const latestDate = sortedByEnd[0].endDate;
          
          setStartDate(earliestDate);
          setEndDate(latestDate);
          setTotalDays(differenceInDays(latestDate, earliestDate) + 1);
        } else {
          // Fallback to project dates if no items
          const projectStart = project.start_date ? new Date(project.start_date) : new Date();
          const projectEnd = project.end_date ? new Date(project.end_date) : addDays(new Date(), 30);
          
          setStartDate(projectStart);
          setEndDate(projectEnd);
          setTotalDays(differenceInDays(projectEnd, projectStart) + 1);
        }
        
        setTimelineItems(allItems);
      } catch (error) {
        console.error('Error loading timeline data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTimelineData();
  }, [project.id, project.metadata, project.start_date, project.end_date]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'done':
        return 'bg-green-500';
      case 'in_progress':
      case 'in progress':
        return 'bg-blue-500';
      case 'blocked':
        return 'bg-red-500';
      case 'todo':
      case 'planned':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  const getItemWidth = (item: TimelineItem) => {
    if (!startDate || !endDate || totalDays === 0) return '100%';
    
    const itemStartOffset = Math.max(0, differenceInDays(item.startDate, startDate));
    const itemDuration = Math.max(1, differenceInDays(item.endDate, item.startDate) + 1);
    
    const startPercentage = (itemStartOffset / totalDays) * 100;
    const widthPercentage = (itemDuration / totalDays) * 100;
    
    return {
      left: `${startPercentage}%`,
      width: `${widthPercentage}%`
    };
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy', { locale: fr });
  };

  const renderTimelineHeader = () => {
    if (!startDate || !endDate) return null;
    
    const days = [];
    let currentDate = startDate;
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    // If too many days, show only key dates
    if (days.length > 60) {
      const keyDates = [];
      const interval = Math.ceil(days.length / 10);
      
      for (let i = 0; i < days.length; i += interval) {
        keyDates.push(days[i]);
      }
      
      if (keyDates[keyDates.length - 1] !== days[days.length - 1]) {
        keyDates.push(days[days.length - 1]);
      }
      
      return (
        <div className="flex border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
          {keyDates.map((date, index) => (
            <div 
              key={index} 
              className="text-xs text-gray-500 dark:text-gray-400"
              style={{ 
                position: 'absolute', 
                left: `${(differenceInDays(date, startDate) / totalDays) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {format(date, 'dd/MM')}
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="flex border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
        {days.map((day, index) => (
          <div 
            key={index} 
            className="flex-1 text-xs text-center text-gray-500 dark:text-gray-400"
          >
            {format(day, 'dd')}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading || tasksLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chronologie du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || tasksError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chronologie du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-md flex justify-between items-center">
            <span>Erreur lors du chargement de la chronologie</span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setError(null);
                if (project.id) {
                  fetchTasks({ project_id: project.id });
                }
              }}
            >
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chronologie du projet</CardTitle>
      </CardHeader>
      <CardContent>
        {timelineItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Aucune donnée de chronologie disponible pour ce projet.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between mb-2">
              <div className="text-sm font-medium">
                Début: {startDate ? formatDate(startDate) : 'Non défini'}
              </div>
              <div className="text-sm font-medium">
                Fin: {endDate ? formatDate(endDate) : 'Non défini'}
              </div>
            </div>
            
            <div className="relative">
              {renderTimelineHeader()}
              
              <div className="space-y-4">
                {timelineItems.map((item) => (
                  <div key={item.id} className="relative h-12">
                    <div 
                      className={`absolute h-8 rounded-md ${getStatusColor(item.status)} bg-opacity-80 dark:bg-opacity-60 flex items-center px-2`}
                      style={getItemWidth(item)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="text-xs font-medium text-white truncate">
                          {item.title}
                        </div>
                        {item.type === 'milestone' && (
                          <Badge variant="outline" className="bg-white text-xs ml-1">
                            Jalon
                          </Badge>
                        )}
                        <div className="text-xs text-white ml-1">
                          {item.progress}%
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 text-xs text-gray-500 dark:text-gray-400" style={{ left: getItemWidth(item).left }}>
                      {formatDate(item.startDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
