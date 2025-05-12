'use client';

import { Formation } from '@/types/formation';
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

interface ViewFormationDialogProps {
  formation: Formation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getLevelColor: (level: Formation['level']) => string;
  getCategoryColor: (category: Formation['category']) => string;
  getStatusColor: (status: Formation['status']) => string;
  getStatusText: (status: Formation['status']) => string;
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
              {formation.title}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
            <p className="text-sm">{formation.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Prix</Label>
              <p className="text-lg font-semibold">{formation.price.toLocaleString('fr-FR')} €</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Durée</Label>
              <p className="text-lg font-semibold">{formation.duration}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Niveau</Label>
              <div>
                <Badge variant="outline" className={getLevelColor(formation.level)}>
                  {formation.level}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Catégorie</Label>
              <div>
                <Badge variant="outline" className={getCategoryColor(formation.category)}>
                  {formation.category}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
            <div>
              <Badge variant="outline" className={getStatusColor(formation.status)}>
                {getStatusText(formation.status)}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Formateur</Label>
            <p className="text-sm font-semibold">{formation.instructor}</p>
          </div>

          {formation.nextSession && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Prochaine Session</Label>
              <p className="text-sm font-semibold">
                {new Date(formation.nextSession).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}

          {formation.prerequisites && formation.prerequisites.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Prérequis</Label>
              <ul className="space-y-2">
                {formation.prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{prerequisite}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {formation.objectives && formation.objectives.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Objectifs</Label>
              <ul className="space-y-2">
                {formation.objectives.map((objective, index) => (
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
          <Button
            variant="default"
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
          >
            <FileText className="h-4 w-4 mr-2" />
            Voir le PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
