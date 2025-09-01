'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronDown, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  assignedTo?: string;
  project?: string;
  completed: boolean;
}

interface TasksListProps {
  tasks: Task[];
  onTaskToggle?: (taskId: string, completed: boolean) => void;
  isLoading?: boolean;
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export function TasksList({ tasks, onTaskToggle, isLoading = false }: TasksListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleTaskToggle = (taskId: string, checked: boolean) => {
    if (onTaskToggle) {
      onTaskToggle(taskId, checked);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-gray-300 dark:border-gray-700">
                    <Filter className="h-4 w-4" />
                    Priority
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => setPriorityFilter('all')}>
                    All Priorities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter('high')}>
                    High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter('medium')}>
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter('low')}>
                    Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-gray-300 dark:border-gray-700">
                    <Filter className="h-4 w-4" />
                    Status
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('in_progress')}>
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-2">Loading tasks...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-4 rounded-lg border ${
                    task.completed 
                      ? 'bg-muted/20 border-gray-200 dark:border-gray-800' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={task.completed} 
                      onCheckedChange={(checked) => handleTaskToggle(task.id, !!checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <Badge className={getPriorityBadge(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className={`text-sm mt-1 ${task.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center mt-2 text-xs text-muted-foreground gap-4">
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {task.project && (
                          <div>
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {task.project}
                            </span>
                          </div>
                        )}
                        {task.assignedTo && (
                          <div className="flex items-center gap-1">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                              {task.assignedTo.charAt(0).toUpperCase()}
                            </div>
                            <span>{task.assignedTo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
