import { useState } from 'react';
import { SpecificationType } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SpecificationEditor } from './SpecificationEditor';

interface SpecificationFormProps {
  specification?: SpecificationType | null;
  onSubmit: (data: Partial<SpecificationType>) => void;
  onCancel: () => void;
}

export function SpecificationForm({
  specification,
  onSubmit,
  onCancel,
}: SpecificationFormProps) {
  const [title, setTitle] = useState(specification?.title || '');
  const [content, setContent] = useState(specification?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Titre du cahier des charges"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <SpecificationEditor
        content={content}
        onChange={setContent}
      />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button type="submit">
          {specification ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
