'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BaseProject } from '@/hooks/useProjects';

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<BaseProject, 'id' | 'created_at' | 'updated_at'>) => void;
  isSubmitting: boolean;
  project?: BaseProject;
}

export function ProjectDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isSubmitting, 
  project 
}: ProjectDialogProps) {
  const [formData, setFormData] = useState<Partial<BaseProject>>(
    project || {
      name: '',
      description: '',
      project_type: 'Client',
      status: 'Active',
      priority: 'Medium',
      start_date: '',
      end_date: '',
      budget: undefined,
      progress: 0,
      tags: [],
      metadata: {
        client_name: '',
        primary_contact_name: '',
        team_members: [],
        budget_unit: 'EUR',
        budget_spent: 0,
        notes: '',
      }
    }
  );

  const [newTag, setNewTag] = useState('');
  const [newTeamMember, setNewTeamMember] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested metadata fields
      const [parent, child] = name.split('.');
      setFormData((prev: Partial<BaseProject>) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Partial<BaseProject>] as Record<string, unknown>),
          [child]: value
        }
      }));
    } else if (name === 'budget') {
      // Handle budget as number
      setFormData((prev: Partial<BaseProject>) => ({
        ...prev,
        [name]: value ? parseFloat(value) : undefined
      }));
    } else if (name === 'progress') {
      // Handle progress as number
      setFormData((prev: Partial<BaseProject>) => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : 0
      }));
    } else {
      // Handle regular fields
      setFormData((prev: Partial<BaseProject>) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name.includes('.')) {
      // Handle nested metadata fields
      const [parent, child] = name.split('.');
      setFormData((prev: Partial<BaseProject>) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Partial<BaseProject>] as Record<string, unknown>),
          [child]: value
        }
      }));
    } else {
      setFormData((prev: Partial<BaseProject>) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData((prev: Partial<BaseProject>) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev: Partial<BaseProject>) => ({
      ...prev,
      tags: prev.tags?.filter((t: string) => t !== tag)
    }));
  };

  const handleAddTeamMember = () => {
    if (newTeamMember && !(formData.metadata?.team_members as string[])?.includes(newTeamMember)) {
      setFormData((prev: Partial<BaseProject>) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          team_members: [...((prev.metadata?.team_members as string[]) || []), newTeamMember]
        }
      }));
      setNewTeamMember('');
    }
  };

  const handleRemoveTeamMember = (member: string) => {
    setFormData((prev: Partial<BaseProject>) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        team_members: (prev.metadata?.team_members as string[])?.filter((m: string) => m !== member)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure required fields are present
    if (!formData.name || !formData.project_type || !formData.status) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onSubmit(formData as Omit<BaseProject, 'id' | 'created_at' | 'updated_at'>);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Modifier le projet' : 'Créer un nouveau projet'}
          </DialogTitle>
          <DialogDescription>
            {project 
              ? 'Modifiez les détails du projet existant.' 
              : 'Remplissez les informations pour créer un nouveau projet.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project_type" className="text-right">
                Type
              </Label>
              <Select 
                value={formData.project_type} 
                onValueChange={(value) => handleSelectChange('project_type', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Internal">Interne</SelectItem>
                  <SelectItem value="Partner">Partenaire</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Actif</SelectItem>
                  <SelectItem value="On Hold">En pause</SelectItem>
                  <SelectItem value="Completed">Terminé</SelectItem>
                  <SelectItem value="Cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priorité
              </Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">Haute</SelectItem>
                  <SelectItem value="Medium">Moyenne</SelectItem>
                  <SelectItem value="Low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start_date" className="text-right">
                Date de début
              </Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end_date" className="text-right">
                Date de fin
              </Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Budget
              </Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metadata.budget_unit" className="text-right">
                Devise
              </Label>
              <Select 
                value={formData.metadata?.budget_unit as string || 'EUR'} 
                onValueChange={(value) => handleSelectChange('metadata.budget_unit', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="progress" className="text-right">
                Progression (%)
              </Label>
              <Input
                id="progress"
                name="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress || 0}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metadata.client_name" className="text-right">
                Nom du client
              </Label>
              <Input
                id="metadata.client_name"
                name="metadata.client_name"
                value={formData.metadata?.client_name as string || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metadata.primary_contact_name" className="text-right">
                Contact principal
              </Label>
              <Input
                id="metadata.primary_contact_name"
                name="metadata.primary_contact_name"
                value={formData.metadata?.primary_contact_name as string || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="team_members" className="text-right pt-2">
                Équipe
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(formData.metadata?.team_members as string[] || []).map((member: string, index: number) => (
                    <div 
                      key={index} 
                      className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md flex items-center gap-1 text-sm"
                    >
                      {member}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTeamMember(member)}
                        className="ml-1 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="newTeamMember"
                    value={newTeamMember}
                    onChange={(e) => setNewTeamMember(e.target.value)}
                    placeholder="Ajouter un membre"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddTeamMember}
                    disabled={!newTeamMember}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="tags" className="text-right pt-2">
                Tags
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(formData.tags || []).map((tag: string, index: number) => (
                    <div 
                      key={index} 
                      className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md flex items-center gap-1 text-sm"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="newTag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddTag}
                    disabled={!newTag}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metadata.notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="metadata.notes"
                name="metadata.notes"
                value={formData.metadata?.notes as string || ''}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : project ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
