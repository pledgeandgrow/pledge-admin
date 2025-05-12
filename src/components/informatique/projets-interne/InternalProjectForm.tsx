'use client';

import { FC, useState } from 'react';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InternalProjectType } from './types';

interface InternalProjectFormProps {
  project?: InternalProjectType;
  onSubmit: (project: Omit<InternalProjectType, 'id'> | InternalProjectType) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export const InternalProjectForm: FC<InternalProjectFormProps> = ({ 
  project, 
  onSubmit, 
  onCancel,
  onDelete 
}) => {
  const [formData, setFormData] = useState<Omit<InternalProjectType, 'id'>>({
    title: project?.title || '',
    description: project?.description || '',
    dateDebut: project?.dateDebut || format(new Date(), 'dd/MM/yyyy'),
    dateFin: project?.dateFin || format(new Date(), 'dd/MM/yyyy'),
    statut: project?.statut || 'En cours',
    progression: project?.progression || 0,
    priorite: project?.priorite || 'Moyenne',
    responsable: project?.responsable || '',
    equipe: project?.equipe || [],
    technologies: project?.technologies || [],
    repository: project?.repository || '',
    pullRequests: project?.pullRequests || 0,
    commits: project?.commits || 0,
    branches: project?.branches || [],
    documentation: project?.documentation || {
      wiki: '',
      api: '',
      architecture: ''
    },
    taches: project?.taches || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (project) {
      onSubmit({ ...formData, id: project.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du projet</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repository">Repository</Label>
            <Input
              id="repository"
              value={formData.repository}
              onChange={(e) => setFormData(prev => ({ ...prev, repository: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date de début</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dateDebut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateDebut}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(formData.dateDebut.split('/').reverse().join('-'))}
                  onSelect={(date) => date && setFormData(prev => ({
                    ...prev,
                    dateDebut: format(date, 'dd/MM/yyyy')
                  }))}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Date de fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dateFin && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateFin}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(formData.dateFin.split('/').reverse().join('-'))}
                  onSelect={(date) => date && setFormData(prev => ({
                    ...prev,
                    dateFin: format(date, 'dd/MM/yyyy')
                  }))}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Statut</Label>
            <Select
              value={formData.statut}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, statut: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
                <SelectItem value="En pause">En pause</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Priorité</Label>
            <Select
              value={formData.priorite}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, priorite: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Haute">Haute</SelectItem>
                <SelectItem value="Moyenne">Moyenne</SelectItem>
                <SelectItem value="Basse">Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="progression">Progression (%)</Label>
            <Input
              id="progression"
              type="number"
              min="0"
              max="100"
              value={formData.progression}
              onChange={(e) => setFormData(prev => ({ ...prev, progression: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable</Label>
            <Input
              id="responsable"
              value={formData.responsable}
              onChange={(e) => setFormData(prev => ({ ...prev, responsable: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="equipe">Équipe (séparée par des virgules)</Label>
            <Input
              id="equipe"
              value={formData.equipe.join(', ')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                equipe: e.target.value.split(',').map(member => member.trim()).filter(Boolean)
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pullRequests">Pull Requests</Label>
            <Input
              id="pullRequests"
              type="number"
              min="0"
              value={formData.pullRequests}
              onChange={(e) => setFormData(prev => ({ ...prev, pullRequests: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commits">Commits</Label>
            <Input
              id="commits"
              type="number"
              min="0"
              value={formData.commits}
              onChange={(e) => setFormData(prev => ({ ...prev, commits: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branches">Branches (séparées par des virgules)</Label>
            <Input
              id="branches"
              value={formData.branches.join(', ')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                branches: e.target.value.split(',').map(branch => branch.trim()).filter(Boolean)
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wiki">Documentation Wiki</Label>
            <Input
              id="wiki"
              value={formData.documentation.wiki}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                documentation: { ...prev.documentation, wiki: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api">Documentation API</Label>
            <Input
              id="api"
              value={formData.documentation.api}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                documentation: { ...prev.documentation, api: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="architecture">Documentation Architecture</Label>
            <Input
              id="architecture"
              value={formData.documentation.architecture}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                documentation: { ...prev.documentation, architecture: e.target.value }
              }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="technologies">Technologies (séparées par des virgules)</Label>
          <Input
            id="technologies"
            value={formData.technologies.join(', ')}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              technologies: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
            }))}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {project ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
        {onDelete && (
          <Button type="button" variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        )}
      </div>
    </form>
  );
};
