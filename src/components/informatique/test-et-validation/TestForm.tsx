import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Test, TestCheckItem } from './types';
import { Checkbox } from '@/components/ui/checkbox';

interface TestFormProps {
  onSubmit: (data: Test) => void;
  onCancel: () => void;
  initialData?: Test;
  projects: { id: string; name: string }[];
}

export function TestForm({ onSubmit, onCancel, initialData, projects }: TestFormProps) {
  const [formData, setFormData] = useState<Test>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    check_items: [],
    ...initialData,
  });

  const [newCheckItem, setNewCheckItem] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, due_date: date ? date.toISOString() : undefined }));
  };

  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId);
    setFormData(prev => ({
      ...prev,
      project_id: projectId,
      project_name: selectedProject?.name
    }));
  };

  const addCheckItem = () => {
    if (!newCheckItem.trim()) return;
    
    const newItem: TestCheckItem = {
      test_id: formData.id || '',
      description: newCheckItem,
      is_completed: false,
      created_at: new Date().toISOString()
    };
    
    setFormData(prev => ({
      ...prev,
      check_items: [...(prev.check_items || []), newItem]
    }));
    
    setNewCheckItem('');
  };

  const removeCheckItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      check_items: prev.check_items?.filter((_, i) => i !== index)
    }));
  };

  const toggleCheckItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      check_items: prev.check_items?.map((item, i) => 
        i === index ? { ...item, is_completed: !item.is_completed } : item
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Titre du test</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Titre du test"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description détaillée du test"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="passed">Réussi</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project">Projet</Label>
              <Select
                value={formData.project_id || ''}
                onValueChange={handleProjectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun projet</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="due_date">Date d'échéance</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? (
                      format(new Date(formData.due_date), 'PPP', { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.due_date ? new Date(formData.due_date) : undefined}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Éléments à vérifier</Label>
            <div className="mt-2 space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newCheckItem}
                  onChange={(e) => setNewCheckItem(e.target.value)}
                  placeholder="Ajouter un élément à vérifier"
                  className="flex-1"
                />
                <Button type="button" onClick={addCheckItem} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
                {formData.check_items && formData.check_items.length > 0 ? (
                  formData.check_items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded bg-white">
                      <Checkbox
                        checked={item.is_completed}
                        onCheckedChange={() => toggleCheckItem(index)}
                        id={`check-${index}`}
                      />
                      <Label
                        htmlFor={`check-${index}`}
                        className={`flex-1 text-sm ${item.is_completed ? 'line-through text-gray-400' : ''}`}
                      >
                        {item.description}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCheckItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Aucun élément à vérifier
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {initialData ? 'Mettre à jour' : 'Créer'} le test
        </Button>
      </div>
    </form>
  );
}
