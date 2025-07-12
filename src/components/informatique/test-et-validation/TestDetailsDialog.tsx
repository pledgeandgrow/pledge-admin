import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Test } from './types';
import { TestForm } from './TestForm';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TestDetailsDialogProps {
  test: Test | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (test: Test) => void;
  projects: { id: string; name: string }[];
}

export function TestDetailsDialog({
  test,
  isOpen,
  onClose,
  onUpdate,
  projects,
}: TestDetailsDialogProps) {
  if (!test) return null;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    passed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    pending: 'En attente',
    in_progress: 'En cours',
    passed: 'Réussi',
    failed: 'Échoué',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-semibold">
              {test.title}
            </DialogTitle>
            <Badge className={statusColors[test.status]}>
              {statusLabels[test.status]}
            </Badge>
          </div>
          <div className="text-sm text-gray-500">
            {test.created_at && (
              <>
                Créé le {format(new Date(test.created_at), 'PPP', { locale: fr })}
              </>
            )}
          </div>
        </DialogHeader>

        <div className="mt-4">
          <TestForm
            initialData={test}
            onSubmit={onUpdate}
            onCancel={onClose}
            projects={projects}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
