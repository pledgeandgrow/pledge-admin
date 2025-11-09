'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, X } from 'lucide-react';
import { BaseProject } from '@/hooks/useProjects';
import { ProjectDetails } from './ProjectDetails';
import { ProjectType } from '@/types/project';

interface ViewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: BaseProject | null;
  onEdit?: () => void;
}

export function ViewProjectDialog({ open, onOpenChange, project, onEdit }: ViewProjectDialogProps) {
  if (!project) {return null;}

  // Convert BaseProject to ProjectType for ProjectDetails component
  const projectForDetails: ProjectType = {
    id: project.id || '',
    name: project.name,
    description: project.description,
    project_type: project.project_type as string,
    status: project.status as string,
    priority: project.priority as string,
    start_date: project.start_date,
    end_date: project.end_date,
    budget: project.budget,
    progress: project.progress,
    primary_contact_id: project.primary_contact_id,
    tags: project.tags,
    created_at: project.created_at || new Date().toISOString(),
    updated_at: project.updated_at || new Date().toISOString(),
    metadata: project.metadata,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Détails du Projet
            </DialogTitle>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  onClick={() => {
                    onEdit();
                    onOpenChange(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </Button>
              )}
              <Button
                onClick={() => onOpenChange(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <ProjectDetails project={projectForDetails} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
