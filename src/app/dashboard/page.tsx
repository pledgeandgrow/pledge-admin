'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Download } from 'lucide-react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ClientList } from '@/components/dashboard/ClientList';
import { ProjectsList } from '@/components/dashboard/ProjectsList';
import { TasksList } from '@/components/dashboard/TasksList';
import { useDashboard } from '@/hooks/useDashboard';


export default function DashboardPage() {
  const { session, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { 
    isLoading, 
    error, 
    stats, 
    clients, 
    projects, 
    tasks, 
    toggleTaskCompletion 
  } = useDashboard();

  useEffect(() => {
    // If no session, redirect to signin
    if (!session && !authLoading) {
      console.log('No session, redirecting to signin');
      router.push('/auth/signin');
      return;
    }
  }, [session, authLoading, router]);

  // Show loading state while checking auth or loading data
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="px-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Overview of your activities and statistics
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="gap-2 border-gray-300 dark:border-gray-700">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Client
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-2">Loading dashboard data...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-md mb-8">
              Error loading dashboard data: {error}
            </div>
          ) : (
            <>
              <DashboardStats 
                totalLeads={stats.totalLeads}
                totalClients={stats.totalClients}
                pendingTasks={stats.pendingTasks}
                completedProjects={stats.completedProjects}
              />
              
              {/* Tabbed Interface */}
              <Tabs defaultValue="clients" className="mt-8">
                <TabsList className="bg-muted/50 mb-6">
                  <TabsTrigger value="clients">Clients</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="clients" className="mt-0">
                  <ClientList clients={clients} isLoading={isLoading} />
                </TabsContent>
                
                <TabsContent value="projects" className="mt-0">
                  <ProjectsList projects={projects} isLoading={isLoading} />
                </TabsContent>
                
                <TabsContent value="tasks" className="mt-0">
                  <TasksList 
                    tasks={tasks} 
                    isLoading={isLoading} 
                    onTaskToggle={toggleTaskCompletion}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
    </div>
  );
}
