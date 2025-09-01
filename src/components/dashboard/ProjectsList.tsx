'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  deadline: string;
  progress: number;
  budget: number;
  team: string[];
}

interface ProjectsListProps {
  projects: Project[];
  isLoading?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'On Hold':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export function ProjectsList({ projects, isLoading = false }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
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
                    Status
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Completed')}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('On Hold')}>
                    On Hold
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Cancelled')}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No projects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-medium text-foreground">{project.name}</p>
                          <div className="flex mt-1 space-x-1">
                            {project.team.slice(0, 3).map((member, i) => (
                              <div key={i} className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                                {member.charAt(0).toUpperCase()}
                              </div>
                            ))}
                            {project.team.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                                +{project.team.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(project.status)}>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(project.deadline).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">{project.progress}%</span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${project.budget.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
