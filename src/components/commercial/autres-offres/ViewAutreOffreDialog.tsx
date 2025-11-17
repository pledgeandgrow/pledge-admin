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
      <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-gray-950 via-gray-900 to-black border border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white">
            {offre.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Description</Label>
            <p className="text-sm text-gray-200">{offre.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Prix</Label>
              <p className="text-lg font-semibold text-white">{offre.price ? `${offre.price.toLocaleString('fr-FR')  } €` : 'Sur devis'}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Type</Label>
              <div>
                <Badge variant="outline" className={`${getTypeColor(offre.type)} border-white/10 bg-white/5 text-xs`}>
                  {getProductTypeDisplay(offre.type)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Disponibilité</Label>
            <div>
              <Badge variant="outline" className={`${getAvailabilityColor(offre.status)} border-white/10 bg-white/5 text-xs`}>
                {getAvailabilityText(offre.status)}
              </Badge>
            </div>
          </div>

          {offre.metadata && 'validUntil' in offre.metadata && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Date de validité</Label>
              <div className="flex items-center text-gray-300">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>Valide jusqu&apos;au {new Date(String(offre.metadata.validUntil)).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          )}
          
          {offre.metadata && 'specifications' in offre.metadata && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Spécifications</Label>
              <p className="text-sm text-gray-200">{String(offre.metadata.specifications)}</p>
            </div>
          )}
          
          {offre.metadata && 'manufacturer' in offre.metadata && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Fabricant</Label>
              <p className="text-sm text-gray-200">{String(offre.metadata.manufacturer)}</p>
            </div>
          )}
          
          {offre.metadata && 'warranty' in offre.metadata && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Garantie</Label>
              <p className="text-sm text-gray-200">{String(offre.metadata.warranty)}</p>
            </div>
          )}
        </div>

        <Separator className="my-6 bg-gray-800" />

        <DialogFooter className="flex justify-between w-full">
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="secondary"
                className="bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
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
            className="border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
