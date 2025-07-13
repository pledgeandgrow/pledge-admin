'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Product, ProductStatus } from '@/types/products';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewPackageDialogProps {
  package: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  getLevelColor: (level: string) => string;
  getCategoryColor: (category: string) => string;
  getStatusColor: (status: ProductStatus) => string;
  getStatusText: (status: ProductStatus) => string;
}

export function ViewPackageDialog({
  package: pkg,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  getLevelColor,
  getCategoryColor,
  getStatusColor,
  getStatusText
}: ViewPackageDialogProps) {
  // Extract metadata fields with safe defaults
  const metadata = pkg.metadata || {};
  const level = metadata.level as string || 'Standard';
  const category = metadata.category as string || 'Development';
  // Ensure features is always an array
  const features = Array.isArray(metadata.features) ? metadata.features : [];
  const duration = metadata.duration as string || 'Non spécifié';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {pkg.name}
            </span>
            <Badge variant="outline" className={getStatusColor(pkg.status as ProductStatus)}>
              {getStatusText(pkg.status as ProductStatus)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{pkg.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Prix</h4>
              <p className="text-2xl font-semibold">
                {pkg.price ? `${pkg.price.toLocaleString('fr-FR')} €` : 'Sur devis'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Durée</h4>
              <p className="text-2xl font-semibold">{duration}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Niveau</h4>
              <Badge variant="outline" className={getLevelColor(level)}>
                {level}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Catégorie</h4>
              <Badge variant="outline" className={getCategoryColor(category)}>
                {category}
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Fonctionnalités</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
              {features.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Aucune fonctionnalité spécifiée
                </div>
              )}
            </div>
          </div>
        </div>

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
