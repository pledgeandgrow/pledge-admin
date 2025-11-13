'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, List, BarChart3, Plus } from 'lucide-react';
import { GanttChart } from '@/components/planning/GanttChart';
import { TaskList } from '@/components/planning/TaskList';
import { ResourceAllocation } from '@/components/planning/ResourceAllocation';
import { PlanningFilters } from '@/components/planning/PlanningFilters';

interface FilterOptions {
  status?: string;
  assignee?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export default function PlanningPage() {
  const [activeView, setActiveView] = useState<'gantt' | 'list' | 'resources'>('gantt');
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleAddTask = () => {
    // TODO: Implement add task functionality
    console.log('Add task clicked');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Project Planning</h1>
          <p className="text-muted-foreground">
            Manage your project timeline, tasks, and resources
          </p>
        </div>
        <Button onClick={handleAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PlanningFilters 
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <Tabs value={activeView} onValueChange={(value) => setActiveView(value as typeof activeView)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="gantt" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Gantt Chart
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    Task List
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Resources
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {activeView === 'gantt' && <GanttChart />}
              {activeView === 'list' && <TaskList />}
              {activeView === 'resources' && <ResourceAllocation />}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Tasks</CardTitle>
            <CardDescription>Active tasks in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-sm text-muted-foreground mt-2">
              +3 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
            <CardDescription>Tasks completed on time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
            <p className="text-sm text-muted-foreground mt-2">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Utilization</CardTitle>
            <CardDescription>Average resource allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">72%</div>
            <p className="text-sm text-muted-foreground mt-2">
              Optimal range: 70-85%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
