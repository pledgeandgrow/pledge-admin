import { useState, useEffect } from 'react';
import { Lead } from '@/types/commercial';
import { useLeadStore } from '@/stores/commercial/leadStore';
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

interface EditLeadDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditLeadDialog({ lead, open, onOpenChange }: EditLeadDialogProps) {
  const [editedLead, setEditedLead] = useState<Lead>(lead);
  const { updateLead } = useLeadStore();

  useEffect(() => {
    setEditedLead(lead);
  }, [lead]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLead(editedLead);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={editedLead.name}
              onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-position">Position</Label>
            <Input
              id="edit-position"
              value={editedLead.position}
              onChange={(e) => setEditedLead({ ...editedLead, position: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-company">Company</Label>
            <Input
              id="edit-company"
              value={editedLead.company}
              onChange={(e) => setEditedLead({ ...editedLead, company: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={editedLead.email}
              onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              type="tel"
              value={editedLead.phone}
              onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-commentaires">Comments</Label>
            <Textarea
              id="edit-commentaires"
              value={editedLead.commentaires}
              onChange={(e) => setEditedLead({ ...editedLead, commentaires: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={editedLead.status}
              onValueChange={(value) => setEditedLead({ ...editedLead, status: value as Lead['status'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-service">Service</Label>
            <Input
              id="edit-service"
              value={editedLead.service}
              onChange={(e) => setEditedLead({ ...editedLead, service: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
