'use client';

import { AutreOffre } from '@/types/commercial';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface ViewAutreOffreDialogProps {
  offre: AutreOffre;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getAvailabilityColor: (availability: AutreOffre['availability']) => string;
  getTypeColor: (type: string) => string;
  getAvailabilityText: (availability: AutreOffre['availability']) => string;
}

export function ViewAutreOffreDialog({
  offre,
  open,
  onOpenChange,
  getAvailabilityColor,
  getTypeColor,
  getAvailabilityText,
}: ViewAutreOffreDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {offre.title}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
            <p className="text-sm">{offre.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Prix</Label>
              <p className="text-lg font-semibold">{offre.price.toLocaleString('fr-FR')} €</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Type</Label>
              <div>
                <Badge variant="outline" className={getTypeColor(offre.type)}>
                  {offre.type}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Disponibilité</Label>
            <div>
              <Badge variant="outline" className={getAvailabilityColor(offre.availability)}>
                {getAvailabilityText(offre.availability)}
              </Badge>
            </div>
          </div>

          {offre.validUntil && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Date de validité</Label>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Valide jusqu&apos;au {new Date(offre.validUntil).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-6 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="hover:bg-white/20 dark:hover:bg-gray-800/50"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
