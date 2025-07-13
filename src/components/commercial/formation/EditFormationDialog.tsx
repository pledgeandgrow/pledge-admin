'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Data, DataStatus } from '@/types/data';
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
import { toast } from '@/components/ui/use-toast';

interface FormationMetadata extends Record<string, unknown> {
  category: string;
  level: string;
  duration: string;
  price: number;
  instructor: string;
  nextSession: string;
  pdfUrl: string;
  description?: string;
  prerequisites: string[];
  objectives: string[];
}

interface EditFormationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formation?: Partial<Data>;
  onSave?: (formation: Partial<Data>) => Promise<void>;
  onDelete?: (formation: Partial<Data>) => Promise<void>;
}

export function EditFormationDialog({
  formation,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: EditFormationDialogProps) {
  const isEditing = !!formation;

  const [formData, setFormData] = useState<Partial<Data>>(() => {
    if (formation) {
      return {
        ...formation,
        metadata: {
          ...{
            category: 'Development',
            level: 'Beginner',
            duration: '',
            price: 0,
            instructor: '',
            nextSession: '',
            pdfUrl: '',
            description: '',
            prerequisites: [],
            objectives: []
          },
          ...((formation.metadata as FormationMetadata) || {})
        } as FormationMetadata
      };
    }
    return {
      title: '',
      description: '',
      data_type: 'formation',
      status: 'draft' as DataStatus,
      metadata: {
        category: 'Development',
        level: 'Beginner',
        duration: '',
        price: 0,
        instructor: '',
        nextSession: '',
        pdfUrl: '',
        prerequisites: [],
        objectives: []
      } as FormationMetadata
    };
  });

  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newObjective, setNewObjective] = useState('');

  useEffect(() => {
    if (formation) {
      setFormData(formation);
    }
  }, [formation]);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    
    try {
      if (onSave) {
        await onSave(formData);
        toast({
          title: isEditing ? 'Formation mise à jour' : 'Formation créée',
          description: `La formation "${formData.title}" a été ${isEditing ? 'mise à jour' : 'créée'} avec succès.`,
          variant: 'default',
        });
        onOpenChange(false);
        // Refresh the page to show updated data
        router.refresh();
      }
    } catch (err) {
      console.error('Error saving formation:', err);
      setError('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: Partial<Data>) => ({ ...prev, title: e.target.value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev: Partial<Data>) => ({ ...prev, content: e.target.value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev: Partial<Data>) => ({
      ...prev,
      metadata: {
        ...(prev.metadata as FormationMetadata || {
          prerequisites: [], 
          objectives: [], 
          level: 'Beginner', 
          duration: '', 
          price: 0, 
          instructor: '', 
          nextSession: '', 
          pdfUrl: ''
        }),
        category: value
      } as FormationMetadata
    }));
  };

  const handleLevelChange = (value: string) => {
    setFormData((prev: Partial<Data>) => ({
      ...prev,
      metadata: {
        ...(prev.metadata as FormationMetadata || {
          prerequisites: [], 
          objectives: [], 
          category: 'Development', 
          duration: '', 
          price: 0, 
          instructor: '', 
          nextSession: '', 
          pdfUrl: ''
        }),
        level: value
      } as FormationMetadata
    }));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: Partial<Data>) => ({
      ...prev,
      metadata: {
        ...(prev.metadata as FormationMetadata || {
          prerequisites: [], 
          objectives: [], 
          category: 'Development', 
          level: 'Beginner', 
          price: 0, 
          instructor: '', 
          nextSession: '', 
          pdfUrl: ''
        }),
        duration: e.target.value
      } as FormationMetadata
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: Partial<Data>) => ({
      ...prev,
      metadata: {
        ...(prev.metadata as FormationMetadata || {
          prerequisites: [], 
          objectives: [], 
          category: 'Development', 
          level: 'Beginner', 
          duration: '', 
          instructor: '', 
          nextSession: '', 
          pdfUrl: ''
        }),
        price: parseFloat(e.target.value) || 0
      } as FormationMetadata
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev: Partial<Data>) => ({ ...prev, status: value as DataStatus }));
  };

  const handlePdfUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: Partial<Data>) => ({
      ...prev,
      metadata: {
        ...(prev.metadata || {
          prerequisites: [], 
          objectives: [], 
          category: 'Development', 
          level: 'Beginner', 
          duration: '', 
          price: 0, 
          instructor: '', 
          nextSession: ''
        }),
        pdfUrl: e.target.value
      }
    }));
  };

  const handleInstructorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: Partial<Data>) => ({
      ...prev,
      metadata: {
        ...(prev.metadata || {
          prerequisites: [], 
          objectives: [], 
          category: 'Development', 
          level: 'Beginner', 
          duration: '', 
          price: 0, 
          nextSession: '', 
          pdfUrl: ''
        }),
        instructor: e.target.value
      }
    }));
  };
  
  const handleNextSessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: Partial<Data>) => ({
      ...prev,
      metadata: {
        ...(prev.metadata || {
          prerequisites: [], 
          objectives: [], 
          category: 'Development', 
          level: 'Beginner', 
          duration: '', 
          price: 0, 
          instructor: '', 
          pdfUrl: ''
        }),
        nextSession: e.target.value
      }
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setFormData((prev: Partial<Data>) => ({
        ...prev,
        metadata: {
          ...(prev.metadata || {
            objectives: [], 
            category: 'Development', 
            level: 'Beginner', 
            duration: '', 
            price: 0, 
            instructor: '', 
            nextSession: '', 
            pdfUrl: ''
          }),
          prerequisites: [
            ...((prev.metadata?.prerequisites as string[]) || []),
            newPrerequisite.trim()
          ]
        }
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (index: number) => {
    setFormData((prev: Partial<Data>) => ({
      ...prev,
      metadata: {
        ...(prev.metadata || {
          objectives: [], 
          category: 'Development', 
          level: 'Beginner', 
          duration: '', 
          price: 0, 
          instructor: '', 
          nextSession: '', 
          pdfUrl: ''
        }),
        prerequisites: ((prev.metadata?.prerequisites as string[]) || []).filter(
          (_: string, i: number) => i !== index
        )
      }
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData((prev: Partial<Data>) => ({
        ...prev,
        metadata: {
          ...(prev.metadata || {
            prerequisites: [], 
            category: 'Development', 
            level: 'Beginner', 
            duration: '', 
            price: 0, 
            instructor: '', 
            nextSession: '', 
            pdfUrl: ''
          }),
          objectives: [
            ...((prev.metadata?.objectives as string[]) || []),
            newObjective.trim()
          ]
        }
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData((prev: Partial<Data>) => ({
      ...prev,
      metadata: {
        ...(prev.metadata || {
          prerequisites: [], 
          category: 'Development', 
          level: 'Beginner', 
          duration: '', 
          price: 0, 
          instructor: '', 
          nextSession: '', 
          pdfUrl: ''
        }),
        objectives: ((prev.metadata?.objectives as string[]) || []).filter(
          (_: string, i: number) => i !== index
        )
      }
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
            {error && (
              <div className="mt-2 p-2 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                {error}
              </div>
            )}
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => handleTitleChange(e)}
                placeholder="Titre de la formation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.content || formData.summary || ''}
                onChange={(e) => handleDescriptionChange(e)}
                placeholder="Description détaillée de la formation"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prix (€)</Label>
                <Input
                  type="number"
                  value={(formData.metadata as FormationMetadata)?.price || 0}
                  onChange={(e) => handlePriceChange(e)}
                  placeholder="Prix"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Durée</Label>
                <Input
                  value={(formData.metadata as FormationMetadata)?.duration || ''}
                  onChange={(e) => handleDurationChange(e)}
                  placeholder="ex: 3 jours"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select
                  value={(formData.metadata as FormationMetadata)?.category || 'Development'}
                  onValueChange={(value) => handleCategoryChange(value)}
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
                  value={(formData.metadata as FormationMetadata)?.level || 'Beginner'}
                  onValueChange={(value) => handleLevelChange(value)}
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
                  value={(formData.metadata as FormationMetadata)?.instructor || ''}
                  onChange={(e) => handleInstructorChange(e)}
                  placeholder="Nom du formateur"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={formData.status || 'draft'}
                  onValueChange={(value) => handleStatusChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>URL du PDF</Label>
              <Input
                value={(formData.metadata as FormationMetadata)?.pdfUrl || ''}
                onChange={(e) => handlePdfUrlChange(e)}
                placeholder="Lien vers le PDF du cours"
              />
            </div>

            <div className="space-y-2">
              <Label>Prochaine session</Label>
              <Input
                type="date"
                value={(formData.metadata as FormationMetadata)?.nextSession || ''}
                onChange={(e) => handleNextSessionChange(e)}
                placeholder="Date de la prochaine session"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Prérequis</Label>
              <div className="flex gap-2">
                <Input
                  value={newPrerequisite}
                  onChange={(e) => setNewPrerequisite(e.target.value)}
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
                {(formData.metadata?.prerequisites as string[] || []).map((prerequisite: string, index: number) => (
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
                  onChange={(e) => setNewObjective(e.target.value)}
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
                {(formData.metadata?.objectives as string[] || []).map((objective: string, index: number) => (
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
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (onDelete && formation) {
                    onDelete(formation);
                    toast({
                      title: 'Formation supprimée',
                      description: `La formation "${formation.title}" a été supprimée avec succès.`,
                      variant: 'destructive',
                    });
                  }
                  onOpenChange(false);
                }}
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
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {isEditing ? 'Mise à jour...' : 'Création...'}
                </>
              ) : (
                isEditing ? 'Mettre à jour' : 'Créer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
