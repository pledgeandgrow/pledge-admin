'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Package } from '@/types/package';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewPackageDialogProps {
  package: Package;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getLevelColor: (level: Package['level']) => string;
  getCategoryColor: (category: Package['category']) => string;
  getStatusColor: (status: Package['status']) => string;
  getStatusText: (status: Package['status']) => string;
}

export function ViewPackageDialog({
  package: pkg,
  open,
  onOpenChange,
  getLevelColor,
  getCategoryColor,
  getStatusColor,
  getStatusText
}: ViewPackageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {pkg.title}
            </span>
            <Badge variant="outline" className={getStatusColor(pkg.status)}>
              {getStatusText(pkg.status)}
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
                {pkg.price.toLocaleString('fr-FR')} €
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Durée</h4>
              <p className="text-2xl font-semibold">{pkg.duration}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Niveau</h4>
              <Badge variant="outline" className={getLevelColor(pkg.level)}>
                {pkg.level}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Catégorie</h4>
              <Badge variant="outline" className={getCategoryColor(pkg.category)}>
                {pkg.category}
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Fonctionnalités</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {pkg.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

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
