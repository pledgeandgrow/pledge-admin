'use client';

import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: string;
  assignee?: string;
}

interface TaskListProps {
  projectId?: string;
}

export function TaskList({ projectId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      {projectId && <p className="text-sm text-muted-foreground">Project: {projectId}</p>}
      {tasks.length === 0 ? (
        <p className="text-muted-foreground">No tasks available</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>{task.title} - {task.status}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
