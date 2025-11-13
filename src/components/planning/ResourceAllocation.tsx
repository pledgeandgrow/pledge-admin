'use client';

import { useState } from 'react';

interface Resource {
  id: string;
  name: string;
  role: string;
  availability: number;
}

interface ResourceAllocationProps {
  projectId?: string;
}

export function ResourceAllocation({ projectId }: ResourceAllocationProps) {
  const [resources, setResources] = useState<Resource[]>([]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Resource Allocation</h2>
      {projectId && <p className="text-sm text-muted-foreground">Project: {projectId}</p>}
      {resources.length === 0 ? (
        <p className="text-muted-foreground">No resources allocated</p>
      ) : (
        <ul>
          {resources.map(resource => (
            <li key={resource.id}>{resource.name} - {resource.role}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
