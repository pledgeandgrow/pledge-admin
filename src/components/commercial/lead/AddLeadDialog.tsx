'use client';

import { useState } from 'react';
import { contactService } from '@/services/contactService';
import { ContactType } from '@/types/contact';
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

// Define the Lead interface for the form
interface LeadFormData {
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  commentaires: string;
  status: "New" | "In Progress" | "Converted" | "Contacted" | "Qualified" | "Lost";
  service: string;
}

const initialLead: LeadFormData = {
  name: '',
  position: '',
  company: '',
  email: '',
  phone: '',
  commentaires: '',
  status: 'New',
  service: ''
};

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLeadDialog({ open, onOpenChange }: AddLeadDialogProps) {
  const [newLead, setNewLead] = useState<LeadFormData>(initialLead);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Split the name into first_name and last_name
      const nameParts = newLead.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Create contact object from lead form data
      const contactData = {
        first_name: firstName,
        last_name: lastName,
        position: newLead.position,
        company: newLead.company,
        email: newLead.email,
        phone: newLead.phone,
        notes: newLead.commentaires,
        status: newLead.status,
        type: 'lead' as ContactType,
        metadata: {
          service: newLead.service,
          source: '',
          probability: 0,
          last_contacted_at: new Date().toISOString(),
          next_follow_up: '',
          estimated_value: 0
        }
      };
      
      // Add contact to Supabase
      await contactService.addContact(contactData);
      
      toast({
        title: "Lead ajouté",
        description: "Le lead a été ajouté avec succès.",
      });
      
      setNewLead(initialLead);
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding lead:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du lead.",
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
          <DialogTitle>Ajouter un Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
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
                value={newLead.position}
                onChange={(e) => setNewLead({ ...newLead, position: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Entreprise
              </Label>
              <Input
                id="company"
                value={newLead.company}
                onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
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
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="phone"
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={newLead.status}
                onValueChange={(value) => setNewLead({ ...newLead, status: value as LeadFormData['status'] })}
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
                value={newLead.service}
                onChange={(e) => setNewLead({ ...newLead, service: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commentaires" className="text-right">
                Commentaires
              </Label>
              <Textarea
                id="commentaires"
                value={newLead.commentaires}
                onChange={(e) => setNewLead({ ...newLead, commentaires: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
