'use client';

import { useState } from 'react';
import { Product, ProductStatus, ProductType } from '@/types/products';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

interface EditAutreOffreDialogProps {
  offre: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (offre: Product) => void;
  onDelete?: (id: string) => Promise<void>;
}

export function EditAutreOffreDialog({
  offre,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: EditAutreOffreDialogProps) {
  const isNewOffre = !offre?.id;
  const [name, setName] = useState(offre?.name || '');
  const [description, setDescription] = useState(offre?.description || '');
  const [price, setPrice] = useState<number | undefined>(offre?.price);
  const [type, setType] = useState<ProductType>(offre?.type as ProductType || 'software');
  const [status, setStatus] = useState<ProductStatus>(offre?.status || 'draft');
  const [validUntil, setValidUntil] = useState(
    offre?.metadata && 'validUntil' in offre.metadata
      ? String(offre.metadata.validUntil)
      : ''
  );
  const [specifications, setSpecifications] = useState(
    offre?.metadata && 'specifications' in offre.metadata
      ? String(offre.metadata.specifications)
      : ''
  );
  const [manufacturer, setManufacturer] = useState(
    offre?.metadata && 'manufacturer' in offre.metadata
      ? String(offre.metadata.manufacturer)
      : ''
  );
  const [warranty, setWarranty] = useState(
    offre?.metadata && 'warranty' in offre.metadata
      ? String(offre.metadata.warranty)
      : ''
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updatedOffre: Product = {
      id: offre?.id,
      name,
      description,
      price, // Price is already correctly typed as number | undefined
      type,
      status,
      metadata: {
        ...(offre?.metadata || {}),
        validUntil: validUntil || undefined,
        specifications: specifications || undefined,
        manufacturer: manufacturer || undefined,
        warranty: warranty || undefined,
      },
      created_at: offre?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(updatedOffre);
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {isNewOffre ? 'Nouvelle Offre' : 'Modifier l\'Offre'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom de l'offre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description détaillée de l&apos;offre"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price || ''}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Prix en euros"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(value) => setType(value as ProductType)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software">Logiciel</SelectItem>
                    <SelectItem value="tool">Outil</SelectItem>
                    <SelectItem value="hardware">Matériel</SelectItem>
                    <SelectItem value="membership">Abonnement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ProductStatus)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Disponible</SelectItem>
                  <SelectItem value="draft">Bientôt disponible</SelectItem>
                  <SelectItem value="discontinued">Épuisé</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label htmlFor="validUntil">Date de validité</Label>
              <Input
                id="validUntil"
                type="date"
                value={validUntil ? new Date(validUntil).toISOString().split('T')[0] : ''}
                onChange={(e) => setValidUntil(e.target.value ? new Date(e.target.value).toISOString() : '')}
                placeholder="Date de validité"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specifications">Spécifications</Label>
              <Textarea
                id="specifications"
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
                placeholder="Spécifications techniques"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Fabricant</Label>
                <Input
                  id="manufacturer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="Nom du fabricant"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warranty">Garantie</Label>
                <Input
                  id="warranty"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  placeholder="Durée de garantie"
                />
              </div>
            </div>
          </div>

          <Separator className="my-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" />

          <DialogFooter className="flex justify-between w-full">
            <div className="flex gap-2">
              {!isNewOffre && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => offre?.id && onDelete(offre.id)}
                >
                  Supprimer
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="hover:bg-white/20 dark:hover:bg-gray-800/50"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
