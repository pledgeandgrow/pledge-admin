'use client';

import { useState } from 'react';
import { Formation } from '@/types/formation';
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
import { X, Plus, Trash } from 'lucide-react';

interface EditFormationDialogProps {
  formation?: Formation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formation: Partial<Formation>) => void;
  onDelete?: () => void;
}

export function EditFormationDialog({
  formation,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: EditFormationDialogProps) {
  const isEditing = !!formation;

  const [formData, setFormData] = useState<Partial<Formation>>(
    formation || {
      title: '',
      description: '',
      category: 'Development',
      level: 'Beginner',
      duration: '',
      price: 0,
      status: 'Available',
      pdfUrl: '',
      instructor: '',
      prerequisites: [],
      objectives: []
    }
  );

  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newObjective, setNewObjective] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...(prev.prerequisites || []), newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites?.filter((_, i) => i !== index)
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...(prev.objectives || []), newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives?.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {isEditing ? 'Modifier la formation' : 'Nouvelle formation'}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de la formation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description détaillée de la formation"
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
                  placeholder="ex: 3 jours"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={value => setFormData(prev => ({ ...prev, category: value as Formation['category'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Niveau</Label>
                <Select
                  value={formData.level}
                  onValueChange={value => setFormData(prev => ({ ...prev, level: value as Formation['level'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Formateur</Label>
                <Input
                  value={formData.instructor}
                  onChange={e => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  placeholder="Nom du formateur"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={value => setFormData(prev => ({ ...prev, status: value as Formation['status'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                    <SelectItem value="Full">Full</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>URL du PDF</Label>
              <Input
                value={formData.pdfUrl}
                onChange={e => setFormData(prev => ({ ...prev, pdfUrl: e.target.value }))}
                placeholder="Lien vers le PDF du cours"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Prochaine session</Label>
              <Input
                type="date"
                value={formData.nextSession}
                onChange={e => setFormData(prev => ({ ...prev, nextSession: e.target.value }))}
                placeholder="Date de la prochaine session"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Prérequis</Label>
              <div className="flex gap-2">
                <Input
                  value={newPrerequisite}
                  onChange={e => setNewPrerequisite(e.target.value)}
                  placeholder="Ajouter un prérequis"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPrerequisite}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.prerequisites?.map((prerequisite, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded-md">
                    <span className="text-sm">{prerequisite}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrerequisite(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Objectifs</Label>
              <div className="flex gap-2">
                <Input
                  value={newObjective}
                  onChange={e => setNewObjective(e.target.value)}
                  placeholder="Ajouter un objectif"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addObjective}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.objectives?.map((objective, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded-md">
                    <span className="text-sm">{objective}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeObjective(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                className="mr-auto"
              >
                <Trash className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
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
              {isEditing ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
