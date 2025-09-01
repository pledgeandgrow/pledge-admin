'use client';

import { Card } from '@/components/ui/card';
import { Users, UserCheck, FileCheck, FileText } from 'lucide-react';

export interface DashboardStatsProps {
  totalLeads: number;
  totalClients: number;
  pendingTasks: number;
  completedProjects: number;
  leadsChange?: string;
  clientsChange?: string;
  tasksChange?: string;
  projectsChange?: string;
}

export function DashboardStats({
  totalLeads,
  totalClients,
  pendingTasks,
  completedProjects,
  leadsChange = '+12% from last month',
  clientsChange = '+8% from last month',
  tasksChange = '+3 today',
  projectsChange = '+5 this month',
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card className="p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
            <p className="text-2xl font-bold">{totalLeads}</p>
            <p className="text-xs text-muted-foreground">{leadsChange}</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
            <p className="text-2xl font-bold">{totalClients}</p>
            <p className="text-xs text-muted-foreground">{clientsChange}</p>
          </div>
          <div className="rounded-lg bg-green-500/10 p-3">
            <UserCheck className="h-6 w-6 text-green-500" />
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
            <p className="text-2xl font-bold">{pendingTasks}</p>
            <p className="text-xs text-muted-foreground">{tasksChange}</p>
          </div>
          <div className="rounded-lg bg-yellow-500/10 p-3">
            <FileText className="h-6 w-6 text-yellow-500" />
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed Projects</p>
            <p className="text-2xl font-bold">{completedProjects}</p>
            <p className="text-xs text-muted-foreground">{projectsChange}</p>
          </div>
          <div className="rounded-lg bg-purple-500/10 p-3">
            <FileCheck className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </Card>
    </div>
  );
}
