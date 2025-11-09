'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { TaskStatus, TaskPriority } from '@/hooks/useTasks';

export interface TaskFilters {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  project_id?: string;
  assignee_id?: string;
  due_before?: Date;
  due_after?: Date;
  search?: string;
}

interface TaskFilterProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
  projects?: Array<{ id: string; name: string }>;
  users?: Array<{ id: string; name: string }>;
}

export function TaskFilter({ filters, onFilterChange, projects = [], users = [] }: TaskFilterProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Update active filters display
  useEffect(() => {
    const active: string[] = [];
    if (filters.status) {active.push('Status');}
    if (filters.priority) {active.push('Priority');}
    if (filters.project_id) {active.push('Project');}
    if (filters.assignee_id) {active.push('Assignee');}
    if (filters.due_before || filters.due_after) {active.push('Due Date');}
    setActiveFilters(active);
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchTerm });
  };

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onFilterChange({ ...filters, status: undefined });
    } else {
      onFilterChange({ ...filters, status: value as TaskStatus });
    }
  };

  const handlePriorityChange = (value: string) => {
    if (value === 'all') {
      onFilterChange({ ...filters, priority: undefined });
    } else {
      onFilterChange({ ...filters, priority: value as TaskPriority });
    }
  };

  const handleProjectChange = (value: string) => {
    onFilterChange({ ...filters, project_id: value === 'all' ? undefined : value });
  };

  const handleAssigneeChange = (value: string) => {
    onFilterChange({ ...filters, assignee_id: value === 'all' ? undefined : value });
  };

  const handleDateRangeChange = (date: Date | undefined) => {
    if (!date) {return;}
    
    // If we're setting the start date
    if (!filters.due_after || date > (filters.due_after as Date)) {
      onFilterChange({ ...filters, due_after: date });
    } 
    // If we're setting the end date
    else if (!filters.due_before || date < (filters.due_before as Date)) {
      onFilterChange({ ...filters, due_before: date });
    }
    // If we're resetting the range
    else {
      onFilterChange({ ...filters, due_after: date, due_before: undefined });
    }
  };

  const clearFilters = () => {
    onFilterChange({
      search: searchTerm
    });
  };

  const clearDateFilter = () => {
    onFilterChange({
      ...filters,
      due_before: undefined,
      due_after: undefined
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.status?.toString() || 'all'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority?.toString() || 'all'}
          onValueChange={handlePriorityChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>

        {projects.length > 0 && (
          <Select
            value={filters.project_id || 'all'}
            onValueChange={handleProjectChange}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {users.length > 0 && (
          <Select
            value={filters.assignee_id || 'all'}
            onValueChange={handleAssigneeChange}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Due Date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Select Date Range</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearDateFilter}
                  disabled={!filters.due_after && !filters.due_before}
                >
                  Clear
                </Button>
              </div>
              <CalendarComponent
                mode="single"
                selected={filters.due_after as Date}
                onSelect={handleDateRangeChange}
                initialFocus
              />
              {filters.due_after && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">From:</span> {filters.due_after.toLocaleDateString()}
                </div>
              )}
              {filters.due_before && (
                <div className="mt-1 text-sm">
                  <span className="font-medium">To:</span> {filters.due_before.toLocaleDateString()}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {activeFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="ml-auto"
          >
            Clear all filters
          </Button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(filter => (
            <Badge key={filter} variant="secondary">
              {filter}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
