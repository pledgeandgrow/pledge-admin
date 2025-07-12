'use client';

import { useState } from 'react';
import { Product, ProductStatus } from '@/types/products';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddPrestationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialPrestation: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  type: 'service',
  status: 'active',
  metadata: {
    duration: '',
    category: '',
    features: []
  }
};

const categories = [
  'Consulting',
  'Marketing Digital',
  'Développement',
  'Support',
  'Formation',
  'Design',
  'Autre'
];

export function AddPrestationDialog({ open, onOpenChange }: AddPrestationDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>(initialPrestation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement prestation creation logic
    console.log('Creating prestation:', formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une Prestation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de la prestation</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Consultation Stratégique"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.metadata?.category || ''}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  metadata: { 
                    ...formData.metadata,
                    category: value 
                  } 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre prestation..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Durée</Label>
                <Input
                  id="duration"
                  value={formData.metadata?.duration || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    metadata: { 
                      ...formData.metadata,
                      duration: e.target.value 
                    } 
                  })}
                  placeholder="Ex: 2 heures"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ProductStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Disponible</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="discontinued">Limité</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Créer la prestation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
