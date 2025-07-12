'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';
import { contactService } from '@/services/contactService';
import { toast } from '@/components/ui/use-toast';

// Define the Lead interface for the table
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

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  getStatusColor: (status: string) => string;
}

export function LeadTable({ leads, onEdit, getStatusColor }: LeadTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    
    setIsDeleting(id);
    try {
      await contactService.deleteContact(id);
      toast({
        title: "Lead supprimé",
        description: "Le lead a été supprimé avec succès.",
      });
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du lead.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Entreprise</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Service</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Aucun lead trouvé
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell>{lead.service}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(lead)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => lead.id && handleDelete(lead.id)}
                        disabled={isDeleting === lead.id}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        {isDeleting === lead.id ? 'Suppression...' : 'Supprimer'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
