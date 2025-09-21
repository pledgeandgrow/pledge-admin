'use client';

import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { TicketHeader } from '@/components/informatique/support-center/TicketHeader';
import { TicketList } from '@/components/informatique/support-center/TicketList';
import { TicketForm } from '@/components/informatique/support-center/TicketForm';
import { TicketDetail } from '@/components/informatique/support-center/TicketDetail';
import { Data } from '@/types/data';
import { useToast } from '@/components/ui/use-toast';

export default function SupportCenterPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Data | undefined>(undefined);
  const { toast } = useToast();
  
  // Use the useData hook to fetch and manage tickets
  // Using 'documentation' type as a placeholder since 'ticket' is not in DataType
  const { 
    data: tickets = [], 
    loading, 
    error,
    createData,
    updateData
  } = useData('documentation');

  const handleAddTicket = () => {
    setSelectedTicket(undefined);
    setFormOpen(true);
  };

  const handleViewTicket = (ticket: Data) => {
    setSelectedTicket(ticket);
    setDetailOpen(true);
  };

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const updatedTicket = {
        ...ticket,
        metadata: {
          ...ticket.metadata,
          status: newStatus,
          updated_at: new Date().toISOString()
        }
      };

      await updateData(ticketId, updatedTicket);
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut du ticket a été changé en "${newStatus === 'in_progress' ? 'En cours' : 
                                                           newStatus === 'waiting' ? 'En attente' : 
                                                           newStatus === 'resolved' ? 'Résolu' : 
                                                           newStatus === 'closed' ? 'Fermé' : 
                                                           newStatus === 'new' ? 'Nouveau' : 'Ouvert'}"`,
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du ticket",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <TicketHeader 
        title="Centre de Support" 
        subtitle="Gérez les tickets de support et les demandes d'assistance" 
      />
      
      <TicketList 
        tickets={tickets} 
        isLoading={loading} 
        error={error}
        onAddTicket={handleAddTicket}
        onViewTicket={handleViewTicket}
      />

      <TicketForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        initialData={selectedTicket} 
      />

      <TicketDetail 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
        ticket={selectedTicket}
        onUpdateStatus={handleUpdateTicketStatus}
      />
    </div>
  );
}
