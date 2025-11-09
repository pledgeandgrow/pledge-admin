'use client';

import { useState } from 'react';
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

// Define the Lead form interface
interface LeadFormData {
  first_name: string;
  last_name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  status: string;
  lead_source: string;
  probability: number;
  estimated_value: number;
}

const initialLead: LeadFormData = {
  first_name: '',
  last_name: '',
  position: '',
  company: '',
  email: '',
  phone: '',
  notes: '',
  status: 'new',
  lead_source: '',
  probability: 0,
  estimated_value: 0
};

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateLead?: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => Promise<Lead>;
}

export function AddLeadDialog({ open, onOpenChange, onCreateLead }: AddLeadDialogProps) {
  const [newLead, setNewLead] = useState<LeadFormData>(initialLead);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create lead object
      const leadData = {
        first_name: newLead.first_name,
        last_name: newLead.last_name,
        position: newLead.position,
        company: newLead.company,
        email: newLead.email,
        phone: newLead.phone,
        notes: newLead.notes,
        status: newLead.status,
        type: 'lead' as const,
        lead_source: newLead.lead_source,
        probability: newLead.probability,
        estimated_value: newLead.estimated_value,
        last_contacted_at: new Date().toISOString(),
        metadata: {}
      };
      
      // Add lead to Supabase
      if (onCreateLead) {
        await onCreateLead(leadData);
      }
      
      toast({
        title: "Lead added",
        description: "The lead has been added successfully.",
      });
      
      setNewLead(initialLead);
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding lead:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the lead.",
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
            Add New Lead
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name*</Label>
                <Input
                  id="first_name"
                  value={newLead.first_name}
                  onChange={(e) => setNewLead({ ...newLead, first_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name*</Label>
                <Input
                  id="last_name"
                  value={newLead.last_name}
                  onChange={(e) => setNewLead({ ...newLead, last_name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newLead.position}
                  onChange={(e) => setNewLead({ ...newLead, position: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status*</Label>
                <Select
                  value={newLead.status}
                  onValueChange={(value) => setNewLead({ ...newLead, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="lead_source">Lead Source</Label>
                <Input
                  id="lead_source"
                  value={newLead.lead_source}
                  onChange={(e) => setNewLead({ ...newLead, lead_source: e.target.value })}
                  placeholder="e.g., Website, Referral, Event"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={newLead.probability}
                  onChange={(e) => setNewLead({ ...newLead, probability: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="estimated_value">Estimated Value ($)</Label>
                <Input
                  id="estimated_value"
                  type="number"
                  min="0"
                  value={newLead.estimated_value}
                  onChange={(e) => setNewLead({ ...newLead, estimated_value: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newLead.notes}
                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                rows={3}
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
              {isSubmitting ? 'Adding...' : 'Add Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
