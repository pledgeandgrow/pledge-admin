import { useState } from 'react';
import { Document, CreateDocumentParams, UpdateDocumentParams } from '@/types/documents';
import { SpecificationMetadata } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { SpecificationEditor } from './SpecificationEditor';

interface SpecificationFormProps {
  document?: Document | null;
  documentTypeId: string;
  onSubmit: (data: CreateDocumentParams | UpdateDocumentParams) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SpecificationForm({
  document,
  documentTypeId,
  onSubmit,
  onCancel,
  isLoading = false
}: SpecificationFormProps) {
  // Extract metadata from document if it exists
  const metadata = document?.metadata as unknown as SpecificationMetadata | undefined;
  
  // Form state
  const [title, setTitle] = useState(document?.title || '');
  const [content, setContent] = useState(metadata?.content || '');
  const [status, setStatus] = useState<'Draft' | 'Review' | 'Approved' | 'Archived'>(metadata?.status || 'Draft');
  const [clientName, setClientName] = useState(metadata?.client_name || '');
  const [projectName, setProjectName] = useState(metadata?.project_name || '');
  const [estimatedHours, setEstimatedHours] = useState<number | undefined>(metadata?.estimated_hours);
  const [estimatedCost, setEstimatedCost] = useState<number | undefined>(metadata?.estimated_cost);
  const [targetDate, setTargetDate] = useState<Date | undefined>(
    metadata?.target_completion_date ? new Date(metadata.target_completion_date) : undefined
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare metadata as a Record type to satisfy Supabase requirements
    const newMetadata: Record<string, string | number | boolean | null> = {
      content,
      status,
      client_name: clientName || null,
      project_name: projectName || null,
      estimated_hours: estimatedHours || null,
      estimated_cost: estimatedCost || null,
      target_completion_date: targetDate ? targetDate.toISOString() : null
    };
    
    // Preserve any existing metadata fields that we don't explicitly update
    if (document?.metadata && typeof document.metadata === 'object') {
      const existingMetadata = document.metadata as Record<string, unknown>;
      Object.keys(existingMetadata).forEach(key => {
        if (!(key in newMetadata) && key !== 'content' && key !== 'status') {
          // Only copy over values that match our allowed types
          const value = existingMetadata[key];
          if (value === null || 
              typeof value === 'string' || 
              typeof value === 'number' || 
              typeof value === 'boolean') {
            newMetadata[key] = value;
          }
        }
      });
    }
    
    if (document) {
      // Update existing document
      onSubmit({
        id: document.id,
        title,
        metadata: newMetadata
      });
    } else {
      // Create new document
      onSubmit({
        title,
        document_type_id: documentTypeId,
        metadata: newMetadata
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          placeholder="Titre du cahier des charges"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select 
          value={status} 
          onValueChange={(value) => setStatus(value as 'Draft' | 'Review' | 'Approved' | 'Archived')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Draft">Brouillon</SelectItem>
            <SelectItem value="Review">En révision</SelectItem>
            <SelectItem value="Approved">Approuvé</SelectItem>
            <SelectItem value="Archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Project and Client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectName">Projet</Label>
          <Input
            id="projectName"
            placeholder="Nom du projet"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientName">Client</Label>
          <Input
            id="clientName"
            placeholder="Nom du client"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
      </div>

      {/* Estimates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimatedHours">Heures estimées</Label>
          <Input
            id="estimatedHours"
            type="number"
            placeholder="0"
            value={estimatedHours || ''}
            onChange={(e) => setEstimatedHours(e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedCost">Coût estimé (€)</Label>
          <Input
            id="estimatedCost"
            type="number"
            placeholder="0"
            value={estimatedCost || ''}
            onChange={(e) => setEstimatedCost(e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetDate">Date cible</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="targetDate"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !targetDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {targetDate ? format(targetDate, "dd/MM/yyyy", { locale: fr }) : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={targetDate}
                onSelect={setTargetDate}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <Label htmlFor="content">Contenu</Label>
        <SpecificationEditor
          content={content}
          onChange={setContent}
          metadata={metadata}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Chargement...' : document ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
