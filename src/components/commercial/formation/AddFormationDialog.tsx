'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { Data } from '@/types/data';

interface AddFormationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formation: Partial<Data>) => void;
}

export function AddFormationDialog({ open, onOpenChange, onSave }: AddFormationDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [instructor, setInstructor] = useState('');
  const [nextSession, setNextSession] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [objectives, setObjectives] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formationData: Partial<Data> = {
      title,
      content: description,
      status: 'draft',
      data_type: 'formation',
      metadata: {
        category,
        level,
        duration,
        price: price ? parseFloat(price) : undefined,
        instructor,
        nextSession: nextSession || undefined,
        pdfUrl: pdfUrl || undefined,
        prerequisites: prerequisites ? prerequisites.split('\n').map(p => p.trim()).filter(Boolean) : undefined,
        objectives: objectives ? objectives.split('\n').map(o => o.trim()).filter(Boolean) : undefined
      }
    };
    
    onSave(formationData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une formation</DialogTitle>
          <DialogDescription>
            Créez une nouvelle formation en remplissant les champs ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la formation"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description détaillée de la formation"
                required
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie <span className="text-red-500">*</span></Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Développement</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Security">Sécurité</SelectItem>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">Niveau <span className="text-red-500">*</span></Label>
                <Select value={level} onValueChange={setLevel} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Débutant</SelectItem>
                    <SelectItem value="Intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="Advanced">Avancé</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€) <span className="text-red-500">*</span></Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Prix en euros"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Durée <span className="text-red-500">*</span></Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 3 jours, 24 heures"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor">Formateur</Label>
                <Input
                  id="instructor"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="Nom du formateur"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nextSession">Prochaine session</Label>
                <Input
                  id="nextSession"
                  type="date"
                  value={nextSession}
                  onChange={(e) => setNextSession(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pdfUrl">URL du PDF</Label>
              <Input
                id="pdfUrl"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="Lien vers le PDF de la formation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prerequisites">Prérequis (un par ligne)</Label>
              <Textarea
                id="prerequisites"
                value={prerequisites}
                onChange={(e) => setPrerequisites(e.target.value)}
                placeholder="Liste des prérequis (un par ligne)"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objectives">Objectifs (un par ligne)</Label>
              <Textarea
                id="objectives"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="Liste des objectifs (un par ligne)"
                className="min-h-[80px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}