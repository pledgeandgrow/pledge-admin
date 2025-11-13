'use client';

import { useState, useEffect } from 'react';
import { type Lead } from '@/hooks/useLeads';
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

// UI Lead interface
interface UILead {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  commentaires: string;
  status: string;
  source?: string;
  probability?: number;
  last_contacted_at?: string;
  next_follow_up?: string;
  estimated_value?: number;
  created_at: string;
  updated_at: string;
}

interface EditLeadDialogProps {
  lead: UILead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateLead?: (id: string, updates: Partial<Lead>) => Promise<Lead>;
}

export function EditLeadDialog({ lead, open, onOpenChange, onUpdateLead }: EditLeadDialogProps) {
  const [editedLead, setEditedLead] = useState<UILead>(lead);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update the form when the lead prop changes
  useEffect(() => {
    setEditedLead(lead);
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedLead.id) {return;}
    
    // Validate required fields
    if (!editedLead.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Split the name into first_name and last_name
      const nameParts = editedLead.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Create lead update object
      const leadData: Record<string, unknown> = {
        first_name: firstName,
        last_name: lastName,
        position: editedLead.position?.trim() || null,
        company: editedLead.company?.trim() || null,
        email: editedLead.email?.trim() || null,
        phone: editedLead.phone?.trim() || null,
        notes: editedLead.commentaires?.trim() || null,
        status: editedLead.status,
        lead_source: editedLead.source?.trim() || null,
        probability: editedLead.probability || null,
        estimated_value: editedLead.estimated_value || null,
      };
      
      // Only add timestamps if they have valid values
      if (editedLead.last_contacted_at) {
        leadData.last_contacted_at = editedLead.last_contacted_at;
      }
      if (editedLead.next_follow_up) {
        leadData.next_follow_up = editedLead.next_follow_up;
      }
      
      // Update lead in Supabase
      if (onUpdateLead) {
        await onUpdateLead(editedLead.id, leadData);
        
        // Success - close dialog
        onOpenChange(false);
        
        toast({
          title: "Lead updated",
          description: `${firstName} ${lastName} has been updated successfully.`,
        });
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while updating the lead.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Edit Lead
          </DialogTitle>
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
                onValueChange={(value) => setEditedLead({ ...editedLead, status: value })}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source">Lead Source</Label>
                <Input
                  id="source"
                  value={editedLead.source || ''}
                  onChange={(e) => setEditedLead({ ...editedLead, source: e.target.value })}
                  placeholder="e.g., Website, Referral, Event"
                />
              </div>
              <div>
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={editedLead.probability || 0}
                  onChange={(e) => setEditedLead({ ...editedLead, probability: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimated_value">Estimated Value ($)</Label>
                <Input
                  id="estimated_value"
                  type="number"
                  min="0"
                  value={editedLead.estimated_value || 0}
                  onChange={(e) => setEditedLead({ ...editedLead, estimated_value: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="next_follow_up">Next Follow-up</Label>
                <Input
                  id="next_follow_up"
                  type="date"
                  value={editedLead.next_follow_up ? new Date(editedLead.next_follow_up).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditedLead({ ...editedLead, next_follow_up: e.target.value })}
                />
              </div>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting ? 'Updating...' : 'Update Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
