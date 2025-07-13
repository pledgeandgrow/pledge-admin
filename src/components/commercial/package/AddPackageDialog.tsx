'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, ProductStatus } from '@/types/products';
import { Plus, X } from 'lucide-react';

interface AddPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pkg: Partial<Product>) => Promise<void>;
}

export function AddPackageDialog({
  open,
  onOpenChange,
  onSave,
}: AddPackageDialogProps) {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: number;
    status: ProductStatus;
    duration: string;
    features: string[];
    category: string;
    level: string;
  }>({
    name: '',
    description: '',
    price: 0,
    status: 'active',
    duration: '',
    features: [],
    category: 'Consulting',
    level: 'Basic'
  });

  const [newFeature, setNewFeature] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the product data for Supabase
    const productData: Partial<Product> = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      status: formData.status,
      type: 'package', // Always set type to package
      metadata: {
        duration: formData.duration,
        category: formData.category,
        features: formData.features,
        level: formData.level
      }
    };
    
    // Call the onSave function and handle the Promise
    onSave(productData)
      .then(() => {
        // Reset form after successful save
        setFormData({
          name: '',
          description: '',
          price: 0,
          status: 'active',
          duration: '',
          features: [],
          category: 'Consulting',
          level: 'Basic'
        });
        onOpenChange(false);
      })
      .catch((error) => {
        console.error('Error saving package:', error);
      });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Nouveau package
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Titre du package"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description détaillée du package"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prix (€)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="Prix"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Durée</Label>
                <Input
                  value={formData.duration}
                  onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="ex: 3 mois"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Niveau</Label>
                <Select
                  value={formData.level}
                  onValueChange={value => setFormData(prev => ({ ...prev, level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={formData.status}
                onValueChange={value => setFormData(prev => ({ ...prev, status: value as ProductStatus }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Disponible</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="discontinued">Limité</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Fonctionnalités</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  placeholder="Ajouter une fonctionnalité"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.features?.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded-md">
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
            >
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}