'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, ProductType, ProductStatus } from '@/types/products';
import { Loader2 } from 'lucide-react';

interface AddAutreOffreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (offre: Product) => void;
}

export function AddAutreOffreDialog({ open, onOpenChange, onSave }: AddAutreOffreDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [type, setType] = useState<ProductType>('software');
  const [status, setStatus] = useState<ProductStatus>('draft');
  const [validUntil, setValidUntil] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [warranty, setWarranty] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Create a new product object
      const newOffre: Product = {
        name,
        description,
        price,
        type,
        status,
        metadata: {
          validUntil: validUntil || undefined,
          specifications: specifications || undefined,
          manufacturer: manufacturer || undefined,
          warranty: warranty || undefined
        }
      };
      
      await onSave(newOffre);
      
      // Reset form
      setName('');
      setDescription('');
      setPrice(undefined);
      setType('software');
      setStatus('draft');
      setValidUntil('');
      setSpecifications('');
      setManufacturer('');
      setWarranty('');
      
    } catch (error) {
      console.error('Error saving offre:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Ajouter une nouvelle offre</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Nom de l&apos;offre"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Description de l'offre"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Prix (€)
            </Label>
            <Input
              id="price"
              type="number"
              value={price === undefined ? '' : price}
              onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
              className="col-span-3"
              placeholder="Prix en euros (laisser vide pour 'Sur devis')"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={type} onValueChange={(value) => setType(value as ProductType)}>
              <SelectTrigger className="col-span-3">
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Statut
            </Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ProductStatus)}>
              <SelectTrigger className="col-span-3">
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="validUntil" className="text-right">
              Valide jusqu&apos;au
            </Label>
            <Input
              id="validUntil"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specifications" className="text-right">
              Spécifications
            </Label>
            <Textarea
              id="specifications"
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              className="col-span-3"
              placeholder="Spécifications techniques"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manufacturer" className="text-right">
              Fabricant
            </Label>
            <Input
              id="manufacturer"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="col-span-3"
              placeholder="Nom du fabricant"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="warranty" className="text-right">
              Garantie
            </Label>
            <Input
              id="warranty"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              className="col-span-3"
              placeholder="Détails de la garantie"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!name || saving}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
