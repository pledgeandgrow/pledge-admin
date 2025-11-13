'use client';

import { useState } from 'react';

interface GanttTask {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  dependencies?: string[];
}

interface GanttChartProps {
  projectId?: string;
}

export function GanttChart({ projectId }: GanttChartProps) {
  const [tasks, setTasks] = useState<GanttTask[]>([]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gantt Chart</h2>
      {projectId && <p className="text-sm text-muted-foreground">Project: {projectId}</p>}
      {tasks.length === 0 ? (
        <p className="text-muted-foreground">No tasks to display</p>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="p-2 border rounded">
              <div className="font-medium">{task.title}</div>
              <div className="text-sm text-muted-foreground">
                {task.startDate.toLocaleDateString()} - {task.endDate.toLocaleDateString()}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
