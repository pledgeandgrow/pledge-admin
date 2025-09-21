'use client';

import { TaskList } from '@/components/workspace/tasks/TaskList';
import { Separator } from '@/components/ui/separator';

export default function TasksPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Gestion des Tâches
        </h1>
        <p className="text-muted-foreground">
          Gérez vos tâches et suivez leur avancement
        </p>
      </div>
      
      <Separator className="my-6" />
      
      <TaskList />
    </div>
  );
}
