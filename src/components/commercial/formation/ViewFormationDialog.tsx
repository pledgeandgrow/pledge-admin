'use client';

import { Data, DataStatus } from '@/types/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Check, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

// Define FormationMetadata interface for type safety
interface FormationMetadata extends Record<string, unknown> {
  category: string;
  level: string;
  duration: string;
  price: number;
  instructor: string;
  nextSession: string;
  pdfUrl: string;
  prerequisites: string[];
  objectives: string[];
}

interface ViewFormationDialogProps {
  formation: Data;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getLevelColor: (level: string) => string;
  getCategoryColor: (category: string) => string;
  getStatusColor: (status: DataStatus) => string;
  getStatusText: (status: DataStatus) => string;
}

export function ViewFormationDialog({
  formation,
  open,
  onOpenChange,
  getLevelColor,
  getCategoryColor,
  getStatusColor,
  getStatusText,
}: ViewFormationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {formation.title || 'Détails de la formation'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
            <p className="text-sm">{formation.content || formation.summary || ''}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Prix</Label>
              <p className="text-lg font-semibold">{((formation.metadata as FormationMetadata)?.price || 0).toLocaleString('fr-FR')} €</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Durée</Label>
              <p className="text-lg font-semibold">{(formation.metadata as FormationMetadata)?.duration || 'Non spécifié'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Niveau</Label>
              <div>
                <Badge variant="outline" className={getLevelColor((formation.metadata as FormationMetadata)?.level || 'Beginner')}>
                  {(formation.metadata as FormationMetadata)?.level || 'Beginner'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Catégorie</Label>
              <div>
                <Badge variant="outline" className={getCategoryColor((formation.metadata as FormationMetadata)?.category || 'Development')}>
                  {(formation.metadata as FormationMetadata)?.category || 'Development'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
            <div>
              <Badge variant="outline" className={getStatusColor(formation.status as DataStatus)}>
                {getStatusText(formation.status as DataStatus)}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Formateur</Label>
            <p className="text-sm font-semibold">{(formation.metadata as FormationMetadata)?.instructor || 'Non spécifié'}</p>
          </div>

          {(formation.metadata as FormationMetadata)?.nextSession && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Prochaine Session</Label>
              <p className="text-sm font-semibold">
                {new Date((formation.metadata as FormationMetadata)?.nextSession).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}

          {(formation.metadata as FormationMetadata)?.prerequisites && (formation.metadata as FormationMetadata).prerequisites.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Prérequis</Label>
              <ul className="space-y-2">
                {(formation.metadata as FormationMetadata).prerequisites.map((prerequisite: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{prerequisite}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(formation.metadata as FormationMetadata)?.objectives && (formation.metadata as FormationMetadata).objectives.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Objectifs</Label>
              <ul className="space-y-2">
                {(formation.metadata as FormationMetadata).objectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Separator className="my-6 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" />

        <DialogFooter className="space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="hover:bg-white/20 dark:hover:bg-gray-800/50"
          >
            Fermer
          </Button>
          {(formation.metadata as FormationMetadata)?.pdfUrl && (
            <Button
              variant="default"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
              onClick={() => window.open((formation.metadata as FormationMetadata)?.pdfUrl, '_blank')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Voir le PDF
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
