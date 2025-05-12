import { useState, useEffect } from 'react';
import { Technology, TechnologyType } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface TechnologyFormProps {
  technology?: Technology | null;
  onSubmit: (data: Partial<Technology>) => void;
  onCancel: () => void;
}

export function TechnologyForm({
  technology,
  onSubmit,
  onCancel,
}: TechnologyFormProps) {
  const [formData, setFormData] = useState({
    name: technology?.name || '',
    description: technology?.description || '',
    type: technology?.type || 'framework',
    version: technology?.version || '',
    website: technology?.website || '',
    documentation: technology?.documentation || '',
    // Additional fields based on type
    ecosystem: (technology?.type === 'framework' ? technology.ecosystem : '') || '',
    features: (technology?.type === 'framework' ? technology.features : []) || [],
    use_cases: (technology?.type === 'framework' ? technology.use_cases : []) || [],
    paradigms: (technology?.type === 'language' ? technology.paradigms : []) || [],
    compilation_type: (technology?.type === 'language' ? technology.compilation_type : 'compiled') || 'compiled',
    typical_uses: (technology?.type === 'language' ? technology.typical_uses : []) || [],
    dependencies: (technology?.type === 'library' ? technology.dependencies : []) || [],
    installation: (technology?.type === 'library' ? technology.installation : '') || '',
    common_uses: (technology?.type === 'library' ? technology.common_uses : []) || [],
    category: (technology?.type === 'tool' ? technology.category : '') || '',
    integration_points: (technology?.type === 'tool' ? technology.integration_points : []) || [],
    platforms: (technology?.type === 'tool' ? technology.platforms : []) || [],
    database_type: (technology?.type === 'database' ? technology.database_type : 'sql') || 'sql',
    scaling_options: (technology?.type === 'database' ? technology.scaling_options : []) || [],
    hosting_type: (technology?.type === 'platform' ? technology.hosting_type : 'cloud') || 'cloud',
    services: (technology?.type === 'platform' ? technology.services : []) || [],
    deployment_options: (technology?.type === 'platform' ? technology.deployment_options : []) || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: Partial<Technology> = {
      name: formData.name,
      description: formData.description,
      type: formData.type as TechnologyType,
      version: formData.version,
      website: formData.website,
      documentation: formData.documentation,
    };

    // Add type-specific fields
    switch (formData.type) {
      case 'framework':
        submitData.ecosystem = formData.ecosystem;
        submitData.features = formData.features;
        submitData.use_cases = formData.use_cases;
        break;
      case 'language':
        submitData.paradigms = formData.paradigms;
        submitData.compilation_type = formData.compilation_type as 'compiled' | 'interpreted' | 'hybrid';
        submitData.typical_uses = formData.typical_uses;
        break;
      case 'library':
        submitData.dependencies = formData.dependencies;
        submitData.installation = formData.installation;
        submitData.common_uses = formData.common_uses;
        break;
      case 'tool':
        submitData.category = formData.category;
        submitData.integration_points = formData.integration_points;
        submitData.platforms = formData.platforms;
        break;
      case 'database':
        submitData.database_type = formData.database_type as 'sql' | 'nosql' | 'graph' | 'other';
        submitData.features = formData.features;
        submitData.scaling_options = formData.scaling_options;
        break;
      case 'platform':
        submitData.hosting_type = formData.hosting_type as 'cloud' | 'self-hosted' | 'hybrid';
        submitData.services = formData.services;
        submitData.deployment_options = formData.deployment_options;
        break;
    }

    onSubmit(submitData);
  };

  const handleArrayInput = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as TechnologyType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="framework">Framework</SelectItem>
              <SelectItem value="language">Langage</SelectItem>
              <SelectItem value="library">Bibliothèque</SelectItem>
              <SelectItem value="tool">Outil</SelectItem>
              <SelectItem value="database">Base de données</SelectItem>
              <SelectItem value="platform">Plateforme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="website">Site web</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="documentation">Documentation</Label>
          <Input
            id="documentation"
            type="url"
            value={formData.documentation}
            onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
          />
        </div>

        {/* Type-specific fields */}
        {formData.type === 'framework' && (
          <>
            <div>
              <Label htmlFor="ecosystem">Écosystème</Label>
              <Input
                id="ecosystem"
                value={formData.ecosystem}
                onChange={(e) => setFormData({ ...formData, ecosystem: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="features">Fonctionnalités (séparées par des virgules)</Label>
              <Input
                id="features"
                value={formData.features.join(', ')}
                onChange={(e) => handleArrayInput(e.target.value, 'features')}
              />
            </div>
            <div>
              <Label htmlFor="use_cases">Cas d'utilisation (séparés par des virgules)</Label>
              <Input
                id="use_cases"
                value={formData.use_cases.join(', ')}
                onChange={(e) => handleArrayInput(e.target.value, 'use_cases')}
              />
            </div>
          </>
        )}

        {formData.type === 'language' && (
          <>
            <div>
              <Label htmlFor="paradigms">Paradigmes (séparés par des virgules)</Label>
              <Input
                id="paradigms"
                value={formData.paradigms.join(', ')}
                onChange={(e) => handleArrayInput(e.target.value, 'paradigms')}
              />
            </div>
            <div>
              <Label htmlFor="compilation_type">Type de compilation</Label>
              <Select
                value={formData.compilation_type}
                onValueChange={(value) => setFormData({ ...formData, compilation_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compiled">Compilé</SelectItem>
                  <SelectItem value="interpreted">Interprété</SelectItem>
                  <SelectItem value="hybrid">Hybride</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="typical_uses">Utilisations typiques (séparées par des virgules)</Label>
              <Input
                id="typical_uses"
                value={formData.typical_uses.join(', ')}
                onChange={(e) => handleArrayInput(e.target.value, 'typical_uses')}
              />
            </div>
          </>
        )}

        {/* Add similar sections for other types */}
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
          {technology ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
