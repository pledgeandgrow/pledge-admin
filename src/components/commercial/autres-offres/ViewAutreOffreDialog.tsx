'use client';

import { Product } from '@/types/products';
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
  offre: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getAvailabilityColor: (status: string) => string;
  getTypeColor: (type: string) => string;
  getAvailabilityText: (status: string) => string;
  getProductTypeDisplay: (type: string) => string;
  onEdit?: () => void;
  onDelete?: (id: string) => Promise<void>;
}

export function ViewAutreOffreDialog({
  offre,
  open,
  onOpenChange,
  getAvailabilityColor,
  getTypeColor,
  getAvailabilityText,
  getProductTypeDisplay,
  onEdit,
  onDelete
}: ViewAutreOffreDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {offre.name}
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
              <p className="text-lg font-semibold">{offre.price ? `${offre.price.toLocaleString('fr-FR')  } €` : 'Sur devis'}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Type</Label>
              <div>
                <Badge variant="outline" className={getTypeColor(offre.type)}>
                  {getProductTypeDisplay(offre.type)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Disponibilité</Label>
            <div>
              <Badge variant="outline" className={getAvailabilityColor(offre.status)}>
                {getAvailabilityText(offre.status)}
              </Badge>
            </div>
          </div>

          {offre.metadata && 'validUntil' in offre.metadata && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Date de validité</Label>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Valide jusqu&apos;au {new Date(String(offre.metadata.validUntil)).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          )}
          
          {offre.metadata && 'specifications' in offre.metadata && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Spécifications</Label>
              <p className="text-sm">{String(offre.metadata.specifications)}</p>
            </div>
          )}
          
          {offre.metadata && 'manufacturer' in offre.metadata && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Fabricant</Label>
              <p className="text-sm">{String(offre.metadata.manufacturer)}</p>
            </div>
          )}
          
          {offre.metadata && 'warranty' in offre.metadata && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Garantie</Label>
              <p className="text-sm">{String(offre.metadata.warranty)}</p>
            </div>
          )}
        </div>

        <Separator className="my-6 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" />

        <DialogFooter className="flex justify-between w-full">
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="secondary"
                onClick={onEdit}
              >
                Modifier
              </Button>
            )}
            {onDelete && offre.id && (
              <Button
                variant="destructive"
                onClick={() => onDelete(offre.id || '')}
              >
                Supprimer
              </Button>
            )}
          </div>
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
