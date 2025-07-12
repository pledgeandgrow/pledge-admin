'use client';

import { useState, useEffect } from 'react';
import { contactService } from '@/services/contactService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

// Define the Lead interface for the component
interface Lead {
  id?: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  commentaires: string;
  status: "New" | "In Progress" | "Converted" | "Contacted" | "Qualified" | "Lost";
  service: string;
  source?: string;
  probability?: number;
  last_contacted_at?: string;
  next_follow_up?: string;
  estimated_value?: number;
  created_at?: string;
  updated_at?: string;
}

interface EditLeadDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditLeadDialog({ lead, open, onOpenChange }: EditLeadDialogProps) {
  const [editedLead, setEditedLead] = useState<Lead>(lead);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update the form when the lead prop changes
  useEffect(() => {
    setEditedLead(lead);
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedLead.id) return;
    
    setIsSubmitting(true);
    
    try {
      // Split the name into first_name and last_name
      const nameParts = editedLead.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Create contact object from lead form data
      const contactData = {
        id: editedLead.id,
        first_name: firstName,
        last_name: lastName,
        position: editedLead.position,
        company: editedLead.company,
        email: editedLead.email,
        phone: editedLead.phone,
        notes: editedLead.commentaires,
        status: editedLead.status,
        type: 'lead',
        metadata: {
          service: editedLead.service,
          source: editedLead.source || '',
          probability: editedLead.probability || 0,
          last_contacted_at: editedLead.last_contacted_at || new Date().toISOString(),
          next_follow_up: editedLead.next_follow_up || '',
          estimated_value: editedLead.estimated_value || 0
        }
      };
      
      // Update contact in Supabase
      await contactService.updateContact(contactData);
      
      toast({
        title: "Lead mis à jour",
        description: "Le lead a été mis à jour avec succès.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating lead:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du lead.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={editedLead.name}
                onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Poste
              </Label>
              <Input
                id="position"
                value={editedLead.position}
                onChange={(e) => setEditedLead({ ...editedLead, position: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Entreprise
              </Label>
              <Input
                id="company"
                value={editedLead.company}
                onChange={(e) => setEditedLead({ ...editedLead, company: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editedLead.email}
                onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="phone"
                value={editedLead.phone}
                onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={editedLead.status}
                onValueChange={(value) => setEditedLead({ ...editedLead, status: value as Lead['status'] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">Nouveau</SelectItem>
                  <SelectItem value="Contacted">Contacté</SelectItem>
                  <SelectItem value="In Progress">En cours</SelectItem>
                  <SelectItem value="Qualified">Qualifié</SelectItem>
                  <SelectItem value="Converted">Converti</SelectItem>
                  <SelectItem value="Lost">Perdu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Service
              </Label>
              <Input
                id="service"
                value={editedLead.service}
                onChange={(e) => setEditedLead({ ...editedLead, service: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="probability" className="text-right">
                Probabilité (%)
              </Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={editedLead.probability || 0}
                onChange={(e) => setEditedLead({ ...editedLead, probability: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estimated_value" className="text-right">
                Valeur estimée (€)
              </Label>
              <Input
                id="estimated_value"
                type="number"
                min="0"
                value={editedLead.estimated_value || 0}
                onChange={(e) => setEditedLead({ ...editedLead, estimated_value: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commentaires" className="text-right">
                Commentaires
              </Label>
              <Textarea
                id="commentaires"
                value={editedLead.commentaires}
                onChange={(e) => setEditedLead({ ...editedLead, commentaires: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
