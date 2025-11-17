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
      <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-gray-950 via-gray-900 to-black border border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            {isNewOffre ? 'Nouvelle Offre' : 'Modifier l\'Offre'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom de l'offre"
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description détaillée de l&apos;offre"
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-300">Prix (€)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price || ''}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Prix en euros"
                  className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-300">Type</Label>
                <Select value={type} onValueChange={(value) => setType(value as ProductType)}>
                  <SelectTrigger id="type" className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border border-gray-800">
                    <SelectItem value="software">Logiciel</SelectItem>
                    <SelectItem value="tool">Outil</SelectItem>
                    <SelectItem value="hardware">Matériel</SelectItem>
                    <SelectItem value="membership">Abonnement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-300">Statut</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ProductStatus)}>
                <SelectTrigger id="status" className="bg-gray-900 border-gray-800 text-white">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border border-gray-800">
                  <SelectItem value="active">Disponible</SelectItem>
                  <SelectItem value="draft">Bientôt disponible</SelectItem>
                  <SelectItem value="discontinued">Épuisé</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-4 bg-gray-800" />

            <div className="space-y-2">
              <Label htmlFor="validUntil" className="text-gray-300">Date de validité</Label>
              <Input
                id="validUntil"
                type="date"
                value={validUntil ? new Date(validUntil).toISOString().split('T')[0] : ''}
                onChange={(e) => setValidUntil(e.target.value ? new Date(e.target.value).toISOString() : '')}
                placeholder="Date de validité"
                className="bg-gray-900 border-gray-800 text-white focus-visible:ring-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specifications" className="text-gray-300">Spécifications</Label>
              <Textarea
                id="specifications"
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
                placeholder="Spécifications techniques"
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer" className="text-gray-300">Fabricant</Label>
                <Input
                  id="manufacturer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="Nom du fabricant"
                  className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warranty" className="text-gray-300">Garantie</Label>
                <Input
                  id="warranty"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  placeholder="Durée de garantie"
                  className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500"
                />
              </div>
            </div>
          </div>

          <Separator className="my-4 bg-gray-800" />

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
                className="border-gray-700 text-gray-200 hover:bg-gray-800"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-gray-700 via-gray-900 to-black border border-gray-700 text-white hover:opacity-90"
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
