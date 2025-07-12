'use client';

import { Product, ProductStatus } from '@/types/products';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
// Check import removed as it's unused
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface ViewPrestationDialogProps {
  prestation: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  getStatusColor: (status: ProductStatus) => string;
  getCategoryColor: (category: string) => string;
  getStatusText: (status: ProductStatus) => string;
}

export function ViewPrestationDialog({
  prestation,
  open,
  onOpenChange,
  onEdit,
  onDelete,
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
              {prestation.name}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {prestation.description || 'Aucune description disponible'}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Prix</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {prestation.price ? `${prestation.price.toLocaleString('fr-FR')} €` : 'Sur devis'}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Durée</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {prestation.metadata?.duration || 'Non spécifié'}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Catégorie</Label>
              <div className="mt-1">
                <Badge variant="outline" className={getCategoryColor(prestation.metadata?.category || 'Development')}>
                  {prestation.metadata?.category || 'Development'}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Statut</Label>
              <div className="mt-1">
                <Badge className={getStatusColor(prestation.status as ProductStatus)}>
                  {getStatusText(prestation.status as ProductStatus)}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Caractéristiques</Label>
              {(() => {
                // Ensure features is always an array
                const features = prestation.metadata?.features;
                const featuresArray = Array.isArray(features) ? features : [];
                
                return featuresArray.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                    {featuresArray.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Aucune caractéristique spécifiée</p>
                );
              })()}
            </div>
        </div>

        <Separator className="my-6 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" />

        <DialogFooter className="flex justify-between w-full">
          <div>
            <Button
              variant="destructive"
              onClick={onDelete}
              className="mr-2"
            >
              Supprimer
            </Button>
            <Button
              variant="secondary"
              onClick={onEdit}
            >
              Modifier
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
