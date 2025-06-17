'use client';

import { Prestation } from '@/types/prestation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface ViewPrestationDialogProps {
  prestation: Prestation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getStatusColor: (status: Prestation['status']) => string;
  getCategoryColor: (category: string) => string;
  getStatusText: (status: Prestation['status']) => string;
}

export function ViewPrestationDialog({
  prestation,
  open,
  onOpenChange,
  getStatusColor,
  getCategoryColor,
  getStatusText,
}: ViewPrestationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {prestation.title}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
            <p className="text-sm">{prestation.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Fourchette de prix</Label>
              <p className="text-lg font-semibold">{prestation.priceMin.toLocaleString('fr-FR')} - {prestation.priceMax.toLocaleString('fr-FR')} €</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Durée</Label>
              <p className="text-lg font-semibold">{prestation.duration}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Catégorie</Label>
            <div>
              <Badge variant="outline" className={getCategoryColor(prestation.category)}>
                {prestation.category}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
            <div>
              <Badge variant="outline" className={getStatusColor(prestation.status)}>
                {getStatusText(prestation.status)}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Caractéristiques</Label>
            <ul className="list-disc list-inside text-sm space-y-1 pl-2">
              {prestation.features.map((feature, index) => (
                <li key={index} className="text-sm">{feature}</li>
              ))}
            </ul>
          </div>
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
