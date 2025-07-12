'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WaitlistContact } from '@/types/contact';
import { Trash } from 'lucide-react';

interface EditWaitlistDialogProps {
  entry?: WaitlistContact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: Partial<WaitlistContact>) => void;
  onDelete?: () => void;
}

export function EditWaitlistDialog({
  entry,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: EditWaitlistDialogProps) {
  const isEditing = !!entry;

  const [formData, setFormData] = useState<Partial<WaitlistContact>>(
    entry || {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      service: '',
      status: 'Pending',
      type: 'waitlist',
      joined_at: new Date().toISOString(),
      notes: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {isEditing ? 'Modifier la demande' : 'Nouvelle demande'}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input
                  value={formData.first_name}
                  onChange={e => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="Prénom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  value={formData.last_name}
                  onChange={e => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Nom de famille"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+33 6 12 34 56 78"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Service demandé</Label>
              <Input
                value={formData.service}
                onChange={e => setFormData(prev => ({ ...prev, service: e.target.value }))}
                placeholder="Nom du service"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={value => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">En attente</SelectItem>
                    <SelectItem value="Contacted">Contacté</SelectItem>
                    <SelectItem value="Scheduled">Planifié</SelectItem>
                    <SelectItem value="Cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date souhaitée</Label>
                <Input
                  type="date"
                  value={formData.joined_at ? new Date(formData.joined_at).toISOString().split('T')[0] : ''}
                  onChange={e => setFormData(prev => ({ ...prev, joined_at: new Date(e.target.value).toISOString() }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Informations supplémentaires..."
                className="h-32"
              />
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
