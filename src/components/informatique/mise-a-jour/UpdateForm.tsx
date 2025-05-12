import { useState } from 'react';
import { Update, UpdateType, UpdateStatus, UpdatePriority } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface UpdateFormProps {
  update?: Update;
  onSubmit: (data: Partial<Update>) => void;
  onCancel: () => void;
}

export function UpdateForm({ update, onSubmit, onCancel }: UpdateFormProps) {
  const [formData, setFormData] = useState({
    title: update?.title || '',
    description: update?.description || '',
    type: update?.type || 'feature',
    status: update?.status || 'planned',
    priority: update?.priority || 'medium',
    version: update?.version || '',
    release_date: update?.release_date,
    planned_date: update?.planned_date,
    affected_components: update?.affected_components?.join(', ') || '',
    changelog: update?.changelog || '',
    assigned_to: update?.assigned_to?.join(', ') || '',
    dependencies: update?.dependencies?.join(', ') || '',
    tags: update?.tags?.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: Partial<Update> = {
      title: formData.title,
      description: formData.description,
      type: formData.type as UpdateType,
      status: formData.status as UpdateStatus,
      priority: formData.priority as UpdatePriority,
      version: formData.version,
      release_date: formData.release_date,
      planned_date: formData.planned_date,
      affected_components: formData.affected_components.split(',').map(s => s.trim()).filter(Boolean),
      changelog: formData.changelog,
      assigned_to: formData.assigned_to.split(',').map(s => s.trim()).filter(Boolean),
      dependencies: formData.dependencies.split(',').map(s => s.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as UpdateType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feature">Fonctionnalité</SelectItem>
                <SelectItem value="bugfix">Correction de bug</SelectItem>
                <SelectItem value="security">Sécurité</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as UpdateStatus })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planifié</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priorité</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value as UpdatePriority })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Basse</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Date de sortie prévue</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.planned_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.planned_date ? (
                    format(new Date(formData.planned_date), 'PPP', { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.planned_date ? new Date(formData.planned_date) : undefined}
                  onSelect={(date) => setFormData({ ...formData, planned_date: date?.toISOString() })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Date de sortie effective</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.release_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.release_date ? (
                    format(new Date(formData.release_date), 'PPP', { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.release_date ? new Date(formData.release_date) : undefined}
                  onSelect={(date) => setFormData({ ...formData, release_date: date?.toISOString() })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="affected_components">Composants affectés (séparés par des virgules)</Label>
          <Input
            id="affected_components"
            value={formData.affected_components}
            onChange={(e) => setFormData({ ...formData, affected_components: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="changelog">Journal des modifications</Label>
          <Textarea
            id="changelog"
            value={formData.changelog}
            onChange={(e) => setFormData({ ...formData, changelog: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="assigned_to">Assigné à (séparés par des virgules)</Label>
          <Input
            id="assigned_to"
            value={formData.assigned_to}
            onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="dependencies">Dépendances (séparées par des virgules)</Label>
          <Input
            id="dependencies"
            value={formData.dependencies}
            onChange={(e) => setFormData({ ...formData, dependencies: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button type="submit">
          {update ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
